import React, { useState, useEffect, memo } from "react";
import * as MUIICon from "@mui/icons-material";

export const Icon=({ iconName }) => {
  const Icons = MUIICon[iconName];
if(!iconName || !Icons)
{
  return <span></span>
}
  return <Icons />;
};
