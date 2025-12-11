'use client';

import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
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

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const isOutOfStock = product.stock <= 0;

  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => !isOutOfStock && addToCart(product)}
      disabled={isOutOfStock}
      className={`group text-left w-full h-full flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 ${
        isOutOfStock ? 'opacity-50 grayscale cursor-not-allowed' : ''
      }`}
    >
      {/* Image Container - Aspect Ratio 4:3 */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-slate-100 dark:bg-slate-800">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            No Image
          </div>
        )}

        {/* Floating Add Button (Visible on Hover) */}
        {!isOutOfStock && (
          <div className="absolute bottom-3 right-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
              <Plus size={16} strokeWidth={3} />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        <div className="mb-1 flex items-start justify-between gap-2">
          <span className="inline-block rounded-[4px] bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {product.category}
          </span>
          {isOutOfStock && (
            <span className="text-[10px] font-bold text-red-500">
              Out of Stock
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-slate-700 dark:text-slate-200">
          {product.name}
        </h3>

        <div className="mt-auto pt-3">
          <span className="block text-lg font-bold text-slate-900 dark:text-white">
            {formatCurrency(product.price)}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
