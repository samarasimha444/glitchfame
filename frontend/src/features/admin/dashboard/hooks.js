import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSeason, fetchSeasons } from "./api";

export const useCreateSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSeason,
    onSuccess: () => {
      queryClient.invalidateQueries(["seasons"]); 
    },
  });
};


export const useFetchSeasons = () => {
  return useQuery({
    queryKey: ["seasons"],
    queryFn: fetchSeasons,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};