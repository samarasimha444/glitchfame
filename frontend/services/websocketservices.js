import { Client } from "@stomp/stompjs";

const WEB_URL = import.meta.env.VITE_WS_URL;

let client = null;
let isConnected = false;
let subscriptions = {};

export const connectSocket = (token) => {
 

  if (client?.active) {
    
    return client;
  }

  client = new Client({
    webSocketFactory: () => {
      
      return new WebSocket(WEB_URL);
    },

    reconnectDelay: 5000,

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    onConnect: () => {
      
      isConnected = true;

      // console.log("📡 Re-subscribing to topics:", Object.keys(subscriptions));

      Object.entries(subscriptions).forEach(([topic, subObj]) => {
       

        
        subObj.sub = null;
        subObj._subscribe();
      });
    },

    onDisconnect: () => {
      // console.log("❌ WebSocket Disconnected");
    },

    onWebSocketClose: (event) => {
      // console.log("⚠️ WebSocket Closed:", event);
      isConnected = false;
    },

    onWebSocketError: (error) => {
      // console.error("🔥 WebSocket Error:", error);
    },

    onStompError: (frame) => {
      // console.error("🔥 STOMP Broker error:", frame);
    },
  });

  console.log("⚡ Activating client...");
  client.activate();

  return client;
};

export const subscribeTopic = (topic, callback) => {
  

  if (!client) {
    console.log("❌ No client available");
    return;
  }

  if (subscriptions[topic]) {
    // console.log("⚠️ Already subscribed to:", topic);
    return subscriptions[topic];
  }

  const subObj = {
    sub: null,

    _subscribe: () => {
      // console.log("➡️ محاولة subscribe:", topic);

      if (!client) {
        
        return;
      }

      if (!isConnected) {
       
        return;
      }

      if (subObj.sub) {
   
        return;
      }

     

      subObj.sub = client.subscribe(topic, (msg) => {
       

        try {
       

          const data = JSON.parse(msg.body);

         

          callback(data);
        } catch (err) {
          console.error("❌ JSON parse error:", err);
        }
      });

      
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

 
};