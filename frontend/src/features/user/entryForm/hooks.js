
const BASE_URL = import.meta.env.VITE_BASE_URL;

import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchMyApplications } from "../api";

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async ({ file, seasonId }) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "season_upload");

      const folderPath = `seasons/${seasonId}/contestants`;
      data.append("folder", folderPath);

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxt9cvxmg/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      
      const result = await res.json();

      if (!result.secure_url) {
        throw new Error("Image upload failed");
      }

      return result.secure_url;
    },
  });
};



export const useSubmitEntry = () => {
  return useMutation({
    mutationFn: async (payload) => {
        console.log(payload)

      const res = await fetch(`${BASE_URL}/participations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

          const text = await res.text();

     
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }


      
      if (!res.ok) {
        toast.error(data?.message || "Submission failed");
        throw new Error(data?.message || "Submission failed");
      }
      return data;
    },
  });
};



export const useMyApplications = () => {
  return useQuery({
    queryKey: ["my-applications"],
    queryFn: fetchMyApplications,

    
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false,
  });
};