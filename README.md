# PlateIt - Requirement Specification & User Manual

## 📋 App Requirements Specification

### 1. Platform Requirements
*   **Target Environments**: iOS (TestFlight) & Android (Google Play).
*   **Architecture**: Built as a responsive React PWA. To reach native stores, this codebase is designed to be bundled with **Capacitor**.
*   **Offline Support**: Local storage caching enabled for recipes and shopping lists.

### 2. Monetization (RevenueCat)
*   **SDK Integration**: The app features a `SubscriptionModal` that mocks the RevenueCat transaction flow.
*   **Subscription Tier**: "PlateIt Pro" ($4.99/mo).
*   **Gating Logic**: Free users are limited to **3 recipes**. Attempting to add a 4th triggers the Pro unlock flow.
*   **Pro Features**: Unlimited recipe storage, priority AI processing, and ad-free experience.

### 3. Core Functionality
*   **AI Extraction**: Powered by Gemini-3-Flash. Supports parsing raw text (copy-pasted) or URLs (web scraping via Google Search tool).
*   **Dynamic Categorization**: AI categorizes ingredients into grocery store aisles automatically.
*   **Checked Persistence**: Shopping list items stay checked even after app restarts.

---

## 📖 User Manual

### Welcome to PlateIt
PlateIt is designed for the modern home cook who finds inspiration on social media but forgets to actually make the food. We turn "inspiration" into "action."

### Step 1: Adding Your First Recipe
1.  **Open the Add Modal**: Tap the `+` button on your dashboard.
2.  **Paste Source**: You can paste a direct URL (e.g., a food blog or YouTube link) or simply paste the raw text of a recipe you have in your notes.
3.  **Magic Extract**: Tap "Magic Extract". Our AI will read the content, find the ingredients, and organize them.

### Step 2: Shopping Made Easy
1.  On any recipe card, tap **Add to Shopping List**.
2.  Go to the **Shopping List** tab in the navigation bar.
3.  Your items are automatically grouped by aisle (Produce, Meat, Dairy, etc.).
4.  As you shop, tap an item to check it off.

### Step 3: Cooking Mode
1.  Tap on any recipe on your dashboard to see the **Full Detail**.
2.  View the ingredients and the step-by-step instructions.
3.  Instructions are clearly numbered and easy to read while your hands are busy in the kitchen.

### Managing Your Pro Subscription
*   If you love the app and want to save more than 3 recipes, you can upgrade to **PlateIt Pro**.
*   Tap the **Crown** icon or wait for the prompt when you hit your free limit.
*   Once upgraded, you'll see the "Pro" badge in the navigation header, indicating unlimited access.

---

## 🛠 Developer Setup
*   **API Configuration**: Ensure `process.env.API_KEY` is set with a valid Google Gemini API Key.
*   **Framework**: React 19 + TypeScript.
*   **Styling**: Tailwind CSS for responsive utility-first design.
*   **Build**: `npm run build` for production-ready assets.
