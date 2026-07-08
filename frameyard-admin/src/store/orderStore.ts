import { create } from 'zustand';
import { Order, OrderStatus } from '../types';
import { orderService } from '../services/order.service';
import { showError, showSuccess } from '../utils/toast';

type OrderQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  dateFilter?: string;
};

type OrderPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type OrderSummary = {
  totalCount: number;
  pendingCount: number;
  processingCount: number;
  deliveredCount: number;
  cancelledCount: number;
};

interface OrderState {
  orders: Order[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  pagination: OrderPagination;
  summary: OrderSummary;
  lastQuery: OrderQueryParams;
  fetchOrders: (params?: OrderQueryParams, options?: { silent?: boolean }) => Promise<void>;
  changeOrderStatus: (id: string, status: OrderStatus) => Promise<boolean>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  refreshing: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  summary: {
    totalCount: 0,
    pendingCount: 0,
    processingCount: 0,
    deliveredCount: 0,
    cancelledCount: 0,
  },
  lastQuery: {
    page: 1,
    limit: 10,
    dateFilter: 'all',
  },

  fetchOrders: async (params = {}, options = {}) => {
    const query = {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      search: params.search ?? '',
      status: params.status ?? 'all',
      dateFilter: params.dateFilter ?? 'all',
    };
    const silent = options.silent ?? false;
    set({
      error: null,
      loading: silent ? false : true,
      refreshing: silent ? true : false,
    });
    try {
      const data = await orderService.getOrders(query);
      set({
        orders: data.orders,
        pagination: data.pagination,
        summary: data.summary,
        lastQuery: query,
        loading: false,
        refreshing: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to fetch orders',
        loading: false,
        refreshing: false,
      });
    }
  },

  changeOrderStatus: async (id, status) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(id, status);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
      }));
      await get().fetchOrders(get().lastQuery, { silent: true });
      showSuccess('Order status updated successfully');
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to update order status';
      set({ error: errMsg });
      showError(errMsg);
      return false;
    }
  },
}));
