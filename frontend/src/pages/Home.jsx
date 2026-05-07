import React, { useState, useRef } from "react";
import ProductList from "../components/ProductList";
import {
  Menu,
  ChevronDown,
  Star,
  Shield,
  Truck,
  Headphones,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const productsRef = useRef(null);
  const navigate = useNavigate();
  const categories = [
    { name: "Electronics", icon: "💻", color: "from-blue-500 to-blue-600" },
    { name: "Fashion", icon: "👔", color: "from-pink-500 to-rose-600" },
    { name: "Home", icon: "🏠", color: "from-green-500 to-green-600" },
    { name: "Books", icon: "📚", color: "from-purple-500 to-purple-600" },
  ];

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setShowMenu(false);
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    { icon: Shield, title: "Secure Payment", desc: "100% secure transactions" },
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "Free shipping on orders over $50",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "Round-the-clock customer service",
    },
    {
      icon: Star,
      title: "Quality Products",
      desc: "Curated selection of premium items",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Discover
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {" "}
                Amazing{" "}
              </span>
              Products
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Shop the latest trends and discover premium quality products at
              unbeatable prices
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() =>
                productsRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <span className="flex items-center gap-2">
                Shop Now
                <ChevronDown
                  className="group-hover:translate-y-1 transition-transform"
                  size={20}
                />
              </span>
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              Track Orders
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the best shopping experience
              possible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                  <feature.icon className="text-blue-600" size={28} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Shop by Category
              </h2>
              <p className="text-gray-600">
                Find exactly what you're looking for
              </p>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden bg-white shadow-lg p-3 rounded-xl hover:shadow-xl transition-shadow"
              onClick={() => setShowMenu(!showMenu)}
            >
              <Menu size={24} className="text-gray-700" />
            </button>
          </div>

          {/* Desktop Categories Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className={`group relative overflow-hidden bg-gradient-to-br ${
                  cat.color
                } rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === cat.name
                    ? "ring-4 ring-white ring-opacity-50 scale-105"
                    : ""
                }`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="relative z-10 text-center">
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{cat.name}</h3>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ))}
          </div>

          {/* Mobile Categories Dropdown */}
          {showMenu && (
            <div className="md:hidden bg-white rounded-2xl shadow-2xl overflow-hidden">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`w-full flex items-center gap-4 p-4 text-left transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedCategory === cat.name
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="font-medium">{cat.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Clear Filter Button */}
          {selectedCategory && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setSelectedCategory("")}
                className="bg-white text-gray-700 px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-gray-50"
              >
                Clear Filter • Show All Products
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section ref={productsRef} className="py-16 bg-white" id="products">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {selectedCategory
                ? `${selectedCategory} Products`
                : "All Products"}
            </h2>
            <p className="text-gray-600">
              {selectedCategory
                ? `Discover our curated ${selectedCategory.toLowerCase()} collection`
                : "Browse our entire collection of premium products"}
            </p>
          </div>

          <ProductList category={selectedCategory} />
        </div>
      </section>
    </div>
  );
}

export default Home;
