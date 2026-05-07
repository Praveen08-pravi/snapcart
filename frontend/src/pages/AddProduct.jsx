import React, { useState, useRef } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    stock: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm({ ...form, image: file });
      setPreviewImage(file ? URL.createObjectURL(file) : null);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (form.price <= 0) newErrors.price = "Price must be positive";
    if (form.stock < 0) newErrors.stock = "Stock cannot be negative";
    if (!form.image) newErrors.image = "Image is required";

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setError(null);
    setLoading(true); // Start loading

    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      await API.post("/products", formData);

      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
        stock: "",
      });
      setPreviewImage(null);
      toast.success("Product added successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error("Error saving product:", err);
      toast.error("Failed to add product");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex justify-center items-center px-4 py-10">
      <form
        onSubmit={addProduct}
        className="bg-white shadow-lg rounded-2xl p-6 md:p-10 w-full max-w-3xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Add New Product
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="Enter product name"
              required
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              id="category"
              value={form.category}
              onChange={handleFormChange}
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home</option>
              <option value="Books">Books</option>
            </select>
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Price</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleFormChange}
              placeholder="Enter price"
              required
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error?.price && (
              <span className="text-red-500 text-sm mt-1">{error.price}</span>
            )}
          </div>

          {/* Stock */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Stock</label>
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleFormChange}
              placeholder="Available stock"
              required
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error?.stock && (
              <span className="text-red-500 text-sm mt-1">{error.stock}</span>
            )}
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2 flex flex-col">
            <label className="font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFormChange}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Choose Image
              </button>
              <span className="text-gray-600">
                {form.image ? form.image.name : "No file chosen"}
              </span>
            </div>
            {error?.image && (
              <span className="text-red-500 text-sm mt-1">{error.image}</span>
            )}

            {previewImage && (
              <div className="mt-4 flex justify-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2 flex flex-col">
            <label className="font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              placeholder="Enter product description"
              required
              rows={4}
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 bg-green-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-green-700 transition flex justify-center items-center ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
