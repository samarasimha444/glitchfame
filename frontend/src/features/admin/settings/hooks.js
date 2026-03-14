import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSeason, endSeasonNow, fetchSeasonById, participationLock, toggleSeasonLock, toggleVoteLock, updatePrizePool,  updateSeasonDates } from "./api";
import toast from "react-hot-toast";


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
      queryClient.invalidateQueries(["useFetchSeasons"]);
    },
  });
};



export const useDeleteSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSeason,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
      window.location.reload();
      toast.success("deleted")
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
      toast.success("success")
    },
  });
}

export const useParticipationLock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: participationLock,
    onSuccess: () => {
      queryClient.invalidateQueries(["season-data"]);
      toast.success("success")
    },
    onError: (err) => {
      console.error("Participation lock error:", err);
      toast.error("something went wrong")
    },
  });
};


export const useUpdateSeasonDates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSeasonDates,
    onSuccess: (_, { id, type }) => {
    
      queryClient.invalidateQueries([`season-${id}-${type}-dates`]);
    },
    onError: (err) => {
      console.error(err);
    },
  });
};