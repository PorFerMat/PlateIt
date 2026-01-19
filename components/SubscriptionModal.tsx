import React, { useState, useEffect } from 'react';
import { X, Crown, CheckCircle2, Star, Sparkles, CreditCard, Wallet, Check, Loader2, PartyPopper } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

type PaymentMethod = 'CARD' | 'PAYPAL' | 'APPLE_GOOGLE';

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('CARD');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });

  // Reset states whenever modal opens/closes to ensure the button is re-activated correctly
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      setIsSuccess(false);
      setCardDetails({ number: '', expiry: '', cvc: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    // CRITICAL: Immediately check if loading to prevent double-click race condition
    if (isLoading || isSuccess) return; 
    
    setIsLoading(true);
    
    // Simulate real-world payment processing sequence
    setTimeout(() => {
      setIsSuccess(true);
      setIsLoading(false);
      
      // Delay closing to show the success state
      setTimeout(() => {
        onSubscribe();
        onClose();
      }, 2000);
    }, 2800);
  };

  const isFormValid = () => {
    if (selectedMethod !== 'CARD') return true;
    return cardDetails.number.trim().length > 10 && cardDetails.expiry.trim().length > 3 && cardDetails.cvc.trim().length > 2;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 relative max-h-[90vh] flex flex-col">
        
        {/* Header Section */}
        <div className="bg-[#1a2e35] text-white p-6 text-center relative overflow-hidden flex-shrink-0">
          {!isLoading && !isSuccess && (
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
          
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-emerald-400 to-transparent animate-spin-slow"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-300 to-yellow-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-amber-500/30 transform rotate-3">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-1">PlateIt Pro</h2>
            <p className="text-emerald-100 text-sm">Unlock Unlimited Culinary Inspiration</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-90 duration-300">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
                <PartyPopper className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Payment Confirmed!</h3>
              <p className="text-slate-500">Welcome to the Pro family. Redirecting you to your kitchen...</p>
            </div>
          ) : (
            <>
              {/* Features Recap */}
              <div className="grid grid-cols-3 gap-2 mb-8">
                <div className="flex flex-col items-center text-center p-3 bg-slate-50 rounded-2xl">
                  <div className="p-2 bg-emerald-100 rounded-full mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 uppercase">No Limits</p>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-slate-50 rounded-2xl">
                  <div className="p-2 bg-emerald-100 rounded-full mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 uppercase">AI Power+</p>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-slate-50 rounded-2xl">
                  <div className="p-2 bg-emerald-100 rounded-full mb-2">
                    <Star className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 uppercase">Support</p>
                </div>
              </div>

              <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subscription Plan</p>
                  <p className="font-bold text-slate-800">Monthly Pro Membership</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-slate-900">$4.99</p>
                  <p className="text-[10px] text-slate-400 font-medium">per month</p>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 px-1">Payment Method</h3>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedMethod('CARD')}
                    disabled={isLoading}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${selectedMethod === 'CARD' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-white text-slate-400'}`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-[10px] font-bold">CARD</span>
                  </button>
                  <button 
                    onClick={() => setSelectedMethod('PAYPAL')}
                    disabled={isLoading}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${selectedMethod === 'PAYPAL' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-400'}`}
                  >
                    <span className="font-black italic">PayPal</span>
                  </button>
                  <button 
                    onClick={() => setSelectedMethod('APPLE_GOOGLE')}
                    disabled={isLoading}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${selectedMethod === 'APPLE_GOOGLE' ? 'border-slate-900 bg-slate-50 text-slate-900' : 'border-slate-100 bg-white text-slate-400'}`}
                  >
                    <Wallet className="w-5 h-5" />
                    <span className="text-[10px] font-bold">WALLET</span>
                  </button>
                </div>

                {selectedMethod === 'CARD' && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Secure Card Number</label>
                        <input 
                          type="text" 
                          placeholder="0000 0000 0000 0000"
                          className="w-full bg-white border border-slate-200 p-3 rounded-lg text-sm outline-none focus:border-emerald-500 transition-colors"
                          value={cardDetails.number}
                          onChange={e => setCardDetails(prev => ({...prev, number: e.target.value}))}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Expiry</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY"
                            className="w-full bg-white border border-slate-200 p-3 rounded-lg text-sm outline-none focus:border-emerald-500 transition-colors"
                            value={cardDetails.expiry}
                            onChange={e => setCardDetails(prev => ({...prev, expiry: e.target.value}))}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">CVC</label>
                          <input 
                            type="password" 
                            placeholder="***"
                            className="w-full bg-white border border-slate-200 p-3 rounded-lg text-sm outline-none focus:border-emerald-500 transition-colors"
                            value={cardDetails.cvc}
                            onChange={e => setCardDetails(prev => ({...prev, cvc: e.target.value}))}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex-shrink-0">
          {!isSuccess && (
            <div className="space-y-4">
              {isLoading && (
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 animate-[loading_2s_ease-in-out_infinite]" />
                </div>
              )}
              <button
                onClick={handleSubscribe}
                disabled={isLoading || !isFormValid()}
                className={`w-full py-4 rounded-2xl font-black text-xl shadow-lg transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
                  selectedMethod === 'CARD' ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200' :
                  selectedMethod === 'PAYPAL' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200' :
                  'bg-slate-900 hover:bg-black text-white shadow-slate-200'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay & Subscribe Now
                  </>
                )}
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-500" /> SSL SECURE</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-500" /> ENCRYPTED</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-500" /> INSTANT ACCESS</span>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
