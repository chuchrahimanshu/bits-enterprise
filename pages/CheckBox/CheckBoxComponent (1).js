import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { Icon } from "../../utils/MuiIcons/Icon";


const CheckBoxComponent = ({
  data,
  handleCheckbox,
  datacheckvalue,
  datemod,
  formactions,
}) => {
  const [checked, setChecked] = useState(false);
  const handleApproveChange = () => {
    setChecked(!checked);
    handleCheckbox(!checked);
  };
  const icon = data?.component?.sIcon?.replace("Icon", "");
  return (
    <>
      <Grid container spacing={2}>
        <Grid item>
          {data?.component?.sType === "CHECKBOX" && (
            <>
              {formactions == undefined ||
              formactions == "" ||
              formactions == "ADD" ? (
                <FormGroup>
                  <FormControlLabel
                    id={data?.component?.sName}
                    control={
                      <Checkbox
                        onChange={handleApproveChange}
                        defaultChecked={data?.component?.sDefaultValue}
                        
                        icon={data?.component?.sIcon !==undefined ? <Icon iconName={icon}/> : undefined}
                      />
                    }
                    {...data?.component?.sProps}
                    label={data?.component?.sLabel}
                  />
                  <FormHelperText>{data?.component?.sHelper}</FormHelperText>
                </FormGroup>
              ) : null}
              {formactions == "EDIT" &&
              datacheckvalue !== "" &&
              datemod === "FREEFORM" &&
              datacheckvalue !== undefined ? (
                <FormGroup>
                  <FormControlLabel
                    id={data?.component?.sName}
                    control={
                      <Checkbox
                        onChange={handleApproveChange}
                        icon={<Icon iconName={icon} />}
                        defaultChecked={datacheckvalue === "Yes" ? true : false}
                      />
                      
                    }
                    {...data?.component?.sProps}
                    label={data?.component?.sLabel}
                  />
                  
                  <FormHelperText>{data?.component?.sHelper}</FormHelperText>
                </FormGroup>
              ) : formactions == "EDIT" &&
                datacheckvalue !== "" &&
                datemod === "DEFAULT" &&
                datacheckvalue !== undefined ? (
                <FormGroup>
                  <FormControlLabel
                    id={data?.component?.sName}
                    control={
                      <Checkbox
                        {...data?.component?.sProps}
                        icon={<Icon iconName={data?.component?.sIcon} />}
                        defaultChecked={datacheckvalue === "Yes" ? true : false}
                      />
                    }
                    {...data?.component?.sProps}
                    label={data?.component?.sLabel}
                  />
                  <FormHelperText>{data?.component?.sHelper}</FormHelperText>
                </FormGroup>
              ) : null}
            </>
          )}
        </Grid>
        {/* ))} */}
      </Grid>
    </>
  );
};

export default CheckBoxComponent;
