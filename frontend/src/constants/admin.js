import { Activity, Users, DollarSign, Trophy, Calendar, Lock } from "lucide-react"; 

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


export const fields = [
  {
    label: "Season Name *",
    name: "name",
    type: "text",
    required: true,
    full: true,
  },
  { label: "Prize Money", name: "prizeMoney", type: "number" },

  {
    label: "Registration Start",
    name: "registrationStartDate",
    type: "datetime",
  },
  { label: "Registration End", name: "registrationEndDate", type: "datetime" },

  { label: "Voting Start", name: "votingStartDate", type: "datetime" },
  { label: "Voting End", name: "votingEndDate", type: "datetime" },

    {
    label: "image",
    name: "image",
    type: "file",
    accept: "image/*",
  },


  { label: "Description", name: "seasonDesc", type: "textarea", full: true },
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
  {
    id: 1,
    label: "Participation Lock",
    action: "lock",
    color: "text-gray-300",
  },
  { id: 2, label: "End Now", action: "end", color: "text-red-400" },
  {
    id: 3,
    label: "Modify Registration",
    action: "registration",
    color: "text-gray-300",
  },
  { id: 4, label: "Modify Voting", action: "voting", color: "text-gray-300" },
];