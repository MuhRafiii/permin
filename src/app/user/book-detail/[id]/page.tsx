"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/services/api";
import { Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function BookDetailPage() {
  const params = useParams();
  const id = params.id;
  const [book, setBook] = useState<any>(null);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  const fetchBook = async () => {
    try {
      const res = await api.get(`/books/${id}`);
      const data = res.data.data;
      console.log(res);

      setBook(data);
      setFavoriteCount(data.favoriteCount);
      setIsFavorite(data.isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const toggleFavorite = async (bookId: string, isFavorite: boolean) => {
    const prevBook = { ...book };
    const newBook = {
      ...book,
      isFavorite: !isFavorite,
      favoriteCount: isFavorite
        ? prevBook.favoriteCount - 1
        : prevBook.favoriteCount + 1,
    };

    // Optimistic update
    setBook(newBook);

    try {
      let res;
      if (isFavorite) {
        res = await api.delete(`/favorites/unfavorite/${bookId}`);
      } else {
        res = await api.post(`/favorites/${bookId}`);
      }

      if (res.status !== 200) {
        setBook(prevBook);
        Swal.fire({
          icon: "error",
          title: "Failed to mark as favorite",
          text: res.data?.message || "Internal server error.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error: any) {
      setBook(prevBook);
      Swal.fire({
        icon: "error",
        title: "Failed to mark as favorite",
        text:
          error.response?.data?.message ||
          "You have to login first before you can mark as favorite.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleReserve = async () => {
    const confirm = await Swal.fire({
      title: "Confirm Borrowing",
      text: "Are you sure you want to borrow this book?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, borrow it",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.put(`/books/reserve/${id}`);
      Swal.fire({
        title: "Success",
        text: "The book has been reserved for you!",
        icon: "success",
      });
      fetchBook();
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        title: "Failed",
        text: err.response?.data?.message || "Failed to reserve the book.",
        icon: "error",
      });
    }
  };

  if (!book) return <p className="text-center mt-10">Book not found</p>;

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-10">
        <Button
          variant="outline"
          onClick={() => router.push("/user/books")}
          className="mb-4"
        >
          ← Back to Books
        </Button>

        <Card className="flex flex-col lg:flex-row lg:items-center gap-6 p-10">
          {/* Gambar Buku */}
          <div className="lg:w-1/3 flex justify-center items-start">
            <img
              src={
                book.image ||
                "https://res.cloudinary.com/dxlevzn3n/image/upload/v1755059566/placeholder_surqve.png"
              }
              alt={book.title}
              className="rounded-lg object-cover w-full max-w-sm"
            />
          </div>

          {/* Detail Buku */}
          <CardContent className="lg:w-2/3">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl font-bold">{book.title}</CardTitle>
              <p className="text-gray-500 text-sm">Author: {book.author}</p>
              <p className="text-gray-500 text-sm">
                Publisher: {book.publisher}
              </p>
              <p className="text-gray-500 text-sm">Release Year: {book.year}</p>
            </CardHeader>

            <Badge className="mb-4">{book.categories?.name}</Badge>
            <div className="flex items-center gap-2 mb-4">
              {book.status === "available" && (
                <span className="w-2 h-2 rounded-full bg-green-700" />
              )}
              {book.status === "reserved" && (
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
              )}
              {book.status === "borrowed" && (
                <span className="w-2 h-2 rounded-full bg-gray-600" />
              )}
              <div className="text-sm text-gray-500">{book.status}</div>
            </div>

            <p className="mb-6">{book.description}</p>

            {/* Favorite & Pinjam */}
            <div className="flex items-center gap-4">
              <Button
                variant={book.isFavorite ? "default" : "outline"}
                onClick={() => toggleFavorite(book.id, book.isFavorite)}
                className="flex items-center gap-2"
              >
                <Star
                  className={`h-5 w-5 ${
                    book.isFavorite ? "fill-yellow-500 text-yellow-500" : ""
                  }`}
                />
                {book.favoriteCount}
              </Button>

              <Button
                variant="outline"
                disabled={book.status !== "available"}
                onClick={handleReserve}
              >
                Borrow Book
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
