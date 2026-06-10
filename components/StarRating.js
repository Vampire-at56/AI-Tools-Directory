"use client";

import { useState } from "react";

export default function StarRating({ rating, setRating }) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: "flex", gap: "5px", fontSize: "24px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: "pointer",
            color: star <= (hover || rating) ? "gold" : "gray",
          }}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}