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
import { baseURL } from '../../api';
import MailIcon from '@mui/icons-material/Mail';
import { Icon } from '../../utils/MuiIcons/Icon';
import { Link, Navigate } from 'react-router-dom';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import SimpleListMenu from '../../component/SelectedMenu/SelectedMenu';
import { useNavigate } from 'react-router-dom';

// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const FormBar = ({ toggle, menu }) => {
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
  const navigate = useNavigate();

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
    const uri=baseURL+menu
    axios
      .get(uri,{
        headers: {
          Authorization: `Bearer ${token}`,
          // Other headers if needed
        }
      })
      .then((response) => {
        setData(response.data.data);
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
    <Grid container>
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {data?.map((navItem, ind) => (
            
            <Grid item {...JSON.parse(navItem?.sGridProps)}>

          <Box
            onMouseOver={() => setIndex(ind)}
            onMouseOut={() => setIndex(-1)}
          >
            {/*<Divider orientation="vertical" flexItem /> */}
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
                <Button variant="contained"onClick={() => navigate(navItem?.sMenuRoute)}>
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
          </Grid>
        ))}

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
      </Grid>
    </>
  );
};

export default FormBar;
