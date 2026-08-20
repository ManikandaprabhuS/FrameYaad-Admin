import React, { useEffect, useMemo } from 'react';
import { ArrowDown } from 'lucide-react';
import useProducts from '../../../hooks/useProducts';
import { FeaturedProductsCarousel, HowItWorksSection, PremiumHeroCarousel } from '../components';

const CustomerHomePage: React.FC = () => {
  const { products, loading, error, fetchProducts } = useProducts(false);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts({ page: 1, limit: 50, isActive: true, publicCatalog: true });
    }
  }, [fetchProducts, products.length]);

  const heroProducts = useMemo(() => products.slice(0, 12), [products]);

  return (
    <div className="bg-white text-black">
      <section className="flex w-full flex-col px-0 pt-4">
      <PremiumHeroCarousel products={heroProducts} loading={loading} error={error} />
        <a
          href="#featured-products"
          className="mx-auto mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/20 text-black transition hover:bg-black hover:text-white"
          aria-label="Scroll to featured products"
        >
          <ArrowDown className="h-4 w-4" />
        </a>
      </section>

      <FeaturedProductsCarousel products={products} />
      <HowItWorksSection />
    </div>
  );
};

export default CustomerHomePage;
