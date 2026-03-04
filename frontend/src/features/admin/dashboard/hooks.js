import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSeason } from "./api";

export const useCreateSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSeason,
    onSuccess: () => {
      queryClient.invalidateQueries(["seasons"]); 
    },
  });
};