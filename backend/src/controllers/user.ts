import { Request, Response } from "express";
import { supabase } from "../supabase/supabaseClient";

export async function getUser(req: Request, res: Response) {
  try {
    const user = req.user;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (error) throw new Error(error.message);

    res.status(200).json({ code: 200, status: "success", data });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
      error: err,
    });
  }
}
