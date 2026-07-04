import { create } from 'zustand';
import { Notification } from '../types';
import { notificationService } from '../services/notification.service';

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  toggleNotificationRead: (id: string) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const data = await notificationService.getNotifications();
      set({ notifications: data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch notifications', loading: false });
    }
  },

  markAllAsRead: async () => {
    try {
      const updated = await notificationService.markAllRead();
      set({ notifications: updated });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to mark notifications as read' });
    }
  },

  toggleNotificationRead: async (id: string) => {
    try {
      const updated = await notificationService.toggleRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) => (n.id === id ? updated : n)),
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to update notification read status' });
    }
  },

  removeNotification: async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to delete notification' });
    }
  },
}));
