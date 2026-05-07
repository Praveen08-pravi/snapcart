import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // get current user
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to load product", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    let value = Number(e.target.value);
    if (value < 1) value = 1;
    if (product?.stock && value > product.stock) value = product.stock;
    setQuantity(value);
  };

  const addToCart = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = storedCart.find((item) => item._id === product._id);

    let updatedCart;
    if (existingItem) {
      updatedCart = storedCart.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: Math.min(item.quantity + quantity, product.stock),
            }
          : item
      );
    } else {
      updatedCart = [...storedCart, { ...product, quantity }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item added to cart");
    setError("");
    navigate("/cart");
  };

  const handleEdit = () => {
    navigate(`/admin/editProduct/${product._id}`);
  };

  return loading ? (
    <p className="text-center py-6">Loading product...</p>
  ) : error ? (
    <p className="text-center py-6 text-red-500">{error}</p>
  ) : !product ? (
    <p className="text-center py-6">Product not found</p>
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold">₹{product.price}</p>
          <p className="text-gray-700">{product.description}</p>
          <p className="text-sm text-gray-500">
            Only {product.stock} left, hurry up!
          </p>

          {/* Quantity Selector (hide for admin) */}
          {!user?.isAdmin && (
            <div>
              <label className="block mb-1 font-medium">Quantity:</label>
              <input
                type="number"
                value={quantity}
                min={1}
                max={product.stock}
                onChange={handleQuantityChange}
                className="border rounded px-3 py-2 w-24"
              />
            </div>
          )}

          {/* Error Message */}
          {error && <div className="text-red-500">{error}</div>}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {user?.isAdmin ? (
              // Admin Controls
              <button
                onClick={handleEdit}
                className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
              >
                Edit Product
              </button>
            ) : (
              <>
                <button
                  onClick={addToCart}
                  disabled={loading || product.stock < 1}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  Go to Cart
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
