import { Request, Response } from "express";
import { supabase } from "../supabase/supabaseClient";

export async function favorite(req: Request, res: Response) {
  try {
    const user_id = req.user?.id;
    const { book_id } = req.params;

    const { error } = await supabase
      .from("favorites")
      .insert({ user_id, book_id })
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Book added to favorites successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: err.message || "Internal server error",
    });
  }
}

export async function unfavorite(req: Request, res: Response) {
  try {
    const user_id = req.user?.id;
    const { book_id } = req.params;

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user_id)
      .eq("book_id", book_id);

    if (error) throw new Error(error.message);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Book removed from favorites successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: err.message || "Internal server error",
    });
  }
}
