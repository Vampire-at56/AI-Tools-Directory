"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
const [username, setUsername] = useState("");
const [mobile, setMobile] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const handleSignup = async (e) => {
e.preventDefault();


if (password !== confirmPassword) {
  alert("Passwords do not match");
  return;
}

const strongPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if (!strongPassword.test(password)) {
  alert(
    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
  );
  return;
}

const { data, error } = await supabase.auth.signUp({
  email,
  password,
});

if (error) {
  alert(error.message);
  return;
}

if (data?.user) {
  const { error: profileError } = await supabase
    .from("profiles")
    .insert([
      {
        id: data.user.id,
        username: username,
        full_name: username,
        mobile: mobile,
      },
    ]);

  console.log("PROFILE ERROR:", profileError);

  if (profileError) {
    alert(profileError.message);
  }
}

alert(
  "Signup successful! Check your email for verification."
);


};

return ( <div className="auth-container"> <h1>Signup</h1>


  <form onSubmit={handleSignup}>
    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />

    <br /><br />

    <input
      type="text"
      placeholder="Mobile Number"
      value={mobile}
      onChange={(e) => setMobile(e.target.value)}
    />

    <br /><br />

    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <br /><br />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <br /><br />

    <input
      type="password"
      placeholder="Confirm Password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />

    <br /><br />

    <button type="submit">
      Create Account
    </button>
  </form>
</div>
);
}