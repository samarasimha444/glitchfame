import { Client } from "@stomp/stompjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRef } from "react";
import { connectSocket, disconnectSocket, subscribeTopic } from "../../../../services/websocketservices";
import { fetchRandomParticipation } from "../arena/api";
import { fetchSeasonParticipation } from "../home/api";






export const useParticipation = (seasonId) => {
  return useQuery({
    queryKey: ["participation"], 

    queryFn: () =>
      seasonId
        ? fetchSeasonParticipation(seasonId)
        : fetchRandomParticipation(),

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};




export const useSeasonVotes = (seasonId) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!seasonId) return;

    const token = localStorage.getItem("token");
    connectSocket(token);

    const topic = `/topic/votes/${seasonId}`;

    const subscription = subscribeTopic(topic, (vote) => {
      console.log("LIVE VOTE:", vote);

      queryClient.setQueryData(["participation"], (oldData) => {
        if (!oldData?.contestants) return oldData;

        return {
          ...oldData,
          contestants: oldData.contestants.map((c) =>
            c.participationId === vote.participationId
              ? { ...c, votes: vote.votes }
              : c
          ),
        };
      });
    });

    return () => subscription?.unsubscribe();
  }, [seasonId, queryClient]);
};