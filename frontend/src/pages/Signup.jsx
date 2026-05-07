import { useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/auth/register", { name, email, password, isAdmin }); 
      Navigate("/signin");
      toast.success("Signup successful! Please sign in.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to signup, Please check your credentials"
      );
      console.error("Error signing up: ", err);
      toast.error("Failed to signup, Please check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* header */}
        <div className="flex flex-col items-center justify-center text-black">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold m-2">Welcome to SnapCart</h2>
          <p className="mb-5 text-gray-500">Please sign up to continue</p>
        </div>

        {/* form */}
        <form
          onSubmit={handleSignup}
          className="text-black text-left w-full mx-auto max-w-md px-4"
        >
          {/* Full name */}
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 ">
              Full Name
            </label>
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter you Full name"
                required
                className=" w-full p-3 border border-gray-400 outline-none rounded-xl"
              />
            </div>
          </div>

          {/* email */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 ">
              Email address
            </label>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter you email"
                required
                className=" w-full p-3 border border-gray-400 outline-none rounded-xl"
              />
            </div>
          </div>

          {/* password */}
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 ">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full p-3 border border-gray-400 outline-none rounded-xl"
              />
            </div>
          </div>

          {/* account type */}
          <div className="mb-6">
            <label htmlFor="isAdmin" className="block mb-2">
              Account Type
            </label>
            <select
              value={isAdmin ? "admin" : "user"}
              onChange={(e) => setIsAdmin(e.target.value === "admin")}
              className="w-full p-3 px-1 border border-gray-400 outline-none rounded-xl"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* error message */}
          {error && <div className="text-red-500 m-2">{error}</div>}

          {/* button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all transform duration-300 disabled:cursor-not-allowed disabled:opacity-50 p-3 rounded-2xl font-semibold"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
