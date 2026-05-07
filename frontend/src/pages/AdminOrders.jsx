import React, { useEffect, useState } from "react";
import API from "../../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setError("");
    try {
      const res = await API.get("/orders/");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id, status) => {
    try {
      await API.put(`/orders/status`, { orderId: id, status });
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl p-6 shadow-md hover:shadow-lg transition bg-gray-50"
            >
              {/* Order Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Order #{order._id}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Customer */}
              <p className="mb-2 text-sm text-gray-600">
                <strong>Customer:</strong> {order.userId || "Guest User"}
              </p>

              {/* Products */}
              {/* <p className="font-medium mb-2">Products</p>
              <div className="mb-5 space-y-3">
                {order.orderItems?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-white p-3 rounded-md shadow-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.product}</p>
                      <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div> */}

              {/* Footer */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-gray-600 gap-3">
                <p>
                  <strong>Total:</strong> ₹{order.totalPrice}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>

                {/* Status Update Dropdown */}
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
