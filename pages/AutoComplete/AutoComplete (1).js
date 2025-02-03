import React from "react";
import AutoCompleteComponent from "../../component/AutoCompleteComponent/AutoCompleteComponent";

const AutoComplete = ({ data, formcallback, rowsdataID,Automod,rowsdataFree, formaction }) => {
  const autovaluedata = (e) => {
    formcallback(e);
  };

  return (
    <AutoCompleteComponent
      data={data}
      autovaluedata={autovaluedata}
      autoValue={data?.data?.sDataSource}
      rowvalue={rowsdataID}
      rowsdataFree={rowsdataFree}
      Automod={Automod}
      formaction={formaction}
    />
  );
};

export default AutoComplete;
