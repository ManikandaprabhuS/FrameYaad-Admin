import api from './api';
import { Notification } from '../types';

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications');
    return response.data.notifications;
  },

  markAllRead: async (): Promise<Notification[]> => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data.notifications;
  },

  toggleRead: async (id: string): Promise<Notification> => {
    const response = await api.put(`/notifications/${id}/toggle`);
    return response.data.notification;
  },

  deleteNotification: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};
