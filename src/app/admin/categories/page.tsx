"use client";

import AdminCategoryModal from "@/components/AdminCategoryModal";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (data: { name: string }) => {
    try {
      if (editData) {
        await api.put(`/categories/edit/${editData.id}`, data);
        Swal.fire({
          icon: "success",
          title: "Category updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await api.post("/categories/add", data);
        Swal.fire({
          icon: "success",
          title: "Category created successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      fetchCategories();
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
        await api.delete(`/categories/delete/${id}`);
        Swal.fire("Deleted!", "Category has been deleted.", "success");
        fetchCategories();
      } catch (error) {
        Swal.fire("Error!", "Failed to delete category.", "error");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button
          onClick={() => {
            setEditData(null);
            setModalOpen(true);
          }}
        >
          + Add Category
        </Button>
      </div>

      <table className="w-full bg-white rounded-md shadow overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td className="p-2">{cat.id}</td>
              <td className="p-2">{cat.name}</td>
              <td className="flex gap-2 justify-center items-center p-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditData(cat);
                    setModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(cat.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Create / Edit */}
      <AdminCategoryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        initialData={editData || undefined}
      />
    </div>
  );
}
