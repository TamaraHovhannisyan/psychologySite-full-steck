export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="max-w-3xl mx-auto px-4 py-6 font-sans">
        <header className="text-xl font-bold mb-6">
          <a href="/">HayiTun</a>
        </header>
        {children}
      </body>
    </html>
  );
}
