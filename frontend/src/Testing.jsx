import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";

const BASE_URL = "http://localhost:3000";
const SEASON_ID = 1;

const DEFAULT_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

export default function Testing() {
  const [contestants, setContestants] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const clientRef = useRef(null);

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchContestants();
    fetchLeaderboard();
    connectWebSocket();

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  // ================= FETCH CONTESTANTS =================
  const fetchContestants = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${BASE_URL}/contestants/status/approved`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) return;

    const data = await res.json();
    setContestants(data.content);
  };

  // ================= FETCH LEADERBOARD =================
  const fetchLeaderboard = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${BASE_URL}/leaderboard/${SEASON_ID}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) return;

    const data = await res.json();

    // 🔥 normalize snake_case → camelCase
    const normalized = data.map((p) => ({
      participationId: p.participation_id,
      participantName: p.participant_name,
      voteCount: p.vote_count,
      rankPosition: p.rank_position,
      hasVoted: p.has_voted,
      photoUrl: p.photo_url,
    }));

    setLeaderboard(normalized);
  };

  // ================= WEBSOCKET =================
  const connectWebSocket = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const client = new Client({
      brokerURL: "ws://localhost:3000/ws",
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("WebSocket connected");
        setConnected(true);

        // 🔥 Vote updates
        client.subscribe("/topic/votes", (message) => {
          const data = JSON.parse(message.body);

          setContestants((prev) =>
            prev.map((c) =>
              c.participationId === data.participationId
                ? { ...c, voteCount: data.voteCount }
                : c
            )
          );
        });

        // 🔥 Leaderboard updates
        client.subscribe(
          `/topic/leaderboard/${SEASON_ID}`,
          (message) => {
            const data = JSON.parse(message.body);

            const normalized = data.map((p) => ({
              participationId: p.participation_id,
              participantName: p.participant_name,
              voteCount: p.vote_count,
              rankPosition: p.rank_position,
              hasVoted: p.has_voted,
              photoUrl: p.photo_url,
            }));

            setLeaderboard(normalized);
          }
        );
      },

      onStompError: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;
  };

  // ================= TOGGLE VOTE =================
  const handleVote = async (contestant) => {
    const token = localStorage.getItem("token");
    setLoadingId(contestant.participationId);

    try {
      const res = await fetch(
        `${BASE_URL}/votes/toggle/${contestant.participationId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      setContestants((prev) =>
        prev.map((c) =>
          c.participationId === data.participationId
            ? {
                ...c,
                voteCount: data.voteCount,
                hasVoted: data.hasVoted ? 1 : 0,
              }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  // ================= UI =================
  return (
    <div style={{ padding: 30 }}>
      <h2>Contestants</h2>
      <p>WebSocket: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>

      {contestants.map((c) => (
        <div
          key={c.participationId}
          style={{
            border: "1px solid #ddd",
            padding: 20,
            marginBottom: 25,
            borderRadius: 12,
            width: 320,
            textAlign: "center",
          }}
        >
          <img
            src={c.participantPhotoUrl || DEFAULT_IMAGE}
            alt={c.participantName}
            style={{
              width: 180,
              height: 220,
              objectFit: "cover",
              borderRadius: 12,
              marginBottom: 15,
            }}
          />

          <h3>{c.participantName}</h3>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => handleVote(c)}
              disabled={loadingId === c.participationId}
              style={{
                background: "none",
                border: "none",
                fontSize: 28,
                cursor: "pointer",
                color: c.hasVoted === 1 ? "red" : "black",
              }}
            >
              {c.hasVoted === 1 ? "❤️" : "🤍"}
            </button>

            <span style={{ fontWeight: "bold" }}>
              {c.voteCount} votes
            </span>
          </div>
        </div>
      ))}

      <hr style={{ margin: "50px 0" }} />

      <h2>Leaderboard (Season {SEASON_ID})</h2>

      {leaderboard.map((p) => (
        <div
          key={p.participationId}
          style={{
            border: "1px solid #ddd",
            padding: 15,
            marginBottom: 10,
            borderRadius: 10,
            width: 350,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>
            #{p.rankPosition} - {p.participantName}
          </span>

          <strong>{p.voteCount} votes</strong>
        </div>
      ))}
    </div>
  );
}