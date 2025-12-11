import { CartSidebar } from '@/components/pos/cart-sidebar';
import { CategoryFilter } from '@/components/pos/category-filter';
import { ProductCard } from '@/components/pos/product-card';
import { SearchBar } from '@/components/pos/search-bar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to fetch products based on search/filter
async function getProducts(query: string, category: string) {
  const where: any = {};

  if (query) {
    where.name = { contains: query, mode: 'insensitive' };
  }

  if (category && category !== 'All') {
    where.category = category;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { name: 'asc' },
  });

  return products.map((p) => ({
    ...p,
    price: Number(p.price),
  }));
}

interface PageProps {
  searchParams: Promise<{ query?: string; category?: string }>;
}

export default async function POSPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || '';
  const category = searchParams.category || 'All';

  // 1. Fetch Products
  const products = await getProducts(query, category);

  // 2. Fetch Customers (New Feature!)
  const customers = await prisma.customer.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* LEFT SIDE: Product Grid */}
      <div className="flex-1 flex flex-col h-full">
        <header className="h-20 border-b bg-white dark:bg-slate-950 px-6 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold hidden md:block">LIPOS</h1>

          <div className="flex flex-1 items-center gap-4 max-w-2xl">
            <SearchBar />
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <CategoryFilter />
          </div>
        </header>

        <ScrollArea className="flex-1 p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* RIGHT SIDE: The Cart (Now with Customers passed down) */}
      <CartSidebar customers={customers} />
    </div>
  );
}
