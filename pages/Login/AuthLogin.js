import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";
import { baseURL } from "../../api";
import { Global_Data } from "../../globalData/GlobalData";
import { useEffect } from "react";
import { toast } from "react-toastify";
import CustomAlert from "../../component/AlertComponent/Alert";

const AuthLogin = ({ResetPasswordScreenIsOpen,setResetPasswordScreenIsOpen,loginFormData,setLoginFormData, resultData,seterrMsg, setResultData }) => {
  const navigate = useNavigate();
  const [checked, setChecked] = React.useState(false);

  const { token, setToken, userData, setUserData } = Global_Data?.() || {};

  const [showPassword, setShowPassword] = React.useState(false);

  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/form/get/dashboard");
    }
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          username: "",
          password: "",
          new_password: ""
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required("Username is required"),
          password: Yup.string().max(255).required("Password is required")
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {

            // First Approach - Using AES
            // const secretKey = 'yourSecretKey123';
            // const encryptedPassword = await CryptoJS.AES.encrypt(values.password, secretKey).toString();
            // const payload_data = {...values, password: encryptedPassword};

            // Second Approach - Using PBKDF2
            // Salt, Iterations, Encoding should be kept same.
            // Salt will be sent in the payload
            // PBKDF2WithHmacSHA256 (javax.crypto) - For Java Backend
            /**
             * Encoding replacement in Java
             * 
             * import javax.xml.bind.DatatypeConverter;
             * byte[] decodedBytes = DatatypeConverter.parseHexBinary(hexString);
             */
            // const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex); // Unique per user
            // const iterations = 10000;
            // const hashedPassword = CryptoJS.PBKDF2(values.password, salt, {
            //   iterations: iterations,
            // }).toString(CryptoJS.enc.Hex);
            // const payload_data = {...values, password: hashedPassword}

            axios
              .post(`${baseURL}/user/login`, values, {
                headers: {
                  mode: "cors",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                  "Content-Type": "application/json"
                }
              })
              .then(response => {
                if (response?.data?.metadata?.statusCode == 'RESETPASSWORD') {
                  setLoginFormData(values)
                  setResetPasswordScreenIsOpen(true)
                  return
                }
                setToken(response?.data?.data?.access_token);
                setUserData(response?.data?.data);
                localStorage.setItem("token", response?.data?.data?.access_token);
                localStorage.setItem("userData", JSON.stringify(response?.data?.data));
                navigate("/form/get/dashboard");
                // alert(JSON.stringify())
                
              })
              .catch(error => {
                // CustomAlert('error', error?.response?.data?.metadata?.msg)
                toast.error(error?.response?.data?.metadata?.msg, {
                  position:'top-center',
                })
                seterrMsg(error?.response?.data?.metadata?.msg);
                setResultData(error?.response?.data?.metadata?.status);
            
              });

            // setStatus({ success: false });
            // setSubmitting(false);
          } catch (err) {
           
            setStatus({ success: false });
            toast.error(err?.response?.data?.metadata?.msg)
            // setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
   
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Username</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    // value={values.email}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter username"
                    fullWidth
                    error={Boolean(touched.username && errors.username)}
                  />
                  {touched.username && errors.username && (
                    <FormHelperText error id="standard-weight-helper-text-username-login">
                      {errors.username}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? "text" : "password"}
                    // value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={event => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography style={{ fontSize: "17px", fontWeight: 400 }} variant="h6">
                        Keep me sign in
                      </Typography>
                    }
                  />
                  <Typography
                    variant="h6"
                    style={{ fontSize: "17px", fontWeight: 400 }}
                    component={RouterLink}
                    color="text.primary"
                  >
                    Forgot Password?
                  </Typography>
                </Stack>
              </Grid>
              {/* {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )} */}
              <Grid item xs={12}>
                {/* <AnimateButton> */}
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Login
                </Button>
                {/* </AnimateButton> */}
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
