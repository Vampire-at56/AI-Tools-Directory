import { supabase } from "../../lib/supabase";
import ToolCard from "../../components/ToolCard";

export default async function LeaderboardPage() {
  const { data: tools } = await supabase
    .from("tools")
    .select("*")
    .order("rating", { ascending: false });

  return (
    <div className="container">
      <h1>🏆 AI Tools Leaderboard</h1>

      <div className="tools-grid">
        {tools?.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
          />
        ))}
      </div>
    </div>
  );
}