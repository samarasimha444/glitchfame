import { Client } from "@stomp/stompjs";
import {  useQuery, useQueryClient } from "@tanstack/react-query";
import {  useEffect,  } from "react";
import {
  connectSocket,
  disconnectSocket,
  subscribeTopic,
} from "../../../../services/websocketservices";
import { fetchRandomParticipation, fetchSearchContestants } from "../arena/api";
import { fetchSeasonParticipation } from "../home/api";
import toast from "react-hot-toast";





export const useParticipation = (seasonId, search = "") => {
  console.log(seasonId);
  return useQuery({
    queryKey: ["participation", seasonId],

    queryFn: async () => {
      const data =
        seasonId ?
          await fetchSeasonParticipation(seasonId, search)
        : await fetchRandomParticipation();

      return data;
    },

    keepPreviousData: true,

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
      if (!token) return;
    connectSocket(token);

    const topic = `/topic/votes/${seasonId}`;

    const subscription = subscribeTopic(topic, (vote) => {
      console.log("LIVE VOTE:", vote);

      queryClient.setQueryData(["participation", seasonId], (oldData) => {
        if (!oldData?.participants?.content) return oldData;

        return {
          ...oldData,
          participants: {
            ...oldData.participants,
            content: oldData.participants.content.map((c) =>
              c.participationId === vote.participationId ?
                {
                  ...c,
                  totalVotes: vote.totalVotes ?? vote.votes ?? c.totalVotes,
                }
              : c,
            ),
          },
        };
      });

      const searchQueries = queryClient
        .getQueryCache()
        .findAll(
          (query) =>
            query.queryKey[0] === "searchContestants" &&
            query.queryKey[1] === seasonId,
        );

      searchQueries.forEach(({ queryKey }) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData?.content) return oldData;

          return {
            ...oldData,
            content: oldData.content.map((c) =>
              c.participationId === vote.participationId ?
                {
                  ...c,
                  totalVotes: vote.totalVotes ?? vote.votes ?? c.totalVotes,
                }
              : c,
            ),
          };
        });
      });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [seasonId, queryClient]);
};

export const useSearchContestants = (
  seasonId,
  name = "",
  page = 0,
  size = 20,
) => {
  return useQuery({
    queryKey: ["searchContestants", seasonId, name, page, size],
    queryFn: () => fetchSearchContestants(seasonId, name, page, size),
    enabled: !!seasonId && !!name,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};


const BASE_URL = import.meta.env.VITE_BASE_URL;




