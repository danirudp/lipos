'use client';

import { cn } from '@/lib/utils';
import { History, LogOut, Package, ShoppingCart, Users } from 'lucide-react';
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
  ];

  return (
    <nav
      className={cn(
        'flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800',
        className
      )}
      {...props}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            L
          </div>
          <span className="text-slate-900 dark:text-white">LIPOS</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 space-y-1 mt-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
              )}
              <item.icon
                size={20}
                className={cn(
                  isActive
                    ? 'text-blue-600'
                    : 'text-slate-400 group-hover:text-slate-600'
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User / Logout Area */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut size={20} />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </nav>
  );
}
