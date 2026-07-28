import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, ShoppingBag, User, X } from 'lucide-react';
import fyLogoIcon from '../assets/fy-logo-icon.jpeg';

const customerNavLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Orders', path: '/orders' },
];

const CustomerLayout: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navClassName = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl px-4 py-2 text-sm font-bold transition ${
      isActive ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
    }`;

  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface-container-lowest/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={fyLogoIcon} alt="FrameYaad" className="h-10 w-10 rounded-xl object-contain p-1" />
            <div>
              <p className="text-lg font-black leading-none text-on-surface">FrameYaad</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">Store</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {customerNavLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={navClassName} end={link.path === '/'}>
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link to="/cart" className="rounded-xl border border-outline-variant p-2.5 text-on-surface transition hover:bg-surface-container" title="Cart">
              <ShoppingBag className="h-5 w-5" />
            </Link>
            <Link to="/profile" className="rounded-xl border border-outline-variant p-2.5 text-on-surface transition hover:bg-surface-container" title="Profile">
              <User className="h-5 w-5" />
            </Link>
            <Link to="/fyadminlogin" className="rounded-xl bg-on-surface px-4 py-2.5 text-sm font-bold text-surface">
              Admin
            </Link>
          </div>

          <button className="rounded-xl border border-outline-variant p-2 md:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setMenuOpen(false)}>
          <aside className="h-full w-80 max-w-[85vw] bg-surface-container-lowest p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-8 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
                <img src={fyLogoIcon} alt="FrameYaad" className="h-10 w-10 rounded-xl object-contain p-1" />
                <span className="font-black text-on-surface">FrameYaad</span>
              </Link>
              <button className="rounded-lg p-2 hover:bg-surface-container" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {[...customerNavLinks, { name: 'Cart', path: '/cart' }, { name: 'Profile', path: '/profile' }].map((link) => (
                <NavLink key={link.path} to={link.path} className={navClassName} end={link.path === '/'} onClick={() => setMenuOpen(false)}>
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-outline-variant bg-surface-container-lowest">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-on-surface-variant sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <span>© {new Date().getFullYear()} FrameYaad</span>
          <span>Customer website and admin dashboard share one production frontend.</span>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
