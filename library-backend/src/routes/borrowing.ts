import express from "express";
import {
  createBorrowing,
  getBorrowingByUserId,
  getBorrowings,
  returningBook,
} from "../controllers/borrowing";
import { authenticate } from "../middlewares/auth";
import { checkRole } from "../middlewares/role";

const router = express.Router();

router.get("/", authenticate, checkRole("admin"), getBorrowings);
router.get("/user", authenticate, checkRole("user"), getBorrowingByUserId);
router.post("/add", authenticate, checkRole("admin"), createBorrowing);
router.put("/returned", authenticate, checkRole("admin"), returningBook);

export default router;
