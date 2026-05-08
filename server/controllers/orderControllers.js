import Order from "../models/orderModel.js";

export const addOrderItems = async (req, res) => {
  try {
    const { products, shippingAddress, totalPrice } = req.body;

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

    // Create new order
    const order = new Order({
      userId: req.user._id, // assuming you're using auth middleware to set req.user
      products,
      shippingAddress,
      totalPrice,
      status: "Pending",
      orderDate: new Date(),
    });

    if (!order){
      console.log("Cannot create Order")
    }

    const createdOrder = await order.save();

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
