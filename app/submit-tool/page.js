"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function SubmitToolPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [category, setCategory] =
    useState("");
  const [websiteUrl, setWebsiteUrl] =
    useState("");
  const [logoUrl, setLogoUrl] =
    useState("");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    setLoading(false);
  };

  const submitTool = async (e) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

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

  if (loading) {
    return <h2>Loading...</h2>;
  }

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

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        />

        <input
          placeholder="Website URL"
          value={websiteUrl}
          onChange={(e) =>
            setWebsiteUrl(e.target.value)
          }
        />

        <input
          placeholder="Logo URL"
          value={logoUrl}
          onChange={(e) =>
            setLogoUrl(e.target.value)
          }
        />

        <button type="submit">
          Submit Tool
        </button>
      </form>
    </div>
  );
}