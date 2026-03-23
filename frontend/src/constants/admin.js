import { Activity, Users, DollarSign, Trophy, Calendar, Lock, ActivityIcon, ClockIcon } from "lucide-react"; 

 export const initialState = {
  name: "",
  prizeMoney: "",

  registrationStartDateDate: "",
  registrationStartDateTime: "",

  registrationEndDateDate: "",
  registrationEndDateTime: "",

  votingStartDateDate: "",
  votingStartDateTime: "",

  votingEndDateDate: "",
  votingEndDateTime: "",
  
  image: "",
};


 export const seasonfields = [
    { name: "name", label: "Name", type: "text" },
    { name: "prize", label: "Prize", type: "text" },
    { name: "description", label: "Description", type: "textarea", full: true },
    { name: "registrationStartDate", label: "Registration Start", type: "datetime-local" },
    { name: "registrationEndDate", label: "Registration End", type: "datetime-local" },
    { name: "votingStartDate", label: "Voting Start", type: "datetime-local" },
    { name: "votingEndDate", label: "Voting End", type: "datetime-local" }
  ];


export const dashCards = [
  {
    title: "Total Seasons",
    key: "totalSeasons",
    icon: Calendar
  },
  {
    title: "Total Prize Money",
    key: "totalPrizeMoney",
    icon: DollarSign
  },
  {
    title: "Voting Locked",
    key: "votingLocked",
    icon: Lock
  },
  {
    title: "Participation Locked",
    key: "participationLocked",
    icon: Users
  }
];

 export const menuItems = [
  
  { id: 1, label: "End Now", action: "end", color: "text-red-400" },
  {
    id: 2,
    label: "Modify Registration",
    action: "registration",
    color: "text-gray-300",
  },
  { id: 3, label: "Modify Voting", action: "voting", color: "text-gray-300" },
];


export const seasonInitialState = {
  name: "",
  description: "",
  prize: "",
  registrationStartDate: "",
  registrationEndDate: "",
  votingStartDate: "",
  votingEndDate: ""
};

export const settingCards = [

  {
    title: "Season Name",
    key: "seasonName",
    icon: DollarSign
  },
  {
    title: "PrizeMoney",
    key: "prizeMoney",
    icon: Calendar
  },
  

];

export const seasonCards = [
  {
    title: "Total Contestants",
    key: "totalContestants", 
    icon: Users,
  },
  {
    title: "Live Contestants",
    key: "totalLive", // ✅ MUST match
    icon: Activity,
  },
];