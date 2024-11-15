import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat } from "next/font/google";

import "./globals.css";

// Configure the Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Safe Flight Graphics",
  description: "Project Safe Flight graphics generator for social media.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${montserrat.className} bg-white`}
      >
        <nav className="bg-darkPrimary py-8 px-8 fixed w-full z-30">
          <div className="w-full flex items-center justify-between">
            <a
              href="/"
              className="text-white text-4xl font-bold justify-self-start"
            >
              Safe Flight Graphics
            </a>
          </div>
        </nav>
        <div className="pt-[6.5rem]"></div>
        {children}
      </body>
    </html>
  );
}
