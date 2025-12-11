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
import { Calendar, Package, User } from 'lucide-react';

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
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950 w-full max-w-[100vw] overflow-hidden">
      {/* HEADER */}
      <div className="flex-none flex h-16 items-center border-b border-slate-200 bg-white px-4 md:px-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            Transactions
          </h1>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
            {orders.length} Records
          </p>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
        {/* MOBILE VIEW: Cards (Full Width) */}
        <div className="block md:hidden space-y-3 pb-20">
          {orders.map((order) => (
            <div
              key={order.id}
              className="w-full flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              {/* Card Top: Customer & Status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20">
                    <User size={16} />
                  </div>
                  <div className="min-w-0">
                    {' '}
                    {/* min-w-0 prevents text overflow */}
                    <p className="text-sm font-bold text-slate-900 truncate dark:text-white">
                      {order.customer?.name || 'Walk-in Customer'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      ID: {order.id.slice(-6)}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="flex-shrink-0 bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                >
                  {order.status}
                </Badge>
              </div>

              {/* Card Middle: Items Summary */}
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2.5 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                <Package size={14} className="text-slate-400 flex-shrink-0" />
                <span className="text-xs text-slate-600 truncate flex-1 dark:text-slate-300">
                  {order.items
                    .map((i) => `${i.quantity}x ${i.product.name}`)
                    .join(', ')}
                </span>
              </div>

              {/* Card Bottom: Date & Total */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar size={14} />
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {formatCurrency(order.totalAmount)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW: Table */}
        <div className="hidden md:block rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-950">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 dark:bg-slate-900/50">
                <TableHead className="w-[120px]">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <TableCell className="font-mono text-xs font-medium text-slate-500">
                    #{order.id.slice(-6)}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">
                        <User size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {order.customer?.name || 'Walk-in Customer'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {order.customer?.email || 'No email'}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="max-w-[250px]">
                      <div className="flex flex-wrap gap-1">
                        {order.items.slice(0, 2).map((item, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          >
                            {item.quantity}x {item.product.name}
                          </span>
                        ))}
                        {order.items.length > 2 && (
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800">
                            +{order.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
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
    </div>
  );
}
