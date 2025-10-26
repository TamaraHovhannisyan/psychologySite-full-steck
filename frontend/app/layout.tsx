import NavbarVisibility from "@/components/NavbarVisibility";
import "./globals.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <NavbarVisibility />
        {children}
      </body>
    </html>
  );
}
