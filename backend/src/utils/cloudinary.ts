import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "permin-app-images",
    allowed_formats: ["jpg", "png", "jpeg", "JPG", "avif", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  }),
});

export { cloudinary };
