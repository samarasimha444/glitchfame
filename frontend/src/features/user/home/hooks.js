import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLiveUpcomingSeasons, getSeasonById, getWinners, submitEntry } from "./api";





export const useLiveUpcomingSeasons = (status) => {
  return useQuery({
    queryKey: ["liveUpcomingSeasons", status],
    queryFn: () => getLiveUpcomingSeasons(status),
    staleTime: 1000 * 60 * 5,
  });
};
export const useSubmitEntry = () => {
  return useMutation({
    mutationFn: submitEntry,

    onSuccess: (data) => {
      console.log("Entry submitted successfully:", data);
    },

    onError: (error) => {
      console.error("Entry submission failed:", error.message);
    },
  });
};


export const useWinners = () => {
  return useQuery({
    queryKey: ["winners"],
    queryFn: getWinners,
   keepPreviousData: true,
  });
};

export const useSeasonById = (id) => {
  return useQuery({
    queryKey: ["seasonId", id],
    queryFn: () => getSeasonById(id),
    enabled: !!id, 
  });
};