import React from 'react';
import { Recipe } from '../types';
import { ArrowLeft, Clock, Users, ExternalLink, ChefHat, Tag } from 'lucide-react';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-300">
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <div className="p-2 bg-white rounded-full border border-slate-200 group-hover:border-slate-300 shadow-sm">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="font-medium">Back to recipes</span>
      </button>

      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        {/* Header Image */}
        <div className="relative h-80 w-full">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white w-full">
            <h1 className="text-4xl font-bold mb-4 leading-tight">{recipe.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" />
                {recipe.prepTime}
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                <Users className="w-4 h-4" />
                {recipe.servings}
              </div>
              {recipe.sourceUrl && (
                <a 
                  href={recipe.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-red-600/90 hover:bg-red-500 backdrop-blur-md px-3 py-1.5 rounded-full transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Source
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-[1fr,1.5fr] gap-12">
          {/* Ingredients Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-red-800 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <ChefHat className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold">Ingredients</h2>
            </div>
            
            <ul className="space-y-4">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 pb-3 border-b border-slate-50 last:border-0">
                  <span className="w-1.5 h-1.5 mt-2 bg-red-400 rounded-full flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">{ing.amount}</span>
                    <span className="mx-1"></span>
                    <span>{ing.item}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-6">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Tags</h3>
               <div className="flex flex-wrap gap-2">
                 {recipe.tags.map(tag => (
                   <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full flex items-center gap-1">
                     <Tag className="w-3 h-3" /> {tag}
                   </span>
                 ))}
               </div>
            </div>
          </div>

          {/* Instructions Column */}
          <div>
             <div className="flex items-center gap-3 text-red-800 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <ChefHat className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold">Instructions</h2>
            </div>

            <div className="space-y-8">
              {recipe.instructions.map((step, idx) => (
                <div key={idx} className="group flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold group-hover:bg-red-500 group-hover:text-white transition-colors">
                    {step.step}
                  </div>
                  <p className="text-slate-600 leading-relaxed pt-1">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};