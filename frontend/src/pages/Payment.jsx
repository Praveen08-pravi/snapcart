import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api";
import { useLoading } from "../context/LoadingContext";
import qrImage from "../assets/qr.png";

const generateTransactionId = () => {
  return `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString().slice(-5)}`;
};

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [transactionId] = useState(generateTransactionId());
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);

  const orderData = useMemo(() => {
    if (location.state) return location.state;
    const pending = localStorage.getItem("pendingOrder");
    return pending ? JSON.parse(pending) : null;
  }, [location.state]);

  useEffect(() => {
    if (!orderData) {
      navigate("/cart");
    }
  }, [orderData, navigate]);

  const expectedDelivery = useMemo(() => {
    if (!orderData) return "";
    const date = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [orderData]);

  const handlePay = async () => {
    if (!orderData) return;
    setError("");
    showLoading("Processing your payment...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      await API.post("/orders", {
        products: orderData.cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: orderData.shippingAddress,
        totalPrice: orderData.totalPrice,
        paymentMethod: paymentMethod === "upi" ? "UPI" : "Card",
        transactionId,
      });

      setPaid(true);
      localStorage.removeItem("cart");
      localStorage.removeItem("pendingOrder");
      toast.success("Payment successful! Order completed.");
      navigate("/myOrders");
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err.response?.data?.message ||
          "Payment failed. Please try again or check your cart."
      );
      setPaid(false);
    } finally {
      hideLoading();
    }
  };

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Payment</h1>
            <p className="text-sm text-slate-500 mt-1">
              Complete your order with a dummy payment. Your order will be confirmed after payment.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-700">
            Transaction ID: <span className="font-semibold">{transactionId}</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 p-6 bg-slate-50">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-slate-900">Order summary</h2>
                <p className="text-sm text-slate-500">
                  Total products: {orderData.cartItems.length}
                </p>
              </div>

              <div className="space-y-4">
                {orderData.cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">₹{orderData.totalPrice.toFixed(2)}</p>
                      <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 p-6 bg-slate-50">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Payment method</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { value: "card", label: "Credit / Debit Card" },
                  { value: "upi", label: "UPI" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPaymentMethod(option.value)}
                    className={`rounded-3xl border px-4 py-4 text-left transition ${
                      paymentMethod === option.value
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{option.label}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Pay securely using {option.label === "UPI" ? "your UPI ID" : "a test card"}.
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-3xl bg-white p-5 border border-slate-200">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Amount</span>
                  <span className="font-semibold text-slate-900">₹{orderData.totalPrice.toFixed(2)}</span>
                </div>
                <div className="mt-4 text-sm text-slate-500">
                  Expected delivery by <strong>{expectedDelivery}</strong>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
                      <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-xl">
                          <div className="flex items-center justify-between mb-5">
                              <div>
                                  <h2 className="text-2xl font-bold">Scan & Pay</h2>
                              </div>

                              <div className="rounded-2xl bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                                  UPI
                              </div>
                          </div>

                          <div className="rounded-3xl bg-white p-5 flex items-center justify-center shadow-inner">
                              <img
                                  src={qrImage}
                                  alt="UPI QR"
                                  className="h-48 w-48 sm:h-64 sm:w-64 rounded-2xl object-contain"
                              />
                          </div>
                      </div>

            <div className="rounded-3xl border border-slate-200 p-6 bg-white shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-slate-500">Transaction</span>
                <span className="text-slate-900 font-semibold">{transactionId}</span>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Payment via</span>
                  <span>{paymentMethod === "upi" ? "UPI" : "Card"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order total</span>
                  <span>₹{orderData.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected delivery</span>
                  <span>{expectedDelivery}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePay}
              className="w-full rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white text-lg font-semibold shadow-xl transition hover:from-blue-700 hover:to-indigo-700"
            >
              Pay now
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {paid && !loading && (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                <p className="font-semibold">Payment successful!</p>
                <p className="text-sm">Your order is complete. Redirecting to My Orders…</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
