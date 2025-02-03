import { Box } from '@mui/material'
import React from 'react'
import InputTableDefault from './InputTableDefault'
import { Global_Data } from '../../globalData/GlobalData';
import TableComponent from './TableComponent';
import DebitCredit from './DebitCredit';
import { baseURL } from '../../api';

function AllTablesMain({
    format,
    data,
    freeFormTabbleEditArrays,
    setdifferenceDebitCredit,
    tablefreeformfield,
    freeFormTabbleArrays,
    setFreeFormTabbleArrays,
    setfreeFormValidateFunction,
    setmultirecordValidateFunction,
    setdefaultTableValidateFunction,
    setdebitCreditValidateFunction,
    company, setcheckMaxTotalValue,
    setFreeFormTabbleEditMainrecord,
    setallowZeroValue,
    textValue,
    setdebitCreditTableData,freeFromTotals,
    setFreeFromTotals,setdebitCreditTableMode,
    setdebitCreditTableName,
    isSubmited,
    tabledata,
    tablesummaryfields,
    freeformTableMode,
    freeformTableName,documentSelectTableData,
    documentSelectmappingData,
    formAction,setdebitCreditTotal,setdebitCreditTotalBalanced,
    isDisabledTable,handleClickOpen,
    formdata,setdefaultTableNameAndModel,
    formData,
    setSelectAndAutocompleteSname,
    freeFormTabbleEditMainrecord
  }) {
    const { token, freeFormInitState, setFreeFormInitState, mainFormData, setmainFormData } =
    Global_Data();
    // alert('Please')
  return (
    <div>
      {/* {JSON.stringify(documentSelectTableData)} */}
         <Box sx={{ width: "100%", marginBottom: "1rem" }}>

         {data.component?.options?.mode === "DEFAULT" && (
          <InputTableDefault
            data={data}
            formData={formData}
            defaultTableEditData={freeFormTabbleEditArrays}
            freeFormTabbleEditMainrecord={freeFormTabbleEditMainrecord}
            setFreeFormTabbleEditMainrecord={setFreeFormTabbleEditMainrecord}
            mainFormData={mainFormData}
            company={company}
            setcheckMaxTotalValue={setcheckMaxTotalValue}
            setallowZeroValue={setallowZeroValue}
            isSubmited={isSubmited}
            setdefaultTableNameAndModel={setdefaultTableNameAndModel}
            format={format}
            handleClickOpen2={handleClickOpen}
            documentSelectTableData={documentSelectTableData}
            documentSelectmappingData={documentSelectmappingData}
            formAction={formAction}
            textValue={textValue}
            freeFromTotals={freeFromTotals}
            setFreeFromTotal={setFreeFromTotals}
            tabledata={tabledata}
            tablesummaryfields={tablesummaryfields}
            setdefaultTableValidateFunction={setdefaultTableValidateFunction}
          />
        )}

         {data?.component?.options?.mode === "DEBITCREDIT" && (
          <DebitCredit
            freeFormTabbleEditArrays={freeFormTabbleEditArrays}
            setdifferenceDebitCredit={setdifferenceDebitCredit}
            tablefreeformfield={tablefreeformfield}
            setdebitCreditTableData={setdebitCreditTableData}
            freeFormTabbleArrays={freeFormTabbleArrays}
            setFreeFormTabbleArrays={setFreeFormTabbleArrays}
            isSubmited={isSubmited}
            company={company}
            setdebitCreditTableMode={setdebitCreditTableMode}
            setdebitCreditTableName={setdebitCreditTableName}
            format={format}
            setdebitCreditTotal={setdebitCreditTotal}
            setdebitCreditTotalBalanced={setdebitCreditTotalBalanced}
            mainFormData={mainFormData}
            formAction={formAction}
            data={data}
            textValue={textValue}
            baseURL={baseURL}
            formdata={formdata}
            setdebitCreditValidateFunction={setdebitCreditValidateFunction}
          />
        )}
         {data?.component?.options?.mode === "FREEFORM" && (
          <TableComponent
          data={data}
          company={company}
          isDisabledTable={isDisabledTable}
          textValue={textValue}
          format={format}
          documentSelectTableData={documentSelectTableData}
          handleClickOpen2={handleClickOpen}

        //  setdefaultTableNameAndModel={setdefaultTableNameAndModel}

          documentSelectmappingData={documentSelectmappingData}
          setdifferenceDebitCredit={setdifferenceDebitCredit}
          isSubmited={isSubmited}
          setdebitCreditTableData={setdebitCreditTableData}
          tabledata={tabledata}
          freeFromTotals={freeFromTotals}
          setFreeFromTotals={setFreeFromTotals}
          tablesummaryfields={e => tablesummaryfields(e, data)}
          tablefreeformfield={tablefreeformfield}
          freeFormTabbleEditArrays={freeFormTabbleEditArrays}
          setFreeFormTabbleArrays={setFreeFormTabbleArrays}
          freeFormTabbleArrays={freeFormTabbleArrays}
          defaultTableName={freeformTableName}
          defaultTableMode={freeformTableMode}
          freeformTableMode={freeformTableMode}
          freeformTableName={freeformTableName}
          formAction={formAction}
          setSelectAndAutocompleteSname={setSelectAndAutocompleteSname}
          formdata={formData}
          setfreeFormValidateFunction={setfreeFormValidateFunction}
          setmultirecordValidateFunction={setmultirecordValidateFunction}
        //   setmultirecordExist={setmultirecordExist}
          setdefaultTableValidateFunction={setdefaultTableValidateFunction}
          setdebitCreditValidateFunction={setdebitCreditValidateFunction}
        />
        )}

         </Box>
    </div>
  )
}

export default AllTablesMain