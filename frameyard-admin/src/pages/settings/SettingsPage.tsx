import React, { useState } from 'react';
import { Store, Bell, Lock, Save } from 'lucide-react';
import { showSuccess } from '../../utils/toast';

type TabId = 'general' | 'notifications' | 'security';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('general');

  const [storeName, setStoreName] = useState('FrameYaad Store');
  const [contactEmail, setContactEmail] = useState('contact@frameyard.com');
  const [storeDescription, setStoreDescription] = useState('Premium framing solutions for your best memories.');
  const [currency, setCurrency] = useState('INR');
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  const [orderAlerts, setOrderAlerts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [customerAlerts, setCustomerAlerts] = useState(false);

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <Store className="w-4 h-4" /> },
    { id: 'notifications', label: 'Alerts', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
  ];

  const handleSave = () => {
    showSuccess('Settings saved successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in w-full max-w-5xl mx-auto">
      <div className="border-b border-outline-variant/60 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Settings</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Manage your admin console preferences. Changes are saved locally until backend settings are connected.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Tabs */}
        <div className="w-full lg:w-56 flex-shrink-0">
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 lg:flex-shrink ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-on-surface-variant hover:bg-surface-container border border-transparent'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'general' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-on-surface mb-6">Store Details</h2>
              <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                    Store Description
                  </label>
                  <textarea
                    rows={3}
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    className="w-full p-4 bg-surface border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                      Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
                    >
                      <option value="Asia/Kolkata">India (IST)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-stretch sm:justify-end pt-4 border-t border-outline-variant">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-xl font-semibold shadow-sm hover:bg-primary/95 transition-all w-full sm:w-auto"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-on-surface mb-2">Admin Alert Preferences</h2>
              <p className="text-sm text-on-surface-variant mb-6">
                Choose which events appear in your notifications panel.
              </p>
              <div className="space-y-4">
                {[
                  { id: 'orders', label: 'New order alerts', desc: 'Get notified when a customer places an order', checked: orderAlerts, onChange: setOrderAlerts },
                  { id: 'stock', label: 'Low stock alerts', desc: 'Alert when product inventory drops below threshold', checked: lowStockAlerts, onChange: setLowStockAlerts },
                  { id: 'customers', label: 'New customer signups', desc: 'Notify when a new customer registers', checked: customerAlerts, onChange: setCustomerAlerts },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-4 p-4 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container-low cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.onChange(e.target.checked)}
                      className="mt-1 w-4 h-4 text-primary rounded focus:ring-primary/20"
                    />
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{item.label}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex justify-stretch sm:justify-end pt-6 mt-2 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-xl font-semibold shadow-sm hover:bg-primary/95 transition-all w-full sm:w-auto"
                >
                  <Save className="w-4 h-4" />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-on-surface mb-2">Security</h2>
              <p className="text-sm text-on-surface-variant mb-6">
                Manage your account security. Password changes are handled through your profile.
              </p>
              <div className="rounded-xl border border-outline-variant bg-surface p-5 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-on-surface">Change Password</p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Update your password from the Profile page under account settings.
                  </p>
                </div>
                <div className="pt-4 border-t border-outline-variant">
                  <p className="text-sm font-semibold text-on-surface">Session</p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    You are signed in with a secure cookie-based session. Log out from the sidebar when using a shared device.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
