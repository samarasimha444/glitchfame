import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLeaderboards } from "../home/api";
import { connectSocket, subscribeTopic } from "../../../../services/websocketservices";
import { useEffect } from "react";

export const useLeaderboards = () => {
  return useQuery({
    queryKey: ["leaderboards"],
    queryFn: fetchLeaderboards,

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};


export const useLeaderboardVotes = (leaderboards) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!leaderboards) return;

    const token = localStorage.getItem("token");
    const socket = connectSocket(token);

    let subscriptions = [];

    const subscribe = () => {
      Object.keys(leaderboards).forEach((seasonId) => {
        const sub = subscribeTopic(`/topic/votes/${seasonId}`, (vote) => {
          console.log("LIVE LEADERBOARD VOTE:", vote);

          queryClient.setQueryData(["leaderboards"], (oldData) => {
            if (!oldData) return oldData;

            const season = oldData[seasonId];
            if (!season) return oldData;

            const updated = season.map((p) =>
              p.participantId === vote.participationId
                ? { ...p, votes: vote.votes }
                : p
            );

            updated.sort((a, b) => b.votes - a.votes);

            return {
              ...oldData,
              [seasonId]: updated.slice(0, 3),
            };
          });
        });

        subscriptions.push(sub);
      });
    };

    if (socket.connected) {
      subscribe();
    } else {
      socket.onConnect = subscribe;
    }

    return () => {
      subscriptions.forEach((s) => s?.unsubscribe());
    };
  }, [leaderboards, queryClient]);
};