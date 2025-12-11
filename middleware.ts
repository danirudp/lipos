// middleware.ts (CORRECTED CODE)

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// 1. Get the resulting middleware handler from NextAuth
const { auth } = NextAuth(authConfig);

// 2. Export it as a named export 'middleware'
export const middleware = auth; // <-- This is the fix!

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

// You can optionally remove the default export if you prefer
// export default NextAuth(authConfig).auth;
