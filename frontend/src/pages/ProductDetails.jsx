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

  const getCurrentCartQuantity = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = storedCart.find((item) => item._id === product?._id);
    return existingItem ? existingItem.quantity : 0;
  };

  const availableStock = product ? product.stock - getCurrentCartQuantity() : 0;

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
    if (availableStock && value > availableStock) value = availableStock;
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
            Only {availableStock} left in stock, hurry up!
          </p>

          {/* Quantity Selector (hide for admin) */}
                {!user?.isAdmin && (
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-lg font-semibold text-gray-800">
                        Quantity
                      </label>

                      <div className="flex items-center gap-3">
                        {/* Minus Button */}
                        <button
                          onClick={() =>
                            setQuantity((prev) => Math.max(1, prev - 1))
                          }
                          className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-200 hover:bg-gray-300 transition text-xl font-bold"
                        >
                          -
                        </button>

                        {/* Quantity Display */}
                        <div className="w-16 h-11 flex items-center justify-center border-2 border-gray-300 rounded-xl text-lg font-semibold bg-white">
                          {quantity}
                        </div>

                        {/* Plus Button */}
                        <button
                          onClick={() =>
                            setQuantity((prev) =>
                              Math.min(product.stock, prev + 1)
                            )
                          }
                          className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-200 hover:bg-gray-300 transition text-xl font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Stock Info */}
                      <p className="mt-2 text-sm text-gray-500">
                        Only {product.stock} left in stock
                      </p>
                    </div>

                    {/* Total Price */}
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <p className="text-lg md:text-2xl font-bold text-gray-800">
                        Total Price:
                        <span className="text-green-600 ml-2">
                          ₹{(product.price * quantity).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

          {/* Error Message */}
          {error && <div className="text-red-500">{error}</div>}

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap">
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
                  className="bg-green-500 text-white px-6 py-2 cursor-pointer rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="bg-blue-500 text-white px-6 py-2 cursor-pointer rounded hover:bg-blue-600"
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
