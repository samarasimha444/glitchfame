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
import toast from "react-hot-toast";





export const useParticipation = (seasonId, search = "") => {
  return useInfiniteQuery({
    queryKey: ["participation", seasonId],

    queryFn: async ({ pageParam = 0 }) => {
      const res =
        seasonId
          ? await fetchSeasonParticipation(seasonId, search, pageParam)
          : await fetchRandomParticipation(pageParam);

     

      return res
    },

    getNextPageParam: (lastPage) => {
      return !lastPage.last ? lastPage.number + 1 : undefined;
    },
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
  if (!oldData?.pages) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map((page) => {
      if (!page?.participants?.content) return page;

      const updatedContent = page.participants.content.map((c) => {
        if (c.participationId === vote.participationId) {
          return {
            ...c,
            totalVotes:
              vote.totalVotes ?? vote.votes ?? c.totalVotes,
          };
        }
        return c;
      });

      return {
        ...page,
        participants: {
          ...page.participants,
          content: updatedContent,
        },
      };
    }),
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




