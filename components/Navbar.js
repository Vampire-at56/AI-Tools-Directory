"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const admin =
      localStorage.getItem("admin") === "true";

    setIsAdmin(admin);
  }, []);

  return (
    <nav className="navbar">
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <h1 className="logo">
              🤖 AI Tools Directory
            </h1>
          </Link>

          <button
            className="menu-btn"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            ☰
          </button>

          <div
            className={
              menuOpen
                ? "nav-links open"
                : "nav-links"
            }
          >
            <Link href="/">
              Home
            </Link>

            <Link href="/leaderboard">
              Leaderboard
            </Link>

            <Link href="/submit-tool">
              Submit Tool
            </Link>

            <Link href="/profile">
              Profile
            </Link>

            {isAdmin && (
              <Link href="/admin">
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}