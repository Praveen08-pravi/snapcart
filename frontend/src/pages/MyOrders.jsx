import React, { useEffect, useState } from "react";
import API from "../../api";

const OrderProgressBar = ({ status }) => {
  const statusSteps = ["Pending", "Shipped", "Delivered"];
  const currentIndex = statusSteps.indexOf(status);

  return (
    <div className="my-4">
      <div className="flex justify-between items-center mb-2">
        {statusSteps.map((step, index) => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mb-2 ${
                index <= currentIndex
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }`}
            >
              {index < currentIndex ? "✓" : index + 1}
            </div>
            <span className="text-xs font-medium text-gray-700">{step}</span>
          </div>
        ))}
      </div>
      <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
        {statusSteps.map((step, index) => (
          <div
            key={step}
            className={`flex-1 ${
              index < currentIndex
                ? "bg-blue-500"
                : index === currentIndex
                ? "bg-blue-500"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/orders/myOrders");
        const ordersData = res.data;

        // Fetch product details for each product in each order
        const updatedOrders = await Promise.all(
          ordersData.map(async (order) => {
            const detailedProducts = await Promise.all(
              order.products.map(async (prod) => {
                try {
                  const prodRes = await API.get(`/products/${prod.productId}`);
                  return {
                    ...prodRes.data, // full product details (name, price, image)
                    quantity: prod.quantity, // keep the order's quantity
                  };
                } catch (err) {
                  console.error("Error fetching product:", err);
                  return { productId: prod.productId, quantity: prod.quantity }; // fallback
                }
              })
            );

            return { ...order, products: detailedProducts };
          })
        );

        setOrders(updatedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading)
    return <p className="text-center py-8">Loading your orders...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (orders.length === 0)
    return <p className="text-center py-8">You have no orders yet.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-6 shadow-2xl">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-xl p-6 hover:shadow-lg transition bg-gray-300"
          >
            {/* Order Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-600">
                Order #{order._id}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "Shipped"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Progress Bar */}
            <OrderProgressBar status={order.status} />

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="mb-4 text-sm text-gray-600">
                <p className="font-bold">Shipping Address:</p>
                <p>
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.country} -{" "}
                  {order.shippingAddress.postalCode}
                </p>
              </div>
            )}

            <p className="font-medium mb-2">Product Details</p>
            <div className="mb-5">
              {order.products?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 last:border-none"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-28 h-25 object-cover rounded-md"
                    />
                  )}
                  {/* product name */}
                  <div className="flex-1 m-1">
                    <p className="font-medium">{item.name}</p>
                    
                    <p className="font-medium">
                      ₹{(Number(item.price) || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex-0.5 m-10">
                  <p className="font-medium">
                      Qty: {item.quantity}
                  </p>
                  <p>
                    <strong>Total: </strong>₹{order.totalPrice.toFixed(2)}
                  </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="mt-4 flex flex-col md:flex-row justify-between text-sm text-gray-600">
              <p>
                <strong>Ordered on: </strong>
                {new Date(order.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
