import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSeason, endSeasonNow, fetchSeasonById, participationLock, toggleSeasonLock, toggleVoteLock, updatePrizePool, updateRegistrationDates } from "./api";


export const useFetchSeasonDetails = (seasonId) => {
  return useQuery({
    queryKey: ["season-details", seasonId],
    queryFn: () => fetchSeasonById(seasonId),
    enabled: !!seasonId,
  });
};

export const useToggleVoteLock = () => {
  const queryClient = useQueryClient();

  return useMutation({
     mutationFn: (id) => toggleVoteLock(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["seasons-details"]);
    },
  });
};

export const useToggleSeasonLock = () => {
  const queryClient = useQueryClient();

  return useMutation({
     mutationFn: (id) => toggleSeasonLock(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["seasons-details"]);
    },
  });
};

export const useDeleteSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSeason,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
    },
  });
};


export const useUpdatePrizePool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePrizePool,

    onSuccess: () => {
      queryClient.invalidateQueries(["season-details"]);
     
    },
  });
};


export const useEndSeasonNow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: endSeasonNow,

    onSuccess: () => {
      queryClient.invalidateQueries(["season-details"]);
    },
  });
}

export const useParticipationLock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: participationLock,
    onSuccess: () => {
      queryClient.invalidateQueries(["season-data"]);
    },
    onError: (err) => {
      console.error("Participation lock error:", err);
    },
  });
};


export const useUpdateRegistrationDates = () => {
  return useMutation({
    mutationFn: updateRegistrationDates,
  });
};