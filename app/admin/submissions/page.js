"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);

  const router = useRouter();

  const createSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("tool_submissions")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (!error) {
      setSubmissions(data);
    }
  };

  useEffect(() => {
  const isAdmin = localStorage.getItem("admin");

  if (!isAdmin) {
    router.push("/admin/login");
    return;
  }

  fetchSubmissions();
}, []);

  const approveTool = async (submission) => {
    const { error: insertError } = await supabase
      .from("tools")
      .insert([
        {
          name: submission.name,
          slug: createSlug(submission.name),
          description: submission.description,
          category: submission.category,
          website_url: submission.website_url,
          logo_url: submission.logo_url,
          featured: false,
          views: 0,
          rating: 0,
          total_reviews: 0,
        },
      ]);

    if (insertError) {
      alert(insertError.message);
      return;
    }

    await supabase
      .from("tool_submissions")
      .update({ status: "approved" })
      .eq("id", submission.id);

    alert("Tool approved and added!");
    fetchSubmissions();
  };

  const rejectTool = async (id) => {
    const { error } = await supabase
      .from("tool_submissions")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Submission rejected");
    fetchSubmissions();
  };

  return (
    <div className="admin-container">
      <h1>Pending Tool Submissions</h1>

      {submissions.length === 0 ? (
        <p>No pending submissions.</p>
      ) : (
        submissions.map((item) => (
          <div key={item.id} className="tool-card">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p><strong>Category:</strong> {item.category}</p>

            {item.logo_url && (
              <img
                src={item.logo_url}
                alt={item.name}
                className="tool-logo"
              />
            )}

            <br />

            <a
              href={item.website_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Website
            </a>

            <br /><br />

            <button onClick={() => approveTool(item)}>
              Approve
            </button>

            <button
              onClick={() => rejectTool(item.id)}
              style={{ marginLeft: "10px", background: "red" }}
            >
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}