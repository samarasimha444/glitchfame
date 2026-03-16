import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";

export default function Leaderboard() {

  const [leaderboards, setLeaderboards] = useState({});
  const [wsStatus, setWsStatus] = useState("Disconnected");

  const stompRef = useRef(null);

  useEffect(() => {

    const token = localStorage.getItem("token");

    const fetchLeaderboards = async () => {

      const res = await fetch("http://localhost:3000/leaderboard/live", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      setLeaderboards(data);

      connectWebSocket(data, token);

    };

    fetchLeaderboards();

    return () => stompRef.current?.deactivate();

  }, []);

  const connectWebSocket = (data, token) => {

    const stompClient = new Client({

      brokerURL: "ws://localhost:3000/ws",
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,

      onConnect: () => {

        setWsStatus("Connected");

        Object.keys(data).forEach(seasonId => {

          stompClient.subscribe(`/topic/votes/${seasonId}`, (msg) => {

            const vote = JSON.parse(msg.body);

            setLeaderboards(prev => {

              const season = prev[seasonId];
              if (!season) return prev;

              const updated = season.map(p =>
                p.participantId === vote.participationId
                  ? { ...p, votes: vote.votes }
                  : p
              );

              updated.sort((a, b) => b.votes - a.votes);

              return {
                ...prev,
                [seasonId]: updated.slice(0, 3)
              };

            });

          });

        });

      },

      onWebSocketClose: () => setWsStatus("Disconnected"),
      onStompError: () => setWsStatus("Error")

    });

    stompRef.current = stompClient;
    stompClient.activate();

  };

  return (

    <div style={{ padding: 20 }}>

      <h2>Live Leaderboards</h2>

      <p><b>WebSocket:</b> {wsStatus}</p>

      {Object.entries(leaderboards).map(([seasonId, leaders]) => (

        <div key={seasonId} style={{ marginBottom: 30 }}>

          <h3>{leaders[0]?.seasonName}</h3>

          {leaders.map((p, index) => (

            <div
              key={p.participantId}
              style={{
                border: "1px solid #ccc",
                padding: 10,
                marginBottom: 10,
                width: 320,
                display: "flex",
                gap: 12
              }}
            >

              <b>#{index + 1}</b>

              <img src={p.participantPhoto} width="50" />

              <div>

                <div><b>{p.participantName}</b></div>
                <div>{p.votes} votes</div>

              </div>

            </div>

          ))}

        </div>

      ))}

    </div>

  );

}