import { GoogleGenAI, Type } from "@google/genai";
import { AIParseResponse } from "../types";

export const parseRecipeFromInput = async (input: string): Promise<AIParseResponse | null> => {
  try {
    // Initialize the Gemini client with the latest API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const isUrl = input.trim().startsWith('http');
    
    // Enhanced prompt focusing on specific extraction and fidelity to the source
    let prompt = `
      You are an elite culinary data scientist. 
      Your task is to extract highly accurate, structured recipe data from the provided input.

      STRICT FIDELITY RULES:
      1. If the input is a URL (especially YouTube), use Google Search to find the EXACT ingredients and steps used in that specific content.
      2. Do NOT provide a generic or "popular" version of the dish. It MUST match the creator's specific measurements and methods.
      3. Look for transcripts, video descriptions, and comments to verify quantities.
      4. Normalize ingredient names into categories (Produce, Dairy, Meat, Pantry, Other).
      5. If quantities are mentioned (e.g., "a pinch", "3 cloves"), include them exactly in the 'amount' field.

      Input Source: "${input}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        // Use Google Search for URL grounding to get real-time video/blog data
        tools: isUrl ? [{ googleSearch: {} }] : [],
        // Enable thinking budget for complex reasoning tasks (extracting from unstructured sources)
        thinkingConfig: { thinkingBudget: 8192 },
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
                imageUrl: { type: Type.STRING, description: "A relevant high-quality image URL from the source." },
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

    // The response might contain markdown blocks, we need to handle that if necessary, 
    // but with responseMimeType: "application/json", it should be clean.
    return JSON.parse(text) as AIParseResponse;
  } catch (error) {
    console.error("Error parsing recipe with Gemini Pro:", error);
    throw new Error("Failed to process the recipe. Gemini Pro could not find high-fidelity data for this link.");
  }
};
