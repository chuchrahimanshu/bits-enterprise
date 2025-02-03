import React, { useEffect } from "react";

import { Grid, Box, Typography, FormControl, Select, MenuItem, InputLabel } from "@mui/material";

function CustomMapping({ error,fromFeilds, csvContent ,formData, setFormData}) {

  
  const handleSelectChange = event => {
    setFormData(preState => ({ ...preState, [event.target.name]: event.target.value }));
  };

  const checkFieldInSelectMapping = (fieldName) => {
    for (let field in csvContent[0]) {
      if (field === fieldName) {
        return true;
      }
    }
    return false;
  }

  const mapInitialFileds = () => {
    Object.keys(formData).forEach((field) => {
      fromFeilds.forEach((formField) => {
        if(formField?.sFieldName === field && checkFieldInSelectMapping(formField?.sCaption)){
          setFormData((prev) => ({...prev, [field]: formField?.sCaption}));
        }
      })
    })
  }

  useEffect(() => {
    mapInitialFileds();
  }, [fromFeilds])

  return (
    <Box p={2}>
      <Box p={2} marginTop={"95px"} maxWidth={"700px"} margin={"auto"}>
        <Box>
          <Typography variant="p" className="pb-3 " component={"p"}>
            Mapping Details
          </Typography>
          <hr />
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={6}>
            <InputLabel style={{ marginTop: "10px" }}>Map to</InputLabel>
          </Grid>
          <Grid item xs={6} sm={6}>
            <InputLabel style={{ marginTop: "10px" }}>Input Fields</InputLabel>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12}>
          {fromFeilds?.map((label, index) => (
            <>
              <Grid container className="pt-3" spacing={3}>
                <Grid item xs={6} sm={6}>
             
                  <InputLabel  style={{ marginTop: "10px", color: error?.errorFields?.includes(label.sFieldName)? 'red' :label.bRequired ==='Yes'&& "#1e88e5" } }>{label.sCaption}{label.bRequired ==='Yes' && '*'}</InputLabel>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <FormControl size="small">
                    <Select
                      name={label.sFieldName}
                      value={formData[label.sFieldName] || "None"}
                      onChange={handleSelectChange}
                      style={{ width: "300px", marginTop: "10px" }}
                    >
                      <MenuItem value={"None"} selected>Select</MenuItem>
                      {
                       Object.keys(csvContent[0])?.map((value, index) => (
                        <MenuItem key={index} value={value}>
                          {value}
                        </MenuItem>
                      ))
                      }
                      {/* {label.sCaption.includes("Active") && [
                        <MenuItem key="true" value="true">
                          Yes
                        </MenuItem>,
                        <MenuItem key="false" value="false">
                          No
                        </MenuItem>
                      ]}

                      {label.sCaption.includes("Account Code") &&
                        csvContent.map((value, index) => (
                          <MenuItem value={value[label.sCaption]}>{value[label.sCaption]}</MenuItem>
                        ))}
                      {label.sCaption.includes("Account Description") &&
                        csvContent.map((value, index) => (
                          <MenuItem value={value["Description"]}>{value["Description"]}</MenuItem>
                        ))}
                      {label.sCaption.includes("Account Name") &&
                        csvContent.map((value, index) => (
                          <MenuItem value={value[label.sCaption]}>{value[label.sCaption]}</MenuItem>
                        ))}
                      {label.sCaption.includes("Parent Code") &&
                        csvContent.map((value, index) => (
                          <MenuItem value={value["Parent Code"]}>{value["Parent Code"]}</MenuItem>
                        ))}
                      {label.sCaption.includes("Account Category") &&
                        csvContent.map((value, index) => (
                          <MenuItem value={value["Account Type"]}>{value["Account Type"]}</MenuItem>
                        ))} */}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default CustomMapping;
