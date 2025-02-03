import React from "react";
import { useLocation,useParams } from "react-router-dom";
import Form from "../Form/Form";
import { useSelector } from "react-redux";

const MainForm = ({setFetchMainApi}) => {
  const formname = useLocation();
  const params = useParams();
  const data = useSelector(state => state?.DrawerReducer?.compData);
// console.log(params,formname,'params7');
  return <Form  setFetchMainApi={setFetchMainApi} route={formname.pathname + formname.search} caption={data?.sCaption} />;
};

export default MainForm;
