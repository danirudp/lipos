import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { PrismaClient } from '@prisma/client';
import { User } from 'lucide-react';

const prisma = new PrismaClient();

async function getOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      customer: true,
      items: {
        include: { product: true },
      },
    },
  });

  return orders.map((order) => ({
    ...order,
    totalAmount: Number(order.totalAmount),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
      product: {
        ...item.product,
        price: Number(item.product.price),
      },
    })),
  }));
}

export default async function HistoryPage() {
  const orders = await getOrders();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Transaction History
        </h1>
        <p className="text-slate-500">
          View all completed sales and customer details.
        </p>
      </div>

      <div className="border rounded-lg bg-white dark:bg-slate-950 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-900/50">
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs text-slate-500">
                  {order.id.slice(-8)}...
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <User size={14} />
                    </div>
                    <div>
                      {order.customer ? (
                        <span className="font-medium text-slate-900 block">
                          {order.customer.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic block">
                          Walk-in Customer
                        </span>
                      )}
                      {order.customer?.email && (
                        <span className="text-[10px] text-slate-400 block">
                          {order.customer.email}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                  <span className="text-xs text-slate-400 block">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {order.items.map((item, i) => (
                      <span key={i} className="text-xs text-slate-600">
                        <span className="font-bold">{item.quantity}x</span>{' '}
                        {item.product.name}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="font-bold">
                  {formatCurrency(order.totalAmount)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 hover:bg-green-100"
                  >
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
