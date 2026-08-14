import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  RotateCcw,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import ProductCatalogCard from '../components/ProductCatalogCard';
import { getCatalogPricing } from '../utils/catalog-product';
import useProducts from '../../../hooks/useProducts';
import type { Product } from '../../../types';

const PRODUCTS_PER_PAGE = 12;

type SortOption = 'featured' | 'price-low' | 'price-high' | 'newest' | 'name';
type AvailabilityFilter = 'in-stock' | 'out-of-stock';

const toggleValue = <T,>(values: T[], value: T): T[] =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

const totalStockFor = (product: Product) =>
  (product.variants ?? []).reduce((total, variant) => total + Number(variant.stockQuantity ?? 0), 0);

const productMatchesSize = (product: Product, selectedSizes: string[]) =>
  selectedSizes.length === 0 || product.variants?.some((variant) => selectedSizes.includes(variant.frameSize));

const CustomerProductsPage: React.FC = () => {
  const { products, loading, error, fetchProducts } = useProducts(false);
  const [materials, setMaterials] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [availability, setAvailability] = useState<AvailabilityFilter[]>([]);
  const [saleOnly, setSaleOnly] = useState(false);
  const [maximumPrice, setMaximumPrice] = useState<number | null>(null);
  const [sort, setSort] = useState<SortOption>('featured');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [wishedProducts, setWishedProducts] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts({ page: 1, limit: 50, isActive: true, publicCatalog: true });
  }, [fetchProducts]);

  const activeProducts = useMemo(() => products.filter((product) => product.isActive), [products]);
  const materialOptions = useMemo(
    () => [...new Set(activeProducts.map((product) => product.material).filter(Boolean))].sort(),
    [activeProducts],
  );
  const sizeOptions = useMemo(
    () => [...new Set(activeProducts.flatMap((product) => product.variants?.map((variant) => variant.frameSize) ?? []).filter(Boolean))].sort(),
    [activeProducts],
  );
  const priceCeiling = useMemo(() => {
    const highestPrice = Math.max(0, ...activeProducts.map((product) => getCatalogPricing(product).currentPrice));
    return Math.max(500, Math.ceil(highestPrice / 500) * 500);
  }, [activeProducts]);
  const effectiveMaximumPrice = maximumPrice ?? priceCeiling;

  const filteredProducts = useMemo(() => {
    const filtered = activeProducts.filter((product) => {
      const pricing = getCatalogPricing(product);
      const stock = totalStockFor(product);
      const materialMatches = materials.length === 0 || materials.includes(product.material);
      const stockMatches = availability.length === 0
        || (availability.includes('in-stock') && stock > 0)
        || (availability.includes('out-of-stock') && stock <= 0);

      return materialMatches
        && productMatchesSize(product, sizes)
        && pricing.currentPrice <= effectiveMaximumPrice
        && (!saleOnly || pricing.discount > 0)
        && stockMatches;
    });

    return [...filtered].sort((left, right) => {
      if (sort === 'price-low') return getCatalogPricing(left).currentPrice - getCatalogPricing(right).currentPrice;
      if (sort === 'price-high') return getCatalogPricing(right).currentPrice - getCatalogPricing(left).currentPrice;
      if (sort === 'newest') return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      if (sort === 'name') return left.name.localeCompare(right.name);
      return 0;
    });
  }, [activeProducts, availability, effectiveMaximumPrice, materials, saleOnly, sizes, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );
  const startItem = filteredProducts.length === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length);
  const activeFilterCount = materials.length + sizes.length + availability.length + Number(saleOnly) + Number(maximumPrice !== null);

  const updateFilter = (callback: () => void) => {
    callback();
    setPage(1);
  };

  const clearFilters = () => {
    setMaterials([]);
    setSizes([]);
    setAvailability([]);
    setSaleOnly(false);
    setMaximumPrice(null);
    setPage(1);
  };

  const removeChip = (kind: 'material' | 'size' | 'availability' | 'sale' | 'price', value?: string) => {
    updateFilter(() => {
      if (kind === 'material' && value) setMaterials((current) => current.filter((item) => item !== value));
      if (kind === 'size' && value) setSizes((current) => current.filter((item) => item !== value));
      if (kind === 'availability' && value) setAvailability((current) => current.filter((item) => item !== value));
      if (kind === 'sale') setSaleOnly(false);
      if (kind === 'price') setMaximumPrice(null);
    });
  };

  const filterPanel = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-black/10 px-4 py-4">
        <h2 className="text-xs font-black uppercase tracking-[0.15em]">Filters</h2>
        <button type="button" onClick={clearFilters} className="text-[10px] font-semibold text-black/50 underline underline-offset-2 hover:text-black">
          Clear all
        </button>
      </div>

      <div className="divide-y divide-black/10 overflow-y-auto">
        <FilterSection title="By material">
          {materialOptions.length === 0 ? <FilterHint /> : materialOptions.map((material) => (
            <CheckRow
              key={material}
              label={material}
              count={activeProducts.filter((product) => product.material === material).length}
              checked={materials.includes(material)}
              onChange={() => updateFilter(() => setMaterials((current) => toggleValue(current, material)))}
            />
          ))}
        </FilterSection>

        <FilterSection title="By frame size">
          {sizeOptions.length === 0 ? <FilterHint /> : sizeOptions.map((size) => (
            <CheckRow
              key={size}
              label={size}
              count={activeProducts.filter((product) => product.variants?.some((variant) => variant.frameSize === size)).length}
              checked={sizes.includes(size)}
              onChange={() => updateFilter(() => setSizes((current) => toggleValue(current, size)))}
            />
          ))}
        </FilterSection>

        <FilterSection title="By price">
          <div className="mb-2 flex items-center justify-between text-[10px] font-bold">
            <span>₹0</span>
            <span>₹{effectiveMaximumPrice.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min={0}
            max={priceCeiling}
            step={Math.max(50, Math.round(priceCeiling / 20))}
            value={effectiveMaximumPrice}
            aria-label="Maximum product price"
            onChange={(event) => updateFilter(() => setMaximumPrice(Number(event.target.value)))}
            className="w-full accent-black"
          />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setPage(1)} className="rounded-md bg-black px-3 py-2 text-[10px] font-bold text-white">Apply</button>
            <button type="button" onClick={() => updateFilter(() => setMaximumPrice(null))} className="rounded-md border border-black/15 px-3 py-2 text-[10px] font-bold">Reset</button>
          </div>
        </FilterSection>

        <FilterSection title="By promotions">
          <CheckRow
            label="On sale"
            count={activeProducts.filter((product) => getCatalogPricing(product).discount > 0).length}
            checked={saleOnly}
            onChange={() => updateFilter(() => setSaleOnly((current) => !current))}
          />
        </FilterSection>

        <FilterSection title="Availability">
          <CheckRow
            label="In stock"
            count={activeProducts.filter((product) => totalStockFor(product) > 0).length}
            checked={availability.includes('in-stock')}
            onChange={() => updateFilter(() => setAvailability((current) => toggleValue(current, 'in-stock')))}
          />
          <CheckRow
            label="Out of stock"
            count={activeProducts.filter((product) => totalStockFor(product) <= 0).length}
            checked={availability.includes('out-of-stock')}
            onChange={() => updateFilter(() => setAvailability((current) => toggleValue(current, 'out-of-stock')))}
          />
        </FilterSection>
      </div>

      <div className="mt-auto border-t border-black/10 p-4">
        <button type="button" onClick={clearFilters} className="flex w-full items-center justify-center gap-2 rounded-md border border-black/20 py-2.5 text-[10px] font-bold uppercase tracking-wide hover:bg-black hover:text-white">
          <RotateCcw className="h-3.5 w-3.5" /> Clear all filters
        </button>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto flex max-w-[1500px] items-start">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[230px] shrink-0 border-r border-black/10 lg:block">
          {filterPanel}
        </aside>

        <div className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">FrameYaad collection</p>
              <h1 className="mt-1 text-2xl font-black text-black sm:text-3xl">All Frames</h1>
              <p className="mt-1 text-xs text-black/50">
                Showing {startItem}–{endItem} of {filteredProducts.length} products
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="relative inline-flex h-10 items-center gap-2 rounded-lg border border-black/15 bg-white px-3 text-xs font-bold lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
                {activeFilterCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-black px-1 text-[10px] text-white">{activeFilterCount}</span>}
              </button>
              <label className="relative flex h-10 items-center gap-2 rounded-lg border border-black/15 bg-white pl-3 text-[10px] font-semibold text-black/55">
                Sort by:
                <select
                  value={sort}
                  onChange={(event) => { setSort(event.target.value as SortOption); setPage(1); }}
                  className="h-full appearance-none bg-transparent py-0 pl-1 pr-9 text-xs font-bold text-black outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to high</option>
                  <option value="price-high">Price: High to low</option>
                  <option value="newest">Newest</option>
                  <option value="name">Name</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-black" />
              </label>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-b border-black/10 py-3">
              <span className="mr-1 text-[10px] font-bold uppercase text-black/45">Active filters:</span>
              {materials.map((value) => <FilterChip key={`material-${value}`} label={value} onRemove={() => removeChip('material', value)} />)}
              {sizes.map((value) => <FilterChip key={`size-${value}`} label={value} onRemove={() => removeChip('size', value)} />)}
              {availability.map((value) => <FilterChip key={value} label={value === 'in-stock' ? 'In stock' : 'Out of stock'} onRemove={() => removeChip('availability', value)} />)}
              {saleOnly && <FilterChip label="On sale" onRemove={() => removeChip('sale')} />}
              {maximumPrice !== null && <FilterChip label={`Up to ₹${maximumPrice.toLocaleString('en-IN')}`} onRemove={() => removeChip('price')} />}
              <button type="button" onClick={clearFilters} className="ml-auto text-[10px] font-bold underline underline-offset-2">Clear all</button>
            </div>
          )}

          {error && !loading ? (
            <div className="my-8 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-sm font-bold text-red-700">Unable to load products</p>
              <p className="mt-1 text-xs text-red-600">{error}</p>
              <button type="button" onClick={() => fetchProducts({ page: 1, limit: 50, isActive: true, publicCatalog: true })} className="mt-4 rounded-md bg-black px-4 py-2 text-xs font-bold text-white">Retry</button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 gap-3 py-6 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }, (_, index) => <ProductSkeleton key={index} />)}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="my-8 flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-black/20 bg-white px-6 text-center">
              <PackageOpen className="h-9 w-9 text-black/35" />
              <h2 className="mt-4 text-lg font-black">No frames found</h2>
              <p className="mt-1 max-w-sm text-xs text-black/50">No products match the selected filters. Clear the filters to explore the full collection.</p>
              <button type="button" onClick={clearFilters} className="mt-4 rounded-md bg-black px-4 py-2 text-xs font-bold text-white">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 py-6 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              {paginatedProducts.map((product) => (
                <ProductCatalogCard
                  key={product.id}
                  product={product}
                  wished={wishedProducts.includes(product.id)}
                  onToggleWishlist={(productId) => setWishedProducts((current) => toggleValue(current, productId))}
                />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-black/10 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-black/50">Showing {startItem}–{endItem} of {filteredProducts.length}</p>
              <div className="flex items-center gap-1.5">
                <PageButton label="Previous page" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft className="h-4 w-4" /></PageButton>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    aria-current={pageNumber === currentPage ? 'page' : undefined}
                    className={`grid h-8 min-w-8 place-items-center rounded-md border px-2 text-xs font-bold ${pageNumber === currentPage ? 'border-black bg-black text-white' : 'border-black/10 bg-white text-black hover:border-black/40'}`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <PageButton label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}><ChevronRight className="h-4 w-4" /></PageButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-[150] lg:hidden">
          <button type="button" aria-label="Close filters" className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" onClick={() => setFiltersOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[min(88vw,340px)] overflow-hidden bg-white shadow-2xl">
            <button type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)} className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-black text-white">
              <X className="h-4 w-4" />
            </button>
            {filterPanel}
          </aside>
        </div>
      )}
    </section>
  );
};

