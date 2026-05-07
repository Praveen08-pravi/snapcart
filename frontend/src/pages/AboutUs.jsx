import React from "react";
import { ShoppingBag, Users, ShieldCheck, Truck } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            About SnapCart
          </h1>
          <p className="text-gray-600 text-lg">
            Your trusted MERN Stack E-Commerce platform delivering quality
            products with a seamless shopping experience.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-7">
            At SnapCart, we aim to simplify online shopping through modern
            technology and user-friendly design. Our platform provides secure
            authentication, smooth product browsing, efficient order management,
            and fast delivery support for customers worldwide.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <ShoppingBag className="mx-auto text-blue-600 mb-4" size={40} />
            <h3 className="font-semibold text-lg mb-2">Quality Products</h3>
            <p className="text-gray-600 text-sm">
              Explore a wide collection of high-quality products with detailed
              descriptions and images.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <Users className="mx-auto text-green-600 mb-4" size={40} />
            <h3 className="font-semibold text-lg mb-2">Customer Focused</h3>
            <p className="text-gray-600 text-sm">
              We prioritize customer satisfaction with responsive support and
              seamless shopping experiences.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <ShieldCheck className="mx-auto text-purple-600 mb-4" size={40} />
            <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
            <p className="text-gray-600 text-sm">
              Advanced authentication and secure transactions protect your data
              and purchases.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <Truck className="mx-auto text-red-600 mb-4" size={40} />
            <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-sm">
              Reliable order management ensures timely delivery and smooth
              tracking.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Technologies Used
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-xl mb-3 text-blue-600">
                Frontend
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>React.js 19</li>
                <li>Vite</li>
                <li>React Router DOM</li>
                <li>Tailwind CSS</li>
                <li>Axios</li>
                <li>Recharts</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-3 text-green-600">
                Backend
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>Node.js</li>
                <li>Express.js</li>
                <li>MongoDB</li>
                <li>Mongoose</li>
                <li>JWT Authentication</li>
                <li>Cloudinary</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;