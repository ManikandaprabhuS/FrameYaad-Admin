import React, { useMemo, useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle, Check, Trash2 } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, loading, markAllAsRead, toggleNotificationRead, removeNotification } = useNotifications(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const filteredNotifications = notifications.filter(
    (n) => filter === 'all' || !n.read
  );

  const getIconForType = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-fade-in w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 border-b border-outline-variant/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Notifications</h1>
          <p className="text-sm text-on-surface-variant mt-1">Stay updated with alerts and store activity.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors w-full sm:w-auto"
          >
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Total</span>
          <p className="mt-1 text-2xl font-bold text-on-surface">{notifications.length}</p>
        </div>
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Unread</span>
          <p className="mt-1 text-2xl font-bold text-primary">{unreadCount}</p>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Read</span>
          <p className="mt-1 text-2xl font-bold text-on-surface">{notifications.length - unreadCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-surface-container-lowest border border-outline-variant rounded-xl p-3 sm:p-4 shadow-sm">
        <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === 'all' ? 'bg-surface shadow-sm text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === 'unread' ? 'bg-surface shadow-sm text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
        <span className="text-xs text-on-surface-variant text-center sm:text-right">
          Showing {filteredNotifications.length} notification{filteredNotifications.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-surface-container-lowest border border-outline-variant rounded-xl" />
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-10 sm:p-12 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4 text-on-surface-variant">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface">
              {filter === 'unread' ? 'No unread notifications' : 'All caught up!'}
            </h3>
            <p className="text-sm text-on-surface-variant mt-2 max-w-sm">
              {filter === 'unread'
                ? 'You have read all your notifications.'
                : "You don't have any notifications right now. Check back later."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl border transition-all ${
                notification.read
                  ? 'bg-surface-container-lowest border-outline-variant'
                  : 'bg-primary/5 border-primary/30 shadow-sm'
              }`}
            >
              <div className="p-4 sm:p-5 flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    notification.read ? 'bg-surface-container' : 'bg-white'
                  }`}>
                    {getIconForType(notification.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <h4 className={`font-semibold text-sm truncate ${notification.read ? 'text-on-surface' : 'text-primary'}`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-[11px] text-on-surface-variant flex-shrink-0">
                      {formatDate(notification.date)}
                    </span>
                  </div>
                  <p className={`text-sm mt-1.5 leading-relaxed ${notification.read ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                    {notification.message}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => toggleNotificationRead(notification.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {notification.read ? 'Mark unread' : 'Mark read'}
                    </button>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-error bg-error-container/20 hover:bg-error-container/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
