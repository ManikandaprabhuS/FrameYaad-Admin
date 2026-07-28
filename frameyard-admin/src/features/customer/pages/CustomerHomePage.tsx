import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight } from 'lucide-react';
import useProducts from '../../../hooks/useProducts';
import heroFallback from '../../../assets/hero.png';
import { Product } from '../../../types';

const CustomerHomePage: React.FC = () => {
  const { products, fetchProducts } = useProducts(true);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const featuredProducts = products.filter((product) => product.isActive).slice(0, 5);
  const heroCards: Array<Product | null> =
    featuredProducts.length > 0 ? featuredProducts : Array.from({ length: 5 }, () => null);

  return (
    <div className="bg-white text-black">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/products"
          className="mb-8 inline-flex items-center gap-4 rounded-md bg-black px-8 py-4 text-sm font-bold text-white shadow-[0_14px_30px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-black/90"
        >
          Shop All <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="grid w-full grid-cols-2 items-end gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {heroCards.map((product, index) => {
            const imageUrl = product?.images?.[0]?.imageUrl;
            const name = product?.name || `Frame ${index + 1}`;

            return (
              <Link
                key={product?.id || index}
                to={product?.id ? `/product/${product.id}` : '/products'}
                className={`group overflow-hidden rounded-2xl bg-[#f4f0ea] shadow-[0_18px_45px_rgba(0,0,0,0.12)] transition hover:-translate-y-2 ${
                  index % 2 === 0 ? 'lg:translate-y-4' : 'lg:-translate-y-2'
                }`}
              >
                <img
                  src={imageUrl || heroFallback}
                  alt={name}
                  className="aspect-[3/4] h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </Link>
            );
          })}
        </div>

        <a
          href="#featured-products"
          className="mt-12 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/20 text-black transition hover:bg-black hover:text-white"
          aria-label="Scroll to featured products"
        >
          <ArrowDown className="h-4 w-4" />
        </a>
      </section>

      <section id="featured-products" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-black/50">FrameYaad Collection</p>
          <h2 className="mt-3 text-3xl font-black text-black">Shop our latest frames</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featuredProducts.slice(0, 3).map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:-translate-y-1 hover:shadow-lg">
              <div className="aspect-[4/3] bg-[#f4f0ea]">
                {product.images?.[0]?.imageUrl ? (
                  <img src={product.images[0].imageUrl} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <img src={heroFallback} alt={product.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-black">{product.name}</h3>
                <p className="mt-1 text-sm text-black/60">{product.material}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CustomerHomePage;
