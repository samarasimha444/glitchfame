import { Activity, Users, DollarSign, Trophy } from "lucide-react"; 

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



  { label: "Description", name: "description", type: "textarea", full: true },
];


export const dashCards = [
  {
    title: "Active Seasons",
    icon: Activity,
    total: 4,
  },
  {
    title: "Total Participants",
    icon: Users,
    total: 1248,
  },
  {
    title: "Total Prize Value",
    icon: DollarSign,
    total: "$100.5K",
  },
  {
    title: "Active Sessions",
    icon: Trophy,
    total: 2,
  },
];
