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