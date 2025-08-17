import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category";
import { authenticate } from "../middlewares/auth";
import { checkRole } from "../middlewares/role";

const router = express.Router();

router.get("/", getCategories);
router.post("/add", authenticate, checkRole("admin"), createCategory);
router.put("/edit/:id", authenticate, checkRole("admin"), updateCategory);
router.delete("/delete/:id", authenticate, checkRole("admin"), deleteCategory);

export default router;
