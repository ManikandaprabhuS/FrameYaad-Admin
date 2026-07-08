import { create } from 'zustand';
import { Notification } from '../types';
import { notificationService } from '../services/notification.service';
import { showError, showSuccess } from '../utils/toast';

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
      showSuccess('All notifications marked as read');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to mark notifications as read';
      set({ error: errMsg });
      showError(errMsg);
    }
  },

  toggleNotificationRead: async (id: string) => {
    try {
      const updated = await notificationService.toggleRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) => (n.id === id ? updated : n)),
      }));
      showSuccess(updated.read ? 'Notification marked as read' : 'Notification marked as unread');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to update notification';
      set({ error: errMsg });
      showError(errMsg);
    }
  },

  removeNotification: async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
      showSuccess('Notification deleted successfully');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to delete notification';
      set({ error: errMsg });
      showError(errMsg);
    }
  },
}));
