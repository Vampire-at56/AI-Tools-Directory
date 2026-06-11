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

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link
          href="/"
          className="logo-link"
          onClick={closeMenu}
        >
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
          <Link href="/" onClick={closeMenu}>Home</Link>
          <Link href="/leaderboard" onClick={closeMenu}>Leaderboard</Link>
          <Link href="/submit-tool" onClick={closeMenu}>Submit Tool</Link>
          <Link href="/login" onClick={closeMenu}>Login</Link>
          <Link href="/signup" onClick={closeMenu}>Signup</Link>
          <Link href="/profile" onClick={closeMenu}>Profile</Link>

          {isAdmin && (
            <Link href="/admin" onClick={closeMenu}>
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}