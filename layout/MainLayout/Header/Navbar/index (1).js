import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Divider, Popover, Stack, Badge, Grid } from '@mui/material';
import axios from 'axios';
import { baseURL } from '../../../../api';
import MailIcon from '@mui/icons-material/Mail';
import { Icon } from '../../../../utils/MuiIcons/Icon';
import { Link } from 'react-router-dom';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import SimpleListMenu from '../../../../component/SelectedMenu/SelectedMenu';
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Navbar = ({ toggle }) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElWidge, setAnchorElWidge] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [index, setIndex] = React.useState(-1);
  const [widgetMenu, setWidgetMenu] = React.useState([]);
  const [accountDetails, setAccountDetails] = React.useState();
  const [userInfo, setUserInfo] = React.useState();
  const [indexWidge, setIndexWidge] = React.useState(-1);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
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
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //
  React.useEffect(() => {
    axios
      .get(`${baseURL}/getNavBarMenu`)
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log('Navbar Error', error);
      });
    axios
      .get(`${baseURL}/getWidgetMenu`)
      .then((response) => {
        setWidgetMenu(response.data.data);
      })
      .catch((error) => {
        console.log('Navbar Error', error);
      });
    // account
    axios
      .get(`${baseURL}/forms/getForm?formname=accountForm`)
      .then((response) => {
        setAccountDetails(response.data.data);
      })
      .catch((error) => {
        console.log('Navbar Error', error);
      });
    // get info
    axios
      .get(`${baseURL}/getUserDetail`)
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.log('Navbar Error', error);
      });
  }, []);

  const getFieldValue = (sName) => {
    const [orgKey, fieldName] = sName?.split('.') ?? [];
    return userInfo?.data?.[fieldName];
  };
  const icon = widgetMenu[0]?.sImageType.replace('OutlinedIcon', '');

  const openWidge = Boolean(anchorElWidge);
  const handleOpenUserMenuWidge = (event) => {
    setAnchorElWidge(event.currentTarget);
  };
  const handleCloseWidge = (event) => {
    setAnchorElWidge(null);
  };


  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {data?.map((navItem, ind) => (
          <Box
            onMouseOver={() => setIndex(ind)}
            onMouseOut={() => setIndex(-1)}
          >
            <Divider orientation="vertical" flexItem />
            <Tooltip title={navItem?.sToolTip}>
              {navItem.sMenuContainer === 'MENU' ? (
                <Stack
                  direction="row"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <span style={{ padding: '0px 1px', color: '#000' }}>
                    <Icon iconName={navItem?.sImageType} />
                  </span>
                  <Typography
                    position="relative"
                    onClick={() => setIndex(ind)}
                    key={navItem}
                    sx={{
                      mx: navItem?.bDisplayName ? 1 : 0,
                      color: '#000',
                      cursor: 'pointer',
                    }}
                  >
                    {navItem?.bDisplayName === 1 && navItem?.sMenuName}
                  </Typography>
                </Stack>
              ) : navItem?.sMenuContainer === 'AVATAR' ? (
                <Avatar>P</Avatar>
              ) : navItem?.sMenuContainer === 'BUTTON' ? (
                <Button variant="contained">
                  {navItem?.bDisplayName === 1 && navItem?.sMenuName}
                </Button>
              ) : navItem?.sMenuContainer === 'ELIPSIS' ? (
                <IconButton>
                  <MoreHorizOutlinedIcon />
                </IconButton>
              ) : navItem?.sMenuContainer === 'SELECTED' ? (
                <SimpleListMenu data={navItem} />
              ) : null}
            </Tooltip>
            {navItem.submenu && index === ind && (
              <Box
                open={index === ind}
                onClick={() => setIndex(-1)}
                anchorEl={anchorEl}
                sx={{
                  position: 'absolute',
                  boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 2px',
                  p: '2rem 1rem .5rem 1rem',
                  cursor: 'pointer',
                  backgroundColor: '#fff',
                  zIndex: '5',
                }}
              >
                {index === ind &&
                  navItem.submenu.map((menu) => (
                    <Link to={menu.sMenuRoute}>
                      <Tooltip title={menu.sToolTip}>
                        <Typography
                          className="menu-close"
                          onClick={handleClose}
                        >
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
        ))}

        <Divider orientation="vertical" flexItem />
      </Box>
      {/* widge menu */}
      <Box
        sx={{
          flexGrow: 0,
          backgroundColor: 'black',
          display: { xs: 'none', md: 'flex' },
          mx: 3,
        }}
        onClick={handleOpenUserMenuWidge}

      >
        <Badge badgeContent={4} 
        color='primary'
        // {...widgetMenu[0]?.sMenuProps}
        >
          <Icon
            iconName={icon}
            style={{ backgroundColor: 'black', color: 'black' }}
          />
        </Badge>
        <Menu
          sx={{ mt: '45px', p: 2 }}
          anchorEl={anchorElWidge}
          open={openWidge}
          onClose={handleCloseWidge}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {widgetMenu[0]?.submenu.map((item) => {
            return (
              <MenuItem onClick={(event) => {
                event.stopPropagation();
                handleCloseWidge();
              }}>
              <Box sx={{ p: 1 }}>
                <Link to={item.sMenuRoute} key={item.sCaption}>
                  <Tooltip title={item?.sToolTip}>
                    <Typography className="menu-close">
                      {item.sCaption}
                    </Typography>
                  </Tooltip>
                </Link>
              </Box>
              </MenuItem>
            );
          })}
        </Menu>
      </Box>
      {/* account section */}
      <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar src="/static/images/avatar/2.jpg" />
            <Typography id={accountDetails?.form?.id}>
              &nbsp; {accountDetails?.form?.sFormAction}
            </Typography>
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
        >
          <Grid container>
            {accountDetails?.details.map((item) => {
              switch (item?.component?.sType) {
                case 'AVATAR':
                  return (
                    <Grid item {...item?.component?.grid_props}>
                      <MenuItem onClick={handleCloseUserMenu}>
                        <Avatar
                          alt={item?.data?.sAction}
                          src={`${baseURL}${item?.data?.sDataSource}`}
                          {...item?.component?.sProps}
                        />
                        <Typography id={item?.component?.sName}>
                          &nbsp; {item?.component?.sAdornType}
                        </Typography>
                      </MenuItem>
                    </Grid>
                  );
                case 'GLOBALTEXT':
                  return (
                    <Grid item {...item?.component?.grid_props}>
                      <MenuItem onClick={handleCloseUserMenu}>
                        <Typography {...item?.component?.sProps}>
                          {getFieldValue(item?.component?.sName)}
                        </Typography>
                      </MenuItem>
                    </Grid>
                  );
                case 'DIVIDER':
                  return (
                    <Grid item {...item?.component?.grid_props}>
                      <MenuItem onClick={handleCloseUserMenu}>
                        <Divider {...data?.component?.sProps} />
                      </MenuItem>
                    </Grid>
                  );
                default:
                  return null;
              }
            })}
          </Grid>
        </Menu>
      </Box>

      {/* ends user */}
      <Box
        sx={{
          flexGrow: !toggle ? 1 : 0,
          display: { xs: 'flex', md: 'none' },
          color: 'black',
          justifyContent: 'flex-end',
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
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: 'block', md: 'none' },
          }}
        >
          {data?.map((navItem) => (
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
    </>
  );
};

export default Navbar;
