import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {  getContestantDetails, getLeaderboard, getVotersById, loginUser, resetPassword, sendOtp, toggleVote } from "./api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";




export const useContestantsById = (seasonId, page = 0, size = 4, name = "") => {
  return useQuery({
    queryKey: ["contestants", seasonId, page, size, name], 
    queryFn: () => getVotersById(seasonId, page, size, name), 
    enabled: !!seasonId, 
    keepPreviousData: true, 
    staleTime: 5000 * 60, 
  });
};

export const useContestantDetails = (id) => {
  return useQuery({
    queryKey: ["contestant-details", id],
    queryFn: () => getContestantDetails(id),
    enabled: !!id, 
  })
}

export const useToggleVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleVote,

    onSuccess: (data) => {
      const { participationId, hasVoted } = data;

      queryClient.setQueryData(["contestants"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          content: oldData.content.map((user) =>
            user.id === participationId
              ? { ...user, hasVoted }
              : user
          ),
        };
      });

      toast.success(hasVoted ? "Voted successfully ❤️" : "Vote removed ❌");
    },

    onError: () => {
      toast.error("Voting failed");
    },
  });
};


export const useLeaderboard = () => {
  return useQuery({
    queryKey: ["leaderboard"], 
    queryFn: getLeaderboard,
    // staleTime: 1000 * 60,      
    // refetchInterval: 5000,  
  });
};


export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (token) => {
      
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      const role = decoded.role;
      if (role === "ADMIN") navigate("/admin");
      else navigate("/home");
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: sendOtp,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};