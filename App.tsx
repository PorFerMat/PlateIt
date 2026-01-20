import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Plus, 
  ShoppingBasket, 
  BookOpen,
  Crown,
  Sparkles
} from 'lucide-react';
import { Recipe, ViewState, Ingredient } from './types';
import { RecipeCard } from './components/RecipeCard';
import { AddRecipeModal } from './components/AddRecipeModal';
import { RecipeDetail } from './components/RecipeDetail';
import { ShoppingList } from './components/ShoppingList';
import { SubscriptionModal } from './components/SubscriptionModal';
import { Purchases } from './services/revenueCat';

const RECIPE_LIMIT = 3;

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>('DASHBOARD');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<Ingredient[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [shoppingListRecipeIds, setShoppingListRecipeIds] = useState<string[]>([]);
  const [isPro, setIsPro] = useState(false);

  // Initialize RevenueCat and Entitlements
  useEffect(() => {
    const initMonetization = async () => {
      try {
        await Purchases.initialize();
        const info = await Purchases.getCustomerInfo();
        // Check if the 'pro_access' entitlement is active
        const hasAccess = Object.keys(info.entitlements.active).includes('pro_access');
        setIsPro(hasAccess);
      } catch (e) {
        console.error("Failed to initialize monetization", e);
      }
    };

    initMonetization();
  }, []);

  // Load state from local storage on mount
  useEffect(() => {
    const savedRecipes = localStorage.getItem('plateit_recipes');
    const savedList = localStorage.getItem('plateit_list');
    const savedListIds = localStorage.getItem('plateit_list_ids');

    if (savedRecipes) {
      try {
        setRecipes(JSON.parse(savedRecipes));
      } catch (e) {
        console.error("Failed to parse saved recipes", e);
      }
    }

    if (savedList) {
      try {
        setShoppingList(JSON.parse(savedList));
      } catch (e) {
        console.error("Failed to parse shopping list", e);
      }
    }

    if (savedListIds) {
      try {
        setShoppingListRecipeIds(JSON.parse(savedListIds));
      } catch (e) {
        console.error("Failed to parse list IDs", e);
      }
    }
  }, []);

  // Save state updates
  useEffect(() => {
    localStorage.setItem('plateit_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('plateit_list', JSON.stringify(shoppingList));
    localStorage.setItem('plateit_list_ids', JSON.stringify(shoppingListRecipeIds));
  }, [shoppingList, shoppingListRecipeIds]);

  const handleAddButtonClick = () => {
    if (!isPro && recipes.length >= RECIPE_LIMIT) {
      setIsSubscriptionModalOpen(true);
    } else {
      setIsAddModalOpen(true);
    }
  };

  const handleAddRecipe = (newRecipe: Recipe) => {
    setRecipes(prev => [newRecipe, ...prev]);
  };

  const addToShoppingList = (recipe: Recipe) => {
    if (shoppingListRecipeIds.includes(recipe.id)) return;

    setShoppingListRecipeIds(prev => [...prev, recipe.id]);
    
    // Add ingredients to the main list
    const newIngredients = recipe.ingredients.map(ing => ({
      ...ing,
      checked: false
    }));
    
    setShoppingList(prev => [...prev, ...newIngredients]);
  };

  const toggleIngredientCheck = (index: number) => {
    setShoppingList(prev => {
      const newList = [...prev];
      newList[index] = { ...newList[index], checked: !newList[index].checked };
      return newList;
    });
  };

  const removeIngredient = (index: number) => {
    setShoppingList(prev => prev.filter((_, i) => i !== index));
  };

  const clearShoppingList = () => {
    setShoppingList([]);
    setShoppingListRecipeIds([]);
  };

  const renderContent = () => {
    if (activeView === 'SHOPPING_LIST') {
      return (
        <ShoppingList 
          ingredients={shoppingList}
          onToggleItem={toggleIngredientCheck}
          onClearList={clearShoppingList}
          onRemoveItem={removeIngredient}
        />
      );
    }

    if (activeView === 'RECIPE_DETAIL' && selectedRecipe) {
      return (
        <RecipeDetail 
          recipe={selectedRecipe} 
          onBack={() => {
            setSelectedRecipe(null);
            setActiveView('DASHBOARD');
          }}
        />
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">What's Cooking?</h1>
            <p className="text-slate-500">
              {isPro ? 'Turn your inspiration into dinner.' : `${recipes.length} / ${RECIPE_LIMIT} free recipes used.`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isPro && (
              <button 
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all font-bold"
              >
                <Crown className="w-5 h-5" />
                Upgrade to Pro
              </button>
            )}
            <button 
              onClick={handleAddButtonClick}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all font-bold ${
                !isPro && recipes.length >= RECIPE_LIMIT
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg'
              }`}
            >
              {!isPro && recipes.length >= RECIPE_LIMIT ? <Crown className="w-5 h-5" /> : <Plus className="w-5 h-5" />} 
              {(!isPro && recipes.length >= RECIPE_LIMIT) ? 'Unlock Unlimited' : 'Add Recipe'}
            </button>
          </div>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
             <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
               <BookOpen className="w-8 h-8 text-slate-300" />
             </div>
             <h3 className="text-lg font-medium text-slate-600 mb-2">No recipes yet</h3>
             <p className="text-slate-400 mb-6">Add a recipe from a URL to get started.</p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <button 
                onClick={handleAddButtonClick}
                className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all"
               >
                 Add your first recipe
               </button>
               {!isPro && (
                 <button 
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="flex items-center gap-2 text-amber-600 font-bold hover:underline px-4 py-2"
                 >
                   <Crown className="w-4 h-4" />
                   Go Pro for Unlimited Storage
                 </button>
               )}
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map(recipe => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onClick={(r) => {
                  setSelectedRecipe(r);
                  setActiveView('RECIPE_DETAIL');
                }}
                onAddToShoppingList={addToShoppingList}
                isInShoppingList={shoppingListRecipeIds.includes(recipe.id)}
              />
            ))}
            
            {/* Upsell Card for Free Users */}
            {!isPro && recipes.length > 0 && (
               <div 
                 onClick={() => setIsSubscriptionModalOpen(true)}
                 className="group bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-dashed border-amber-200 hover:border-amber-400 transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] cursor-pointer p-6 text-center"
               >
                 <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform text-amber-500">
                   <Crown className="w-8 h-8" />
                 </div>
                 <h3 className="font-bold text-slate-800 text-lg">Go Unlimited</h3>
                 <p className="text-slate-500 text-sm mt-2 mb-6">
                   You've reached your free limit of {RECIPE_LIMIT} recipes. 
                   Unlock the full power of PlateIt Pro today.
                 </p>
                 <span className="px-6 py-2 bg-amber-500 text-white rounded-full font-bold shadow-md shadow-amber-200 group-hover:bg-amber-600 transition-colors">
                   Unlock Now
                 </span>
               </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('DASHBOARD')}>
              <div className="bg-red-600 p-2 rounded-lg">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-rose-500">
                PlateIt
              </span>
              {isPro && (
                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Pro
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <button 
                onClick={() => setActiveView('DASHBOARD')}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  activeView === 'DASHBOARD' ? 'text-red-700' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Recipes</span>
              </button>
              
              <button 
                onClick={() => setActiveView('SHOPPING_LIST')}
                className={`relative flex items-center gap-2 text-sm font-medium transition-colors ${
                  activeView === 'SHOPPING_LIST' ? 'text-red-700' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShoppingBasket className="w-4 h-4" />
                <span className="hidden sm:inline">Shopping List</span>
                {shoppingList.length > 0 && (
                   <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                     {shoppingList.filter(i => !i.checked).length}
                   </span>
                )}
              </button>

              {!isPro && (
                <button 
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-amber-200 transition-colors"
                >
                  <Crown className="w-3 h-3" />
                  <span className="hidden xs:inline">Go Pro</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-6 right-6 md:hidden z-30 flex flex-col gap-3">
        {!isPro && (
          <button 
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="bg-amber-500 text-white p-4 rounded-full shadow-lg shadow-amber-400/50 active:scale-95 transition-transform"
          >
            <Crown className="w-6 h-6" />
          </button>
        )}
        <button 
          onClick={handleAddButtonClick}
          className={`${!isPro && recipes.length >= RECIPE_LIMIT ? 'bg-amber-600' : 'bg-slate-900'} text-white p-4 rounded-full shadow-lg shadow-slate-400/50 active:scale-95 transition-transform`}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <AddRecipeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onRecipeAdded={handleAddRecipe}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onSubscribe={() => setIsPro(true)}
      />
    </div>
  );
};

export default App;