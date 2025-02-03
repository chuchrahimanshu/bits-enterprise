import { Breadcrumbs, Grid, IconButton, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { baseURL } from "../../api";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Icon } from "../../utils/MuiIcons/Icon";
import { Link as MuiLink } from "@mui/material";
import { validateTextField } from "../../utils/validations/Validation";
import CustomAlert from "../../component/AlertComponent/Alert";
import { Global_Data } from "../../globalData/GlobalData";

const Module2 = () => {
  const initialValues = {};
  const [formData, setFormData] = React.useState();
  const [textValue, setTextValue] = React.useState(initialValues);
  const {token}= Global_Data()
  const [error, setError] = React.useState(null);
  const [index, setIndex] = React.useState(-1);
  const [customError, setCustomError] = React.useState("");

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
        setFormData(result?.data?.data);
      })
      .catch(() => {
        setCustomError("Something went Wrong");
      });
  }, []);

  const handleTextValue = (e, ind, validation) => {
    const { name, value } = e.target;
    setIndex(ind);
    const { sRegex, iMinLen, iMaxLen } = validation;
    const isError = validateTextField(value, sRegex, iMinLen, iMaxLen);

    if (isError) {
      setError(isError);
      return;
    } else {
      setError(null);
      setTextValue({
        ...textValue,
        [name]: value
      });
    }
  };

  const propsObject = formData?.form?.sGridProps;
  const propsStringfy = JSON.stringify({ propsObject });
  const valueCheck = JSON.parse(propsStringfy);
  const finalValue = valueCheck?.propsObject;

  //new one
  // const propsObjectChild = formData?.details.map((item) => item.grid_props);
  // const propsStringfychild = JSON.stringify({ propsObjectChild });

  return (
    <>
      {[formData]?.map(item => {
        return (
          <>
            {customError !== "" && <CustomAlert severity="error" message={customError} />}
            <Grid container {...finalValue} key={formData?.form?.id}>
              <Grid item md={12}>
                <Breadcrumbs aria-label="breadcrumb">
                  <Link underline="hover" color="inherit" href="/">
                    {item?.form?.sBreadCrumbs}
                  </Link>
                </Breadcrumbs>
              </Grid>
              <Grid item md={12} py={1}>
                <Link to={item?.form.sMenu}>
                  <Typography>{item?.form.sTitle}</Typography>
                </Link>
              </Grid>
              {item &&
                item?.details?.map((data, ind) => {
                  let gridValue = data?.grid_props;
                  let gridFinalValue = gridValue?.replace("''", "");
                  return (
                    <React.Fragment key={ind}>
                      <Grid {...gridFinalValue}>
                        {data?.component?.sType === "TYPOGRAPHY" ? (
                          <Typography py={1} id={data?.component?.sName}>
                            {data?.component?.sLabel}
                          </Typography>
                        ) : data?.component?.sType === "TEXTFIELD" ? (
                          <>
                            <TextField
                              id={data?.component?.sName}
                              label={data?.component?.sLabel}
                              variant={data?.component?.sProps}
                              type={data?.component?.sAdornType}
                              defaultValue={data?.component?.sDefaultValue}
                              value={textValue.data?.component?.sName}
                              name={data?.component?.sName}
                              onChange={e => handleTextValue(e, ind, data?.validation)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position={data?.component?.sAdornPosition}>
                                    <IconButton>
                                      <Icon iconName={data?.component?.sIcon} />
                                    </IconButton>
                                  </InputAdornment>
                                )
                              }}
                            />

                            {error && index == ind && <p style={{ color: "red" }}>{error}</p>}
                          </>
                        ) : data?.component?.sType === "LINK" ? (
                          <MuiLink underline="hover">
                            <Link to={data?.data?.sDataSource}>
                              <Typography py={1}>{data?.component?.sLabel}</Typography>
                            </Link>
                          </MuiLink>
                        ) : null}
                      </Grid>
                    </React.Fragment>
                  );
                })}
            </Grid>
          </>
        );
      })}
    </>
  );
};

export default Module2;
