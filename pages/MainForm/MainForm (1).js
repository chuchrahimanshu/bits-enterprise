import React from "react";
import { useLocation } from "react-router-dom";
import Form from "../Form/Form";
import { useSelector } from "react-redux";

const MainForm = () => {
  const formname = useLocation()
    const data = useSelector((state) => state?.DrawerReducer?.compData);
  

  return (
    <>
      <Form route={formname.pathname+formname.search} caption={data?.sCaption} />
    </>
  );
};

export default MainForm;
