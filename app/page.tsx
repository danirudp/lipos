'use client';

import { clsx, type ClassValue } from 'clsx';
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Box,
  Check,
  CreditCard,
  Globe,
  Menu,
  Smartphone,
  X,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Animation Variants (Fluid Easing) ---
const fluidEase = [0.22, 1, 0.36, 1];

const fadeInUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: fluidEase },
  },
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// --- UI Components ---

const Button = ({
  children,
  className,
  variant = 'primary',
  ...props
}: any) => {
  const baseStyle =
    'inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-bold tracking-wide transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20';

  const variants: any = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1',
    secondary:
      'bg-white text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1',
    outline:
      'border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyle, variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// --- Custom POS Interface Mockup (CSS Art) ---
// This draws a mini version of the LIPOS app using only divs and Tailwind
const POSMockup = () => (
  <div className="relative mx-auto w-full max-w-[1000px] rounded-[2rem] bg-slate-900/5 p-3 ring-1 ring-inset ring-slate-900/10 lg:rounded-[2.5rem] lg:p-4 backdrop-blur-sm">
    <div className="relative rounded-[1.5rem] bg-slate-50 shadow-2xl overflow-hidden border border-slate-200 flex h-[400px] sm:h-[500px]">
      {/* Sidebar Navigation */}
      <div className="hidden sm:flex w-16 flex-col items-center py-6 gap-6 border-r border-slate-200 bg-white">
        <div className="h-10 w-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30"></div>
        <div className="mt-4 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-6 w-6 rounded-lg ${
                i === 1 ? 'bg-blue-100' : 'bg-slate-100'
              }`}
            ></div>
          ))}
        </div>
        <div className="mt-auto h-8 w-8 rounded-full bg-slate-200"></div>
      </div>

      {/* Main Product Grid */}
      <div className="flex-1 p-6 bg-slate-50/50 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div className="h-10 w-48 rounded-xl bg-white border border-slate-200 shadow-sm"></div>
          <div className="h-10 w-10 rounded-full bg-white border border-slate-200 shadow-sm"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="aspect-[3/4] rounded-2xl bg-white border border-slate-100 shadow-sm p-3 flex flex-col"
            >
              <div className="flex-1 rounded-xl bg-slate-100 mb-3"></div>
              <div className="h-3 w-2/3 rounded bg-slate-200 mb-2"></div>
              <div className="h-3 w-1/3 rounded bg-blue-100"></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="hidden lg:flex w-80 flex-col border-l border-slate-200 bg-white">
        <div className="p-6 border-b border-slate-100">
          <div className="h-6 w-24 rounded bg-slate-900"></div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 2 + i * 0.2 }}
              className="h-16 rounded-xl border border-slate-100 bg-slate-50 flex items-center p-2 gap-3"
            >
              <div className="h-12 w-12 rounded-lg bg-slate-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-2 w-20 rounded bg-slate-200"></div>
                <div className="h-2 w-10 rounded bg-slate-200"></div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex justify-between mb-4">
            <div className="h-4 w-16 rounded bg-slate-300"></div>
            <div className="h-4 w-16 rounded bg-slate-900"></div>
          </div>
          <div className="h-12 w-full rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20"></div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-8 right-8 lg:right-96 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-10"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <Check size={20} strokeWidth={3} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">
              Payment
            </div>
            <div className="text-sm font-bold text-slate-900">
              $124.50 Received
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }: any) => (
  <motion.div
    variants={fadeInUp}
    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 hover:border-blue-100"
  >
    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
      <Icon size={28} strokeWidth={1.5} />
    </div>
    <h3 className="mb-3 text-xl font-bold text-slate-900 tracking-tight">
      {title}
    </h3>
    <p className="text-slate-500 leading-relaxed">{description}</p>
  </motion.div>
);

// --- Main Page Component ---

export default function Page() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 20);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 overflow-x-hidden">
      {/* Navigation */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: fluidEase }}
      >
        <motion.nav
          layout
          className={cn(
            'pointer-events-auto flex items-center justify-between rounded-full border border-slate-200/60 shadow-xl shadow-slate-900/5 bg-white/80 backdrop-blur-2xl',
            isScrolled
              ? 'w-[90%] md:w-[800px] py-3 px-5'
              : 'w-full max-w-6xl py-4 px-8'
          )}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              LIPOS.
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {['Features', 'Inventory', 'Analytics', 'Pricing'].map((item) => (
              <Link
                key={item}
                href="#"
                className="relative px-5 py-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Log in
            </Link>
            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800"
            >
              Get Started
            </motion.a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.nav>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 bg-white/98 backdrop-blur-3xl pt-32 px-6"
          >
            <div className="flex flex-col gap-6">
              {['Features', 'Inventory', 'Analytics', 'Pricing'].map(
                (item, idx) => (
                  <motion.a
                    key={item}
                    href="#"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.1 }}
                    className="text-4xl font-bold text-slate-900 tracking-tight"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </motion.a>
                )
              )}
              <div className="h-px w-full bg-slate-100 my-4" />
              <div className="grid gap-4">
                <Button
                  variant="outline"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full justify-center"
                >
                  Log In
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full justify-center"
                >
                  Get Started Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-44 pb-20 lg:pt-60 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            style={{ y: y1 }}
            className="absolute left-[-10%] top-[-10%] h-[800px] w-[800px] rounded-full bg-blue-100/50 blur-[120px]"
          />
          <motion.div
            style={{ y: y2 }}
            className="absolute right-[-10%] top-[20%] h-[600px] w-[600px] rounded-full bg-purple-100/50 blur-[120px]"
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-1.5 text-sm font-bold text-slate-600 shadow-sm mb-8 hover:border-blue-200 transition-colors cursor-default"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              LIPOS v2.4 is now available
              <ArrowRight size={14} className="ml-1 text-slate-400" />
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="max-w-4xl text-6xl lg:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.95]"
            >
              The Operating System for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Modern Retail.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="max-w-2xl text-xl text-slate-600 mb-10 leading-relaxed font-medium"
            >
              Manage inventory, process sales, and track customers with the
              speed of a startup and the reliability of an enterprise.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto h-14 px-10 text-base group">
                Start Selling Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="secondary"
                className="w-full sm:w-auto h-14 px-10 text-base"
              >
                Book a Demo
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-8 flex items-center gap-6 text-sm font-semibold text-slate-500"
            >
              <span className="flex items-center gap-2">
                <Check size={16} className="text-blue-500" /> No credit card
                required
              </span>
              <span className="flex items-center gap-2">
                <Check size={16} className="text-blue-500" /> Setup in 2 minutes
              </span>
            </motion.div>
          </motion.div>

          {/* Visual Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="mt-20 relative perspective-1000"
          >
            <div className="absolute inset-0 bg-blue-600 blur-[100px] opacity-20 rounded-full z-0 transform translate-y-20"></div>
            <POSMockup />
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 border-y border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs font-bold text-slate-400 mb-10 uppercase tracking-widest">
            Powering 10,000+ Stores Worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-2xl font-black text-slate-800"
              >
                <div className="h-8 w-8 rounded-lg bg-slate-800"></div>
                <span>BRAND{i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 bg-white relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-6">
              Everything you need to <br /> run your store.
            </h2>
            <p className="text-lg text-slate-600">
              Stop juggling multiple spreadsheets and disconnected tools. LIPOS
              brings your entire retail operation into one beautiful interface.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <FeatureCard
              icon={Zap}
              title="Lightning Fast Checkout"
              description="Built for speed. Process transactions in milliseconds and keep your lines moving during peak hours."
            />
            <FeatureCard
              icon={Box}
              title="Smart Inventory"
              description="Real-time tracking warns you when stock is low. Manage variants, categories, and suppliers effortlessly."
            />
            <FeatureCard
              icon={BarChart3}
              title="Deep Analytics"
              description="Understand what sells. View profit margins, top customers, and sales trends with beautiful charts."
            />
            <FeatureCard
              icon={Smartphone}
              title="Mobile First"
              description="Run your entire store from a tablet or phone. The responsive design adapts to any device perfectly."
            />
            <FeatureCard
              icon={CreditCard}
              title="Integrated Payments"
              description="Accept cards, cash, and digital wallets. Seamless integration with major payment providers."
            />
            <FeatureCard
              icon={Globe}
              title="Offline Mode"
              description="Internet down? No problem. Keep selling and sync your data automatically when you're back online."
            />
          </motion.div>
        </div>
      </section>

      {/* Large CTA */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-[600px] w-[600px] bg-blue-600/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-[600px] w-[600px] bg-purple-600/30 rounded-full blur-[120px]"></div>

        <div className="mx-auto max-w-4xl px-6 relative z-10 text-center">
          <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-8">
            Ready to upgrade your shop?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of retailers who have switched to LIPOS for a faster,
            smarter, and more reliable point of sale.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="h-16 px-12 text-lg bg-white text-slate-900 hover:bg-slate-100 shadow-none">
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-16 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Zap size={20} fill="currentColor" />
              </div>
              <span className="text-xl font-bold text-slate-900">LIPOS.</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              The operating system for modern retail. Designed and built with ❤️
              by Daniru Perera.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Hardware
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <p>© 2025 LIPOS Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-600">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-600">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
