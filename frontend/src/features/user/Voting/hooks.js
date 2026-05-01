import { Client } from "@stomp/stompjs";
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {  useEffect,  } from "react";
import {
  connectSocket,
  disconnectSocket,
  subscribeTopic,
} from "../../../../services/websocketservices";
import { fetchRandomParticipation, fetchSearchContestants, fetchSeasonParticipation } from "../arena/api";
import { handleApiError } from "../../../lib/helper";


const BASE_URL = import.meta.env.VITE_BASE_URL;


export const useVoteAction = ({ seasonId, setShowLoginModal }) => {
  
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ participationId, action }) => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/votes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ participationId, seasonId, action }),
      });

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = { message: "Something went wrong" };
        }
        throw new Error(errorData.message);
      }

      return res.json();
    },

    
    onMutate: async ({ participationId, action }) => {
      await queryClient.cancelQueries();

      const queries = queryClient.getQueryCache().findAll();

   
      const previousData = queries.map((q) => ({
        queryKey: q.queryKey,
        data: queryClient.getQueryData(q.queryKey),
      }));

   
      queries.forEach((query) => {
        queryClient.setQueryData(query.queryKey, (oldData) => {
          if (!oldData) return oldData;

          const updateUser = (user) => {
            if (String(user.participationId) !== String(participationId))
              return user;

            switch (action) {
              case "VOTE":
                return {
                  ...user,
                  hasVoted: !user.hasVoted,
                  hasKilled: false,
                };

              case "KILL":
                return {
                  ...user,
                  hasKilled: !user.hasKilled,
                  hasVoted: false,
                };

              default:
                return user;
            }
          };

          if (oldData?.participants?.content) {
            return {
              ...oldData,
              participants: {
                ...oldData.participants,
                content: oldData.participants.content.map(updateUser),
              },
            };
          }

          if (oldData?.content) {
            return {
              ...oldData,
              content: oldData.content.map(updateUser),
            };
          }

          return oldData;
        });
      });

     
      return { previousData };
    },

    //  ROLLBACK
    onError: (err, variables, context) => {
      handleApiError(err, { setShowLoginModal });

      // 🔥 ROLLBACK
      context?.previousData?.forEach(({ queryKey, data }) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
  });
};



export const useParticipation = (seasonId, page = 0,order) => {
  console.log(order)
  return useQuery({
    queryKey: ["participation", seasonId,page,order],

    queryFn: async () => {
       

      const res = seasonId
        ? await fetchSeasonParticipation(seasonId, page, 12,order)
        : await fetchRandomParticipation(page, 12,order);
      
      return (
        res || {
          participants: {
            content: [],
            totalPages: 0,
          },
          season: null,
        }
      );
    },

  keepPreviousData:true,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    
  });
};






export const useSeasonVotes = (seasonId) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!seasonId) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    connectSocket(token); // ✅ same name

    const topic = `/topic/votes/${seasonId}`;

    const subscription = subscribeTopic(topic, (vote) => {
      console.log("🔥 LIVE UPDATE:", vote);

      const queries = queryClient.getQueryCache().findAll();

      // participation
      queries
        .filter((q) => q.queryKey[0] === "participation")
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (oldData) => {
            if (!oldData?.participants?.content) return oldData;

            let updated = false;

            const newContent = oldData.participants.content.map((c) => {
              if (String(c.participationId) === String(vote.participationId)) {
                const newScore = vote.score ?? c.score;
                const newRank = vote.rank ?? c.rank;

                if (c.score === newScore && c.rank === newRank) return c;

                updated = true;

                return { ...c, score: newScore, rank: newRank };
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

      // search
      queries
        .filter(
          (q) =>
            q.queryKey[0] === "searchContestants" &&
            String(q.queryKey[1]) === String(seasonId)
        )
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (oldData) => {
            if (!oldData?.content) return oldData;

            let updated = false;

            const newContent = oldData.content.map((c) => {
              if (String(c.participationId) === String(vote.participationId)) {
                const newScore = vote.score ?? c.score;
                const newRank = vote.rank ?? c.rank;

                if (c.score === newScore && c.rank === newRank) return c;

                updated = true;

                return { ...c, score: newScore, rank: newRank };
              }
              return c;
            });

            if (!updated) return oldData;

            return { ...oldData, content: newContent };
          });
        });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [seasonId]); // ✅ IMPORTANT: remove queryClient
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






