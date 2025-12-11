'use client';

import { cn } from '@/lib/utils';
import {
  History,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/pos', label: 'Point of Sale', icon: ShoppingCart },
  { href: '/history', label: 'Transactions', icon: History },
  { href: '/products', label: 'Inventory', icon: Package }, // Future
  { href: '/customers', label: 'Customers', icon: Users }, // Future
  { href: '/settings', label: 'Settings', icon: Settings }, // Future
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="w-20 lg:w-64 bg-slate-900 h-screen flex flex-col justify-between text-white transition-all duration-300">
      {/* Logo Area */}
      <div className="p-6">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            L
          </div>
          <span className="hidden lg:block">LIPOS</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors',
                isActive &&
                  'bg-blue-600 text-white shadow-md shadow-blue-900/20'
              )}
            >
              <item.icon size={20} />
              <span className="hidden lg:block font-medium text-sm">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* User / Logout Area */}
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-red-400 hover:bg-slate-800 transition-colors">
          <LogOut size={20} />
          <span className="hidden lg:block font-medium text-sm">Logout</span>
        </button>
      </div>
    </nav>
  );
}
