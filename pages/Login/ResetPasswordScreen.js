import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Grid, InputAdornment, InputLabel, OutlinedInput, Stack } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { baseURL } from "../../api";
import axios from "axios";
import { toast } from "react-toastify";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

export default function ResetPasswordScreen({
  ResetPasswordScreenIsOpen,
  setResetPasswordScreenIsOpen,
  loginFormData,
  setLoginFormData
}) {
  const [showPassword1, setshowPassword1] = React.useState(false);
  const [showPassword2, setshowPassword2] = React.useState(false);

  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setconfirmPassword] = React.useState("");

  const handleClose = () => {
    setResetPasswordScreenIsOpen(false);
  };
  const handleSubmit = () => {
    // setOpen(false);
    if (newPassword.length < 8) {
        toast.error("New Password should be at least 8 characters",{
            position:'top-center',
          });
        return 
    }
    if (confirmPassword.length < 8) {
        toast.error("Confirm Password should be at least 8 characters",{
            position:'top-center',
          });
        return 
    }
    if (newPassword === confirmPassword) {
      axios
        .post(
          `${baseURL}/user/password/reset`,
          { ...loginFormData, new_password: confirmPassword || "" },
          {
            headers: {
              mode: "cors",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
              "Content-Type": "application/json"
            }
          }
        )
        .then(response => {
          if (response?.data?.metadata?.statusCode == "RELOGIN") {
            handleClose();
            toast.success("Password reset sucessfully please relogin",{
                position:'top-center',
              });
            setNewPassword('')
            setconfirmPassword('');
            setLoginFormData({})
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      toast.error("New Password and Confirm Password not match",{
        position:'top-center',
      });
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog
      </Button> */}
      <BootstrapDialog
        // onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={ResetPasswordScreenIsOpen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Reset Password
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={theme => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500]
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-login">New Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  id="new-password"
                  type={showPassword1 ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  onKeyDown={handleKeyDown} // Added onKeyDown event
                  name="new-password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setshowPassword1(!showPassword1)}
                        //   onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="large"
                      >
                        {showPassword1 ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter new password"
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-login">Confirm Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  id="cnf-password"
                  type={showPassword2 ? "text" : "password"}
                  value={confirmPassword}
                  onKeyDown={handleKeyDown} 
                  onChange={e => setconfirmPassword(e.target.value)}
                  name="cnf-password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        //   onClick={handleClickShowPassword}
                        onClick={() => setshowPassword2(!showPassword2)}
                        //   onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="large"
                      >
                        {showPassword2 ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter new password"
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              {/* <AnimateButton> */}
              <Button
                disableElevation
                //   disabled={isSubmitting}
                onClick={() => handleSubmit()}
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
        </DialogContent>
        {/* <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions> */}
      </BootstrapDialog>
    </React.Fragment>
  );
}
