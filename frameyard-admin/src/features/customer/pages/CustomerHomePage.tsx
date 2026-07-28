import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Heart, ShoppingCart } from 'lucide-react';
import useProducts from '../../../hooks/useProducts';
import heroFallback from '../../../assets/hero.png';
import { Product } from '../../../types';
import { HowItWorksSection } from '../components';

const CustomerHomePage: React.FC = () => {
  const { products, fetchProducts } = useProducts(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const featuredProducts = products.filter((product) => product.isActive).slice(0, 5);
  const favoriteProducts = useMemo(() => featuredProducts.slice(0, 4), [featuredProducts]);
  const heroCards: Array<Product | null> =
    featuredProducts.length > 0 ? featuredProducts : Array.from({ length: 5 }, () => null);
  const heroCardArcClasses = [
    'lg:translate-y-9 lg:-rotate-[4deg]',
    'lg:translate-y-3 lg:-rotate-[2deg]',
    'lg:-translate-y-3 lg:rotate-0',
    'lg:translate-y-3 lg:rotate-[2deg]',
    'lg:translate-y-9 lg:rotate-[4deg]',
  ];

  useEffect(() => {
    if (!selectedProductId && favoriteProducts.length > 0) {
      setSelectedProductId(favoriteProducts[Math.min(1, favoriteProducts.length - 1)].id);
    }
  }, [favoriteProducts, selectedProductId]);

  const getProductPricing = (product: Product) => {
    const variant = product.variants?.[0];
    const currentPrice = Number(variant?.offerPrice || variant?.price || 0);
    const originalPrice =
      variant?.offerPrice && Number(variant.offerPrice) < Number(variant.price)
        ? Number(variant.price)
        : Math.round(currentPrice * 1.35);
    const discount =
      originalPrice > currentPrice
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0;

    return {
      currentPrice,
      originalPrice,
      discount,
    };
  };

  return (
    <div className="bg-white text-black">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/products"
          className="mb-8 inline-flex items-center gap-4 rounded-md bg-black px-8 py-4 text-sm font-bold text-white shadow-[0_14px_30px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-black/90"
        >
          Shop All <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="w-full overflow-x-auto overflow-y-visible px-4 pb-14 pt-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6 lg:overflow-visible lg:px-0">
          <div className="mx-auto flex min-w-max items-end justify-start gap-4 sm:gap-5 lg:min-w-0 lg:max-w-7xl lg:justify-center lg:gap-6">
            {heroCards.map((product, index) => {
              const imageUrl = product?.images?.[0]?.imageUrl;
              const name = product?.name || `Frame ${index + 1}`;

              return (
                <Link
                  key={product?.id || index}
                  to={product?.id ? `/product/${product.id}` : '/products'}
                  className={`group w-[168px] shrink-0 overflow-hidden rounded-2xl bg-[#f4f0ea] shadow-[0_18px_45px_rgba(0,0,0,0.12)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.16)] sm:w-[210px] md:w-[240px] lg:w-1/5 lg:max-w-[235px] ${
                    heroCardArcClasses[index] || ''
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
        <div className="mb-14 text-center">
          <p className="text-xl font-black uppercase tracking-[0.22em] text-[#c07d42]">FrameYaad Favorites</p>
          <div className="mx-auto mt-7 flex w-28 items-center justify-center gap-2 text-[#c07d42]">
            <span className="h-px flex-1 bg-[#c07d42]" />
            <span className="h-3 w-3 rotate-45 border-2 border-[#c07d42]" />
            <span className="h-px flex-1 bg-[#c07d42]" />
          </div>
          <p className="mt-7 text-lg font-semibold text-black/65">Loved by our customers. Handpicked bestsellers just for you.</p>
        </div>

        <div className="flex gap-7 overflow-x-auto px-1 pb-8 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:justify-center">
          {favoriteProducts.map((product) => {
            const isSelected = selectedProductId === product.id;
            const pricing = getProductPricing(product);

            return (
              <article
                key={product.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedProductId(product.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedProductId(product.id);
                  }
                }}
                className={`group relative w-[280px] shrink-0 cursor-pointer overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.16)] sm:w-[310px] ${
                  isSelected
                    ? 'scale-[1.03] outline outline-[7px] outline-black shadow-[0_28px_80px_rgba(0,0,0,0.20)]'
                    : 'outline outline-0 outline-transparent'
                }`}
              >
                <button
                  type="button"
                  className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition hover:scale-105"
                  aria-label={`Add ${product.name} to wishlist`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <Heart className="h-7 w-7" />
                </button>

                <div className="aspect-[4/3] bg-[#f4f0ea]">
                {product.images?.[0]?.imageUrl ? (
                  <img src={product.images[0].imageUrl} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <img src={heroFallback} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-black text-black">{product.name}</h3>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-3xl font-black text-black">
                      {pricing.currentPrice > 0 ? `₹${pricing.currentPrice.toLocaleString('en-IN')}` : '₹0'}
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-lg font-bold text-black/45 line-through">
                        ₹{pricing.originalPrice.toLocaleString('en-IN')}
                      </span>
                      {pricing.discount > 0 && (
                        <span className="rounded-lg bg-[#f7dfc8] px-3 py-1.5 text-sm font-black text-[#c55f12]">
                          {pricing.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`flex h-14 w-14 items-center justify-center rounded-xl border border-black/20 transition ${
                      isSelected ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'
                    }`}
                    aria-label={`Add ${product.name} to cart`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <ShoppingCart className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </section>

      <HowItWorksSection />
    </div>
  );
};

export default CustomerHomePage;
