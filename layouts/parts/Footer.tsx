import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const shopLinks = [
    { href: '/shop', label: 'New Arrivals' },
    { href: '/collections/puff-print', label: 'Puff Print' },
    { href: '/collections/embroidered', label: 'Embroidered' },
    { href: '/collections/limited-drops', label: 'Limited Drops' },
    { href: '/collections/oversized', label: 'Oversized' },
    { href: '/collections/graphic-tees', label: 'Graphic Tees' },
  ];

  const helpLinks = [
    { href: '/shipping', label: 'Shipping Policy' },
    { href: '/returns', label: 'Return Policy' },
    { href: '/size-guide', label: 'Size Guide' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/faq', label: 'FAQ' },
  ];

  const legalLinks = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ];

  return (
    <footer className="bg-[#0D0D0D] text-white/70">
      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <img
              src="/airo-assets/images/logo/horizontal"
              alt="PRAMADE"
              className="h-7 w-auto object-contain shrink-0 brightness-0 invert mb-6"
            />
            <p
              className="text-[13px] leading-relaxed text-white/50 mb-8 max-w-[240px]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Premium streetwear crafted for the few. Limited drops. Uncompromising quality.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/pramade.official"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/40 hover:text-white transition-colors duration-200"
              >
                <Instagram size={16} strokeWidth={1.5} />
              </a>
              <a
                href="https://facebook.com/pramade"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white/40 hover:text-white transition-colors duration-200"
              >
                <Facebook size={16} strokeWidth={1.5} />
              </a>
              <a
                href="https://youtube.com/@pramade"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-white/40 hover:text-white transition-colors duration-200"
              >
                <Youtube size={16} strokeWidth={1.5} />
              </a>
              <a
                href="https://pinterest.com/pramade"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="text-white/40 hover:text-white transition-colors duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.267.64 1.267 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.476 1.806 1.772 0 3.137-1.868 3.137-4.561 0-2.386-1.715-4.054-4.163-4.054-2.836 0-4.5 2.127-4.5 4.326 0 .856.33 1.775.741 2.276a.3.3 0 0 1 .069.286c-.076.313-.244.995-.277 1.134-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
              </a>
              {/* Threads icon (custom SVG) */}
              <a
                href="https://threads.net/@pramade.official"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Threads"
                className="text-white/40 hover:text-white transition-colors duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 7.5c-1.333-3-4-4.5-7-4.5C7.5 3 4 6.5 4 12s3.5 9 8 9c4 0 7-2.5 7-6 0-3-2-5-5-5-2 0-4 1.5-4 4s1.5 3.5 3 3.5c1 0 2-.5 2.5-1.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4
              className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-6"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Shop
            </h4>
            <ul className="flex flex-col gap-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[13px] text-white/50 hover:text-white transition-colors duration-200"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4
              className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-6"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Help
            </h4>
            <ul className="flex flex-col gap-3">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[13px] text-white/50 hover:text-white transition-colors duration-200"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4
              className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-6"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Stay in the Loop
            </h4>
            <p
              className="text-[13px] text-white/50 mb-5 leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Early access to drops. No spam. Ever.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); setEmail(''); }}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="bg-transparent border border-white/20 text-white placeholder-white/30 text-[12px] px-4 py-3 focus:outline-none focus:border-white/50 transition-colors duration-200"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <button
                type="submit"
                className="bg-white text-[#0D0D0D] text-[11px] tracking-[0.2em] uppercase font-medium py-3 px-6 hover:bg-white/90 transition-colors duration-200"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            className="text-[11px] text-white/30"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            © {currentYear} PRAMADE. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-[11px] text-white/30 hover:text-white/60 transition-colors duration-200"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
