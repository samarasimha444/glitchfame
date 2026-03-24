// utils/format.js






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




export const handleVoteError = (err, { setShowLoginModal }) => {
  console.log(err);

  const message = err?.message || "";

  // 🔥 case 1: vote limit
  if (
    message.includes("limit") ||
    message.includes("constructor") ||
    message.includes("5")
  ) {
    return {
      type: "toast",
      message: "Vote limit reached",
    };
  }

  // 🔥 case 2: auth issue
  if (
    message.includes("401") ||
    message.includes("Unauthorized") ||
    message.includes("token")
  ) {
    return {
      type: "login",
    };
  }

  // 🔥 fallback
  return {
    type: "login",
  };
};


// const decodeToken = (token) => {
//   try {
//     const payload = token.split(".")[1];
//     const decoded = JSON.parse(atob(payload));
//     return decoded;
//   } catch (err) {
//     return null;
//   }
// };

export const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));
    return decoded;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);

  console.log("FULL TOKEN:", token);
  console.log("DECODED TOKEN:", decoded); // 🔥 this shows everything

  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;

  console.log("EXP:", decoded.exp);
  console.log("CURRENT:", currentTime);
  console.log("IS EXPIRED:", decoded.exp < currentTime);

  return decoded.exp < currentTime;
};