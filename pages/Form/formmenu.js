import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Divider, Popover, Stack, Badge, Grid, List, ListItem } from "@mui/material";
import axios from "axios";
import { baseURL } from "../../api";
import MailIcon from "@mui/icons-material/Mail";
import { Icon } from "../../utils/MuiIcons/Icon";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import SimpleListMenu from "../../component/SelectedMenu/SelectedMenu";
import { useNavigate } from "react-router-dom";
import { Global_Data } from "../../globalData/GlobalData";
import { serverAddress } from "../../config";

// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const FormBar = ({ toggle, item, menu }) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElWidge, setAnchorElWidge] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [index, setIndex] = React.useState(0);
  const [widgetMenu, setWidgetMenu] = React.useState([]);
  const [accountDetails, setAccountDetails] = React.useState();
  const [userInfo, setUserInfo] = React.useState();
  const [indexWidge, setIndexWidge] = React.useState(-1);

  const {
    token,
    // formData,
    // overlaySplit
    formData,
    handleClickOpen,
    sideBarStyle,
    overlaySplit,isDialogDrawerOpen,
    setEditApi,
    setOpen,textValue,  setOverLaySplit,
    setModalActionTypeAndID,
    setDefaultTableSelectedLocation,
    setDefaultTableSelectedDataAwareData,
    setDefaultTableSelectedSupplier
  } = Global_Data();
  // const { token, globalvariables ,sideBarStyle} = Global_Data();

  const location = useLocation();
  const navigate = useNavigate();

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
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //
  React.useEffect(() => {
    if (menu) {
      const uri = `${baseURL}${menu}`;
      axios
        .get(uri, {
          headers: {
            Authorization: `Bearer ${token}`
            // Other headers if needed
          }
        })
        .then(response => {
          setData(response.data.data.menu);
        })
        .catch(error => {
          console.log("Navbar Error", error);
        });
    }
  }, [menu]);
  // const { token, formData } = Global_Data();

  const [isRestricted, setRestricted] = useState(false);

  // function fetchActivity() {
  //   const urlCapture =
  //     serverAddress +
  //     `/form/isallowed/transaction?module=${formData.form.sFormName}&activity=${data?.component.options.action}`;
  //   axios
  //     .get(urlCapture, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //         // Other headers if needed
  //       }
  //     })
  //     .then(result => {

  //       if (result.data.data.Access == "No") {
  //         setRestricted(true);
  //       }
  //     })
  //     .catch(error => {
  //       console.error(error, "error456");
  //     });
  // }

  useEffect(() => {
    fetchAccess(data);
    return () => {
      setRestricted(false);
    };
  }, [formData, data]);

  // console.log(data);

  const getFieldValue = sName => {
    const [orgKey, fieldName] = sName?.split(".") ?? [];
    return userInfo?.data?.[fieldName];
  };
  const icon = widgetMenu[0]?.sImageType.replace("OutlinedIcon", "");

  const openWidge = Boolean(anchorElWidge);

  const handleOpenUserMenuWidge = event => {
    setAnchorElWidge(event.currentTarget);
  };

  const handleCloseWidge = event => {
    setAnchorElWidge(null);
  };

  function handleClickOpen1(navItem) {
    const mode = {
      options: {
        mode: "DEFAULT",
        handler: "handleDialog",
        dialog: navItem.sMenuRoute
      }
    };
    handleClickOpen(mode);
  }

  const [anchorEl1, setAnchorEl1] = React.useState(null);

  const handleClick2 = event => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl1(null);
  };

  const open1 = Boolean(anchorEl1);
  const id = open1 ? "simple-popover" : undefined;
  function parseMenuProps(sMenuProps) {
    try {
      const menuPropsObject = JSON.parse(sMenuProps);
      return menuPropsObject;
    } catch (error) {
      console.error("Error parsing :", error);
      return null;
    }
  }

  const downloadCsV = async (uri,name) => {
    try {
      const response = await axios.get(`${baseURL}${uri}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const csvContent = textToCsv(response.data);

      const blob = new Blob([csvContent], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${name}.csv`;
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  const textToCsv = inputText => {
    const lines = inputText.split("\n");
    const header = lines[0].split(",").map(item => item.trim()); // Fix here
    const data = lines.slice(1).map(line => line.split(",").map(item => item.trim())); // Fix here
    const csvContent = [header.join(",")].concat(data.map(row => row.join(","))).join("\n");
    return csvContent;
  };

  const searchParams = new URLSearchParams(location.search);
  const poId = searchParams.get("id");
  const [BUTTONDIALOG, SETBUTTONDIALOG] = useState({});
  function fetchAccess(data, action) {
    for (let i = 0; i < data?.length; i++) {
      // SETBUTTONDIALOG(true)
      const urlCapture =
        serverAddress +
        `/form/isallowed/transaction?module=${formData?.form?.sFormName}&activity=${data[i].sAction}`;
      axios
        .get(urlCapture, {
          headers: {
            Authorization: `Bearer ${token}`
            // Other headers if needed
          }
        })
        .then(result => {
          //  alert(JSON.stringify(result.data.data.Access))
          if (result.data.data.Access == "No") {
            // setRestricted(true);
            SETBUTTONDIALOG(pre => ({ ...pre, [data[i].sGlobalID]: true }));
          } else {
            SETBUTTONDIALOG(pre => ({ ...pre, [data[i].sGlobalID]: false }));
          }
        })
        .catch(error => {
          console.error(error, "error456");
        });
    }
  }
  function handleIconDialog(navItem) {
    const EditData = formData.details.filter(
      (item, index) => item?.component?.sName === navItem.sMenuRoute
    );
    // The URL from which you want to extract the id
    const url = window.location.href;

    // Create a new URL object
    const urlObj = new URL(url);

    // Use URLSearchParams to get the value of the 'id' parameter
    const id = urlObj.searchParams.get("id");

    // alert(JSON.stringify(EditData[0]?.component?.sFormSource+id))

    setEditApi(EditData[0]?.component?.sFormSource + id);
    // alert(navItem.sMenuRoute)

    setOpen(true);

    const mode = {
      options: {
        mode: "DEFAULT",
        handler: "handleDialog",
        dialog: navItem.sMenuRoute
      }
    };

    handleClickOpen(mode);
    setModalActionTypeAndID({
      type: navItem.sAction == "DELETE" ? "delete" : navItem.sAction,
      id: EditData[0]?.component?.sFormSource + id,
      // row: params?.row,
      PrimaryKey: EditData[0]?.component?.sFormSource + id
    });
  }

  const urlObj = new URL(window.location.href);
  // Get the 'next' and 'pre' search parameters
  const nextValue = getQueryParam("next");
  const preValue = getQueryParam("pre");

 

  // useEffect(() => {
  //   ;
  // },[]);
  function findObjects(data, keyName, value) {
    const index = data.findIndex(item => item[keyName] === value);

    if (index === -1) {
      return null; // Return null if the object is not found
    }

    return {
      preOBJ: data[index - 1] || null,
      cruntOBJ: data[index],
      nextOBJ: data[index + 1] || null
    };
  }
  async function handleFirstItem(){
  let rowData = await localStorage.getItem('GridData')
  let data = await JSON.parse(rowData)
  let keyName= formData.form.sPrimaryKey
  const result = findObjects(data, keyName, data?.[0]?.[keyName]);
  let nextOBJ = result.nextOBJ?.[keyName] || null
  let cruntOBJ = result.cruntOBJ?.[keyName] || null
  let preOBJ = result.preOBJ?.[keyName] || null
  navigate(`${window.location.pathname}?id=${cruntOBJ}&pre=${preOBJ}&next=${nextOBJ}`);

  }
  async function handleLastItem(){
    let rowData = await localStorage.getItem('GridData')
    let data = await JSON.parse(rowData)
    let keyName= formData.form.sPrimaryKey
    const result = findObjects(data, keyName, data?.[data.length-1]?.[keyName]);
    let nextOBJ = result.nextOBJ?.[keyName] || null
    let cruntOBJ = result.cruntOBJ?.[keyName] || null
    let preOBJ = result.preOBJ?.[keyName] || null
    navigate(`${window.location.pathname}?id=${cruntOBJ}&pre=${preOBJ}&next=${nextOBJ}`);
  }

   const handleNext = async() => {
    const id = getQueryParam("id");
    let value = nextValue
    let keyName = formData.form.sPrimaryKey
    let rowData = await localStorage.getItem('GridData')
    let data = await JSON.parse(rowData)
    const result = findObjects(data, keyName, value);
// alert(JSON.stringify(result));
let nextOBJ = result.nextOBJ?.[keyName] || null
    let cruntOBJ = result.cruntOBJ?.[keyName] || null
    let preOBJ = result.preOBJ?.[keyName] || null
navigate(`${window.location.pathname}?id=${cruntOBJ}&pre=${preOBJ}&next=${nextOBJ}`);
    // navigate(`${window.location.pathname}?id=${nextValue || null}&pre=${id}`);
  };

  const handlePre = async() => {
   
    const id = getQueryParam("id");
    let value = preValue
    let keyName = formData.form.sPrimaryKey
    let rowData = await localStorage.getItem('GridData')
    let data = await JSON.parse(rowData)
    const result = findObjects(data, keyName, value);
// alert(JSON.stringify(result));
let nextOBJ = result.nextOBJ?.[keyName] || null
    let cruntOBJ = result.cruntOBJ?.[keyName] || null
    let preOBJ = result.preOBJ?.[keyName] || null
navigate(`${window.location.pathname}?id=${cruntOBJ}&pre=${preOBJ}&next=${nextOBJ}`);
  };

  function getQueryParam(param) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
function replaceValueInBrackets(uri, data) {
  return uri?.replace(/\[([^\]]+)\]/g, (match, key) => {
    return data[key] || match; // Replace with value from data or leave unchanged if key not found
  });
}
  return (
    <>
      {/* ssS

<br /> */}
      <br />
      <br />

      {/* <br /> */}
      <br />
      <br />
      {/* {JSON.stringify(sideBarStyle)} */}
      {/* {getQueryParam('next')} */}
      {/* {JSON.stringify(formData.details)} */}
      {/* {JSON.stringify(window.location.origin)} */}
      {menu && menu !== "" && (
        <Grid container>
          <Box id={overlaySplit? 'overlay-menu': "form-menu"} sx={sideBarStyle[overlaySplit? 'overlay-menu': "form-menu"]}>
            {data?.map((navItem, ind) => (
              <Grid item {...JSON.parse(navItem?.sGridProps)}>
                <Box onMouseOver={() => setIndex(ind)} onMouseOut={() => setIndex(-1)}>
                  {/*<Divider orientation="vertical" flexItem /> */}
                  {/* import FirstPageIcon from '@mui/icons-material/FirstPage'; */}
                  {ind == 0 && overlaySplit && (
                    <Tooltip title={"First"}>
                      <IconButton
                        onClick={() => handleFirstItem()}
                        style={{ padding: "0px 1px", color: "#000" }}
                      >
                        <Icon
                          iconName={"FirstPage"}
                          sProps={{ fontSize: "25px", marginX: "20px" }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                  {ind == 0 && overlaySplit && (
                    <Tooltip title={"Previous"}>
                      <IconButton
                        disabled={preValue && preValue == "null"}
                        onClick={() => handlePre()}
                        style={{ padding: "0px 1px", color: "#000" }}
                      >
                        <ArrowBackIosIcon
                          style={{
                            color: preValue && preValue == "null" && "#bab9b6",
                            fontSize: "18px",
                            marginX: "20px"
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}

                  {ind == 0 &&   overlaySplit && (
                    <Tooltip title={"Next"}>
                      {/* import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'; */}
                      {/* ArrowBackIosIcon  */}
                      <IconButton
                       disabled={nextValue && nextValue == "null"}
                        onClick={() => handleNext()}
                        style={{ padding: "0px 1px", color: "#000" }}
                      >
                        <Icon
                        
                          iconName={"ArrowForwardIos"}
                          sProps={{ fontSize: "18px", marginRight: "20px", color: nextValue && nextValue == "null" && "#bab9b6", }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                  {ind == 0 && overlaySplit && (
                    <Tooltip title={"Last"}>
                      {/* import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; */}
                      {/* ArrowBackIosIcon  */}
                      {/* import LastPageIcon from '@mui/icons-material/LastPage'; */}
                      <IconButton
                        onClick={() => handleLastItem()}
                        style={{ padding: "0px 1px", color: "#000" }}
                      >
                        <Icon
                          iconName={"LastPage"}
                          sProps={{ fontSize: "25px", marginRight: "20px" }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title={navItem?.sToolTip}>
                    {navItem?.sMenuContainer === "MENU" ? (
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
                    ) : navItem?.sMenuContainer === "BUTTONDIALOG" ? (
                      <Grid {...navItem?.sMenuProps}>
                        <Button
                          id={navItem.sMenuID}
                          disabled={BUTTONDIALOG[navItem.sGlobalID]}
                          // onClick={() => navigate(navItem?.sMenuRoute, { state: { dialog: true } })}
                          onClick={() => handleClickOpen1(navItem)}
                          {...parseMenuProps(navItem?.sMenuProps)}
                        >
                          {navItem.sMenuName}
                        </Button>
                      </Grid>
                    ) : navItem?.sMenuContainer === "ICON" ? (
                      <>
                      {navItem.sMenuRoute ?  <IconButton style={{ padding: "0px 1px", color: "#000" }} onClick={() => {
                        setOverLaySplit(false);
                        navigate(replaceValueInBrackets(navItem.sMenuRoute,textValue))
                      }}>
                        <Icon
                          sProps={JSON.parse(navItem?.sImageProps)}
                          iconName={navItem?.sImageType}
                        />
                      </IconButton> :  <IconButton style={{ padding: "0px 1px", color: "#000" }}>
                          <Icon
                            sProps={JSON.parse(navItem?.sImageProps)}
                            iconName={navItem?.sImageType}
                          />
                      </IconButton>}
                      </>
                    ) : navItem?.sMenuContainer === "ICONDIALOG" ? (
                      <IconButton
                        onClick={() => handleIconDialog(navItem)}
                        style={{ padding: "0px 1px", color: "#000" }}
                      >
                        {/* {JSON.stringify(navItem.sMenuRoute)} */}
                        {navItem.sMenuRoute ? (
                          <Icon sProps={navItem?.sImageProps} iconName={navItem?.sImageType} />
                        ) : (
                          <Icon sProps={navItem?.sImageProps} iconName={navItem?.sImageType} />
                        )}
                      </IconButton>
                    ) : navItem?.sMenuContainer === "BUTTON" ? (
                      <>
                        <Button
                          id={navItem.sMenuID} // variant="contained"
                          disabled={BUTTONDIALOG[navItem.sGlobalID]}
                          onClick={e => {
                            if (navItem?.sMenuRoute) {
                              navigate(poId ? navItem?.sMenuRoute + poId : navItem?.sMenuRoute);
                              setDefaultTableSelectedLocation("")
                              setDefaultTableSelectedDataAwareData({})
                              setDefaultTableSelectedSupplier("")
                            } else if (navItem?.submenus.length > 0) {
                              handleClick(e);
                              setDefaultTableSelectedLocation("")
                              setDefaultTableSelectedDataAwareData({})
                              setDefaultTableSelectedSupplier("")
                            }
                          }}
                          {...JSON.parse(navItem?.sMenuProps)}
                        >
                          {/* {JSON.stringify(navItem.submenus)} */}

                          {navItem?.bDisplayName === 1 && navItem?.sMenuName}
                          {(navItem?.sImageType && navItem?.sImageType.length > 0) ||
                          navItem.submenus?.length > 0 ? (
                            <Icon iconName="ArrowDropDown" />
                          ) : null}
                        </Button>
                        <Popover
                          id={id}
                          open={open}
                          anchorEl={anchorEl}
                          onClose={handleClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right"
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right"
                          }}
                        >
                          <List>
                            {navItem?.submenus?.map((item, index) => (
                              <ListItem key={index}>
                                {item.sCaption == "Export Chart of Accounts" ? (
                                  <Typography
                                    className="cursor-poniter"
                                    onClick={() => downloadCsV(item.sMenuRoute,item.sCaption)}
                                  >
                                    {item.sCaption}
                                  </Typography>
                                ) : (
//onClick={()=> setOverLaySplit(false)} to={replaceValueInBrackets(navItem.sMenuRoute,textValue)}
                                  <Link  onClick={()=>{
                                    handleClose()
                                    setOverLaySplit(false)
                                  }} to={ replaceValueInBrackets(item.sMenuRoute,textValue) }>
                                    {" "}
                                    <Typography >{item.sCaption}</Typography>
                                  </Link>
                                )}
                              </ListItem>
                            ))}
                          </List>
                        </Popover>
                      </>
                    ) : navItem?.sMenuContainer === "ELIPSIS" ? (
                      <>
                        {/* {navItem.sAction} */}
                        <IconButton
                          id={navItem.sMenuID}
                          disabled={BUTTONDIALOG[navItem.sGlobalID]}
                          sx={{ cursor: "pointer" }}
                          onClick={handleClick2}
                        >
                          <MoreHorizOutlinedIcon
                            aria-describedby={id}
                            // aria-describedby={id}
                            // variant="contained"
                          />
                        </IconButton>
                        <Popover
                          id={id}
                          open={open1}
                          anchorEl={anchorEl1}
                          onBlur={handleClose2}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center"
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "center"
                          }}
                        >
                          <List>
                            {navItem?.submenus?.map((item, index) => (
                              <ListItem key={index}>
                                {item.sMenuRoute.includes('/export/') ? (
                                  <Typography
                                    className="cursor-poniter"
                                    onClick={() => downloadCsV(item.sMenuRoute,item.sCaption)}
                                  >
                                 {item.sCaption}
                                  </Typography>
                                ) : (
                                  <Link to={item.sMenuRoute}>
                                    {" "}
                                  <Typography>{item.sCaption}</Typography>
                                  </Link>
                                )}
                              </ListItem>
                            ))}
                          </List>
                        </Popover>
                      </>
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
                        p: "2rem 1rem .5rem 1rem",
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        zIndex: "5"
                      }}
                    >
                      {index === ind &&
                        navItem.submenus !== undefined &&
                        navItem?.submenus?.map(menu => (
                          <Link to={menu.sMenuRoute}>
                            <Tooltip title={menu.sToolTip}>
                              <Typography className="menu-close" onClick={handleClose}>
                                {menu.sCaption}
                                <span>
                                  <IconButton>
                                    <Icon iconName={menu?.sDefaultActionImage} />
                                  </IconButton>
                                </span>
                              </Typography>
                            </Tooltip>
                          </Link>
                        ))}
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
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
              {data?.map(navItem => (
                <Box>
                  {navItem?.bDisplayName === 1 && (
                    <MenuItem onClick={handleCloseNavMenu} textAlign="center">
                      {navItem.sMenuName}
                    </MenuItem>
                  )}
                  {/* <Typography textAlign="center">{navItem?.submenu?.map((subMenu)=>{
                    <Typography>{subMenu?.sCaption}</Typography>
                  })}</Typography> */}
                </Box>
              ))}
            </Menu>
          </Box>
        </Grid>
      )}
    </>
  );
};

export default FormBar;
