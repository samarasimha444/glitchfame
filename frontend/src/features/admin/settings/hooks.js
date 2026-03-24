import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSeason, endSeasonNow, fetchSeasonById, participationLock, resetSeasonApi, toggleSeasonLock, updatePrizePool,  updateSeasonDates } from "./api";
import toast from "react-hot-toast";


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
     mutationFn: (id) => toggleSeasonLock(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["useFetchSeasons"]);
      toast.success("success")
    },
    onError:()=>{
       toast.error("Failed")

    }
  });
};






export const useUpdatePrizePool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePrizePool,

    onSuccess: () => {
      queryClient.invalidateQueries(["season-details"]);
      toast.success("success")
    },
    onError:()=>{
      toast.error("something went wrong")
    }
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
    onError:()=>{
      toast.error("failed")
    }
  });
}


//un
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


export const useDeleteSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSeason,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
      toast.success("Season deleted successfully");
    },

    onError: () => {
      toast.error("Failed to delete season");
    },
  });
};


 export const useResetSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetSeasonApi,

    onSuccess: () => {
      queryClient.invalidateQueries(["seasons"]);
      queryClient.invalidateQueries(["seasonDetails"]);
      toast.success('success')
    },

    onError:()=>{
      toast.error("error")
    }
  });
};

export const useUpdateSeasonDates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSeasonDates,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["season-details", variables.id],
      });
    },
  });
};