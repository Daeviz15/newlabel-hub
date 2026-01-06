// Shared types for cart and checkout functionality

export interface CartItem {
  id: string | number;
  title: string;
  image: string;
  quantity: number;
  price: number;
  creator?: string;
}

export interface BillingDetails {
  firstName: string;
  lastName: string;
  country: string;
  street: string;
  state: string;
  phone: string;
  email: string;
  notes: string;
}

export interface BillingFormErrors {
  firstName?: string;
  lastName?: string;
  country?: string;
  street?: string;
  state?: string;
  phone?: string;
  email?: string;
}

export interface ChannelConfig {
  name: string;
  brand: "main" | "jsity" | "thc" | "gospel";
  cartRoute: string;
  checkoutRoute: string;
  dashboardRoute: string;
  primaryColor?: string;
}

export const CHANNEL_CONFIGS: Record<string, ChannelConfig> = {
  main: {
    name: "NewLabel",
    brand: "main",
    cartRoute: "/cart",
    checkoutRoute: "/checkout",
    dashboardRoute: "/dashboard",
  },
  jsity: {
    name: "Jsity",
    brand: "jsity",
    cartRoute: "/jcart",
    checkoutRoute: "/jcheckout",
    dashboardRoute: "/jdashboard",
    primaryColor: "#8B5CF6", // purple
  },
  thc: {
    name: "The House Chronicles",
    brand: "thc",
    cartRoute: "/thc-cart",
    checkoutRoute: "/thc-checkout",
    dashboardRoute: "/thc-dashboard",
    primaryColor: "#10B981", // green
  },
  gospel: {
    name: "GospelLine",
    brand: "gospel",
    cartRoute: "/gospel-cart",
    checkoutRoute: "/gospel-checkout",
    dashboardRoute: "/gospel-dashboard",
    primaryColor: "#3B82F6", // blue
  },
};
