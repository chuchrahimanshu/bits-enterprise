import { Grid } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../../api";

import RadioBox from "../../component/RadioBox/RadioBox";
import CustomAlert from "../../component/AlertComponent/Alert";
import { Global_Data } from "../../globalData/GlobalData";

const RadioGroupComponent = ({ data, radiochange,textValue, freeFormTabbleEditArrays, freeFormTabbleEditMainrecord,formAction }) => {

 
  const [value, setValue] = useState("");
  const [customError, setCustomError] = useState("");
  const {token}= Global_Data()
  let urlCapture = window.location.pathname + window.location.search;

  useEffect(() => {
    axios
      .get(`${baseURL}${urlCapture}`,{
        headers: {
          Authorization: `Bearer ${token}`,
          // Other headers if needed
        }
      })
      .then(result => {
        setValue(result?.data?.data?.details?.component?.sDefaultValue);
      })
      .catch(() => {
        setCustomError("Something went Wrong");
      });
  }, []);

  const radiochangevalue = e => {
    radiochange(e);
  };
  return (
    <>
      {customError !== "" && <CustomAlert severity="error" message={customError} />}
      <Grid container>
        <Grid item>
          <RadioBox
            data={data}
            textValue={textValue}
            url={`${baseURL}${data?.data?.sDataSource}`}
            defaultValue={value}
            handleRadio={e => radiochangevalue(e)}
            freeFormTabbleEditArrays={freeFormTabbleEditArrays}
            freeFormTabbleEditMainrecord={freeFormTabbleEditMainrecord}
            formAction={formAction}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default RadioGroupComponent;
