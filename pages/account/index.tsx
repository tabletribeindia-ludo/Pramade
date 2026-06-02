import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  Edit2,
  Check,
  X,
  Trash2,
  ShoppingBag,
  Bell,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { useSession, signOut } from '@/lib/auth/auth-client';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Order {
  orderId: string;
  items: { name: string; size: string; quantity: number; price: number; image?: string }[];
  total: number;
  status: string;
  createdAt: string;
  estimatedDelivery: string;
  shipping: { fullName: string; city: string; state: string };
  paymentMethod: string;
}

interface SavedItem {
  id: number;
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  productCategory?: string;
}

interface Preferences {
  notifyDrops: boolean;
  notifyOrders: boolean;
  notifyNewsletter: boolean;
  preferredSizes: string;
  preferredCategories: string;
}

type Tab = 'profile' | 'orders' | 'saved' | 'preferences';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIES = ['Puff Print', 'Embroidered', 'DTF', 'Oversized', 'Limited Drops', 'Graphic Tees'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatPrice(paise: number) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

function statusColor(status: string) {
  if (status === 'confirmed') return 'text-[#C0B49A]';
  if (status === 'shipped') return 'text-blue-400';
  if (status === 'delivered') return 'text-green-400';
  return 'text-white/40';
}

// ─── Tab Button ───────────────────────────────────────────────────────────────
function TabBtn({
  id, active, icon: Icon, label, onClick,
}: {
  id: Tab; active: boolean; icon: React.ElementType; label: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3.5 text-left transition-all duration-200 group ${
        active
          ? 'bg-white/5 border-l-2 border-[#C0B49A] text-white'
          : 'border-l-2 border-transparent text-white/40 hover:text-white/70 hover:bg-white/3'
      }`}
    >
      <Icon size={15} strokeWidth={1.5} className={active ? 'text-[#C0B49A]' : ''} />
      <span
        className="text-[11px] tracking-[0.15em] uppercase"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {label}
      </span>
      {active && <ChevronRight size={12} strokeWidth={1.5} className="ml-auto text-[#C0B49A]" />}
    </button>
  );
}

// ─── Profile Tab ─────────────────────────────────────────────────────────────
function ProfileTab() {
  const { user } = useSession();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2
        className="text-white font-light mb-6"
        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.6rem' }}
      >
        Your Profile
      </h2>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8 pb-8 border-b border-white/8">
        <div className="w-16 h-16 rounded-full bg-[#C0B49A]/15 border border-[#C0B49A]/20 flex items-center justify-center shrink-0">
          <span
            className="text-[#C0B49A] font-light"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.6rem' }}
          >
            {(user?.name ?? 'U')[0].toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-white text-[14px]" style={{ fontFamily: 'Inter, sans-serif' }}>{user?.name}</p>
          <p className="text-white/30 text-[12px] mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{user?.email}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Full Name</p>
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 border border-white/15 bg-white/5 text-white px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#C0B49A]/50 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="p-2.5 bg-[#C0B49A]/15 text-[#C0B49A] hover:bg-[#C0B49A]/25 transition-colors disabled:opacity-50"
              >
                <Check size={14} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => { setEditing(false); setName(user?.name ?? ''); }}
                className="p-2.5 bg-white/5 text-white/40 hover:text-white transition-colors"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between group">
              <p className="text-white/70 text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>{user?.name}</p>
              <button
                onClick={() => setEditing(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-white p-1"
              >
                <Edit2 size={13} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>

        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Email</p>
          <p className="text-white/40 text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>{user?.email}</p>
          <p className="text-white/20 text-[11px] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Email cannot be changed.</p>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Member Since</p>
          <p className="text-white/40 text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {user?.createdAt ? formatDate(String(user.createdAt)) : '—'}
          </p>
        </div>
      </div>

      {saved && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-[#C0B49A] text-[12px] mt-4 flex items-center gap-1.5"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <Check size={12} strokeWidth={2} /> Profile updated.
        </motion.p>
      )}
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/account/orders')
      .then((r) => r.json())
      .then((d: { orders: Order[] }) => setOrders(d.orders ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2
        className="text-white font-light mb-6"
        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.6rem' }}
      >
        Order History
      </h2>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-white/3 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 border border-white/6">
          <ShoppingBag size={32} strokeWidth={1} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-[13px] mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>No orders yet.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#C0B49A] border border-[#C0B49A]/30 px-6 py-3 hover:bg-[#C0B49A]/10 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Shop Now <ArrowRight size={12} strokeWidth={1.5} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order.orderId} className="border border-white/8 overflow-hidden">
              {/* Order header */}
              <button
                onClick={() => setExpanded(expanded === order.orderId ? null : order.orderId)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors text-left"
              >
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>Order</p>
                    <p className="text-[#C0B49A] text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>{order.orderId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>Date</p>
                    <p className="text-white/60 text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>Total</p>
                    <p className="text-white/60 text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>{formatPrice(order.total)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] tracking-[0.15em] uppercase ${statusColor(order.status)}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                    {order.status}
                  </span>
                  <ChevronRight
                    size={14}
                    strokeWidth={1.5}
                    className={`text-white/20 transition-transform duration-200 ${expanded === order.orderId ? 'rotate-90' : ''}`}
                  />
                </div>
              </button>

              {/* Expanded detail */}
              <AnimatePresence>
                {expanded === order.orderId && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-white/6"
                  >
                    <div className="px-5 py-5 flex flex-col gap-4">
                      {/* Items */}
                      <div className="flex flex-col gap-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-10 h-12 bg-white/5 shrink-0 overflow-hidden">
                              {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white/70 text-[12px] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</p>
                              <p className="text-white/30 text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>Size: {item.size} · Qty: {item.quantity}</p>
                            </div>
                            <p className="text-white/50 text-[12px] shrink-0" style={{ fontFamily: 'Inter, sans-serif' }}>{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>

                      {/* Meta */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/6 text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <div>
                          <p className="text-white/25 uppercase tracking-[0.1em] mb-1">Shipping to</p>
                          <p className="text-white/50">{order.shipping.city}, {order.shipping.state}</p>
                        </div>
                        <div>
                          <p className="text-white/25 uppercase tracking-[0.1em] mb-1">Payment</p>
                          <p className="text-white/50 uppercase">{order.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-white/25 uppercase tracking-[0.1em] mb-1">Est. Delivery</p>
                          <p className="text-white/50">{order.estimatedDelivery}</p>
                        </div>
                        <div>
                          <p className="text-white/25 uppercase tracking-[0.1em] mb-1">Total</p>
                          <p className="text-[#C0B49A]">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Saved Items Tab ──────────────────────────────────────────────────────────
function SavedTab() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/account/saved-items')
      .then((r) => r.json())
      .then((d: { items: SavedItem[] }) => setItems(d.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id: number) => {
    await fetch(`/api/account/saved-items/${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div>
      <h2
        className="text-white font-light mb-6"
        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.6rem' }}
      >
        Saved Items
      </h2>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[3/4] bg-white/3 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 border border-white/6">
          <Heart size={32} strokeWidth={1} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-[13px] mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>Nothing saved yet.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#C0B49A] border border-[#C0B49A]/30 px-6 py-3 hover:bg-[#C0B49A]/10 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Browse Shop <ArrowRight size={12} strokeWidth={1.5} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((item) => (
            <div key={item.id} className="group relative border border-white/8 overflow-hidden">
              <div className="aspect-[3/4] bg-white/5 overflow-hidden">
                {item.productImage ? (
                  <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag size={24} strokeWidth={1} className="text-white/10" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-white/70 text-[11px] leading-snug truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{item.productName}</p>
                <p className="text-[#C0B49A] text-[12px] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{formatPrice(item.productPrice)}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  to={`/products/${item.productId}`}
                  className="w-7 h-7 bg-[#0D0D0D]/80 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <ArrowRight size={12} strokeWidth={1.5} />
                </Link>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="w-7 h-7 bg-[#0D0D0D]/80 flex items-center justify-center text-white/40 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={12} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Preferences Tab ──────────────────────────────────────────────────────────
function PreferencesTab() {
  const [prefs, setPrefs] = useState<Preferences>({
    notifyDrops: true,
    notifyOrders: true,
    notifyNewsletter: false,
    preferredSizes: '',
    preferredCategories: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/account/preferences')
      .then((r) => r.json())
      .then((d: Preferences) => setPrefs(d))
      .finally(() => setLoading(false));
  }, []);

  const toggleSize = (size: string) => {
    const current = prefs.preferredSizes ? prefs.preferredSizes.split(',').filter(Boolean) : [];
    const updated = current.includes(size) ? current.filter((s) => s !== size) : [...current, size];
    setPrefs((p) => ({ ...p, preferredSizes: updated.join(',') }));
  };

  const toggleCategory = (cat: string) => {
    const current = prefs.preferredCategories ? prefs.preferredCategories.split(',').filter(Boolean) : [];
    const updated = current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat];
    setPrefs((p) => ({ ...p, preferredCategories: updated.join(',') }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/account/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const selectedSizes = prefs.preferredSizes ? prefs.preferredSizes.split(',').filter(Boolean) : [];
  const selectedCats = prefs.preferredCategories ? prefs.preferredCategories.split(',').filter(Boolean) : [];

  if (loading) return <div className="h-40 bg-white/3 animate-pulse" />;

  return (
    <div>
      <h2
        className="text-white font-light mb-6"
        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.6rem' }}
      >
        Preferences
      </h2>

      <div className="flex flex-col gap-8">
        {/* Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bell size={14} strokeWidth={1.5} className="text-[#C0B49A]" />
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/40" style={{ fontFamily: 'Inter, sans-serif' }}>Notifications</p>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { key: 'notifyDrops' as const, label: 'New drop announcements', sub: 'Be first to know when a drop goes live' },
              { key: 'notifyOrders' as const, label: 'Order updates', sub: 'Shipping and delivery notifications' },
              { key: 'notifyNewsletter' as const, label: 'Newsletter', sub: 'Brand stories, behind-the-scenes, and more' },
            ].map(({ key, label, sub }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-white/5">
                <div>
                  <p className="text-white/70 text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</p>
                  <p className="text-white/25 text-[11px] mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{sub}</p>
                </div>
                <button
                  onClick={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
                  className={`w-10 h-5 rounded-full transition-all duration-300 relative shrink-0 ${prefs[key] ? 'bg-[#C0B49A]' : 'bg-white/10'}`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all duration-300 ${prefs[key] ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preferred Sizes */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Tag size={14} strokeWidth={1.5} className="text-[#C0B49A]" />
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/40" style={{ fontFamily: 'Inter, sans-serif' }}>Preferred Sizes</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 text-[11px] tracking-[0.1em] uppercase border transition-all duration-200 ${
                  selectedSizes.includes(size)
                    ? 'border-[#C0B49A] bg-[#C0B49A]/10 text-[#C0B49A]'
                    : 'border-white/10 text-white/30 hover:border-white/30 hover:text-white/60'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Categories */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Tag size={14} strokeWidth={1.5} className="text-[#C0B49A]" />
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/40" style={{ fontFamily: 'Inter, sans-serif' }}>Preferred Categories</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-2 text-[11px] tracking-[0.1em] uppercase border transition-all duration-200 ${
                  selectedCats.includes(cat)
                    ? 'border-[#C0B49A] bg-[#C0B49A]/10 text-[#C0B49A]'
                    : 'border-white/10 text-white/30 hover:border-white/30 hover:text-white/60'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3.5 bg-white text-[#0D0D0D] text-[11px] tracking-[0.2em] uppercase hover:bg-[#C0B49A] hover:text-white transition-all duration-300 disabled:opacity-50"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </motion.button>
          {saved && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#C0B49A] text-[12px] flex items-center gap-1.5"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Check size={12} strokeWidth={2} /> Saved.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Account Page ────────────────────────────────────────────────────────
export default function AccountPage() {
  const { user, isPending } = useSession();
  const [tab, setTab] = useState<Tab>('profile');

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (isPending) {
    return (
      <div className="bg-[#0D0D0D] min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border border-[#C0B49A]/30 border-t-[#C0B49A] rounded-full animate-spin" />
      </div>
    );
  }

  const TABS: { id: Tab; icon: React.ElementType; label: string }[] = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'orders', icon: Package, label: 'Orders' },
    { id: 'saved', icon: Heart, label: 'Saved Items' },
    { id: 'preferences', icon: Settings, label: 'Preferences' },
  ];

  return (
    <>
      <Helmet>
        <title>My Account — PRAMADE</title>
      </Helmet>

      <div className="bg-[#0D0D0D] min-h-screen pt-24 pb-20">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p
                className="text-[#C0B49A] text-[10px] tracking-[0.4em] uppercase mb-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                My Account
              </p>
              <h1
                className="text-white font-light leading-none"
                style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(32px, 4vw, 52px)' }}
              >
                {user?.name?.split(' ')[0] ?? 'Welcome'}.
              </h1>
            </div>
            <button
              onClick={handleSignOut}
              className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-white/30 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-4 py-2.5"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <LogOut size={13} strokeWidth={1.5} />
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
            {/* Sidebar */}
            <div className="md:sticky md:top-28 h-fit">
              <div className="border border-white/8 overflow-hidden">
                {TABS.map((t) => (
                  <TabBtn
                    key={t.id}
                    id={t.id}
                    active={tab === t.id}
                    icon={t.icon}
                    label={t.label}
                    onClick={() => setTab(t.id)}
                  />
                ))}
                <div className="border-t border-white/6">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-4 py-3.5 text-white/25 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={15} strokeWidth={1.5} />
                    <span
                      className="text-[11px] tracking-[0.15em] uppercase"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Sign Out
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="border border-white/8 p-6 lg:p-8 min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab === 'profile' && <ProfileTab />}
                  {tab === 'orders' && <OrdersTab />}
                  {tab === 'saved' && <SavedTab />}
                  {tab === 'preferences' && <PreferencesTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
