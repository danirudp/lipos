// middleware.ts

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// 1. Get the resulting middleware handler from NextAuth
const { auth } = NextAuth(authConfig);

// 2. Export it as a named export 'middleware'
export const middleware = auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

// export default NextAuth(authConfig).auth;
