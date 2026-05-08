import express from "express";
import { admin, protect } from "../middleware/auth.js";
import {
  addOrderItems,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllRevenue,
  getOrderStatus,
} from "../controllers/orderControllers.js";

const orderRoutes = express.Router();

// user routes
orderRoutes.post("/", protect, addOrderItems);
orderRoutes.get("/myorders", protect, getMyOrders);

// admin routes
orderRoutes.put("/status", protect, admin, updateOrderStatus);
orderRoutes.get("/revenue", protect, admin, getAllRevenue);
orderRoutes.get("/status", protect, admin, getOrderStatus);
orderRoutes.get("/", protect, admin, getAllOrders);

orderRoutes.get("/:id", protect, getOrderById);
export default orderRoutes;
