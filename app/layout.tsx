import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexora - Premium Mobile eCommerce",
  description: "Discover the latest smartphones from top brands with premium shopping experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
      >
        <Navbar />
        <main className="flex-1 flex flex-col pt-20 md:pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

