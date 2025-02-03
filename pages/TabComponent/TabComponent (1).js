import React, { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DateComponent from "../DateComponent/DateComponent";
import { validateTextField } from "../../utils/validations/Validation";
import { Grid, Icon, IconButton, InputAdornment, TextField } from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ data, handledatechange, textValue, handleTextValue,error  }) {
  const [value, setValue] = React.useState(0);
  const [formData, setFormData] = useState();
  // const [error, setError] = useState(null);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <Box sx={{ width: "100%" , marginTop: 5}} >
      <Box sx={{ borderBottom: 1, borderColor: "divider",  width: "100%" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {data?.child?.map((item, index) => (
            <Tab
              label={item.component.sLabel}
              {...a11yProps(index)}
              key={index}
            />
          ))}
        </Tabs>
      </Box>
      
      {data?.child?.map((item, index) => (
        <TabPanel value={value} index={index} key={index}>
          <Grid container>
          {item?.child?.map((item1, childIndex) => {
            switch (item1?.component?.sType) {
              case "TYPOGRAPHY":
                return (
                  <Grid item {...item1?.grid_props}>
                    <Typography
                      id={item1?.component?.sName}
                      {...item1?.component?.sProps}
                    >
                      {item1?.component?.sLabel}
                    </Typography>
                  </Grid>
                );

              case "DATETIME":
                return (
                  <Grid item {...item1?.grid_props}>
                    <DateComponent
                      data={item1}
                      handledatechange={(e) =>
                        handledatechange(e, item1?.component.sName)
                      }
                      datavalue=""
                      datemod=""
                      datatextvalue={
                        textValue &&
                        textValue[item1?.component.sName] !== undefined &&
                        textValue[item1?.component.sName]
                      }
                      formaction={
                        formData &&
                        formData?.form &&
                        formData?.form?.sFormAction
                      }
                      {...item1?.component?.sProps}
                    />
                  </Grid>
                );

              case "TEXTFIELD":
                return (
                  <Grid item {...item1?.grid_props}>
                    <TextField
                      id={item1?.component?.sName}
                      label={item1?.component?.sLabel}
                      placeholder={item1?.component?.sPlaceHolder}
                      defaultValue={item1?.component?.sDefaultValue}
                      variant={item1?.component?.sprops}
                      type={item1?.component?.sAdornType}
                      value={textValue[item1?.component?.sName] || ""}
                      name={item1?.component?.sName}
                      onChange={(e) =>
                        handleTextValue(e, index, item1?.validation)
                      }
                      helperText={item1?.component?.sHelper}
                      error={error}
                      InputProps={
                        item1?.component?.sAdornPosition === "start"
                          ? {
                              startAdornment: (
                                <>
                                  {item1?.component?.sAdornPosition &&
                                    item1?.component?.sAdornType && (
                                      <InputAdornment
                                        position={
                                          item1?.component?.sAdornPosition
                                        }
                                      >
                                        <IconButton>
                                          <Icon
                                            iconName={item1?.component?.sIcon}
                                          />
                                        </IconButton>
                                      </InputAdornment>
                                    )}
                                </>
                              ),
                            }
                          : {
                              endAdornment: (
                                <>
                                  {item1?.component?.sAdornPosition &&
                                    item1?.component?.sAdornType && (
                                      <InputAdornment
                                        position={
                                          item1?.component?.sAdornPosition
                                        }
                                      >
                                        <IconButton>
                                          <Icon
                                            iconName={item1?.component?.sIcon}
                                          />
                                        </IconButton>
                                      </InputAdornment>
                                    )}
                                </>
                              ),
                            }
                      }
                      {...item1?.component?.sProps}
                    />

                    {/* {error && index == ind && (
                      <p style={{ color: "red" }}>{error}</p>
                    )} */}
                  </Grid>
                );
              default:
                return null;
            }
          })}
          </Grid>
        </TabPanel>
      ))}
    </Box>
  );
}
