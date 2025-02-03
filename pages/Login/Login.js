import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AuthLogin from "./AuthLogin";
import CustomAlert from "../../component/AlertComponent/Alert";
import ResetPasswordScreen from "./ResetPasswordScreen";

function Login() {
  const [loginFormData, setLoginFormData] = useState({});

  const [ResetPasswordScreenIsOpen, setResetPasswordScreenIsOpen] = useState(false);
  const [resultData, setResultData] = React.useState(false);
  const [errMsg, seterrMsg] = React.useState("");

  useEffect(() => {
    localStorage.clear();
  }, []);
  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* <AuthBackground /> */}
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        sx={{
          minHeight: "100vh"
        }}
      >
        <Grid item xs={12} sx={{ ml: 3, mt: 1 }}>
          <img
            width={"200px"}
            src={"http://13.231.17.170:8080/images/enterprise/get?filename=wilstark_logo.png"}
          />
          <Box sx={{ width: "500px" }}></Box>
        </Grid>

        <Grid item xs={12}>
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: { xs: "calc(100vh - 134px)", md: "calc(100vh - 112px)" } }}
          >
            <Grid item sx={{ maxWidth: "500px" }}>
              <Paper className="p-5">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    {resultData === "ERROR" && (
                      <CustomAlert
                        setResultData={setResultData}
                        severity="error"
                        message={errMsg}
                      />
                    )}
                    {resultData === "WARNING" && (
                      <CustomAlert
                        severity="warning"
                        setResultData={setResultData}
                        message={errMsg}
                      />
                    )}
                    {resultData === "INFO" && (
                      <CustomAlert setResultData={setResultData} severity="info" message={errMsg} />
                    )}
                    {resultData === "OK" && (
                      <CustomAlert
                        setResultData={setResultData}
                        severity="success"
                        message={errMsg}
                      />
                    )}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="baseline"
                      sx={{ mb: { xs: -0.5, sm: 0.5 } }}
                    >
                      <Typography variant="h5">Login</Typography>
                      <Typography
                        component={"a"}
                        to="/register"
                        variant="body1"
                        sx={{ textDecoration: "none" }}
                        color="primary"
                      >
                        Don&apos;t have an account?
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    {!ResetPasswordScreenIsOpen && (
                      <AuthLogin
                        ResetPasswordScreenIsOpen={ResetPasswordScreenIsOpen}
                        setResetPasswordScreenIsOpen={setResetPasswordScreenIsOpen}
                        loginFormData={loginFormData}
                        setLoginFormData={setLoginFormData}
                        resultData={resultData}
                        seterrMsg={seterrMsg}
                        setResultData={setResultData}
                      />
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <ResetPasswordScreen
          ResetPasswordScreenIsOpen={ResetPasswordScreenIsOpen}
          setResetPasswordScreenIsOpen={setResetPasswordScreenIsOpen}
          loginFormData={loginFormData}
          setLoginFormData={setLoginFormData}
        />
      </Grid>
    </Box>
  );
}

export default Login;
