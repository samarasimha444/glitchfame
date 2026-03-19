import { useQuery, useQueryClient } from "@tanstack/react-query";
import { connectSocket, disconnectSocket, subscribeTopic } from "../../../../services/websocketservices";
import { useEffect } from "react";

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/leaderboard/live", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const data = await res.json();

      const merged = Object.values(data).flat();

      merged.sort((a, b) => b.votes - a.votes);

      return {
        merged, 
        raw: data, 
      };
    },
  });
};


export const useLeaderboardSocket = (data) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!data) return;

    const token = localStorage.getItem("token");

    // connect socket
    connectSocket(token);

    // store subscriptions
    const subscriptions = Object.keys(data.raw).map((seasonId) =>
      subscribeTopic(`/topic/votes/${seasonId}`, (vote) => {
        queryClient.setQueryData(["leaderboard"], (oldData) => {
          if (!oldData) return oldData;

          const updated = oldData.merged.map((p) =>
            p.participantId === vote.participationId
              ? { ...p, votes: vote.votes }
              : p
          );

          // keep sorted
          updated.sort((a, b) => b.votes - a.votes);

          return {
            ...oldData,
            merged: updated,
          };
        });
      })
    );

    // cleanup
    return () => {
      subscriptions.forEach((sub) => sub?.unsubscribe?.());
      disconnectSocket();
    };
  }, [data, queryClient]);
};