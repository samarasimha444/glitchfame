import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";

const BASE_URL = "http://localhost:3000";
const SEASON_ID = 1;

export default function WebSocketLeaderboardTest() {

  const [leaderboard, setLeaderboard] = useState([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    fetchInitialLeaderboard();
    connectWebSocket();

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    };
  }, []);

  const fetchInitialLeaderboard = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${BASE_URL}/leaderboard/${SEASON_ID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      setLeaderboard(data);

    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    }
  };

  const connectWebSocket = () => {

    if (clientRef.current) return;

    const token = localStorage.getItem("token");

    const client = new Client({
      brokerURL: "ws://localhost:3000/ws",
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("WebSocket connected");
        setConnected(true);

        client.subscribe(
          `/topic/leaderboard/${SEASON_ID}`,
          (message) => {
            const data = JSON.parse(message.body);
            setLeaderboard(data);
          }
        );
      },

      onStompError: (err) => {
        console.error("STOMP error:", err);
        setConnected(false);
      },

      onWebSocketClose: () => {
        setConnected(false);
      }
    });

    client.activate();
    clientRef.current = client;
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>WebSocket Leaderboard Test</h2>

      <p>Status: {connected ? "Connected" : "Disconnected"}</p>

      <hr />

      {leaderboard.map((item) => (
        <div key={item.participation_id}>
          #{item.rank_position} — {item.participant_name} — {item.vote_count} votes
        </div>
      ))}
    </div>
  );
}