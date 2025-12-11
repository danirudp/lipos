'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    // This will redirect to /pos automatically based on auth.config.ts logic
    // or the callbackUrl passed in the form
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

// --- NEW Sign Out Action ---
export async function signOutAction() {
  // Call the NextAuth signOut function
  // redirectTo: '/login' ensures the user is sent back to the login page after clearing the session
  await signOut({ redirectTo: '/login' });
}
