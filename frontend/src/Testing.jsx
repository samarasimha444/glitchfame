import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

export default function Testing() {

  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No JWT found in localStorage");
      return;
    }

    const client = new Client({
      brokerURL: "ws://localhost:3000/ws",

      // 🔥 THIS IS WHAT YOU WERE MISSING
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },

      reconnectDelay: 5000,

      debug: (str) => console.log(str),

      onConnect: () => {

        setConnected(true);
        console.log("✅ STOMP connected with JWT");

        client.subscribe("/topic/test", (msg) => {
          setMessages(prev => [...prev, msg.body]);
        });

        client.publish({
          destination: "/app/test",
          body: "Hello from React (JWT)"
        });
      },

      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame.headers["message"]);
        setConnected(false);
      },

      onWebSocketClose: () => {
        setConnected(false);
      }
    });

    client.activate();

    return () => client.deactivate();

  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>WebSocket JWT Test</h2>

      <p>
        Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}
      </p>

      <div style={{ marginTop: "20px" }}>
        <h3>Messages:</h3>

        {messages.length === 0 && <p>No messages yet...</p>}

        {messages.map((msg, index) => (
          <div key={index} style={{
            background: "#f1f1f1",
            padding: "10px",
            marginBottom: "8px",
            borderRadius: "5px"
          }}>
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}