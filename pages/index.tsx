import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { ChevronDown, Star, CheckCircle, ArrowRight, Instagram } from 'lucide-react';

// ─── Fade-in-up wrapper ───────────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div
        className="text-5xl md:text-7xl font-light text-[#C8C0B0] tabular-nums"
        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', letterSpacing: '-0.02em' }}
      >
        {display}
      </div>
      <div
        className="text-[9px] tracking-[0.3em] uppercase text-white/30 mt-2"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {label}
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  price: string;
  tag?: string;
  image: string;
  hoverImage: string;
}

function ProductCard({ product, large = false }: { product: Product; large?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className={`relative overflow-hidden group cursor-pointer ${large ? 'h-[520px] md:h-[680px]' : 'h-[280px] md:h-[330px]'}`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Main image */}
      <img
        src={product.image}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: hovered ? 0 : 1 }}
      />
      {/* Hover image */}
      <img
        src={product.hoverImage}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: hovered ? 1 : 0 }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      {/* Tag */}
      {product.tag && (
        <div
          className="absolute top-4 left-4 bg-white text-[#0D0D0D] text-[9px] tracking-[0.2em] uppercase px-3 py-1"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {product.tag}
        </div>
      )}
      {/* Quick View */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-4 bottom-16 flex justify-center"
          >
            <button
              className="bg-white text-[#0D0D0D] text-[10px] tracking-[0.2em] uppercase px-6 py-2.5 font-medium hover:bg-white/90 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Quick View
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Product info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p
          className="text-white text-sm font-medium mb-1 leading-tight"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: large ? '1.1rem' : '0.95rem' }}
        >
          {product.name}
        </p>
        <p
          className="text-white/60 text-[12px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {product.price}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'new' | 'best' | 'limited'>('new');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [waitlistForm, setWaitlistForm] = useState({ name: '', email: '', mobile: '' });
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);

  // Drop countdown: June 20, 2026 11:00 AM IST (UTC+5:30)
  const dropDate = new Date('2026-06-20T05:30:00.000Z');
  const countdown = useCountdown(dropDate);

  // Auto-advance testimonials
  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial((p) => (p + 1) % 4), 5000);
    return () => clearInterval(id);
  }, []);

  // ── Data ──────────────────────────────────────────────────────────────────
  const allProducts: Record<string, Product[]> = {
    new: [
      { id: 1, name: 'Puff Arch Oversized Tee', price: '₹3,999', tag: 'New', image: '/airo-assets/images/pages/home/product-1', hoverImage: '/airo-assets/images/pages/home/product-2' },
      { id: 2, name: 'Embroidered Script Hoodie', price: '₹6,499', tag: 'New', image: '/airo-assets/images/pages/home/product-2', hoverImage: '/airo-assets/images/pages/home/product-3' },
      { id: 3, name: 'Cargo Utility Trousers', price: '₹5,499', image: '/airo-assets/images/pages/home/product-3', hoverImage: '/airo-assets/images/pages/home/product-4' },
    ],
    best: [
      { id: 4, name: 'Signature Graphic Tee', price: '₹3,499', tag: 'Best Seller', image: '/airo-assets/images/pages/home/product-4', hoverImage: '/airo-assets/images/pages/home/product-5' },
      { id: 5, name: 'Embroidered Coach Jacket', price: '₹7,999', tag: 'Best Seller', image: '/airo-assets/images/pages/home/product-5', hoverImage: '/airo-assets/images/pages/home/product-6' },
      { id: 6, name: 'DTF Oversized Tee', price: '₹3,799', image: '/airo-assets/images/pages/home/product-6', hoverImage: '/airo-assets/images/pages/home/product-1' },
    ],
    limited: [
      { id: 7, name: 'Drop 003 — Puff Monogram Tee', price: '₹4,999', tag: 'Limited', image: '/airo-assets/images/pages/home/product-5', hoverImage: '/airo-assets/images/pages/home/product-1' },
      { id: 8, name: 'Mixed Media Varsity', price: '₹7,499', tag: 'Limited', image: '/airo-assets/images/pages/home/product-2', hoverImage: '/airo-assets/images/pages/home/product-4' },
      { id: 9, name: 'Screen Print Crewneck', price: '₹5,299', tag: 'Limited', image: '/airo-assets/images/pages/home/product-3', hoverImage: '/airo-assets/images/pages/home/product-6' },
    ],
  };

  const values = [
    { num: '01', title: 'Premium Fabrics', desc: 'GSM-400 cotton, Japanese fleece, Portuguese twill' },
    { num: '02', title: 'Limited Production', desc: 'Never more than 200 units per drop' },
    { num: '03', title: 'Detailed Craftsmanship', desc: 'Every stitch reviewed before it ships' },
    { num: '04', title: 'Unique Print Tech', desc: 'Puff, embroidery, DTF, screen — mastered' },
    { num: '05', title: 'Streetwear with Purpose', desc: 'Designed to outlast trends' },
  ];

  const craftTechniques = [
    { name: 'Puff Print', desc: '3D raised texture. Tactile luxury.', image: '/airo-assets/images/pages/home/craft-puff', span: 'col-span-2 row-span-2' },
    { name: 'Embroidery', desc: 'High-density. Built to last.', image: '/airo-assets/images/pages/home/craft-embroidery', span: 'col-span-1 row-span-1' },
    { name: 'DTF Print', desc: 'Ultra-sharp. Pixel-perfect graphics.', image: '/airo-assets/images/pages/home/craft-dtf', span: 'col-span-1 row-span-1' },
    { name: 'Screen Print', desc: 'Long-lasting premium finish.', image: '/airo-assets/images/pages/home/craft-screen', span: 'col-span-1 row-span-1' },
    { name: 'Mixed Media', desc: 'Embroidery meets print. Signature PRAMADE.', image: '/airo-assets/images/pages/home/craft-mixed', span: 'col-span-1 row-span-1' },
  ];

  const testimonials = [
    { name: 'Arjun Mehta', city: 'Mumbai', quote: 'The puff print quality is insane. You can feel the craftsmanship the moment you hold it. Worth every rupee.', image: '/airo-assets/images/pages/home/testimonial-1' },
    { name: 'Priya Sharma', city: 'Delhi', quote: 'Finally a brand that understands premium streetwear. The embroidery on my hoodie is flawless. Already waiting for the next drop.', image: '/airo-assets/images/pages/home/testimonial-2' },
    { name: 'Rohan Kapoor', city: 'Bangalore', quote: 'Got the limited drop tee and the fabric weight alone justifies the price. This is what Indian streetwear should look like.', image: '/airo-assets/images/pages/home/testimonial-3' },
    { name: 'Aisha Nair', city: 'Hyderabad', quote: 'The oversized fit is perfect and the DTF print hasn\'t faded after 20 washes. Genuinely premium quality.', image: '/airo-assets/images/pages/home/testimonial-4' },
  ];

  const communityImages = [
    '/airo-assets/images/pages/home/community-1',
    '/airo-assets/images/pages/home/community-2',
    '/airo-assets/images/pages/home/community-3',
    '/airo-assets/images/pages/home/community-4',
    '/airo-assets/images/pages/home/community-6',
    '/airo-assets/images/pages/home/product-5',
  ];

  const currentProducts = allProducts[activeTab];

  return (
    <>
      <Helmet>
        <title>PRAMADE — Crafted for the Few</title>
        <meta name="description" content="Premium luxury streetwear from India. Limited-edition drops, puff print, embroidery, and craftsmanship that outlasts trends. Shop PRAMADE." />
        <meta property="og:title" content="PRAMADE — Crafted for the Few" />
        <meta property="og:description" content="Premium streetwear designed with purpose, precision, and individuality." />
        <meta name="keywords" content="premium streetwear India, luxury t-shirts, oversized t-shirts, puff print t-shirts, embroidered t-shirts, limited edition streetwear" />
      </Helmet>

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden flex items-center justify-center">
        {/* Ken Burns background */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'easeOut' }}
        >
          <img
            src="/airo-assets/images/pages/home/hero"
            alt="PRAMADE hero"
            className="w-full h-full object-cover"
          />
        </motion.div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/75" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="text-white italic font-light leading-none mb-6"
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(64px, 10vw, 120px)',
              letterSpacing: '-0.01em',
            }}
          >
            Crafted for the Few.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: 'easeOut' }}
            className="text-white/70 mb-10 max-w-lg mx-auto"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Premium streetwear designed with purpose, precision, and individuality.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/shop"
              className="border border-white text-white text-[11px] tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-white hover:text-[#0D0D0D] transition-all duration-300"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Shop Collection
            </Link>
            <Link
              to="/drops"
              className="bg-white text-[#0D0D0D] text-[11px] tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-white/90 transition-all duration-300 font-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Join Next Drop
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={20} className="text-white/40" strokeWidth={1} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. MARQUEE ──────────────────────────────────────────────────────── */}
      <div className="bg-[#1A1A1A] py-4 overflow-hidden border-y border-white/5">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-8 px-8 text-[10px] tracking-[0.3em] uppercase text-[#C0B49A]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              LIMITED EDITION
              <span className="text-white/20">·</span>
              PREMIUM FABRICS
              <span className="text-white/20">·</span>
              CRAFTED FOR THE FEW
              <span className="text-white/20">·</span>
              PRAMADE
              <span className="text-white/20">·</span>
              EXCLUSIVE DROPS
              <span className="text-white/20">·</span>
              MADE IN INDIA
              <span className="text-white/20">·</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── 3. FEATURED COLLECTION ──────────────────────────────────────────── */}
      <section className="bg-[#F8F7F4] py-24 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <FadeUp>
              <h2
                className="text-[#0D0D0D] leading-none"
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: 'clamp(42px, 5vw, 72px)',
                  fontWeight: 300,
                }}
              >
                The Collection
              </h2>
            </FadeUp>
            {/* Tabs */}
            <FadeUp delay={0.1}>
              <div className="flex items-center gap-6">
                {(['new', 'best', 'limited'] as const).map((tab) => {
                  const labels = { new: 'New Arrivals', best: 'Best Sellers', limited: 'Limited Drops' };
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-[11px] tracking-[0.15em] uppercase transition-colors duration-200 pb-1 border-b ${
                        activeTab === tab
                          ? 'text-[#0D0D0D] border-[#0D0D0D]'
                          : 'text-[#0D0D0D]/40 border-transparent hover:text-[#0D0D0D]/70'
                      }`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {labels[tab]}
                    </button>
                  );
                })}
              </div>
            </FadeUp>
          </div>

          {/* Asymmetric grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
            >
              {/* Large card */}
              <div className="md:col-span-2">
                <ProductCard product={currentProducts[0]} large />
              </div>
              {/* Two stacked */}
              <div className="flex flex-col gap-3">
                <ProductCard product={currentProducts[1]} />
                <ProductCard product={currentProducts[2]} />
              </div>
            </motion.div>
          </AnimatePresence>

          <FadeUp delay={0.2} className="mt-10 flex justify-end">
            <Link
              to="/shop"
              className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#0D0D0D] hover:gap-4 transition-all duration-300"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              View All <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── 4. BRAND VALUES ─────────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] py-24 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <FadeUp>
            <h2
              className="text-white leading-none mb-20"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(48px, 6vw, 88px)',
                fontWeight: 300,
                fontStyle: 'italic',
              }}
            >
              Built Different.
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {values.map((v, i) => (
              <FadeUp key={v.num} delay={i * 0.1} className="py-8 md:py-0 md:px-8 first:pl-0 last:pr-0">
                <div className="h-px bg-white/20 mb-6 hidden md:block" />
                <p
                  className="text-white/25 text-[10px] tracking-[0.25em] mb-4"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {v.num}
                </p>
                <h3
                  className="text-white text-lg font-light mb-3 leading-tight"
                  style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.2rem' }}
                >
                  {v.title}
                </h3>
                <p
                  className="text-white/40 text-[12px] leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {v.desc}
                </p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. PRINT TECHNOLOGY ─────────────────────────────────────────────── */}
      <section className="bg-[#F8F7F4] py-24 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <FadeUp className="mb-14">
            <h2
              className="text-[#0D0D0D] leading-none"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(42px, 5vw, 72px)',
                fontWeight: 300,
              }}
            >
              The Craft
            </h2>
          </FadeUp>
          {/* Bento grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3 h-auto md:h-[560px]">
            {craftTechniques.map((tech, i) => (
              <FadeUp
                key={tech.name}
                delay={i * 0.08}
                className={`relative overflow-hidden group cursor-pointer ${
                  i === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
                } ${i === 0 ? 'h-[360px] md:h-full' : 'h-[180px] md:h-full'}`}
              >
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3
                      className="text-white font-light mb-1"
                      style={{
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontSize: i === 0 ? '1.6rem' : '1.1rem',
                      }}
                    >
                      {tech.name}
                    </h3>
                    <p
                      className="text-white/60 text-[11px]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {tech.desc}
                    </p>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. COUNTDOWN / DROP ─────────────────────────────────────────────── */}
      <section
        className="relative bg-[#0D0D0D] py-24 px-6 lg:px-12 overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: text + countdown */}
            <div>
              <FadeUp>
                <p
                  className="text-[#C0B49A] text-[10px] tracking-[0.3em] uppercase mb-6"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Drop 004 · June 20, 2026 · 11:00 AM IST
                </p>
              </FadeUp>
              <FadeUp delay={0.1}>
                <h2
                  className="text-white leading-none mb-12"
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: 'clamp(42px, 5vw, 80px)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                  }}
                >
                  Next Drop Incoming
                </h2>
              </FadeUp>
              {/* Timer */}
              <FadeUp delay={0.2} className="flex items-start gap-6 mb-12">
                <CountdownUnit value={countdown.days} label="Days" />
                <span className="text-white/20 text-5xl md:text-7xl font-light mt-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>:</span>
                <CountdownUnit value={countdown.hours} label="Hours" />
                <span className="text-white/20 text-5xl md:text-7xl font-light mt-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>:</span>
                <CountdownUnit value={countdown.minutes} label="Minutes" />
                <span className="text-white/20 text-5xl md:text-7xl font-light mt-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>:</span>
                <CountdownUnit value={countdown.seconds} label="Seconds" />
              </FadeUp>
              <FadeUp delay={0.3}>
                <p
                  className="text-white/30 text-[11px] tracking-[0.15em] uppercase mb-8"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Limited to 150 units. Once it's gone, it's gone.
                </p>
              </FadeUp>
              {/* Waitlist form */}
              {waitlistSubmitted ? (
                <FadeUp>
                  <div className="flex items-center gap-3 text-[#C0B49A]">
                    <CheckCircle size={18} strokeWidth={1.5} />
                    <span className="text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      You're on the list. We'll notify you first.
                    </span>
                  </div>
                </FadeUp>
              ) : (
                <FadeUp delay={0.35}>
                  <form
                    onSubmit={(e) => { e.preventDefault(); setWaitlistSubmitted(true); }}
                    className="flex flex-col gap-3 max-w-sm"
                  >
                    <input
                      type="text"
                      placeholder="Your name"
                      value={waitlistForm.name}
                      onChange={(e) => setWaitlistForm({ ...waitlistForm, name: e.target.value })}
                      required
                      className="bg-transparent border border-white/20 text-white placeholder-white/30 text-[12px] px-4 py-3 focus:outline-none focus:border-white/50 transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={waitlistForm.email}
                      onChange={(e) => setWaitlistForm({ ...waitlistForm, email: e.target.value })}
                      required
                      className="bg-transparent border border-white/20 text-white placeholder-white/30 text-[12px] px-4 py-3 focus:outline-none focus:border-white/50 transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                    <input
                      type="tel"
                      placeholder="Mobile number"
                      value={waitlistForm.mobile}
                      onChange={(e) => setWaitlistForm({ ...waitlistForm, mobile: e.target.value })}
                      className="bg-transparent border border-white/20 text-white placeholder-white/30 text-[12px] px-4 py-3 focus:outline-none focus:border-white/50 transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                    <button
                      type="submit"
                      className="bg-white text-[#0D0D0D] text-[11px] tracking-[0.2em] uppercase font-medium py-3.5 hover:bg-white/90 transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Join the Waitlist
                    </button>
                  </form>
                </FadeUp>
              )}
            </div>

            {/* Right: teaser image */}
            <FadeUp delay={0.2} className="relative">
              <div className="relative overflow-hidden">
                <img
                  src="/airo-assets/images/pages/home/drop-teaser"
                  alt="Upcoming drop teaser"
                  className="w-full h-[500px] object-cover"
                  style={{ filter: 'blur(6px) brightness(0.6)' }}
                />
                {/* Frosted glass overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="bg-white/5 backdrop-blur-sm border border-white/10 px-10 py-8 text-center"
                  >
                    <p
                      className="text-white/40 text-[9px] tracking-[0.3em] uppercase mb-3"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Coming Soon
                    </p>
                    <p
                      className="text-white text-2xl font-light italic"
                      style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
                    >
                      Drop 004
                    </p>
                    <div className="h-px bg-white/20 my-4" />
                    <p
                      className="text-white/50 text-[10px] tracking-[0.2em] uppercase"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      June 20, 2026
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="bg-[#EDEBE6] py-24 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <FadeUp className="mb-14">
            <h2
              className="text-[#0D0D0D] leading-none"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(42px, 5vw, 72px)',
                fontWeight: 300,
              }}
            >
              Worn &amp; Loved
            </h2>
          </FadeUp>

          {/* Carousel */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {testimonials.map((t, i) => (
                  <div
                    key={t.name}
                    className={`bg-white p-7 transition-all duration-300 ${
                      i === activeTestimonial ? 'ring-1 ring-[#0D0D0D]/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} size={11} className="fill-[#C0B49A] text-[#C0B49A]" />
                      ))}
                    </div>
                    <p
                      className="text-[#0D0D0D]/70 text-[13px] leading-relaxed mb-6 italic"
                      style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1rem' }}
                    >
                      "{t.quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p
                          className="text-[#0D0D0D] text-[12px] font-medium"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {t.name}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <p
                            className="text-[#0D0D0D]/40 text-[11px]"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {t.city}
                          </p>
                          <CheckCircle size={10} className="text-[#C0B49A]" />
                          <span
                            className="text-[#C0B49A] text-[9px] tracking-wide"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === activeTestimonial ? 'w-6 h-1.5 bg-[#0D0D0D]' : 'w-1.5 h-1.5 bg-[#0D0D0D]/20 hover:bg-[#0D0D0D]/40'
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. COMMUNITY ────────────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] py-24 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <FadeUp>
              <h2
                className="text-white leading-none"
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: 'clamp(42px, 5vw, 72px)',
                  fontWeight: 300,
                  fontStyle: 'italic',
                }}
              >
                More Than Clothing
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p
                className="text-white/40 text-[11px] tracking-[0.15em] uppercase max-w-xs"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Join the PRAMADE community. Tag #PRAMADE to be featured.
              </p>
            </FadeUp>
          </div>

          {/* 6-image grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-10">
            {communityImages.map((img, i) => (
              <FadeUp key={i} delay={i * 0.06}>
                <div className="relative overflow-hidden group aspect-square">
                  <img
                    src={img}
                    alt={`Community ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <Instagram
                      size={24}
                      strokeWidth={1.5}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.3} className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p
              className="text-white/40 text-[13px]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              @pramade.official
            </p>
            <a
              href="https://instagram.com/pramade.official"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-white/20 text-white text-[11px] tracking-[0.2em] uppercase px-7 py-3 hover:bg-white hover:text-[#0D0D0D] transition-all duration-300"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Instagram size={14} strokeWidth={1.5} />
              Follow on Instagram
            </a>
          </FadeUp>
        </div>
      </section>

      {/* ── 9. NEWSLETTER ───────────────────────────────────────────────────── */}
      <section className="bg-[#F8F7F4] py-28 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">
          <FadeUp>
            <h2
              className="text-[#0D0D0D] leading-none mb-4"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(48px, 6vw, 96px)',
                fontWeight: 300,
                fontStyle: 'italic',
              }}
            >
              Be First. Always.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p
              className="text-[#0D0D0D]/50 text-[12px] tracking-[0.2em] uppercase mb-12"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Early access to drops. Members-only pricing. No spam.
            </p>
          </FadeUp>
          <FadeUp delay={0.2} className="w-full max-w-md">
            {newsletterDone ? (
              <div className="flex items-center justify-center gap-3 text-[#0D0D0D]/60">
                <CheckCircle size={18} strokeWidth={1.5} />
                <span className="text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  You're in. Watch your inbox.
                </span>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setNewsletterDone(true); }}
                className="flex"
              >
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-transparent border border-[#0D0D0D]/20 text-[#0D0D0D] placeholder-[#0D0D0D]/30 text-[12px] px-5 py-4 focus:outline-none focus:border-[#0D0D0D]/60 transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                <button
                  type="submit"
                  className="bg-[#0D0D0D] text-white text-[11px] tracking-[0.2em] uppercase px-8 py-4 hover:bg-[#0D0D0D]/80 transition-colors whitespace-nowrap"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Join
                </button>
              </form>
            )}
          </FadeUp>
        </div>
      </section>
    </>
  );
}
