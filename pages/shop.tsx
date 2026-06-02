import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, X, ChevronDown, Heart, ArrowRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  category: string[];
  technique: string[];
  tag?: string;
  isNew?: boolean;
  isLimited?: boolean;
  isBestSeller?: boolean;
  image: string;
  hoverImage: string;
  sizes: string[];
  soldOut?: boolean;
}

// ─── FadeUp helper ────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ShopProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedSize) return;
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="group relative">
      {/* Image container */}
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
          style={{ opacity: hovered ? 0 : 1, transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />
        <img
          src={product.hoverImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(1.04)' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-white text-[#0D0D0D] text-[9px] tracking-[0.2em] uppercase px-2.5 py-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              New
            </span>
          )}
          {product.isLimited && (
            <span className="bg-[#0D0D0D] text-white text-[9px] tracking-[0.2em] uppercase px-2.5 py-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Limited
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#C0B49A] text-white text-[9px] tracking-[0.2em] uppercase px-2.5 py-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Best Seller
            </span>
          )}
          {product.soldOut && (
            <span className="bg-[#0D0D0D]/60 text-white text-[9px] tracking-[0.2em] uppercase px-2.5 py-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white transition-colors duration-200"
          aria-label="Add to wishlist"
        >
          <Heart
            size={14}
            strokeWidth={1.5}
            className={wishlisted ? 'fill-[#0D0D0D] text-[#0D0D0D]' : 'text-[#0D0D0D]'}
          />
        </button>

        {/* Quick size select overlay */}
        <AnimatePresence>
          {hovered && !product.soldOut && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-3"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => { e.preventDefault(); setSelectedSize(size); }}
                    className={`text-[10px] tracking-wide px-2.5 py-1 border transition-colors duration-150 ${
                      selectedSize === size
                        ? 'border-[#0D0D0D] bg-[#0D0D0D] text-white'
                        : 'border-[#0D0D0D]/20 text-[#0D0D0D] hover:border-[#0D0D0D]/60'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button
                onClick={handleAddToCart}
                className={`w-full text-[10px] tracking-[0.18em] uppercase py-2.5 transition-all duration-200 ${
                  selectedSize
                    ? addedToCart
                      ? 'bg-[#C0B49A] text-white'
                      : 'bg-[#0D0D0D] text-white hover:bg-[#0D0D0D]/80'
                    : 'bg-[#0D0D0D]/10 text-[#0D0D0D]/40 cursor-not-allowed'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {addedToCart ? 'Added to Cart' : selectedSize ? 'Add to Cart' : 'Select Size'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      {/* Product info */}
      <div className="mt-3">
        <Link to={`/products/${product.id}`}>
          <h3
            className="text-[#0D0D0D] font-light hover:text-[#0D0D0D]/70 transition-colors duration-200 leading-snug mb-1"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.05rem' }}
          >
            {product.name}
          </h3>
        </Link>
        <p className="text-[#0D0D0D]/60 text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {product.priceDisplay}
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'tees', label: 'T-Shirts' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'jackets', label: 'Jackets' },
  { id: 'accessories', label: 'Accessories' },
];

const TECHNIQUES = [
  { id: 'puff', label: 'Puff Print' },
  { id: 'embroidery', label: 'Embroidery' },
  { id: 'dtf', label: 'DTF Print' },
  { id: 'screen', label: 'Screen Print' },
  { id: 'mixed', label: 'Mixed Media' },
];

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'new', label: 'New Arrivals' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'limited', label: 'Limited Drops' },
];

const ALL_PRODUCTS: Product[] = [
  { id: 'puff-arch-oversized-tee', name: 'Puff Arch Oversized Tee', price: 3999, priceDisplay: '₹3,999', category: ['tees'], technique: ['puff'], tag: 'New', isNew: true, image: '/airo-assets/images/pages/home/product-1', hoverImage: '/airo-assets/images/pages/home/product-2', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'embroidered-script-hoodie', name: 'Embroidered Script Hoodie', price: 6499, priceDisplay: '₹6,499', category: ['hoodies'], technique: ['embroidery'], isNew: true, image: '/airo-assets/images/pages/home/product-2', hoverImage: '/airo-assets/images/pages/home/product-3', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'cargo-utility-trousers', name: 'Cargo Utility Trousers', price: 5499, priceDisplay: '₹5,499', category: ['bottoms'], technique: ['mixed'], image: '/airo-assets/images/pages/home/product-3', hoverImage: '/airo-assets/images/pages/home/product-4', sizes: ['28', '30', '32', '34', '36'] },
  { id: 'signature-graphic-tee', name: 'Signature Graphic Tee', price: 3499, priceDisplay: '₹3,499', category: ['tees'], technique: ['screen'], isBestSeller: true, image: '/airo-assets/images/pages/home/product-4', hoverImage: '/airo-assets/images/pages/home/product-5', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'embroidered-coach-jacket', name: 'Embroidered Coach Jacket', price: 7999, priceDisplay: '₹7,999', category: ['jackets'], technique: ['embroidery'], isBestSeller: true, image: '/airo-assets/images/pages/home/product-5', hoverImage: '/airo-assets/images/pages/home/product-6', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'dtf-oversized-tee', name: 'DTF Oversized Tee', price: 3799, priceDisplay: '₹3,799', category: ['tees'], technique: ['dtf'], image: '/airo-assets/images/pages/home/product-6', hoverImage: '/airo-assets/images/pages/home/product-1', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'puff-monogram-tee-drop-003', name: 'Puff Monogram Tee — Drop 003', price: 4999, priceDisplay: '₹4,999', category: ['tees'], technique: ['puff'], isLimited: true, image: '/airo-assets/images/pages/shop/product-7', hoverImage: '/airo-assets/images/pages/home/product-2', sizes: ['S', 'M', 'L', 'XL'], soldOut: false },
  { id: 'mixed-media-varsity', name: 'Mixed Media Varsity', price: 7499, priceDisplay: '₹7,499', category: ['jackets'], technique: ['mixed', 'embroidery'], isLimited: true, image: '/airo-assets/images/pages/shop/product-8', hoverImage: '/airo-assets/images/pages/home/product-4', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'screen-print-crewneck', name: 'Screen Print Crewneck', price: 5299, priceDisplay: '₹5,299', category: ['hoodies'], technique: ['screen'], isLimited: true, image: '/airo-assets/images/pages/shop/product-9', hoverImage: '/airo-assets/images/pages/home/product-3', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'puff-logo-hoodie', name: 'Puff Logo Hoodie', price: 6999, priceDisplay: '₹6,999', category: ['hoodies'], technique: ['puff'], isNew: true, image: '/airo-assets/images/pages/shop/product-10', hoverImage: '/airo-assets/images/pages/home/product-1', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'embroidered-cargo-shorts', name: 'Embroidered Cargo Shorts', price: 4499, priceDisplay: '₹4,499', category: ['bottoms'], technique: ['embroidery'], image: '/airo-assets/images/pages/shop/product-11', hoverImage: '/airo-assets/images/pages/home/product-5', sizes: ['28', '30', '32', '34'] },
  { id: 'dtf-graphic-crewneck', name: 'DTF Graphic Crewneck', price: 5799, priceDisplay: '₹5,799', category: ['hoodies'], technique: ['dtf'], isBestSeller: true, image: '/airo-assets/images/pages/shop/product-12', hoverImage: '/airo-assets/images/pages/home/product-6', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTechniques, setActiveTechniques] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const toggleTechnique = useCallback((id: string) => {
    setActiveTechniques((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }, []);

  const clearFilters = () => {
    setActiveCategory('all');
    setActiveTechniques([]);
    setPriceRange([0, 10000]);
  };

  const hasActiveFilters = activeCategory !== 'all' || activeTechniques.length > 0;

  // Filter
  let filtered = ALL_PRODUCTS.filter((p) => {
    const catMatch = activeCategory === 'all' || p.category.includes(activeCategory);
    const techMatch = activeTechniques.length === 0 || activeTechniques.some((t) => p.technique.includes(t));
    const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
    return catMatch && techMatch && priceMatch;
  });

  // Sort
  if (sortBy === 'new') filtered = [...filtered].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  else if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === 'limited') filtered = [...filtered].sort((a, b) => (b.isLimited ? 1 : 0) - (a.isLimited ? 1 : 0));

  const activeSortLabel = SORT_OPTIONS.find((o) => o.id === sortBy)?.label ?? 'Featured';

  return (
    <>
      <Helmet>
        <title>Shop — PRAMADE</title>
        <meta name="description" content="Shop PRAMADE's premium streetwear collection. Puff print, embroidery, DTF, screen print — limited edition drops and everyday essentials." />
        <meta property="og:title" content="Shop — PRAMADE" />
        <meta property="og:description" content="Premium streetwear. Limited drops. Shop the full PRAMADE collection." />
      </Helmet>

      {/* ── Hero Banner ────────────────────────────────────────────────────── */}
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden flex items-end">
        <img
          src="/airo-assets/images/pages/shop/banner"
          alt="Shop PRAMADE"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-12 pb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-white font-light leading-none"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(48px, 6vw, 88px)' }}
          >
            The Collection
          </motion.h1>
        </div>
      </div>

      {/* ── Category Pills ─────────────────────────────────────────────────── */}
      <div className="bg-[#F8F7F4] border-b border-[#0D0D0D]/8 sticky top-20 z-30">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide py-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 text-[11px] tracking-[0.15em] uppercase px-5 py-4 border-b-2 transition-all duration-200 whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'border-[#0D0D0D] text-[#0D0D0D]'
                    : 'border-transparent text-[#0D0D0D]/40 hover:text-[#0D0D0D]/70'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <div className="bg-[#F8F7F4] min-h-screen">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase border px-4 py-2.5 transition-all duration-200 ${
                  showFilters || hasActiveFilters
                    ? 'border-[#0D0D0D] bg-[#0D0D0D] text-white'
                    : 'border-[#0D0D0D]/20 text-[#0D0D0D] hover:border-[#0D0D0D]/60'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <SlidersHorizontal size={13} strokeWidth={1.5} />
                Filters
                {hasActiveFilters && (
                  <span className="bg-white text-[#0D0D0D] rounded-full w-4 h-4 flex items-center justify-center text-[9px]">
                    {(activeCategory !== 'all' ? 1 : 0) + activeTechniques.length}
                  </span>
                )}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-[11px] text-[#0D0D0D]/50 hover:text-[#0D0D0D] transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <X size={12} strokeWidth={1.5} />
                  Clear
                </button>
              )}
              <span className="text-[11px] text-[#0D0D0D]/40" style={{ fontFamily: 'Inter, sans-serif' }}>
                {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              </span>
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-[#0D0D0D]/60 hover:text-[#0D0D0D] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Sort: {activeSortLabel}
                <ChevronDown size={12} strokeWidth={1.5} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 bg-white border border-[#0D0D0D]/10 shadow-lg min-w-[180px] z-50"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => { setSortBy(opt.id); setShowSortDropdown(false); }}
                        className={`w-full text-left px-4 py-3 text-[11px] tracking-[0.1em] uppercase transition-colors ${
                          sortBy === opt.id
                            ? 'bg-[#0D0D0D] text-white'
                            : 'text-[#0D0D0D]/70 hover:bg-[#F8F7F4]'
                        }`}
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="bg-white border border-[#0D0D0D]/8 p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Technique filter */}
                    <div>
                      <h4
                        className="text-[10px] tracking-[0.25em] uppercase text-[#0D0D0D]/40 mb-4"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Print Technique
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {TECHNIQUES.map((tech) => (
                          <button
                            key={tech.id}
                            onClick={() => toggleTechnique(tech.id)}
                            className={`text-[11px] tracking-[0.1em] uppercase px-4 py-2 border transition-all duration-150 ${
                              activeTechniques.includes(tech.id)
                                ? 'border-[#0D0D0D] bg-[#0D0D0D] text-white'
                                : 'border-[#0D0D0D]/15 text-[#0D0D0D]/60 hover:border-[#0D0D0D]/40'
                            }`}
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {tech.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price range */}
                    <div>
                      <h4
                        className="text-[10px] tracking-[0.25em] uppercase text-[#0D0D0D]/40 mb-4"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Price Range
                      </h4>
                      <div className="flex items-center gap-4">
                        {[
                          { label: 'Under ₹4,000', range: [0, 4000] as [number, number] },
                          { label: '₹4,000–₹6,000', range: [4000, 6000] as [number, number] },
                          { label: 'Above ₹6,000', range: [6000, 10000] as [number, number] },
                          { label: 'All', range: [0, 10000] as [number, number] },
                        ].map((opt) => (
                          <button
                            key={opt.label}
                            onClick={() => setPriceRange(opt.range)}
                            className={`text-[11px] tracking-[0.08em] px-3 py-2 border transition-all duration-150 ${
                              priceRange[0] === opt.range[0] && priceRange[1] === opt.range[1]
                                ? 'border-[#0D0D0D] bg-[#0D0D0D] text-white'
                                : 'border-[#0D0D0D]/15 text-[#0D0D0D]/60 hover:border-[#0D0D0D]/40'
                            }`}
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product grid */}
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center"
              >
                <p
                  className="text-[#0D0D0D]/30 text-[13px] mb-4"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  No products match your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-[11px] tracking-[0.15em] uppercase text-[#0D0D0D] underline underline-offset-4"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`${activeCategory}-${activeTechniques.join('-')}-${sortBy}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10"
              >
                {filtered.map((product, i) => (
                  <FadeUp key={product.id} delay={Math.min(i * 0.05, 0.3)}>
                    <ShopProductCard product={product} />
                  </FadeUp>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Drop Teaser Banner ─────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] py-16 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <FadeUp>
            <div>
              <p
                className="text-[#C0B49A] text-[10px] tracking-[0.3em] uppercase mb-3"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Drop 004 · June 20, 2026
              </p>
              <h2
                className="text-white font-light italic leading-none"
                style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(32px, 4vw, 56px)' }}
              >
                Something New is Coming.
              </h2>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link
              to="/drops"
              className="flex items-center gap-3 border border-white/30 text-white text-[11px] tracking-[0.2em] uppercase px-8 py-4 hover:bg-white hover:text-[#0D0D0D] transition-all duration-300 shrink-0"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Join the Waitlist <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
