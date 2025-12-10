'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const categories = [
  'All',
  'Electronics',
  'Wearables',
  'Furniture',
  'Accessories',
];

export function CategoryFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategory = searchParams.get('category') || 'All';

  const handleFilter = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={currentCategory === cat ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilter(cat)}
          className={cn(
            'rounded-full px-4 transition-all',
            currentCategory === cat
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'hover:bg-slate-100'
          )}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
