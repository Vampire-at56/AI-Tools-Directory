"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const [tools, setTools] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const createSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const fetchDashboardData = async () => {
    const { data: toolsData } = await supabase
      .from("tools")
      .select("*")
      .order("id", { ascending: false });

    const { data: reviewsData } = await supabase.from("reviews").select("*");
    const { data: favoritesData } = await supabase.from("favorites").select("*");

    const { data: submissionsData } = await supabase
      .from("tool_submissions")
      .select("*")
      .eq("status", "pending");

    setTools(toolsData || []);
    setReviews(reviewsData || []);
    setFavorites(favoritesData || []);
    setSubmissions(submissionsData || []);
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");

    if (!isAdmin) {
      router.push("/admin/login");
      return;
    }

    fetchDashboardData();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalSlug = slug || createSlug(name);
    const cleanName = name.trim();

    const { data: existingTool } = await supabase
      .from("tools")
      .select("id")
      .or(`slug.eq.${finalSlug},name.ilike.${cleanName}`)
      .maybeSingle();

    if (existingTool) {
      alert("This tool already exists");
      return;
    }

    const { error } = await supabase.from("tools").insert([
      {
        name: cleanName,
        slug: finalSlug,
        description,
        category,
        website_url: websiteUrl,
        affiliate_url: affiliateUrl,
        logo_url: logoUrl,
        featured,
        is_new: isNew,
      },
    ]);

    if (error) {
      if (error.code === "23505") {
        alert("This tool already exists");
      } else {
        alert(error.message);
      }
      return;
    }

    setName("");
    setSlug("");
    setDescription("");
    setCategory("");
    setWebsiteUrl("");
    setAffiliateUrl("");
    setLogoUrl("");
    setFeatured(false);
    setIsNew(false);

    fetchDashboardData();

    alert("Tool Added Successfully!");
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("tools").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchDashboardData();
  };

  const totalViews = tools.reduce(
    (sum, tool) => sum + (tool.views || 0),
    0
  );

  const mostViewedTool = [...tools]
    .filter((tool) => (tool.views || 0) > 0)
    .sort((a, b) => (b.views || 0) - (a.views || 0))[0];

  const mostSavedToolId =
    favorites.length > 0
      ? favorites.reduce((acc, item) => {
          acc[item.tool_id] = (acc[item.tool_id] || 0) + 1;
          return acc;
        }, {})
      : {};

  const mostSavedId = Object.keys(mostSavedToolId).sort(
    (a, b) => mostSavedToolId[b] - mostSavedToolId[a]
  )[0];

  const mostSavedTool = tools.find(
    (tool) => String(tool.id) === String(mostSavedId)
  );

  const ratedToolIds = new Set(reviews.map((review) => review.tool_id));

  const highestRatedTool = [...tools]
    .filter((tool) => ratedToolIds.has(tool.id))
    .map((tool) => {
      const toolReviews = reviews.filter((review) => review.tool_id === tool.id);
      const avgRating =
        toolReviews.reduce((sum, review) => sum + review.rating, 0) /
        toolReviews.length;

      return {
        ...tool,
        avgRating,
      };
    })
    .sort((a, b) => b.avgRating - a.avgRating)[0];

  return (
    <div className="admin-container">
      <h1 className="admin-title">📊 Admin Dashboard</h1>

      <div style={{ marginBottom: "25px" }}>
        <a href="/admin/submissions" className="view-btn">
          View Tool Submissions ({submissions.length})
        </a>

        <a
          href="/admin/blogs"
          className="view-btn"
          style={{ marginLeft: "10px" }}
        >
          📝 Manage Blogs
        </a>

        <button
          style={{ marginLeft: "10px" }}
          onClick={() => {
            localStorage.removeItem("admin");
            window.location.href = "/admin/login";
          }}
        >
          Logout
        </button>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>🤖 Total Tools</h3>
          <p>{tools.length}</p>
        </div>

        <div className="analytics-card">
          <h3>⭐ Total Reviews</h3>
          <p>{reviews.length}</p>
        </div>

        <div className="analytics-card">
          <h3>❤️ Total Favorites</h3>
          <p>{favorites.length}</p>
        </div>

        <div className="analytics-card">
          <h3>👁 Total Views</h3>
          <p>{totalViews}</p>
        </div>

        <div className="analytics-card">
          <h3>🔥 Most Viewed</h3>
          <p>{mostViewedTool?.name || "No Data"}</p>
        </div>

        <div className="analytics-card">
          <h3>🏆 Highest Rated</h3>
          <p>{highestRatedTool?.name || "No Data"}</p>
        </div>

        <div className="analytics-card">
          <h3>❤️ Most Saved</h3>
          <p>{mostSavedTool?.name || "No Data"}</p>
        </div>

        <div className="analytics-card">
          <h3>⏳ Pending</h3>
          <p>{submissions.length}</p>
        </div>
      </div>

      <h2 className="section-title">Add New Tool</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tool Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSlug(createSlug(e.target.value));
          }}
        />

        <input
          type="text"
          placeholder="Slug e.g. chatgpt, claude-ai"
          value={slug}
          onChange={(e) => setSlug(createSlug(e.target.value))}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="text"
          placeholder="Website URL"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="Affiliate URL optional"
          value={affiliateUrl}
          onChange={(e) => setAffiliateUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="Logo URL"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            style={{ width: "auto", marginRight: "8px" }}
          />
          Featured Tool
        </label>

        <br />
        <br />

        <label>
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
            style={{ width: "auto", marginRight: "8px" }}
          />
          New AI Tool
        </label>

        <br />
        <br />

        <button type="submit">Add Tool</button>
      </form>

      <hr style={{ margin: "30px 0" }} />

      <h2 className="section-title">All Tools</h2>

      {tools.map((tool) => (
        <div key={tool.id} className="tool-card">
          <h3>{tool.name}</h3>
          <p>{tool.description}</p>
          <p>Slug: {tool.slug || "No slug"}</p>
          <p>👁 {tool.views || 0} Views</p>

          {tool.affiliate_url && (
            <p style={{ color: "green" }}>Affiliate Link Added ✅</p>
          )}

          {tool.is_new && (
            <p style={{ color: "green" }}>New AI Tool ✅</p>
          )}

          <a
            href={`/admin/edit/${tool.id}`}
            className="view-btn"
            style={{ marginRight: "10px" }}
          >
            Edit
          </a>

          <button onClick={() => handleDelete(tool.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}