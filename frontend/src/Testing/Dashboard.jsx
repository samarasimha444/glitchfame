import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";

export default function Dashboard() {

  const [profile, setProfile] = useState(null);
  const [contestants, setContestants] = useState([]);
  const [wsStatus, setWsStatus] = useState("Disconnected");

  const stompRef = useRef(null);

  useEffect(() => {

    const token = localStorage.getItem("token");

   

    const fetchProfile = async () => {

      const res = await fetch("http://localhost:3000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setProfile(data);

    };

    
    
    const fetchContestants = async () => {

      const res = await fetch(
        "http://localhost:3000/participations/live?page=0&size=50",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      const mapped = (data.content || []).map(c => ({
        ...c,
        totalVotes: c.totalVotes ?? 0,
        hasVoted: c.hasVoted ?? false,
        loading: false
      }));

      setContestants(mapped);

      /* subscribe to each season */

      const seasons = [...new Set(mapped.map(c => c.seasonId))];

      seasons.forEach(seasonId => {

        stompRef.current.subscribe(`/topic/votes/${seasonId}`, (msg) => {

          const vote = JSON.parse(msg.body);

          setContestants(prev =>
            prev.map(c =>
              c.participationId === vote.participationId
                ? { ...c, totalVotes: vote.votes }
                : c
            )
          );

        });

      });

    };

    fetchProfile();

    /* -------- WEBSOCKET -------- */

    const stompClient = new Client({

      brokerURL: "ws://localhost:3000/ws",
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,

      onConnect: () => {

        setWsStatus("Connected");
        fetchContestants();

      },

      onWebSocketClose: () => setWsStatus("Disconnected"),
      onStompError: () => setWsStatus("Error")

    });

    stompRef.current = stompClient;
    stompClient.activate();

    return () => stompRef.current?.deactivate();

  }, []);





  /* -------- VOTE -------- */

  const toggleVote = async (contestant) => {

    const token = localStorage.getItem("token");
    const id = contestant.participationId;

    /* disable button */

    setContestants(prev =>
      prev.map(c =>
        c.participationId === id
          ? { ...c, loading: true }
          : c
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
          participationId: contestant.participationId,
          seasonId: contestant.seasonId
        })
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Vote failed");
      }

      /* use backend response instead of guessing */

      const voted = await res.json();

      setContestants(prev =>
        prev.map(c =>
          c.participationId === id
            ? {
                ...c,
                loading: false,
                hasVoted: voted
              }
            : c
        )
      );

    } catch (err) {

      setContestants(prev =>
        prev.map(c =>
          c.participationId === id
            ? { ...c, loading: false }
            : c
        )
      );

      alert(err.message || "Vote failed");

    }

  };





  /* -------- UI -------- */

  if (!profile) return <div>Loading...</div>;

  return (

    <div style={{ padding: 20 }}>

      <h2>Dashboard</h2>

      <p><b>WebSocket:</b> {wsStatus}</p>

      <h3>Profile</h3>

      <p><b>ID:</b> {profile.id}</p>
      <p><b>Email:</b> {profile.email}</p>

      <hr />

      <h3>Live Contestants</h3>

      {contestants.map(c => (

        <div
          key={c.participationId}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
            width: 300
          }}
        >

          <img src={c.participantPhotoUrl} width="150" alt="" />

          <p><b>Name:</b> {c.participantName}</p>

          <p><b>Total Votes:</b> {c.totalVotes}</p>

          <button
            disabled={c.loading}
            onClick={() => toggleVote(c)}
            style={{
              background: c.hasVoted ? "#ff4d4d" : "#4CAF50",
              color: "white",
              border: "none",
              padding: "6px 12px",
              cursor: c.loading ? "not-allowed" : "pointer",
              opacity: c.loading ? 0.6 : 1
            }}
          >

            {c.loading
              ? "Processing..."
              : (c.hasVoted ? "Unvote" : "Vote")
            }

          </button>

        </div>

      ))}

    </div>

  );

}