import { MainNav } from '@/components/layout/main-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900">
      {/* Sidebar - Fixed on Desktop */}
      <div className="hidden md:block h-full">
        <MainNav />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
}
