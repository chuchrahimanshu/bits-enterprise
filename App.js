import React, { lazy, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router";
import MainForm from "./pages/MainForm/MainForm";
import MainImport from "./pages/MainImport/MainImport";
import CSVFileUploader from "./pages/CSVFileUploader";
import Login from "./pages/Login/Login";
import { useEffect } from "react";
import Logout from "./pages/Logout/Logout";
import { Global_Data } from "./globalData/GlobalData";

import Spinner from "./component/spinner/Spinner";
import { serverAddress } from "./config";
import axios from "axios";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { blue } from "@mui/material/colors";
import useOnlineStatus from "./pages/hooks/useOnlineStatus";
import { toast } from "react-toastify";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
const SideDrawer = lazy(() => import("./layout/MainLayout/SideDrawer"));
const TestApi = lazy(() => import("./pages/testApi/TestApi"));
function App() {
  const { sideBarStyle,isPageLoading ,formData, token } = Global_Data?.() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const isOnline = useOnlineStatus();

  const [fetchmainApi, setFetchMainApi] = useState(null);


  

  useEffect(() => {
    const assetsUrl = process.env.REACT_APP_assetsURL;
    const dynamicScriptUrl = `${assetsUrl}/scripts/bitsenterprise.js`;
    const scriptElement = document.createElement("script");
    scriptElement.src = dynamicScriptUrl;
    // scriptElement.src = 'http://localhost/bitsenterprise.js';
    document.body.appendChild(scriptElement);
    return () => {
      document.body.removeChild(scriptElement);
    };
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/login");
    }
  }, [location.pathname]);

  useEffect(() => {

// alert(JSON.stringify(isOnline))
if (!isOnline) {
  toast.error('The system cannot connect to the back-end')
}

  },[isOnline])

  return (
    <>
    {isOnline}
   
      {/* {JSON.stringify(theamStyle)} */}
      {/* <ThemeProvider theme={theamStyle}> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/resetpassword" element={<ResetPassword />} />

          <Route path="/user/logout" element={<Logout />} />
          <Route
            path="/*"
            element={
              sideBarStyle !== ""  ? (
                <NestedRoute fetchmainApi={fetchmainApi} setFetchMainApi={setFetchMainApi} />
              ) : (
                <div style={{height:'100vh',width:"100vw",display:'flex',justifyContent:"center",alignItems:"center",}}>
               <div>
               <Spinner />
               </div>
                </div>
              )
            }
          />
        </Routes>
      {/* </ThemeProvider> */}
    </>
  );
}

const NestedRoute = ({ fetchmainApi, setFetchMainApi }) => {
  return (
    // eslint-disable-next-line
    <SideDrawer fetchmainApi={fetchmainApi}>
      <Routes>
        <Route path="/testapi" element={<TestApi />} />
        <Route path="/*" element={<MainForm setFetchMainApi={setFetchMainApi} />} />
        <Route path="/import" element={<MainImport />} />
        <Route path="/csv" element={<CSVFileUploader />} />
      </Routes>
    </SideDrawer>
    // eslint-disable-next-line
  );
};
export default App;
