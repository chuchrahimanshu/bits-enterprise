import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Spinner from "./component/spinner/Spinner";
import store from "./utils/store/index";
import { Provider } from "react-redux";
import { blue, green } from "@mui/material/colors";
import GlobalData from "./globalData/GlobalData";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
const root = ReactDOM.createRoot(document.getElementById("root"));

const theme = createTheme({
  palette: {
    primary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
      darker: blue[900],
      contrastText: "#fff"
    },
    secondary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
      contrastText: "#fff"
    }
  }
});

root.render(
  // <React.StrictMode>
  // <ThemeProvider theme={theme}>
  <Provider store={store}>
     <ToastContainer draggable position="bottom-right" />
    <BrowserRouter>
      <GlobalData>
        <Suspense
          fallback={  
            <div
              style={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <div>
                <Spinner />
              </div>
            </div>
          }
        >
          <App />
        </Suspense>
      </GlobalData>
    </BrowserRouter>
  </Provider>
  // </ThemeProvider>
  // </React.StrictMode>
);