const FilterSection: React.FC<React.PropsWithChildren<{ title: string }>> = ({ title, children }) => (
  <section className="px-4 py-4">
    <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.12em] text-black/75">{title}</h3>
    <div className="space-y-2.5">{children}</div>
  </section>
);

const CheckRow: React.FC<{ label: string; count: number; checked: boolean; onChange: () => void }> = ({ label, count, checked, onChange }) => (
  <label className="flex cursor-pointer items-center gap-2 text-[11px] text-black/70">
    <input type="checkbox" checked={checked} onChange={onChange} className="h-3.5 w-3.5 rounded border-black/25 accent-black" />
    <span className="min-w-0 flex-1 truncate">{label}</span>
    <span className="text-[9px] text-black/35">({count})</span>
  </label>
);

const FilterHint = () => <p className="text-[10px] text-black/40">No options available</p>;

const FilterChip: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <button type="button" onClick={onRemove} className="inline-flex items-center gap-1.5 rounded-md border border-black/15 bg-white px-2.5 py-1.5 text-[10px] font-semibold hover:border-black/40">
    {label}<X className="h-3 w-3" />
  </button>
);

const ProductSkeleton = () => (
  <div className="overflow-hidden rounded-xl border border-black/5 bg-white" aria-hidden="true">
    <div className="aspect-[4/3] animate-pulse bg-black/10" />
    <div className="space-y-3 p-4">
      <div className="h-3 w-4/5 animate-pulse rounded bg-black/10" />
      <div className="h-2 w-2/5 animate-pulse rounded bg-black/5" />
      <div className="h-4 w-1/3 animate-pulse rounded bg-black/10" />
    </div>
  </div>
);

const PageButton: React.FC<React.PropsWithChildren<{ label: string; disabled: boolean; onClick: () => void }>> = ({ label, disabled, onClick, children }) => (
  <button type="button" aria-label={label} disabled={disabled} onClick={onClick} className="grid h-8 w-8 place-items-center rounded-md border border-black/10 bg-white disabled:cursor-not-allowed disabled:opacity-35 hover:border-black/40">
    {children}
  </button>
);

export default CustomerProductsPage;
