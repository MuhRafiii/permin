"use client";

import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/5">
        <Sidebar />
      </div>
      <main className="w-4/5 p-4 lg:p-8 overflow-auto">{children}</main>
    </div>
  );
}
