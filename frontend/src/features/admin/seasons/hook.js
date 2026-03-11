import { useInfiniteQuery, useMutation,  useQuery,  useQueryClient } from "@tanstack/react-query";
import { deleteContestant, getContestants, getLiveContestants, updateContestantStatus, voteContestant } from "./api";




export const useContestants = () => {
  return useInfiniteQuery({
    queryKey: ["contestants"],
    queryFn: getContestants,

    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined; 
      return lastPage.number + 1;
    },
  });
};

export const useVoteContestant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voteContestant,

    onSuccess: () => {
      
      queryClient.invalidateQueries(["contestants"]);
    },
  });
};


export const useDeleteContestant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContestant,

    onSuccess: () => {
      queryClient.invalidateQueries(["contestants"]);
    },
  });
};


export const useUpdateContestantStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }) => updateContestantStatus(id, action),

    onSuccess: () => {
      // Invalidate contestants query so it refetches
      queryClient.invalidateQueries(["liveContestants"]);
    },

    onError: (error) => {
      console.error("Failed to update contestant:", error);
    },
  });
};

export const useLiveContestants = (page, size = 6) => {
  return useQuery({
    queryKey: ["liveContestants", page],
    queryFn: () => getLiveContestants(page, size),
    keepPreviousData: true,
  });
};