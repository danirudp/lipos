import { MainNav } from '@/components/layout/main-nav';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <MainNav />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden h-16 border-b bg-white/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs">
              L
            </div>
            LIPOS
          </div>
          <MobileNav />
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
