// socket.js
import { Client } from "@stomp/stompjs";

const WEB_URL = import.meta.env.VITE_WS_URL;

let client = null;
let isConnected = false;
let isSocketInitialized = false;
let subscriptions = {};

export const connectSocket = (token) => {
  // ✅ Prevent multiple initializations
  if (isSocketInitialized) return client;

  client = new Client({
    webSocketFactory: () => new WebSocket(WEB_URL),

    reconnectDelay: 5000,

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    onConnect: () => {
      console.log("✅ WebSocket Connected");
      isConnected = true;

      // 🔁 Re-subscribe all topics
      Object.entries(subscriptions).forEach(([topic, subObj]) => {
        if (!subObj.sub) {
          console.log("🔁 Re-subscribing:", topic);
          subObj.sub = client.subscribe(topic, subObj.callback);
        }
      });
    },

    onDisconnect: () => {
      console.log("❌ WebSocket Disconnected");
    },

    onWebSocketClose: () => {
      isConnected = false;
    },

    onStompError: (frame) => {
      console.error("🔥 STOMP Error:", frame);
    },
  });

  console.log("⚡ Activating client...");
  client.activate();

  isSocketInitialized = true;

  return client;
};

export const subscribeTopic = (topic, callback) => {
  if (!client) {
    console.log("❌ No client available");
    return;
  }

  // ✅ Prevent duplicate subscriptions
  if (subscriptions[topic]) {
    console.log("⚠️ Already subscribed:", topic);
    return subscriptions[topic];
  }

  const wrappedCallback = (msg) => {
    try {
      const data = JSON.parse(msg.body);
      callback(data);
    } catch (err) {
      console.error("❌ JSON parse error:", err);
    }
  };

  const subObj = {
    sub: null,
    callback: wrappedCallback,

    _subscribe: () => {
      if (!client) return;
      if (!isConnected) return; // wait for connection
      if (subObj.sub) return;

      console.log("📡 Subscribing:", topic);
      subObj.sub = client.subscribe(topic, wrappedCallback);
    },

    unsubscribe: () => {
      console.log("🛑 Unsubscribing:", topic);
      subObj.sub?.unsubscribe();
      subObj.sub = null;
      delete subscriptions[topic];
    },
  };

  subscriptions[topic] = subObj;

  // ✅ Try now OR auto later via onConnect
  subObj._subscribe();

  return subObj;
};

export const disconnectSocket = () => {
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
  isSocketInitialized = false;
};