import { AddCustomerDialog } from '@/components/customers/add-customer-dialog';
import { CustomerActions } from '@/components/customers/customer-actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orders: true } } }, // Count their orders!
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-slate-500">Manage your loyal customer base.</p>
        </div>
        <AddCustomerDialog />
      </div>

      <div className="border rounded-lg bg-white dark:bg-slate-950 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-900/50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Joined</TableHead>
              {/* Added Empty Header for Actions Column */}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell className="text-slate-500">
                  {customer.email || '-'}
                </TableCell>
                <TableCell className="text-slate-500">
                  {customer.phone || '-'}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                    {customer._count.orders} Orders
                  </span>
                </TableCell>
                <TableCell className="text-slate-500">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </TableCell>
                {/* NEW ACTION CELL */}
                <TableCell>
                  <CustomerActions customer={customer} />
                </TableCell>
              </TableRow>
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6} // Increased colspan to 6 to account for new column
                  className="h-24 text-center text-slate-500"
                >
                  No customers found. Add one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
