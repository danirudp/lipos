'use client';

import { cn, formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import { motion } from 'framer-motion';
import { AlertCircle, PackageX, Plus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  stock: number;
}

const LOW_STOCK_THRESHOLD = 5;

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= LOW_STOCK_THRESHOLD;

  const getStockStatus = () => {
    if (isOutOfStock)
      return {
        label: 'Sold Out',
        className: 'bg-slate-900 text-white',
        icon: PackageX,
      };
    if (isLowStock)
      return {
        label: `${product.stock} Left`,
        className: 'bg-amber-500 text-white',
        icon: AlertCircle,
      };
    return null;
  };

  const status = getStockStatus();

  return (
    <motion.button
      layout
      whileHover={!isOutOfStock ? { y: -4, transition: { duration: 0.2 } } : {}}
      whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
      onClick={() => !isOutOfStock && addToCart(product)}
      disabled={isOutOfStock}
      className={cn(
        'group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border bg-white text-left transition-all duration-300 dark:bg-slate-900',
        isOutOfStock
          ? 'border-slate-100 opacity-70 cursor-not-allowed dark:border-slate-800'
          : 'border-slate-200/60 shadow-sm hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 dark:border-slate-800 dark:hover:border-blue-900'
      )}
    >
      {/* 1. IMAGE AREA */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 dark:bg-slate-900/50">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={cn(
              'object-cover transition-all duration-500 will-change-transform',
              !isOutOfStock && 'group-hover:scale-105',
              isOutOfStock && 'grayscale opacity-50'
            )}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-300">
            <ShoppingCart size={32} strokeWidth={1.5} />
          </div>
        )}

        {/* Stripes for Out of Stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#00000005_10px,#00000005_20px)]" />
        )}

        {/* Status Badge */}
        {status && (
          <div
            className={cn(
              'absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm backdrop-blur-md',
              status.className
            )}
          >
            <status.icon size={12} />
            <span>{status.label}</span>
          </div>
        )}

        {/* FAB Style Add Button (Desktop) */}
        {!isOutOfStock && (
          <div className="absolute bottom-3 right-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Plus size={20} />
            </div>
          </div>
        )}
      </div>

      {/* 2. CONTENT AREA */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            {product.category}
          </span>
          {!isOutOfStock && (
            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
          )}
        </div>

        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-slate-700 transition-colors group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400">
          {product.name}
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-dashed border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Price
          </span>
          <span
            className={cn(
              'text-lg font-bold tracking-tight tabular-nums',
              isOutOfStock
                ? 'text-slate-400 decoration-slate-300 line-through'
                : 'text-slate-900 dark:text-white'
            )}
          >
            {formatCurrency(product.price)}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
