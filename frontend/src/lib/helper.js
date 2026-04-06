// utils/format.js

import { useEffect, useState } from "react";
import toast from "react-hot-toast";






 export const getTimeLeft = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now > 0 ? end - now : 0; 

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `${days}d ${hours}h ${minutes}m`;
  };


  


export const isRegistrationOpen = (season) => {
  const now = new Date();
  const registrationStart = new Date(season.registrationStartDate);
  const registrationEnd = new Date(season.registrationEndDate);

  return now >= registrationStart && now <= registrationEnd;
};

 export const isVotingLive = (season) => {
  const now = new Date();
  const votingStart = new Date(season.votingStartDate);
  const votingEnd = new Date(season.votingEndDate);

  return now >= votingStart && now <= votingEnd;
};




export const validateSeasonDates = ({ registrationStart, registrationEnd, votingStart, votingEnd }) => {
  const errors = [];

  if (registrationStart >= registrationEnd) {
    errors.push("Registration start date must be before registration end date.");
  }

  if (votingStart >= votingEnd) {
    errors.push("Voting start date must be before voting end date.");
  }

  if (votingStart <= registrationEnd) {
    errors.push("Voting must start after registration ends.");
  }

  return errors; 
};

export const formatToISO = (value) => {
  if (!value) return null;
  return new Date(value).toISOString();
};






export const buildSeasonPayload = (form, imageUrl) => ({
  ...form,
  photoUrl: imageUrl,
  registrationStartDate: formatToISO(form.registrationStartDate),
  registrationEndDate: formatToISO(form.registrationEndDate),
  votingStartDate: formatToISO(form.votingStartDate),
  votingEndDate: formatToISO(form.votingEndDate),
});


export const getSeasonFolder = (name) =>
  `seasons/${name.trim().replace(/\s+/g, "-").toLowerCase()}/banner`;



export const isAdult = (dob) => {
  if (!dob) return false;
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18;
};




export const handleApiError = (error, { setShowLoginModal } = {}) => {
  const message = error?.message?.toLowerCase() || "";

  console.log("API ERROR:", message);

  
  if (message.includes("max 3 kills")) {
    toast.error("You can only perform 3 kills");
    return { type: "limit" };
  }

  if (message.includes("max") || message.includes("limit")) {
    toast.error("Action limit reached");
    return { type: "limit" };
  }

  if (message.includes("locked") || message.includes("ended")) {
    toast.error("Season has ended");
    return { type: "season-ended" };
  }

  if (message.includes("unauthorized") || message.includes("token")) {
    toast.error("Please login to continue");

    if (setShowLoginModal) {
      setShowLoginModal(true);
    }

    return { type: "login" };
  }

  if (message.includes("already")) {
    toast.error("Action already performed");
    return { type: "duplicate" };
  }

  toast.error(error.message || "Something went wrong");

  return { type: "unknown" };
};



 export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};