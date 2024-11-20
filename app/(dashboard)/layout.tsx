export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
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
