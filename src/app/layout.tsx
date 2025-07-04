import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PER SE SYSTEMS",
  description: "Application de gestion d'armement avec authentification et rôles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <Navigation />
              <main>
                {children}
              </main>
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
