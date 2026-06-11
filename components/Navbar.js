"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const admin = localStorage.getItem("admin") === "true";
    setIsAdmin(admin);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link href="/" className="logo-link">
          <h1 className="logo">🤖 AI Tools Directory</h1>
        </Link>

        <div className="nav-actions">
          <ThemeToggle />

          <button
            type="button"
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        <div className={menuOpen ? "nav-links open" : "nav-links"}>
          <Link href="/">Home</Link>
          <Link href="/leaderboard">Leaderboard</Link>
          <Link href="/submit-tool">Submit Tool</Link>
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
          <Link href="/profile">Profile</Link>

          {isAdmin && <Link href="/admin">Admin</Link>}
        </div>
      </div>
    </nav>
  );
}