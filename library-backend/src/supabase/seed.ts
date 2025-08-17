import { supabase } from "./supabaseClient";

async function seedAdmin() {
  const email = "admin2@admin.com";
  const password = "123456";
  const name = "admin2";

  // 1️⃣ Buat user di Supabase Auth
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

  if (authError) {
    console.error("Error creating admin in auth:", authError);
    return;
  }

  // 2️⃣ Tambahkan role ke tabel public users
  const { error: insertError } = await supabase.from("users").insert([
    {
      id: authData.user?.id, // id dari Supabase Auth
      email,
      name,
      role: "admin",
    },
  ]);

  if (insertError) {
    console.error("Error inserting admin role:", insertError);
  } else {
    console.log("Admin seeded:", { id: authData.user?.id, email, name });
  }
}

seedAdmin();
