import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";

export default function TLeaderboard() {
  const [data, setData] = useState({});
  const [seasonIds, setSeasonIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  const token = localStorage.getItem("token");
  const stompRef = useRef(null);

  // ================= FETCH =================
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("http://localhost:3000/leaderboard/live", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Fetch failed");

      const json = await res.json();

      setData(json);
      setSeasonIds(Object.keys(json)); // 🔥 extract seasons
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // ================= WS =================
  useEffect(() => {
    if (seasonIds.length === 0) return;

    const client = new Client({
      brokerURL: "ws://localhost:3000/ws",

      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      reconnectDelay: 5000,

      onConnect: () => {
        console.log("WS Connected");
        setConnected(true);

        // 🔥 subscribe to each season
        seasonIds.forEach((seasonId) => {
          client.subscribe(`/topic/votes/${seasonId}`, (message) => {
            const update = JSON.parse(message.body);
            // { participationId, score }

            handleRealtimeUpdate(seasonId, update);
          });
        });
      },

      onDisconnect: () => {
        setConnected(false);
      },

      onStompError: (frame) => {
        console.error("WS error:", frame);
        setConnected(false);
      },
    });

    client.activate();
    stompRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [seasonIds]);

  // ================= UPDATE =================
  const handleRealtimeUpdate = (seasonId, update) => {
    setData((prev) => {
      const updated = { ...prev };

      const players = [...(updated[seasonId] || [])];

      const index = players.findIndex(
        (p) => p.participantId === update.participationId
      );

      if (index !== -1) {
        players[index].score = update.score;
      }

      // 🔥 re-sort
      players.sort((a, b) => b.score - a.score);

      // 🔥 re-rank
      players.forEach((p, i) => {
        p.rank = i + 1;
      });

      updated[seasonId] = players;

      return updated;
    });
  };

  // ================= UI =================
  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>🔥 Live Leaderboard</h1>

      <p>
        Status:{" "}
        <span style={{ color: connected ? "green" : "red" }}>
          {connected ? "CONNECTED" : "DISCONNECTED"}
        </span>
      </p>

      {Object.entries(data).map(([seasonId, players]) => (
        <div key={seasonId} style={{ marginBottom: "30px" }}>
          <h2>Season: {seasonId}</h2>

          {players.map((p) => (
            <div
              key={p.participantId}
              style={{
                padding: "10px",
                borderBottom: "1px solid #ccc",
                fontWeight: p.rank === 1 ? "bold" : "normal",
              }}
            >
              #{p.rank} {p.participantName} — {p.score}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}