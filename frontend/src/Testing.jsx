import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";

const BASE_URL = "http://localhost:3000";

// Default portrait image
const DEFAULT_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

export default function Testing() {
  const [contestants, setContestants] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    fetchContestants();
    connectWebSocket();

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  // ---------------- FETCH ----------------
  const fetchContestants = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${BASE_URL}/contestants/status/approved`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) return;

    const data = await res.json();
    setContestants(data.content);
  };

  // ---------------- WEBSOCKET ----------------
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
        setConnected(true);

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
      },

      onStompError: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;
  };

  // ---------------- TOGGLE VOTE ----------------
  const handleVote = async (contestant) => {
    const token = localStorage.getItem("token");
    setLoadingId(contestant.participationId);

    try {
      const res = await fetch(
        `${BASE_URL}/votes/toggle/${contestant.participationId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  return (
    <div style={{ padding: 30 }}>
      <h2>Contestants</h2>

      <p>
        WebSocket: {connected ? "🟢 Connected" : "🔴 Disconnected"}
      </p>

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
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
         <img
  src={c.participantPhotoUrl || DEFAULT_IMAGE}
  alt={c.participantName ? c.participantName : "Contestant Image"}
  title={c.participantName}  // optional: shows tooltip on hover
  style={{
    width: 180,
    height: 220,
    objectFit: "cover",
    borderRadius: 12,
    marginBottom: 15,
  }}
/>

          {/* Name */}
          <h3 style={{ margin: "10px 0" }}>
            {c.participantName}
          </h3>

          {/* Vote Section */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
            }}
          >
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
    </div>
  );
}