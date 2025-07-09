import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import type { SessionStrategy } from "next-auth";
import { getAppSecrets } from "@/lib/secrets";

const prisma = new PrismaClient();

// Initialize auth options with secrets from Google Secret Manager
const createAuthOptions = async () => {
  try {
    const secrets = await getAppSecrets();
    
    return {
      adapter: PrismaAdapter(prisma),
      providers: [
        GoogleProvider({
          clientId: secrets.googleClientId,
          clientSecret: secrets.googleClientSecret,
        }),
      ],
      session: {
        strategy: "jwt" as SessionStrategy,
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
      },
      jwt: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
      callbacks: {
        async session({ session, token }: any) {
          if (session.user && token.sub) {
            session.user.id = token.sub;
          }
          return session;
        },
        async jwt({ token, user }: any) {
          if (user) {
            token.sub = user.id;
          }
          return token;
        },
      },
      pages: {
        signIn: '/',
        error: '/',
      },
      secret: secrets.nextAuthSecret,
    };
  } catch (error) {
    console.error("Failed to load secrets from Google Secret Manager:", error);
    throw new Error("Failed to initialize authentication: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};

// Create the handler with dynamic auth options
const handler = async (req: any, res: any) => {
  const authOptions = await createAuthOptions();
  return NextAuth(authOptions)(req, res);
};

export { handler as GET, handler as POST }; 