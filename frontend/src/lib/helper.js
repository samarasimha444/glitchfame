// utils/format.js




export const buildLeaderboard = (users) => {

  if (!users) return [];

  return users
    .map((user) => ({
      id: user.participation_id,
      name: user.participant_name,
      score: user.vote_count,
      img: user.photo_url
    }))
    .sort((a, b) => b.score - a.score)
    .map((p, index) => ({
      ...p,
      rank: index + 1
    }));

};

 export const getTimeLeft = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now > 0 ? end - now : 0; // no negative values

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `${days}d ${hours}h ${minutes}m`;
  };


  
export const getVoteButtonProps = (status) => {
  let text = "VOTE";
  let className =
    "bg-[#BE5EED] text-black hover:opacity-90";

  if (status === "loading") {
    text = "Voting...";
    className = "bg-gray-400 cursor-not-allowed text-black";
  } else if (status === "voted") {
    text = "Unvote";
    className = "bg-pink-400 cursor-pointer text-white";
  }

  return {
    text,
    className,
    disabled: status === "loading",
  };
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


export const combineDateTimeToUTC = (date, time) => {
  if (!date || !time) return "";
  const [year, month, day] = date.split("-");
  const [hours, minutes] = time.split(":");
  const d = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
  return d.toISOString(); // "YYYY-MM-DDTHH:mm:ss.sssZ"
};


export const prepareFormData = (form) => {
  const formData = new FormData();
  const dateTimes = {};
  const processedKeys = new Set();

  Object.keys(form).forEach((key) => {
    if (processedKeys.has(key)) return;

    if (key.endsWith("Date")) {
      const baseKey = key.replace("Date", "");
      const date = form[`${baseKey}Date`];
      const time = form[`${baseKey}Time`];
      const combined = combineDateTimeToUTC(date, time);

      formData.append(baseKey, combined);
      dateTimes[baseKey] = combined;

      processedKeys.add(`${baseKey}Date`);
      processedKeys.add(`${baseKey}Time`);
    } else if (!key.endsWith("Time")) {
      formData.append(key, form[key]);
    }
  });

  return { formData, dateTimes };
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