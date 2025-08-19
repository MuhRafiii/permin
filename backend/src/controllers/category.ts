import { Request, Response } from "express";
import { supabase } from "../supabase/supabaseClient";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) throw new Error(error.message);
    res.status(200).json({
      code: 200,
      status: "success",
      message: "Categories fetched successfully",
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

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name)
      return res
        .status(400)
        .json({ code: 400, status: "error", message: "Name is required" });

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    res.status(201).json({
      code: 201,
      status: "success",
      message: "Category created successfully",
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

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const { data, error } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    res.status(200).json({
      code: 200,
      status: "success",
      message: "Category updated successfully",
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

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
    res.status(200).json({
      code: 200,
      status: "success",
      message: "Category deleted",
    });
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: err.message || "Internal server error",
    });
  }
};
