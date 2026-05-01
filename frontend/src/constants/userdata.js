 export const formFields = [
    { label: "In-game Name",  name: "name", type: "text" },
 { 
    label: "Mobile Number", 
     name: "mobileNumber",
    type: "tel", 
    required: true,
    placeholder: "Enter 10-digit number",
    maxLength: 10,      
    pattern: "[0-9]{10}" 
  },
    { label: "Location", name: "location", type: "text" }
  ];