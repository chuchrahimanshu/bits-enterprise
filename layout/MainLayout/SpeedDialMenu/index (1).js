import React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { Icon } from "../../../utils/MuiIcons/Icon";
import { useNavigate } from "react-router";

// import * as MUIICon from "@mui/icons-material";
// import { Icon } from "@material-ui/core"

const SpeedDialMenu = ({ data }) => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ height: "80vh", transform: "translateZ(0px)", flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: "absolute", bottom: 1, right: 6 }}
        icon={<SpeedDialIcon />}
      >
        {data?.map((action) => {
          const icon = (action?.sImageType)?.replace("Icon", "");
          return (
            <SpeedDialAction
              key={action.sMenuName}
              icon={<Icon iconName={icon} />}
              tooltipTitle={action.sToolTip}
              onClick={(e) => {
                    // e.stopPropagation()
                    navigate(action.sMenuRoute);
                    
                  }}
            />
          );
        })}
      </SpeedDial>
    </Box>
  );
};

export default SpeedDialMenu;
