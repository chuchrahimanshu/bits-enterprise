import React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";

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
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

export default function BasicTabs({
  data,

  renderComponent
}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
 <Box sx={{ width: "100%" }} >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} id={data.component.sName} {...data.component.sProps} onChange={handleChange} aria-label="basic tabs example">
          {data?.child?.map((item, index) => (
            <Tab  label={item?.component.sLabel} {...a11yProps(index)} key={index}id={item.component.sName} />
          ))}
        </Tabs>
      </Box>
      {data?.child?.map((item, index) => (
        <TabPanel id={item?.component?.sName} value={value} index={index} key={index}>
          <Grid container> 
          {renderComponent(item?.child) }
          </Grid>
        </TabPanel>
      ))}
    </Box> 
    </>
  );
}
