import Link from "next/link";
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

  const { data: blogsData } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const rawTools = toolsData || [];
  const reviews = reviewsData || [];
  const latestBlogs = blogsData || [];

  const allTools = rawTools.map((tool) => {
    const toolReviews = reviews.filter(
      (review) => review.tool_id === tool.id
    );

    const avgRating =
      toolReviews.length > 0
        ? toolReviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / toolReviews.length
        : 0;

    return {
      ...tool,
      avgRating,
      reviewCount: toolReviews.length,
      rating: avgRating > 0 ? avgRating.toFixed(1) : null,
    };
  });

  const searchDefaultTools = allTools.slice(0, 8);

  const featuredTools = allTools.filter((tool) => tool.featured);

  const topRatedTools = allTools
    .filter((tool) => tool.reviewCount > 0)
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 6);

  const trendingTools = [...allTools]
    .filter((tool) => (tool.views || 0) > 0)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 6);

  const newTools = [...allTools]
    .filter((tool) => tool.is_new)
    .slice(0, 6);

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
          <div className="home-slider">
           {featuredTools.map((tool) => (
           <ToolCard key={tool.id} tool={tool} />
      ))}
      </div>
        )}

        <h2 className="section-title">🏆 Top Rated AI Tools</h2>

        {topRatedTools.length === 0 ? (
          <p>No rated tools yet.</p>
        ) : (
          <div className="home-slider">
            {topRatedTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
       ))}
      </div>
        )}

        <h2 className="section-title">🔥 Trending AI Tools</h2>

        {trendingTools.length === 0 ? (
          <p>No trending tools yet.</p>
        ) : (
          <div className="home-slider">
            {trendingTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        <h2 className="section-title">✨ New AI Tools</h2>

        {newTools.length === 0 ? (
          <p>No new tools selected yet.</p>
        ) : (
          <div className="home-slider">
            {newTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        <h2 className="section-title">📝 Latest AI Guides</h2>

        {latestBlogs.length === 0 ? (
          <p>No blog posts yet.</p>
        ) : (
          <div className="tools-grid">
            {latestBlogs.map((blog) => (
              <div
                key={blog.id}
                style={{
                  background: "var(--card)",
                  padding: "25px",
                  borderRadius: "18px",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow)",
                }}
              >
                {blog.image_url && (
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "14px",
                      marginBottom: "18px",
                    }}
                  />
                )}

                <p
                  style={{
                    color: "#7c3aed",
                    fontWeight: "700",
                    marginBottom: "10px",
                  }}
                >
                  {blog.category || "AI Guide"}
                </p>

                <h3>{blog.title}</h3>

                <p
                  style={{
                    color: "var(--muted)",
                    lineHeight: "1.7",
                  }}
                >
                  {blog.description}
                </p>

                <Link
                  href={`/blog/${blog.slug}`}
                  className="view-btn"
                  style={{
                    display: "inline-block",
                    marginTop: "15px",
                  }}
                >
                  Read Guide →
                </Link>
              </div>
            ))}
          </div>
        )}

        <Newsletter />
      </div>
    </>
  );
}