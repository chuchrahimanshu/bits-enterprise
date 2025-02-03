import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../../../../api";
import { Global_Data } from "../../../../globalData/GlobalData";
import {
  renderTypography,
  renderglobaltextcomponent,
  rendervartextcomponent
} from "../../../../pages/hooks/ComponentsData";
import { Avatar, Divider, Grid, MenuItem } from "@mui/material";

function AccountMenus({ data, varValue, getFieldValue }) {
  const [formData, setFormData] = useState({});
  const { token, setToken, userData, setUserData } = Global_Data();
  function fetchDetails() {
    axios
      .get(`${baseURL}${data.sMenuRoute}`, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      })
      .then(response => {
        setFormData(response.data);
      })
      .catch(() => {
        //   setCustomError("Something went Wrong");
      });
  }
  useEffect(() => {
    fetchDetails();
  }, [data]);
  return (
    <>
   <Grid container>

      {formData?.details &&
        formData?.details.map(item => {
            switch (item?.component?.sType) {
                case "AVATAR":
                    return (
                        <Grid item {...item?.grid_props}>
                  <MenuItem
                  //</Grid>onClick={handleCloseUserMenu}
                  >
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
                  <MenuItem
                  //   onClick={handleCloseUserMenu}
                  >
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
            </Grid>
    </>
  );
}

export default AccountMenus;
