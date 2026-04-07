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
        
          subObj.sub = client.subscribe(topic, subObj.callback);
        }
      });
    },

    onDisconnect: () => {
    
    },

    onWebSocketClose: () => {
      isConnected = false;
    },

    onStompError: (frame) => {
      
    },
  });

  
  client.activate();

  isSocketInitialized = true;

  return client;
};

export const subscribeTopic = (topic, callback) => {
  if (!client) {
   
    return;
  }

 
  if (subscriptions[topic]) {
   
    return subscriptions[topic];
  }

  const wrappedCallback = (msg) => {
    try {
      const data = JSON.parse(msg.body);
      callback(data);
    } catch (err) {
      throw new err
    }
  };

  const subObj = {
    sub: null,
    callback: wrappedCallback,

    _subscribe: () => {
      if (!client) return;
      if (!isConnected) return; // wait for connection
      if (subObj.sub) return;

  
      subObj.sub = client.subscribe(topic, wrappedCallback);
    },

    unsubscribe: () => {
  
      subObj.sub?.unsubscribe();
      subObj.sub = null;
      delete subscriptions[topic];
    },
  };

  subscriptions[topic] = subObj;

  
  subObj._subscribe();

  return subObj;
};

export const disconnectSocket = () => {
  Object.entries(subscriptions).forEach(([topic, s]) => {
   
    s?.unsubscribe();
  });

  subscriptions = {};

  if (client) {
  
    client.deactivate();
    client = null;
  }

  isConnected = false;
  isSocketInitialized = false;
};