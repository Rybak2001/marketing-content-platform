import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "NovaTech Marketing Platform",
  description: "Plataforma integral de marketing de contenidos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors">
        <ThemeProvider>
          <AuthProvider>
            <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px' } }} />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
