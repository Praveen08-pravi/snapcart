// src/components/AdminUsers.jsx
import React, { useState, useEffect } from "react";
import API from "../../api";
import {
  Users,
  Search,
  Shield,
  User,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, admin, user
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/auth/users");
      console.log("Users response:", response.data);
      setUsers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateUserAdminStatus = async (userId, isAdmin) => {
    try {
      const response = await API.put(`/auth/profile`, {
        isAdmin: isAdmin,
      });

      // Update the local state
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isAdmin: isAdmin } : user
        )
      );

      console.log("User admin status updated:", response.data);
    } catch (error) {
      console.error("Failed to update user admin status:", error);
      setError("Failed to update user status. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      (filterType === "admin" && user.isAdmin) ||
      (filterType === "user" && !user.isAdmin);

    return matchesSearch && matchesFilter;
  });

  const userStats = {
    total: users.length,
    admins: users.filter((user) => user.isAdmin).length,
    regularUsers: users.filter((user) => !user.isAdmin).length,
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Refresh Users
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4">
          <Users className="text-blue-500" size={32} />
          <div>
            <p className="text-gray-500">Total Users</p>
            <h2 className="text-2xl font-bold">{userStats.total}</h2>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4">
          <Shield className="text-purple-500" size={32} />
          <div>
            <p className="text-gray-500">Administrators</p>
            <h2 className="text-2xl font-bold">{userStats.admins}</h2>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4">
          <User className="text-green-500" size={32} />
          <div>
            <p className="text-gray-500">Regular Users</p>
            <h2 className="text-2xl font-bold">{userStats.regularUsers}</h2>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Users</option>
            <option value="admin">Administrators</option>
            <option value="user">Regular Users</option>
          </select>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="space-y-4">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <div
                  key={i}
                  className="w-full h-16 bg-gray-200 animate-pulse rounded-lg"
                ></div>
              ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg">No users found</p>
            {searchTerm && (
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search or filter criteria
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Mail className="text-gray-400" size={16} />
                        <span className="text-sm text-gray-900">
                          {user.email || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {user.isAdmin ? (
                          <>
                            <Shield className="text-purple-500" size={16} />
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Administrator
                            </span>
                          </>
                        ) : (
                          <>
                            <User className="text-green-500" size={16} />
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              User
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-gray-400" size={16} />
                        <span className="text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs text-gray-400 font-mono">
                        {user._id?.slice(-8) || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {!loading && users.length > 0 && (
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={16} />
              <span>
                Showing {filteredUsers.length} of {users.length} users
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="text-purple-500" size={16} />
              <span>{userStats.admins} administrators</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="text-green-500" size={16} />
              <span>{userStats.regularUsers} regular users</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}