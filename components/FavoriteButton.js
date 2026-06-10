"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function FavoriteButton({ toolId }) {
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, []);

  const checkFavorite = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUser(user);

    const { data } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .eq("tool_id", toolId)
      .single();

    if (data) {
      setSaved(true);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    if (saved) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("tool_id", toolId);

      setSaved(false);
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert([
          {
            user_id: user.id,
            tool_id: toolId,
          },
        ]);

      if (error) {
        alert(error.message);
        return;
      }

      setSaved(true);
    }
  };

  return (
    <button onClick={toggleFavorite}>
      {saved ? "❤️ Saved" : "🤍 Save Tool"}
    </button>
  );
}