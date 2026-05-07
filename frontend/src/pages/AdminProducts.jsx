import React, { useEffect, useState, useRef } from "react";
import API from "../../api";
import ProductList from "../components/ProductList";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    stock: "",
  });
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (form.price <= 0) newErrors.price = "Price must be positive";
    if (form.stock < 0) newErrors.stock = "Stock cannot be negative";
    if (!form.image && !editId) newErrors.image = "Image is required";

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }
    setError(null);

    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      if (editId) {
        await API.put(`/products/${editId}`, formData);
      } else {
        await API.post("/products", formData);
      }
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
        stock: "",
      });
      setEditId(null);
      setPreviewImage(null);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: null,
      stock: product.stock,
    });
    setEditId(product._id);
    setPreviewImage(product.image);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="m-10">
      <ProductList />
    </div>
  );
}
