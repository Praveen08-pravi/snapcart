import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

function SignIn() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const userData = { email: email.trim(), password: password.trim() };

    try {
      const res = await API.post(`/auth/login`, userData);
      login(res.data); //save user in context
      localStorage.setItem("token", res.data.token); // Store the token in local storage
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          isAdmin: res.data.isAdmin,
        })
      ); // Store user data in local storage
      if (res.data.isAdmin) {
        navigate("/admin"); // Redirect to admin dashboard if user is admin
      } else {
        navigate("/"); // Redirect to dashboard after successful sign-in
      }
      toast.success("Signed in successfully");
      console.log("User signed in successfully:", res.data);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to sign in. Please check your credentials."
      );
      toast.error("Failed to sign in. Please check your credentials.");
      console.error("Error signing in:", err);
    } finally {
      setIsLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
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
        <p className="mb-5 text-gray-500">Please sign in to continue</p>
      </div>

      {/* form */}
      <form
        onSubmit={handleSignIn}
        className="text-black text-left w-full mx-auto max-w-md px-4"
      >
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
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full p-3 border border-gray-400 outline-none rounded-xl"
            />
            {/* <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5 text-gray-400 hover:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-gray-400 hover:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button> */}
          </div>
        </div>

        {/* error message */}
        {error && <div className="text-red-500 m-2">{error}</div>}

        {/* button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all transform duration-300 disabled:cursor-not-allowed disabled:opacity-50 p-3 rounded-2xl font-semibold"
        >
          Sign In
        </button>
      </form>

      {/* sign up link */}
      <div className="flex justify-center items-center mt-4">
        <p className="text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
