import { Client } from "@stomp/stompjs";
import {  useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import {  useEffect,  } from "react";
import {
  connectSocket,
  disconnectSocket,
  subscribeTopic,
} from "../../../../services/websocketservices";
import { fetchRandomParticipation, fetchSearchContestants } from "../arena/api";
import { fetchSeasonParticipation } from "../home/api";






export const useParticipation = (seasonId, page = 0) => {
  return useQuery({
    queryKey: ["participation", seasonId,page],

    queryFn: async () => {
      console.log("FETCHING PAGE:", page); 

      const res = seasonId
        ? await fetchSeasonParticipation(seasonId, page, 10)
        : await fetchRandomParticipation(page, 8);

      return res;
    },

    keepPreviousData: true,
    
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
      console.log("🔥 LIVE VOTE:", vote);

      
      const queries = queryClient.getQueryCache().findAll();

      const participationQueries = queries.filter(
  (q) => q.queryKey[0] === "participation"
);

      
      participationQueries.forEach((query) => {
        queryClient.setQueryData(query.queryKey, (oldData) => {
          if (!oldData?.participants?.content) return oldData;

          let updated = false;

          const newContent = oldData.participants.content.map((c) => {
            if (String(c.participationId) === String(vote.participationId)) {
              const newVotes =
                vote.totalVotes ?? vote.votes ?? c.totalVotes;

              if (c.totalVotes === newVotes) return c;

              updated = true;

              return {
                ...c,
                totalVotes: newVotes,
              };
            }
            return c;
          });

          if (!updated) return oldData;

          return {
            ...oldData,
            participants: {
              ...oldData.participants,
              content: newContent,
            },
          };
        });
      });

    
      const searchQueries = queries.filter(
        (q) =>
          q.queryKey[0] === "searchContestants" &&
          String(q.queryKey[1]) === String(seasonId)
      );

      searchQueries.forEach((query) => {
        queryClient.setQueryData(query.queryKey, (oldData) => {
          if (!oldData?.content) return oldData;

          let updated = false;

          const newContent = oldData.content.map((c) => {
            if (String(c.participationId) === String(vote.participationId)) {
              const newVotes =
                vote.totalVotes ?? vote.votes ?? c.totalVotes;

              if (c.totalVotes === newVotes) return c;

              updated = true;

              return {
                ...c,
                totalVotes: newVotes,
              };
            }
            return c;
          });

          if (!updated) return oldData;

          return {
            ...oldData,
            content: newContent,
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




