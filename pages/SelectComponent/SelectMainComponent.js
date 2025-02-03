import React from "react";
import SelectComponent from "./SelectComponent";

const SelectMainComponent = ({
  data,
  summaryId,
  taxUrl,
  handleClickOpen,
  onChildSelect,
  def_value,
  isDisabledTable,
  subTotalDef,setSelectAndAutocompleteSname,
  selectTax,
  sColumnID,
  taxUrlFree,
  errors,
  handledatasend,formIsSubmited,
  valueTax,
  textValue,
  selectEdit,
  datemod,setdTermDays,
  formaction,
  isSubmited
}) => {



  const handledatamaindata = e => {
  };
  
  const datasend=(data,obj) => {
    handledatasend(data,obj);
  }

  
  return (
    <>
 
    {subTotalDef ? (
      <SelectComponent
      url={data?.data?.sDataSource}
      dataComponent={data?.component}
      summaryId={summaryId}
      sColumnID={sColumnID}
      data={data}
      setdTermDays={setdTermDays}
      textValue={textValue}
      setSelectAndAutocompleteSname={setSelectAndAutocompleteSname}
      formIsSubmited={formIsSubmited}
      taxUrlFree={taxUrlFree}
      def_value={def_value}
      isDisabledTable={isDisabledTable}
      taxUrl={taxUrl}
      errors={errors}
      subTotalDef={subTotalDef && subTotalDef}
      handledatachange={handledatamaindata}
      handleClickOpen={handleClickOpen}
      onChildSelect={onChildSelect}
      datasend={datasend}
      selectTax={selectTax}
      valueTax={valueTax}
      selectEdit={selectEdit}
      datemod={datemod}
      formaction={formaction}
      isSubmited={isSubmited}
      />
      ) : <SelectComponent
      url={data?.data?.sDataSource}
      dataComponent={data?.component}
      summaryId={summaryId}
      setSelectAndAutocompleteSname={setSelectAndAutocompleteSname}
      sColumnID={sColumnID}
      data={data}
      setdTermDays={setdTermDays}
      formIsSubmited={formIsSubmited}
      errors={errors}
      datasend={datasend}
      textValue={textValue}
      isDisabledTable={isDisabledTable}
      handleClickOpen={handleClickOpen}
      taxUrlFree={taxUrlFree}
      def_value={def_value}
      taxUrl={taxUrl}
      subTotalDef={subTotalDef && subTotalDef}
      handledatachange={handledatamaindata}
      onChildSelect={onChildSelect}
      selectTax={selectTax}
      valueTax={valueTax}
      selectEdit={selectEdit}
      datemod={datemod}
      formaction={formaction}
      isSubmited={isSubmited} 
      />}
      </>
  );
};
export default SelectMainComponent;
