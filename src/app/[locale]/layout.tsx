import type { Metadata } from "next";

import { Inter } from "next/font/google";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import ToastProvider from "@/components/shared/ToastProvider";
import { ThemeProvider } from "@/components/theme-provider";
import TopProgressBar from "@/components/ui/progress-bar";
import { TooltipProvider } from "@/components/ui/tooltip";

import Providers from "../providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kodansha",
  description: "An online book store built with NextJS",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className} suppressHydrationWarning>
        <TopProgressBar />

        <Providers>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              disableTransitionOnChange
              enableSystem
            >
              <ToastProvider />

              <TooltipProvider>
                <Header />

                <div className="min-h-[calc(100vh-110px)] bg-gray-50 py-5">
                  {children}
                </div>

                <Footer />
              </TooltipProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
