import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { data: blog } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!blog) {
    return {
      title: "Blog Not Found - AI Tools Directory",
    };
  }

  return {
    title: `${blog.title} - AI Tools Directory`,
    description: blog.description,
  };
}

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;

  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !blog) {
    notFound();
  }

  return (
    <div className="container">
      <article
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "var(--card)",
          padding: "40px",
          borderRadius: "20px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
          lineHeight: "1.9",
        }}
      >
        <Link href="/blog" style={{ color: "#7c3aed" }}>
          ← Back to Blog
        </Link>

        {blog.image_url && (
          <img
            src={blog.image_url}
            alt={blog.title}
            style={{
              width: "100%",
              maxHeight: "420px",
              objectFit: "cover",
              borderRadius: "18px",
              marginTop: "25px",
              marginBottom: "25px",
            }}
          />
        )}

        <p
          style={{
            color: "#7c3aed",
            fontWeight: "700",
            marginTop: "25px",
          }}
        >
          {blog.category || "AI Tools"}
        </p>

        <h1>{blog.title}</h1>

        <p style={{ color: "var(--muted)" }}>
          {new Date(blog.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <p
          style={{
            fontSize: "18px",
            color: "var(--muted)",
            marginTop: "20px",
          }}
        >
          {blog.description}
        </p>

        <hr
          style={{
            margin: "30px 0",
            borderColor: "var(--border)",
          }}
        />

        {blog.content.split("\n").map((paragraph, index) =>
          paragraph.trim() ? <p key={index}>{paragraph}</p> : null
        )}

        <div
          style={{
            marginTop: "40px",
            padding: "25px",
            borderRadius: "18px",
            background: "var(--bg)",
            border: "1px solid var(--border)",
          }}
        >
          <h3>Explore More AI Tools</h3>

          <p style={{ color: "var(--muted)" }}>
            Browse our AI Tools Directory to discover more useful tools
            for writing, coding, marketing, design, productivity, and
            business growth.
          </p>

          <Link href="/" className="view-btn">
            Browse AI Tools →
          </Link>
        </div>
      </article>
    </div>
  );
}