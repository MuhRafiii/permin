import { Request, Response } from "express";
import { supabase } from "../supabase/supabaseClient";

export const getBorrowings = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("borrowings")
      .select("*, users(email, name), books(title, image, categories(name))");

    if (error) throw new Error(error.message);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Borrowings fetched successfully",
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: err.message || "Internal server error",
    });
  }
};

export const getBorrowingByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { data, error } = await supabase
      .from("borrowings")
      .select("*, books(id, title, image, categories(name), author, publisher)")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    res.status(200).json({
      code: 200,
      status: "success",
      message: "Borrowings fetched successfully",
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: err.message || "Internal server error",
    });
  }
};

export const createBorrowing = async (req: Request, res: Response) => {
  try {
    const { user_id, book_id } = req.body;
    const { data, error } = await supabase
      .from("borrowings")
      .insert({ user_id, book_id })
      .select();
    if (error) throw new Error(error.message);
    res.status(201).json({
      code: 201,
      status: "success",
      message: "Borrowing created successfully",
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: err.message || "Internal server error",
    });
  }
};

export const returningBook = async (req: Request, res: Response) => {
  try {
    const { user_id, book_id } = req.body;
    const { data, error } = await supabase
      .from("borrowings")
      .update({ status: "returned", returned_at: new Date() })
      .eq("user_id", user_id)
      .eq("book_id", book_id)
      .is("returned_at", null)
      .select()
      .single();

    if (error) throw new Error(error.message);

    const { error: bookErr } = await supabase
      .from("books")
      .update({ status: "available", borrowed_by: null, borrowed_at: null })
      .eq("id", book_id);

    if (bookErr) throw new Error(bookErr.message);

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Borrowing returned successfully",
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: err.message || "Internal server error",
    });
  }
};
