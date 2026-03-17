import { useLeaderboards, useLeaderboardVotes } from "./hooks";

export default function LeaderboardPage() {
  const { data, isLoading } = useLeaderboards();
  console.log(data)

  useLeaderboardVotes(data);

  if (isLoading || !data) return <p>Loading...</p>;

  return (
    <div>
      {Object.entries(data).map(([seasonId, leaders]) => (
        <div key={seasonId}>
          <h3>{leaders[0]?.seasonName}</h3>

          {leaders.map((p, index) => (
            <div key={p.participantId}>
              #{index + 1} {p.participantName} - {p.votes}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}