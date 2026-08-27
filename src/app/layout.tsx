import type { Metadata } from "next";
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
        {children}
      </body>
    </html>
  );
}