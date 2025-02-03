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
import { useLocation, useNavigate } from "react-router-dom";
import { Global_Data } from "../../../globalData/GlobalData";
import MenuItemsList from "./MenuItemsList";
import { blue, grey, red } from "@mui/material/colors";
import { BorderRight } from "@mui/icons-material";
import Debug from "../../../component/Debug";

const drawerWidth = 0;

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
  const { token, globalvariables, sideBarStyle, setsideBarStyle ,overlaySplit } = Global_Data?.() || {};
  const [open, setOpen] = React.useState(true);
  const [drawerdata, setDawerdata] = React.useState();
  // const [current, setCurrent] = React.useState();
  const [sDial, setSpeedDial] = React.useState();
  const [bottomM, setbottomM] = React.useState();
  const [company, setCompany] = React.useState({});
  const [customError, setCustomError] = React.useState("");
  const [isContainer, setIsContainer] = React.useState(true);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const [theamStyle, setTheamStyle] = React.useState(false);
  const [isRtl, setRtl] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(!open);
  };
const navigate = useNavigate()
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
        }
      })
      .then(result => setbottomM(result.data.data.menu))
      .catch(() => setCustomError("Something went Wrong"));
  }, []);

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

  function parseJsonString(jsonString) {
    try {
      const jsonObject = JSON.parse(jsonString);
      return jsonObject;
    } catch (error) {
      console.error("Failed to parse JSON string:", error);
      return null;
    }
  }
  useEffect(() => {
    axios
      .get(`${serverAddress}/record/get/sys_template/default`, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed   
        }
      })
      .then(response => {
        // setTheamStyle(parseJsonString(response.data.data.mainrecord.sTheme));
        setsideBarStyle(parseJsonString(response.data.data.mainrecord.sTemplateSections));
      })
      // .then(response =>)
      .catch(err => {
        localStorage.clear()
        navigate('/login')
      });
  }, []);

  function getAllRoutes(data) {
    const routes = [];

    function traverse(items) {
      for (const item of items) {
        if (item?.sMenuRoute) {
          routes.push(item?.sMenuRoute);
        }
        if (item?.submenus) {
          traverse(item?.submenus);
        }
      }
    }

    if (data?.length > 0) {
      traverse(data);
    }
    return routes;
  }

  const allRoutes = getAllRoutes(drawerdata);

  let isDrowerExist = allRoutes.includes(window.location.pathname + window.location.search);

  return (
    <>
      {customError !== "red" && <CustomAlert severity="error" message={customError} />}
      {/* {JSON.stringify(sideBarStyle['view-port'])}fetchDataHandleDataGrid */}
      <Box id="viewport-main" sx={sideBarStyle?.["view-port"]}>
        <CssBaseline />
        <AppBar
          id="appbar-main"
          sx={sideBarStyle["appbar-main"]}
          // sx={{ bgcolor: grey[50], marginRight: isRtl && open ? `${drawerWidth}px` : 0, boxShadow:0 }}
          // position="fixed"
          open={open}
        >
          <Toolbar id="toolbar-main" sx={sideBarStyle["toolbar-main"]} style={{marginLeft:!open && '70px'}}>
            <Appbarr
              id="toolbar-menus"
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

        <Box id="sidebar-main" sx={sideBarStyle["sidebar-main"]} style={{width: !open && '70px'}}>
          <Box id="drawermenu-box" sx={sideBarStyle["drawermenu-box"]}>
            <Box id="logo-box" sx={sideBarStyle["logo-box"]}>
              { open &&<Box
                id="logo"
                sx={sideBarStyle["logo"]}
                component="img"
                alt={company?.data?.sOrgName}
                src={CompanyLogo}
                href="/"
              />}

              <IconButton onClick={handleDrawerClose}>
                {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </Box>

            {/* {JSON.stringify(theamStyle)} */}

            <Box id="sidebarmenu-main" sx={sideBarStyle["sidebarmenu-main"]}>
              <List id="sidebarmenu-list">
                {drawerdata?.map(
                  (text, index) =>
                    text.bDisplayName !== 0 && (
                      <React.Fragment key={index}>
                        <Tooltip title={text.sToolTip} placement="right-start">
                          {/* <SideNavMenu text={text} toggle={open} /> */}
                          <MenuItemsList isDrowerExist={isDrowerExist} data={text} toggle={open} />
                        </Tooltip>
                      </React.Fragment>
                    )
                )}
              </List>
            </Box>
            {/* {JSON.stringify(sideBarStyle['view-port'])} */}

            <Box id="bottommenu-main" sx={sideBarStyle["bottommenu-main"]}>
              <BottmMenu isDarkTheme={isDarkTheme} sx={{ backgroundColor: "red" }} menu={bottomM} />
            </Box>
          </Box>
        </Box>

{/* {JSON.stringify(sideBarStyle['overlay-form'])} */}
        <Box
          // id={overlaySplit ?'overlay-form':"mainform"}
          // sx={sideBarStyle[ overlaySplit ?'overlay-form':"mainform"]}
          style={{marginLeft:!open && '70px'}}
          id="mainform"
          sx={sideBarStyle["mainform"]}
          component="main"
          className={`${isContainer && "container m-auto"} ${
            isDarkTheme && "bg-[#121212] text-white"
          }`}
        >
          {/* <DrawerHeader fetchmainApi={fetchmainApi} id="mainform-drawerheader" sx={{minHeight: "100px"}}/> */}

          <Box id="mainform-drawerheader" sx={sideBarStyle["mainform-drawerheader"]} />

          {children}
        </Box>
        <Box
          style={{marginLeft:!open ? '60px' : '250px'}}
          sx={sideBarStyle["mainform"]}
          component="div"
          className={`${isContainer && "container m-auto"}`}
          id="debug_section"
        >
            <Debug sidebarState={open} />
        </Box>
      </Box>
    </>
  );
};

export default SideDrawer;
