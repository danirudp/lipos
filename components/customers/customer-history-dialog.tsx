'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/lib/utils';
import { Calendar, Package, Receipt } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CustomerHistoryDialogProps {
  customerId: string;
  customerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerHistoryDialog({
  customerId,
  customerName,
  open,
  onOpenChange,
}: CustomerHistoryDialogProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch when the dialog is actually OPEN and we have a valid ID
    if (open && customerId) {
      setLoading(true);

      // FIX: Add timestamp to URL to prevent browser caching
      // FIX: Add 'no-store' cache option
      fetch(`/api/customers/${customerId}/orders?t=${new Date().getTime()}`, {
        cache: 'no-store',
        headers: {
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch history');
          return res.json();
        })
        .then((data) => {
          // Sort orders by date (newest first) just in case API didn't
          const sorted = Array.isArray(data)
            ? data.sort(
                (a: any, b: any) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
            : [];
          setOrders(sorted);
        })
        .catch((err) => console.error('History fetch error:', err))
        .finally(() => setLoading(false));
    }
  }, [open, customerId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-600" />
            <span>Purchase History</span>
          </DialogTitle>
          <p className="text-sm text-slate-500">
            Recent transactions for{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {customerName}
            </span>
          </p>
        </DialogHeader>

        <ScrollArea className="h-[450px] pr-4 -mr-4">
          <div className="pr-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3 text-slate-400">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <p className="text-xs font-medium">Loading records...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/20">
                <Package size={32} strokeWidth={1.5} />
                <p className="text-sm">No purchase history found.</p>
              </div>
            ) : (
              <div className="space-y-3 relative">
                {/* Timeline Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-slate-100 dark:bg-slate-800 -z-10" />

                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="group relative flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50"
                  >
                    {/* Status Dot */}
                    <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-950" />

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <Calendar size={12} />
                            {new Date(order.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            order.status === 'COMPLETED'
                              ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                              : 'bg-slate-100 text-slate-600'
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>

                      {/* Items List */}
                      <div className="space-y-1.5 rounded-lg bg-slate-50 p-2.5 dark:bg-slate-950">
                        {order.items.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-xs"
                          >
                            <span className="text-slate-700 dark:text-slate-300">
                              <span className="font-bold tabular-nums text-slate-900 dark:text-white mr-1.5">
                                {item.quantity}x
                              </span>
                              {item.product.name}
                            </span>
                            <span className="tabular-nums text-slate-500">
                              {formatCurrency(Number(item.price))}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Total Paid
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(Number(order.totalAmount))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
