import api from './api';
import type { ApiEnvelope } from './contracts';

export type CustomerWishlistItem = {
  id: string;
  productIdentifier: string;
};

export const customerWishlistService = {
  list: async (): Promise<CustomerWishlistItem[]> => {
    const response = await api.get<ApiEnvelope<{ wishlist: CustomerWishlistItem[] }>>('/wishlist');
    return response.data.data.wishlist;
  },

  add: async (productIdentifier: string): Promise<CustomerWishlistItem> => {
    const response = await api.post<ApiEnvelope<{ wishlistItem: CustomerWishlistItem }>>('/wishlist', { productIdentifier });
    return response.data.data.wishlistItem;
  },

  remove: async (wishlistItemId: string): Promise<void> => {
    await api.delete(`/wishlist/${wishlistItemId}`);
  },
};
