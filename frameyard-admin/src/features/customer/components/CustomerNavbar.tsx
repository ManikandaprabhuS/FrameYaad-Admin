import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, ShoppingCart, User, X } from 'lucide-react';
import fyLogoIcon from '../../../assets/fy-logo-icon.jpeg';
import { useAuthStore } from '../../../store/authStore';

const customerNavLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop All', path: '/products' },
  { name: 'Book Appointment', path: '/book-appointment' },
  { name: 'Contact us', path: '/contact-us' },
];

const CustomerNavbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const customerLoggedIn = useAuthStore((state) => state.isAuthenticated) && user?.role === 'CUSTOMER';
  const accountLabel = customerLoggedIn ? user.name.split(' ')[0] || 'Account' : 'Login';

  const navClassName = ({ isActive }: { isActive: boolean }) =>
    `relative px-1 py-2 text-xs font-bold transition md:text-sm ${
      isActive
        ? 'text-black after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-black'
        : 'text-black/70 hover:text-black'
    }`;

  const mobileNavClassName = ({ isActive }: { isActive: boolean }) =>
    `block w-full rounded-lg px-4 py-3 text-sm font-bold transition ${
      isActive ? 'bg-black text-white' : 'text-black/75 hover:bg-black/5 hover:text-black'
    }`;

  return (
    <header className="sticky top-0 z-[100] isolate border-b border-outline-variant bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src={fyLogoIcon} alt="FrameYaad" className="h-7 w-7 object-contain" />
          <span className="text-sm font-black text-black md:text-base">FrameYaad</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {customerNavLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={navClassName} end={link.path === '/'}>
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link to="/cart" className="relative rounded-full p-2 text-black transition hover:bg-black/5" title="Cart">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white">
              0
            </span>
          </Link>
          <Link to="/profile" className="inline-flex items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-xs font-bold text-black transition hover:bg-black hover:text-white">
            <User className="h-4 w-4" />
            {accountLabel}
          </Link>
        </div>

        <button
          className="rounded-lg border border-outline-variant p-2 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute inset-x-0 top-full z-[110] h-[calc(100dvh-4rem)] overflow-y-auto border-t border-black/10 bg-white shadow-xl md:hidden">
          <aside className="w-full bg-white px-5 py-6">
            <nav className="flex flex-col gap-2">
              {[...customerNavLinks, { name: 'Cart', path: '/cart' }, { name: customerLoggedIn ? 'My Account' : 'Login', path: '/profile' }].map((link) => (
                <NavLink key={link.path} to={link.path} className={mobileNavClassName} end={link.path === '/'} onClick={() => setMenuOpen(false)}>
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
};

export default CustomerNavbar;
