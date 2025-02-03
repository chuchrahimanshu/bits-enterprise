import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { Tooltip } from "@mui/material";
import Appbarr from "../Header";
import axios from "axios";
import { baseURL } from "../../../api";
import SpeedDialMenu from "../SpeedDialMenu";
import SideNavMenu from "../../../component/SideNavMenu/SideNavMenu";
import BottmMenu from "../BottomMenu";
import { serverAddress } from "../../../config";
import CustomAlert from "../../../component/AlertComponent/Alert";
import { useLocation } from "react-router-dom";
import { Global_Data } from "../../../globalData/GlobalData";

const drawerWidth = 300;

const openedMixin = theme => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: "hidden"
});

const closedMixin = theme => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",

  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== "open"
})(({ theme, open }) => ({
  zIndex: 999,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    // marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== "open"
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,

  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme)
  })
}));

const SideDrawer = ({ children, fetchmainApi }) => {
  const theme = useTheme();
  const location = useLocation();
  const route = location.pathname;
  const { token, globalvariables } = Global_Data();
  const [open, setOpen] = React.useState(true);
  const [drawerdata, setDawerdata] = React.useState();
  // const [current, setCurrent] = React.useState();
  const [sDial, setSpeedDial] = React.useState();
  const [bottomM, setbottomM] = React.useState();
  const [company, setCompany] = React.useState({});
  const [customError, setCustomError] = React.useState("");
  const [isContainer, setIsContainer] = React.useState(true);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const [isRtl, setRtl] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(!open);
  };

  useEffect(() => {
    axios
      .get(`${baseURL}/menu/get/DRAWER`, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      })
      .then(result => setDawerdata(result?.data?.data?.menu))
      .catch(() => setCustomError("Something went Wrong"));

    axios
      .get(`${baseURL}/menu/get/SPEED`, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      })
      .then(result => setSpeedDial(result.data.data.menu))
      .catch(() => setCustomError("Something went Wrong"));

    axios
      .get(`${baseURL}/menu/get/BOTTOM`, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      })
      .then(result => setbottomM(result.data.data.menu))
      .catch(() => setCustomError("Something went Wrong"));

    // axios
    //   .get(`${serverAddress}/getCompanyDetail`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`
    //       // Other headers if needed
    //     }
    //   })
    //   .then(response => {
    //     // setCompany(response.data);
    //   })
    //   .catch(() => {
    //     setCustomError("Something went Wrong");
    //   });
  }, [route]);
  const [CompanyLogo, setCompanyLogo] = useState(null);
  const GetImg = async imgId => {
    const requestOptions = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    fetch(serverAddress + `/image/retrieve?imageid=${imgId}`, requestOptions)
      .then(response => response.blob())
      .then(blob => {
        const objectURL = URL.createObjectURL(blob);
        setCompanyLogo(objectURL);
    
      })
      .catch(error => {
        console.error("Error fetching image:", error);
      });
  };
  useEffect(() => {
    GetImg(globalvariables?.CompanyLogo);
  }, [globalvariables?.CompanyLogo]);
  // console.log(drawerdata,'drawerdata');
  return (
    <>
      {customError !== "red" && <CustomAlert severity="error" message={customError} />}
      <Box
        sx={{
          display: location.pathname == "/login" ? "none" : "flex",
          direction: isRtl ? "rtl" : "ltr"
        }}
      >
        <CssBaseline />
        <AppBar
          sx={{ bgcolor: "#fff", marginRight: isRtl && open ? `${drawerWidth}px` : 0 }}
          position="fixed"
          open={open}
        >
          <Toolbar>
            {/* <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                color: "#000",
                marginRight: 1,
                ...(open && { display: "none" })
              }}
            >
              <MenuIcon />
            </IconButton> */}

            <Appbarr
              fetchmainApi={fetchmainApi}
              setRtl={setRtl}
              isRtl={isRtl}
              isDarkTheme={isDarkTheme}
              toggle={open}
              handleDrawerOpen={setOpen}
              handleDrawerClose={handleDrawerClose}
              setIsContainer={setIsContainer}
              setIsDarkTheme={setIsDarkTheme}
            />
          </Toolbar>
        </AppBar>

        <Drawer anchor={isRtl ? "right" : "left"} variant="permanent" open={open}>
          <div
            style={{
              backgroundColor: isDarkTheme && "#1E1E1E",
              color: isDarkTheme && "white",
              height: "100vh"
            }}
          >
            <DrawerHeader>
              <>
                <Box
                  component="img"
                  sx={{
                    height: 55,
                    width: 190
                  }}
                  alt={company?.data?.sOrgName}
                  src={CompanyLogo}
                  href="/"
                />

                {/* {company?.data?.slogo !== null || undefined ? (
                  44
                ) : (
                  <>
                    <Typography
                      variant="h5"
                      noWrap
                      component="a"
                      href="/"
                      sx={{
                        mr: 2,
                        display: { xs: "none", md: "flex" },
                        fontFamily: "monospace",
                        fontWeight: 700,
                        letterSpacing: ".3rem",
                        color: "inherit",
                        textDecoration: "none"
                      }}
                    >
                      {company?.data?.sOrgName}
                    </Typography>
                    <Typography
                      variant="h5"
                      noWrap
                      component="a"
                      href=""
                      sx={{
                        mr: 2,
                        display: { xs: "flex", md: "none" },
                        flexGrow: 1,
                        fontFamily: "monospace",
                        fontWeight: 700,
                        letterSpacing: ".3rem",
                        color: "inherit",
                        textDecoration: "none"
                      }}
                    >
                      {company?.data?.sOrgName}
                    </Typography>
                  </>
                )} */}
              </>

              <IconButton onClick={handleDrawerClose}>
                {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </DrawerHeader>
            <Divider />



            <List>
              {drawerdata?.map(
                (text, index) =>
                  text.bDisplayName !== 0 && (
                    <React.Fragment key={index}>
                      <Tooltip title={text.sToolTip} placement="right-start">
                     
                        <SideNavMenu text={text} toggle={open} />
                      </Tooltip>
                    </React.Fragment>
                  )
              )}
            </List>
        

            <Box sx={{ mt: "auto", width: "100%", textAlign: "center" }}>
              <BottmMenu isDarkTheme={isDarkTheme} sx={{ backgroundColor: "red" }} menu={bottomM} />
            </Box>
          </div>
        </Drawer>


        <Box
          component="main"
          className={`${isContainer && "container m-auto"} ${
            isDarkTheme && "bg-[#121212] text-white"
          }`}
          sx={{ flexGrow: 1, p: 3 }}
        >
          <DrawerHeader fetchmainApi={fetchmainApi} />
          {children}
          {/* <MainForm/> */}
          {/* <AutoComplete/> */}
          {/* <RadioGroupComponent/> */}
          {/* <SpeedDialMenu data={sDial} /> */}
        </Box>
      </Box>
    </>
  );
};

export default SideDrawer;
