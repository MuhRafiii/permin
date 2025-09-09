"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg flex flex-col overflow-y-auto">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/admin" className="block p-2 rounded hover:bg-gray-100">
          Dashboard
        </Link>
        <Link
          href="/admin/categories"
          className="block p-2 rounded hover:bg-gray-100"
        >
          Categories
        </Link>
        <Link
          href="/admin/books"
          className="block p-2 rounded hover:bg-gray-100"
        >
          Books
        </Link>
        <Link
          href="/admin/borrowings"
          className="block p-2 rounded hover:bg-gray-100"
        >
          Borrowings
        </Link>
      </nav>
      <div className="p-4 border-t">
        <Button className="w-full" onClick={logout} variant="destructive">
          Logout
        </Button>
      </div>
    </aside>
  );
}
