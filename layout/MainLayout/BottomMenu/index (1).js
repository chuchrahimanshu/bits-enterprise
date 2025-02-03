import { BottomNavigation, BottomNavigationAction, Tooltip } from '@mui/material'
import React from 'react'
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Icon } from '../../../utils/MuiIcons/Icon';
import { Link } from 'react-router-dom';

const BottmMenu = ({menu}) => {
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation showLabels 
    value={value}
    onChange={(event, newValue) => {
      setValue(newValue);
    }}>
    {menu?.map((item)=>{
      const icon = (item?.sImageType || "AdjustOutlined").replace("Icon", "");
      return(
        <Link to={item.sMenuRoute}>
        <Tooltip title={item.sToolTip}>
        <BottomNavigationAction sx={{ "& .css-1gh6k7f-MuiBottomNavigationAction-label": { opacity: 1 } }} label={item?.bDisplayName === 1 && item.sMenuName} icon={<Icon iconName={icon}/>} />
        </Tooltip>
        </Link>
      )

    })}
    </BottomNavigation>
  )
}

export default BottmMenu