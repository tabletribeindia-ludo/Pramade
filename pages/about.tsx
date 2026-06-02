import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, useInView } from 'motion/react';
import {
  ArrowRight,
  Layers,
  Zap,
  Heart,
  Users,
  Star,
  Instagram,
  Mail,
} from 'lucide-react';

// ─── FadeUp ───────────────────────────────────────────────────────────────────
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
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[#C0B49A] text-[10px] tracking-[0.4em] uppercase mb-4"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {children}
    </p>
  );
}

// ─── Heading ──────────────────────────────────────────────────────────────────
function Heading({
  children,
  light = false,
  size = 'lg',
}: {
  children: React.ReactNode;
  light?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const sizes = {
    sm: '1.5rem',
    md: 'clamp(24px, 3vw, 36px)',
    lg: 'clamp(32px, 4vw, 56px)',
    xl: 'clamp(48px, 7vw, 96px)',
  };
  return (
    <h2
      className={`font-light leading-tight ${light ? 'text-white' : 'text-[#0D0D0D]'}`}
      style={{
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontSize: sizes[size],
      }}
    >
      {children}
    </h2>
  );
}

// ─── Values data ──────────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: Layers,
    title: 'Uncompromising Fabric',
    body: 'Every PRAMADE piece starts with GSM-400+ cotton. We refuse to cut corners on the base — because everything else is built on top of it.',
  },
  {
    icon: Zap,
    title: 'Print That Lasts',
    body: 'Puff print, DTF, embroidery — each technique chosen for the design, not the cost. We test every method until it survives a hundred washes.',
  },
  {
    icon: Heart,
    title: 'Made for the Few',
    body: 'We don\'t chase volume. Every drop is capped. Every piece is numbered. Scarcity isn\'t a marketing trick — it\'s how we maintain quality.',
  },
  {
    icon: Users,
    title: 'Community First',
    body: 'PRAMADE grew from a group chat. Our community shapes the drops, votes on colorways, and gets early access before anyone else.',
  },
];

// ─── Timeline ─────────────────────────────────────────────────────────────────
const TIMELINE = [
  {
    year: '2023',
    title: 'The Idea',
    body: 'Two friends frustrated with fast fashion. A shared belief that streetwear could be made better — heavier, bolder, more intentional.',
  },
  {
    year: '2024',
    title: 'Drop 001 — Origin',
    body: '40 pieces. Sold to friends and followers. Sold out in 3 days. The proof of concept that changed everything.',
  },
  {
    year: '2025',
    title: 'Drops 002 & 003',
    body: 'Script and Arch. 140 combined pieces. A growing waitlist. A community that started calling itself PRAMADE.',
  },
  {
    year: '2026',
    title: 'Drop 004 — Unnamed',
    body: '120 pieces. Our most ambitious drop yet. Heavier fabric, bolder print, and a waitlist that proves the demand is real.',
  },
];

