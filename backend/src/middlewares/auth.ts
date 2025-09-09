import { NextFunction, Request, Response } from "express";
import { supabase } from "../supabase/supabaseClient";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies["sb-session"];

    if (!token) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Authentication required",
      });
    }

    // Verifikasi token dengan Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Invalid or expired session",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
      error: err,
    });
  }
};

export const isLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies["sb-session"];

    // Verifikasi token dengan Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    req.user = user;

    next();
  } catch (err) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
      error: err,
    });
  }
};
