import {
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Tooltip,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { useLocation, useParams, useNavigate } from "react-router";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useDispatch } from "react-redux";

import axios from "axios";
import { Icon } from "../../../utils/MuiIcons/Icon";
import { getComp } from "../../../utils/store/action/drawerActions";
import { Global_Data } from "../../../globalData/GlobalData";

function MenuItemsList({ isDrowerExist, data, toggle }) {
  
  const { token, sideBarActive, setsideBarActive, setsideBarActiveBtn } = Global_Data();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const icon = data?.sImageType?.replace("Icon", "");

  const handleClick = url => {
    setOpen(prev => !prev);
    if (url) {
      // window.location.href =baseURL+url;
      navigate(url);
    }
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = event => {
    // setShowPopover(true)
    // if (anchorEl !== event.currentTarget) {
    setAnchorEl(event.currentTarget);
    // }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    // setShowPopover(false)
  };

  let iOpen = Boolean(anchorEl);

  async function imageURL(imageUrl) {
    try {
      const authToken = token;

      const response = await axios.get(imageUrl, {
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        responseType: "blob" // Set the response type to 'blob' to handle binary data (images)
      });

      const blob = response.data; // Access the blob data directly from the response
      const objectURL = URL.createObjectURL(blob);
      return objectURL;
    } catch (error) {
      console.error(error, "subMenu367");
    }
  }

  // console.log(
  //   imageURL("http://13.231.17.170:8080/user/images/enterprise/get?filename=mrbean.png"),
  //   "subMenu367"
  // );

  function handleClickModal(subMenu, e) {
    dispatch(getComp(subMenu));
    e.stopPropagation();
    navigate(subMenu.sMenuRoute, { state: { dialog: true } });
  }

  const { pathname } = useLocation();

  function getItemTrue(data, sRoute) {
    let result = [];
    data.forEach(item => {
      if (item.sMenuID === sRoute) {
        result.push(item);
      }
      if (item.data && item.data.length > 0) {
        const nestedResults = getItemTrue(item.submenus, sRoute);
        result = result.concat(nestedResults);
      }
    });
    return result[0] ? true : false;
  }
  const param = useParams();
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
  return (
    <>
      {!data.submenus.length > 0 ? (
        <>
          {pathname == data?.sMenuRoute}
          <Tooltip title={data.sToolTip} placement="right-start">
            <Grid item id={data.sMenuID+'-grid'} > {/* for menus without submenu */}
              <ListItemButton id={"menu-item-list"+data.sMenuID}
                onClick={() => {
                  setsideBarActiveBtn(data.sMenuID);
                  handleClick(data?.sMenuRoute);
                }}
                sx={{ 
                  minHeight: 48,
                  justifyContent: toggle ? "initial" : "center",
                  bgcolor: isDrowerExist
                    ? data?.sMenuRoute == window.location.pathname + window.location.search &&
                      "primary.light"
                    : sideBarActive == data.sMenuID
                    ? "primary.light"
                    : getItemTrue(data.submenus, sideBarActive)
                    ? ""
                    : "",
                  color: isDrowerExist
                    ? data?.sMenuRoute == window.location.pathname + window.location.search &&
                      "primary.contrastText"
                    : sideBarActive == data.sMenuID
                    ? "primary.contrastText"
                    : getItemTrue(data.submenus, sideBarActive)
                    ? "primary.dark"
                    : "",
                    ...parseData(data?.sGridProps)
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,                    
                    justifyContent: toggle ? "initial" : "center",
                    ...parseData(data.sImageProps)
                  }}
                  id={ data.sMenuID + '-icon'}
                  // onClick={e => handlePopoverOpen(e)}
                >
                  <Icon
                    color={
                      isDrowerExist
                        ? data?.sMenuRoute == window.location.pathname + window.location.search &&
                          "primary.contrastText"
                        : sideBarActive == data.sMenuID
                        ? "primary.contrastText"
                        : getItemTrue(data.submenus, sideBarActive)
                        ? "primary.dark"
                        : ""
                    }
                    
                    iconName={icon}
                  />
                </ListItemIcon>
                <ListItemText primary={data.sMenuName} sx={{ opacity: toggle ? 1 : 0 }} primaryTypographyProps={parseData(data.sMenuProps)} id={ data.sMenuID + '-label'} />
                {data.submenus?.length === 0 ? null : toggle === true ? (
                  open && toggle ? (
                    <ExpandLess  {...parseData(data.sImageProps)} />
                  ) : (
                    <ExpandMore  {...parseData(data.sImageProps)} />
                  )
                ) : null}
              </ListItemButton>
            </Grid>
          </Tooltip>
        </>
      ) : (
        
        <MenuSubItems 
          isDrowerExist={isDrowerExist}
          sideBarActive={sideBarActive}
          toggle={toggle}
          setsideBarActiveBtn={setsideBarActiveBtn}
          subMenu={data}
        /> 
      )}
    </>
  );
}

function MenuSubItems({
  setsideBarActiveBtn,
  isDrowerExist,
  sideBarActive,
  subMenu,
  toggle,
  paddingNum,
  stylePopwer = false
}) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = event => {
    // setShowPopover(true)
    // if (anchorEl !== event.currentTarget) {
    setAnchorEl(event.currentTarget);
    // }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    // setShowPopover(false)
  };

  let iOpen = Boolean(anchorEl);

  function getItemTrue(data, sRoute) {
    let result = [];
    data.forEach(item => {
      if (item.sMenuID === sRoute) {
        result.push(item);
      }
      if (item.data && item.data.length > 0) {
        const nestedResults = getItemTrue(item.submenus, sRoute);
        result = result.concat(nestedResults);
      }
    });
    return result[0] ? true : false;
  }
  function getAllRoutes(data, route) {
    const routes = [];

    function traverse(items) {
      for (const item of items) {
        if (item?.sMenuRoute == route) {
          return true;
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

  function checkRouteExists(data, route) {
    // Base case: Empty data or empty route
    if (!data || !route) {
      return false;
    }

    // Check if the route matches the current sMenuRoute

    for (let index = 0; index < data.length; index++) {
      if (data[index]?.sMenuRoute === route) {
        return true;
      }
    }

    // Recursively check submenus for a match
    for (const item of data) {
      if (item.submenus && checkRouteExists(item.submenus, route)) {
        return true;
      }
    }

    // No match found
    return false;
  }
  function checkRouteIDExists(data, route) {
    // Base case: Empty data or empty route
    if (!data || !route) {
      return false;
    }

    // Check if the route matches the current sMenuRoute

    for (let index = 0; index < data.length; index++) {
      if (data[index]?.sMenuID == route) {
        return true;
      }
    }

    // Recursively check submenus for a match
    for (const item of data) {
      if (item.submenus && checkRouteIDExists(item.submenus, route)) {
        return true;
      }
    }

    // No match found
    return false;
  }
  const handleClickIcon = (e, route, item) => {
    setsideBarActiveBtn(item.sMenuID);
    e.stopPropagation();
    navigate(route);
  };
  const [hoverIndex, setHoverInder] = useState();
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
  return (
    <>
      {!subMenu?.submenus?.length > 0 ? (
        <>
          <ListItemButton>
            {/* <ListItemText primary={subMenu.sMenuName ?? subMenu.sCaption} /> */}
          </ListItemButton>
        </>
      ) : (
        <>
         <Grid item id={subMenu.sMenuID+'-grid'}  >
            <ListItemButton 
              onClick={e => {
                setOpen(!open);
                if (!toggle) {
                  handlePopoverOpen(e);
                }
              }}
              id={ subMenu.sMenuID}
              // sx={{
              //   bgcolor:

              //     subMenu?.sMenuRoute == sideBarActive
              //      ?  "primary.light"
              //       : getItemTrue(subMenu.submenus, window.location.pathname + window.location.search )
              //       ? ""
              //       : "",
              //   color:
              //   getAllRoutes(subMenu.submenus , window.location.pathname + window.location.search )
              //
              //       ? "primary.dark"
              //       : ""
              // }}
              sx={{
                color: isDrowerExist
                  ? checkRouteExists(
                      subMenu.submenus,
                      window.location.pathname + window.location.search
                    ) && "primary.dark"
                  : checkRouteIDExists(subMenu.submenus, sideBarActive) && "primary.dark",
                  ...parseData(subMenu?.sGridProps)
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  // px: toggle ? (paddingNum ? paddingNum : 2) : 0,
                  justifyContent: toggle ? "initial" : "center",
                  ...parseData(subMenu.sImageProps)
                }}
                id={ subMenu.sMenuID + '-icon'}
              > 
                <Icon
               
                  color={
                    isDrowerExist
                      ? checkRouteExists(
                          subMenu.submenus,
                          window.location.pathname + window.location.search
                        ) && "primary"
                      : checkRouteIDExists(subMenu.submenus, sideBarActive) && "primary"
                  }
                  // sProps={subMenu.sImageProps}
                  iconName={subMenu?.sImageType?.replace("Icon", "")}
                />
              </ListItemIcon>
              <ListItemText 
                primary={subMenu.sMenuName ?? subMenu.sCaption}
                sx={{ opacity: toggle ? 1 : 0}}
                // id={ subMenu.sMenuID}
                id={ subMenu.sMenuID + '-label'} 
                primaryTypographyProps={parseData(subMenu.sMenuProps)}             
              />
  {/* {subMenu.sMenuProps} */}
              {toggle ? open ? <ExpandLess {...parseData(subMenu.sImageProps)}  /> : <ExpandMore {...parseData(subMenu.sImageProps)} /> : null}
            </ListItemButton>
          </Grid>
        </>
      )}

      {toggle
        ? open
          ? subMenu?.submenus?.length > 0 &&
            subMenu?.submenus.map((item, ind) => {
              return (
                <>
                  {item.submenus.length > 0 ? (
                    <MenuSubItems
                      sideBarActive={sideBarActive}
                      setsideBarActiveBtn={setsideBarActiveBtn}
                      paddingNum={paddingNum ? paddingNum + 1 : 3}
                      subMenu={item}
                      isDrowerExist={isDrowerExist}
                      toggle={toggle}
                    />
                  ) : (
                    <>
                      {/* // {JSON.stringify(isDrowerExist)} */}
                      <Grid item id={item.sMenuID+'-grid' } >
                        <ListItemButton
                          onMouseEnter={() => setHoverInder(ind)}
                          onMouseLeave={() => setHoverInder()}
                            className={sideBarActive == item.sMenuID && "no-hover"}
                            sx={{
                              // pl: paddingNum ? 10 + paddingNum : 8,
                          
                              bgcolor: isDrowerExist
                                ? item?.sMenuRoute ==
                                    window.location.pathname + window.location.search && "primary.light"
                                : sideBarActive == item.sMenuID && "primary.light",

                              color: isDrowerExist
                                ? item?.sMenuRoute ==
                                    window.location.pathname + window.location.search &&
                                  "primary.contrastText"
                                : sideBarActive == item.sMenuID && "primary.contrastText",
                                ...parseData(item.sGridProps)
                            }}
                            onClick={() => {
                              setsideBarActiveBtn(item.sMenuID);
                              navigate(item.sMenuRoute);
                            }}
                            id={ item.sMenuID }
                        >
                          <ListItemText primary={item.sCaption} id={item.sMenuID+'-label'}  primaryTypographyProps={parseData(item.sMenuProps)}/>
                          {ind == hoverIndex && (
                              <IconButton
                                onClick={e => handleClickIcon(e, item.sDefaultActionMenuRoute, item)}
                                // style={{height:'30px',fontSize:}} 
                                id={item.sMenuID+'-action'}
                              >
                                <Icon
                                  sProps={item.sDefaultActionImageProps}
                                  iconName={item?.sDefaultActionImage}
                                />
                              </IconButton>
                          )}
                        </ListItemButton>
                      </Grid>
                    </>
                  )}
                </>
              );
            })
          : null
        : null}

      {!toggle && (
        <>
          <Popover
            id="mouse-over-popover"
            open={iOpen}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left"
            }}
            onClose={handlePopoverClose}
            sx={{ maxHeight: "calc(100% - 134px)", minWidth: "331px" }}
          >
            {/* {
              <ListItemButton
                className="no-hover"
                sx={{
                  pl: paddingNum ? 10 + paddingNum : 8,
                  bgcolor: pathname == subMenu.sMenuRoute && "primary.light",
                  color: pathname == subMenu.sMenuRoute && "primary.contrastText"
                }}
                onClick={() => {
                  if (subMenu.sMenuRoute) {
                    navigate(subMenu.sMenuRoute);
                  }
                }}
              >
                <ListItemText primary={subMenu.sCaption} />
              </ListItemButton>
            } */}

            {subMenu?.submenus?.length > 0 &&
              subMenu?.submenus.map(item => {
                return (
                  <>
                    {item.submenus.length > 0 ? (
                      <MenuSubItems
                        paddingNum={paddingNum ? paddingNum + 1 : 1}
                        subMenu={item}
                        toggle={true}
                        stylePopwer={true}
                      />
                    ) : (
                      <>
                        <ListItemButton
                        id={ item.sMenuID }
                          className={pathname == item.sMenuRoute && "no-hover"}
                          sx={{
                            pl: paddingNum ? 6 + paddingNum : 4,
                            bgcolor: pathname == item.sMenuRoute && "primary.light",
                            color: pathname == item.sMenuRoute && "primary.contrastText"
                          }}
                          onClick={() => {
                            if (item.sMenuRoute) {
                              navigate(item.sMenuRoute);
                            }
                          }}
                        >
                          <ListItemText primary={item.sCaption}  id={ item.sMenuID + '-label'}  />
                        </ListItemButton>
                      </>
                    )}
                  </>
                );
              })}
          </Popover>
        </>
      )}
    </>
  );
}

export default MenuItemsList;
