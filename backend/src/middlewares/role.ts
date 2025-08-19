import type { NextFunction, Request, Response } from "express";
import { supabase } from "../supabase/supabaseClient";

export function checkRole(role: "admin" | "user") {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error || !data || data.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
}
