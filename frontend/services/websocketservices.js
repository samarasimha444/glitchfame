import { Client } from "@stomp/stompjs";
const BASE_URL = import.meta.env.VITE_WS_URL;

let client = null;
let isConnected = false;
let subscriptions = {};

export const connectSocket = (token) => {
  if (client?.active) return client;

  client = new Client({
    brokerURL: BASE_URL,
    reconnectDelay: 5000,

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    onConnect: () => {
      console.log(" WebSocket Connected");
      isConnected = true;

      Object.entries(subscriptions).forEach(([topic, subObj]) => {
        subObj._subscribe(); 
      });
    },

    onWebSocketClose: () => {
      
      isConnected = false;
    },

    onStompError: (frame) => {
      console.error("Broker error:", frame);
    },
  });

  client.activate();
  return client;
};

export const subscribeTopic = (topic, callback) => {
  if (!client) return;

  
  if (subscriptions[topic]) return subscriptions[topic];

  const subObj = {
    sub: null,

    _subscribe: () => {
      if (!client || !isConnected) return;

     
      if (subObj.sub) return;

      subObj.sub = client.subscribe(topic, (msg) => {
        const data = JSON.parse(msg.body);
        callback(data);
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
  Object.values(subscriptions).forEach((s) => s?.unsubscribe());

  subscriptions = {};

  if (client) {
    client.deactivate();
    client = null;
  }

  isConnected = false;

  
};