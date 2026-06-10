"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      email === "at0852024@gmail.com" &&
      password === "Ankit@56"
    ) {
      localStorage.setItem("admin", "true");
      router.push("/admin");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="login-container">
      <form
        className="login-card"
        onSubmit={handleLogin}
      >
        <h1>Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}