import { Client } from "@stomp/stompjs";

export const createLeaderboardSocket = ({
  users,
  queryClient,
  onConnect,
  onDisconnect
}) => {

  const token = localStorage.getItem("token");

  const client = new Client({
    brokerURL: `${import.meta.env.VITE_BASE_URL.replace("http","ws")}/ws`,
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  client.onConnect = () => {

    onConnect?.();

    const seasonIds = [...new Set(users.map(u => u.season_id))];

    seasonIds.forEach((seasonId) => {

      client.subscribe(`/topic/leaderboard/${seasonId}`, (message) => {

        const updated = JSON.parse(message.body);

        queryClient.setQueryData(["leaderboard"], (oldData) => {

          if (!oldData) return updated;

          const map = new Map(
            oldData.map(p => [p.participation_id, p])
          );

          updated.forEach((p) => {
            map.set(p.participation_id, p);
          });

          return Array.from(map.values());

        });

      });

    });

  };

  client.onWebSocketClose = () => {
    onDisconnect?.();
  };

  return client;
};