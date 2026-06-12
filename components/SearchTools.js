"use client";

import { useState } from "react";
import ToolCard from "./ToolCard";

export default function SearchTools({
  tools,
  allTools,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const hasFilter =
    search.trim() !== "" || category !== "";

  const filteredTools = (
    hasFilter ? allTools : tools
  ).filter((tool) => {
    const searchMatch = tool.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch =
      category === "" ||
      tool.category === category;

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
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          className="category-select"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="">
            All Categories
          </option>
          <option value="Chatbot">
            Chatbot
          </option>
          <option value="Image">
            Image
          </option>
          <option value="Video">
            Video
          </option>
          <option value="Audio">
            Audio
          </option>
          <option value="Writing">
            Writing
          </option>
          <option value="Coding">
            Coding
          </option>
          <option value="Marketing">
            Marketing
          </option>
        </select>
      </div>

      {!hasFilter && (
        <p
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#888",
          }}
        >
          Showing 8 tools. Use search or category
          filter to explore all tools.
        </p>
      )}

      <div className="tools-grid">
        {filteredTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
          />
        ))}
      </div>
    </div>
  );
}