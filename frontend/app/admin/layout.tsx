"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { apiPost } from "@/app/lib/api";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      const res = await apiPost("/auth/logout");
      if (res.ok) {
        setIsMenuOpen(false);
        router.replace("/admin");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const isLoginPage = pathname === "/admin";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {!isLoginPage && (
        <nav className="fixed top-0 left-0 w-full bg-[#075E6C] text-white shadow z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 flex justify-between items-center h-12">
            <h1
              onClick={() => router.push("/admin/posts")}
              className="text-sm sm:text-base font-semibold cursor-pointer hover:text-gray-200"
            >
              Admin Panel
            </h1>

            <div className="hidden sm:flex items-center gap-4">
              <Link
                href="/admin/posts"
                className="hover:underline text-sm sm:text-base"
              >
                Posts
              </Link>
              <Link
                href="/admin/posts/new"
                className="hover:underline text-sm sm:text-base"
              >
                + New Post
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white text-[#075E6C] px-2 py-1 rounded-md hover:bg-gray-200 text-sm sm:text-base transition"
              >
                Logout
              </button>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="sm:hidden bg-[#075E6C] border-t border-[#0a7083] px-4 py-2 space-y-2 animate-fadeIn">
              <Link
                href="/admin/posts"
                onClick={() => setIsMenuOpen(false)}
                className="block text-white hover:underline text-sm"
              >
                Posts
              </Link>
              <Link
                href="/admin/posts/new"
                onClick={() => setIsMenuOpen(false)}
                className="block text-white hover:underline text-sm"
              >
                + New Post
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-[#075E6C] bg-white px-2 py-1 rounded-md hover:bg-gray-200 transition text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      )}

      <main className={`flex-1 p-4 sm:p-6 ${!isLoginPage ? "mt-14" : ""}`}>
        {children}
      </main>
    </div>
  );
}
