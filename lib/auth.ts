import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./Prisma" 


export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // ... rest of config
    providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // This ensures Google always sends the refresh_token on first login
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "database", // Forces Auth.js to create a session in your MariaDB 'sessions' table
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth", // Points to your custom login page
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("Attempting sign in for:", user.email);
      return true;
    },
  },
  logger: {
    error(code, ...args) {
      console.error("Critical Auth Error:", code, args);
    },
  },
  debug: false,
  
})