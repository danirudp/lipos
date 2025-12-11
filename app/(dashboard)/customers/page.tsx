import { AddCustomerDialog } from '@/components/customers/add-customer-dialog';
import { CustomerActions } from '@/components/customers/customer-actions';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PrismaClient } from '@prisma/client';
import { Calendar, Mail, Phone, ShoppingBag, User } from 'lucide-react';

const prisma = new PrismaClient();

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orders: true } } },
  });

  return (
    // MASTER CONTAINER: Strict overflow control
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950 w-full max-w-full overflow-hidden">
      {/* HEADER */}
      <div className="flex-none flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Customers
          </h1>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {customers.length} Active Profiles
          </p>
        </div>
        <AddCustomerDialog />
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar w-full">
        {/* MOBILE VIEW: Cards (Strictly contained) */}
        <div className="block md:hidden space-y-3 pb-20 w-full">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="w-full flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              {/* Top Row: Avatar, Name, Actions */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm dark:bg-blue-900/30">
                  {customer.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-slate-900 truncate pr-2 dark:text-white">
                      {customer.name}
                    </h3>
                    <div className="-mr-2 -mt-1">
                      <CustomerActions customer={customer} />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 truncate">
                    <Mail size={12} />
                    <span className="truncate">
                      {customer.email || 'No email'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Stats & Contact */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <ShoppingBag size={10} className="mr-1" />
                    {customer._count.orders} Orders
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Phone size={12} />
                  <span>{customer.phone || 'No phone'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW: High Density Table */}
        <div className="hidden md:block rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-950">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 dark:bg-slate-900/50">
                <TableHead>Customer Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Order History</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-xs border border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/50">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">
                        {customer.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      {customer.email && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                          <Mail size={12} className="text-slate-400" />
                          {customer.email}
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Phone size={12} className="text-slate-400" />
                          {customer.phone}
                        </div>
                      )}
                      {!customer.email && !customer.phone && (
                        <span className="text-xs text-slate-400 italic">
                          No contact info
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="font-medium text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
                    >
                      <ShoppingBag
                        size={12}
                        className="mr-1.5 text-slate-400"
                      />
                      {customer._count.orders} Lifetime Orders
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>

                  <TableCell>
                    <CustomerActions customer={customer} />
                  </TableCell>
                </TableRow>
              ))}

              {customers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <User size={24} className="opacity-20" />
                      <p>No customers found yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
