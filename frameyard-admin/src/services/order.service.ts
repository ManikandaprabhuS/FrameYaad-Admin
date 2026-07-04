import api from './api';
import { Order, OrderItem, OrderStatus } from '../types';

type OrderItemApi = {
  price: number | string;
  subtotal: number | string;
  [key: string]: unknown;
};

type OrderApi = {
  totalAmount: number | string;
  orderItems?: OrderItemApi[];
  [key: string]: unknown;
};

type OrderQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  dateFilter?: string;
};

type OrdersResponse = {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalCount: number;
    pendingCount: number;
    processingCount: number;
    deliveredCount: number;
    cancelledCount: number;
  };
};

const normalizeOrderItem = (item: OrderItemApi): OrderItem => ({
  ...(item as unknown as OrderItem),
  price: Number(item.price),
  subtotal: Number(item.subtotal),
});

const normalizeOrder = (order: OrderApi): Order => ({
  ...(order as unknown as Order),
  totalAmount: Number(order.totalAmount),
  orderItems: Array.isArray(order.orderItems)
    ? order.orderItems.map(normalizeOrderItem)
    : [],
});

export const orderService = {
  getOrders: async (params: OrderQueryParams = {}): Promise<OrdersResponse> => {
    const response = await api.get('/orders/admin', { params });
    return {
      orders: (response.data.orders || []).map(normalizeOrder),
      pagination: response.data.pagination,
      summary: response.data.summary,
    };
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return normalizeOrder(response.data.order);
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const response = await api.patch(`/orders/admin/${id}/status`, {
      orderStatus: status,
    });
    return normalizeOrder(response.data.order);
  },

  exportOrders: async (params: Omit<OrderQueryParams, 'page' | 'limit'> = {}): Promise<Blob> => {
    const response = await api.get('/orders/admin/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
