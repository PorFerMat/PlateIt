import React from 'react';
import { Recipe } from '../types';
import { Clock, Users, ChevronRight } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
  onAddToShoppingList: (recipe: Recipe) => void;
  isInShoppingList: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, onAddToShoppingList, isInShoppingList }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onClick(recipe)}>
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white text-sm font-medium flex items-center gap-1">
            View Details <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1 cursor-pointer" onClick={() => onClick(recipe)}>
          <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
            {recipe.title}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 mb-4">
            {recipe.description || "No description available."}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {recipe.prepTime || '--'}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {recipe.servings || '--'}
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToShoppingList(recipe);
          }}
          className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
            isInShoppingList
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-500 hover:text-emerald-600'
          }`}
        >
          {isInShoppingList ? 'Added to List' : 'Add to Shopping List'}
        </button>
      </div>
    </div>
  );
};
