import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSeason, fetchSeasons } from "./api";
import toast from "react-hot-toast";

export const useCreateSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSeason,
    onSuccess: () => {
      queryClient.invalidateQueries(["seasons"]); 
    },
  });
};


export const useFetchSeasons = () => {
  return useQuery({
    queryKey: ["seasons"],
    queryFn: fetchSeasons,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};



const uploadToCloudinary = async ({ file, folder }) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "season_upload");
  if (folder) data.append("folder", folder);

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dxt9cvxmg/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error?.message || "Upload failed");
  }

  return result.secure_url;
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadToCloudinary,

    onSuccess: () => {
      toast.success("Image uploaded successfully!");
    },

    onError: (error) => {
      toast.error(error.message || "Upload failed");
    },
  });
};