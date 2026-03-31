import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";

export default function Participants() {
  const [participants, setParticipants] = useState([]);
  const [seasonId, setSeasonId] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [connected, setConnected] = useState(false);

  const token = localStorage.getItem("token");
  const stompRef = useRef(null);

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3000/participations/live", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      setParticipants(data.content || []);

      if (data.content?.length > 0) {
        setSeasonId(data.content[0].seasonId);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 WEBSOCKET CONNECT
  useEffect(() => {
    if (!seasonId) return;

    const client = new Client({
      brokerURL: "ws://localhost:3000/ws",

      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      reconnectDelay: 5000,

      onConnect: () => {
        console.log("WS Connected");
        setConnected(true);

        client.subscribe(`/topic/votes/${seasonId}`, (message) => {
          const data = JSON.parse(message.body);
          // { participationId, score }

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
  }, [seasonId]);

  // 🔥 HANDLE ACTION
  const handleAction = async (participantId, action) => {
    if (processingId) return;

    try {
      setProcessingId(participantId);

      const res = await fetch("http://localhost:3000/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          participationId: participantId,
          seasonId,
          action,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();

      // 🔥 update toggle immediately
      setParticipants((prev) =>
        prev.map((p) => {
          if (p.participationId !== participantId) return p;

          switch (data.type) {
            case "VOTE":
              return {
                ...p,
                hasVoted: true,
                hasKilled: false,
              };

            case "UNVOTE":
              return {
                ...p,
                hasVoted: false,
              };

            case "KILL":
              return {
                ...p,
                hasKilled: true,
                hasVoted: false,
              };

            case "UNKILL":
              return {
                ...p,
                hasKilled: false,
              };

            default:
              return p;
          }
        })
      );

      // ❌ DO NOT update score here
      // ✅ WebSocket will handle score
    } catch (err) {
      console.error("Action error:", err);

      if (err.message.includes("LIMIT")) {
        alert("Max 3 votes allowed");
      } else if (err.message.includes("locked")) {
        alert("Season ended");
      } else {
        alert("Something went wrong");
      }
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Participants</h2>

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
              disabled={processingId === p.participationId}
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
              disabled={processingId === p.participationId}
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