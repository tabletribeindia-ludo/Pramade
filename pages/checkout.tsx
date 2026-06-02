import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronDown,
  CheckCircle,
  Lock,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ShippingForm {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

type PaymentMethod = 'cod' | 'upi' | 'card';
type Step = 'shipping' | 'payment' | 'review';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' },
  ];
  const idx = steps.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center gap-0 mb-10">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all duration-300 ${
                i < idx
                  ? 'bg-[#C0B49A] text-white'
                  : i === idx
                  ? 'bg-[#0D0D0D] text-white'
                  : 'bg-[#0D0D0D]/10 text-[#0D0D0D]/30'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {i < idx ? <CheckCircle size={12} strokeWidth={2} /> : i + 1}
            </div>
            <span
              className={`text-[11px] tracking-[0.1em] uppercase transition-colors ${
                i === idx ? 'text-[#0D0D0D]' : 'text-[#0D0D0D]/30'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 h-px mx-3 transition-colors ${i < idx ? 'bg-[#C0B49A]' : 'bg-[#0D0D0D]/10'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
function Field({
  label,
  error,
  children,
  required,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[10px] tracking-[0.2em] uppercase text-[#0D0D0D]/50"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  'border border-[#0D0D0D]/15 bg-white px-4 py-3 text-[13px] text-[#0D0D0D] placeholder-[#0D0D0D]/25 focus:outline-none focus:border-[#0D0D0D]/40 transition-colors w-full';

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, coupon, totals, clearCart } = useCart();


  const [step, setStep] = useState<Step>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderId, setOrderId] = useState('');

  const [shipping, setShipping] = useState<ShippingForm>({
    fullName: '', email: '', phone: '',
    line1: '', line2: '', city: '', state: '', pincode: '',
  });
  const [errors, setErrors] = useState<Partial<ShippingForm>>({});

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShipping((s) => ({ ...s, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  };

  const validateShipping = () => {
    const errs: Partial<ShippingForm> = {};
    if (!shipping.fullName.trim()) errs.fullName = 'Required';
    if (!shipping.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) errs.email = 'Valid email required';
    if (!shipping.phone.trim() || !/^\d{10}$/.test(shipping.phone.replace(/\s/g, ''))) errs.phone = '10-digit phone required';
    if (!shipping.line1.trim()) errs.line1 = 'Required';
    if (!shipping.city.trim()) errs.city = 'Required';
    if (!shipping.state) errs.state = 'Required';
    if (!shipping.pincode.trim() || !/^\d{6}$/.test(shipping.pincode)) errs.pincode = '6-digit pincode required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setOrderError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            size: i.size,
            quantity: i.quantity,
            image: i.image,
          })),
          shipping: {
            fullName: shipping.fullName,
            email: shipping.email,
            phone: shipping.phone,
            line1: shipping.line1,
            line2: shipping.line2,
            city: shipping.city,
            state: shipping.state,
            pincode: shipping.pincode,
          },
          subtotal: totals.subtotal,
          discount: totals.discount,
          shippingCost: totals.shipping,
          total: totals.total,
          couponCode: coupon?.code,
          paymentMethod,
        }),
      });
      const data = await res.json() as { success?: boolean; orderId?: string; error?: string };
      if (!res.ok || !data.success) {
        setOrderError(data.error ?? 'Failed to place order. Please try again.');
        return;
      }
      setOrderId(data.orderId ?? '');
      clearCart();
      setStep('review');
    } catch {
      setOrderError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Empty cart guard
  if (items.length === 0 && step !== 'review') {
    return (
      <div className="bg-[#F8F7F4] min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <ShoppingBag size={40} strokeWidth={1} className="text-[#0D0D0D]/15 mx-auto mb-5" />
        <p className="text-[#0D0D0D]/40 text-[13px] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Your cart is empty.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-[#0D0D0D] text-white text-[11px] tracking-[0.2em] uppercase px-8 py-4"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Shop Now <ArrowRight size={13} strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  // ── Order Confirmed ──────────────────────────────────────────────────────
  if (step === 'review') {
    return (
      <>
        <Helmet><title>Order Confirmed — PRAMADE</title></Helmet>
        <div className="bg-[#F8F7F4] min-h-screen flex flex-col items-center justify-center px-6 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#C0B49A]/15 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} strokeWidth={1.2} className="text-[#C0B49A]" />
            </div>
            <h1
              className="text-[#0D0D0D] font-light mb-2"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(32px, 5vw, 52px)' }}
            >
              Order Confirmed.
            </h1>
            <p
              className="text-[#0D0D0D]/50 text-[13px] mb-2 leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Thank you, {shipping.fullName.split(' ')[0]}. Your order has been placed.
            </p>
            {orderId && (
              <p
                className="text-[#C0B49A] text-[12px] tracking-[0.15em] uppercase mb-8"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Order ID: {orderId}
              </p>
            )}
            <div className="bg-white p-6 mb-8 text-left">
              <div className="flex items-center gap-3 mb-4">
                <Truck size={16} strokeWidth={1.2} className="text-[#C0B49A]" />
                <div>
                  <p className="text-[11px] tracking-[0.1em] uppercase text-[#0D0D0D]" style={{ fontFamily: 'Inter, sans-serif' }}>Shipping to</p>
                  <p className="text-[12px] text-[#0D0D0D]/50 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {shipping.line1}{shipping.line2 ? `, ${shipping.line2}` : ''}, {shipping.city}, {shipping.state} — {shipping.pincode}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#C0B49A]/20 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C0B49A]" />
                </div>
                <p className="text-[12px] text-[#0D0D0D]/50" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Estimated delivery: <span className="text-[#0D0D0D]">5–7 business days</span>
                </p>
              </div>
            </div>
            <p className="text-[11px] text-[#0D0D0D]/30 mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
              A confirmation will be sent to <span className="text-[#0D0D0D]/60">{shipping.email}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/shop"
                className="flex items-center justify-center gap-2 bg-[#0D0D0D] text-white text-[11px] tracking-[0.2em] uppercase px-8 py-4 hover:bg-[#0D0D0D]/80 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Continue Shopping <ArrowRight size={13} strokeWidth={1.5} />
              </Link>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 border border-[#0D0D0D]/20 text-[#0D0D0D] text-[11px] tracking-[0.2em] uppercase px-8 py-4 hover:border-[#0D0D0D]/60 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout — PRAMADE</title>
      </Helmet>

      <div className="bg-[#F8F7F4] min-h-screen pt-28 pb-20">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1
              className="text-[#0D0D0D] font-light leading-none"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(32px, 4vw, 52px)' }}
            >
              Checkout
            </h1>
            <Link
              to="/cart"
              className="flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase text-[#0D0D0D]/40 hover:text-[#0D0D0D] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <ChevronLeft size={13} strokeWidth={1.5} />
              Back to Cart
            </Link>
          </div>

          <StepIndicator current={step} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
            {/* ── Left: Form ──────────────────────────────────────────────── */}
            <div>
              <AnimatePresence mode="wait">
                {/* ── Shipping Step ────────────────────────────────────────── */}
                {step === 'shipping' && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white p-6 lg:p-8">
                      <h2
                        className="text-[#0D0D0D] font-light mb-6"
                        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.4rem' }}
                      >
                        Shipping Details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Full Name" error={errors.fullName} required>
                          <input
                            name="fullName"
                            value={shipping.fullName}
                            onChange={handleShippingChange}
                            placeholder="Arjun Mehta"
                            className={inputClass}
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </Field>
                        <Field label="Email" error={errors.email} required>
                          <input
                            name="email"
                            type="email"
                            value={shipping.email}
                            onChange={handleShippingChange}
                            placeholder="arjun@example.com"
                            className={inputClass}
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </Field>
                        <Field label="Phone" error={errors.phone} required>
                          <input
                            name="phone"
                            type="tel"
                            value={shipping.phone}
                            onChange={handleShippingChange}
                            placeholder="9876543210"
                            className={inputClass}
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </Field>
                        <div className="md:col-span-2">
                          <Field label="Address Line 1" error={errors.line1} required>
                            <input
                              name="line1"
                              value={shipping.line1}
                              onChange={handleShippingChange}
                              placeholder="Flat / House No., Building, Street"
                              className={inputClass}
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            />
                          </Field>
                        </div>
                        <div className="md:col-span-2">
                          <Field label="Address Line 2 (optional)">
                            <input
                              name="line2"
                              value={shipping.line2}
                              onChange={handleShippingChange}
                              placeholder="Area, Landmark"
                              className={inputClass}
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            />
                          </Field>
                        </div>
                        <Field label="City" error={errors.city} required>
                          <input
                            name="city"
                            value={shipping.city}
                            onChange={handleShippingChange}
                            placeholder="Mumbai"
                            className={inputClass}
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </Field>
                        <Field label="State" error={errors.state} required>
                          <div className="relative">
                            <select
                              name="state"
                              value={shipping.state}
                              onChange={handleShippingChange}
                              className={`${inputClass} appearance-none pr-10`}
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                              <option value="">Select state</option>
                              {INDIAN_STATES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            <ChevronDown size={14} strokeWidth={1.5} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0D0D0D]/30 pointer-events-none" />
                          </div>
                        </Field>
                        <Field label="Pincode" error={errors.pincode} required>
                          <input
                            name="pincode"
                            value={shipping.pincode}
                            onChange={handleShippingChange}
                            placeholder="400001"
                            maxLength={6}
                            className={inputClass}
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </Field>
                      </div>

                      <motion.button
                        onClick={() => { if (validateShipping()) setStep('payment'); }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-8 w-full py-4 bg-[#0D0D0D] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#0D0D0D]/80 transition-colors flex items-center justify-center gap-2"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Continue to Payment <ArrowRight size={13} strokeWidth={1.5} />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ── Payment Step ─────────────────────────────────────────── */}
                {step === 'payment' && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white p-6 lg:p-8">
                      <h2
                        className="text-[#0D0D0D] font-light mb-6"
                        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.4rem' }}
                      >
                        Payment Method
                      </h2>

                      <div className="flex flex-col gap-3 mb-8">
                        {[
                          { id: 'upi' as PaymentMethod, icon: <Smartphone size={18} strokeWidth={1.2} />, label: 'UPI', sub: 'GPay, PhonePe, Paytm, BHIM' },
                          { id: 'card' as PaymentMethod, icon: <CreditCard size={18} strokeWidth={1.2} />, label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
                          { id: 'cod' as PaymentMethod, icon: <Banknote size={18} strokeWidth={1.2} />, label: 'Cash on Delivery', sub: 'Pay when your order arrives' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setPaymentMethod(opt.id)}
                            className={`flex items-center gap-4 p-4 border text-left transition-all duration-200 ${
                              paymentMethod === opt.id
                                ? 'border-[#0D0D0D] bg-[#0D0D0D]/2'
                                : 'border-[#0D0D0D]/12 hover:border-[#0D0D0D]/30'
                            }`}
                          >
                            <div className={`${paymentMethod === opt.id ? 'text-[#0D0D0D]' : 'text-[#0D0D0D]/30'}`}>
                              {opt.icon}
                            </div>
                            <div className="flex-1">
                              <p
                                className={`text-[12px] tracking-[0.05em] ${paymentMethod === opt.id ? 'text-[#0D0D0D]' : 'text-[#0D0D0D]/60'}`}
                                style={{ fontFamily: 'Inter, sans-serif' }}
                              >
                                {opt.label}
                              </p>
                              <p
                                className="text-[11px] text-[#0D0D0D]/30 mt-0.5"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                              >
                                {opt.sub}
                              </p>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                paymentMethod === opt.id ? 'border-[#0D0D0D]' : 'border-[#0D0D0D]/20'
                              }`}
                            >
                              {paymentMethod === opt.id && (
                                <div className="w-2 h-2 rounded-full bg-[#0D0D0D]" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* UPI placeholder */}
                      <AnimatePresence>
                        {paymentMethod === 'upi' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-6"
                          >
                            <div className="bg-[#F8F7F4] p-4 border border-[#0D0D0D]/8">
                              <p className="text-[11px] text-[#0D0D0D]/40 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Enter your UPI ID
                              </p>
                              <input
                                type="text"
                                placeholder="yourname@upi"
                                className="w-full border border-[#0D0D0D]/15 bg-white px-4 py-3 text-[13px] text-[#0D0D0D] placeholder-[#0D0D0D]/25 focus:outline-none focus:border-[#0D0D0D]/40 transition-colors"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                              />
                            </div>
                          </motion.div>
                        )}
                        {paymentMethod === 'card' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-6"
                          >
                            <div className="bg-[#F8F7F4] p-4 border border-[#0D0D0D]/8 flex flex-col gap-3">
                              <input
                                type="text"
                                placeholder="Card number"
                                maxLength={19}
                                className="w-full border border-[#0D0D0D]/15 bg-white px-4 py-3 text-[13px] text-[#0D0D0D] placeholder-[#0D0D0D]/25 focus:outline-none focus:border-[#0D0D0D]/40 transition-colors"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  placeholder="MM / YY"
                                  maxLength={7}
                                  className="border border-[#0D0D0D]/15 bg-white px-4 py-3 text-[13px] text-[#0D0D0D] placeholder-[#0D0D0D]/25 focus:outline-none focus:border-[#0D0D0D]/40 transition-colors"
                                  style={{ fontFamily: 'Inter, sans-serif' }}
                                />
                                <input
                                  type="text"
                                  placeholder="CVV"
                                  maxLength={4}
                                  className="border border-[#0D0D0D]/15 bg-white px-4 py-3 text-[13px] text-[#0D0D0D] placeholder-[#0D0D0D]/25 focus:outline-none focus:border-[#0D0D0D]/40 transition-colors"
                                  style={{ fontFamily: 'Inter, sans-serif' }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex items-center gap-2 mb-6 text-[11px] text-[#0D0D0D]/30" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <Lock size={12} strokeWidth={1.5} className="text-[#C0B49A]" />
                        Your payment information is encrypted and secure.
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setStep('shipping')}
                          className="flex items-center gap-1.5 border border-[#0D0D0D]/15 text-[#0D0D0D]/60 text-[11px] tracking-[0.15em] uppercase px-6 py-4 hover:border-[#0D0D0D]/40 transition-colors"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          <ChevronLeft size={13} strokeWidth={1.5} />
                          Back
                        </button>
                        <motion.button
                          onClick={handlePlaceOrder}
                          disabled={loading}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 py-4 bg-[#0D0D0D] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#0D0D0D]/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {loading ? 'Placing Order...' : (
                            <>Place Order <ArrowRight size={13} strokeWidth={1.5} /></>
                          )}
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {orderError && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-red-500 text-[12px] mt-3 text-center"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {orderError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Right: Order Summary ─────────────────────────────────────── */}
            <div className="bg-white p-6 h-fit sticky top-28">
              <h3
                className="text-[#0D0D0D] font-light mb-5"
                style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.3rem' }}
              >
                Order Summary
              </h3>

              <div className="flex flex-col gap-3 mb-5">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center gap-3">
                    <div className="relative w-12 h-14 shrink-0 bg-[#E8E6E0]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#0D0D0D] text-white text-[9px] rounded-full flex items-center justify-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-[#0D0D0D] leading-snug truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</p>
                      <p className="text-[10px] text-[#0D0D0D]/40 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>Size: {item.size}</p>
                    </div>
                    <span className="text-[12px] text-[#0D0D0D] shrink-0" style={{ fontFamily: 'Inter, sans-serif' }}>
                      ₹{((item.price * item.quantity) / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2.5 py-4 border-t border-[#0D0D0D]/8 text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="flex justify-between">
                  <span className="text-[#0D0D0D]/50">Subtotal</span>
                  <span className="text-[#0D0D0D]">{totals.subtotalDisplay}</span>
                </div>
                {totals.discountDisplay && (
                  <div className="flex justify-between">
                    <span className="text-[#C0B49A]">Discount</span>
                    <span className="text-[#C0B49A]">{totals.discountDisplay}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#0D0D0D]/50">Shipping</span>
                  <span className="text-[#0D0D0D]">{totals.shippingDisplay}</span>
                </div>
              </div>

              <div className="flex justify-between py-4 border-t border-[#0D0D0D]/15">
                <span className="text-[12px] tracking-[0.1em] uppercase text-[#0D0D0D]" style={{ fontFamily: 'Inter, sans-serif' }}>Total</span>
                <span className="text-[#0D0D0D] font-light" style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.2rem' }}>
                  {totals.totalDisplay}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
