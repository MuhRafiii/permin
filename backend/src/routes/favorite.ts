import express from "express";
import { favorite, unfavorite } from "../controllers/favorite";
import { authenticate } from "../middlewares/auth";
import { checkRole } from "../middlewares/role";

const router = express.Router();

router.post("/:book_id", authenticate, checkRole("user"), favorite);
router.delete(
  "/unfavorite/:book_id",
  authenticate,
  checkRole("user"),
  unfavorite
);

export default router;
