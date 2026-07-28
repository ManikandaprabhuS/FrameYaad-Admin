import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Product } from '../../../types';
import FeaturedProductCard, { FeaturedProductPricing } from './FeaturedProductCard';

interface FeaturedProductsCarouselProps {
  products: Product[];
}

const CARD_WIDTH = 300;
const CARD_GAP = 56;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getProductPricing = (product: Product): FeaturedProductPricing => {
  const variant = product.variants?.[0];
  const currentPrice = Number(variant?.offerPrice || variant?.price || 0);
  const originalPrice =
    variant?.offerPrice && Number(variant.offerPrice) < Number(variant.price)
      ? Number(variant.price)
      : Math.round(currentPrice * 1.35);
  const discount =
    originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  return { currentPrice, originalPrice, discount };
};

const FeaturedProductsCarousel: React.FC<FeaturedProductsCarouselProps> = ({ products }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [manualIndex, setManualIndex] = useState<number | null>(1);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(1);

  const featuredProducts = useMemo(() => products.filter((product) => product.isActive).slice(0, 7), [products]);
  const maxIndex = Math.max(featuredProducts.length - 1, 0);
  const scrollIndex = clamp(1 + scrollProgress * Math.max(maxIndex - 1, 0), 0, maxIndex);
  const activeIndex = clamp(manualIndex ?? Math.round(scrollIndex), 0, maxIndex);
  const desktopOffset = 560 - activeIndex * (CARD_WIDTH + CARD_GAP) - CARD_WIDTH / 2;

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const rawProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const nextProgress = clamp(rawProgress, 0, 1);
      setScrollProgress(nextProgress);
      setManualIndex(clamp(Math.round(1 + nextProgress * Math.max(maxIndex - 1, 0)), 0, maxIndex));
    };

    const onScroll = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [maxIndex]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight') {
      setManualIndex((current) => clamp((current ?? activeIndex) + 1, 0, maxIndex));
    }

    if (event.key === 'ArrowLeft') {
      setManualIndex((current) => clamp((current ?? activeIndex) - 1, 0, maxIndex));
    }
  };

  const handleMobileScroll = () => {
    const track = mobileTrackRef.current;
    if (!track) return;

    const firstCard = track.querySelector<HTMLElement>('[data-featured-card]');
    const cardStep = (firstCard?.offsetWidth || 1) + 20;
    setMobileActiveIndex(clamp(Math.round(track.scrollLeft / cardStep), 0, maxIndex));
  };

  const selectMobileCard = (index: number) => {
    setMobileActiveIndex(index);
    const track = mobileTrackRef.current;
    const target = track?.querySelectorAll<HTMLElement>('[data-featured-card]')[index];
    target?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="featured-products"
      className="overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby="featured-products-heading"
      onKeyDown={handleKeyDown}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="text-xl font-black uppercase tracking-[0.22em] text-[#c07d42]">FrameYaad Favorites</p>
          <div className="mx-auto mt-7 flex w-28 items-center justify-center gap-2 text-[#c07d42]">
            <span className="h-px flex-1 bg-[#c07d42]" />
            <span className="h-3 w-3 rotate-45 border-2 border-[#c07d42]" />
            <span className="h-px flex-1 bg-[#c07d42]" />
          </div>
          <p id="featured-products-heading" className="mt-7 text-lg font-semibold text-black/65">
            Loved by our customers. Handpicked bestsellers just for you.
          </p>
        </div>

        <div className="relative hidden h-[610px] overflow-visible px-6 pt-16 md:block" aria-label="Featured product carousel">
          <div
            className="flex items-center gap-14 px-2 transition-transform duration-500 ease-in-out will-change-transform"
            style={{ transform: `translate3d(${desktopOffset}px, 0, 0)` }}
          >
            {featuredProducts.map((product, index) => {
              const isActive = index === activeIndex;

              return (
                <FeaturedProductCard
                  key={product.id}
                  product={product}
                  pricing={getProductPricing(product)}
                  isActive={isActive}
                  onSelect={() => setManualIndex(index)}
                  className="w-[300px]"
                  style={{
                    transform: `translate3d(0, ${isActive ? 18 : 42}px, 0) scale(${isActive ? 1.12 : 0.92})`,
                    zIndex: isActive ? 20 : 10,
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="md:hidden">
          <div
            ref={mobileTrackRef}
            onScroll={handleMobileScroll}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-visible px-[10vw] pb-12 pt-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Swipe featured products"
          >
            {featuredProducts.map((product, index) => {
              const isActive = index === mobileActiveIndex;

              return (
                <div key={product.id} data-featured-card className="w-[78vw] max-w-[320px] shrink-0 snap-center">
                  <FeaturedProductCard
                    product={product}
                    pricing={getProductPricing(product)}
                    isActive={isActive}
                    onSelect={() => selectMobileCard(index)}
                    style={{ transform: `translate3d(0, ${isActive ? 0 : 14}px, 0) scale(${isActive ? 1 : 0.93})` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsCarousel;
