import React from "react";
import ListItemComponent from "./ListItem";

const TransferList = ({ data }) => {
  return <ListItemComponent url={data?.data?.sDataSource} data={data} />;
};
export default TransferList;
