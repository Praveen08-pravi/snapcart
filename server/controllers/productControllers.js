import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, description, category, image, stock } = req.body;
  try {
    if (!name || !price || !description || !category || stock === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let imageUrl = image;

    // if a file is uploaded via multipart, upload its buffer to Cloudinary
    if (req.file && req.file.buffer) {
      const uploaded = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      imageUrl = uploaded.secure_url;
    }

    // if no file but a base64 or remote URL string is provided, optionally upload base64
    if (!imageUrl && image) {
      // If the client passed a base64 data URI, Cloudinary can accept it directly
      const uploaded = await cloudinary.uploader.upload(image, { folder: "products" });
      imageUrl = uploaded.secure_url;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "Image file or URL is required" });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      image: imageUrl,
      stock,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category, image, stock } = req.body;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (category) product.category = category;
    if (req.file && req.file.buffer) {
      const uploaded = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      product.image = uploaded.secure_url;
    } else if (image) {
      // If provided an image string, allow updating to it. If it's base64, upload it
      if (typeof image === "string" && image.startsWith("data:")) {
        const uploaded = await cloudinary.uploader.upload(image, { folder: "products" });
        product.image = uploaded.secure_url;
      } else {
        product.image = image;
      }
    }
    if (stock !== undefined) product.stock = stock;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id); 
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};