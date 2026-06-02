import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, useInView, AnimatePresence } from 'motion/react';
import {
  Trash2,
  Tag,
  X,
  ArrowRight,
  ShoppingBag,
  ChevronLeft,
  CheckCircle,
  Truck,
  RotateCcw,
  Shield,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function CartPage() {
  const { items, coupon, totals, removeItem, updateQty, applyCoupon, removeCoupon } = useCart();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'validate_coupon', code: couponInput }),
      });
      const data = await res.json() as { valid?: boolean; code?: string; type?: 'percent' | 'flat'; value?: number; label?: string; error?: string };
      if (!res.ok || !data.valid) {
        setCouponError(data.error ?? 'Invalid coupon code.');
        return;
      }
      applyCoupon({ code: data.code!, type: data.type!, value: data.value!, label: data.label! });
      setCouponSuccess(data.label ?? 'Coupon applied!');
      setCouponInput('');
    } catch {
      setCouponError('Could not validate coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Cart — PRAMADE</title>
        </Helmet>
        <div className="bg-[#F8F7F4] min-h-screen flex flex-col items-center justify-center px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-sm"
          >
            <ShoppingBag size={48} strokeWidth={1} className="text-[#0D0D0D]/15 mx-auto mb-6" />
            <h1
              className="text-[#0D0D0D] font-light mb-3"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '2rem' }}
            >
              Your cart is empty.
            </h1>
            <p
              className="text-[#0D0D0D]/40 text-[13px] mb-8 leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Looks like you haven't added anything yet. Explore the collection.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#0D0D0D] text-white text-[11px] tracking-[0.2em] uppercase px-8 py-4 hover:bg-[#0D0D0D]/80 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Shop Now <ArrowRight size={13} strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Cart ({totals.itemCount}) — PRAMADE</title>
      </Helmet>

      <div className="bg-[#F8F7F4] min-h-screen pt-28 pb-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          {/* Header */}
          <FadeUp className="flex items-center justify-between mb-10">
            <div>
              <h1
                className="text-[#0D0D0D] font-light leading-none"
                style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(36px, 5vw, 64px)' }}
              >
                Your Cart
              </h1>
              <p
                className="text-[#0D0D0D]/40 text-[12px] mt-1"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#0D0D0D]/50 hover:text-[#0D0D0D] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <ChevronLeft size={13} strokeWidth={1.5} />
              Continue Shopping
            </Link>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
            {/* ── Left: Items ─────────────────────────────────────────────── */}
            <div>
              {/* Column headers */}
              <div className="hidden md:grid grid-cols-[1fr_120px_120px_40px] gap-4 pb-3 border-b border-[#0D0D0D]/10 mb-2">
                {['Product', 'Size', 'Quantity', ''].map((h) => (
                  <span
                    key={h}
                    className="text-[10px] tracking-[0.2em] uppercase text-[#0D0D0D]/30"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              <AnimatePresence>
                {items.map((item, i) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="grid grid-cols-1 md:grid-cols-[1fr_120px_120px_40px] gap-4 items-center py-6 border-b border-[#0D0D0D]/8"
                  >
                    {/* Product info */}
                    <div className="flex items-center gap-4">
                      <Link to={`/products/${item.id}`} className="shrink-0">
                        <div className="w-20 h-24 overflow-hidden bg-[#E8E6E0]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </Link>
                      <div>
                        <Link to={`/products/${item.id}`}>
                          <h3
                            className="text-[#0D0D0D] font-light hover:text-[#0D0D0D]/70 transition-colors leading-snug mb-1"
                            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.05rem' }}
                          >
                            {item.name}
                          </h3>
                        </Link>
                        <p
                          className="text-[#0D0D0D]/50 text-[12px]"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {item.priceDisplay}
                        </p>
                        {/* Mobile size */}
                        <p
                          className="text-[11px] text-[#0D0D0D]/40 mt-1 md:hidden"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          Size: {item.size}
                        </p>
                      </div>
                    </div>

                    {/* Size */}
                    <div className="hidden md:block">
                      <span
                        className="text-[12px] text-[#0D0D0D]/60 border border-[#0D0D0D]/15 px-3 py-1.5 inline-block"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {item.size}
                      </span>
                    </div>

                    {/* Qty */}
                    <div className="flex items-center">
                      <div className="flex items-center border border-[#0D0D0D]/15">
                        <button
                          onClick={() => updateQty(item.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#0D0D0D]/50 hover:text-[#0D0D0D] hover:bg-[#0D0D0D]/5 transition-colors"
                        >
                          −
                        </button>
                        <span
                          className="w-8 text-center text-[12px] text-[#0D0D0D]"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#0D0D0D]/50 hover:text-[#0D0D0D] hover:bg-[#0D0D0D]/5 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Remove */}
                    <div className="flex items-center justify-end md:justify-center">
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-[#0D0D0D]/25 hover:text-red-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} strokeWidth={1.5} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#0D0D0D]/8">
                {[
                  { icon: Truck, label: 'Free Delivery', sub: 'Orders above ₹2,000' },
                  { icon: RotateCcw, label: 'Easy Returns', sub: '7-day return policy' },
                  { icon: Shield, label: 'Secure Payment', sub: 'Encrypted checkout' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon size={16} strokeWidth={1.2} className="text-[#C0B49A] shrink-0" />
                    <div>
                      <p
                        className="text-[10px] tracking-[0.1em] uppercase text-[#0D0D0D]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {label}
                      </p>
                      <p
                        className="text-[10px] text-[#0D0D0D]/40"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Order Summary ─────────────────────────────────────── */}
            <FadeUp delay={0.1}>
              <div className="bg-white p-6 lg:p-8 sticky top-28">
                <h2
                  className="text-[#0D0D0D] font-light mb-6"
                  style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.5rem' }}
                >
                  Order Summary
                </h2>

                {/* Line items */}
                <div className="flex flex-col gap-3 mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center justify-between">
                      <span
                        className="text-[12px] text-[#0D0D0D]/60 flex-1 pr-4 leading-snug"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {item.name} <span className="text-[#0D0D0D]/30">× {item.quantity}</span>
                      </span>
                      <span
                        className="text-[12px] text-[#0D0D0D] shrink-0"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        ₹{((item.price * item.quantity) / 100).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="mb-6">
                  {coupon ? (
                    <div className="flex items-center justify-between bg-[#C0B49A]/10 border border-[#C0B49A]/30 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Tag size={13} strokeWidth={1.5} className="text-[#C0B49A]" />
                        <div>
                          <p
                            className="text-[11px] tracking-[0.1em] uppercase text-[#C0B49A]"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {coupon.code}
                          </p>
                          <p
                            className="text-[10px] text-[#0D0D0D]/40"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {coupon.label}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => { removeCoupon(); setCouponSuccess(''); }}
                        className="text-[#0D0D0D]/30 hover:text-[#0D0D0D] transition-colors"
                        aria-label="Remove coupon"
                      >
                        <X size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Coupon code"
                        className="flex-1 border border-[#0D0D0D]/15 px-3 py-2.5 text-[12px] text-[#0D0D0D] placeholder-[#0D0D0D]/30 focus:outline-none focus:border-[#0D0D0D]/40 transition-colors"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="px-4 py-2.5 bg-[#0D0D0D] text-white text-[10px] tracking-[0.15em] uppercase hover:bg-[#0D0D0D]/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                  )}
                  <AnimatePresence>
                    {couponError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-[11px] mt-2"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {couponError}
                      </motion.p>
                    )}
                    {couponSuccess && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[#C0B49A] text-[11px] mt-2 flex items-center gap-1.5"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        <CheckCircle size={11} strokeWidth={1.5} />
                        {couponSuccess}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Totals */}
                <div className="flex flex-col gap-3 py-5 border-t border-[#0D0D0D]/8">
                  <div className="flex justify-between">
                    <span className="text-[12px] text-[#0D0D0D]/50" style={{ fontFamily: 'Inter, sans-serif' }}>Subtotal</span>
                    <span className="text-[12px] text-[#0D0D0D]" style={{ fontFamily: 'Inter, sans-serif' }}>{totals.subtotalDisplay}</span>
                  </div>
                  {totals.discountDisplay && (
                    <div className="flex justify-between">
                      <span className="text-[12px] text-[#C0B49A]" style={{ fontFamily: 'Inter, sans-serif' }}>Discount</span>
                      <span className="text-[12px] text-[#C0B49A]" style={{ fontFamily: 'Inter, sans-serif' }}>{totals.discountDisplay}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[12px] text-[#0D0D0D]/50" style={{ fontFamily: 'Inter, sans-serif' }}>Shipping</span>
                    <span className="text-[12px] text-[#0D0D0D]" style={{ fontFamily: 'Inter, sans-serif' }}>{totals.shippingDisplay}</span>
                  </div>
                </div>

                <div className="flex justify-between py-4 border-t border-[#0D0D0D]/15">
                  <span
                    className="text-[13px] tracking-[0.1em] uppercase text-[#0D0D0D]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Total
                  </span>
                  <span
                    className="text-[#0D0D0D] font-light"
                    style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.3rem' }}
                  >
                    {totals.totalDisplay}
                  </span>
                </div>

                <motion.button
                  onClick={() => navigate('/checkout')}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-[#0D0D0D] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#0D0D0D]/80 transition-colors flex items-center justify-center gap-2 mt-2"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Proceed to Checkout <ArrowRight size={13} strokeWidth={1.5} />
                </motion.button>

                <p
                  className="text-[10px] text-[#0D0D0D]/30 text-center mt-4"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Taxes included. Shipping calculated at checkout.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </>
  );
}
