import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteContestant,
  getContestants,
  getLiveContestants,
  searchContestants,
  updateContestantStatus,
  voteContestant,
} from "./api";
import toast from "react-hot-toast";

export const useContestants = () => {
  return useInfiniteQuery({
    queryKey: ["contestants"],
    queryFn: getContestants,

    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
  });
};

export const useVoteContestant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voteContestant,

    onSuccess: () => {
      queryClient.invalidateQueries(["contestants"]);
    },
  });
};

export const useDeleteContestant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteContestant(id),

    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(["liveContestants"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            content: page.content.filter(
              (item) => item.participationId !== deletedId,
            ),
          })),
        };
      });

      toast.success("Deleted successfully");

      queryClient.invalidateQueries({ queryKey: ["liveContestants"] });
    },

    onError: () => {
      toast.error("Failed to delete");
    },
  });
};
export const useUpdateContestantStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }) => updateContestantStatus(id, action),

    onSuccess: () => {
      queryClient.invalidateQueries(["liveContestants"]);
      toast.success;
    },

    onError: (error) => {
      console.error("Failed to update contestant:", error);
      toast.error("something went wrrong");
    },
  });
};

export const useLiveContestants = (page, size = 6) => {
  return useQuery({
    queryKey: ["liveContestants", page],
    queryFn: () => getLiveContestants(page, size),
    keepPreviousData: true,
  });
};

export const useSearchContestants = (name, seasonId) => {
  return useQuery({
   
    queryKey: ["contestants", "search", name, seasonId],

   
    queryFn: () => searchContestants({ name, seasonId }),

    
    enabled: !!name?.trim(),

   
    staleTime: 1000 * 60 * 5,

    
    keepPreviousData: true,
  });
};