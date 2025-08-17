"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

interface AdminBookModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  categories: { id: string; name: string }[];
  initialData?: {
    title: string;
    author: string;
    publisher: string;
    year: number;
    description: string;
    category_id: string;
    status?: "available" | "borrowed";
    image?: string;
  };
}

export default function AdminBookModal({
  open,
  onClose,
  onSubmit,
  categories,
  initialData,
}: AdminBookModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [category_id, setCategory_id] = useState("");
  const [status, setStatus] = useState<"available" | "reserved" | "borrowed">(
    "available"
  );
  const [image, setImage] = useState<File | null>(null);
  const [oldImage, setOldImage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAuthor(initialData.author);
      setPublisher(initialData.publisher);
      setYear(initialData.year.toString());
      setDescription(initialData.description);
      setCategory_id(initialData.category_id);
      setStatus(initialData.status || "available");
      setOldImage(initialData.image || null);
    } else {
      setTitle("");
      setAuthor("");
      setPublisher("");
      setYear("");
      setDescription("");
      setCategory_id("");
      setStatus("available");
      setImage(null);
      setOldImage(null);
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("publisher", publisher);
    formData.append("year", year);
    formData.append("description", description);
    if (category_id) formData.append("category_id", category_id);
    if (initialData) formData.append("status", status);
    if (image) {
      formData.append("image", image);
    } else if (oldImage) {
      formData.append("image", oldImage);
    }

    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-11/12 sm:max-w-lg overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Book" : "Create Book"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Book title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Author</Label>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Book author"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Publisher</Label>
            <Input
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              placeholder="Book publisher"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Book release year"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Book description"
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={category_id}
              onValueChange={(v) => setCategory_id(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {initialData && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v: "available" | "borrowed") => setStatus(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="borrowed">Borrowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Image</Label>
            {oldImage && !image && (
              <img src={oldImage} alt="Old" className="w-24 h-auto rounded" />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>
          <Button type="submit" className="w-full">
            {initialData ? "Update" : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
