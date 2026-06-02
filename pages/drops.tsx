import { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, useInView, AnimatePresence } from 'motion/react';

import {
  ArrowRight,
  CheckCircle,
  Clock,
  Zap,
  Crown,
  Star,
  Lock,
  ChevronDown,
  Instagram,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Drop {
  id: string;
  number: string;
  name: string;
  date: string; // ISO
  status: 'upcoming' | 'live' | 'sold-out';
  teaser: string;
  pieces: number;
  image: string;
}

interface Tier {
  id: string;
  icon: React.ReactNode;
  name: string;
  label: string;
  perks: string[];
  color: string;
  featured?: boolean;
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function useCountdown(targetDate: string) {
  const calc = useCallback(() => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { days, hours, minutes, seconds, expired: false };
  }, [targetDate]);

  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);
  return time;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative overflow-hidden"
        style={{ minWidth: '4rem' }}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="block text-white font-light text-center"
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(48px, 6vw, 80px)',
              lineHeight: 1,
            }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span
        className="text-white/30 text-[9px] tracking-[0.3em] uppercase mt-2"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── FadeUp ───────────────────────────────────────────────────────────────────
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

// ─── Waitlist Form ────────────────────────────────────────────────────────────
function WaitlistForm({ dropId, dropName }: { dropId: string; dropName: string }) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [tier, setTier] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ position: number; total: number; tier: string } | null>(null);
  const [showExtra, setShowExtra] = useState(false);

  const [form, setForm] = useState({
    email: '',
    name: '',
    phone: '',
    city: '',
    instagram: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) { setError('Email is required.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, drop: dropId, tier }),
      });
      const data = await res.json() as { success?: boolean; message?: string; position?: number; total?: number; tier?: string; error?: string };
      if (!res.ok) {
        if (res.status === 409) {
          setError("You're already on the waitlist for this drop.");
        } else {
          setError(data.error ?? 'Something went wrong. Please try again.');
        }
        return;
      }
      setResult({ position: data.position ?? 1, total: data.total ?? 1, tier: data.tier ?? tier });
      setStep('success');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success' && result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center py-8"
      >
        <div className="w-14 h-14 rounded-full bg-[#C0B49A]/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={28} strokeWidth={1.2} className="text-[#C0B49A]" />
        </div>
        <h3
          className="text-white font-light mb-2"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.8rem' }}
        >
          You're on the list.
        </h3>
        <p
          className="text-white/50 text-[13px] mb-6"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Position <span className="text-[#C0B49A] font-medium">#{result.position}</span> of {result.total} on the {dropName} waitlist.
        </p>
        <div className="inline-flex items-center gap-2 border border-white/10 px-5 py-2.5">
          <span
            className="text-[10px] tracking-[0.2em] uppercase text-white/40"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Tier
          </span>
          <span
            className="text-[11px] tracking-[0.15em] uppercase text-[#C0B49A]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {result.tier === 'vip' ? 'VIP Access' : result.tier === 'early' ? 'Early Access' : 'Standard'}
          </span>
        </div>
        <p
          className="text-white/30 text-[11px] mt-6"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          We'll email you 24 hours before the drop goes live.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Tier selector */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        {[
          { id: 'standard', label: 'Standard', sub: 'General access' },
          { id: 'early', label: 'Early', sub: '2hr head start' },
          { id: 'vip', label: 'VIP', sub: 'First 10 mins' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTier(t.id)}
            className={`border py-3 px-2 text-center transition-all duration-200 ${
              tier === t.id
                ? 'border-[#C0B49A] bg-[#C0B49A]/10'
                : 'border-white/10 hover:border-white/25'
            }`}
          >
            <p
              className={`text-[11px] tracking-[0.12em] uppercase mb-0.5 ${tier === t.id ? 'text-[#C0B49A]' : 'text-white/60'}`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {t.label}
            </p>
            <p
              className="text-[9px] text-white/30"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {t.sub}
            </p>
          </button>
        ))}
      </div>

      {/* Email */}
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email address *"
        required
        className="bg-white/5 border border-white/10 text-white placeholder-white/25 px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#C0B49A]/60 transition-colors"
        style={{ fontFamily: 'Inter, sans-serif' }}
      />

      {/* Name */}
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full name"
        className="bg-white/5 border border-white/10 text-white placeholder-white/25 px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#C0B49A]/60 transition-colors"
        style={{ fontFamily: 'Inter, sans-serif' }}
      />

      {/* Toggle extra fields */}
      <button
        type="button"
        onClick={() => setShowExtra(!showExtra)}
        className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors self-start"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        <ChevronDown
          size={12}
          strokeWidth={1.5}
          className={`transition-transform duration-200 ${showExtra ? 'rotate-180' : ''}`}
        />
        {showExtra ? 'Less details' : 'Add city, phone, Instagram (optional)'}
      </button>

      <AnimatePresence>
        {showExtra && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden flex flex-col gap-3"
          >
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone number"
              className="bg-white/5 border border-white/10 text-white placeholder-white/25 px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#C0B49A]/60 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="bg-white/5 border border-white/10 text-white placeholder-white/25 px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#C0B49A]/60 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>@</span>
              <input
                type="text"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="Instagram handle"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/25 pl-8 pr-4 py-3.5 text-[13px] focus:outline-none focus:border-[#C0B49A]/60 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 text-[12px]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-white text-[#0D0D0D] text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#C0B49A] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {loading ? 'Joining...' : 'Join the Waitlist'}
      </motion.button>

      <p
        className="text-white/20 text-[10px] text-center"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        No spam. Unsubscribe anytime. We only email when a drop is live.
      </p>
    </form>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const DROPS: Drop[] = [
  {
    id: 'drop-004',
    number: '004',
    name: 'Unnamed',
    date: '2026-06-20T10:00:00+05:30',
    status: 'upcoming',
    teaser: 'The fourth chapter. Heavier fabric. Bolder print. Still unnamed.',
    pieces: 120,
    image: '/airo-assets/images/pages/home/drop-teaser',
  },
  {
    id: 'drop-003',
    number: '003',
    name: 'Arch',
    date: '2026-03-15T10:00:00+05:30',
    status: 'sold-out',
    teaser: 'Puff arch graphics on GSM-400 cotton. Sold out in 8 minutes.',
    pieces: 80,
    image: '/airo-assets/images/pages/home/product-1',
  },
  {
    id: 'drop-002',
    number: '002',
    name: 'Script',
    date: '2025-11-10T10:00:00+05:30',
    status: 'sold-out',
    teaser: 'Tonal embroidery on Japanese fleece. 60 pieces. Gone in 4 minutes.',
    pieces: 60,
    image: '/airo-assets/images/pages/home/product-2',
  },
  {
    id: 'drop-001',
    number: '001',
    name: 'Origin',
    date: '2025-07-01T10:00:00+05:30',
    status: 'sold-out',
    teaser: 'Where it started. 40 pieces. The first PRAMADE drop.',
    pieces: 40,
    image: '/airo-assets/images/pages/home/product-4',
  },
];

const TIERS: Tier[] = [
  {
    id: 'standard',
    icon: <Clock size={20} strokeWidth={1.2} />,
    name: 'Standard',
    label: 'General Access',
    color: 'text-white/60',
    perks: [
      'Waitlist confirmation email',
      'Drop notification 1 hour before',
      'Access when drop goes live',
    ],
  },
  {
    id: 'early',
    icon: <Zap size={20} strokeWidth={1.2} />,
    name: 'Early Access',
    label: '2-Hour Head Start',
    color: 'text-[#C0B49A]',
    featured: true,
    perks: [
      'Everything in Standard',
      'Shop 2 hours before general access',
      'Size reservation (hold for 10 mins)',
      'Exclusive early-access colorways',
    ],
  },
  {
    id: 'vip',
    icon: <Crown size={20} strokeWidth={1.2} />,
    name: 'VIP',
    label: 'First 10 Minutes',
    color: 'text-white',
    perks: [
      'Everything in Early Access',
      'First 10 minutes of every drop',
      'Guaranteed size (if registered 48h prior)',
      'Handwritten thank-you note',
      'Priority customer support',
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DropsPage() {
  const upcomingDrop = DROPS.find((d) => d.status === 'upcoming');
  const pastDrops = DROPS.filter((d) => d.status === 'sold-out');
  const countdown = useCountdown(upcomingDrop?.date ?? '2026-06-20T10:00:00+05:30');

  return (
    <>
      <Helmet>
        <title>Drops — PRAMADE</title>
        <meta name="description" content="PRAMADE limited-edition drops. Join the waitlist for Drop 004 and be first in line. VIP, Early Access, and Standard tiers available." />
        <meta property="og:title" content="Drops — PRAMADE" />
        <meta property="og:description" content="Limited drops. Join the waitlist. Be first." />
      </Helmet>

      {/* ── Hero / Countdown ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0D0D0D]">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/airo-assets/images/pages/home/drop-teaser"
            alt="Drop 004"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/60 via-[#0D0D0D]/40 to-[#0D0D0D]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          {/* Drop label */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#C0B49A] text-[10px] tracking-[0.4em] uppercase mb-6"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Drop 004 · June 20, 2026
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-white font-light italic leading-none mb-4"
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(52px, 8vw, 110px)',
            }}
          >
            Something New<br />is Coming.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-white/40 text-[13px] mb-14 max-w-md mx-auto leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            120 pieces. Unnamed. Heavier fabric. Bolder print. The fourth chapter of PRAMADE.
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex items-start justify-center gap-6 md:gap-10 mb-16"
          >
            <CountdownUnit value={countdown.days} label="Days" />
            <span className="text-white/20 mt-3" style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '3rem' }}>:</span>
            <CountdownUnit value={countdown.hours} label="Hours" />
            <span className="text-white/20 mt-3" style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '3rem' }}>:</span>
            <CountdownUnit value={countdown.minutes} label="Minutes" />
            <span className="text-white/20 mt-3" style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '3rem' }}>:</span>
            <CountdownUnit value={countdown.seconds} label="Seconds" />
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="text-white/20 text-[10px] tracking-[0.3em] uppercase"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Join the Waitlist
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown size={16} strokeWidth={1} className="text-white/20" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Waitlist Form + Tiers ─────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] py-24 px-6 lg:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">

            {/* Left: Form */}
            <FadeUp>
              <div>
                <p
                  className="text-[#C0B49A] text-[10px] tracking-[0.35em] uppercase mb-4"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Drop 004 Waitlist
                </p>
                <h2
                  className="text-white font-light leading-tight mb-3"
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: 'clamp(32px, 4vw, 52px)',
                  }}
                >
                  Be First.<br />Always.
                </h2>
                <p
                  className="text-white/40 text-[13px] leading-relaxed mb-10"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  120 pieces. One drop. No restocks. Choose your access tier and lock in your spot before June 20.
                </p>
                <WaitlistForm dropId="drop-004" dropName="Drop 004" />
              </div>
            </FadeUp>

            {/* Right: Tier breakdown */}
            <FadeUp delay={0.15}>
              <div>
                <p
                  className="text-[#C0B49A] text-[10px] tracking-[0.35em] uppercase mb-4"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Access Tiers
                </p>
                <h2
                  className="text-white font-light leading-tight mb-10"
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: 'clamp(28px, 3vw, 44px)',
                  }}
                >
                  Choose Your<br />Access Level.
                </h2>
                <div className="flex flex-col gap-4">
                  {TIERS.map((t, i) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className={`border p-5 ${
                        t.featured
                          ? 'border-[#C0B49A]/40 bg-[#C0B49A]/5'
                          : 'border-white/8 bg-white/2'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-0.5 ${t.color}`}>{t.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span
                              className={`text-[12px] tracking-[0.15em] uppercase font-medium ${t.color}`}
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                              {t.name}
                            </span>
                            {t.featured && (
                              <span
                                className="text-[9px] tracking-[0.2em] uppercase bg-[#C0B49A]/20 text-[#C0B49A] px-2 py-0.5"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                              >
                                Most Popular
                              </span>
                            )}
                          </div>
                          <p
                            className="text-white/30 text-[11px] mb-3"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {t.label}
                          </p>
                          <ul className="flex flex-col gap-1.5">
                            {t.perks.map((perk) => (
                              <li
                                key={perk}
                                className="flex items-start gap-2 text-[11px] text-white/50"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                              >
                                <Star size={9} className="text-[#C0B49A] mt-1 shrink-0" />
                                {perk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="bg-[#111] py-24 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <FadeUp className="text-center mb-16">
            <p
              className="text-[#C0B49A] text-[10px] tracking-[0.35em] uppercase mb-4"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              The Process
            </p>
            <h2
              className="text-white font-light"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(32px, 4vw, 56px)',
              }}
            >
              How Drops Work.
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Join the Waitlist', body: 'Register your email and choose your access tier before the drop date.' },
              { step: '02', title: 'Get Notified', body: 'We email you based on your tier — VIP first, then Early, then Standard.' },
              { step: '03', title: 'Shop Your Window', body: 'Your access window opens. Shop before your time runs out.' },
              { step: '04', title: 'No Restocks', body: 'Once it\'s gone, it\'s gone. Every piece is limited. No second chances.' },
            ].map((item, i) => (
              <FadeUp key={item.step} delay={i * 0.1}>
                <div className="flex flex-col">
                  <span
                    className="text-[#C0B49A]/30 font-light mb-4 leading-none"
                    style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '3rem' }}
                  >
                    {item.step}
                  </span>
                  <h3
                    className="text-white font-light mb-3"
                    style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.3rem' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-white/35 text-[12px] leading-relaxed"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.body}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Past Drops ───────────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] py-24 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <FadeUp className="flex items-end justify-between mb-12">
            <div>
              <p
                className="text-[#C0B49A] text-[10px] tracking-[0.35em] uppercase mb-3"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Archive
              </p>
              <h2
                className="text-white font-light"
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: 'clamp(32px, 4vw, 56px)',
                }}
              >
                Past Drops.
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={12} strokeWidth={1.5} className="text-white/20" />
              <span
                className="text-white/20 text-[11px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                All sold out
              </span>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastDrops.map((drop, i) => (
              <FadeUp key={drop.id} delay={i * 0.1}>
                <div className="group relative overflow-hidden">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={drop.image}
                      alt={`Drop ${drop.number} — ${drop.name}`}
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-80 group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span
                        className="bg-white/10 backdrop-blur-sm text-white/60 text-[9px] tracking-[0.25em] uppercase px-3 py-1.5"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Sold Out
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p
                        className="text-white/40 text-[10px] tracking-[0.25em] uppercase mb-1"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Drop {drop.number}
                      </p>
                      <h3
                        className="text-white font-light text-xl"
                        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
                      >
                        {drop.name}
                      </h3>
                      <p
                        className="text-white/40 text-[11px] mt-1.5 leading-relaxed"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {drop.teaser}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social CTA ───────────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] py-16 px-6 border-t border-white/5">
        <div className="max-w-[600px] mx-auto text-center">
          <FadeUp>
            <Instagram size={24} strokeWidth={1.2} className="text-white/20 mx-auto mb-5" />
            <p
              className="text-white/40 text-[13px] leading-relaxed mb-6"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Follow <span className="text-white/70">@pramade.in</span> for drop previews, behind-the-scenes, and early hints before the waitlist opens.
            </p>
            <a
              href="https://instagram.com/pramade.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/15 text-white/60 hover:text-white hover:border-white/40 text-[11px] tracking-[0.2em] uppercase px-6 py-3 transition-all duration-300"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Follow on Instagram <ArrowRight size={12} strokeWidth={1.5} />
            </a>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
