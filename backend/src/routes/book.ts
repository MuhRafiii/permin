import express from "express";
import {
  approveBorrowing,
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  reserveBook,
  updateBook,
} from "../controllers/book";
import { authenticate, isLogin } from "../middlewares/auth";
import { checkRole } from "../middlewares/role";
import { upload } from "../utils/multer";

const router = express.Router();

router.get("/", isLogin, getBooks);
router.get("/admin", authenticate, checkRole("admin"), getBooks);
router.get("/:id", isLogin, getBookById);
router.post(
  "/add",
  authenticate,
  checkRole("admin"),
  upload.single("image"),
  createBook
);
router.put(
  "/edit/:id",
  authenticate,
  checkRole("admin"),
  upload.single("image"),
  updateBook
);
router.delete("/delete/:id", authenticate, checkRole("admin"), deleteBook);
router.put("/reserve/:id", authenticate, checkRole("user"), reserveBook);
router.put("/approve/:id", authenticate, checkRole("admin"), approveBorrowing);

export default router;
