import React, { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  return (
    <SearchContext.Provider
      value={{ searchTerm, setSearchTerm, category, setCategory }}
    >
      {children}
    </SearchContext.Provider>
  );
};
