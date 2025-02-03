import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../../api";
import { useLocation } from "react-router-dom";
import { Global_Data } from "../../globalData/GlobalData";

const TestApi = () => {
  let urlCapture = window.location.pathname + window.location.search;
  const formname = useLocation();
  const searchPath = formname.pathname + formname.search;
  const [getVersion, setGetVersion] = useState("");
  const {token}= Global_Data()
  useEffect(() => {
    axios
      .get(`${baseURL}${searchPath}`,{
        headers: {
          Authorization: `Bearer ${token}`,
          // Other headers if needed
        }
      })
      .then(result => {
        setGetVersion(result.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [urlCapture]);
  // const [data] = useSearchParams();
  return <div>{getVersion}</div>;
};

export default TestApi;
