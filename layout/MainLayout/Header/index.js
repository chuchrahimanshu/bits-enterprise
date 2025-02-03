import React from "react";
import Navbar from "./Navbar";

const Appbarr = ({fetchmainApi,setRtl,isRtl,handleDrawerClose,isDarkTheme,handleDrawerOpen,toggle,setIsContainer,setIsDarkTheme}) => {
  return (
    <>
      <Navbar  fetchmainApi={fetchmainApi} setRtl={setRtl} isRtl={isRtl} handleDrawerClose={handleDrawerClose}toggle={toggle} isDarkTheme={isDarkTheme} handleDrawerOpen={handleDrawerOpen} setIsContainer={setIsContainer} setIsDarkTheme={setIsDarkTheme} />
    </>
  );
};

export default Appbarr;
