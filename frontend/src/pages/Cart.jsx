import React, { useEffect, useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item removed from cart");
  };

  const handleCheckout = async () => {
    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      setError("Please fill in all shipping details before checkout.");
      return;
    }

    const products = cartItems.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
    }));

    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    try {
      await API.post("/orders", {
        products,
        shippingAddress,
        totalPrice,
      });

      toast.success("Order placed successfully!");
      setCartItems([]);
      localStorage.removeItem("cart");
      navigate("/orders");
    } catch (err) {
      console.error("Checkout failed:", err);
      setError("Failed to place order.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-red-600">Your cart is empty</p>
      ) : (
        <>
          {/* Cart Items */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow-md rounded-xl p-4 flex flex-col"
              >
                {/* Product Image */}
                <img
                  src={item.image || "https://via.placeholder.com/200x150"}
                  alt={item.name}
                  className="w-full h-50 object-cover rounded-lg mb-4"
                />

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-gray-600">Qty: {item.quantity}</p>
                  <p className="text-blue-600 font-bold">${item.price}</p>
                </div>

                {/* Remove Button */}

                <button
                  onClick={() => handleRemove(item._id)}
                  className="mt-4 bg-red-500 text-white px-3 py-2 w-1/3  rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Shipping Address Form */}
          <div className="bg-white shadow-md p-6 rounded-2xl mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Shipping Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Street Name"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      address: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  City
                </label>
                <input
                  type="text"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      city: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      postalCode: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Country */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  placeholder="Country"
                  value={shippingAddress.country}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      country: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}

          {/* Checkout Button */}
          <div className="flex justify-center">
            <button
              onClick={handleCheckout}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
