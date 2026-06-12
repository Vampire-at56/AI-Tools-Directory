import Link from "next/link";
import { supabase } from "../../lib/supabase";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AI Tools Blog - AI Tools Directory",
  description:
    "Read helpful guides about the best AI tools for writing, coding, image generation, students, and small businesses.",
};

export default async function BlogPage() {
  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="container">
        <h1 className="section-title">AI Tools Blog</h1>
        <p>Error loading blogs: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="section-title">AI Tools Blog</h1>

      <p
        style={{
          textAlign: "center",
          maxWidth: "750px",
          margin: "0 auto 40px",
          color: "var(--muted)",
          lineHeight: "1.8",
        }}
      >
        Explore helpful guides, comparisons, and recommendations about
        the best AI tools for writing, coding, design, students,
        businesses, and productivity.
      </p>

      {blogs.length === 0 ? (
        <p style={{ textAlign: "center" }}>No blog posts published yet.</p>
      ) : (
        <div className="tools-grid">
          {blogs.map((blog) => (
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
                {blog.category || "AI Tools"}
              </p>

              <h2>{blog.title}</h2>

              <p
                style={{
                  color: "var(--muted)",
                  lineHeight: "1.7",
                }}
              >
                {blog.description}
              </p>

              <p
                style={{
                  fontSize: "14px",
                  color: "var(--muted)",
                  marginTop: "15px",
                }}
              >
                {new Date(blog.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <Link
                href={`/blog/${blog.slug}`}
                className="view-btn"
                style={{
                  display: "inline-block",
                  marginTop: "20px",
                }}
              >
                Read Article →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}