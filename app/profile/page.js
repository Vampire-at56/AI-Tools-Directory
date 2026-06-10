"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [savedTools, setSavedTools] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUser(user);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(profileData);

    const { data: favoritesData, error } = await supabase
      .from("favorites")
      .select(`
        id,
        tool_id,
        tools (
          id,
          name,
          description,
          category,
          logo_url
        )
      `)
      .eq("user_id", user.id);

    if (!error && favoritesData) {
      setSavedTools(favoritesData);
    }
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files[0];

    if (!file || !user) return;

    const fileName = user.id + "-" + Date.now();

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    await supabase
      .from("profiles")
      .update({
        avatar_url: data.publicUrl,
      })
      .eq("id", user.id);

    loadProfile();
  };

  if (!user) {
    return <h2>Please Login</h2>;
  }

  return (
    <div className="container">
      <h1>My Profile</h1>

      <br />

      <img
        src={
          profile?.avatar_url ||
          "https://ui-avatars.com/api/?name=User"
        }
        width="120"
        height="120"
        alt="Avatar"
        style={{
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />

      <br />
      <br />

      <input type="file" onChange={uploadAvatar} />

      <br />
      <br />

      <h3>Username: {profile?.username || "Not Set"}</h3>

      <p>Email: {user.email}</p>

      <p>Mobile: {profile?.mobile || "Not Set"}</p>

      <hr style={{ margin: "30px 0" }} />

      <h2>❤️ My Saved Tools</h2>

      {savedTools.length === 0 ? (
        <p>No saved tools yet.</p>
      ) : (
        <div className="tools-grid">
          {savedTools.map((item) => (
            <div key={item.id} className="tool-card">
              {item.tools?.logo_url && (
                <img
                  src={item.tools.logo_url}
                  alt={item.tools.name}
                  className="tool-logo"
                />
              )}

              <h3>{item.tools?.name}</h3>

              <p>{item.tools?.description}</p>

              <div className="tool-category">
                {item.tools?.category}
              </div>

              <br />

              <Link
                href={`/tools/${item.tools?.id}`}
                className="view-btn"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      <br />

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
}