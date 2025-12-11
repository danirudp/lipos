'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  History,
  LogOut,
  Package,
  ShoppingCart,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export function MainNav({ className, ...props }: MainNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/pos', label: 'Point of Sale', icon: ShoppingCart },
    { href: '/history', label: 'Transactions', icon: History },
    { href: '/products', label: 'Inventory', icon: Package },
    { href: '/customers', label: 'Customers', icon: Users },
    // { href: "/settings", label: "Settings", icon: Settings }, // Future use
  ];

  return (
    <nav
      className={cn(
        'flex flex-col h-full bg-slate-50/50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 font-sans',
        className
      )}
      {...props}
    >
      {/* 1. LOGO AREA - Clean & Bold */}
      <div className="h-20 flex items-center px-6">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/25">
            <span className="text-sm">L</span>
          </div>
          <span className="text-slate-900 dark:text-white">LIPOS</span>
        </div>
      </div>

      {/* 2. NAVIGATION LINKS - With Animated Pill & Shadows */}
      <div className="flex-1 px-4 space-y-2 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-blue-500',
                isActive
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-500 font-medium hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
              )}
            >
              {/* Active Background Pill (Animated with Shadow) */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-blue-50 shadow-sm shadow-blue-500/10 dark:bg-blue-900/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Icon & Label */}
              <item.icon
                size={20}
                className={cn(
                  'relative z-10 transition-colors duration-300',
                  isActive
                    ? 'text-blue-600 drop-shadow-sm'
                    : 'text-slate-400 group-hover:text-slate-600'
                )}
              />
              <span className="relative z-10 text-sm tracking-wide">
                {item.label}
              </span>

              {/* Subtle Arrow on Active */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative z-10 ml-auto"
                >
                  <ChevronRight size={14} className="text-blue-400" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>

      {/* 3. USER PROFILE FOOTER - Premium Card Style */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950">
        <div className="flex items-center gap-3 rounded-xl bg-white border border-slate-200 shadow-sm p-3 transition-all hover:shadow-md dark:bg-slate-900 dark:border-slate-800">
          {/* Avatar Placeholder */}
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-700 font-bold text-xs border border-blue-100 shadow-inner">
            JD
          </div>

          <div className="flex-1 overflow-hidden">
            <h4 className="text-sm font-bold text-slate-800 truncate dark:text-white leading-tight">
              John Doe
            </h4>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold truncate">
              Store Manager
            </p>
          </div>

          <button className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-1.5 transition-all">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
