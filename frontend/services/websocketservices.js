import { Client } from "@stomp/stompjs";

const WEB_URL = import.meta.env.VITE_WS_URL;

let client = null;
let isConnected = false;
let subscriptions = {};

export const connectSocket = (token) => {
  console.log("🚀 connectSocket called");
  console.log("🌐 WS URL:", WEB_URL);

  if (client?.active) {
    console.log("⚠️ Client already active");
    return client;
  }

  client = new Client({
    webSocketFactory: () => {
      console.log("🔌 Creating WebSocket...");
      return new WebSocket(WEB_URL);
    },

    reconnectDelay: 5000,

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    onConnect: () => {
      console.log("✅ WebSocket Connected");
      isConnected = true;

      console.log("📡 Re-subscribing to topics:", Object.keys(subscriptions));

      Object.entries(subscriptions).forEach(([topic, subObj]) => {
        console.log("🔁 Re-subscribing:", topic);

        // reset to force re-subscribe
        subObj.sub = null;
        subObj._subscribe();
      });
    },

    onDisconnect: () => {
      console.log("❌ WebSocket Disconnected");
    },

    onWebSocketClose: (event) => {
      console.log("⚠️ WebSocket Closed:", event);
      isConnected = false;
    },

    onWebSocketError: (error) => {
      console.error("🔥 WebSocket Error:", error);
    },

    onStompError: (frame) => {
      console.error("🔥 STOMP Broker error:", frame);
    },
  });

  console.log("⚡ Activating client...");
  client.activate();

  return client;
};

export const subscribeTopic = (topic, callback) => {
  console.log("📩 subscribeTopic called for:", topic);

  if (!client) {
    console.log("❌ No client available");
    return;
  }

  if (subscriptions[topic]) {
    console.log("⚠️ Already subscribed to:", topic);
    return subscriptions[topic];
  }

  const subObj = {
    sub: null,

    _subscribe: () => {
      console.log("➡️ محاولة subscribe:", topic);

      if (!client) {
        console.log("❌ Client missing");
        return;
      }

      if (!isConnected) {
        console.log("⏳ Not connected yet, skipping subscribe");
        return;
      }

      if (subObj.sub) {
        console.log("⚠️ Already has active subscription:", topic);
        return;
      }

      console.log("✅ Subscribing NOW to:", topic);

      subObj.sub = client.subscribe(topic, (msg) => {
        console.log("📨 MESSAGE RECEIVED RAW:", msg);

        try {
          console.log("📦 MESSAGE BODY:", msg.body);

          const data = JSON.parse(msg.body);

          console.log("✅ PARSED DATA:", data);

          callback(data);
        } catch (err) {
          console.error("❌ JSON parse error:", err);
        }
      });

      console.log("🎯 Subscription object:", subObj.sub);
    },

    unsubscribe: () => {
      console.log("🛑 Unsubscribing from:", topic);

      subObj.sub?.unsubscribe();
      subObj.sub = null;

      delete subscriptions[topic];
    },
  };

  subscriptions[topic] = subObj;

  console.log("📌 Stored subscription for:", topic);

  subObj._subscribe();

  return subObj;
};

export const disconnectSocket = () => {
  console.log("🔌 disconnectSocket called");

  Object.entries(subscriptions).forEach(([topic, s]) => {
    console.log("🛑 Cleaning subscription:", topic);
    s?.unsubscribe();
  });

  subscriptions = {};

  if (client) {
    console.log("❌ Deactivating client...");
    client.deactivate();
    client = null;
  }

  isConnected = false;

  console.log("✅ Socket fully disconnected");
};