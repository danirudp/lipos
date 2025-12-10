'use client';

import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store'; // Import the store
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
}

interface ProductCardProps {
  product: Product;
  // REMOVED onAddToCart prop! We don't need it anymore.
}

export function ProductCard({ product }: ProductCardProps) {
  // Hook into the global store
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="group relative bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md h-[240px] flex flex-col"
      onClick={() => addToCart(product)} // Call the store directly!
    >
      {/* Image Area */}
      <div className="relative h-32 w-full bg-slate-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-xs">
            No Image
          </div>
        )}

        <div className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity">
          <Plus size={16} className="text-blue-600" />
        </div>
      </div>

      {/* Info Area */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {product.category}
          </span>
          <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-200 mt-1 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </div>

        <div className="font-bold text-lg text-slate-900 dark:text-white">
          {formatCurrency(product.price)}
        </div>
      </div>
    </motion.div>
  );
}
