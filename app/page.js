import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import SearchTools from "../components/SearchTools";
import ToolCard from "../components/ToolCard";

export default async function Home() {
  const { data: tools, error } = await supabase
    .from("tools")
    .select("*");

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*");

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const featuredTools =
    tools?.filter((tool) => tool.featured) || [];

  const normalTools =
    tools?.filter((tool) => !tool.featured) || [];

  const topRatedTools = tools
    ?.map((tool) => {
      const toolReviews =
        reviews?.filter((r) => r.tool_id === tool.id) || [];

      const avgRating =
        toolReviews.length > 0
          ? toolReviews.reduce(
              (sum, r) => sum + r.rating,
              0
            ) / toolReviews.length
          : 0;

      return {
        ...tool,
        avgRating,
      };
    })
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 6);

  const trendingTools = [...tools]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 6);

  const newTools = [...tools]
    .reverse()
    .slice(0, 6);

  return (
    <>
      <Navbar />

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
            href="#all-tools"
            className="view-btn"
            style={{
              background: "white",
              color: "#2563eb",
              fontWeight: "700",
            }}
          >
            🚀 Explore Tools
          </a>

          <a
            href="/submit-tool"
            className="view-btn"
          >
            ➕ Submit Your Tool
          </a>
        </div>

        <div className="stats">
          <div className="stat-card">
            <h2>{tools?.length || 0}+</h2>
            <p>AI Tools</p>
          </div>

          <div className="stat-card">
            <h2>{reviews?.length || 0}+</h2>
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
        <h2 className="section-title">
          ⭐ Featured Tools
        </h2>

        <div className="tools-grid">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        <h2 className="section-title">
          🏆 Top Rated AI Tools
        </h2>

        <div className="tools-grid">
          {topRatedTools?.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={{
                ...tool,
                rating: tool.avgRating.toFixed(1),
              }}
            />
          ))}
        </div>

        <h2 className="section-title">
          🔥 Trending AI Tools
        </h2>

        <div className="tools-grid">
          {trendingTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        <h2 className="section-title">
          ✨ New AI Tools
        </h2>

        <div className="tools-grid">
          {newTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        <h2
          id="all-tools"
          className="section-title"
        >
          🤖 All AI Tools
        </h2>

        <SearchTools tools={normalTools} />

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

          <button>
            Subscribe
          </button>
        </div>
      </div>
    </>
  );
}