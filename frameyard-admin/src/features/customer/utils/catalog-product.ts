import type { Product, ProductVariant } from '../../../types';

export type CatalogPricing = {
  currentPrice: number;
  originalPrice: number;
  discount: number;
  variant?: ProductVariant;
};

export const getCatalogPricing = (product: Product): CatalogPricing => {
  const variants = (product.variants ?? []).filter((variant) => variant.isActive !== false);
  const variant = [...variants].sort((left, right) => {
    const leftPrice = Number(left.offerPrice ?? left.price ?? 0);
    const rightPrice = Number(right.offerPrice ?? right.price ?? 0);
    return leftPrice - rightPrice;
  })[0];
  const currentPrice = Number(variant?.offerPrice ?? variant?.price ?? 0);
  const originalPrice = Number(variant?.mrp ?? variant?.price ?? currentPrice);
  const discount = originalPrice > currentPrice && originalPrice > 0
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return { currentPrice, originalPrice, discount, variant };
};
