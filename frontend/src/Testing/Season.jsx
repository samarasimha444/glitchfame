import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Client } from "@stomp/stompjs";

export default function Season() {

  const { seasonId } = useParams();
  const token = localStorage.getItem("token");

  const [season, setSeason] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [wsStatus, setWsStatus] = useState("Disconnected");

  const stompRef = useRef(null);

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {

    const fetchData = async () => {
      try {

        const res = await axios.get(
          `http://localhost:3000/seasons/${seasonId}?page=0&size=20`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const mapped = (res.data.participants.content || []).map(p => ({
          ...p,
          totalVotes: p.totalVotes ?? 0,
          hasVoted: p.hasVoted ?? false,
          loading: false
        }));

        setSeason(res.data.season);
        setParticipants(mapped);

      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();

  }, [seasonId]);



  /* ---------------- WEBSOCKET ---------------- */

  useEffect(() => {

    const client = new Client({
      brokerURL: "ws://localhost:3000/ws",

      connectHeaders: {
        Authorization: `Bearer ${token}` // 🔴 YOU WERE MISSING THIS
      },

      reconnectDelay: 5000,

      onConnect: () => {
        setWsStatus("Connected");

        client.subscribe(`/topic/votes/${seasonId}`, (message) => {

          const data = JSON.parse(message.body);

          setParticipants(prev =>
            prev.map(p =>
              p.participationId === data.participationId
                ? { ...p, totalVotes: data.votes }
                : p
            )
          );

        });
      },

      onWebSocketClose: () => setWsStatus("Disconnected"),
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        setWsStatus("Error");
      }
    });

    stompRef.current = client;
    client.activate();

    return () => {
      stompRef.current?.deactivate();
    };

  }, [seasonId]);



  /* ---------------- VOTE ---------------- */

  const toggleVote = async (p) => {

    const id = p.participationId;

    // disable button
    setParticipants(prev =>
      prev.map(x =>
        x.participationId === id
          ? { ...x, loading: true }
          : x
      )
    );

    try {

      const res = await fetch("http://localhost:3000/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          participationId: p.participationId,
          seasonId: p.seasonId
        })
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Vote failed");
      }

      const voted = await res.json();

      setParticipants(prev =>
        prev.map(x =>
          x.participationId === id
            ? {
                ...x,
                loading: false,
                hasVoted: voted
              }
            : x
        )
      );

    } catch (err) {

      setParticipants(prev =>
        prev.map(x =>
          x.participationId === id
            ? { ...x, loading: false }
            : x
        )
      );

      alert(err.message || "Vote failed");
    }
  };



  /* ---------------- UI ---------------- */

  if (!season) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>

      <h2>{season.seasonName}</h2>
      <p>{season.seasonDesc}</p>

      <p><b>WebSocket:</b> {wsStatus}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>

        {participants.map(p => (

          <div
            key={p.participationId}
            style={{
              width: "220px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "center"
            }}
          >

            <img
              src={p.participantPhotoUrl}
              alt={p.participantName}
              style={{ width: "100%", borderRadius: "8px" }}
            />

            <h4>{p.participantName}</h4>

            <p>Votes: {p.totalVotes}</p>

            <button
              disabled={p.loading}
              onClick={() => toggleVote(p)}
              style={{
                background: p.hasVoted ? "#ff4d4d" : "#4CAF50",
                color: "white",
                border: "none",
                padding: "6px 12px",
                cursor: p.loading ? "not-allowed" : "pointer",
                opacity: p.loading ? 0.6 : 1
              }}
            >

              {p.loading
                ? "Processing..."
                : (p.hasVoted ? "Unvote" : "Vote")
              }

            </button>

          </div>

        ))}

      </div>

    </div>
  );
}