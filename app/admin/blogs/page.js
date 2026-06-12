"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminBlogsPage() {
  const router = useRouter();

  const [blogs, setBlogs] = useState([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const createSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const fetchBlogs = async () => {
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    setBlogs(data || []);
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");

    if (!isAdmin) {
      router.push("/admin/login");
      return;
    }

    fetchBlogs();
  }, [router]);

  const uploadImage = async (finalSlug) => {
    if (!imageFile) {
      return imageUrl;
    }

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${finalSlug}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("blog-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalSlug = slug || createSlug(title);

      const finalImageUrl = await uploadImage(finalSlug);

      const { error } = await supabase.from("blogs").insert([
        {
          title,
          slug: finalSlug,
          category,
          description,
          content,
          image_url: finalImageUrl,
          published: true,
        },
      ]);

      if (error) {
        throw error;
      }

      setTitle("");
      setSlug("");
      setCategory("");
      setDescription("");
      setContent("");
      setImageUrl("");
      setImageFile(null);

      fetchBlogs();

      alert("Blog Published Successfully!");
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Delete this blog?");

    if (!confirmDelete) return;

    const { error } = await supabase.from("blogs").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchBlogs();
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">📝 Blog Admin</h1>

      <a href="/admin" className="view-btn">
        ← Back to Admin
      </a>

      <h2 className="section-title">Add New Blog</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setSlug(createSlug(e.target.value));
          }}
          required
        />

        <input
          type="text"
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(createSlug(e.target.value))}
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <textarea
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <textarea
          placeholder="Full Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ minHeight: "300px" }}
        />

        <label
          style={{
            display: "block",
            marginTop: "15px",
            marginBottom: "8px",
            fontWeight: "600",
          }}
        >
          Upload Blog Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setImageFile(e.target.files?.[0] || null);
          }}
        />

        <p
          style={{
            marginTop: "10px",
            color: "var(--muted)",
            fontSize: "14px",
          }}
        >
          Or paste image URL manually:
        </p>

        <input
          type="text"
          placeholder="Image URL optional"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        {imageFile && (
          <p style={{ color: "green" }}>
            Selected image: {imageFile.name}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>

      <hr style={{ margin: "35px 0" }} />

      <h2 className="section-title">All Blogs</h2>

      {blogs.map((blog) => (
        <div key={blog.id} className="tool-card">
          {blog.image_url && (
            <img
              src={blog.image_url}
              alt={blog.title}
              style={{
                width: "100%",
                maxHeight: "180px",
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "15px",
              }}
            />
          )}

          <h3>{blog.title}</h3>
          <p>{blog.description}</p>
          <p>Slug: {blog.slug}</p>

          <a
            href={`/blog/${blog.slug}`}
            className="view-btn"
            style={{ marginRight: "10px" }}
            target="_blank"
          >
            View
          </a>

          <button onClick={() => handleDelete(blog.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}