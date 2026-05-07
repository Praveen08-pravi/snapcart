// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import API from "../../api";
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  PlusCircle,
  Edit,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  const getOrderStatusData = async () => {
    try {
      const res = await API.get("/orders/status");
      console.log(res);
      const chartData = res.data.map((status) => ({
        name: status._id,
        value: status.count,
      }));
      setOrderStatusData(chartData);
    } catch (error) {
      console.log("Failed to fetch order status:", error);
    }
  };

  const getRevenue = async () => {
    try {
      const res = await API.get("/orders/revenue");
      console.log(res);
      setRevenue(res.data.revenue);
    } catch (error) {
      console.log("Failed to fetch revenue:", error);
    }
  };

  const COLORS = ["#ef4444", "#3b82f6", "#22c55e"]; // red, blue, green

  const getTotals = async () => {
    try {
      // Fetch all orders
      const ordersRes = await API.get("/orders");
      const orders = ordersRes.data || [];
      setTotalOrders(orders.length);

      // Get recent orders (latest 5) and format them properly
      const recentOrdersFormatted = orders.slice(0, 5).map((order) => ({
        id: order._id,
        customer: order.userId,
        total: order.totalPrice,
        status: order.status,
      }));
      setRecentOrders(recentOrdersFormatted);

      // Fetch products count
      const productsRes = await API.get("/products");
      const products = productsRes.data || [];
      setTotalProducts(products.length);

      // Fetch users count
      const usersRes = await API.get("/auth/users");
      const users = usersRes.data || [];
      setTotalUsers(users.length);
    } catch (error) {
      console.error("Failed to fetch totals:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getRevenue(), getOrderStatusData(), getTotals()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage your e-commerce platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Products */}
          <Link to="/admin/products" className="group">
            <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Products</p>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {totalProducts}
                  </h2>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Package className="text-blue-500" size={28} />
                </div>
              </div>
            </div>
          </Link>

          {/* Orders */}
          <Link to="/admin/orders" className="group">
            <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Orders</p>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {totalOrders}
                  </h2>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <ShoppingBag className="text-green-500" size={28} />
                </div>
              </div>
            </div>
          </Link>

          {/* Users */}
          <Link to="/admin/users" className="group">
            <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Users</p>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {totalUsers}
                  </h2>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="text-purple-500" size={28} />
                </div>
              </div>
            </div>
          </Link>

          {/* Revenue */}
          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <h2 className="text-3xl font-bold text-gray-800">${revenue}</h2>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <DollarSign className="text-yellow-500" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid - 3 Columns for Better Balance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Status Chart */}
          <div className="lg:col-span-1 bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Order Status
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1 bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Quick Actions
            </h2>
            <div className="space-y-4">
              <Link
                to="/admin/addProduct"
                className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <PlusCircle size={24} />
                <span className="font-medium">Add New Product</span>
              </Link>

              <Link
                to="/admin/orders"
                className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <Edit size={24} />
                <span className="font-medium">Manage Orders</span>
              </Link>

              <Link
                to="/admin/users"
                className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <Users size={24} />
                <span className="font-medium">Manage Users</span>
              </Link>

              <Link
                to="/admin/products"
                className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <Package size={24} />
                <span className="font-medium">View All Products</span>
              </Link>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-1 bg-white shadow-lg rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Recent Orders
              </h2>
              <Link
                to="/admin/orders"
                className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                View All →
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <ShoppingBag className="text-gray-400 w-8 h-8" />
                </div>
                <p className="text-gray-500 font-medium">No recent orders</p>
                <p className="text-gray-400 text-sm mt-1">
                  Orders will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentOrders.map((order, index) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                          #{String(index + 1).padStart(2, "0")}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {order.id.slice(-8)}
                        </span>
                      </div>

                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status === "Pending" && (
                          <AlertCircle size={10} />
                        )}
                        {order.status === "Shipped" && <Package size={10} />}
                        {order.status === "Delivered" && (
                          <CheckCircle size={10} />
                        )}
                        {order.status}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Customer: {order.customer.slice(-6)}</span>
                      <span className="font-bold text-gray-800">
                        ${order.total}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full transition-all duration-300 ${
                            order.status === "Pending"
                              ? "bg-yellow-500 w-1/3"
                              : order.status === "Shipped"
                              ? "bg-blue-500 w-2/3"
                              : "bg-green-500 w-full"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section - Full Width Recent Activity */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              System Overview
            </h2>
            <div className="flex gap-2">
              <span className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Revenue Breakdown */}
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="text-white" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Revenue Growth
              </h3>
              <p className="text-2xl font-bold text-green-600">${revenue}</p>
              <p className="text-xs text-gray-600">Total earnings</p>
            </div>

            {/* Order Summary */}
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="text-white" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Order Management
              </h3>
              <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
              <p className="text-xs text-gray-600">Total orders placed</p>
            </div>

            {/* User Engagement */}
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">User Base</h3>
              <p className="text-2xl font-bold text-purple-600">{totalUsers}</p>
              <p className="text-xs text-gray-600">Registered users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
