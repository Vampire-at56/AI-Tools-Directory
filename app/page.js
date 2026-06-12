import { supabase } from "../lib/supabase";
import SearchTools from "../components/SearchTools";
import ToolCard from "../components/ToolCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: toolsData, error } = await supabase
    .from("tools")
    .select("*")
    .order("id", { ascending: false });

  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("*");

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const allTools = toolsData || [];
  const reviews = reviewsData || [];

  const searchDefaultTools = allTools.slice(0, 8);

  const featuredTools = allTools.filter((tool) => tool.featured);

  const topRatedTools = allTools
    .map((tool) => {
      const toolReviews = reviews.filter(
        (r) => r.tool_id === tool.id
      );

      const avgRating =
        toolReviews.length > 0
          ? toolReviews.reduce((sum, r) => sum + r.rating, 0) /
            toolReviews.length
          : 0;

      return {
        ...tool,
        avgRating,
      };
    })
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 6);

  const trendingTools = [...allTools]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 6);

  const newTools = [...allTools].slice(0, 6);

  return (
    <>
      <div className="hero">
        <h1>🚀 Discover Best AI Tools</h1>

        <p>
          Find top AI tools for coding, writing, design,
          marketing, video generation and productivity.
        </p>

        <div
          style={{
            marginTop: "25px",
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="#search-tools"
            className="view-btn"
            style={{
              background: "white",
              color: "#2563eb",
              fontWeight: "700",
            }}
          >
            🚀 Explore Tools
          </a>

          <a href="/submit-tool" className="view-btn">
            ➕ Submit Your Tool
          </a>
        </div>

        <div className="stats">
          <div className="stat-card">
            <h2>{allTools.length}+</h2>
            <p>AI Tools</p>
          </div>

          <div className="stat-card">
            <h2>{reviews.length}+</h2>
            <p>Reviews</p>
          </div>

          <div className="stat-card">
            <h2>🔥</h2>
            <p>Trending Tools</p>
          </div>

          <div className="stat-card">
            <h2>⭐</h2>
            <p>Top Rated</p>
          </div>
        </div>
      </div>

      <div className="container">
        <h2 id="search-tools" className="section-title">
          🔍 Search AI Tools
        </h2>

        <SearchTools tools={searchDefaultTools} allTools={allTools} />

        <h2 className="section-title">⭐ Featured Tools</h2>

        {featuredTools.length === 0 ? (
          <p>No featured tools yet.</p>
        ) : (
          <div className="tools-grid">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        <h2 className="section-title">🏆 Top Rated AI Tools</h2>

        <div className="tools-grid">
          {topRatedTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={{
                ...tool,
                rating: tool.avgRating.toFixed(1),
              }}
            />
          ))}
        </div>

        <h2 className="section-title">🔥 Trending AI Tools</h2>

        <div className="tools-grid">
          {trendingTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        <h2 className="section-title">✨ New AI Tools</h2>

        <div className="tools-grid">
          {newTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

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

          <input
            type="email"
            placeholder="Enter your email"
            style={{
              maxWidth: "400px",
              marginRight: "10px",
            }}
          />

          <button>Subscribe</button>
        </div>
      </div>
    </>
  );
}