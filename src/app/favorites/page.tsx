"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const favorite = true;
  const { user } = useAuth();
  const router = useRouter();

  if (user?.role === "admin") {
    router.push("/admin");
    Swal.fire({
      icon: "error",
      title: "Failed",
      text: "You have to login as a user to access this page.",
      confirmButtonColor: "#d33",
    });
    return;
  }

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books", {
        params: {
          favorite,
          page: String(page),
        },
      });
      setBooks(res.data.sortedBooks || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [favorite, page]);

  const toggleFavorite = async (bookId: string, isFavorite: boolean) => {
    const prevBooks = [...books];

    // Optimistic update
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId
          ? {
              ...book,
              isFavorite: !isFavorite,
              favoriteCount: isFavorite
                ? book.favoriteCount - 1
                : book.favoriteCount + 1,
            }
          : book
      )
    );

    try {
      let res;
      if (isFavorite) {
        res = await api.delete(`/favorites/unfavorite/${bookId}`);
      } else {
        res = await api.post(`/favorites/${bookId}`);
      }

      if (res.status !== 200) {
        setBooks(prevBooks);
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: res.data?.message || "Internal server error",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error: any) {
      setBooks(prevBooks);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error.response?.data?.message ||
          "You have to be logged in to mark as favorite",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-center lg:text-left">
          My Favorite Books
        </h1>

        {books.length > 0 ? (
          <>
            {/* Book List */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {books.map((book) => (
                <Card key={book.id} className="flex flex-col">
                  <CardHeader>
                    <img
                      src={
                        book.image ||
                        "https://res.cloudinary.com/dxlevzn3n/image/upload/v1755059566/placeholder_surqve.png"
                      }
                      alt={book.title}
                      className="w-full h-96 object-cover rounded-md"
                    />
                    <CardTitle className="mt-2">{book.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-2">
                    <p className="text-sm text-gray-500">{book.author}</p>
                    {book.status === "available" && (
                      <Badge className="bg-green-700">{book.status}</Badge>
                    )}
                    {book.status === "reserved" && (
                      <Badge className="bg-yellow-500">{book.status}</Badge>
                    )}
                    {book.status === "borrowed" && (
                      <Badge className="bg-gray-600">{book.status}</Badge>
                    )}
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={book.isFavorite ? "default" : "outline"}
                        size="icon"
                        className="rounded-full"
                        onClick={() => toggleFavorite(book.id, book.isFavorite)}
                      >
                        <Star
                          className={
                            book.isFavorite
                              ? "fill-yellow-400 text-yellow-400"
                              : ""
                          }
                        />
                      </Button>
                      <span>{book.favoriteCount}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        router.push(`/user/book-detail/${book.id}`)
                      }
                    >
                      Detail
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 gap-4">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </Button>
              <span>Page {page}</span>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={books.length < 10}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <p className="h-screen text-gray-500 text-center p-10">
            You have no favorite books
          </p>
        )}
      </div>
    </>
  );
}
