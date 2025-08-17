"use client";

import { Button } from "@/components/ui/button";
import api from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Sidebar() {
  const router = useRouter();

  const logout = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.post("/auth/logout");
          router.push("/auth/login");

          Swal.fire({
            title: "Logout Successful",
            text: "You have been logged out.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (err: any) {
          Swal.fire({
            title: "Logout Failed",
            text: err.response?.data?.message || "Failed to log out.",
            icon: "error",
          });
        }
      }
    });
  };

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
