"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function UserHomePage() {
  const { user } = useAuth();
  const router = useRouter();

  if (user?.role === "admin") {
    router.push("/admin");
    Swal.fire({
      icon: "error",
      title: "Failed",
      text: "You have to logout for guest access.",
      confirmButtonColor: "#d33",
    });
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:px-6 lg:px-8">
      <main className="w-full max-w-2xl bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            Welcome {user ? user.name : "Guest"} 👋
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {user
              ? "You are logged in. Explore your personalized dashboard."
              : "Please log in to see your personal dashboard features."}
          </p>
        </div>

        {user && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Explore Books */}
            <Link href="/books">
              <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  📖 Explore Books
                </h2>
                <p className="text-sm text-gray-600">
                  Browse the library collection and discover new titles.
                </p>
              </div>
            </Link>

            {/* Favorite Books */}
            <Link href="/favorites">
              <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  ⭐ Favorite Books
                </h2>
                <p className="text-sm text-gray-600">
                  View and manage the books you have marked as favorites.
                </p>
              </div>
            </Link>

            {/* Borrowing History */}
            <Link href="/borrowings">
              <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  📜 Borrowing History
                </h2>
                <p className="text-sm text-gray-600">
                  Check your past and current borrowing records.
                </p>
              </div>
            </Link>

            {/* Persist AI Assistant */}
            <Link href="/persist">
              <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  🤖 Permin Assistant
                </h2>
                <p className="text-sm text-gray-600">
                  Ask our AI assistant for book recommendations and help.
                </p>
              </div>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