// ─── Ambassador perks ─────────────────────────────────────────────────────────
const AMBASSADOR_PERKS = [
  'VIP access to every drop — guaranteed',
  'Exclusive ambassador-only colorways',
  'Early product previews before public reveal',
  '20% off all purchases, always',
  'Co-create future drops with the team',
  'Featured on PRAMADE social channels',
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About — PRAMADE</title>
        <meta
          name="description"
          content="PRAMADE is a premium luxury streetwear brand built on uncompromising fabric, bold print techniques, and a community that shapes every drop."
        />
        <meta property="og:title" content="About — PRAMADE" />
        <meta
          property="og:description"
          content="Crafted for the few. The story behind PRAMADE."
        />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden bg-[#0D0D0D]">
        <div className="absolute inset-0">
          <img
            src="/airo-assets/images/pages/about/hero"
            alt="PRAMADE atelier"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 pb-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p
              className="text-[#C0B49A] text-[10px] tracking-[0.4em] uppercase mb-5"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Our Story
            </p>
            <h1
              className="text-white font-light italic leading-none mb-6"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(52px, 8vw, 120px)',
              }}
            >
              Crafted<br />for the Few.
            </h1>
            <p
              className="text-white/40 text-[14px] max-w-md leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              PRAMADE is not a brand. It's a standard. A refusal to accept mediocre fabric, lazy print, and disposable fashion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Manifesto ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] py-24 px-6 lg:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
            {/* Image */}
            <FadeUp>
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src="/airo-assets/images/pages/about/manifesto"
                  alt="PRAMADE fabric detail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/40 to-transparent" />
                {/* Stat overlay */}
                <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-4">
                  {[
                    { num: '300+', label: 'Pieces Made' },
                    { num: '4', label: 'Drops' },
                    { num: '0', label: 'Restocks' },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p
                        className="text-white font-light leading-none"
                        style={{
                          fontFamily: '"Cormorant Garamond", Georgia, serif',
                          fontSize: '2rem',
                        }}
                      >
                        {s.num}
                      </p>
                      <p
                        className="text-white/40 text-[9px] tracking-[0.2em] uppercase mt-1"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* Text */}
            <FadeUp delay={0.15}>
              <div>
                <Label>The Manifesto</Label>
                <Heading light size="lg">
                  We Build What<br />We Wish Existed.
                </Heading>
                <div
                  className="mt-8 flex flex-col gap-5 text-white/50 text-[14px] leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <p>
                    PRAMADE started with a simple frustration: every streetwear brand was making the same thing. Thin fabric. Cheap print. A logo slapped on and called premium.
                  </p>
                  <p>
                    We decided to do it differently. GSM-400+ cotton. Puff print that stands off the fabric. Embroidery that doesn't fade. DTF that doesn't crack. Every technique chosen because it's the right one for the design — not because it's the cheapest.
                  </p>
                  <p>
                    We keep drops small on purpose. 40 to 120 pieces. No restocks. When it's gone, it's gone. That's not a gimmick — it's how we ensure every piece gets the attention it deserves.
                  </p>
                </div>
                <Link
                  to="/drops"
                  className="inline-flex items-center gap-2 mt-10 text-[11px] tracking-[0.2em] uppercase text-[#C0B49A] hover:text-white transition-colors border-b border-[#C0B49A]/30 hover:border-white/40 pb-1"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  See the Drops <ArrowRight size={12} strokeWidth={1.5} />
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────────────── */}
      <section className="bg-[#111] py-24 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <FadeUp className="text-center mb-16">
            <Label>What We Stand For</Label>
            <Heading light size="lg">
              Four Principles.<br />No Exceptions.
            </Heading>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {VALUES.map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.08}>
                <div className="bg-[#111] p-8 lg:p-10 group hover:bg-[#0D0D0D] transition-colors duration-300">
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center mb-6 group-hover:border-[#C0B49A]/40 transition-colors">
                    <v.icon size={18} strokeWidth={1.2} className="text-[#C0B49A]" />
                  </div>
                  <h3
                    className="text-white font-light mb-3"
                    style={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: '1.4rem',
                    }}
                  >
                    {v.title}
                  </h3>
                  <p
                    className="text-white/40 text-[13px] leading-relaxed"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {v.body}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Craftsmanship ─────────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] py-24 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <div>
                <Label>The Craft</Label>
                <Heading light size="lg">
                  Every Technique<br />Has a Reason.
                </Heading>
                <div
                  className="mt-8 flex flex-col gap-6 text-white/50 text-[13px] leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {[
                    {
                      name: 'Puff Print',
                      desc: 'Heat-activated ink that rises off the fabric. Creates a 3D texture you can feel. Used for bold graphic statements.',
                    },
                    {
                      name: 'Embroidery',
                      desc: 'Thread sewn directly into the fabric. Permanent, textured, premium. Used for logos, wordmarks, and fine detail.',
                    },
                    {
                      name: 'DTF (Direct to Film)',
                      desc: 'Full-color precision printing transferred directly to fabric. Used for complex multi-color artwork that screen printing can\'t achieve.',
                    },
                    {
                      name: 'Screen Print',
                      desc: 'Ink pushed through a mesh stencil. The classic technique. Used for clean, bold, single-color graphics that last decades.',
                    },
                  ].map((tech) => (
                    <div key={tech.name} className="flex gap-4">
                      <div className="w-1 bg-[#C0B49A]/30 shrink-0 mt-1" />
                      <div>
                        <p
                          className="text-white text-[12px] tracking-[0.1em] uppercase mb-1"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {tech.name}
                        </p>
                        <p className="text-white/40">{tech.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="/airo-assets/images/pages/about/craft"
                  alt="PRAMADE craftsmanship"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#0D0D0D]/60" />
                <div className="absolute bottom-6 left-6">
                  <p
                    className="text-[#C0B49A] text-[10px] tracking-[0.3em] uppercase"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Made in India
                  </p>
                  <p
                    className="text-white/40 text-[11px] mt-1"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Every piece produced locally, with care.
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────────────── */}
      <section className="bg-[#111] py-24 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <FadeUp className="mb-16">
            <Label>The Journey</Label>
            <Heading light size="lg">
              How We Got Here.
            </Heading>
          </FadeUp>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[3.5rem] top-0 bottom-0 w-px bg-white/8 hidden md:block" />

            <div className="flex flex-col gap-12">
              {TIMELINE.map((item, i) => (
                <FadeUp key={item.year} delay={i * 0.1}>
                  <div className="grid grid-cols-1 md:grid-cols-[7rem_1fr] gap-6 items-start">
                    {/* Year */}
                    <div className="flex items-center gap-4 md:flex-col md:items-end md:pr-8">
                      <div className="w-2 h-2 rounded-full bg-[#C0B49A] shrink-0 hidden md:block md:mt-1.5" />
                      <span
                        className="text-[#C0B49A] text-[11px] tracking-[0.2em]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {item.year}
                      </span>
                    </div>
                    {/* Content */}
                    <div className="md:pl-8">
                      <h3
                        className="text-white font-light mb-2"
                        style={{
                          fontFamily: '"Cormorant Garamond", Georgia, serif',
                          fontSize: '1.4rem',
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-white/40 text-[13px] leading-relaxed max-w-lg"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Community ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] py-24 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="/airo-assets/images/pages/about/community"
                  alt="PRAMADE community"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/50 to-transparent" />
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div>
                <Label>The Community</Label>
                <Heading light size="lg">
                  Built by the<br />People Who Wear It.
                </Heading>
                <div
                  className="mt-8 flex flex-col gap-5 text-white/50 text-[14px] leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <p>
                    PRAMADE didn't start with a business plan. It started with a group chat of people who cared about what they wore. That community is still at the center of everything we do.
                  </p>
                  <p>
                    Our community votes on colorways. They suggest techniques. They tell us when something isn't good enough. And they're always the first to know when a drop is coming.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { num: '2,400+', label: 'Waitlist Members' },
                    { num: '18K+', label: 'Instagram Followers' },
                    { num: '94%', label: 'Repeat Customers' },
                    { num: '4.9★', label: 'Average Rating' },
                  ].map((stat) => (
                    <div key={stat.label} className="border border-white/8 p-4">
                      <p
                        className="text-white font-light leading-none mb-1"
                        style={{
                          fontFamily: '"Cormorant Garamond", Georgia, serif',
                          fontSize: '1.8rem',
                        }}
                      >
                        {stat.num}
                      </p>
                      <p
                        className="text-white/30 text-[10px] tracking-[0.15em] uppercase"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <a
                  href="https://instagram.com/pramade.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-8 text-[11px] tracking-[0.2em] uppercase text-[#C0B49A] hover:text-white transition-colors border-b border-[#C0B49A]/30 hover:border-white/40 pb-1"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Instagram size={13} strokeWidth={1.5} />
                  Follow @pramade.in
                </a>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Ambassador Program ────────────────────────────────────────────── */}
      <section className="bg-[#111] py-24 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <FadeUp>
              <Label>Ambassador Program</Label>
              <Heading light size="lg">
                Represent<br />PRAMADE.
              </Heading>
              <div
                className="mt-6 text-white/50 text-[14px] leading-relaxed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <p>
                  We're looking for people who genuinely love what we make. Not influencers chasing free product — people who wear PRAMADE because they believe in it.
                </p>
                <p className="mt-4">
                  If that's you, apply below. We review every application personally. No automated responses.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="border border-white/8 p-8">
                <p
                  className="text-[#C0B49A] text-[10px] tracking-[0.3em] uppercase mb-6"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  What You Get
                </p>
                <ul className="flex flex-col gap-3 mb-8">
                  {AMBASSADOR_PERKS.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-3 text-[13px] text-white/60"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <Star
                        size={10}
                        className="text-[#C0B49A] mt-1 shrink-0"
                        fill="currentColor"
                      />
                      {perk}
                    </li>
                  ))}
                </ul>
                <AmbassadorForm />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] py-24 px-6 border-t border-white/5">
        <div className="max-w-[700px] mx-auto text-center">
          <FadeUp>
            <Label>Ready?</Label>
            <Heading light size="xl">
              Join the Few.
            </Heading>
            <p
              className="text-white/40 text-[14px] mt-5 mb-10 leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Drop 004 is coming June 20. 120 pieces. No restocks. Join the waitlist and choose your access tier.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/drops"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0D0D0D] text-[11px] tracking-[0.2em] uppercase px-8 py-4 hover:bg-[#C0B49A] hover:text-white transition-all duration-300"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Join the Waitlist <ArrowRight size={13} strokeWidth={1.5} />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white text-[11px] tracking-[0.2em] uppercase px-8 py-4 hover:border-white/50 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Shop Now
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

// ─── Ambassador inline form ───────────────────────────────────────────────────
function AmbassadorForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', instagram: '', email: '', why: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission — no backend needed for MVP
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center py-4">
        <Mail size={24} strokeWidth={1.2} className="text-[#C0B49A] mx-auto mb-3" />
        <p
          className="text-white font-light mb-1"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.2rem' }}
        >
          Application received.
        </p>
        <p
          className="text-white/40 text-[12px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          We'll be in touch within 5–7 days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full name *"
        required
        className="bg-white/5 border border-white/10 text-white placeholder-white/25 px-4 py-3 text-[12px] focus:outline-none focus:border-[#C0B49A]/50 transition-colors"
        style={{ fontFamily: 'Inter, sans-serif' }}
      />
      <div className="relative">
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-[12px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          @
        </span>
        <input
          name="instagram"
          value={form.instagram}
          onChange={handleChange}
          placeholder="Instagram handle *"
          required
          className="w-full bg-white/5 border border-white/10 text-white placeholder-white/25 pl-8 pr-4 py-3 text-[12px] focus:outline-none focus:border-[#C0B49A]/50 transition-colors"
          style={{ fontFamily: 'Inter, sans-serif' }}
        />
      </div>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email *"
        required
        className="bg-white/5 border border-white/10 text-white placeholder-white/25 px-4 py-3 text-[12px] focus:outline-none focus:border-[#C0B49A]/50 transition-colors"
        style={{ fontFamily: 'Inter, sans-serif' }}
      />
      <textarea
        name="why"
        value={form.why}
        onChange={handleChange}
        placeholder="Why do you want to represent PRAMADE? (optional)"
        rows={3}
        className="bg-white/5 border border-white/10 text-white placeholder-white/25 px-4 py-3 text-[12px] focus:outline-none focus:border-[#C0B49A]/50 transition-colors resize-none"
        style={{ fontFamily: 'Inter, sans-serif' }}
      />
      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 bg-white text-[#0D0D0D] text-[10px] tracking-[0.2em] uppercase hover:bg-[#C0B49A] hover:text-white transition-all duration-300 disabled:opacity-50"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {loading ? 'Sending...' : 'Apply to Become an Ambassador'}
      </motion.button>
    </form>
  );
}

// useState import needed for AmbassadorForm
import { useState } from 'react';
