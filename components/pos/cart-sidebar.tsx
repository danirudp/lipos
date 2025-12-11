'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Define the prop type
interface CartSidebarProps {
  customers: any[];
  isMobile?: boolean; // New prop
}

export function CartSidebar({ customers, isMobile = false }: CartSidebarProps) {
  const {
    items,
    removeFromCart,
    clearCart,
    getTotal,
    customerId,
    setCustomer,
  } = useCartStore();
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
          paymentMethod: 'CASH',
          customerId: customerId, // Send the ID!
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Order ${data.orderId} completed!`, {
          description: 'Receipt has been printed.',
        });
        clearCart();
      } else {
        toast.error('Checkout failed.');
      }
    } catch (error) {
      toast.error('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            Current Order
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearCart()}
            className="h-6 px-2 text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
            disabled={items.length === 0}
          >
            Clear
          </Button>
        </div>

        {/* Customer Selector - Styled */}
        <div className="relative">
          <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <select
            className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            value={customerId || ''}
            onChange={(e) => setCustomer(e.target.value || null)}
          >
            <option value="">Guest Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1 bg-slate-50/30 p-4 dark:bg-slate-900/30">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
            <ShoppingBag className="mb-3 h-12 w-12 opacity-10" />
            <p className="text-sm font-medium">Cart is empty</p>
            <p className="text-xs">Select products to begin</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="relative flex items-start justify-between rounded-lg border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex flex-1 flex-col gap-1">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 line-clamp-1">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-blue-600">
                        {item.quantity}x
                      </span>
                      <span>@ {formatCurrency(item.price)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>

      {/* Footer / Calculation */}
      <div className="border-t border-slate-100 bg-white p-4 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] dark:border-slate-800 dark:bg-slate-950">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Subtotal</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Tax (10%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="my-2 border-t border-dashed border-slate-200 dark:border-slate-800" />
          <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white">
            <span>Total</span>
            <span className="text-blue-600">{formatCurrency(finalTotal)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={items.length === 0 || isLoading}
          className="w-full flex h-12 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Processing...
            </div>
          ) : (
            `Charge ${formatCurrency(finalTotal)}`
          )}
        </button>
      </div>
    </div>
  );
}
