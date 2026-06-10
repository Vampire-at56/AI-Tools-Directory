"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            "http://localhost:3000/login",
        }
      );

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password reset email sent!");
  };

  return (
    <div className="auth-container">
      <h1>Forgot Password</h1>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br /><br />

      <button onClick={handleReset}>
        Send Reset Link
      </button>
    </div>
  );
}