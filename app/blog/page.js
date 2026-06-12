import Link from "next/link";
import { blogs } from "../../data/blogs";

export const metadata = {
  title: "AI Tools Blog - AI Tools Directory",
  description:
    "Read helpful guides about the best AI tools for writing, coding, image generation, students, and small businesses.",
};

export default function BlogPage() {
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

      <div className="tools-grid">
        {blogs.map((blog) => (
          <div
            key={blog.slug}
            style={{
              background: "var(--card)",
              padding: "25px",
              borderRadius: "18px",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            <p
              style={{
                color: "#7c3aed",
                fontWeight: "700",
                marginBottom: "10px",
              }}
            >
              {blog.category}
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
              {blog.date} • {blog.readTime}
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
    </div>
  );
}