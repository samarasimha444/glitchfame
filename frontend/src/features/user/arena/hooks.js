import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getContestantDetails, getLeaderboard, getVotersById, toggleVote } from "./api";




export const useContestantsById = (seasonId) => {
    console.log(seasonId)
  return useQuery({
    queryKey: ["contestants", seasonId], 
    queryFn: () => getVotersById(seasonId),
    enabled: !!seasonId, 
  });
};

export const useContestantDetails = (id) => {
  return useQuery({
    queryKey: ["contestant-details", id],
    queryFn: () => getContestantDetails(id),
    enabled: !!id, 
  })
}

export const useToggleVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (participationId) => toggleVote(participationId),

    onSuccess: () => {
      queryClient.invalidateQueries(["contestantDetails"]);
    },
  });
};



export const useLeaderboard = () => {
  return useQuery({
    queryKey: ["leaderboard"], 
    queryFn: getLeaderboard,
    // staleTime: 1000 * 60,      
    // refetchInterval: 5000,  
  });
};