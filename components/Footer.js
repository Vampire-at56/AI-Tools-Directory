export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "60px",
        padding: "30px 20px",
        borderTop: "1px solid var(--border)",
        textAlign: "center",
        background: "var(--card)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "15px",
        }}
      >
        <a href="/about">About Us</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/contact">Contact Us</a>
        <a href="/terms">Terms & Conditions</a>
      </div>

      <p style={{ color: "var(--muted)" }}>
        © 2026 AI Tools Directory. All Rights Reserved.
      </p>
    </footer>
  );
}