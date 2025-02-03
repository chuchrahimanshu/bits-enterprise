import React, { useEffect, useState } from "react";
import AutoCompleteComponent from "../../component/AutoCompleteComponent/AutoCompleteComponent";

const AutoComplete = ({
  data,
  formcallback,
  rowsdataID,
  Automod,
  isDisabledTable,autoSelectObj,
  rowsdataFree,formIsSubmited,
  formaction,errors,
  isSubmited,
  handleClickOpen,
  textValue1,
  id,
  setallAccountData,
  setselectedAUTOCOMPLETE,selectAndAutocompleteSname,
  params,
  summary,
  mainData
}) => {


  const autovaluedata = (e,e2) => {

    formcallback(e, {sAccountCode:e2['sAccountCode'],sImageIDs:e2['sImageIDs']},e2);
   
  };
  // const [EffectData,useEffectData] =useState(null)
  // const useEffectData = (e,e2) => {
  //   // formcallback(e, {sAccountCode:e2['sAccountCode']});
  //   // alert(JSON.stringify(e2))
  //   formcallback(e, {sAccountCode:e2['sAccountCode']});
  //   console.log(e,e2['sAccountCode'],'stringify');
  // };
  // useEffectData()



//['sAccountCode']

  return (
    <AutoCompleteComponent
      data={data}
      // useEffectData={useEffectData}
      isDisabledTable={isDisabledTable}
      handleClickOpen={handleClickOpen}
      autovaluedata={autovaluedata}
      setallAccountData={setallAccountData}
      autoValue={data?.data?.sDataSource}
      id={id}
      rowvalue={rowsdataID}
      errors={errors}
      autoSelectObj={autoSelectObj}
      autoValue1={data?.data?.data?.sDataSource}
      rowsdataFree={rowsdataFree}
      Automod={Automod}
      setselectedAUTOCOMPLETE={setselectedAUTOCOMPLETE}
      textValue1={ textValue1}
      formaction={formaction}
      isSubmited={isSubmited}
      formIsSubmited={formIsSubmited}
      selectAndAutocompleteSname={selectAndAutocompleteSname}
      params={params}
      summary={summary}
      mainData={mainData}
      />
  );
};

export default AutoComplete;
