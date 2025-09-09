"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <p className="text-lg text-center text-gray-400 italic">Loading...</p>
      </div>
    );
  }

  if (user?.role === "admin") {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-1/5">
          <Sidebar />
        </div>
        <main className="w-4/5 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    );
  }

  return (
    <>
      <Navbar isLoggedIn={!!user} onLogout={logout} />
      <main className="bg-gradient-to-br from-blue-100 via-white to-blue-100 pt-18">
        {children}
      </main>
    </>
  );
}
