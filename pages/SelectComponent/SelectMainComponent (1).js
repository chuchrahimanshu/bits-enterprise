import React from "react";
import SelectComponent from "./SelectComponent";

const SelectMainComponent = ({
  data,
  summaryId,
  taxUrl,
  onChildSelect,
  selectTax,
  sColumnID,
  taxUrlFree,
  handledatasend,
  valueTax,
  selectEdit,
  datemod,
  formaction,
}) => {
  const handledatamaindata = (e) => {
    handledatasend(e);
  };
  return (
    <>
      <SelectComponent
        url={data?.data?.sDataSource}
        dataComponent={data?.component}
        summaryId={summaryId}
        sColumnID={sColumnID}
        taxUrlFree={taxUrlFree}
        taxUrl={taxUrl}
        handledatachange={handledatamaindata}
        onChildSelect={onChildSelect}
        selectTax={selectTax}
        valueTax={valueTax}
        selectEdit={selectEdit}
        datemod={datemod}
        formaction={formaction}
      />
    </>
  );
};
export default SelectMainComponent;
