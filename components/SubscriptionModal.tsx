import React, { useState } from 'react';
import { X, Crown, CheckCircle2, Star, Sparkles } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setIsLoading(true);
    // Simulate API call to RevenueCat
    setTimeout(() => {
      onSubscribe();
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        <div className="bg-[#1a2e35] text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-emerald-400 to-transparent animate-spin-slow"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-300 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30 transform rotate-3">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">PlateIt Pro</h2>
            <p className="text-emerald-100">Unlock your full culinary potential</p>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-2 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Unlimited Recipes</h4>
                <p className="text-sm text-slate-500">Store more than 3 recipes</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-2 rounded-full">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Advanced AI Parsing</h4>
                <p className="text-sm text-slate-500">Better accuracy for complex blogs</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="bg-emerald-100 p-2 rounded-full">
                <Star className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Support Development</h4>
                <p className="text-sm text-slate-500">Help us keep cooking</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-lg shadow-lg shadow-emerald-200 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Unlock for $4.99/mo'}
          </button>
          
          <p className="text-center text-xs text-slate-400 mt-4">
            Powered by RevenueCat. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};