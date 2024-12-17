import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat } from "next/font/google";

import "./globals.css";

// Configure the Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
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
      <body className={`antialiased ${montserrat.className} bg-white`}>
        {children}
      </body>
    </html>
  );
}
