import React, { useMemo } from 'react';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../../store/authStore';
import { useCustomerCommerceStore } from '../../../store/customerCommerceStore';
import { showError } from '../../../utils/toast';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const items = useCustomerCommerceStore((state) => state.cartItems);
  const updateQuantity = useCustomerCommerceStore((state) => state.updateCartQuantity);
  const removeItem = useCustomerCommerceStore((state) => state.removeCartItem);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [items]);

  const checkout = () => {
    if (isAuthenticated && user?.role === 'CUSTOMER') return navigate('/checkout');
    showError('Please login to continue to checkout');
    navigate('/profile', { state: { returnTo: '/checkout' } });
  };

  if (items.length === 0) return (
    <section className="mx-auto my-12 max-w-xl rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm">
      <ShoppingBag className="mx-auto h-10 w-10 text-black/30" />
      <h1 className="mt-4 text-2xl font-black text-black">Your cart is empty</h1>
      <p className="mt-2 text-sm text-black/50">Browse our frames and add your favorites to the bag.</p>
      <Link to="/products" className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-bold text-white">Continue shopping</Link>
    </section>
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black text-black">Your cart</h1>
      <p className="mt-1 text-sm text-black/50">Review your selected frames before checkout.</p>
      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">{items.map((item) => (
          <article key={item.key} className="flex gap-4 rounded-xl border border-black/10 bg-white p-3 shadow-sm sm:p-4">
            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-black/5 sm:h-28 sm:w-24">{item.imageUrl && <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2"><div><h2 className="truncate text-sm font-black">{item.name}</h2><p className="mt-1 text-xs text-black/50">{item.frameSize} · {item.material} · {item.color || 'Standard'}</p></div><button type="button" onClick={() => removeItem(item.key)} aria-label={`Remove ${item.name} from cart`} className="rounded-lg p-2 text-black/45 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex h-9 items-center rounded-lg border border-black/15"><button type="button" onClick={() => updateQuantity(item.key, item.quantity - 1)} aria-label="Decrease quantity" className="grid h-full w-9 place-items-center"><Minus className="h-3.5 w-3.5" /></button><span className="w-8 text-center text-xs font-black">{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.key, item.quantity + 1)} aria-label="Increase quantity" className="grid h-full w-9 place-items-center"><Plus className="h-3.5 w-3.5" /></button></div>
                <p className="text-base font-black">₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </article>
        ))}</div>
        <aside className="h-fit rounded-xl border border-black/10 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-lg font-black">Order summary</h2>
          <div className="mt-5 flex items-center justify-between border-b border-black/10 pb-4 text-sm"><span className="text-black/55">Subtotal</span><strong>₹{total.toLocaleString('en-IN')}</strong></div>
          <div className="flex items-center justify-between py-4"><span className="font-bold">Total</span><strong className="text-xl">₹{total.toLocaleString('en-IN')}</strong></div>
          <button type="button" onClick={checkout} className="h-12 w-full rounded-lg bg-black text-sm font-black text-white hover:bg-black/80">Checkout</button>
          <Link to="/products" className="mt-3 flex justify-center text-xs font-bold text-black/55 underline underline-offset-4">Continue shopping</Link>
        </aside>
      </div>
    </section>
  );
};

export default CartPage;
