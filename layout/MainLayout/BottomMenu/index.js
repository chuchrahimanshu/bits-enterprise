import { BottomNavigation, BottomNavigationAction, Tooltip } from "@mui/material";
import React from "react";

import { Icon } from "../../../utils/MuiIcons/Icon";
import { Link } from "react-router-dom";
import { Global_Data } from "../../../globalData/GlobalData";

const BottmMenu = ({isDarkTheme, menu }) => {
  const [value, setValue] = React.useState(0);
  const { sideBarStyle} = Global_Data?.() || {};

  return (
    <BottomNavigation id="bottom-navigation"
      showLabels
      value={value}
      sx={sideBarStyle['bottom-navigation']}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
    >
      
      {menu?.map((item, index) => {
        const icon = (item?.sImageType || "AdjustOutlined").replace("Icon", "");
        return (
          <React.Fragment key={index}>
            <Link to={item.sMenuRoute}>
              <Tooltip title={item.sToolTip}>
                <BottomNavigationAction
                  // sx={{
                  //   "& .css-1gh6k7f-MuiBottomNavigationAction-label": {
                  //     opacity: 1
                  //   }
                  // }}
                  label={item?.bDisplayName === 1 && item.sMenuName}
                  icon={<Icon iconName={icon} />}
                />
              </Tooltip>
            </Link>
          </React.Fragment>
        );
      })}
    </BottomNavigation>
  );
};

export default BottmMenu;
