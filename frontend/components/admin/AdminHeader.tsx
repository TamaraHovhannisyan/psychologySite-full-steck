"use client";

export default function AdminHeader({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="mb-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      <button
        onClick={onLogout}
        className="rounded-lg px-3 py-1.5 bg-gray-900 text-white"
      >
        logout
      </button>
    </header>
  );
}
