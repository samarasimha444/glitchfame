import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";

export default function KillTesting() {
  const [participants, setParticipants] = useState([]);
  const [seasonId, setSeasonId] = useState("");
  const [connected, setConnected] = useState(false);

  const stompClientRef = useRef(null);
  const token = localStorage.getItem("token");

  // 🔥 FETCH INITIAL DATA
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3000/seasons/live/random", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setParticipants(data.participants.content);
      setSeasonId(data.season.seasonId);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 WEBSOCKET CONNECT (NATIVE)
  useEffect(() => {
    if (!seasonId) return;

    const client = new Client({
      brokerURL: "ws://localhost:3000/ws", // 🔥 native WS

      connectHeaders: {
        Authorization: `Bearer ${token}`, // 🔥 JWT here
      },

      reconnectDelay: 5000,

      onConnect: () => {
        console.log("WS Connected");
        setConnected(true);

        client.subscribe(`/topic/votes/${seasonId}`, (message) => {
          const data = JSON.parse(message.body);

          // { participationId, score, rank }

          setParticipants((prev) =>
            prev.map((p) =>
              p.participationId === data.participationId
                ? { ...p, score: data.score }
                : p
            )
          );
        });
      },

      onDisconnect: () => {
        console.log("WS Disconnected");
        setConnected(false);
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        setConnected(false);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [seasonId]);

  // 🔥 HANDLE ACTION
  const handleAction = async (participantId, action) => {
    try {
      await fetch("http://localhost:3000/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          participationId: participantId,
          seasonId: seasonId,
          action: action,
        }),
      });

      // toggle UI instantly (not score)
      setParticipants((prev) =>
        prev.map((p) => {
          if (p.participationId !== participantId) return p;

          if (action === "VOTE") {
            return {
              ...p,
              hasVoted: !p.hasVoted,
              hasKilled: false,
            };
          }

          if (action === "KILL") {
            return {
              ...p,
              hasKilled: !p.hasKilled,
              hasVoted: false,
            };
          }

          return p;
        })
      );
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Kill Testing</h1>

      {/* 🔥 CONNECTION STATUS */}
      <p>
        Status:{" "}
        <span style={{ color: connected ? "green" : "red" }}>
          {connected ? "CONNECTED" : "DISCONNECTED"}
        </span>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {participants.map((p) => (
          <div
            key={p.participationId}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            <h3>{p.participantName}</h3>
            <p>Score: {p.score}</p>

            {/* VOTE */}
            <button
              onClick={() => handleAction(p.participationId, "VOTE")}
              style={{
                marginRight: "10px",
                background: p.hasVoted ? "orange" : "green",
                color: "white",
              }}
            >
              {p.hasVoted ? "UNVOTE" : "VOTE"}
            </button>

            {/* KILL */}
            <button
              onClick={() => handleAction(p.participationId, "KILL")}
              style={{
                background: p.hasKilled ? "gray" : "red",
                color: "white",
              }}
            >
              {p.hasKilled ? "UNKILL" : "KILL"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}