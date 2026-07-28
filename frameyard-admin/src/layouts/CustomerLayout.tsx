import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerNavbar from '../features/customer/components/CustomerNavbar';

const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <CustomerNavbar />

      <main>
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
