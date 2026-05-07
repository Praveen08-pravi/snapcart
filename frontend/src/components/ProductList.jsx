import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { SearchContext } from "../context/SearchContext";
import {
  Eye,
  Trash2,
  Star,
  Heart,
  ShoppingCart,
  Package,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import API from "../../api";

function ProductList({ category }) {
  const { searchTerm } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("name"); // name, price-low, price-high
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter((p) => {
      const matchCategory = category ? p.category === category : true;
      const matchSearch = searchTerm
        ? p.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await API.delete(`/products/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Please try again later.");
    }
  };

  const toggleWishlist = (product) => {
    // Placeholder for wishlist functionality
    console.log("Toggle wishlist:", product);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 m-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {category ? category : "All Products"}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"} found
            {searchTerm && (
              <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Searching: "{searchTerm}"
              </span>
            )}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(8)
            .fill("")
            .map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-3xl p-12 max-w-lg mx-auto">
            <Package className="text-gray-300 mx-auto mb-6" size={64} />
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? `No products match "${searchTerm}" in ${
                    category || "any category"
                  }`
                : `No products available in ${category || "this category"}`}
            </p>
            {searchTerm && (
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Products Grid/List */
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className={`bg-white shadow-lg rounded-2xl overflow-hidden p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group ${
                viewMode === "list" ? "flex items-center" : "flex flex-col"
              }`}
            >
              {/* Product Image */}
              <div
                className={`relative ${
                  viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "h-56"
                } bg-gray-50 overflow-hidden`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                    viewMode === "grid" ? "p-4" : "p-2"
                  }`}
                />

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Link
                      to={`/product/${product._id}`}
                      className="bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <Eye size={18} />
                    </Link>
                    {!user?.isAdmin && (
                      <>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        >
                          <Heart size={18} />
                        </button>
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Stock Badge */}
                <div className="absolute top-3 left-3">
                  {product.stock > 0 ? (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      In Stock
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Trending Badge */}
                {Math.random() > 0.7 && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp size={12} />
                      Trending
                    </span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div
                className={`p-6 flex-1 ${
                  viewMode === "list"
                    ? "flex items-center justify-between"
                    : "flex flex-col"
                }`}
              >
                <div className={viewMode === "list" ? "flex-1" : ""}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {viewMode === "grid" && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description ||
                        "Premium quality product with excellent features."}
                    </p>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < 4
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">(4.0)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-800">
                      ${product.price}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${(product.price * 1.2).toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                      17% OFF
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  className={`${
                    viewMode === "list" ? "flex gap-2" : "space-y-2"
                  }`}
                >
                  <Link
                    to={`/product/${product._id}`}
                    className={`${
                      viewMode === "list" ? "px-6 py-2" : "w-full py-3"
                    } bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2`}
                  >
                    <Eye size={16} />
                    View Details
                  </Link>

                  {user?.isAdmin && (
                    <div
                      className={`${
                        viewMode === "list" ? "flex gap-2" : "space-y-2"
                      }`}
                    >
                      <Link
                        to={`/admin/editProduct/${product._id}`}
                        className={`${
                          viewMode === "list" ? "px-4 py-2" : "w-full py-2"
                        } bg-green-500 text-white text-center font-medium rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2`}
                      >
                        <Package size={16} />
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className={`${
                          viewMode === "list" ? "px-4 py-2" : "w-full py-2"
                        } bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2`}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show results info */}
      {!loading && filteredProducts.length > 0 && (
        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
            {category && (
              <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                in {category}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default ProductList;
