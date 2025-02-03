import React, { useEffect } from "react";
import Spinner from "../../component/spinner/Spinner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Global_Data } from "../../globalData/GlobalData";
import { serverAddress } from "../../config";

function Logout() {
  const navigate = useNavigate();
  const { token } = Global_Data();

  function logout() {
    axios
      .post(
        `${serverAddress}/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(res => {
        navigate("/login");
        localStorage.clear();
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    logout();
  }, []);

  return (
    <>
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
    </>
  );
}

export default Logout;
