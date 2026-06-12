"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!email.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email: email.trim().toLowerCase() }]);

    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        setMessage("You are already subscribed.");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
      return;
    }

    setEmail("");
    setMessage("Subscribed successfully!");
  };

  return (
    <div
      style={{
        marginTop: "70px",
        background: "var(--card)",
        padding: "40px",
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: "var(--shadow)",
        border: "1px solid var(--border)",
      }}
    >
      <h2>📧 Get Weekly AI Tool Updates</h2>

      <p
        style={{
          color: "var(--muted)",
          marginTop: "10px",
          marginBottom: "20px",
        }}
      >
        Discover new AI tools every week.
      </p>

      <form onSubmit={handleSubscribe}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            maxWidth: "400px",
            marginRight: "10px",
          }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "15px",
            color: "var(--muted)",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}