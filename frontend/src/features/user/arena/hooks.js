import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {  getContestantDetails, getLeaderboard, getVotersById, toggleVote } from "./api";




export const useContestantsById = (seasonId, page = 0, size = 4) => {
  return useQuery({
    queryKey: ["contestants", seasonId, page, size], 
    queryFn: () => getVotersById(seasonId, page, size),
    enabled: !!seasonId, 
    keepPreviousData: true, 
    staleTime: 5000 * 60, 
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


