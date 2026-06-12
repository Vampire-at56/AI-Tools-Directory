import { supabase } from "../lib/supabase";
import SearchTools from "../components/SearchTools";
import ToolCard from "../components/ToolCard";
import Newsletter from "../components/Newsletter";

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

        <section
  style={{
    marginTop: "50px",
    background: "var(--card)",
    padding: "40px",
    borderRadius: "20px",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow)",
  }}
>
  <h2 className="section-title">
    Why Use Our AI Tools Directory?
  </h2>

  <p style={{ lineHeight: "1.9", marginTop: "20px" }}>
    Artificial Intelligence is transforming the way people work,
    create content, build businesses, write code, design graphics,
    edit videos, and automate daily tasks. However, with thousands
    of AI tools being launched every year, finding the right tool
    for a specific purpose can be difficult and time-consuming.
    Our AI Tools Directory was created to solve this problem by
    helping users discover the most useful AI tools in one place.
  </p>

  <p style={{ lineHeight: "1.9", marginTop: "15px" }}>
    We carefully organize AI tools into categories such as
    Chatbots, Writing, Coding, Marketing, Image Generation,
    Video Creation, Productivity, and many more. Instead of
    spending hours searching through multiple websites, users
    can quickly compare tools, read reviews, check ratings,
    and find solutions that match their needs.
  </p>

  <p style={{ lineHeight: "1.9", marginTop: "15px" }}>
    Our platform is designed for everyone, including students,
    freelancers, developers, content creators, marketers,
    entrepreneurs, and business owners. Whether you need an AI
    writing assistant, a coding companion, a design generator,
    or an automation tool, our directory helps you discover
    reliable options quickly and efficiently.
  </p>

  <p style={{ lineHeight: "1.9", marginTop: "15px" }}>
    One of the biggest advantages of our directory is community
    feedback. Users can submit reviews and ratings based on
    their real experiences. This helps visitors understand the
    strengths and limitations of a tool before investing their
    time or money. Honest user reviews make it easier to choose
    the right solution.
  </p>

  <p style={{ lineHeight: "1.9", marginTop: "15px" }}>
    We regularly update our database with new and trending AI
    tools. As the AI industry evolves rapidly, our goal is to
    ensure that users always have access to the latest tools and
    innovations. New tools are reviewed and added frequently,
    allowing visitors to stay informed about emerging AI
    technologies.
  </p>

  <p style={{ lineHeight: "1.9", marginTop: "15px" }}>
    Our mission is simple: make discovering AI tools easy,
    transparent, and accessible for everyone. By combining
    powerful search features, organized categories, user
    reviews, ratings, and curated listings, we aim to become a
    trusted resource for anyone exploring the world of
    artificial intelligence.
  </p>
</section>

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

        <Newsletter />
      </div>
    </>
  );
}