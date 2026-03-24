 export const formFields = [
    { label: "In-game Name",  name: "name", type: "text" },
 { 
    label: "Mobile Number", 
    name: "mobile", 
    type: "tel", 
    required: true,
    placeholder: "Enter 10-digit number",
    maxLength: 10,      // limits input to 10 digits
    pattern: "[0-9]{10}" // ensures exactly 10 digits
  },
    { label: "Location", name: "location", type: "text" }
  ];