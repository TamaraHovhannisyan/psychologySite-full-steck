import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-10">{children}</div>
    </section>
  );
}
