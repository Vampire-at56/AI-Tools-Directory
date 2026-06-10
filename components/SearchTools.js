"use client";

import { useState } from "react";
import ToolCard from "./ToolCard";

export default function SearchTools({ tools }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filteredTools = tools.filter((tool) => {
    const searchMatch = tool.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch =
      category === "" || tool.category === category;

    return searchMatch && categoryMatch;
  });

  return (
    <div className="search-section">
      <div className="search-filter-row">
        <input
          className="search-box"
          type="text"
          placeholder="Search AI Tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Chatbot">Chatbot</option>
          <option value="Image">Image</option>
          <option value="Video">Video</option>
          <option value="Writing">Writing</option>
          <option value="Coding">Coding</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      <div className="tools-grid">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}