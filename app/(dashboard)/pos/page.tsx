import { CategoryFilter } from '@/components/pos/category-filter';
import { POSLayout } from '@/components/pos/pos-layout';
import { ProductCard } from '@/components/pos/product-card';
import { SearchBar } from '@/components/pos/search-bar';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getProducts(query: string, category: string) {
  const where: any = {};
  if (query) where.name = { contains: query, mode: 'insensitive' };
  if (category && category !== 'All') where.category = category;

  const products = await prisma.product.findMany({
    where,
    orderBy: { name: 'asc' },
  });

  return products.map((p) => ({ ...p, price: Number(p.price) }));
}

interface PageProps {
  searchParams: Promise<{ query?: string; category?: string }>;
}

export default async function POSPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || '';
  const category = searchParams.category || 'All';

  const products = await getProducts(query, category);
  const customers = await prisma.customer.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <POSLayout customers={customers}>
      {/* HEADER: Compact & Glassmorphic */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 md:px-6">
        <div className="flex flex-1 items-center gap-4">
          <div className="w-full max-w-xs lg:max-w-sm">
            <SearchBar />
          </div>
          <div className="hidden h-6 w-px bg-slate-200 dark:bg-slate-800 sm:block" />
          <div className="hidden flex-1 overflow-hidden sm:block">
            <CategoryFilter />
          </div>
        </div>
      </header>

      {/* MOBILE CATEGORY BAR (Visible only on small screens) */}
      <div className="block border-b border-slate-100 bg-white px-4 py-2 sm:hidden dark:border-slate-800 dark:bg-slate-950">
        <CategoryFilter />
      </div>

      {/* PRODUCT GRID: High Density */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 dark:bg-slate-950 md:p-6">
        {products.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-slate-400">
            <p>No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 md:gap-4 pb-24 md:pb-0">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </POSLayout>
  );
}
