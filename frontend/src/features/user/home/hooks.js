import { useMutation, useQuery} from "@tanstack/react-query";
import { getLiveUpcomingSeasons, getSeasonById, getWinners} from "./api";
import { changePasswordApi, getProfile } from "../api";
import { useState,useEffect, useRef } from "react";


export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5, 
    retry: 1,

    refetchOnWindowFocus: false,
  });
};


export const useLiveUpcomingSeasons = (status) => {
  return useQuery({
    queryKey: ["liveUpcomingSeasons", status],
    queryFn: () => getLiveUpcomingSeasons(status),
    staleTime: 1000 * 60 * 2,
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


export const useInView = (threshold = 0.4) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // run only once
        }
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, inView };
};


export const useScrambleText = (text = "", trigger = false) => {
  const [output, setOutput] = useState(text);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!trigger || hasAnimated.current) return;

    hasAnimated.current = true;

    const chars = "!<>-_\\/[]{}—=+*^?#________";
    let frame = 0;

    const interval = setInterval(() => {
      let newText = "";

      for (let i = 0; i < text.length; i++) {
        if (i < frame) {
          newText += text[i];
        } else if (text[i] === " " || text[i] === "\n") {
          newText += " ";
        } else {
          newText += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setOutput(newText);

      frame += 0.5; // 🔥 slower reveal

      if (frame >= text.length) {
        setOutput(text);
        clearInterval(interval);
      }
    }, 40); // 🔥 slower speed

    return () => clearInterval(interval);
  }, [text, trigger]);

  return output;
};