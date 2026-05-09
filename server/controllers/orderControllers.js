import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/usermodel.js";
import { sendOrderConfirmationEmail, sendOrderDeliveredEmail } from "../utils/email.js";

export const addOrderItems = async (req, res) => {
  try {
    const {
      products,
      shippingAddress,
      totalPrice,
      paymentMethod,
      transactionId,
    } = req.body;

    // Validate required fields
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }
    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      return res
        .status(400)
        .json({ message: "Shipping address is incomplete" });
    }
    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ message: "Invalid total price" });
    }
    if (!paymentMethod || !transactionId) {
      return res.status(400).json({ message: "Payment method and transaction ID are required" });
    }

    // Check stock availability
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
      }
    }

    // Reduce stock
    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    const expectedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

    // Create new order
    const order = new Order({
      userId: req.user._id, // assuming you're using auth middleware to set req.user
      products,
      shippingAddress,
      totalPrice,
      paymentInfo: {
        method: paymentMethod,
        transactionId,
        paidAt: new Date(),
        amountPaid: totalPrice,
      },
      expectedDelivery,
      status: "Pending",
      orderDate: new Date(),
    });

    const createdOrder = await order.save();

    try {
      const productDetails = await Promise.all(
        products.map(async (item) => {
          const product = await Product.findById(item.productId);
          return {
            name: product?.name || "Unknown product",
            image: product?.image || "",
            description: product?.description || "",
            price: product?.price || 0,
            quantity: item.quantity,
          };
        })
      );

      await sendOrderConfirmationEmail(
        req.user.email,
        req.user.name,
        createdOrder,
        productDetails,
        expectedDelivery
      );
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({
      orderDate: -1,
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    // console.log('User orders:', orders);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the user is authorized to view this order
    if (
      order.userId.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ orderDate: -1 });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    // Validate status
    if (!["Pending", "Shipped", "Delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    // Find and update the order
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Send email if order is marked as delivered
    if (status === "Delivered") {
      try {
        const user = await User.findById(order.userId);
        
        if (user) {
          const productDetails = await Promise.all(
            order.products.map(async (item) => {
              const product = await Product.findById(item.productId);
              return {
                name: product?.name || "Unknown product",
                image: product?.image || "",
                description: product?.description || "",
                price: product?.price || 0,
                quantity: item.quantity,
              };
            })
          );

          await sendOrderDeliveredEmail(
            user.email,
            user.name,
            order,
            productDetails
          );
        }
      } catch (emailError) {
        console.error("Failed to send order delivered email:", emailError);
      }
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllRevenue = async (req, res) => {
  try {
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    if (!revenue || revenue.length === 0) {
      return res.status(404).json({ message: "No revenue found" });
    }

    res.status(200).json({ revenue: revenue[0].totalRevenue });
  } catch (error) {
    console.log("Error fetching all orders revenue: ", error);
    res
      .status(500)
      .json({ message: "Error while fetching revenue", error: error.message });
  }
};

export const getOrderStatus = async (req, res) => {
  try {
    const orderStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    if (!orderStatus || orderStatus.length === 0) {
      return res.status(404).json({ message: "No order status found" });
    }

    res.status(200).json(orderStatus);
  } catch (error) {
    console.log("Error fetching order status: ", error);
    res
      .status(500)
      .json({ message: "Error while fetching order status", error: error.message });
  }
};
