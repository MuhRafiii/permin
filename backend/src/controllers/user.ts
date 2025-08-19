import { Request, Response } from "express";

export async function getUser(req: Request, res: Response) {
  const user = req.user;
  try {
    res.status(200).json({ code: 200, status: "success", data: user });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
      error: err,
    });
  }
}
