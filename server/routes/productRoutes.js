import express from "express";
import multer from "multer";
import { admin, protect } from "../middleware/auth.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productControllers.js";

const productRoutes = express.Router();

// configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// common routes
productRoutes.get("/", getAllProducts);
productRoutes.get("/:id", getProductById);

//admin routes
productRoutes.post("/", upload.single("image"), protect, admin, createProduct);
productRoutes.put(
  "/:id",
  upload.single("image"),
  protect,
  admin,
  updateProduct
);
productRoutes.delete("/:id", protect, admin, deleteProduct);

export default productRoutes;
