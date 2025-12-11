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

interface ProductCardProps {
  product: Product;
}

const LOW_STOCK_THRESHOLD = 5;

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= LOW_STOCK_THRESHOLD;

  // Determine Badge Status
  const getStockStatus = () => {
    if (isOutOfStock)
      return { label: 'Sold Out', color: 'bg-red-500', icon: PackageX };
    if (isLowStock)
      return {
        label: `${product.stock} left`,
        color: 'bg-amber-500',
        icon: AlertCircle,
      };
    return null;
  };

  const status = getStockStatus();

  return (
    <motion.button
      whileHover={
        !isOutOfStock
          ? {
              y: -4,
              boxShadow:
                '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            }
          : {}
      }
      whileTap={!isOutOfStock ? { scale: 0.96 } : {}}
      onClick={() => !isOutOfStock && addToCart(product)}
      disabled={isOutOfStock}
      className={cn(
        'group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-white text-left transition-all duration-300 dark:bg-slate-900',
        isOutOfStock
          ? 'border-slate-200 opacity-60 dark:border-slate-800 cursor-not-allowed bg-slate-50 dark:bg-slate-950'
          : 'border-slate-200/60 shadow-sm hover:border-indigo-300/50 dark:border-slate-800 dark:hover:border-indigo-700/50'
      )}
    >
      {/* 1. IMAGE AREA */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={cn(
              'object-cover transition-transform duration-700 ease-out will-change-transform',
              !isOutOfStock && 'group-hover:scale-110',
              isOutOfStock && 'grayscale filter'
            )}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-300">
            <ShoppingCart size={32} strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-widest">
              No Image
            </span>
          </div>
        )}

        {/* Overlay Gradient for Text Contrast (if needed) & Texture for Out of Stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20" />
        )}

        {/* Status Badge (Absolute Top Left) */}
        {status && (
          <div
            className={cn(
              'absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md backdrop-blur-md',
              status.color
            )}
          >
            <status.icon size={12} />
            <span>{status.label}</span>
          </div>
        )}

        {/* Floating Add Button (Action Anchor) */}
        {!isOutOfStock && (
          <div className="absolute bottom-3 right-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:opacity-0 md:translate-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-indigo-600/30 transition-transform hover:scale-110 active:scale-95">
              <Plus size={20} strokeWidth={3} />
            </div>
          </div>
        )}
      </div>

      {/* 2. CONTENT AREA */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category Tag */}
        <div className="mb-2">
          <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            {product.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-tight text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        {/* Price & Action Area */}
        <div className="mt-4 flex items-center justify-between pt-2 border-t border-dashed border-slate-100 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-slate-400">
              Price
            </span>
            <span
              className={cn(
                'text-lg font-black tracking-tight tabular-nums',
                isOutOfStock
                  ? 'text-slate-400 line-through decoration-slate-400/50'
                  : 'text-slate-900 dark:text-white'
              )}
            >
              {formatCurrency(product.price)}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
