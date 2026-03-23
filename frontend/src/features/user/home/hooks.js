import { useMutation, useQuery} from "@tanstack/react-query";
import { getLiveUpcomingSeasons, getSeasonById, getWinners} from "./api";
import { changePasswordApi } from "../api";





export const useLiveUpcomingSeasons = (status) => {
  return useQuery({
    queryKey: ["liveUpcomingSeasons", status],
    queryFn: () => getLiveUpcomingSeasons(status),
    staleTime: 1000 * 60 * 5,
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



export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePasswordApi,

  });
};