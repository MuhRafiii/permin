import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { getUser } from "./controllers/user";
import { startReleaseReservationsJob } from "./jobs/book";
import { authenticate, isLogin } from "./middlewares/auth";
import { corsMiddleware } from "./middlewares/cors";
import { checkRole } from "./middlewares/role";
import authRoutes from "./routes/auth";
import booksRoutes from "./routes/book";
import borrowingRoutes from "./routes/borrowing";
import categoriesRoutes from "./routes/category";
import favoriteRoutes from "./routes/favorite";

dotenv.config();

const app = express();
startReleaseReservationsJob();
app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.get("/", isLogin, getUser);
app.get("/admin", authenticate, checkRole("admin"), getUser);
app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);
app.use("/books", booksRoutes);
app.use("/borrowings", borrowingRoutes);
app.use("/favorites", favoriteRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
