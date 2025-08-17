"use client";

import { BorrowingCard } from "@/components/UserBorrowingCard";
import api from "@/services/api";
import { useEffect, useState } from "react";

export default function UserBorrowings() {
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowings = async () => {
      try {
        const res = await api.get("/borrowings/user");
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
    return <p className="text-center text-gray-400 mt-10">Loading...</p>;
  }

  const currentBorrowings = borrowings.filter((b) => b.returned_at === null);
  const historyBorrowings = borrowings.filter((b) => b.returned_at !== null);

  return (
    <div className="p-4 lg:p-8">
      {/* Buku yang sedang dipinjam */}
      <section className="mb-10">
        <h1 className="text-2xl font-bold mb-6 text-center lg:text-left">
          Borrowed Book
        </h1>
        {currentBorrowings.length > 0 ? (
          <div className="flex flex-col gap-4">
            {currentBorrowings.map((borrow) => (
              <BorrowingCard key={borrow.id} borrow={borrow} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center p-10">
            There's no borrowed book.
          </p>
        )}
      </section>

      {/* Riwayat peminjaman */}
      <section>
        <h1 className="text-2xl font-bold mb-6 text-center lg:text-left">
          Borrowing History
        </h1>
        {historyBorrowings.length > 0 ? (
          <div className="flex flex-col gap-4">
            {historyBorrowings.map((borrow) => (
              <BorrowingCard key={borrow.id} borrow={borrow} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            There's no borrowing history.
          </p>
        )}
      </section>
    </div>
  );
}
