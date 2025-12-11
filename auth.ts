import type { User } from '@/lib/definitions';
import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { Pool } from 'pg';
import { z } from 'zod';
import { authConfig } from './auth.config';

// 1. Initialize the Database Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true, // Required for Neon DB
});

// 2. Helper function to fetch user from DB
async function getUser(email: string): Promise<User | undefined> {
  try {
    const client = await pool.connect();
    const result = await client.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    client.release();
    return result.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

// 3. Main NextAuth Configuration
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // A. Validate input fields using Zod
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          // B. Fetch user from database
          const user = await getUser(email);
          if (!user) return null;

          // C. Verify password hash
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
