// utils/format.js

export const formatAndValidateSeasonForm = (form) => {
  if (!form.name.trim()) {
    return { error: "Name is required" };
  }

  if (!form.prizeMoney || form.prizeMoney <= 0) {
    return { error: "Prize money must be greater than 0" };
  }

  if (!form.registrationStartDate ||
      !form.registrationEndDate ||
      !form.votingStartDate ||
      !form.votingEndDate) {
    return { error: "All dates are required" };
  }

  return {
    data: {
      name: form.name.trim(),
      prizeMoney: form.prizeMoney,
      registrationStartDate: form.registrationStartDate,
      registrationEndDate: form.registrationEndDate,
      votingStartDate: form.votingStartDate,
      votingEndDate: form.votingEndDate
    }
  };
};


export const isSeasonLive = (season) => {
  const now = new Date();

  const registrationStart = new Date(season.registrationStartDate);
  const registrationEnd = new Date(season.registrationEndDate);
  const votingStart = new Date(season.votingStartDate);
  const votingEnd = new Date(season.votingEndDate);

  const isRegistrationOpen = now >= registrationStart && now <= registrationEnd;
  const isVotingLive = now >= votingStart && now <= votingEnd;

  return isRegistrationOpen || isVotingLive;
};



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

 export const getTimeLeft=(time) =>{
    const endDate = new Date(time);
    const now = new Date();

    let diffInMs = endDate - now;

    if (diffInMs <= 0) {
      return "Voting Ended";
    }

    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    diffInMs -= days * 1000 * 60 * 60 * 24;

    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    diffInMs -= hours * 1000 * 60 * 60;

    const minutes = Math.floor(diffInMs / (1000 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ${hours} hour${hours > 1 ? "s" : ""} left`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes > 1 ? "s" : ""} left`;
    } else {
      return `${minutes} minute${minutes > 1 ? "s" : ""} left`;
    }
  }