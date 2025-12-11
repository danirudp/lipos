import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // 1. Define pages that are strictly for logged-in users
      // You can add more paths here as your app grows
      const protectedPaths = [
        '/pos',
        '/dashboard',
        '/products',
        '/customers',
        '/history',
      ];

      const isProtectedPage = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      const isLoginPage = nextUrl.pathname.startsWith('/login');

      if (isProtectedPage) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && isLoginPage) {
        // Only redirect to /pos if they are trying to access /login while already logged in
        return Response.redirect(new URL('/pos', nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
