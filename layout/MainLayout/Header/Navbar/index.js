import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import RefreshIcon from "@mui/icons-material/Refresh";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Divider, Drawer, Stack, Badge, Grid, Paper } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { baseURL } from "../../../../api";
import { Icon } from "../../../../utils/MuiIcons/Icon";
import { Link } from "react-router-dom";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import SimpleListMenu from "../../../../component/SelectedMenu/SelectedMenu";
import {
  renderTypography,
  renderglobaltextcomponent,
  rendervartextcomponent
} from "../../../../pages/hooks/ComponentsData";

import CustomAlert from "../../../../component/AlertComponent/Alert";
import Rtl from "../../../../assets/themesSvg/Rtl.svg";
import MiniDrawertl from "../../../../assets/themesSvg/MiniDrawer.svg";
import LightTheme from "../../../../assets/themesSvg/lighttheme.svg";
import Horizontal from "../../../../assets/themesSvg/horizontal.svg";
import DarkTheme from "../../../../assets/themesSvg/Dark theme.svg";
import ColorScheme from "../../../../assets/themesSvg/colorScheme.svg";
import ThemeContainer from "../../../../assets/themesSvg/themeContainer.svg";
import { Global_Data } from "../../../../globalData/GlobalData";
import AccountMenus from "./AccountMenus";

