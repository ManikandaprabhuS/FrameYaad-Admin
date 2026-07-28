import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import useProducts from '../../../hooks/useProducts';
import fyLogo from '../../../assets/fy-logo.jpeg';

const CustomerHomePage: React.FC = () => {
  const { products, fetchProducts } = useProducts(true);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const featuredProducts = products.filter((product) => product.isActive).slice(0, 3);

  return (
    <div className="space-y-16">
      <section className="grid gap-10 rounded-[2rem] bg-surface-container-lowest p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:grid-cols-[1.1fr_0.9fr] md:p-12">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">FrameYaad</p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-on-surface md:text-6xl">
            Premium frames for memories that deserve a wall.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-on-surface-variant">
            Discover handcrafted frames, clean finishes, and made-for-home designs from the same FrameYaad platform.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary shadow-sm transition hover:bg-primary/90">
              Shop Products <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/orders" className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant px-6 py-3 text-sm font-bold text-on-surface transition hover:bg-surface-container">
              Track Orders
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center rounded-[1.5rem] bg-background p-8">
          <img src={fyLogo} alt="FrameYaad" className="max-h-80 rounded-full object-contain" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { icon: ShoppingBag, title: 'Curated frames', text: 'Browse active products directly from your existing inventory.' },
          { icon: ShieldCheck, title: 'Secure checkout', text: 'Built to reuse the current auth, API, and order infrastructure.' },
          { icon: Truck, title: 'Order tracking', text: 'A customer order area is ready for your next checkout integration.' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-lg font-bold text-on-surface">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">{item.text}</p>
            </div>
          );
        })}
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-on-surface">Featured products</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Live from your existing product service.</p>
          </div>
          <Link to="/products" className="text-sm font-bold text-primary">View all</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest transition hover:-translate-y-1 hover:shadow-lg">
              <div className="aspect-[4/3] bg-surface-container">
                {product.images?.[0]?.imageUrl ? (
                  <img src={product.images[0].imageUrl} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-on-surface-variant">No image</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-on-surface">{product.name}</h3>
                <p className="mt-1 text-sm text-on-surface-variant">{product.material}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CustomerHomePage;
