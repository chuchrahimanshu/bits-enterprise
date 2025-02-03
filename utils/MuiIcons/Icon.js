import React from "react";
import * as MUIICon from "@mui/icons-material";

export const Icon = ({ color,iconName,sProps }) => {
  const Icons = MUIICon[iconName];
  if (!iconName || !Icons) {
    return <span></span>;
  }
  function parseData(input) {
    try {
      if (!input) {
        // Handle empty input
        return {};
      }
  
      if (typeof input === 'string') {
        // Try to parse if the input is a string
        return JSON.parse(input);
      }
  
      if (typeof input === 'object') {
        // Return the input if it is already an object
        return input;
      }
  
      // Handle unexpected input types
      throw new Error('Invalid input type');
    } catch (error) {
      // Handle JSON parsing errors or any other errors
      console.error('Error parsing input:', error);
      return {};
    }
  }
  // let data2 = { fontSize: "large" };
  return <><Icons  color={color||''}  sx={parseData(sProps)}  /></>
};