const Navbar = ({
  setRtl,

  isRtl,
  fetchmainApi,
  handleDrawerClose,
  isDarkTheme,
  handleDrawerOpen,
  toggle,
  varValue,
  setIsContainer,
  setIsDarkTheme
}) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElWidge, setAnchorElWidge] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [index, setIndex] = React.useState(-1);
  const [widgetMenu, setWidgetMenu] = React.useState([]);
  const [accountDetails, setAccountDetails] = React.useState();
  const [userInfo, setUserInfo] = React.useState();
  const [companyInfo, setCompanyInfo] = React.useState();
  const [formatInfo, setFormatInfo] = React.useState();
  const [navFormSub, setNavFormSub] = React.useState();
  const [customError, setCustomError] = React.useState("");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [isRotate, setisRotate] = React.useState(false);
  const [activeThemeLayout, setActiveThemeLayout] = React.useState("default");
  const { token, setToken, userData, setUserData ,sideBarStyle, setGlobalReloadTriggered} = Global_Data?.() || {};
  const handleReferesh = () => {
    setGlobalReloadTriggered(true);
    setisRotate(true);

    setTimeout(() => {
      setisRotate(false);
      setGlobalReloadTriggered(false);
    }, 2000);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // for SubMenu

  const handleClose = () => {
    setAnchorEl(null);
  };
  //
  React.useEffect(() => {
    axios
      .get(`${baseURL}/menu/get/NAVBAR`, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      })
      .then(response => {
        setData(response?.data?.data?.menu);
      })
      .catch(() => {
        setCustomError("Something went Wrong");
      });
    axios
      .get(`${baseURL}/menu/get/WIDGET`, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      })
      .then(response => {
        setWidgetMenu(response.data.data);
      })
      .catch(() => {
        setCustomError("Something went Wrong");
      });
    // account
    axios
      .get(`${baseURL}/forms/getForm?formname=accountForm`, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      })
      .then(response => {
        setAccountDetails(response.data.data);
      })
      .catch(() => {
        setCustomError("Something went Wrong");
      });
    // get info
    // axios
    //   .get(`${baseURL}/getUserDetail`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`
    //       // Other headers if needed
    //     }
    //   })
    //   .then(response => {
    //     setUserInfo(response.data);
    //   })
    //   .catch(err => {
    //     setCustomError(err?.response?.data?.metadata.msg || "Something went Wrong");
    //     console.log(err.response.data.metadata.msg, "errbho");
    //   });
    // axios
    //   .get(`${baseURL}/getCompanyDetail`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`
    //       // Other headers if needed
    //     }
    //   })
    //   .then(response => {
    //     setCompanyInfo(response.data);
    //   })
    //   .catch(() => {
    //     setCustomError("Something went Wrong");
    //   });
    axios
      .get(`${baseURL}/record/get/all/sys_formatting`, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      })
      .then(response => {
        setFormatInfo(response.data);
      })
      .catch(() => {
        setCustomError("Something went Wrong");
      });
    // get account menu
    axios
      .get(`${baseURL}/menu/get/ACCOUNT`, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      })
      .then(response => {
        setNavFormSub(response.data);
      })
      .catch(() => {
        setCustomError("Something went Wrong");
      });
  }, []);
  // const getFieldValue = (sName) => {
  //   const [orgKey, fieldName] = sName?.split(".") ?? [];
  //   if (orgKey === "organization") return companyInfo?.data?.[fieldName];
  //   else return userInfo?.data?.[fieldName];
  // };
  const getFieldValue = sName => {
    const [orgKey, fieldName] = sName?.split(".") ?? [];

    switch (orgKey) {
      case "organization":
        return companyInfo?.data?.[fieldName];
      case "user":
        return userInfo?.data?.[fieldName];
      case "format":
        return formatInfo?.data?.[fieldName];
      default:
        return undefined;
    }
  };
  const globalData = JSON.parse(localStorage.getItem('globalvariables'))

  //const icon = widgetMenu[0]?.sImageType.replace("OutlinedIcon", "");
  const icon = widgetMenu[0]?.sImageType;

  const customStyles = {
    display: "block",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    objectFit: "cover",
    borderRadius: "4px",
    width: "50  px",
    height: "40px"
  };

  var myObject = {
    display: "inline-flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    boxSizing: "border-box",
    color: "rgb(38, 38, 38)",
    transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    overflow: "hidden",
    position: "relative",
    border: "none",
    minWidth: " 80px",
    borderColor: "rgb(230, 235, 241)",
    borderRadius: "4px",
    boxShadow: "inherit",
    backgroundColor: "rgb(245, 245, 245)",
    padding: "12px"
  };

  const openWidge = Boolean(anchorElWidge);

  const handleOpenUserMenuWidge = event => {
    setAnchorElWidge(event.currentTarget);
  };
  const handleCloseWidge = () => {
    setAnchorElWidge(null);
  };

  const iconContainer = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    WebkitTapHighlightColor: "transparent",
    outline: "0px",
    border: "0px",
    margin: "0px",
    cursor: "pointer",
    userSelect: "none",
    verticalAlign: "middle",
    appearance: "none",
    textDecoration: "none",
    textAlign: "center",
    flex: "0 0 auto",
    padding: "8px",
    overflow: "visible",
    transition: "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    color: "rgb(22, 119, 255)",
    borderRadius: "4px",
    width: "36px",
    verticalAlign: "center",
    height: "36px",
    fontSize: "1rem",
    position: "relative",
    backgroundColor: "rgb(230, 244, 255)",
    alignSelf: "center"
  };
  // const [img, setImg] = useState('')
  // useEffect(()=>{
  //  axios.get( `${baseURL}${userData?.sImagePath}`,{
  //   headers:{
  //     Authorization:` Bearer ${token}`
  //   }
  //  }).then((res)=>setImg(res?.data))
  //  .catch((err)=>console.log(err))

  // },[])

  return (
    <>
      {customError !== "" && <CustomAlert severity="error" message={customError} />}
      <Box id="navbar-main"
        sx={sideBarStyle['navbar-main']}
        
      >
        {data?.map((navItem, ind) => (
          <React.Fragment key={ind}>
            <Box onMouseOver={() => setIndex(ind)} onMouseOut={() => setIndex(-1)}>
              <Divider orientation="vertical" flexItem />
              <Tooltip title={navItem?.sToolTip}>
                {navItem.sMenuContainer === "MENU" ? (
                  <Stack direction="row" sx={{ display: "flex", alignItems: "center" }}>
                    <span style={{ padding: "0px 1px", color: "#000" }}>
                      <Icon iconName={navItem?.sImageType} />
                    </span>
                    <Typography
                      position="relative"
                      onClick={() => setIndex(ind)}
                      key={navItem}
                      sx={{
                        mx: navItem?.bDisplayName ? 1 : 0,
                        color: "#000",
                        cursor: "pointer"
                      }}
                    >
                      {navItem?.bDisplayName === 1 && navItem?.sMenuName}
                    </Typography>
                  </Stack>
                ) : navItem?.sMenuContainer === "AVATAR" ? (
                  <Avatar>P</Avatar>
                ) : navItem?.sMenuContainer === "BUTTON" ? (
                  <Button variant="contained">
                    {navItem?.bDisplayName === 1 && navItem?.sMenuName}
                  </Button>
                ) : navItem?.sMenuContainer === "ELIPSIS" ? (
                  <IconButton>
                    <MoreHorizOutlinedIcon />
                  </IconButton>
                ) : navItem?.sMenuContainer === "SELECTED" ? (
                  <SimpleListMenu data={navItem} />
                ) : null}
              </Tooltip>
              {navItem.submenu && index === ind && (
                <Box
                  open={index === ind}
                  onClick={() => setIndex(-1)}
                  anchorEl={anchorEl}
                  sx={{
                    position: "absolute",
                    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 2px",
                    p: "1rem 1rem .5rem 1rem",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    color: "#000",
                    zIndex: "5"
                  }}
                >
                  {index === ind &&
                    navItem?.submenu?.map((menu, index) => (
                      <React.Fragment key={index}>
                        {menu?.sMenuProps === "FORMDATA" ? (
                          <>
                            {accountDetails?.details.map(item => {
                              switch (item?.component?.sType) {
                                case "AVATAR":
                                  return (
                                    <Grid item {...item?.grid_props}>
                                      <MenuItem onClick={handleCloseUserMenu}>
                                        <Avatar
                                          alt={item?.data?.sAction}
                                          src={`${baseURL}${item?.data?.sDataSource}`}
                                          {...item?.component?.sProps}
                                        />
                                      </MenuItem>
                                    </Grid>
                                  );
                                case "VARTEXT": {
                                  return rendervartextcomponent(item, varValue);
                                }
                                case "GLOBALTEXT": {
                                  return renderglobaltextcomponent(item, getFieldValue);
                                }
                                case "TYPOGRAPHY":
                                  return renderTypography(item);
                                case "DIVIDER":
                                  return (
                                    <Grid item {...item?.grid_props}>
                                      <MenuItem onClick={handleCloseUserMenu}>
                                        <Divider
                                          {...item?.component?.sProps}
                                          sx={{
                                            width: "100%"
                                          }}
                                        >
                                          {/* {item?.component?.sName} */}
                                        </Divider>
                                      </MenuItem>
                                    </Grid>
                                  );
                                default:
                                  return null;
                              }
                            })}
                          </>
                        ) : (
                          <Link to={menu.sMenuRoute}>
                            <Tooltip title={menu.sToolTip}>
                              <Typography className="menu-close" onClick={handleClose}>
                                {menu.sCaption}
                                <span>
                                  <Link to={menu?.sDefaultActionMenuRoute}>
                                    <IconButton>
                                      <Icon iconName={menu?.sDefaultActionImage} />
                                    </IconButton>
                                  </Link>
                                </span>
                              </Typography>
                            </Tooltip>
                          </Link>
                        )}
                      </React.Fragment>
                    ))}
                </Box>
              )}
            </Box>
          </React.Fragment>
        ))}

        <Divider orientation="vertical" flexItem />
      </Box>
      {/* widge menu   rfg 31 may 23
      <Box
        sx={{
          flexGrow: 0,
          backgroundColor: "white", 
          display: { xs: "none", md: "flex" },
          mx: 3
        }}
        onClick={handleOpenUserMenuWidge}
      >
        <Badge
          badgeContent={4}
          color="primary"
          // {...widgetMenu[0]?.sMenuProps}
        >
         <Icon iconName={icon} style={{ backgroundColor: "white", color: "black" }} /> 

        </Badge>
        <Menu
          sx={{ mt: "45px", p: 2 }}
          anchorEl={anchorElWidge}
          open={openWidge}
          onClose={event => {
            event.stopPropagation();
            handleCloseWidge();
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
        >
          {widgetMenu[0]?.submenu.map((item, menuind) => {
            return (
              <React.Fragment key={menuind}>
                <MenuItem
                  onClick={event => {
                    event.stopPropagation();
                    handleCloseWidge();
                  }}
                >
                  <Box sx={{ p: 1 }}>
                    <Link to={item.sMenuRoute} key={item.sCaption}>
                      <Tooltip title={item?.sToolTip}>
                        <Typography className="menu-close">{item.sCaption}</Typography>
                      </Tooltip>
                    </Link>
                  </Box>
                </MenuItem>
              </React.Fragment>
            );
          })}
        </Menu>
      </Box>  */}
      {/* account section */}
      {/* drawer start */}
      <Box id="widgets-main" sx={sideBarStyle['widgets-main']}>
        <IconButton
          onClick={() => {
            handleReferesh();
            fetchmainApi();
          }}
          size="large"
        >
          <RefreshIcon className={isRotate && "lovu"} color="secondary"></RefreshIcon>
        </IconButton>
        <IconButton onClick={toggleDrawer} size="large">
          <SettingsOutlinedIcon color="secondary"></SettingsOutlinedIcon>
        </IconButton>
        <Drawer
          className="light-scrollbar"
          style={{ zIndex: 999 }}
          anchor={isRtl ? "left" : "right"}
          open={drawerOpen}
          onClose={toggleDrawer}
        >
          <Box className="light-scrollbar" sx={{ maxWidth: "340px" }}>
            <div
              style={{
                display: "flex",
                padding: "20px",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#3366ff",
                border: "1px solid #ccc",
                color: "white"
              }}
            >
              <div>
                <Typography variant="h6" className="text-center">
                  Theme Customization
                </Typography>
              </div>
              <div>
                <CancelOutlinedIcon className="cursor-pointer" onClick={toggleDrawer} />
              </div>
            </div>
            <Box>
              <Accordion className="m-0">
                <AccordionSummary
                  margin={0}
                  padding={0}
                  className="m-0"
                  display="block"
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <div className="flex gap-3 ">
                    <div style={iconContainer}>
                      <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="layout"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-696 72h136v656H184V184zm656 656H384V384h456v456zM384 320V184h456v136H384z"></path>
                      </svg>
                    </div>
                    <div
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        flexDirection: "row"
                      }}
                    >
                      <Typography variant="h6" sx={{ fontSize: 16 }}>
                        Theme Layout
                      </Typography>
                      <Typography
                        variant="p"
                        className=" text-gray-400"
                        sx={{ fontSize: 14 }}
                        gutterBottom
                      >
                        Chose your Layout
                      </Typography>
                    </div>
                  </div>
                </AccordionSummary>
                <div
                  style={{ display: "flex", justifyContent: "start", gap: "15px", padding: "15px" }}
                >
                  <div
                    onClick={() => {
                      setRtl(false);
                      handleDrawerOpen(true);
                      setActiveThemeLayout("default");
                    }}
                    className={`${
                      activeThemeLayout === "default" && "drawer-active"
                    }  mb-5 transition-shadow overflow-hidden cursor-pointer   rounded-lg shadow flex items-center justify-center flex-col inherit bg-[#f5f5f5] p-2`}
                  >
                    <img style={{ width: "65px" }} src={LightTheme} alt="LightTheme" />
                    <p className="text-xs text-center mt-2">Default</p>
                  </div>
                  <div
                    onClick={() => {
                      handleDrawerOpen(false);
                      setActiveThemeLayout("Mini");
                    }}
                    className={`${
                      activeThemeLayout === "Mini" && "drawer-active"
                    }  mb-5 text-center align-items-center cursor-pointer transition-shadow overflow-hidden rounded-lg shadow inherit flex items-center justify-center flex-col  bg-[#f5f5f5] p-2`}
                  >
                    <img style={{ width: "65px" }} src={MiniDrawertl} alt="LightTheme" />
                    <p className="text-xs text-center mt-2">Mini Drawer</p>
                  </div>
                  <div
                    onClick={() => {
                      setRtl(!isRtl);
                      setActiveThemeLayout("Rtl");
                    }}
                    className={`${
                      activeThemeLayout === "Rtl" && "drawer-active"
                    } mb-5 text-center transition-shadow overflow-hidden  cursor-pointer  flex items-center justify-center flex-col rounded-lg shadow inherit  bg-[#f5f5f5] p-2`}
                  >
                    <img style={{ width: "65px" }} src={Rtl} alt="LightTheme" />
                    <p className="text-xs text-center mt-2">Rtl</p>
                  </div>
                </div>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <div className="flex gap-3 ">
                    <div style={iconContainer}>
                      <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="border-inner"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M872 476H548V144h-72v332H152c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h324v332h72V548h324c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 498h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-664h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 498h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM650 216h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 592h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-56-592h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-166 0h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 592h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-56-426h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 260h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                      </svg>
                    </div>
                    <div
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        flexDirection: "row"
                      }}
                    >
                      <Typography variant="h6" sx={{ fontSize: 16 }}>
                        Menu Orientation
                      </Typography>
                      <Typography
                        variant="p"
                        className=" text-gray-400"
                        sx={{ fontSize: 14 }}
                        gutterBottom
                      >
                        Choose Verticle or HoriZontal Menu Orientation
                      </Typography>
                    </div>
                  </div>
                </AccordionSummary>

                <div
                  style={{ display: "flex", justifyContent: "start", gap: "15px", padding: "15px" }}
                >
                  <div className=" mb-5 transition-shadow overflow-hidden cursor-pointer   rounded-lg shadow flex items-center justify-center flex-col inherit bg-[#f5f5f5] p-2">
                    <img style={{ width: "65px" }} src={LightTheme} alt="LightTheme" />
                    <p className="text-xs text-center mt-2">Vertical</p>
                  </div>
                  <div className=" mb-5 transition-shadow overflow-hidden cursor-pointer   rounded-lg shadow flex items-center justify-center flex-col inherit bg-[#f5f5f5] p-2">
                    <img style={{ width: "65px" }} src={Horizontal} alt="LightTheme" />
                    <p className="text-xs text-center mt-2">Horizontal</p>
                  </div>
                </div>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3a-content"
                  id="panel3a-header"
                >
                  <div className="flex gap-3 ">
                    <div style={iconContainer}>
                      <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="highlight"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M957.6 507.4L603.2 158.2a7.9 7.9 0 00-11.2 0L353.3 393.4a8.03 8.03 0 00-.1 11.3l.1.1 40 39.4-117.2 115.3a8.03 8.03 0 00-.1 11.3l.1.1 39.5 38.9-189.1 187H72.1c-4.4 0-8.1 3.6-8.1 8V860c0 4.4 3.6 8 8 8h344.9c2.1 0 4.1-.8 5.6-2.3l76.1-75.6 40.4 39.8a7.9 7.9 0 0011.2 0l117.1-115.6 40.1 39.5a7.9 7.9 0 0011.2 0l238.7-235.2c3.4-3 3.4-8 .3-11.2zM389.8 796.2H229.6l134.4-133 80.1 78.9-54.3 54.1zm154.8-62.1L373.2 565.2l68.6-67.6 171.4 168.9-68.6 67.6zM713.1 658L450.3 399.1 597.6 254l262.8 259-147.3 145z"></path>
                      </svg>
                    </div>
                    <div
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        flexDirection: "row"
                      }}
                    >
                      <Typography variant="h6" sx={{ fontSize: 16 }}>
                        Theme Mode
                      </Typography>
                      <Typography
                        variant="p"
                        className=" text-gray-400"
                        sx={{ fontSize: 14 }}
                        gutterBottom
                      >
                        Choose light or dark mode
                      </Typography>
                    </div>
                  </div>
                </AccordionSummary>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "start",
                      gap: "15px",
                      padding: "15px"
                    }}
                  >
                    <div
                      onClick={() => setIsDarkTheme(false)}
                      className=" mb-5 transition-shadow overflow-hidden cursor-pointer   rounded-lg shadow flex items-center justify-center flex-col inherit bg-[#f5f5f5] p-2"
                    >
                      <img style={{ width: "65px" }} src={LightTheme} alt="LightTheme" />
                      <p className="text-xs text-center mt-2">Light Theme </p>
                    </div>
                    <div
                      onClick={() => setIsDarkTheme(true)}
                      className=" mb-5 transition-shadow overflow-hidden cursor-pointer   rounded-lg shadow flex items-center justify-center flex-col inherit bg-[#f5f5f5] p-2"
                    >
                      <img style={{ width: "65px" }} src={DarkTheme} alt="LightTheme" />
                      <p className="text-xs text-center mt-2">Dark Theme</p>
                    </div>
                  </div>
                </div>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4a-content"
                  id="panel4a-header"
                >
                  <div className="flex gap-3 ">
                    <div style={iconContainer}>
                      <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="bg-colors"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M766.4 744.3c43.7 0 79.4-36.2 79.4-80.5 0-53.5-79.4-140.8-79.4-140.8S687 610.3 687 663.8c0 44.3 35.7 80.5 79.4 80.5zm-377.1-44.1c7.1 7.1 18.6 7.1 25.6 0l256.1-256c7.1-7.1 7.1-18.6 0-25.6l-256-256c-.6-.6-1.3-1.2-2-1.7l-78.2-78.2a9.11 9.11 0 00-12.8 0l-48 48a9.11 9.11 0 000 12.8l67.2 67.2-207.8 207.9c-7.1 7.1-7.1 18.6 0 25.6l255.9 256zm12.9-448.6l178.9 178.9H223.4l178.8-178.9zM904 816H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8z"></path>
                      </svg>
                    </div>
                    <div
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        flexDirection: "row"
                      }}
                    >
                      <Typography variant="h6" sx={{ fontSize: 16 }}>
                        Color Scheme
                      </Typography>
                      <Typography
                        className=" text-gray-400"
                        variant="p"
                        sx={{ fontSize: 14 }}
                        gutterBottom
                      >
                        Choose your primary theme color
                      </Typography>
                    </div>
                  </div>
                </AccordionSummary>
                <Grid className="p-4 pe-9" paddingRight={10} container spacing={3}>
                  {/* Row 1 */}
                  <Grid item xs={4}>
                    <div style={myObject}>
                      <img
                        style={{
                          ...customStyles,
                          background: "rgb(51, 102, 255)",
                          border: "1px solid rgb(51, 102, 255)"
                        }}
                        src={ColorScheme}
                        alt="LightTheme"
                      />
                      <p className="text-xs text-center mt-2">Default</p>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div style={myObject}>
                      <img
                        style={{
                          ...customStyles,
                          background: "rgb(51, 102, 255)",
                          border: "1px solid rgb(51, 102, 255)"
                        }}
                        src={ColorScheme}
                        alt="LightTheme"
                      />
                      <p className="text-xs text-center mt-2">Theme 1</p>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div style={myObject}>
                      <img
                        style={{
                          ...customStyles,
                          background: "rgb(114, 101, 230)",
                          border: "1px solid rgb(22, 119, 255)"
                        }}
                        src={ColorScheme}
                        alt="LightTheme"
                      />
                      <p className="text-xs text-center mt-2">Theme 2</p>
                    </div>
                  </Grid>

                  {/* Row 2 */}
                  <Grid item xs={4}>
                    <div style={myObject}>
                      <img
                        style={{
                          ...customStyles,
                          background: "rgb(6, 142, 68)",
                          border: "1px solid rgb(6, 142, 68)"
                        }}
                        src={ColorScheme}
                        alt="LightTheme"
                      />
                      <p className="text-xs text-center mt-2">Theme 3</p>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div style={myObject}>
                      <img
                        style={{
                          ...customStyles,
                          background: "rgb(60, 100, 208)",
                          border: "1px solid rgb(60, 100, 208)"
                        }}
                        src={ColorScheme}
                        alt="LightTheme"
                      />
                      <p className="text-xs text-center mt-2">Theme 4</p>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div style={myObject}>
                      <img
                        style={{
                          ...customStyles,
                          background: "rgb(242, 112, 19)",
                          border: "1px solid rgb(242, 112, 19)"
                        }}
                        src={ColorScheme}
                        alt="LightTheme"
                      />
                      <p className="text-xs text-center mt-2">Theme 5</p>
                    </div>
                  </Grid>

                  {/* Row 3 */}
                  <Grid item xs={4}>
                    <div style={myObject}>
                      <img
                        style={{
                          ...customStyles,
                          background: "rgb(42, 161, 175)",
                          border: "1px solid rgb(42, 161, 175)"
                        }}
                        src={ColorScheme}
                        alt="LightTheme"
                      />
                      <p className="text-xs text-center mt-2">Theme 6</p>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div style={myObject}>
                      <img
                        style={{
                          ...customStyles,
                          background: "rgb(0, 168, 84)",
                          border: "1px solid rgb(0, 168, 84)"
                        }}
                        src={ColorScheme}
                        alt="LightTheme"
                      />
                      <p className="text-xs text-center mt-2">Theme 7</p>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div style={myObject}>
                      <img
                        style={{
                          ...customStyles,
                          background: "rgb(0, 150, 136)",
                          border: "1px solid rgb(0, 150, 136)"
                        }}
                        src={ColorScheme}
                        alt="LightTheme"
                      />
                      <p className="text-xs text-center mt-2">Theme 8</p>
                    </div>
                  </Grid>
                </Grid>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel5a-content"
                  id="panel5a-header"
                >
                  <div className="flex gap-3 ">
                    <div style={iconContainer}>
                      <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="border-inner"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M872 476H548V144h-72v332H152c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h324v332h72V548h324c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 498h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-664h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 498h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM650 216h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 592h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-56-592h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-166 0h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 592h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-56-426h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 260h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                      </svg>
                    </div>
                    <div
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        flexDirection: "row"
                      }}
                    >
                      <Typography variant="h6" sx={{ fontSize: 16 }}>
                        Layout Width
                      </Typography>
                      <Typography
                        className=" text-gray-400"
                        variant="p"
                        sx={{ fontSize: 14 }}
                        gutterBottom
                      >
                        Choose fluid or container layout
                      </Typography>
                    </div>
                  </div>
                </AccordionSummary>
                <Box>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        gap: "15px",
                        padding: "15px"
                      }}
                    >
                      <div className=" mb-5 transition-shadow overflow-hidden cursor-pointer   rounded-lg shadow flex items-center justify-center flex-col inherit bg-[#f5f5f5] p-2">
                        <img
                          onClick={() => setIsContainer(false)}
                          style={{ width: "65px" }}
                          src={LightTheme}
                          alt="LightTheme"
                        />
                        <p className="text-xs text-center mt-2">Fluid </p>
                      </div>
                      <div
                        onClick={() => setIsContainer(true)}
                        className=" mb-5 transition-shadow overflow-hidden cursor-pointer   rounded-lg shadow flex items-center justify-center flex-col inherit bg-[#f5f5f5] p-2"
                      >
                        <img style={{ width: "65px" }} src={ThemeContainer} alt="LightTheme" />
                        <p className="text-xs text-center mt-2">Container</p>
                      </div>
                    </div>
                  </div>
                </Box>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel6a-content"
                  id="panel6a-header"
                >
                  <div className="flex gap-3 ">
                    <div style={iconContainer}>
                      <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="font-colors"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M904 816H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8zm-650.3-80h85c4.2 0 8-2.7 9.3-6.8l53.7-166h219.2l53.2 166c1.3 4 5 6.8 9.3 6.8h89.1c1.1 0 2.2-.2 3.2-.5a9.7 9.7 0 006-12.4L573.6 118.6a9.9 9.9 0 00-9.2-6.6H462.1c-4.2 0-7.9 2.6-9.2 6.6L244.5 723.1c-.4 1-.5 2.1-.5 3.2-.1 5.3 4.3 9.7 9.7 9.7zm255.9-516.1h4.1l83.8 263.8H424.9l84.7-263.8z"></path>
                      </svg>
                    </div>
                    <div
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        flexDirection: "row"
                      }}
                    >
                      <Typography component={"h6"} sx={{ fontSize: 16 }} variant="h6">
                        Font Family
                      </Typography>
                      <Typography
                        className=" text-gray-400"
                        component={"P"}
                        variant="p"
                        sx={{ fontSize: 14 }}
                        gutterBottom
                      >
                        Choose your font family
                      </Typography>
                    </div>
                  </div>
                </AccordionSummary>
                <div className="flex gap-5 p-4 flex-wrap">
                  <div className="transition-shadow overflow-hidden cursor-pointer   rounded-lg shadow flex items-center justify-center flex-col inherit bg-[#f5f5f5] p-2">
                    <Box
                      className="p-2"
                      sx={{
                        background: "white",
                        height: "60px",
                        width: "60px",
                        verticalAlign: "center"
                      }}
                    >
                      <Typography component={"p"} className=" text-center " variant="h5">
                        Aa
                      </Typography>
                      <Typography
                        component={"p"}
                        className="text-gray-500 text-xs text-center"
                        variant="p"
                      >
                        Inter
                      </Typography>
                    </Box>
                  </div>
                  <div className=" transition-shadow overflow-hidden cursor-pointer   rounded-lg shadow flex items-center justify-center flex-col inherit bg-[#f5f5f5] p-2">
                    <Box
                      className="p-2"
                      sx={{
                        background: "white",
                        height: "60px",
                        width: "60px",
                        verticalAlign: "center"
                      }}
                    >
                      <Typography component={"p"} className=" text-center " variant="h5">
                        Aa
                      </Typography>
                      <Typography
                        component={"p"}
                        className="text-gray-500 text-xs text-center"
                        variant="p"
                      >
                        Roboto
                      </Typography>
                    </Box>
                  </div>
                  <div className=" transition-shadow overflow-hidden cursor-pointer   rounded-lg shadow flex items-center justify-center flex-col inherit bg-[#f5f5f5] p-2">
                    <Box
                      className="p-2"
                      sx={{
                        background: "white",
                        height: "60px",
                        width: "60px",
                        verticalAlign: "center"
                      }}
                    >
                      <Typography component={"p"} className=" text-center " variant="h5">
                        Aa
                      </Typography>
                      <Typography
                        component={"p"}
                        className="text-gray-500 text-xs text-center"
                        variant="p"
                      >
                        Poppins
                      </Typography>
                    </Box>
                  </div>
                  <div className=" transition-shadow overflow-hidden cursor-pointer   rounded-lg shadow flex items-center justify-center flex-col inherit bg-[#f5f5f5] p-2">
                    <Box
                      className="p-2"
                      sx={{
                        background: "white",
                        height: "60px",
                        width: "90px",
                        verticalAlign: "center"
                      }}
                    >
                      <Typography component={"p"} className=" text-center " variant="h5">
                        Aa
                      </Typography>
                      <Typography
                        component={"p"}
                        className="text-gray-500 text-xs text-center"
                        variant=""
                      >
                        Public Sans
                      </Typography>
                    </Box>
                  </div>
                </div>
              </Accordion>
            </Box>
          </Box>
        </Drawer>
      </Box>
      {/* drawer end */}
      <Box id="accounts-main" sx={sideBarStyle['accounts-main']}>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            {userData?.sImagePath && userData?.sImagePath !== "" && (
              <>
                <Avatar src={userData?.sImagePath}>
                  {userData?.sUserName
                    ?.split(" ")
                    ?.map(name => name[0])
                    ?.join("")}
                </Avatar>
              </>
            )}

            <Typography id={accountDetails?.form?.id}>&nbsp; {userData?.sUserName}</Typography>
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0
              }
            }
          }}
        >
          <Grid container direction="row" sx={{mx:4,}}>
            <Grid item>
              {/* {JSON.stringify(navFormSub.data.menu)} */}
              {navFormSub?.data?.menu?.map(item => (
                <>
                  {/* {item.sMenuName} */}
                  {globalData?.[item?.sMenuName?.replace(/[{}]/g, '')]}
                  {/* {JSON.stringify(item)} */}
                  {item?.submenus?.map(
                    elm =>
                      elm.sMenuProps == "FORMDATA" ?(
                        <>
                          <AccountMenus  data={elm} getFieldValue={getFieldValue} varValue={varValue} />
                        </>
                      ):(
                        <>
                        <MenuItem>
                        <Link to={elm.sMenuRoute}>
                          <span>
                            <IconButton>
                              <Icon iconName={elm?.sImageType} />
                            </IconButton>
                          </span>
                          {elm.sCaption}
                        </Link>
                      </MenuItem>
                        </>
                      )
                  )}
                  {/* {JSON.stringify(item.sMenuProps == "FORMDATA")} */}
                </>
              ))}
              {navFormSub?.data[0]?.submenu?.map(item1 => (
                <>
                  {item1?.sMenuProps == "FORMDATA" ? (
                    <>
                      {accountDetails?.details?.map(item => {
                        switch (item?.component?.sType) {
                          case "AVATAR":
                            return (
                              <MenuItem onClick={handleCloseUserMenu}>
                                <Grid item {...item?.grid_props}>
                                  <Avatar
                                    alt={item?.data?.sAction}
                                    src={`${baseURL}${item?.data?.sDataSource}`}
                                    {...item?.component?.sProps}
                                  />
                                </Grid>
                              </MenuItem>
                            );
                          case "VARTEXT": {
                            return (
                              <MenuItem onClick={handleCloseUserMenu}>
                                {rendervartextcomponent(item, varValue)}
                              </MenuItem>
                            );
                          }
                          case "GLOBALTEXT": {
                            return (
                              <MenuItem onClick={handleCloseUserMenu}>
                                {renderglobaltextcomponent(item, getFieldValue)}
                              </MenuItem>
                            );
                          }
                          case "DIVIDER":
                            return (
                              <MenuItem onClick={handleCloseUserMenu}>
                                <Grid item {...item?.grid_props}>
                                  <Divider
                                    {...item?.component?.sProps}
                                    sx={{
                                      width: "100%"
                                    }}
                                  >
                                    {/* {item?.component?.sName} */}
                                  </Divider>
                                </Grid>
                              </MenuItem>
                            );
                          default:
                            return null;
                        }
                      })}
                    </>
                  ) : (
                    <Tooltip title={item1?.sToolTip} key={item1.sCaption}>
                      <MenuItem>
                        <Link to={item1.sMenuRoute}>
                          <span>
                            <IconButton>
                              <Icon iconName={item1?.sImageType} />
                            </IconButton>
                          </span>
                          {item1.sCaption}
                        </Link>
                      </MenuItem>
                    </Tooltip>
                  )}
                </>
              ))}
            </Grid>
          </Grid>
        </Menu>
      </Box>

      {/* ends user */}
      <Box
        sx={{
          flexGrow: !toggle ? 1 : 0,
          display: { xs: "flex", md: "none" },
          color: "black",
          justifyContent: "flex-end"
        }}
      >
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MoreIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left"
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: "block", md: "none" }
          }}
        >
          {data?.map((navItem, navind) => (
            <React.Fragment key={navind}>
              <Box>
                {navItem?.bDisplayName === 1 && (
                  <MenuItem onClick={handleCloseNavMenu} textAlign="center">
                    {navItem.sMenuName}
                  </MenuItem>
                )}
              </Box>
            </React.Fragment>
          ))}
        </Menu>
      </Box>
    </>
  );
};

export default Navbar;
