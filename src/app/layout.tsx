import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { MaterialUIProvider } from "@/components/providers/MaterialUIProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trackify - Smart Finance & Subscription Tracker",
  description: "Track and manage your subscriptions and bills efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MaterialUIProvider>
          <SessionProvider>
            <QueryProvider>
              {children}
            </QueryProvider>
          </SessionProvider>
        </MaterialUIProvider>
      </body>
    </html>
  );
}
