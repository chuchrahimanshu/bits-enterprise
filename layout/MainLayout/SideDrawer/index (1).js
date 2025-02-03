import React, { Children, useEffect } from "react";
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
import AdbIcon from "@mui/icons-material/Adb";
import MainForm from "../../../pages/Form/Form";
import AutoComplete from "../../../pages/AutoComplete/AutoComplete";
import RadioGroupComponent from "../../../pages/RadioGroupComponent/RadioGroupComponent";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const SideDrawer = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [drawerdata, setDawerdata] = React.useState();
  // const [current, setCurrent] = React.useState();
  const [sDial, setSpeedDial] = React.useState();
  const [bottomM, setbottomM] = React.useState();
  const [company, setCompany] = React.useState({});

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    axios
      .get(`${baseURL}/getDrawerMenu`)
      .then((result) => setDawerdata(result.data.data))
      .catch((er) => console.log("err", er));

    axios
      .get(`${baseURL}/getSpeedDialMenu`)
      .then((result) => setSpeedDial(result.data.data))
      .catch((er) => console.log("err", er));

    axios
      .get(`${baseURL}/getBottomMenu`)
      .then((result) => setbottomM(result.data.data))
      .catch((er) => console.log("err", er));

    axios
      .get(`${baseURL}/getCompanyDetail`)
      .then((response) => {
        setCompany(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // console.log(drawerdata);
  // console.log(sDial);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar sx={{ bgcolor: "#FFF" }} position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                color: "#000",
                marginRight: 1,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Appbarr toggle={open} />
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <>
            <Box
                  component="img"
                  sx={{
                    height: 55,
                    width: 190,
                  }}
                  Alt={company?.data?.sOrgName}
                  //Src={company?.data?.slogo}
                  Src='http://localhost:8080/images/enterprise/get?filename=wilstark_logo.png'
                  href="/"
                />
             {/*} {company?.data?.slogo === null || undefined ? (
                <Box
                  component="img"
                  sx={{
                    height: 55,
                    width: 190,
                  }}
                  Alt={company?.data?.sOrgName}
                  //Src={company?.data?.slogo}
                  Src='http://localhost:8080/images/enterprise/get?filename=wilstark_logo.png'
                  href="/"
                />
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
                      textDecoration: "none",
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
                      textDecoration: "none",
                    }}
                  >
                    {company?.data?.sOrgName}
                  </Typography>
                </>
                  )} */}
            </>

            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {drawerdata?.map((text, index) => (
              <Tooltip title={text.sToolTip} placement="right-start">
                <SideNavMenu text={text} toggle={open} />
              </Tooltip>
            ))}
          </List>
          <Box sx={{ mt: "auto", width: "100%", textAlign: "center" }}>
            <BottmMenu menu={bottomM} />
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          {children}
          {/* <MainForm/> */}
          {/* <AutoComplete/> */}
          {/* <RadioGroupComponent/> */}
          <SpeedDialMenu data={sDial} />
        </Box>
      </Box>
    </>
  );
};

export default SideDrawer;
