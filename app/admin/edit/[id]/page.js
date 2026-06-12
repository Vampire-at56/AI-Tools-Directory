"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function EditPage({ params }) {
  const { id } = use(params);

  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");

  useEffect(() => {
    const fetchTool = async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert(error.message);
        return;
      }

      if (data) {
        setName(data.name || "");
        setDescription(data.description || "");
        setCategory(data.category || "");
        setWebsiteUrl(data.website_url || "");
        setAffiliateUrl(data.affiliate_url || "");
      }
    };

    fetchTool();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("tools")
      .update({
        name,
        description,
        category,
        website_url: websiteUrl,
        affiliate_url: affiliateUrl,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Tool Updated Successfully!");
    router.push("/admin");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Tool</h1>

      <form onSubmit={handleUpdate}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tool Name"
        />

        <br />
        <br />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <br />
        <br />

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />

        <br />
        <br />

        <input
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="Website URL"
        />

        <br />
        <br />

        <input
          value={affiliateUrl}
          onChange={(e) => setAffiliateUrl(e.target.value)}
          placeholder="Affiliate URL optional"
        />

        <br />
        <br />

        <button type="submit">Update Tool</button>
      </form>
    </div>
  );
}