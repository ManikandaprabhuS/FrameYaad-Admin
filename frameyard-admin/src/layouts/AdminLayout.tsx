import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useNotifications from '../hooks/useNotifications';
import { customerService } from '../services/customer.service';
import { showError } from '../utils/toast';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Bell, 
  User, 
  Settings, 
  Menu, 
  X, 
  Search, 
  HelpCircle, 
  LogOut,
  ChevronRight
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications } = useNotifications(true);
  const avatarInitial = user?.name?.charAt(0) || 'U';

  // Close mobile drawer on route change
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setMobileMenuOpen(false);
      setMobileSearchOpen(false);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isLikelyPhoneNumber = (value: string) => {
    const compactValue = value.replace(/\s+/g, '');
    const digitsOnly = compactValue.replace(/\D/g, '');

    return (
      /^[+\d][\d\s()-]+$/.test(value) &&
      digitsOnly.length >= 10 &&
      digitsOnly.length <= 15 &&
      !/^FY-/i.test(compactValue)
    );
  };

  const handleGlobalSearch = async (rawValue: string) => {
    const value = rawValue.trim();

    if (!value) {
      return;
    }

    if (isLikelyPhoneNumber(value)) {
      try {
        const customer = await customerService.lookupCustomerByPhoneNumber(value);
        navigate(`/admin/customers/${customer.id}`);
        return;
      } catch (error) {
        console.error('Customer lookup failed', error);
        showError('No customer found for that phone number.');
        return;
      }
    }

    navigate(`/admin/orders?search=${encodeURIComponent(value)}`);
  };

  const navLinks = [
    { name: 'Overview', path: '/admin/overview', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Profile', path: '/admin/profile', icon: User },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  // Breadcrumb generator
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, idx) => {
      const isLast = idx === paths.length - 1;
      const formatted = path.charAt(0).toUpperCase() + path.slice(1);
      return (
        <React.Fragment key={path}>
          {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />}
          <span className={`${isLast ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
            {formatted}
          </span>
        </React.Fragment>
      );
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background flex text-on-background">
      
      {/* ------------------------------------------------------------- */}
      {/* DESKTOP SIDEBAR */}
      {/* ------------------------------------------------------------- */}
      <aside className="hidden md:flex w-sidebar-width h-screen fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant flex-col py-stack-lg px-stack-md z-50">
        <div className="mb-8 px-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">FY</div>
          <div>
            <h1 className="font-sans text-lg font-bold text-on-surface leading-tight">FrameYaad</h1>
            <p className="text-xs font-semibold text-secondary tracking-wider uppercase opacity-80">Admin Console</p>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-sm'
                    : 'text-secondary hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-primary' : 'text-secondary'}`} />
                <span>{link.name}</span>
                {link.name === 'Notifications' && unreadCount > 0 && (
                  <span className="ml-auto w-5 h-5 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card bottom */}
        {user && (
          <div className="mt-auto px-4 pt-4 border-t border-outline-variant">
            <div className="flex items-center justify-between">
              <Link to="/admin/profile" className="flex items-center gap-3 py-1 group">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-outline-variant group-hover:ring-2 group-hover:ring-primary transition-all duration-200">
                  {avatarInitial}
                </div>
                <div className="text-left max-w-[120px]">
                  <p className="text-sm font-semibold text-on-surface truncate leading-tight group-hover:text-primary">{user.name}</p>
                  <p className="text-[11px] text-on-surface-variant truncate mt-0.5">{user.role}</p>
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-1.5 hover:bg-error/10 hover:text-error text-on-surface-variant rounded-lg transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE DRAWER */}
      {/* ------------------------------------------------------------- */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 md:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <aside className={`fixed top-0 bottom-0 left-0 w-sidebar-width bg-surface border-r border-outline-variant flex flex-col py-stack-lg px-stack-md z-50 md:hidden transition-transform duration-300 transform ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">F</div>
            <div>
              <h1 className="font-sans text-lg font-bold text-on-surface">FrameYard</h1>
              <p className="text-[10px] font-semibold text-secondary tracking-wider uppercase">Admin</p>
            </div>
          </div>
          <button 
            className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-sm'
                    : 'text-secondary hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-primary' : 'text-secondary'}`} />
                <span>{link.name}</span>
                {link.name === 'Notifications' && unreadCount > 0 && (
                  <span className="ml-auto w-5 h-5 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="mt-auto px-4 pt-4 border-t border-outline-variant flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-outline-variant">
                {avatarInitial}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-on-surface leading-none">{user.name}</p>
                <p className="text-[11px] text-on-surface-variant mt-1">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 hover:bg-error/10 hover:text-error text-on-surface-variant rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN VIEWPORT WRAPPER */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col md:ml-sidebar-width w-full max-w-full min-h-screen">
        
        {/* Sticky Header */}
        <header className="h-topbar-height sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant shadow-sm flex items-center justify-between px-margin-mobile md:px-margin-desktop transition-all">
          
          {/* Mobile hamburger menu & logo */}
          <div className="md:hidden flex items-center gap-2 min-w-0">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all scale-95 duration-100 flex-shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-sans text-md font-bold text-on-surface truncate">FrameYard</span>
          </div>

          {/* Breadcrumbs (Desktop) */}
          <div className="hidden md:flex items-center gap-2 text-on-surface-variant font-medium text-sm">
            {getBreadcrumbs()}
          </div>

          {/* Search, Notifications & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search (Desktop) */}
            <div className="hidden lg:flex items-center bg-surface px-3 py-1.5 rounded-full border border-outline-variant focus-within:border-primary focus-within:bg-surface-container-lowest transition-colors w-64">
              <Search className="w-4 h-4 text-outline-variant mr-2" />
              <input
                className="bg-transparent border-none focus:ring-0 text-xs text-on-surface w-full p-0 placeholder-on-surface-variant/60 focus:outline-none"
                placeholder="Search orders, customers..."
                type="text"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    void handleGlobalSearch(e.currentTarget.value);
                  }
                }}
              />
            </div>

            {/* Search toggle (Mobile / Tablet) */}
            <button
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all"
              title="Search"
              aria-label="Toggle search"
            >
              {mobileSearchOpen ? <X className="w-[18px] h-[18px]" /> : <Search className="w-[18px] h-[18px]" />}
            </button>

            {/* Notification icon - navigates to notifications page */}
            <Link
              to="/admin/notifications"
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all relative"
              title="Notifications"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            >
              <Bell className="w-[18px] h-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-surface-container-lowest">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            <button className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all">
              <HelpCircle className="w-[18px] h-[18px]" />
            </button>

            <div className="h-6 w-px bg-outline-variant mx-1" />

            {/* Profile Avatar click */}
            {user && (
              <Link to="/admin/profile" className="w-8 h-8 rounded-full bg-surface-variant border border-outline-variant overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all flex items-center justify-center text-xs font-bold text-primary">
                {avatarInitial}
              </Link>
            )}

          </div>
        </header>

        {/* Expandable Search Bar (Mobile / Tablet) */}
        {mobileSearchOpen && (
          <div className="lg:hidden sticky top-topbar-height z-30 bg-surface-container-lowest border-b border-outline-variant px-margin-mobile py-3 shadow-sm animate-fade-in">
            <div className="flex items-center bg-surface px-3 py-2 rounded-full border border-outline-variant focus-within:border-primary focus-within:bg-surface-container-lowest transition-colors">
              <Search className="w-4 h-4 text-outline-variant mr-2 flex-shrink-0" />
              <input
                autoFocus
                className="bg-transparent border-none focus:ring-0 text-sm text-on-surface w-full p-0 placeholder-on-surface-variant/60 focus:outline-none"
                placeholder="Search orders, customers..."
                type="text"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    void handleGlobalSearch(e.currentTarget.value);
                    setMobileSearchOpen(false);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Viewport content */}
        <main className="flex-1 p-margin-mobile md:p-margin-desktop bg-surface w-full max-w-container-max mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
