import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLiveUpcomingSeasons, submitEntry } from "./api";





export const useLiveUpcomingSeasons = () => {
  return useQuery({
    queryKey: ["liveUpcomingSeasons"],
    queryFn: getLiveUpcomingSeasons,
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