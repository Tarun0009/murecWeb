import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Navbar } from "@features/navigation/components/Navbar";
import { Footer } from "@features/navigation/components/Footer";
import { SmoothScrollProvider } from "@shared/components/SmoothScrollProvider";
import { Preloader } from "@features/preloader/components/Preloader";
import "./globals.css";

const displaySerif = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-serif",
});

const sansBody = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-body",
});

export const metadata: Metadata = {
  title: "MUREC | 78+ years of legacy",
  description:
    "MUREC. 78+ years of legacy. The MUREC Collection. Premium high-rise residential in Sector 136, Noida, aligned with IGBC certification standards.",
  metadataBase: new URL("https://www.murec.com"),
  icons: {
    icon: [{ url: "/brand/favicon.png", type: "image/png" }],
    shortcut: "/brand/favicon.png",
    apple: "/brand/favicon.png",
  },
  openGraph: {
    title: "MUREC",
    description: "78+ years of legacy. The MUREC Collection in Sector 136, Noida.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0e0c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displaySerif.variable} ${sansBody.variable}`}>
      <body className="grain">
        <Preloader />
        <SmoothScrollProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
