import { GoogleGenAI, Type } from "@google/genai";
import { AIParseResponse } from "../types";

export const parseRecipeFromInput = async (input: string): Promise<AIParseResponse | null> => {
  try {
    // Initialize the Gemini client
    // Note: In a real production app, you should proxy these requests through a backend
    // to avoid exposing the API key if this were client-facing only.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const isUrl = input.trim().startsWith('http');
    
    let prompt = `
      You are an expert culinary assistant. 
      Extract structured recipe data from the following input. 
      Normalize ingredient names (e.g., "2 large onions, chopped" -> item: "Onion", amount: "2 large", category: "Produce").
      If the input is a URL, use the Google Search tool to find the recipe details.
      If the input is raw text, parse it directly.
      Ensure the output matches the JSON schema provided exactly.
      
      Input: "${input}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: isUrl ? [{ googleSearch: {} }] : [],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipe: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                prepTime: { type: Type.STRING },
                servings: { type: Type.STRING },
                imageUrl: { type: Type.STRING, description: "A relevant image URL found during search, or leave empty if none." },
                sourceUrl: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                ingredients: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      item: { type: Type.STRING },
                      amount: { type: Type.STRING },
                      category: { 
                        type: Type.STRING, 
                        enum: ['Produce', 'Dairy', 'Meat', 'Pantry', 'Other'] 
                      },
                    }
                  }
                },
                instructions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      step: { type: Type.INTEGER },
                      text: { type: Type.STRING }
                    }
                  }
                }
              },
              required: ['title', 'ingredients', 'instructions']
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as AIParseResponse;
  } catch (error) {
    console.error("Error parsing recipe with Gemini:", error);
    throw new Error("Failed to process recipe. Please try again.");
  }
};