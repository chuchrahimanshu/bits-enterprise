import {
  Breadcrumbs,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../../api";

import { Link } from "react-router-dom";
import RadioBox from "../../component/RadioBox/RadioBox";

const RadioGroupComponent = ({ data, radiochange }) => {
  const [formRadioGroup, setFormRadioGroup] = useState();
  const [option, setOption] = useState([]);

  const getRadioOptions = (url) => {
 
    if (url) {
      axios
        .get(url)
        .then((result) => {
          setOption(result?.data?.data);
        })
        .catch((error) => {
          console.log(error);
        });
      // console.log(result)
      // if (result?.data) {
      //   return result?.data?.data;
      // }
    }
  };
  let urlCapture = window.location.pathname + window.location.search;

  useEffect(() => {
    axios
      .get(`${baseURL}${urlCapture}`)
      .then((result) => {
        setFormRadioGroup(result?.data?.data);
        setValue(result?.data?.data?.details?.component?.sDefaultValue);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  //   passing grid props
  // const propsObject = formRadioGroup?.form?.sGridProps;
  // const propsStringfy = JSON.stringify({ propsObject });
  // const valueCheck = JSON.parse(propsStringfy);
  // const finalValue = valueCheck.propsObject;
  const radiochangevalue = (e) => {
    radiochange(e);
  };
  return (
    <>
      <Grid container>
        <Grid item>
          {/* {formRadioGroup?.details?.map((data, index) => {
           
            return ( */}
          <RadioBox
            data={data}
            url={`${baseURL}${data?.data?.sDataSource}`}
            defaultValue={value}
            handleRadio={(e) => radiochangevalue(e)}
          />
          {/* );
          })} */}
        </Grid>
      </Grid>
    </>
  );
};

export default RadioGroupComponent;
