'use client';

import { cn } from '@/lib/utils';
import { LayoutGroup, motion } from 'framer-motion';
import {
  History,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// --- CONFIGURATION ---
// Defined outside component to prevent re-creation on every render
const NAV_ITEMS = [
  {
    group: 'Operations',
    items: [
      { href: '/pos', label: 'Point of Sale', icon: ShoppingCart },
      { href: '/history', label: 'Transactions', icon: History },
    ],
  },
  {
    group: 'Management',
    items: [
      { href: '/products', label: 'Inventory', icon: Package },
      { href: '/customers', label: 'Customers', icon: Users },
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
];

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export function MainNav({ className, ...props }: MainNavProps) {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  return (
    <nav
      className={cn(
        'flex flex-col h-full bg-slate-50/50 backdrop-blur-xl border-r border-slate-200/60 dark:bg-slate-950/50 dark:border-slate-800/60 font-sans',
        className
      )}
      {...props}
    >
      {/* 1. BRAND HEADER */}
      <div className="h-20 flex items-center px-6 border-b border-transparent">
        <div className="group flex items-center gap-3.5 cursor-pointer">
          <div className="relative w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105 group-active:scale-95">
            <span className="font-bold text-lg tracking-tighter">L</span>
            {/* Subtle internal shine */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-slate-900 dark:text-white leading-none tracking-tight">
              LIPOS
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">
              v2.4.0
            </span>
          </div>
        </div>
      </div>

      {/* 2. SCROLLABLE NAVIGATION AREA */}
      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-8 scrollbar-hide">
        <LayoutGroup id="sidebar">
          {NAV_ITEMS.map((group, groupIndex) => (
            <div key={group.group}>
              {/* Group Label */}
              <h3 className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none">
                {group.group}
              </h3>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onMouseEnter={() => setHoveredPath(item.href)}
                      onMouseLeave={() => setHoveredPath(null)}
                      className={cn(
                        'relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      )}
                    >
                      {/* Active State Background (Solid + Shadow) */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] ring-1 ring-black/5 rounded-xl z-0 dark:bg-slate-800 dark:shadow-none dark:ring-white/10"
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}

                      {/* Hover State Background (Subtle) */}
                      {hoveredPath === item.href && !isActive && (
                        <motion.div
                          layoutId="hoverTab"
                          className="absolute inset-0 bg-slate-100 rounded-xl z-0 dark:bg-slate-800/50"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-3 w-full">
                        <item.icon
                          size={18}
                          strokeWidth={isActive ? 2.5 : 2}
                          className={cn(
                            'transition-transform duration-300',
                            isActive ? 'scale-110' : 'group-hover:scale-105'
                          )}
                        />
                        <span className="text-sm font-medium tracking-wide flex-1">
                          {item.label}
                        </span>

                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-blue-600 w-1.5 h-1.5 rounded-full"
                          />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </LayoutGroup>
      </div>

      {/* 3. USER FOOTER - Condensed & Functional */}
      <div className="p-3 mt-auto">
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 p-1 shadow-sm transition-all hover:shadow-md hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800">
          {/* User Row */}
          <div className="flex items-center gap-3 p-2">
            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="User"
                className="h-7 w-7"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate dark:text-white">
                James Anderson
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                Store Manager • ID:882
              </p>
            </div>

            <button className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-lg transition-colors dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <Settings size={16} />
            </button>
          </div>

          {/* Quick Actions (Expandable concept) */}
          <div className="grid grid-cols-2 gap-1 mt-1 border-t border-slate-100 pt-1 dark:border-slate-800">
            <button className="flex items-center justify-center gap-2 rounded-lg py-2 text-[10px] font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:hover:bg-slate-800 dark:hover:text-white">
              View Profile
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg py-2 text-[10px] font-bold text-red-500 hover:bg-red-50 transition-colors dark:hover:bg-red-900/20">
              <LogOut size={12} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
