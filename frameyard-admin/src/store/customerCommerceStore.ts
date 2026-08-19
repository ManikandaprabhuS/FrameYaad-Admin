import { create } from 'zustand';

import { customerWishlistService, type CustomerWishlistItem } from '../services/customer-wishlist.service';

const CART_STORAGE_KEY = 'frameyaad-customer-cart-v1';

export type CustomerCartItem = {
  key: string;
  productId: string;
  productIdentifier?: string | null;
  variantId: string;
  name: string;
  imageUrl?: string | null;
  material: string;
  frameSize: string;
  color?: string | null;
  mountType: string;
  glassType: string;
  unitPrice: number;
  quantity: number;
  stockQuantity: number;
};

const readCart = (): CustomerCartItem[] => {
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CustomerCartItem[]) : [];
  } catch {
    return [];
  }
};

const writeCart = (items: CustomerCartItem[]) => {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Keep the cart available for this session if browser storage is unavailable.
  }
};

type CommerceState = {
  cartItems: CustomerCartItem[];
  wishlistByProductIdentifier: Record<string, string>;
  wishlistItems: CustomerWishlistItem[];
  wishlistLoadedForUserId: string | null;
  wishlistLoading: boolean;
  addCartItem: (item: Omit<CustomerCartItem, 'key'>) => void;
  updateCartQuantity: (key: string, quantity: number) => void;
  removeCartItem: (key: string) => void;
  clearCart: () => void;
  loadWishlist: (userId: string) => Promise<void>;
  toggleWishlist: (productIdentifier: string) => Promise<boolean>;
  clearWishlist: () => void;
};

export const useCustomerCommerceStore = create<CommerceState>((set, get) => ({
  cartItems: readCart(),
  wishlistByProductIdentifier: {},
  wishlistItems: [],
  wishlistLoadedForUserId: null,
  wishlistLoading: false,

  addCartItem: (item) => set((state) => {
    const key = `${item.productId}:${item.variantId}`;
    const existing = state.cartItems.find((cartItem) => cartItem.key === key);
    const cartItems = existing
      ? state.cartItems.map((cartItem) => cartItem.key === key
        ? { ...cartItem, quantity: Math.min(cartItem.stockQuantity, cartItem.quantity + item.quantity) }
        : cartItem)
      : [...state.cartItems, { ...item, key, quantity: Math.min(item.stockQuantity, item.quantity) }];
    writeCart(cartItems);
    return { cartItems };
  }),

  updateCartQuantity: (key, quantity) => set((state) => {
    const cartItems = state.cartItems.map((item) => item.key === key
      ? { ...item, quantity: Math.max(1, Math.min(item.stockQuantity, quantity)) }
      : item);
    writeCart(cartItems);
    return { cartItems };
  }),

  removeCartItem: (key) => set((state) => {
    const cartItems = state.cartItems.filter((item) => item.key !== key);
    writeCart(cartItems);
    return { cartItems };
  }),

  clearCart: () => {
    writeCart([]);
    set({ cartItems: [] });
  },

  loadWishlist: async (userId) => {
    if (get().wishlistLoadedForUserId === userId || get().wishlistLoading) return;
    set({ wishlistLoading: true });
    try {
      const items = await customerWishlistService.list();
      set({
        wishlistByProductIdentifier: Object.fromEntries(items.map((item) => [item.productIdentifier, item.id])),
        wishlistItems: items,
        wishlistLoadedForUserId: userId,
        wishlistLoading: false,
      });
    } catch {
      set({ wishlistLoading: false });
    }
  },

  toggleWishlist: async (productIdentifier) => {
    const existingId = get().wishlistByProductIdentifier[productIdentifier];
    if (existingId) {
      await customerWishlistService.remove(existingId);
      set((state) => {
        const next = { ...state.wishlistByProductIdentifier };
        delete next[productIdentifier];
        return {
          wishlistByProductIdentifier: next,
          wishlistItems: state.wishlistItems.filter((item) => item.id !== existingId),
        };
      });
      return false;
    }
    const created = await customerWishlistService.add(productIdentifier);
    set((state) => ({
      wishlistByProductIdentifier: { ...state.wishlistByProductIdentifier, [productIdentifier]: created.id },
      wishlistItems: [created, ...state.wishlistItems.filter((item) => item.id !== created.id)],
    }));
    return true;
  },

  clearWishlist: () => set({ wishlistByProductIdentifier: {}, wishlistItems: [], wishlistLoadedForUserId: null, wishlistLoading: false }),
}));
