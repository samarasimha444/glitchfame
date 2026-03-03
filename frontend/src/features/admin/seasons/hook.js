import { useQuery } from "@tanstack/react-query";
import { getPosts } from "./api";



export const usePosts = (page) => {
  return useQuery({
    queryKey: ["posts", page],
    queryFn: () => getPosts(page),
    keepPreviousData: true, 
  });
};