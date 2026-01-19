# PlateIt - From Inspiration to Dinner Table

PlateIt is a culinary assistant app designed to bridge the gap between finding a recipe and actually cooking it. It uses AI to parse recipes from unstructured text or URLs, organizes ingredients into a categorized shopping list, and provides a clear, focused cooking mode.

## App Requirements & Specifications

### 1. Platform & Compatibility
*   **Web-First Architecture:** Built using React 19, TypeScript, and TailwindCSS for maximum responsiveness.
*   **Mobile-Ready:** Fully responsive PWA-ready design. Works on iOS Safari and Android Chrome.
*   **Note on Native Deployment:** This project provides the web source code. To deploy to TestFlight (iOS) or Google Play Console, this codebase must be wrapped using **Capacitor** or **Ionic**.

### 2. Monetization
*   **Freemium Model:** The app implements a strict freemium model.
*   **Free Tier:**
    *   Limit of 3 saved recipes.
    *   Basic AI parsing.
*   **Pro Tier (PlateIt Pro):**
    *   Unlimited recipe storage.
    *   Advanced Parsing priority.
    *   $4.99/month price point.
*   **Implementation:** The current codebase simulates the UI and state management for a subscription system (mocking RevenueCat behavior).

### 3. Core Functionality
*   **AI Recipe Extraction:** Uses Google Gemini API to parse ingredients and instructions from raw text or URLs.
*   **Smart Shopping List:** Automatically categorizes ingredients (Produce, Dairy, Meat, Pantry) for efficient shopping.
*   **Cooking Mode:** Distraction-free view of ingredients and step-by-step instructions.

### 4. Audience Fit
*   **Target User:** Home cooks who save recipes on Instagram/TikTok/Blogs but never make them because the data is unorganized.
*   **Solution:** Removes friction by converting "content" into "actionable lists".

---

# User Manual

## Getting Started

### 1. Adding a Recipe
1.  Click the **Add Recipe** button (or the + icon on mobile).
2.  **Via URL:** Paste a link to a recipe blog, YouTube video, or social media post.
3.  **Via Text:** Paste the raw text of a recipe.
4.  Click **Magic Extract**. PlateIt uses AI to format the recipe into a clean card.

### 2. Managing Your Shopping List
1.  On the Dashboard, find a recipe you want to cook.
2.  Click **Add to Shopping List**.
3.  Navigate to the **Shopping List** tab.
4.  Ingredients are sorted by aisle (Produce, Meat, etc.).
5.  Tap items to check them off as you shop.

### 3. Cooking
1.  Click on any recipe card to open **Recipe Detail**.
2.  View prep time, servings, and a clear list of ingredients.
3.  Follow the numbered instructions to cook your meal.

## PlateIt Pro Subscription

**Why Upgrade?**
The free version allows you to store up to **3 recipes** at a time to try out the service. To build a personal cookbook of unlimited favorites, upgrade to PlateIt Pro.

**How to Upgrade:**
1.  Attempt to add a 4th recipe.
2.  The subscription window will appear.
3.  Click "Unlock for $4.99/mo". (Note: In this demo version, this transaction is simulated).

## Troubleshooting

*   **"Could not extract recipe":** The AI might struggle with very short or unclear text. Try pasting the full ingredient list and instructions manually.
*   **Shopping List Sync:** Data is saved to your browser's local storage. Clearing cache will remove your recipes.

---

## Developer Setup

### Prerequisites
*   Node.js & npm
*   Google Gemini API Key

### Installation
1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Set your environment variable: `export API_KEY="your_gemini_key"`
4.  Run local server: `npm start`
