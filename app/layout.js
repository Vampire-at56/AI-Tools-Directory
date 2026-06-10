import "./globals.css";
import ThemeToggle from "../components/ThemeToggle";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="logo">🤖 AI Tools Directory</div>

          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/leaderboard">Leaderboard</a>
            <a href="/submit-tool">Submit Tool</a>
            <a href="/login">Login</a>
            <a href="/signup">Signup</a>
            <a href="/profile">Profile</a>
            <a href="/admin/login">Admin</a>
            <ThemeToggle />
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}