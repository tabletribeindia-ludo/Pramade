import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useSession } from '@/lib/auth/auth-client';

export default function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totals } = useCart();
  const { isAuthenticated, user } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/shop', label: 'Shop' },
    { href: '/collections', label: 'Collections' },
    { href: '/drops', label: 'Drops' },
    { href: '/about', label: 'About' },
    { href: '/community', label: 'Community' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0D0D0D] border-b border-white/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/airo-assets/images/logo/horizontal"
              alt="PRAMADE"
              className="h-8 w-auto object-contain shrink-0 brightness-0 invert"
            />
          </Link>

          {/* Desktop Nav — center */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`relative text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-200 group ${
                  location.pathname === item.href
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {item.label}
                <span className="absolute -bottom-0.5 left-0 h-px bg-white w-0 group-hover:w-full transition-all duration-300 ease-out" />
              </Link>
            ))}
          </nav>

          {/* Icons — right */}
          <div className="flex items-center gap-5">
            <button
              aria-label="Search"
              className="text-white/70 hover:text-white transition-colors duration-200 hidden md:block"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            {/* Account icon */}
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              aria-label={isAuthenticated ? `Account (${user?.name})` : 'Sign In'}
              className="relative text-white/70 hover:text-white transition-colors duration-200 hidden md:block"
            >
              <User size={18} strokeWidth={1.5} />
              {isAuthenticated && (
                <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-[#C0B49A]" />
              )}
            </Link>
            <Link
              to="/cart"
              aria-label={`Cart (${totals.itemCount} items)`}
              className="relative text-white/70 hover:text-white transition-colors duration-200"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {totals.itemCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 w-4 h-4 bg-[#C0B49A] text-white text-[9px] rounded-full flex items-center justify-center leading-none"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {totals.itemCount > 9 ? '9+' : totals.itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white/70 hover:text-white transition-colors duration-200 p-1"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0D0D0D] border-t border-white/10">
          <nav className="flex flex-col px-6 py-6 gap-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors duration-200"
                style={{ fontFamily: 'Inter, sans-serif' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-5 pt-2 border-t border-white/10">
              <button aria-label="Search" className="text-white/70 hover:text-white transition-colors">
                <Search size={18} strokeWidth={1.5} />
              </button>
              <button aria-label="Wishlist" className="text-white/70 hover:text-white transition-colors">
                <Heart size={18} strokeWidth={1.5} />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
