import { useQuery } from "@tanstack/react-query";
import { getVotersById } from "./api";




export const useContestantsById = (seasonId) => {
    console.log(seasonId)
  return useQuery({
    queryKey: ["contestants", seasonId], 
    queryFn: () => getVotersById(seasonId),
    enabled: !!seasonId, 
  });
};