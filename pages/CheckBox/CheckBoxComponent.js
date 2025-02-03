import React, { useEffect, useState } from "react";
import { Checkbox, FormControlLabel, FormGroup, FormHelperText, Grid } from "@mui/material";
import { Icon } from "../../utils/MuiIcons/Icon";
import { Global_Data } from "../../globalData/GlobalData";

const CheckBoxComponent = ({ data, handleCheckbox, datacheckvalue, datemod, formactions, textValue1, params }) => {

const {textValue} = Global_Data()

  const [checked, setChecked] = useState(false);
  // console.log(datacheckvalue,datacheckvalue,'ppllmm');


  useEffect(() => {
    setChecked(datacheckvalue == data.component.sCheckedValue? true : false);
  },[datacheckvalue,data])

  const handleApproveChange = () => {

    const updatedChecked = !checked; // Toggle the checked state
    setChecked(updatedChecked);
    // console.log(updatedChecked);
    handleCheckbox(updatedChecked ? data.component.sCheckedValue : data.component.sUncheckedValue);
  };
 
  const icon = data?.component?.sIcon?.replace("Icon", "");

  const showCheckbox = () => {
    if (
      data?.component?.sType === "CHECKBOX" &&
      (formactions === undefined || formactions === "" || formactions === "ADD" )
    ) {
      return true;
    }

    if (
      formactions === "EDIT" &&
      datacheckvalue &&
      (datemod === "FREEFORM" || datemod === "DEFAULT")
    ) {
      return true;
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item>
        {true && (
          <FormGroup>
            <FormControlLabel
              id={data?.component?.sName}
              control={
                <Checkbox
                  onChange={handleApproveChange}
                  id={params?.row?.id ? `${data?.component?.sName}-${params.row.id}` : data?.component?.sName}
                  icon={
                    data?.component?.sIcon !== ''   ? <Icon iconName={icon} /> : undefined
                  }
                  checkedIcon={
                    data?.component?.sIcon !== '' ? <Icon iconName={icon} /> : undefined
                  }
                  checked={checked}
                />
              }
              {...data?.component?.sProps}
              label={data?.component?.sLabel}
            />
            <FormHelperText>{data?.component?.sHelper}</FormHelperText>
          </FormGroup>
        )}
      </Grid>
    </Grid>
  );
};

export default CheckBoxComponent;
