// This service acts as an abstraction layer for RevenueCat.
// In a real native build, you would import Purchases from '@revenuecat/purchases-capacitor'.
// For this web preview, we mock the behavior using LocalStorage and simulated network delays.

export interface RCPackage {
  identifier: string;
  packageType: string;
  product: {
    identifier: string;
    title: string;
    description: string;
    price: number;
    priceString: string;
    currencyCode: string;
  };
}

export interface RCOfferings {
  current: {
    availablePackages: RCPackage[];
  } | null;
}

export interface RCEntitlementInfo {
  isActive: boolean;
  willRenew: boolean;
  periodType: string;
  latestPurchaseDate: string;
}

export interface RCCustomerInfo {
  entitlements: {
    active: Record<string, RCEntitlementInfo>;
  };
}

class RevenueCatService {
  private isNative: boolean = false;
  private readonly ENTITLEMENT_ID = 'pro_access';
  private readonly STORAGE_KEY = 'plateit_rc_mock_pro';

  constructor() {
    // Check if running in Capacitor
    this.isNative = !!(window as any).Capacitor;
  }

  async initialize(): Promise<void> {
    console.log("Initializing RevenueCat Service...");
    if (this.isNative) {
      // Native initialization code would go here
      // await Purchases.configure({ apiKey: "..." });
    }
    // Simulate SDK init time
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async getOfferings(): Promise<RCOfferings> {
    if (this.isNative) {
      // return await Purchases.getOfferings();
    }

    // Mock response
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      current: {
        availablePackages: [
          {
            identifier: '$rc_monthly',
            packageType: 'MONTHLY',
            product: {
              identifier: 'plateit_pro_monthly',
              title: 'Monthly Pro',
              description: 'Unlimited recipes & AI usage',
              price: 4.99,
              priceString: '$4.99',
              currencyCode: 'USD'
            }
          }
        ]
      }
    };
  }

  async purchasePackage(pkg: RCPackage): Promise<{ customerInfo: RCCustomerInfo }> {
    if (this.isNative) {
      // return await Purchases.purchasePackage({ aPackage: pkg });
    }

    // Simulate purchase latency
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Grant access in mock storage
    localStorage.setItem(this.STORAGE_KEY, 'true');

    return {
      customerInfo: this.getMockCustomerInfo(true)
    };
  }

  async getCustomerInfo(): Promise<RCCustomerInfo> {
    if (this.isNative) {
      // return await Purchases.getCustomerInfo();
    }
    
    const isPro = localStorage.getItem(this.STORAGE_KEY) === 'true';
    return this.getMockCustomerInfo(isPro);
  }

  async restorePurchases(): Promise<RCCustomerInfo> {
     // Simulate restore
     await new Promise(resolve => setTimeout(resolve, 1500));
     const isPro = localStorage.getItem(this.STORAGE_KEY) === 'true';
     return this.getMockCustomerInfo(isPro);
  }

  private getMockCustomerInfo(isPro: boolean): RCCustomerInfo {
    return {
      entitlements: {
        active: isPro ? {
          [this.ENTITLEMENT_ID]: {
            isActive: true,
            willRenew: true,
            periodType: 'NORMAL',
            latestPurchaseDate: new Date().toISOString()
          }
        } : {}
      }
    };
  }
}

export const Purchases = new RevenueCatService();