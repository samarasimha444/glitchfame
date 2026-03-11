import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLiveUpcomingSeasons, getWinners, submitEntry } from "./api";





export const useLiveUpcomingSeasons = (status) => {
  return useQuery({
    queryKey: ["liveUpcomingSeasons", status],
    queryFn: () => getLiveUpcomingSeasons(status),
    staleTime: 1000 * 60 * 5,
  });
};
export const useSubmitEntry = () => {

  return useMutation({
    mutationFn: (entryData) => submitEntry(entryData),
    onSuccess: (data) => {
      console.log("Entry submitted successfully:", data);
    },
    onError: (error) => {
      console.error("Error submitting entry:", error);
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