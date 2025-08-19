"use client";

import api from "@/services/api";
import { useEffect, useState } from "react";

export default function AdminBorrowings() {
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowings = async () => {
      try {
        const res = await api.get("/borrowings");
        setBorrowings(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBorrowings();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-300 mt-10 ">Loading...</p>;
  }

  return (
    <div className="p-4 lg:p-8">
      <h1 className="text-2xl font-bold mb-6 text-center lg:text-left">
        Borrowings List
      </h1>
      <div className="flex flex-col gap-4">
        {borrowings.map((borrow) => (
          <div
            key={borrow.id}
            className="flex flex-col sm:flex-row items-center bg-white shadow-md rounded-lg p-4 lg:p-6 border border-gray-200"
          >
            {/* Gambar Buku */}
            <img
              src={borrow.books.image}
              alt={borrow.books.title}
              className="w-24 h-32 object-cover rounded-md mb-4 sm:mb-0 sm:mr-6"
            />

            {/* Info */}
            <div className="w-full flex sm:flex-col sm:gap-6">
              <div className="flex justify-between items-center">
                <div className="flex flex-col w-full">
                  <h2 className="text-lg font-semibold">
                    {borrow.books.title}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Category: {borrow.books.categories.name}
                  </p>
                </div>
                <p
                  className={`px-3 py-0.5 rounded-full text-xs w-fit ${
                    borrow.status === "returned"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {borrow.status}
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-full space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">
                      Username:
                    </span>{" "}
                    {borrow.users.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">Email:</span>{" "}
                    {borrow.users.email}
                  </p>
                </div>

                <div className="w-full space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">
                      Borrow Date:
                    </span>{" "}
                    {new Date(borrow.borrowed_at).toLocaleDateString("id-ID")}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">
                      Return Date:
                    </span>{" "}
                    {borrow.returned_at
                      ? new Date(borrow.returned_at).toLocaleDateString("id-ID")
                      : "Not returned yet"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
