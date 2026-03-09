import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteContestant, getContestants, voteContestant } from "./api";




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
      // refresh contestants list
      queryClient.invalidateQueries(["contestants"]);
    },
  });
};