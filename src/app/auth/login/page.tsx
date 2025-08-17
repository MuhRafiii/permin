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

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      const email = res.data.user.email;
      let role: string;

      if (email.endsWith("@admin.com")) {
        role = "admin";
      } else {
        role = "user";
      }

      MySwal.close(); // Tutup loading
      await MySwal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome back! Redirecting to ${role} dashboard...`,
        timer: 2000,
        showConfirmButton: false,
      });

      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
      MySwal.close(); // Tutup loading
      MySwal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.message || "An error occurred during login",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xs sm:max-w-md mx-auto my-auto mt-10 p-6 border rounded-md shadow-md space-y-4 sm:space-y-6"
    >
      <h1 className="text-2xl sm:text-3xl font-semibold text-center">Login</h1>

      <div className="space-y-1 sm:space-y-2">
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

      <div className="space-y-1 sm:space-y-2">
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
        {loading ? "Processing..." : "Login"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <a href="/auth/register" className="text-blue-500 hover:underline">
          Register
        </a>
      </p>
    </form>
  );
}
