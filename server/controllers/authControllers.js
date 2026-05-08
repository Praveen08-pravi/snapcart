import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

export const register = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  if (isAdmin === undefined || isAdmin === null) {
    isAdmin = false; // Default to false if not provided
  }
  const user = await User.create({ name, email, password: hashed, isAdmin });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Check if new email is already taken by another user
  if (req.body.email && req.body.email !== user.email) {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }
    user.email = req.body.email;
  }

  user.name = req.body.name || user.name;

  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }

  user.isAdmin =
    req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin; // Preserve existing isAdmin if not provided
  console.log("isAdmin:", user.isAdmin);

  const updatedUser = await user.save();
  // Yes, it's needed to update the token if user info (like _id) is used in the token payload.
  // This ensures the client has a fresh token after profile changes.
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    token: generateToken(updatedUser._id),
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
