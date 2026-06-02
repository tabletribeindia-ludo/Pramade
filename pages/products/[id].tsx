import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, useInView, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  ZoomIn,
  CheckCircle,
  Star,
  Truck,
  RotateCcw,
  Shield,
  ArrowRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProductData {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  originalPrice?: string;
  category: string;
  technique: string;
  techniqueLabel: string;
  tag?: string;
  isNew?: boolean;
  isLimited?: boolean;
  isBestSeller?: boolean;
  description: string;
  details: string[];
  fabric: string;
  fit: string;
  careInstructions: string[];
  sizes: string[];
  sizeGuide: { size: string; chest: string; length: string; shoulder: string }[];
  images: string[];
  relatedIds: string[];
  reviews: { name: string; city: string; rating: number; comment: string; verified: boolean }[];
}

// ─── Product Database ─────────────────────────────────────────────────────────
const PRODUCTS: Record<string, ProductData> = {
  'puff-arch-oversized-tee': {
    id: 'puff-arch-oversized-tee',
    name: 'Puff Arch Oversized Tee',
    price: 3999,
    priceDisplay: '₹3,999',
    category: 'T-Shirts',
    technique: 'puff',
    techniqueLabel: 'Puff Print',
    isNew: true,
    description:
      'The Puff Arch Tee is the centrepiece of Drop 003. A 3D raised arch graphic sits across the chest — tactile, bold, and unmistakably PRAMADE. Cut in a relaxed oversized silhouette from GSM-400 cotton.',
    details: [
      'GSM-400 heavyweight cotton',
      'Oversized drop-shoulder fit',
      '3D puff print chest graphic',
      'Ribbed crew neck collar',
      'Double-stitched hem and sleeves',
      'Pre-washed for minimal shrinkage',
    ],
    fabric: '100% GSM-400 combed cotton. Heavyweight, structured, and pre-washed for a broken-in feel from day one.',
    fit: 'Oversized. Model is 6\'1" and wears size M. We recommend sizing down if you prefer a relaxed (not boxy) fit.',
    careInstructions: [
      'Machine wash cold, inside out',
      'Do not tumble dry — air dry flat',
      'Do not iron directly on print',
      'Do not bleach',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    sizeGuide: [
      { size: 'XS', chest: '40"', length: '27"', shoulder: '18"' },
      { size: 'S', chest: '42"', length: '28"', shoulder: '19"' },
      { size: 'M', chest: '44"', length: '29"', shoulder: '20"' },
      { size: 'L', chest: '46"', length: '30"', shoulder: '21"' },
      { size: 'XL', chest: '48"', length: '31"', shoulder: '22"' },
      { size: 'XXL', chest: '50"', length: '32"', shoulder: '23"' },
    ],
    images: [
      '/airo-assets/images/pages/home/product-1',
      '/airo-assets/images/pages/home/product-2',
      '/airo-assets/images/pages/home/product-3',
      '/airo-assets/images/pages/home/product-4',
      '/airo-assets/images/pages/home/product-5',
    ],
    relatedIds: ['embroidered-script-hoodie', 'signature-graphic-tee', 'dtf-oversized-tee'],
    reviews: [
      { name: 'Arjun M.', city: 'Mumbai', rating: 5, comment: 'The puff print quality is insane. You can feel the craftsmanship the moment you hold it.', verified: true },
      { name: 'Rohan K.', city: 'Bangalore', rating: 5, comment: 'Fabric weight is exactly what I expected. Heavy, structured, and the fit is perfect oversized.', verified: true },
      { name: 'Priya S.', city: 'Delhi', rating: 4, comment: 'Love the tee. The puff print is raised and tactile — unlike anything I\'ve seen from Indian brands.', verified: true },
    ],
  },
  'embroidered-script-hoodie': {
    id: 'embroidered-script-hoodie',
    name: 'Embroidered Script Hoodie',
    price: 6499,
    priceDisplay: '₹6,499',
    category: 'Hoodies',
    technique: 'embroidery',
    techniqueLabel: 'Embroidery',
    isNew: true,
    description:
      'High-density embroidery meets Japanese fleece. The Script Hoodie features a tonal embroidered wordmark across the chest — subtle from a distance, intricate up close. Built for the long haul.',
    details: [
      'Japanese GSM-380 fleece',
      'High-density tonal embroidery',
      'Kangaroo pocket with hidden zip',
      'Ribbed cuffs and hem',
      'Adjustable drawstring hood',
      'Brushed interior for warmth',
    ],
    fabric: '80% combed cotton, 20% polyester Japanese fleece. GSM-380. Brushed interior. Pill-resistant.',
    fit: 'Regular oversized. Model is 6\'1" and wears size M.',
    careInstructions: [
      'Machine wash cold, inside out',
      'Tumble dry low or air dry',
      'Do not iron on embroidery',
      'Do not bleach',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sizeGuide: [
      { size: 'S', chest: '44"', length: '27"', shoulder: '20"' },
      { size: 'M', chest: '46"', length: '28"', shoulder: '21"' },
      { size: 'L', chest: '48"', length: '29"', shoulder: '22"' },
      { size: 'XL', chest: '50"', length: '30"', shoulder: '23"' },
      { size: 'XXL', chest: '52"', length: '31"', shoulder: '24"' },
    ],
    images: [
      '/airo-assets/images/pages/home/product-2',
      '/airo-assets/images/pages/home/product-3',
      '/airo-assets/images/pages/home/product-4',
      '/airo-assets/images/pages/home/product-1',
      '/airo-assets/images/pages/home/product-5',
    ],
    relatedIds: ['puff-arch-oversized-tee', 'embroidered-coach-jacket', 'screen-print-crewneck'],
    reviews: [
      { name: 'Aisha N.', city: 'Hyderabad', rating: 5, comment: 'The embroidery is flawless. Tonal and subtle — exactly what premium streetwear should look like.', verified: true },
      { name: 'Dev P.', city: 'Pune', rating: 5, comment: 'Japanese fleece is no joke. This hoodie is warm, heavy, and the fit is perfect.', verified: true },
    ],
  },
  'signature-graphic-tee': {
    id: 'signature-graphic-tee',
    name: 'Signature Graphic Tee',
    price: 3499,
    priceDisplay: '₹3,499',
    category: 'T-Shirts',
    technique: 'screen',
    techniqueLabel: 'Screen Print',
    isBestSeller: true,
    description:
      'The tee that started it all. A full-chest screen print in PRAMADE\'s signature ink — rich, saturated, and built to last 100+ washes without fading. The everyday essential.',
    details: [
      'GSM-360 combed cotton',
      'Full-chest screen print',
      'Plastisol ink — fade resistant',
      'Relaxed oversized fit',
      'Reinforced shoulder seams',
      'Pre-washed and pre-shrunk',
    ],
    fabric: '100% GSM-360 combed cotton. Softer hand feel than the Puff Arch. Pre-washed.',
    fit: 'Relaxed oversized. Model is 6\'1" and wears size M.',
    careInstructions: [
      'Machine wash cold, inside out',
      'Tumble dry low',
      'Do not iron on print',
      'Do not bleach',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    sizeGuide: [
      { size: 'XS', chest: '40"', length: '27"', shoulder: '18"' },
      { size: 'S', chest: '42"', length: '28"', shoulder: '19"' },
      { size: 'M', chest: '44"', length: '29"', shoulder: '20"' },
      { size: 'L', chest: '46"', length: '30"', shoulder: '21"' },
      { size: 'XL', chest: '48"', length: '31"', shoulder: '22"' },
      { size: 'XXL', chest: '50"', length: '32"', shoulder: '23"' },
    ],
    images: [
      '/airo-assets/images/pages/home/product-4',
      '/airo-assets/images/pages/home/product-5',
      '/airo-assets/images/pages/home/product-6',
      '/airo-assets/images/pages/home/product-1',
      '/airo-assets/images/pages/home/product-2',
    ],
    relatedIds: ['puff-arch-oversized-tee', 'dtf-oversized-tee', 'puff-monogram-tee-drop-003'],
    reviews: [
      { name: 'Kabir R.', city: 'Chennai', rating: 5, comment: 'Best tee I\'ve owned. 20+ washes and the print hasn\'t faded at all.', verified: true },
      { name: 'Meera T.', city: 'Kolkata', rating: 5, comment: 'The fabric weight is perfect. Not too heavy, not too light. Exactly what I wanted.', verified: true },
      { name: 'Sahil V.', city: 'Ahmedabad', rating: 4, comment: 'Great quality. The screen print is crisp and the fit is exactly as described.', verified: true },
    ],
  },
};

// Fallback for unknown product IDs
const DEFAULT_PRODUCT = PRODUCTS['puff-arch-oversized-tee'];

// ─── FadeUp ───────────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────
function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#0D0D0D]/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span
          className="text-[12px] tracking-[0.15em] uppercase text-[#0D0D0D] group-hover:text-[#0D0D0D]/70 transition-colors"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {title}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className={`text-[#0D0D0D]/40 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Zoom Modal ───────────────────────────────────────────────────────────────
function ZoomModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
      onClick={onClose}
    >
      <motion.img
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors text-[11px] tracking-[0.2em] uppercase flex items-center gap-2"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        Close <span className="text-white/30">[Esc]</span>
      </button>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = (id && PRODUCTS[id]) ? PRODUCTS[id] : DEFAULT_PRODUCT;

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const relatedProducts = product.relatedIds
    .map((rid) => PRODUCTS[rid])
    .filter(Boolean)
    .slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{product.name} — PRAMADE</title>
        <meta name="description" content={`${product.description.slice(0, 155)}...`} />
        <meta property="og:title" content={`${product.name} — PRAMADE`} />
        <meta property="og:description" content={product.description} />
      </Helmet>

      {/* Zoom modal */}
      <AnimatePresence>
        {zoomSrc && (
          <ZoomModal src={zoomSrc} alt={product.name} onClose={() => setZoomSrc(null)} />
        )}
      </AnimatePresence>

      {/* Size guide modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/60 flex items-center justify-center p-4"
            onClick={() => setShowSizeGuide(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white max-w-lg w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-[#0D0D0D] text-lg font-light"
                  style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
                >
                  Size Guide
                </h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-[#0D0D0D]/40 hover:text-[#0D0D0D] transition-colors text-[11px] tracking-[0.15em] uppercase"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Close
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#0D0D0D]/10">
                    {['Size', 'Chest', 'Length', 'Shoulder'].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[10px] tracking-[0.2em] uppercase text-[#0D0D0D]/40 pb-3 pr-4"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {product.sizeGuide.map((row, i) => (
                    <tr key={row.size} className={i % 2 === 0 ? 'bg-[#F8F7F4]' : ''}>
                      {[row.size, row.chest, row.length, row.shoulder].map((val, j) => (
                        <td
                          key={j}
                          className="text-[12px] text-[#0D0D0D]/70 py-3 pr-4"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p
                className="text-[11px] text-[#0D0D0D]/40 mt-5"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                All measurements are in inches. Chest = pit to pit × 2.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div className="bg-[#F8F7F4] pt-28 pb-0">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <nav className="flex items-center gap-2 text-[11px] text-[#0D0D0D]/40" style={{ fontFamily: 'Inter, sans-serif' }}>
            <Link to="/" className="hover:text-[#0D0D0D] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-[#0D0D0D] transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-[#0D0D0D]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Main Product Section ─────────────────────────────────────────────── */}
      <section className="bg-[#F8F7F4] py-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

            {/* ── Left: Gallery ─────────────────────────────────────────────── */}
            <div className="flex gap-3">
              {/* Thumbnails */}
              <div className="hidden md:flex flex-col gap-2 w-16 shrink-0">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative overflow-hidden aspect-square border-2 transition-all duration-200 ${
                      activeImage === i ? 'border-[#0D0D0D]' : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div className="flex-1">
                <div className="relative overflow-hidden aspect-[3/4] group">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImage}
                      src={product.images[activeImage]}
                      alt={product.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Zoom button */}
                  <button
                    onClick={() => setZoomSrc(product.images[activeImage])}
                    className="absolute top-4 right-4 w-9 h-9 bg-white/90 hover:bg-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Zoom image"
                  >
                    <ZoomIn size={15} strokeWidth={1.5} className="text-[#0D0D0D]" />
                  </button>

                  {/* Tags */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    {product.isNew && (
                      <span className="bg-white text-[#0D0D0D] text-[9px] tracking-[0.2em] uppercase px-2.5 py-1" style={{ fontFamily: 'Inter, sans-serif' }}>New</span>
                    )}
                    {product.isLimited && (
                      <span className="bg-[#0D0D0D] text-white text-[9px] tracking-[0.2em] uppercase px-2.5 py-1" style={{ fontFamily: 'Inter, sans-serif' }}>Limited</span>
                    )}
                    {product.isBestSeller && (
                      <span className="bg-[#C0B49A] text-white text-[9px] tracking-[0.2em] uppercase px-2.5 py-1" style={{ fontFamily: 'Inter, sans-serif' }}>Best Seller</span>
                    )}
                  </div>

                  {/* Prev/Next arrows */}
                  <button
                    onClick={() => setActiveImage((p) => (p - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={16} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => setActiveImage((p) => (p + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Mobile dots */}
                <div className="flex items-center justify-center gap-1.5 mt-3 md:hidden">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`rounded-full transition-all duration-200 ${
                        activeImage === i ? 'w-5 h-1.5 bg-[#0D0D0D]' : 'w-1.5 h-1.5 bg-[#0D0D0D]/20'
                      }`}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: Product Info ────────────────────────────────────────── */}
            <div className="flex flex-col">
              {/* Category + technique */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-[10px] tracking-[0.25em] uppercase text-[#0D0D0D]/40"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {product.category}
                </span>
                <span className="text-[#0D0D0D]/20">·</span>
                <span
                  className="text-[10px] tracking-[0.25em] uppercase text-[#C0B49A]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {product.techniqueLabel}
                </span>
              </div>

              {/* Name */}
              <h1
                className="text-[#0D0D0D] font-light leading-tight mb-4"
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: 'clamp(32px, 3.5vw, 52px)',
                }}
              >
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-[#C0B49A] text-[#C0B49A]" />
                  ))}
                </div>
                <span
                  className="text-[11px] text-[#0D0D0D]/40"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {product.reviews.length} reviews
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span
                  className="text-[#0D0D0D] text-2xl font-light"
                  style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
                >
                  {product.priceDisplay}
                </span>
                {product.originalPrice && (
                  <span
                    className="text-[#0D0D0D]/30 text-base line-through"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {product.originalPrice}
                  </span>
                )}
                <span
                  className="text-[10px] tracking-[0.1em] text-[#0D0D0D]/40"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  incl. all taxes
                </span>
              </div>

              {/* Description */}
              <p
                className="text-[#0D0D0D]/60 text-[13px] leading-relaxed mb-8"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {product.description}
              </p>

              {/* Size selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[11px] tracking-[0.15em] uppercase text-[#0D0D0D]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Size
                    {selectedSize && (
                      <span className="text-[#C0B49A] ml-2">— {selectedSize}</span>
                    )}
                  </span>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-[11px] text-[#0D0D0D]/40 hover:text-[#0D0D0D] transition-colors underline underline-offset-2"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className={`w-12 h-12 text-[12px] border transition-all duration-150 ${
                        selectedSize === size
                          ? 'border-[#0D0D0D] bg-[#0D0D0D] text-white'
                          : sizeError
                          ? 'border-red-400 text-[#0D0D0D] hover:border-[#0D0D0D]'
                          : 'border-[#0D0D0D]/20 text-[#0D0D0D] hover:border-[#0D0D0D]/60'
                      }`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <AnimatePresence>
                  {sizeError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-500 text-[11px] mt-2"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Please select a size to continue.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="text-[11px] tracking-[0.15em] uppercase text-[#0D0D0D]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Qty
                </span>
                <div className="flex items-center border border-[#0D0D0D]/20">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-[#0D0D0D]/60 hover:text-[#0D0D0D] hover:bg-[#0D0D0D]/5 transition-colors text-lg"
                  >
                    −
                  </button>
                  <span
                    className="w-10 text-center text-[13px] text-[#0D0D0D]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                    className="w-9 h-9 flex items-center justify-center text-[#0D0D0D]/60 hover:text-[#0D0D0D] hover:bg-[#0D0D0D]/5 transition-colors text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 mb-6">
                <motion.button
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-4 text-[11px] tracking-[0.2em] uppercase font-medium transition-all duration-300 ${
                    addedToCart
                      ? 'bg-[#C0B49A] text-white'
                      : 'bg-[#0D0D0D] text-white hover:bg-[#0D0D0D]/80'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {addedToCart ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle size={14} strokeWidth={1.5} />
                      Added to Cart
                    </span>
                  ) : (
                    'Add to Cart'
                  )}
                </motion.button>
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className={`w-14 border flex items-center justify-center transition-all duration-200 ${
                    wishlisted
                      ? 'border-[#0D0D0D] bg-[#0D0D0D]'
                      : 'border-[#0D0D0D]/20 hover:border-[#0D0D0D]/60'
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart
                    size={16}
                    strokeWidth={1.5}
                    className={wishlisted ? 'fill-white text-white' : 'text-[#0D0D0D]'}
                  />
                </button>
                <button
                  className="w-14 border border-[#0D0D0D]/20 hover:border-[#0D0D0D]/60 flex items-center justify-center transition-colors"
                  aria-label="Share"
                >
                  <Share2 size={16} strokeWidth={1.5} className="text-[#0D0D0D]" />
                </button>
              </div>

              {/* Buy now */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 text-[11px] tracking-[0.2em] uppercase border border-[#0D0D0D] text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-white transition-all duration-300 mb-8"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Buy Now
              </button>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-[#0D0D0D]/8 mb-6">
                {[
                  { icon: Truck, label: 'Free Delivery', sub: 'Orders above ₹2,000' },
                  { icon: RotateCcw, label: 'Easy Returns', sub: '7-day return policy' },
                  { icon: Shield, label: 'Secure Payment', sub: 'Encrypted checkout' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1.5">
                    <Icon size={18} strokeWidth={1.2} className="text-[#C0B49A]" />
                    <span
                      className="text-[10px] tracking-[0.1em] uppercase text-[#0D0D0D]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-[10px] text-[#0D0D0D]/40"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {sub}
                    </span>
                  </div>
                ))}
              </div>

              {/* Accordions */}
              <div className="border-t border-[#0D0D0D]/10">
                <Accordion title="Product Details" defaultOpen>
                  <ul className="flex flex-col gap-2">
                    {product.details.map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-2 text-[12px] text-[#0D0D0D]/60"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        <span className="text-[#C0B49A] mt-0.5 shrink-0">—</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </Accordion>

                <Accordion title="Fabric & Fit">
                  <div className="flex flex-col gap-4">
                    <div>
                      <p
                        className="text-[10px] tracking-[0.2em] uppercase text-[#0D0D0D]/40 mb-1.5"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Fabric
                      </p>
                      <p
                        className="text-[12px] text-[#0D0D0D]/60 leading-relaxed"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {product.fabric}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-[10px] tracking-[0.2em] uppercase text-[#0D0D0D]/40 mb-1.5"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Fit
                      </p>
                      <p
                        className="text-[12px] text-[#0D0D0D]/60 leading-relaxed"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {product.fit}
                      </p>
                    </div>
                  </div>
                </Accordion>

                <Accordion title="Care Instructions">
                  <ul className="flex flex-col gap-2">
                    {product.careInstructions.map((c) => (
                      <li
                        key={c}
                        className="flex items-start gap-2 text-[12px] text-[#0D0D0D]/60"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        <span className="text-[#C0B49A] mt-0.5 shrink-0">—</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </Accordion>

                <Accordion title="Shipping & Returns">
                  <div className="flex flex-col gap-3 text-[12px] text-[#0D0D0D]/60" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <p>Free shipping on orders above ₹2,000. Standard delivery in 5–7 business days. Express delivery available at checkout.</p>
                    <p>Returns accepted within 7 days of delivery. Item must be unworn, unwashed, and in original packaging. Raise a return request via your order page.</p>
                  </div>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ─────────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <FadeUp className="mb-10">
            <div className="flex items-end justify-between">
              <h2
                className="text-[#0D0D0D] font-light leading-none"
                style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(32px, 4vw, 56px)' }}
              >
                Reviews
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[#C0B49A] text-[#C0B49A]" />
                  ))}
                </div>
                <span
                  className="text-[12px] text-[#0D0D0D]/50"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  5.0 · {product.reviews.length} reviews
                </span>
              </div>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.reviews.map((review, i) => (
              <FadeUp key={review.name} delay={i * 0.1}>
                <div className="bg-[#F8F7F4] p-6">
                  <div className="flex items-center gap-0.5 mb-3">
                    {[...Array(review.rating)].map((_, s) => (
                      <Star key={s} size={11} className="fill-[#C0B49A] text-[#C0B49A]" />
                    ))}
                  </div>
                  <p
                    className="text-[#0D0D0D]/70 text-[13px] leading-relaxed mb-5 italic"
                    style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1rem' }}
                  >
                    "{review.comment}"
                  </p>
                  <div className="flex items-center gap-2">
                    <div>
                      <p
                        className="text-[12px] font-medium text-[#0D0D0D]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {review.name}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <p
                          className="text-[11px] text-[#0D0D0D]/40"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {review.city}
                        </p>
                        {review.verified && (
                          <>
                            <CheckCircle size={10} className="text-[#C0B49A]" />
                            <span
                              className="text-[9px] text-[#C0B49A] tracking-wide"
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                              Verified
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── You May Also Like ────────────────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="bg-[#F8F7F4] py-20 px-6 lg:px-12">
          <div className="max-w-[1400px] mx-auto">
            <FadeUp className="flex items-end justify-between mb-10">
              <h2
                className="text-[#0D0D0D] font-light leading-none"
                style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(32px, 4vw, 56px)' }}
              >
                You May Also Like
              </h2>
              <Link
                to="/shop"
                className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#0D0D0D] hover:gap-4 transition-all duration-300"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                View All <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((rp, i) => (
                <FadeUp key={rp.id} delay={i * 0.1}>
                  <Link to={`/products/${rp.id}`} className="group block">
                    <div className="relative overflow-hidden aspect-[3/4] mb-3">
                      <img
                        src={rp.images[0]}
                        alt={rp.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h3
                      className="text-[#0D0D0D] font-light hover:text-[#0D0D0D]/70 transition-colors mb-1"
                      style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.05rem' }}
                    >
                      {rp.name}
                    </h3>
                    <p
                      className="text-[#0D0D0D]/50 text-[12px]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {rp.priceDisplay}
                    </p>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
