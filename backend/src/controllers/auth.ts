import { Request, Response } from "express";
import { supabase } from "../supabase/supabaseClient";

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Email, password, and name are required.",
      });
    }

    if (email.endsWith("@admin.com")) {
      return res.status(403).json({
        code: 403,
        status: "error",
        message: "Registration with @admin.com email is not allowed.",
      });
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { name },
        email_confirm: true,
      });

    if (authError) {
      return res
        .status(400)
        .json({ code: 400, status: "error", message: authError.message });
    }

    const { data: userData, error: errorUser } = await supabase
      .from("users")
      .insert([{ id: authData.user?.id, email, name }])
      .select()
      .single();

    if (errorUser) {
      throw new Error(errorUser.message);
    }

    return res.status(201).json({
      code: 201,
      status: "success",
      message: "User registered successfully",
      userData,
      authData,
    });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: err.message || "Internal server error",
    });
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Email and password are required",
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res
        .status(401)
        .json({ code: 401, status: "error", message: error.message });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    const session = data.session;
    if (!session) {
      throw new Error("Failed to get session");
    }

    res.cookie("sb-session", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 hari
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Login successful",
      user,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies["sb-session"];

    if (!token) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "No session found",
      });
    }

    const { error } = await supabase.auth.signOut(token);

    if (error) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: error.message,
      });
    }

    res.clearCookie("sb-session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Logout successful",
    });
  } catch (err: any) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: err.message || "Internal server error",
    });
  }
};
