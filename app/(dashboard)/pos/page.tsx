import { POSLayout } from '@/components/pos/pos-layout';
import { ProductCard } from '@/components/pos/product-card';
import { SearchBar } from '@/components/pos/search-bar';
import { PrismaClient } from '@prisma/client';

// Prevent multiple Prisma instances in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

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
      {/* UNIFIED HEADER
        - flex-col: Stacks items vertically
        - sticky top-0: Keeps it visible while scrolling
      */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85 md:px-6 md:py-4">
        <div className=" flex w-full flex-col gap-3">
          {/* 1. CATEGORIES (TOP) */}
          {/* w-full ensures it matches the width of the search bar */}

          {/* 2. SEARCH BAR (BOTTOM) */}
          <div className="w-full">
            <SearchBar />
          </div>
        </div>
      </header>

      {/* PRODUCT GRID */}
      {/* Added pt-4 to give breathing room from the new taller header */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 dark:bg-slate-950 md:p-6">
        {products.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-slate-400">
            <p>No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-24 sm:grid-cols-3 md:gap-4 md:pb-0 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </POSLayout>
  );
}
