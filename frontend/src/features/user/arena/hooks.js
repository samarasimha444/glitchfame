import { useQuery } from "@tanstack/react-query";
import { getContestantDetails, getVotersById } from "./api";




export const useContestantsById = (seasonId) => {
    console.log(seasonId)
  return useQuery({
    queryKey: ["contestants", seasonId], 
    queryFn: () => getVotersById(seasonId),
    enabled: !!seasonId, 
  });
};

export const useContestantDetails = (id) => {
  return useQuery({
    queryKey: ["contestant-details", id],
    queryFn: () => getContestantDetails(id),
    enabled: !!id, 
  })
}