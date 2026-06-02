import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { signIn } from '@/lib/auth/auth-client';

const inputClass =
  'w-full border border-white/10 bg-white/5 text-white placeholder-white/20 px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#C0B49A]/60 transition-colors';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn.email({ email, password });
      if (result.error) {
        setError(result.error.message ?? 'Invalid email or password.');
      } else {
        navigate(from, { replace: true });
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In — PRAMADE</title>
      </Helmet>

      <div className="bg-[#0D0D0D] min-h-screen flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px]"
        >
          {/* Logo */}
          <Link to="/" className="flex justify-center mb-10">
            <img
              src="/airo-assets/images/logo/horizontal"
              alt="PRAMADE"
              className="h-7 w-auto object-contain brightness-0 invert"
            />
          </Link>

          <div className="border border-white/8 p-8">
            <h1
              className="text-white font-light mb-1"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '2rem' }}
            >
              Welcome back.
            </h1>
            <p
              className="text-white/30 text-[12px] mb-8"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Sign in to your PRAMADE account.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  autoComplete="email"
                  className={inputClass}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                  className={`${inputClass} pr-12`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-red-400 text-[12px] bg-red-400/8 border border-red-400/20 px-3 py-2.5"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <AlertCircle size={13} strokeWidth={1.5} className="shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-white text-[#0D0D0D] text-[11px] tracking-[0.2em] uppercase hover:bg-[#C0B49A] hover:text-white transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {loading ? 'Signing in...' : (
                  <>Sign In <ArrowRight size={13} strokeWidth={1.5} /></>
                )}
              </motion.button>
            </form>

            <p
              className="text-center text-white/30 text-[12px] mt-6"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#C0B49A] hover:text-white transition-colors">
                Create one
              </Link>
            </p>
          </div>

          <p
            className="text-center text-white/15 text-[11px] mt-6"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <Link to="/" className="hover:text-white/40 transition-colors">← Back to PRAMADE</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
