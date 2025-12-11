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
import { Calendar } from 'lucide-react';
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
    if (open) {
      setLoading(true);
      fetch(`/api/customers/${customerId}/orders`)
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [open, customerId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase History: {customerName}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="text-center py-10 text-slate-500">
              Loading history...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              No orders found.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-3 bg-slate-50 dark:bg-slate-900"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar size={14} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {order.status}
                    </Badge>
                  </div>

                  <div className="space-y-1 mb-3">
                    {order.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="text-sm flex justify-between"
                      >
                        <span>
                          <span className="font-bold">{item.quantity}x</span>{' '}
                          {item.product.name}
                        </span>
                        <span className="text-slate-500">
                          {formatCurrency(Number(item.price))}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t font-bold">
                    <span className="text-sm">Total</span>
                    <span className="text-blue-600">
                      {formatCurrency(Number(order.totalAmount))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
