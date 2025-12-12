import LoginForm from '@/app/ui/login-form';
import { ArrowLeft, Zap } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-50 blur-[120px] opacity-70"></div>
        <div className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-purple-50 blur-[120px] opacity-60"></div>
      </div>

      <div className="w-full max-w-[440px]">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition-all group-hover:bg-gray-50">
              <ArrowLeft size={16} />
            </div>
            Back to Home
          </Link>
        </div>

        <div className="relative rounded-3xl border border-white/20 bg-white/60 p-8 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-12">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl tracking-tight text-slate-900 mb-8 justify-center select-none hover:opacity-80 transition-opacity"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30">
              <Zap size={22} fill="currentColor" />
            </div>
            <span>LIPOS</span>
          </Link>

          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {/* Suspense is required because LoginForm uses useSearchParams */}
          <Suspense
            fallback={
              <div className="h-40 w-full animate-pulse rounded-lg bg-gray-100" />
            }
          >
            <LoginForm />
          </Suspense>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
