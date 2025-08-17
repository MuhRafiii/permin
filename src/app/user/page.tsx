"use client";

import api from "@/services/api";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function UserHomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await api.get("/");
        const userData = res.data.data;

        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUserData();
  }, []);

  return (
    <div>
      {/* Halaman content */}
      <main className="p-6">
        <h1 className="text-2xl font-bold">
          Welcome {user ? user.user_metadata.name : "Guest"}!
        </h1>
        {user ? (
          <p>You are logged in. Explore your dashboard.</p>
        ) : (
          <p>Please log in to see your personal dashboard features.</p>
        )}
      </main>
    </div>
  );
}
