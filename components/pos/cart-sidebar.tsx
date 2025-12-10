'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function CartSidebar() {
  const { items, removeFromCart, clearCart, getTotal } = useCartStore(); // Ensure clearCart is destructured
  const [isLoading, setIsLoading] = useState(false);

  const total = getTotal();
  const tax = total * 0.1;
  const finalTotal = total + tax;

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          totalAmount: finalTotal,
          paymentMethod: 'CASH', // Hardcoded for MVP, can be dynamic later
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Order ${data.orderId} completed!`, {
          description: 'Receipt has been printed.',
          duration: 4000,
        });
        clearCart(); // Wipe the cart clean
      } else {
        toast.error('Checkout failed. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Check connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[400px] bg-white dark:bg-slate-950 border-l shadow-2xl z-20 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-white dark:bg-slate-950">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-blue-600" />
          Current Order
        </h2>
        <p className="text-sm text-slate-500">{items.length} items in cart</p>
      </div>

      {/* Cart Items List */}
      <ScrollArea className="flex-1 bg-slate-50/50 dark:bg-slate-900/50 p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 mt-10">
            <ShoppingBag className="w-12 h-12 mb-2 opacity-20" />
            <p>Cart is empty</p>
            <p className="text-xs mt-1">Scan or click products to add</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-lg border shadow-sm"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">
                        x{item.quantity}
                      </span>
                      <span>@ {formatCurrency(item.price)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-sm">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>

      {/* Footer / Totals */}
      <div className="p-4 bg-white dark:bg-slate-950 border-t space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Tax (10%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-xl font-bold text-slate-800 dark:text-white">
            <span>Total</span>
            <span className="text-blue-600">{formatCurrency(finalTotal)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={items.length === 0 || isLoading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? 'Processing...' : `Charge ${formatCurrency(finalTotal)}`}
        </button>
      </div>
    </div>
  );
}
