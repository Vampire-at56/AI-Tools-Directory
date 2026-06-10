"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SubmitToolPage() {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [category, setCategory] =
    useState("");
  const [websiteUrl, setWebsiteUrl] =
    useState("");
  const [logoUrl, setLogoUrl] =
    useState("");

  const submitTool = async (e) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      return;
    }

    const { error } = await supabase
      .from("tool_submissions")
      .insert([
        {
          user_id: user.id,
          name,
          description,
          category,
          website_url: websiteUrl,
          logo_url: logoUrl,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Tool submitted successfully. Waiting for admin approval."
    );

    setName("");
    setDescription("");
    setCategory("");
    setWebsiteUrl("");
    setLogoUrl("");
  };

  return (
    <div className="container">
      <h1>Submit AI Tool</h1>

      <form onSubmit={submitTool}>
        <input
          placeholder="Tool Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <br /><br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <br /><br />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        />

        <br /><br />

        <input
          placeholder="Website URL"
          value={websiteUrl}
          onChange={(e) =>
            setWebsiteUrl(e.target.value)
          }
        />

        <br /><br />

        <input
          placeholder="Logo URL"
          value={logoUrl}
          onChange={(e) =>
            setLogoUrl(e.target.value)
          }
        />

        <br /><br />

        <button type="submit">
          Submit Tool
        </button>
      </form>
    </div>
  );
}