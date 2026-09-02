import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Poppins } from "next/font/google";
import "./globals.css";

// Setup font Poppins
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Direktori Digital UMKM Kabupaten Bekasi",
  description: "Portal resmi Dinas Koperasi dan UMKM Kabupaten Bekasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${poppins.className} bg-brand-lightest text-brand-deep antialiased`}>
        {/* TopLoader */}
        <NextTopLoader
          color="#34908B"
          initialPosition={0.08}
          crawlSpeed={200}
          height={4}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #34908B,0 0 5px #34908B"
        />

        {children}
      </body>
    </html>
  );
}