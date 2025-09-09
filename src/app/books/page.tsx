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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
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
    return;
  }

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books", {
        params: {
          ...(status !== "all" && { status }),
          ...(category !== "all" && { category }),
          sortBy,
          search,
          page: String(page),
          limit: "12",
        },
      });
      setBooks(res.data.sortedBooks || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [status, category, sortBy, search, page]);

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
    <div className="min-h-screen container mx-auto px-4 py-6">
      {/* Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Status Filter */}
        <Select value={status} onValueChange={(v) => setStatus(v)}>
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Choose a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
            <SelectItem value="borrowed">Borrowed</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={category} onValueChange={(v) => setCategory(v)}>
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Choose a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="added_new">Newest Added</SelectItem>
            <SelectItem value="added_old">Oldest Added</SelectItem>
            <SelectItem value="fav_most">Most Favorite</SelectItem>
            <SelectItem value="fav_least">Least Favorite</SelectItem>
          </SelectContent>
        </Select>

        {/* Search */}
        <div className="relative w-full bg-white mb-6">
          <img
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 mr-3 opacity-50"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABaUlEQVR4nO2Wz0pCQRjFf2i6ydop9ArZO1T7FhrlK0TSH+spxNcw61GCaJMFJZn71rqolfHBufBtwjtzLxLkgYELM+ecud98cxhY4Q+hDLSAW+ANmGnY90BztiZXHAIfwHzBGAPNPAwLQM8JPwEXwDawrlEHLoGhW9cVNxo9CX0BJwvEbO5UaxPz6PLOJbQbwNtz5o1Q07I7U/vTULTFfQdKIcSWO9OYsyoCz9I4CiHeiXROPDrSuAkhjUSy7o1FXRp2z1NjKlIlg/GGNKbLNt6MMR7lUOod19mpMRDJEikW19Lox1ynYYbr9CKN49AAGYtoMRiKM3EnwFooueki02IwLfaBb3EPiETXmbdVwt9Q1J8mpp9ANda44MznisGOwqGiYd175c40MU3W18iAhq7FoofAROWtuqzObF5S4Fv2vioYZtpQX93rG6mWp3koqu5lYpvd4r+Y11zZH5ZpnJg/AvfLNl4Bww/dcoIlpDH7/gAAAABJRU5ErkJggg=="
            alt="search--v1"
          />
          <Input
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-md"
          />
        </div>
      </div>

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
                      book.isFavorite ? "fill-yellow-400 text-yellow-400" : ""
                    }
                  />
                </Button>
                <span>{book.favoriteCount}</span>
              </div>
              <Button
                size="sm"
                onClick={() => router.push(`/book-detail/${book.id}`)}
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
          disabled={books.length < 12}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
