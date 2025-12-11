import { ProductActions } from '@/components/products/product-actions';
import { ProductDialog } from '@/components/products/product-dialog';
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
import { AlertTriangle, Layers, Package } from 'lucide-react';
import Image from 'next/image';

const prisma = new PrismaClient();

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    // MASTER CONTAINER: Strict overflow control
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950 w-full max-w-full overflow-hidden">
      {/* HEADER */}
      <div className="flex-none flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Inventory
          </h1>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {products.length} Items in Stock
          </p>
        </div>
        <ProductDialog />
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar w-full">
        {/* MOBILE VIEW: Cards (Strictly contained) */}
        <div className="block md:hidden space-y-3 pb-20 w-full">
          {products.map((product) => {
            const isLowStock = product.stock < 10;
            return (
              <div
                key={product.id}
                className="w-full flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-start gap-3">
                  {/* Image Thumbnail */}
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-100">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <Package size={20} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-slate-900 truncate pr-2 dark:text-white">
                        {product.name}
                      </h3>
                      {/* Action Menu */}
                      <div className="-mr-2 -mt-1">
                        <ProductActions
                          product={{ ...product, price: Number(product.price) }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 h-5 font-medium border-slate-200 text-slate-500"
                      >
                        {product.category}
                      </Badge>
                      {isLowStock && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                          <AlertTriangle size={10} /> Low Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Stats */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Layers size={14} />
                    <span
                      className={
                        isLowStock
                          ? 'text-red-600 font-bold'
                          : 'text-slate-700 dark:text-slate-300'
                      }
                    >
                      {product.stock} Units
                    </span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    {formatCurrency(Number(product.price))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* DESKTOP VIEW: High Density Table */}
        <div className="hidden md:block rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-950">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 dark:bg-slate-900/50">
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const isLowStock = product.stock < 10;
                return (
                  <TableRow
                    key={product.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <TableCell>
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-800">
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="font-medium text-slate-900 dark:text-white">
                      {product.name}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-medium text-slate-500 dark:text-slate-400 rounded-md"
                      >
                        {product.category}
                      </Badge>
                    </TableCell>

                    <TableCell className="font-bold tabular-nums">
                      {formatCurrency(Number(product.price))}
                    </TableCell>

                    <TableCell>
                      <div
                        className={`flex items-center gap-2 font-medium ${
                          isLowStock
                            ? 'text-red-600'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {isLowStock && <AlertTriangle size={14} />}
                        <span>{product.stock} units</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <ProductActions
                        product={{ ...product, price: Number(product.price) }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
