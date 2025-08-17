"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      setLoading(false);

      await MySwal.fire({
        icon: "success",
        title: "Registration successful!",
        text: "Please login to continue.",
        confirmButtonText: "OK",
      });

      router.push("/auth/login");
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xs sm:max-w-md mx-auto mt-10 p-6 border rounded-md shadow-md space-y-4 sm:space-y-6"
    >
      <h1 className="text-2xl sm:text-3xl font-semibold text-center">
        Register
      </h1>

      <div className="space-y-1 sm:space-y-2">
        <Label htmlFor="name" className="text-sm sm:text-base">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          className="text-sm sm:text-base"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm sm:text-base">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          className="text-sm sm:text-base"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm sm:text-base">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Your password"
          value={form.password}
          onChange={handleChange}
          className="text-sm sm:text-base"
          required
        />
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Registering..." : "Register"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/auth/login" className="text-blue-500 hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}
