"use client";

import AdminBookModal from "@/components/AdminBookModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/services/api";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books/admin", {
        params: {
          search,
          page: String(page),
          limit: "10",
        },
      });
      setBooks(res.data.sortedBooks || []);
      console.log(res.data.sortedBooks);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (book: any) => {
    setEditData({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      year: book.year,
      description: book.description,
      category_id: book.category_id,
      status: book.status,
      image: book.image,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (editData) {
        await api.put(
          `/books/edit/${books.find((b) => b.title === editData.title)?.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Book updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchBooks();
      } else {
        await api.post("/books/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire({
          icon: "success",
          title: "Book created successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchBooks();
      }
      setEditData(null);
      await fetchBooks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/books/delete/${id}`);
        Swal.fire("Deleted!", "Book has been deleted.", "success");
        fetchBooks();
      } catch (error) {
        Swal.fire("Error!", "Failed to delete book.", "error");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [search, page]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Books</h1>
        <Button onClick={handleCreate}>Add Book</Button>
      </div>

      {/* Search */}
      <div className="relative w-full mb-6">
        <img
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 mr-3 opacity-50"
          src="data:image/png;base64,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"
          alt="search--v1"
        />
        <Input
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2 rounded-md"
        />
      </div>

      <table className="w-full bg-white rounded-md shadow overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Image</th>
            <th className="p-2">Title</th>
            <th className="p-2">Author</th>
            <th className="p-2">Category</th>
            <th className="p-2">Status</th>
            <th className="p-2">Favorites</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="h-30 text-center">
              <td className="w-40 p-2">{book.id}</td>
              <td className="p-2">
                <div className="flex justify-center">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-20 rounded"
                  />
                </div>
              </td>
              <td className="p-2">{book.title}</td>
              <td className="p-2">{book.author}</td>
              <td className="p-2">{book.categories?.name}</td>
              <td className="p-2">{book.status}</td>
              <td className="p-2">{book.favoriteCount}</td>
              <td className="p-2">
                <div className=" flex gap-2 justify-center items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(book)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <AdminBookModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          categories={categories}
          initialData={editData || undefined}
        />
      )}

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
    </div>
  );
}
