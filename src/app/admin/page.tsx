"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/services/api";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [status, setStatus] = useState("reserved");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await api.get("/admin");
        setUser(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    getUserData();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books/admin", {
        params: {
          status,
          limit: "10",
        },
      });
      setBooks(res.data.sortedBooks || []);
    } catch (err) {
      console.error(err);
    }
  };

  const approveBorrowing = async (bookId: string, userId: string) => {
    const confirm = await Swal.fire({
      title: "Approve Borrowing?",
      text: "Are you sure you want to approve the borrowing?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, approve",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await api.put(`/books/approve/${bookId}`, { user_id: userId });
        await api.post("/borrowings/add", { book_id: bookId, user_id: userId });
        Swal.fire("Success!", "The borrowing has been approved.", "success");
        fetchBooks();
      } catch (err: any) {
        Swal.fire({
          title: "Failed",
          text: err.response?.data?.message || "Failed to reserve the book.",
          icon: "error",
        });
      }
    }
  };

  const returningBook = async (bookId: string, userId: string) => {
    const confirm = await Swal.fire({
      title: "Return Book?",
      text: "did the user return the book?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, return",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await api.put("/borrowings/returned", {
          book_id: bookId,
          user_id: userId,
        });
        Swal.fire("Success!", "The book has been returned.", "success");
        fetchBooks();
      } catch (err: any) {
        Swal.fire({
          title: "Failed",
          text: err.response?.data?.message || "Failed to return the book.",
          icon: "error",
        });
      }
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [status]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {user ? (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <p>
              <strong>Name:</strong> {user.user_metadata.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Select value={status} onValueChange={(v) => setStatus(v)}>
              <SelectTrigger className="w-full cursor-pointer bg-white hover:bg-gray-100">
                <SelectValue placeholder="Choose a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="borrowed">Borrowed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {books.map((book) => (
              <div key={book.id} className="bg-white p-4 rounded-md shadow">
                <img
                  src={book.image}
                  alt={book.title}
                  className="mb-2 w-full h-40 object-cover"
                />
                <h2 className="font-semibold">{book.title}</h2>
                <p className="text-sm text-gray-400">
                  {status === "reserved" ? "Reserved by" : "Borrowed by"}:{" "}
                  {book.user}
                </p>
                <p className="text-sm text-gray-400">
                  {status === "reserved"
                    ? `Reserved at: ${formatDate(book.reserved_at)}`
                    : `Borrowed at: ${formatDate(book.borrowed_at)}`}
                </p>
                {status === "reserved" ? (
                  <button
                    onClick={() => approveBorrowing(book.id, book.reserved_by)}
                    className="text-sm bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 mt-2 rounded-md cursor-pointer"
                  >
                    Approve
                  </button>
                ) : (
                  <button
                    onClick={() => returningBook(book.id, book.borrowed_by)}
                    className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 mt-2 rounded-md cursor-pointer"
                  >
                    Returned
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}
