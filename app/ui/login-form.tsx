'use client';

import { authenticate } from '@/lib/actions'; // Make sure this path matches your actions file
import { AlertCircle, ArrowRight, Loader2, Lock, Mail } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';

// Reusable Input Component
function InputGroup({
  id,
  type,
  name,
  placeholder,
  icon: Icon,
  label,
}: {
  id: string;
  type: string;
  name: string;
  placeholder: string;
  icon: any;
  label: string;
}) {
  return (
    <div>
      <label
        className="mb-1.5 block text-xs font-medium text-gray-700"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
          <Icon size={20} />
        </div>
        <input
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3.5 pl-12 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-400"
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          required
          minLength={type === 'password' ? 6 : undefined}
        />
      </div>
    </div>
  );
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/pos'; // Default redirect to /pos

  // useActionState handles the form submission state
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      <InputGroup
        label="Email Address"
        id="email"
        type="email"
        name="email"
        placeholder="name@example.com"
        icon={Mail}
      />

      <div>
        <InputGroup
          label="Password"
          id="password"
          type="password"
          name="password"
          placeholder="Enter your password"
          icon={Lock}
        />
        <div className="mt-1 flex justify-end">
          <a
            href="#"
            className="text-xs font-medium text-blue-600 hover:text-blue-500"
          >
            Forgot password?
          </a>
        </div>
      </div>

      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <button
        className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        aria-disabled={isPending}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            Log in <ArrowRight size={18} />
          </>
        )}
      </button>

      {/* Error Message Display */}
      {errorMessage && (
        <div
          className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600"
          aria-live="polite"
          aria-atomic="true"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}
    </form>
  );
}
