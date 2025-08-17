"use client";

import Navbar from "@/components/Navbar";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await api.get("/");
        const userData = res.data.data;

        if (userData) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

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
          setLoading(true);
          setIsLoggedIn(false);
          setTimeout(() => {
            setLoading(false);
          }, 500);
          router.push("/user");

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
    <>
      <Navbar isLoggedIn={isLoggedIn} onLogout={logout} />
      {loading ? (
        <div className="flex justify-center items-center p-10">
          <p className="text-lg text-center text-gray-400 italic">Loading...</p>
        </div>
      ) : (
        <main>{children}</main>
      )}
    </>
  );
}
