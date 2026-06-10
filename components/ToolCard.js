import Link from "next/link";

export default function ToolCard({ tool }) {
  return (
    <div className="tool-card">

      {/* BADGES */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          marginBottom: "10px",
        }}
      >
        {tool.featured && (
          <span className="badge featured">
            ⭐ Featured
          </span>
        )}

        {(tool.views || 0) >= 100 && (
          <span className="badge trending">
            🔥 Trending
          </span>
        )}

        {(tool.rating || 0) >= 4.5 && (
          <span className="badge toprated">
            🏆 Top Rated
          </span>
        )}
      </div>

      {tool.logo_url && (
        <img
          src={tool.logo_url}
          alt={tool.name}
          className="tool-logo"
        />
      )}

      <h3 className="tool-name">
        {tool.name}
      </h3>

      <p className="tool-description">
        {tool.description}
      </p>

      <div className="tool-category">
        {tool.category}
      </div>

      <div
        style={{
          marginTop: "14px",
          color: "var(--muted)",
          fontWeight: "600",
        }}
      >
        ⭐ {tool.rating || 0}
        &nbsp;&nbsp;|&nbsp;&nbsp;
        👁 {tool.views || 0}
      </div>

      <div style={{ marginTop: "18px" }}>
        <Link
          href={`/tools/${tool.slug || tool.id}`}
          className="view-btn"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}