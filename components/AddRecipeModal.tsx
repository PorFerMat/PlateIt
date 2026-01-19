import React, { useState } from 'react';
import { X, Loader2, Sparkles, Link as LinkIcon, FileText } from 'lucide-react';
import { parseRecipeFromInput } from '../services/geminiService';
import { Recipe } from '../types';

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecipeAdded: (recipe: Recipe) => void;
}

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ isOpen, onClose, onRecipeAdded }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'url' | 'text'>('url');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await parseRecipeFromInput(input);
      
      if (result && result.recipe) {
        const newRecipe: Recipe = {
          ...result.recipe,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          // Fallback image if AI doesn't find one
          imageUrl: result.recipe.imageUrl || `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 100)}` 
        };
        onRecipeAdded(newRecipe);
        onClose();
        setInput('');
      } else {
        setError("Could not extract recipe details. Please try being more specific or using a different link.");
      }
    } catch (err) {
      setError("An error occurred while communicating with the AI chef.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-emerald-700">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-xl font-bold">Add New Recipe</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode('url')}
              className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                mode === 'url' 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium' 
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              Recipe Link
            </button>
            <button
              onClick={() => setMode('text')}
              className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                mode === 'text' 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium' 
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              Paste Text
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {mode === 'url' ? 'Paste the recipe URL (YouTube, Blog, etc.)' : 'Paste the full recipe text here'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'url' ? "https://..." : "Ingredients:\n...\nInstructions:\n..."}
                className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none resize-none transition-all"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Magic Extract
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-slate-50 p-4 text-xs text-center text-slate-400 border-t border-slate-100">
          Powered by Gemini AI. Extracts ingredients and steps automatically.
        </div>
      </div>
    </div>
  );
};
