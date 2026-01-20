import React, { useState, useEffect } from 'react';
import { X, Crown, CheckCircle2, Star, Sparkles, Loader2, PartyPopper, AlertCircle, ShieldCheck, Smartphone } from 'lucide-react';
import { Purchases, RCPackage } from '../services/revenueCat';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingOfferings, setIsFetchingOfferings] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<RCPackage | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset states
  useEffect(() => {
    if (isOpen) {
      loadOfferings();
    } else {
      setIsLoading(false);
      setIsSuccess(false);
      setError(null);
    }
  }, [isOpen]);

  const loadOfferings = async () => {
    setIsFetchingOfferings(true);
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current && offerings.current.availablePackages.length > 0) {
        setCurrentPackage(offerings.current.availablePackages[0]);
      } else {
        // Fallback for web preview if mock fails or is empty
        setError("Unable to connect to the Store.");
      }
    } catch (e) {
      setError("Failed to load subscription details.");
    } finally {
      setIsFetchingOfferings(false);
    }
  };

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    if (isLoading || isSuccess || !currentPackage) return; 

    setIsLoading(true);
    setError(null);
    
    try {
      // This calls the RevenueCat abstraction. 
      // On Native: It opens the Google Play / Apple sheet.
      // On Web: It simulates a successful purchase.
      await Purchases.purchasePackage(currentPackage);
      
      setIsSuccess(true);
      setIsLoading(false);
      
      setTimeout(() => {
        onSubscribe();
        onClose();
      }, 2000);

    } catch (e) {
      setIsLoading(false);
      // In a real app, parse 'e' to see if user cancelled (userCancelled) or if there was a network error
      setError("Purchase cancelled or failed. Please try again.");
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      await Purchases.restorePurchases();
      // We assume restore updates the listener in App.tsx or we manually check
      const info = await Purchases.getCustomerInfo();
      if (info.entitlements.active['pro_access']) {
        setIsSuccess(true);
        setTimeout(() => {
            onSubscribe();
            onClose();
        }, 1500);
      } else {
        setError("No previous purchases found.");
      }
    } catch(e) {
        setError("Failed to restore purchases.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 text-center relative overflow-hidden flex-shrink-0">
          {!isLoading && !isSuccess && (
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
          
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-indigo-500 to-transparent animate-spin-slow"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-300 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-amber-500/20 transform rotate-3">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">PlateIt Pro</h2>
            <p className="text-slate-300 font-medium">Unlock Your Kitchen's Potential</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-90 duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                <PartyPopper className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">You're a Pro!</h3>
              <p className="text-slate-500">Thank you for subscribing. Enjoy unlimited recipes.</p>
            </div>
          ) : (
            <>
              {/* Value Props */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Unlimited Recipes</h4>
                    <p className="text-sm text-slate-500">Save as many recipes as you want</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Advanced AI</h4>
                    <p className="text-sm text-slate-500">More detailed parsing & organization</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <Star className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Support Development</h4>
                    <p className="text-sm text-slate-500">Help us build more cooking tools</p>
                  </div>
                </div>
              </div>

              {/* Price / Plan */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center mb-6">
                {isFetchingOfferings ? (
                    <div className="flex items-center justify-center gap-2 py-2 text-slate-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Loading store price...</span>
                    </div>
                ) : currentPackage ? (
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Monthly Plan</p>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-3xl font-black text-slate-900">{currentPackage.product.priceString}</span>
                            <span className="text-slate-500 font-medium">/ month</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-slate-400 py-2">Plan currently unavailable</div>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {/* Native Subscribe Button */}
              <button
                onClick={handleSubscribe}
                disabled={isLoading || isFetchingOfferings || !currentPackage}
                className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg shadow-lg shadow-slate-200 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Connecting to Store...
                  </>
                ) : (
                  <>
                    <Smartphone className="w-5 h-5" />
                    Subscribe via Store
                  </>
                )}
              </button>
              
              <button 
                onClick={handleRestore}
                disabled={isLoading}
                className="w-full mt-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                Already purchased? Restore Purchases
              </button>
            </>
          )}
        </div>

        {/* Legal Footer (Required for App Store/Play Store) */}
        {!isSuccess && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
                <ShieldCheck className="w-3 h-3" />
                SECURE CHECKOUT
            </div>
            <p className="text-[10px] text-slate-400 leading-tight px-4">
                Payment will be charged to your iTunes/Google Play Account at confirmation of purchase. 
                Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period.
            </p>
            </div>
        )}
      </div>
    </div>
  );
};