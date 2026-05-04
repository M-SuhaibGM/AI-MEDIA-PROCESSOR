import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./Prisma"; 

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // CRITICAL: This fixes the 'Host must be trusted' error on AWS Amplify
  trustHost: true, 
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { prompt: "consent" } },
    }),
  ],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth",
  },
  // Removed unnecessary logger and console.logs for better performance
  debug: false,
});