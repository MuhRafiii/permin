"use client";

import Sidebar from "@/components/Sidebar";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      try {
        await api.get("/admin");
      } catch (error) {
        console.error(error);
        router.push("/auth/login");
      }
    };

    getUserData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/5">
        <Sidebar />
      </div>
      <main className="w-4/5 p-4 lg:p-8 overflow-auto">{children}</main>
    </div>
  );
}
