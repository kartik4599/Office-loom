import { ConvexClientProvider } from "@/components/convex-client-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// @ts-ignore
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import Modals from "@/components/modals";
import { Toaster } from "sonner";
import { Provider } from "jotai";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Office Loom",
  description: "Next Gen Office Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConvexClientProvider>
            <Provider>
              <Toaster richColors />
              <Modals />
              {children}
            </Provider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
