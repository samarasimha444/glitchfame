import { Client } from "@stomp/stompjs";

let client = null;
let isConnected = false;
let subscriptions = {};

export const connectSocket = (token) => {

  if (client?.active) return client;

  client = new Client({
    brokerURL: "ws://localhost:3000/ws",
    reconnectDelay: 5000,

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    onConnect: () => {
      console.log(" WebSocket Connected");

      isConnected = true;

      // restore subscriptions after reconnect
      Object.values(subscriptions).forEach((sub) => {
        sub.subscribe();
      });
    },

    onWebSocketClose: () => {
      console.log(" WebSocket Disconnected");
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

  const subscribeFn = () => {

    if (!isConnected) return;

    const sub = client.subscribe(topic, (msg) => {
      const data = JSON.parse(msg.body);
      callback(data);
    });

    subscriptions[topic].sub = sub;
  };

  subscriptions[topic] = {
    sub: null,

    subscribe: subscribeFn,

    unsubscribe: () => {
      subscriptions[topic]?.sub?.unsubscribe();
      delete subscriptions[topic];
    },
  };


  if (isConnected) subscribeFn();

  return subscriptions[topic];
};



export const disconnectSocket = () => {

  Object.values(subscriptions).forEach((s) => s?.unsubscribe());

  subscriptions = {};

  client?.deactivate();

  client = null;

  isConnected = false;

};