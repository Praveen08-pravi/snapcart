import { useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("register"); // 'register' or 'verify'
  const Navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { showLoading, hideLoading } = useLoading();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    showLoading("Creating your account...");

    try {
      await API.post("/auth/register", { name, email, password, isAdmin });
      setStep("verify");
      toast.success("OTP sent to your email. Please verify.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to signup, Please check your credentials"
      );
      console.error("Error signing up: ", err);
      toast.error("Failed to signup, Please check your credentials");
    } finally {
      hideLoading();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    showLoading("Verifying your OTP...");

    try {
      const res = await API.post("/auth/verify-otp", { email, otp });
      login(res.data); // This will set user and token in context and localStorage
      Navigate("/");
      toast.success("Account created successfully! Welcome to SnapCart.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to verify OTP"
      );
      console.error("Error verifying OTP: ", err);
      toast.error("Failed to verify OTP");
    } finally {
      hideLoading();
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
          <h2 className="text-4xl font-bold m-2">
            {step === "register" ? "Welcome to SnapCart" : "Verify Your Email"}
          </h2>
          <p className="mb-5 text-gray-500">
            {step === "register"
              ? "Please sign up to continue"
              : "Enter the OTP sent to your email"}
          </p>
        </div>

        {/* form */}
        <form
          onSubmit={step === "register" ? handleSignup : handleVerifyOTP}
          className="text-black text-left w-full mx-auto max-w-md px-4"
        >
          {step === "register" ? (
            <>
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
            </>
          ) : (
            <>
              {/* OTP */}
              <div className="mb-6">
                <label htmlFor="otp" className="block mb-2 ">
                  Enter OTP
                </label>
                <div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the 6-digit OTP"
                    required
                    className=" w-full p-3 border border-gray-400 outline-none rounded-xl"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  OTP sent to {email}. Check your email.
                </p>
              </div>
            </>
          )}

          {/* error message */}
          {error && <div className="text-red-500 m-2">{error}</div>}

          {/* button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all transform duration-300 p-3 rounded-2xl font-semibold"
          >
            {step === "register" ? "Sign Up" : "Verify OTP"}
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
