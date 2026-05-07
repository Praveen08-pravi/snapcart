import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  const { user } = useContext(AuthContext);

  // state for search and category
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      {user && (
        <Navbar
          role={user.isAdmin ? "admin" : "user"}
          user={user}
          searchTerm={setSearchTerm}
          category={setCategory}
        />
      )}{" "}
      {/* Show Navbar only if logged in */}
      <main className="flex-1">
        <Outlet context={{ searchTerm, category }} />{" "}
        {/* Render page content */}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
