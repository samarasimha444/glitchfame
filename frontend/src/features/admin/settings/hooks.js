import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSeasonById, toggleSeasonLock } from "./api";


export const useFetchSeasonDetails = (seasonId) => {
  return useQuery({
    queryKey: ["season-details", seasonId],
    queryFn: () => fetchSeasonById(seasonId),
    enabled: !!seasonId,
  });
};

export const useToggleSeasonLock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleSeasonLock(),
    onSuccess: () => {
      queryClient.invalidateQueries(["seasons"]);
    },
  });
};