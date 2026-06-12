import { supabase } from "../../../lib/supabase";
import ReviewForm from "../../../components/ReviewForm";
import FavoriteButton from "../../../components/FavoriteButton";

export const dynamic = "force-dynamic";

export default async function ToolPage({ params }) {
  const { id } = await params;

  let toolQuery = supabase
    .from("tools")
    .select("*");

  if (!isNaN(Number(id))) {
    toolQuery = toolQuery.eq("id", Number(id));
  } else {
    toolQuery = toolQuery.eq("slug", id);
  }

  const { data: tool, error } = await toolQuery.single();

  if (error || !tool) {
    return <h1>Tool not found</h1>;
  }

  await supabase
    .from("tools")
    .update({
      views: (tool.views || 0) + 1,
    })
    .eq("id", tool.id);

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("tool_id", tool.id)
    .order("created_at", { ascending: false });

  const avgRating = reviews?.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  return (
    <div style={{ padding: "20px" }}>
      {tool.logo_url && (
        <img
          src={tool.logo_url}
          alt={tool.name}
          style={{
            width: "100px",
            height: "100px",
            objectFit: "contain",
          }}
        />
      )}

      <h1>{tool.name}</h1>

      <p>{tool.description}</p>

      <p>
        <strong>Category:</strong> {tool.category}
      </p>

      <p>👁 {(tool.views || 0) + 1} Views</p>

      <h2>⭐ {avgRating.toFixed(1)} / 5</h2>

      <p>{reviews?.length || 0} Reviews</p>

      <a
        href={tool.affiliate_url || tool.website_url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="view-btn"
      >
        🚀 Visit Tool
      </a>

      <p
        style={{
          fontSize: "13px",
          color: "#777",
          marginTop: "10px",
          marginBottom: "20px",
        }}
      >
        Some links on this page may be affiliate links.
        We may earn a commission at no extra cost to you.
      </p>

      <FavoriteButton toolId={tool.id} />

      <hr />

      <ReviewForm toolId={tool.id} />
    </div>
  );
}