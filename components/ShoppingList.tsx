
import React, { useMemo } from 'react';
import { Ingredient } from '../types';
import { Check, Trash2, ShoppingBasket, X } from 'lucide-react';

interface ShoppingListProps {
  ingredients: Ingredient[];
  onToggleItem: (index: number) => void;
  onClearList: () => void;
  onRemoveItem: (index: number) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ 
  ingredients, 
  onToggleItem, 
  onClearList,
  onRemoveItem
}) => {
  
  const groupedIngredients = useMemo(() => {
    const groups: Record<string, { item: Ingredient; originalIndex: number }[]> = {
      'Produce': [],
      'Meat': [],
      'Dairy': [],
      'Pantry': [],
      'Other': []
    };

    ingredients.forEach((ing, idx) => {
      const cat = ing.category || 'Other';
      if (groups[cat]) {
        groups[cat].push({ item: ing, originalIndex: idx });
      } else {
        groups['Other'].push({ item: ing, originalIndex: idx });
      }
    });

    return groups;
  }, [ingredients]);

  const totalCount = ingredients.length;
  const checkedCount = ingredients.filter(i => i.checked).length;
  const progress = totalCount === 0 ? 0 : (checkedCount / totalCount) * 100;

  if (ingredients.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBasket className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">Your basket is empty</h3>
        <p className="max-w-xs">Add recipes to your shopping list to generate an organized checklist here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Shopping List</h2>
          <p className="text-slate-500 text-sm mt-1">{checkedCount} of {totalCount} items checked</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={onClearList}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear List"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-8">
        {/* Fix: Explicitly cast Object.entries result to resolve 'unknown' type inference on items */}
        {(Object.entries(groupedIngredients) as [string, { item: Ingredient; originalIndex: number }[]][]).map(([category, items]) => {
          if (items.length === 0) return null;
          
          return (
            <div key={category} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                {category}
              </h3>
              <div className="space-y-3">
                {items.map(({ item, originalIndex }) => (
                  <div 
                    key={`${item.item}-${originalIndex}`}
                    className={`group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                      item.checked ? 'bg-slate-50 opacity-60' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => onToggleItem(originalIndex)}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      item.checked 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : 'border-slate-300 group-hover:border-emerald-400'
                    }`}>
                      {item.checked && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    
                    <div className="flex-1">
                      <p className={`font-medium text-slate-800 ${item.checked ? 'line-through text-slate-400' : ''}`}>
                        {item.item}
                      </p>
                      <p className="text-sm text-slate-500">{item.amount}</p>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(originalIndex);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
