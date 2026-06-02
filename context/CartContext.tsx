import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;          // product id
  name: string;
  price: number;       // in paise (₹ × 100) — stored as integer
  priceDisplay: string;
  size: string;
  image: string;
  quantity: number;
  technique?: string;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;       // percent (0–100) or flat ₹ amount
  label: string;
}

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string; size: string } }
  | { type: 'UPDATE_QTY'; payload: { id: string; size: string; quantity: number } }
  | { type: 'APPLY_COUPON'; payload: Coupon }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; payload: CartState };

// ─── Reducer ──────────────────────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const key = `${action.payload.id}-${action.payload.size}`;
      const existing = state.items.find(
        (i) => `${i.id}-${i.size}` === key
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            `${i.id}-${i.size}` === key
              ? { ...i, quantity: Math.min(i.quantity + (action.payload.quantity ?? 1), 10) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity ?? 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.id === action.payload.id && i.size === action.payload.size)
        ),
      };
    case 'UPDATE_QTY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => !(i.id === action.payload.id && i.size === action.payload.size)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id && i.size === action.payload.size
            ? { ...i, quantity: Math.min(action.payload.quantity, 10) }
            : i
        ),
      };
    case 'APPLY_COUPON':
      return { ...state, coupon: action.payload };
    case 'REMOVE_COUPON':
      return { ...state, coupon: null };
    case 'CLEAR_CART':
      return { items: [], coupon: null };
    case 'HYDRATE':
      return action.payload;
    default:
      return state;
  }
}

// ─── Derived helpers ──────────────────────────────────────────────────────────
export function calcCartTotals(items: CartItem[], coupon: Coupon | null) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 200000 ? 0 : 9900; // free above ₹2,000 (in paise)
  let discount = 0;
  if (coupon) {
    discount =
      coupon.type === 'percent'
        ? Math.round((subtotal * coupon.value) / 100)
        : coupon.value * 100; // flat ₹ → paise
    discount = Math.min(discount, subtotal);
  }
  const total = subtotal - discount + shipping;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const fmt = (p: number) =>
    `₹${(p / 100).toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;

  return {
    subtotal,
    shipping,
    discount,
    total,
    itemCount,
    subtotalDisplay: fmt(subtotal),
    shippingDisplay: shipping === 0 ? 'Free' : fmt(shipping),
    discountDisplay: discount > 0 ? `-${fmt(discount)}` : null,
    totalDisplay: fmt(total),
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface CartContextValue {
  items: CartItem[];
  coupon: Coupon | null;
  totals: ReturnType<typeof calcCartTotals>;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string, size: string) => void;
  updateQty: (id: string, size: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'pramade_cart_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], coupon: null });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        dispatch({ type: 'HYDRATE', payload: parsed });
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state]);

  const addItem = useCallback(
    (item: Omit<CartItem, 'quantity'> & { quantity?: number }) =>
      dispatch({ type: 'ADD_ITEM', payload: item }),
    []
  );
  const removeItem = useCallback(
    (id: string, size: string) => dispatch({ type: 'REMOVE_ITEM', payload: { id, size } }),
    []
  );
  const updateQty = useCallback(
    (id: string, size: string, quantity: number) =>
      dispatch({ type: 'UPDATE_QTY', payload: { id, size, quantity } }),
    []
  );
  const applyCoupon = useCallback(
    (coupon: Coupon) => dispatch({ type: 'APPLY_COUPON', payload: coupon }),
    []
  );
  const removeCoupon = useCallback(() => dispatch({ type: 'REMOVE_COUPON' }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  const totals = calcCartTotals(state.items, state.coupon);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        coupon: state.coupon,
        totals,
        addItem,
        removeItem,
        updateQty,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
