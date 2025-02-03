import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { DataGridPro } from '@mui/x-data-grid-pro';
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import AutoComplete from "../AutoComplete/AutoComplete";
import TextField from "@mui/material/TextField";
import DateComponent from "../DateComponent/DateComponent";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import CheckBoxComponent from "../CheckBox/CheckBoxComponent";
import SelectMainComponent from "../SelectComponent/SelectMainComponent";
import * as XLSX from "xlsx";
import * as MUIICon from "@mui/icons-material";
import { vsprintf } from "sprintf-js";

import MoveDownIcon from "@mui/icons-material/MoveDown";
import Button from "@mui/material/Button";
import {
  Autocomplete,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  MenuItem,
  Paper,
  Popover,
  Select,
  Typography
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import axios from "axios";
import { baseURL } from "../../api";
import dayjs from "dayjs";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import { useLocation } from "react-router-dom";
import DynamicForm1 from "./DefaultTable";
import InputTableDefaultAllComponent from "./InputTableDefaultAllComponent";
import InputTableDefault from "./InputTableDefault";
import { Global_Data } from "../../globalData/GlobalData";
import NUMBER from "../../component/NUMBER/NUMBER";
import { Icon } from "../../utils/MuiIcons/Icon";
import { serverAddress } from "../../config";
import TranserDialog from "./Transfer/TransferDialog";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import Switch from "@mui/material/Switch";
import SelectAllTransferList from "./Transfer/TransferList";
import DebitCredit from "./DebitCredit";
import { globalvalidateTextField, validateTextField } from "../../utils/validations/Validation";
import VARNUMBER from "../../component/VARNUMBER/VARNUMBER";
import Spinner from "../../component/spinner/Spinner";
import VarValue from "../../component/Accordian/VarValue";

const TableComponent = ({
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
  setSelectAndAutocompleteSname,
  company,
  textValue,
  setdebitCreditTableData,
  isSubmited,
  tabledata,
  tablesummaryfields,
  freeformTableMode,
  freeformTableName,
  setFreeFromTotals,
  formAction,
  isDisabledTable,
  formdata,
  formData,
  documentSelectTableData,
  documentSelectmappingData,
  handleClickOpen2,
  setdefaultTableNameAndModel //rfg UAT
}) => {
  const [subtotal1, setsubTotal1] = useState(parseFloat(0).toFixed(2));
  const [grand_total, setGrandtotal] = useState(parseFloat(0).toFixed(2));
  const [subTotal, setSubTotal] = useState({});
  const [subTotalDef, setSubTotalDef] = useState(null);
  const [selectTax, setSelectTax] = useState();
  const [totalHandle, settotalHandle] = useState(parseFloat(0).toFixed(2));
  const [totalShipping, settotalShipping] = useState(parseFloat(0).toFixed(2));
  const [totaldiscount, settotaldiscount] = useState(parseFloat(0).toFixed(2));
  const [totalTax, setTotalTax] = useState(parseFloat(0).toFixed(2));
  const [totaladjustment, settotaladjustment] = useState(parseFloat(0).toFixed(2));

  let urlCapture = window.location.pathname + window.location.search;

  const [taxOption, setTaxOptions] = useState([]);
  const [allfeildsNames, setAllfeildsNames] = useState({});
  const [allfeildsNames1, setAllfeildsNames1] = useState({});
  const [allFeildForDoucmentSelect, setallFeildForDoucmentSelect] = useState({});
  const [allfeildsWithsType, setAllfeildsWithsType] = useState({});
  const [handlettotal, sethandletotal] = useState({});
  const [feildsWithColumns, setfeildsWithColumns] = useState({});
  const [totalDebit, setTotalDebit] = useState();
  const [totalCredit, setTotalCredit] = useState();
  const [price, setPrice] = useState();
  const [taxFirstOption, setTaxFirstOption] = useState("");
  const [fixedColumnFeilds, setfixedColumnFeilds] = useState({});
  const [fixedColumnFeildsName, setfixedColumnFeildsName] = useState({});
  const [columnIdMapping, setColumnIdMapping] = useState({});

  const {
    token,
    freeFormInitState,
    setFreeFormInitState,
    mainFormData,
    setmainFormData,
    freeFromtableRowDataStore,
    globalReloadTriggred,
    freeFormToDefault,
    setFreeFormDataSubmit,
    setFreeFromTableRowDataStore,setOpenDocumentSelect,multiDocumentSelectDataForTable,setmultiDocumentSelectDataForTable,
    setConversionNamesMapping,
    conversionNamesMapping
  } = Global_Data();
  // =================================
  const [summ_handling, setSumm_handling] = useState(parseFloat(0).toFixed(2));
  const [summ_shipping, setSumm_shipping] = useState(parseFloat(0).toFixed(2));
  const [summ_discount, setSumm_discount] = useState(parseFloat(0).toFixed(2));
  const [summ_adjustment, setSumm_adjustment] = useState(parseFloat(0).toFixed(2));
  const [summ_grandTotal, setSumm_grandTotal] = useState(parseFloat(0).toFixed(2));

  // =================================
  // default data
  const [rows, setRows] = useState([]); //rfg UAT
  const [freeForm, setFreeformdata] = useState([]);
  const [freeFormError, setfreeFormError] = useState([]);
  const [freeFormValidation, setfreeFormValidation] = useState({});
  // end default
  const [emptyrows, setEmptyRow] = useState([]);
  const [emptyfreeform, setEmptyFreeform] = useState([]);
  const loacation = useLocation();
  const path = loacation?.search?.toLocaleLowerCase();
  // console.log(selectTax,'selectTax');
  function getErrorDetails(data, Id) {
    const rtnData = data.filter(elm => elm?.id == Id);
    if (rtnData?.length > 0) {
      return rtnData[0];
    } else {
      return false;
    }
  }

  useEffect(() => {
    if(freeForm && freeForm.length > 0){
      freeForm.forEach((transformedField) => {
        for (const [key, value] of Object.entries(data?.component?.bulkLoad?.sMapping)) {
          if (typeof transformedField[allfeildsNames[value]] === 'number' && !isNaN(transformedField[allfeildsNames[value]])) {
            transformedField[allfeildsNames[value]] = transformedField[allfeildsNames[value]].toFixed(2);
          } 
        }
      })
    }
  }, [freeForm])

  // useEffect(() => {  //rfg UAT
  //   setdefaultTableNameAndModel(data.component);
  // }, [data]);

  useEffect(() => {
    setFreeformdata(emptyfreeform);
  }, [globalReloadTriggred])

  useEffect(() => {
    if (freeFromtableRowDataStore?.length > 0 && freeFormToDefault) {
      setTimeout(() => {
        const updatedStore = freeFromtableRowDataStore.filter(
          elm => elm?.tableName == data?.component?.sName
        );
        if (updatedStore?.length > 0 && !globalReloadTriggred) {
          setFreeformdata(updatedStore?.[0]?.tabledata);
        }
      }, 150);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (freeForm?.length > 0) {
        setFreeFromTableRowDataStore(prev => {
          // Remove the old table if it exists
          const updatedStore = prev?.filter(elm => elm?.tableName != data?.component?.sName);

          // Add the new table data
          return [...updatedStore, { tableName: data?.component?.sName, tabledata: freeForm }];
        });
      }
    };
  }, [freeForm]);

  useEffect(() => {
    sethandletotal({
      summ_handleTotal: totalHandle,
      summ_shipTotal: totalShipping,
      summ_discountTotal: totaldiscount,
      summ_adjustmentTotal: totaladjustment,
      summ_taxTotal: totalTax,
      disc_type: subTotal.disc_type
    });
  }, [totalHandle, totalShipping, totaldiscount, totaladjustment, totalTax]);
  // console.log(subTotal.disc_type, "called");

  useEffect(() => {
    setSubTotal(prevSubTotal => ({ ...prevSubTotal, handlettotal }));
  }, [handlettotal]);
  function getMatchingKeys(realFeilds, arry) {
    return arry.map(item => {
      // Create a new object to store only the matching keys
      let matchedFields = {};

      // Loop through realFeilds keys and copy the fields from item that exist in realFeilds
      Object.keys(realFeilds).forEach(key => {
        if (key in item) {
          matchedFields[key] = item[key];
        }
      });

      return matchedFields;
    });
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}${formdata?.form?.sFormSource}`, {
          headers: {
            Authorization: `Bearer ${token}`
            // Other headers if needed
          }
        });
        if (response?.data?.metadata?.status === "OK") {
          const { tabledetails: data = [], tablesummary: datahandling = [] } =
            response?.data?.data[1]?.tablerecords[0] || {};
          const { tabledetails: dataFreeForm = [] } =
            response?.data?.data[1]?.tablerecords[1] || {};

          const finaldata = data?.map((item, index) => ({ ...item, id: index + 1 }));
          const finaldata1 = dataFreeForm?.map((item, index) => ({ ...item, id: index + 1 }));

          if (formAction === "EDIT") {
            setRows(finaldata);
            setFreeformdata(finaldata1);

            const initialValues = {};
            for (const { sSummaryID, sInputValue } of datahandling) {
              initialValues[sSummaryID] = sInputValue;
            }
            setSubTotal(initialValues);
            setSubTotalDef(initialValues);
          }
        }
      } catch (error) {
        // Handle error
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [formAction, formdata?.form?.sFormSource, baseURL]);

  function removeVarTextFields(data, fieldTypes) {
    // Create a deep copy of the data array
    const newData = JSON.parse(JSON.stringify(data));

    // Iterate over each object in the new data array
    for (let i = 0; i < newData.length; i++) {
      const obj = newData[i];
      // Iterate over each key in the object
      for (const key in obj) {
        // Check if the key has VARTEXT type according to fieldTypes
        // if (fieldTypes[key] === "VARTEXT") {
        // If the key has VARTEXT type, remove it from the object
        // delete obj[key];
        // }
      }
    }
    return newData;
  }
  function replaceKeys2(data1, data2) {
    return data2.map(obj => {
      const newObj = {};
      for (let key in obj) {
        if (data1[key]) {
          newObj[data1[key]] = obj[key];
        } else {
          newObj[key] = obj[key];
        }
      }
      return newObj;
    });
  }
  useEffect(() => {
    if (Array.isArray(rows) && rows.length > 0 && rows[0] && Object.values(rows[0]).length > 1) {
      tabledata(rows);
    }

    if (Object.values(subTotal)?.length >= 2) {
      tablesummaryfields(subTotal);
    }

    if (freeForm?.length && Object.values(freeForm[0])?.length > 1) {
      const freeFormData = {
        sInputTableMode: data?.component?.options?.mode,
        sInputTableName: data?.component?.sName,
        tabledetails: removeVarTextFields(
          replaceKeysSendData(freeForm, fixedColumnFeildsName),
          allfeildsWithsType
        )
      };

      const existingIndex = freeFormTabbleArrays.findIndex(
        item => item.sInputTableName === freeFormData.sInputTableName
      );

      setFreeFormTabbleArrays((prev) => {
        if (existingIndex !== -1) {
          prev[existingIndex] = structuredClone(freeFormData);
          return prev;
        } else {
          return [...prev, { ...freeFormData }];
        }
      });
      setFreeFormDataSubmit(freeForm);
      tablefreeformfield(freeForm);
    }
  }, [rows, freeForm, subTotal]);

  useEffect(() => {
    if (isSubmited || urlCapture) {
      setRows(emptyrows);
      setFreeformdata(emptyfreeform);
      setSubTotal([]);
      setSelectTax();
      settotalHandle(parseFloat(0).toFixed(2));
      settotalShipping(parseFloat(0).toFixed(2));
      settotaldiscount(parseFloat(0).toFixed(2));
      settotaladjustment(parseFloat(0).toFixed(2));
      setTotalTax(parseFloat(0).toFixed(2));
    }
  }, [isSubmited, urlCapture]);

  useEffect(() => {
    setFreeformdata([]);
    const freeclms = { id: 1 };
    const validate = {};
    const allFeild1 = {};
    const allFeild2 = {};
    const AllfeildsWithsType = {};
    const allFeildForDoucmentSelect = {};
    if (data?.component?.options?.mode === "FREEFORM" && data?.child) {
      data.child.forEach(item => {
        switch (item?.component.sType) {
          case "AUTOCOMPLETE":
          case "TEXTFIELD":
          case "NUMBER":
          case "SELECT":
          case "VARNUMBER":
          case "VARTEXT":
          case "DATETIME":
            freeclms[item?.component.sName] = item?.component.sDefaultValue || "";
            validate[item?.component.sName] = item.validation;
            (allFeild1[item.inputtable.sColumnID] = item.component.sName),
              (allFeild2[item.inputtable.sColumnID] = item.component.sName),
              (allFeildForDoucmentSelect[item.inputtable.sColumnID] = item.component.sName),
              (AllfeildsWithsType[item.component.sName] = item.component.sType),
              (allFeild1.header = item.inputtable.sHeader);
            break;
          case "CHECKBOX":
            freeclms[item?.component.sName] = "No";
            validate[item?.component.sName] = item.validation;
            (allFeild1[item.inputtable.sColumnID] = item.component.sName),
              (allFeild2[item.inputtable.sColumnID] = item.component.sName),
              (allFeildForDoucmentSelect[item.inputtable.sColumnID] = item.component.sName),
              (AllfeildsWithsType[item.component.sName] = item.component.sType),
              (allFeild1.header = item.inputtable.sHeader);
            break;
          default:
            break;
        }
      });
      let fixedColumns = {};
      let feildsWithColumns = {};
      let feildsWithColumnsName = {};

      data?.fixcolumns?.forEach(item => {
        fixedColumns[item.sColumnID] = item?.inputType?.component?.sDefaultValue || "";
        freeclms[item.sColumnID] = item?.inputType?.component?.sDefaultValue || "";
        feildsWithColumns[item.sColumnID] = item?.inputType?.component?.sName || "";
        feildsWithColumnsName[item?.inputType?.component?.sName] = item.sColumnID || "";
        validate[item.sColumnID] = item?.inputType?.validation;

        // alert(JSON.stringify(item?.inputType?.component.sName))

        allFeild1[item.sColumnID] = item?.inputType?.component.sName;
        allFeild2[item.sColumnID] = item?.inputType?.component.sName;
        AllfeildsWithsType[item.sColumnID] = item?.inputType?.component.sType;

        allFeild1.header = item.sHeader;
      });

      setfeildsWithColumns(feildsWithColumnsName);
      setfixedColumnFeildsName(feildsWithColumns);
      setfixedColumnFeilds(fixedColumns);
      setAllfeildsNames(allFeild1);
      setAllfeildsNames1(allFeild2);
      setallFeildForDoucmentSelect(allFeildForDoucmentSelect);
      setAllfeildsWithsType(AllfeildsWithsType);

      const existingIndex = freeFormTabbleArrays.findIndex(
        item => item.sInputTableName === data?.component?.sName
      );
      // alert( JSON.stringify(freeFormTabbleArrays[existingIndex]?.tabledetails[0]))
      // alert(JSON.stringify(formAction));
      if (formAction == "EDIT") {
        if (
          data?.component?.sName == "acc_customercontact" ||
          data?.component?.sName == "acc_customershipping" ||
          data?.component?.sName == "customer_contacts" ||
          data?.component?.sName == "acc_vendorcontact"
        ) {
          // if (formAction ) {
          // if (formAction != "EDIT") {

          // alert(JSON.stringify(freeFormTabbleArrays[existingIndex]?.tabledetails[0]))
          // alert(JSON.stringify({ id: 1,...freeclms, ...freeFormTabbleArrays[existingIndex]?.tabledetails[0] }))

          const existingIndex2 = freeFormTabbleEditArrays?.filter(
            item => item.sInputTableName === data?.component?.sName
          );

          // existingIndex[0]?.tabledetails[0]?.sContactID
          // setFreeformdata([
          //   {
          //     id: 1,
          //     ...freeFormTabbleArrays[existingIndex]?.tabledetails[0],
          //     sContactID:
          //       existingIndex2[0]?.tabledetails[0]?.sContactID ||
          //       freeFormTabbleArrays[existingIndex]?.tabledetails[0].sContactID,
          //     sShippingID:
          //       existingIndex2[0]?.tabledetails[0]?.sShippingID ||
          //       freeFormTabbleArrays[existingIndex]?.tabledetails[0].sShippingID
          //   }
          // ]);

          // alert('dd')
          const editFreeformdata = freeFormTabbleEditArrays?.[existingIndex]?.tabledetails.map(
            (item, index) => {
              return {
                id: index + 1, // Assign dynamic id based on the index
                ...item, // Spread the existing item properties
                sContactID:
                  existingIndex2?.[index]?.tabledetails?.[0]?.sContactID || item?.sContactID, // Fallback to original if missing
                sShippingID:
                  existingIndex2?.[index]?.tabledetails?.[0]?.sShippingID || item?.sShippingID // Fallback to original if missing
              };
            }
          );

          // Set the dynamic data
          //  here setting free form data backend table data
          let newData = getMatchingKeys(freeclms, editFreeformdata);
          setFreeformdata(newData);
          // alert('dsd')
          // }
        } else {
          if (formAction != "EDIT") {
            setFreeformdata([{ ...freeclms }]);
            setEmptyFreeform([freeclms]);
          }
        }
      } else {
        if (
          data?.component?.sName == "acc_customercontact" ||
          data?.component?.sName == "acc_customershipping" ||
          data?.component?.sName == "customer_contacts" ||
          data?.component?.sName == "acc_vendorcontact"
        ) {
          // if (formAction ) {
          // if (formAction != "EDIT") {

          // alert(JSON.stringify(freeFormTabbleArrays[existingIndex]?.tabledetails[0]))
          // alert(JSON.stringify({ id: 1,...freeclms, ...freeFormTabbleArrays[existingIndex]?.tabledetails[0] }))

          const existingIndex2 = freeFormTabbleEditArrays?.filter(
            item => item.sInputTableName === data?.component?.sName
          );
          // existingIndex[0]?.tabledetails[0]?.sContactID
          setFreeformdata([
            {
              id: 1,
              ...freeFormTabbleArrays[existingIndex]?.tabledetails[0],
              sContactID:
                existingIndex2[0]?.tabledetails[0]?.sContactID ||
                freeFormTabbleArrays[existingIndex]?.tabledetails[0].sContactID,
              sShippingID:
                existingIndex2[0]?.tabledetails[0]?.sShippingID ||
                freeFormTabbleArrays[existingIndex]?.tabledetails[0].sShippingID
            }
          ]);

          // }
        } else {
          if (formAction != "EDIT") {
            setFreeformdata([{ ...freeclms }]);
            setEmptyFreeform([freeclms]);
          }
        }
      }
    }

    setfreeFormValidation(validate);
    // alert(JSON.stringify(validate));
    setEmptyFreeform([freeclms]);
  }, [
    data,
    isSubmited,
    urlCapture,
    taxFirstOption,
    freeFormTabbleArrays,
    freeFormTabbleEditArrays
  ]);
  // alert(JSON.stringify(emptyfreeform))

  useEffect(() => {
    const existingIndex = freeFormTabbleEditArrays?.filter(
      item => item.sInputTableName === data?.component?.sName
    );

    if (
      existingIndex &&
      existingIndex[0]?.tabledetails &&
      existingIndex[0]?.tabledetails.length >= 1
    ) {
      const filteredComponents = filterComponentsRecursive(mainFormData.details);
      const tableData = getDataByType("INPUTTABLE", filteredComponents);
      // alert('k')
      const existingIndexsecond = tableData?.filter(
        item => item.sInputTableName === data?.component?.sName
      );
      const newRow = {
        ...existingIndexsecond[0]?.tabledetails[0]
      };
      const matchedFields = newRow;
      const newFreeData = heraferidatauseEffect(
        { ...data?.component?.defaultLoad?.sMapping },
        allfeildsNames1,
        existingIndex[0]?.tabledetails
      );
      const newData3 = [];
      for (let i = 0; i < newFreeData.length; i++) {
        newData3.push({ ...matchedFields, ...newFreeData[i] });
      }

      // console.log(newData3,'newData3');
      // setFreeformdata();
      // alert(JSON.stringify(emptyfreeform))

      if (
        data?.component?.sName == "acc_customercontact" ||
        data?.component?.sName == "acc_customershipping" ||
        data?.component?.sName == "customer_contacts" ||
        data?.component?.sName == "acc_vendorcontact"
      ) {
        // if (formAction ) {
        // if (formAction != "EDIT") {
        // alert(JSON.stringify(freeFormTabbleArrays))
        // setFreeformdata([{ id: 1, ...freeFormTabbleArrays[existingIndex]?.tabledetails[0] }]);
        // }
      } else {
        if (newData3.length > 0) {
          setFreeformdata(replaceKeys2(feildsWithColumns, newData3));
        } else {
          setFreeformdata(emptyfreeform);
        }
      }
    } else {
      if (formAction == "EDIT") {
        setFreeformdata(emptyfreeform);
      }
    }
    // }else{
    //   const existingIndex = freeFormTabbleArrays.findIndex(
    //     item => item.sInputTableName ===  data?.component?.sName
    //   );
    //   const newRow  ={id : 1 ,...freeFormTabbleArrays[existingIndex].tabledetails[0]}

    //   setFreeformdata(newRow);
    // }
  }, [freeFormTabbleEditArrays, feildsWithColumns, emptyfreeform]);

  const updateAmount = (id, name) => {
    const rowIdx = rows.findIndex(item => item.id === id);
    if (rowIdx === -1) return; // Row not found, do nothing

    const row = rows[rowIdx];

    const qty = +row.col_qty || 1; // parseFloat(row.col_qty || 1);
    const rate = +row.col_rate || 0;
    const disc = +row.col_disc || 0; // parseFloat(row.col_disc || 0);
    const debit = +row.col_debit || 0; // parseFloat(row.col_disc || 0);
    const disctype = row.disc_type || "%"; // parseFloat(row.col_disc || 0);
    const credit = +row.col_credit || 0; // parseFloat(row.col_tax || 0);
    const tax = +row.col_tax || taxFirstOption; // parseFloat(row.col_tax || 0);

    const discDecimal = disc / 100;
    const taxDecimal = tax / 100;
    let amount = 0;

    if (disctype === "%") {
      // amount = (rate*(tax/100)) + qty * rate * (1 - disc / 100);
      amount = qty * rate * (1 - discDecimal) * (1 + taxDecimal);
    } else if (disctype === "Fixed") {
      amount = rate * (tax / 100) + qty * rate - disc;
      // console.log(disc);
    }
    const zero = 0;
    const updatedRow = {
      ...row,
      col_amount: amount.toFixed(2),
      col_qty: qty,
      col_rate: rate.toFixed(2),
      // col_tax: taxFirstOption,
      // disc_type:disctype,
      col_disc: disc.toFixed(2),
      col_debit: name === "col_credit" ? zero.toFixed(2) : debit.toFixed(2),
      col_credit: name === "col_debit" ? zero.toFixed(2) : credit.toFixed(2)
    };

    const updatedRows = [...rows];
    updatedRows[rowIdx] = updatedRow;

    setRows(updatedRows);
  };

  const handleSelectChange = prop => value => {
    if (prop === "summ_tax") {
      let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
      let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
      let summ_adjustment = subTotal?.summ_adjustment ? subTotal?.summ_adjustment : 0;
      let summ_discount = subTotal?.summ_discount ? subTotal?.summ_discount : 0;
      let summ_disc_type = subTotal?.disc_type ? subTotal?.disc_type : 0;

      let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);

      let discountAmount;
      if (summ_disc_type === "%") {
        discountAmount = (total / 100) * summ_discount;
        // discountAmount  = total - discountAmount
      } else {
        discountAmount = summ_discount;
      }

      // const discountAmount =
      // (total / 100) * Number(subTotal?.summ_discount ? subTotal?.summ_discount : 0);

      let new_total = Number(total) - Number(discountAmount) - Number(summ_adjustment);

      const taxAmount = (new_total / 100) * Number(value);

      let total_with_tax = Number(new_total) + Number(taxAmount);

      setSubTotal({
        ...subTotal,
        [prop]: value,
        summ_grandtotal: parseFloat(total_with_tax).toFixed(2)
      });
      // console.log('22222222222');
      setGrandtotal(parseFloat(total_with_tax).toFixed(2));
      setTotalTax(parseFloat(total_with_tax).toFixed(2));
    }
    setSelectTax(value);
  };

  const columns = [];

  columns.push({
    field: "SN",
    headerName: "No.",
    width: 70,
    sortable: true,
    disableColumnMenu: true,
    renderCell: params => {
      const index = params.api.getSortedRowIds().indexOf(params.row.id) + 1;
      return <Typography
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}
      >
        {index}
      </Typography>
    }
  });

  const summaryHandler = (prop, value) => event => {
    const value1 = handlePointChange(event.target.value);

    let new_total = 0;
    let update_disc;

    if (prop === "ADD" && value === "summ_handling") {
      if (value1 !== "") {
        new_total = Number(value1) + Number(subtotal1);
        settotalHandle(parseFloat(new_total).toFixed(2));
      }
      if (subTotal?.summ_shipping === "") {
        settotalShipping(parseFloat(0).toFixed(2));
      }
      if (subTotal?.summ_discount === "") {
        settotaldiscount(parseFloat(0).toFixed(2));
      }
      if (subTotal?.summ_adjustment === "") {
        settotaladjustment(parseFloat(0).toFixed(2));
      }
      if (value1 === "") {
        settotalHandle(parseFloat(0).toFixed(2));
      }
      if (subTotal?.summ_shipping !== "") {
        settotalShipping(parseFloat(new_total).toFixed(2));
        new_total = Number(value1) + Number(subtotal1) + Number(subTotal.summ_shipping);
        if (subTotal?.summ_discount !== "" && subTotal?.summ_discount !== undefined) {
          let add_total = Number(value1) + Number(subtotal1) + Number(subTotal.summ_shipping);
          let discount_val = (add_total / 100) * Number(subTotal.summ_discount);
          update_disc = Number(add_total) - discount_val;

          new_total = update_disc;
          settotaldiscount(parseFloat(update_disc).toFixed(2));
        }
        if (subTotal?.summ_adjustment !== "") {
          let add_total = Number(value1) + Number(subtotal1) + Number(subTotal.summ_shipping);

          update_disc = Number(add_total) - subTotal?.summ_adjustment;
          settotaladjustment(parseFloat(update_disc).toFixed(2));
        }
      }
    } else if (prop === "ADD" && value === "summ_shipping") {
      if (subTotal?.summ_adjustment === "" || subTotal?.summ_adjustment === undefined) {
        settotaladjustment(parseFloat(0).toFixed(2));
      }
      if (value1 !== "") {
        new_total = Number(value1) + Number(subtotal1) + Number(subTotal.summ_handling);
        settotalShipping(parseFloat(new_total).toFixed(2));
        if (subTotal?.summ_discount !== "") {
          let add_total = Number(value1) + Number(subtotal1) + Number(subTotal.summ_handling);
          let discount_val = (add_total / 100) * Number(subTotal.summ_discount);
          update_disc = Number(add_total) - discount_val;
          settotaldiscount(parseFloat(update_disc).toFixed(2));
        }
        if (subTotal?.summ_adjustment !== "" && subTotal?.summ_adjustment !== undefined) {
          let add_total = Number(value1) + Number(subtotal1) + Number(subTotal?.summ_handling);
          update_disc = Number(add_total) - Number(subTotal.summ_adjustment);
          settotaladjustment(parseFloat(update_disc).toFixed(2));
        }
      }

      if (subTotal?.summ_handling === "") {
        settotalHandle(parseFloat(0).toFixed(2));
      }
      if (subTotal?.summ_discount === "") {
        settotaldiscount(parseFloat(0).toFixed(2));
      }

      if (value1 === "") {
        settotalShipping(parseFloat(0).toFixed(2));
      }
    } else if (prop === "SUBTRACT" && value === "summ_discount") {
      if (value1 !== "") {
        let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
        let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
        let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);

        const discountAmount = (total / 100) * Number(value1);

        new_total = Number(total) - discountAmount;

        settotaldiscount(parseFloat(new_total).toFixed(2));

        if (subTotal?.summ_adjustment !== "" && subTotal?.summ_adjustment !== undefined) {
          let add_total = Number(value1) + Number(subtotal1) + Number(subTotal?.summ_handling);
          update_disc = Number(add_total) - Number(subTotal.summ_adjustment);
          settotaladjustment(parseFloat(update_disc).toFixed(2));
        }
      }

      if (subTotal?.summ_handling === "") {
        settotalHandle(parseFloat(0).toFixed(2));
      }
      if (subTotal?.summ_shipping === "") {
        settotalShipping(parseFloat(0).toFixed(2));
      }
      if (subTotal?.summ_adjustment === "") {
        settotaladjustment(parseFloat(0).toFixed(2));
      }
      if (value1 === "") {
        settotaldiscount(parseFloat(0).toFixed(2));
      }
    } else if (prop === "MULTIPLY" && value === "summ_discount") {
      if (value1 !== "") {
        let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
        let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
        let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);

        let discountAmount;

        if (subTotal.disc_type === "%") {
          discountAmount = Number(value1) / 100;
          discountAmount = total * discountAmount;
        } else {
          discountAmount = Number(value1);
        }

        new_total = Number(total) - Number(discountAmount);
        settotaldiscount(parseFloat(new_total).toFixed(2));

        // console.log(Number(new_total) , Number(subTotal?.summ_adjustment),'Number(subTotal?.summ_adjustment)');
        if (isNaN(Number(subTotal?.summ_adjustment))) {
          new_total = Number(new_total);
        } else {
          new_total = Number(new_total) - Number(subTotal?.summ_adjustment);
        }

        if (subTotal?.summ_adjustment !== "" && subTotal?.summ_adjustment !== undefined) {
          // let add_total = Number(value1) + Number(subtotal1) + Number(subTotal?.summ_handling);
          update_disc = Number(new_total);
          settotaladjustment(parseFloat(update_disc).toFixed(2));
        }
      }

      if (subTotal?.summ_handling === "") {
        settotalHandle(parseFloat(0).toFixed(2));
      }
      if (subTotal?.summ_shipping === "") {
        settotalShipping(parseFloat(0).toFixed(2));
      }
      if (subTotal?.summ_adjustment === "") {
        settotaladjustment(parseFloat(0).toFixed(2));
      }
      if (value1 === "") {
        settotaldiscount(parseFloat(0).toFixed(2));
      }
    } else if (prop === "MULTIPLY" && value === "disc_type") {
      if (value1 === "%") {
        setSubTotal(pre => ({ ...pre, [event.target.name]: value1 }));
        // return console.log(subTotal, 990);
      } else if (value1 === "Fix") {
        setSubTotal(pre => ({ ...pre, [event.target.name]: value1 }));
        // return console.log(subTotal, 990);
      }
      // if (value1 !== "") {
      let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
      let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
      let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);

      let discountAmount;

      if (value1 === "%") {
        discountAmount = Number(subTotal.summ_discount) / 100;
        discountAmount = total * discountAmount;
      } else {
        discountAmount = Number(subTotal.summ_discount);
      }

      new_total = Number(total) - Number(discountAmount);
      settotaldiscount(parseFloat(new_total).toFixed(2));
      // }
      // console.log(subTotal,new_total,'subTotal8');
      // if (subTotal?.summ_handling === "") {
      //   settotalHandle(parseFloat(0).toFixed(2));
      // }
      // if (subTotal?.summ_shipping === "") {
      //   settotalShipping(parseFloat(0).toFixed(2));
      // }
      // if (subTotal?.summ_adjustment === "") {
      //   settotaladjustment(parseFloat(0).toFixed(2));
      // }
      // if (value1 === "") {
      //   settotaldiscount(parseFloat(0).toFixed(2));
      // }
      if (subTotal?.summ_adjustment !== "" && subTotal?.summ_adjustment !== undefined) {
        // let add_total = Number(value1) + Number(subtotal1) + Number(subTotal?.summ_handling);
        update_disc = Number(new_total) - Number(subTotal.summ_adjustment);
        settotaladjustment(parseFloat(update_disc).toFixed(2));
      }
    } else if (prop === "SUBTRACT" && value === "summ_adjustment") {
      if (value1 !== "") {
        let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
        let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
        let summ_discount = subTotal?.summ_discount ? subTotal?.summ_discount : 0;
        let summ_disc_type = subTotal?.disc_type ? subTotal?.disc_type : 0;

        let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);
        let new_discount;
        if (summ_disc_type === "%") {
          new_discount = (total / 100) * summ_discount;
          new_discount = total - new_discount;
        } else {
          new_discount = total - summ_discount;
        }
        new_total = new_discount - Number(value1);

        settotaladjustment(parseFloat(new_total).toFixed(2));
      }
      if (subTotal?.summ_handling === "") {
        settotalHandle(parseFloat(0).toFixed(2));
      }
      if (subTotal?.summ_shipping === "") {
        settotalShipping(parseFloat(0).toFixed(2));
      }
      if (subTotal?.summ_discount === "") {
        settotaldiscount(parseFloat(0).toFixed(2));
      }
      if (value1 === "") {
        settotaladjustment(parseFloat(0).toFixed(2));
      }
    }

    // Update summ_grandtotal using the latest new_total
    if (value1 === "%" || value1 === "Fix") {
      return setSubTotal({
        ...subTotal,
        [value]: value1,
        summ_grandtotal: parseFloat(new_total).toFixed(2)
      });
    }

    setSubTotal({
      ...subTotal,
      [value]: parseFloat(value1).toFixed(2),
      summ_grandtotal: parseFloat(new_total).toFixed(2)
    });
  };

  const handlePointChange = num => {
    if (!num) {
      return "0.00";
    }
    if (num === "Fix") {
      return "Fix";
    }
    if (num === "%") {
      return "%";
    }

    const inputValue = num?.toString();
    const userInputLength = inputValue?.length;
    let formattedValue;

    if (inputValue.includes(".")) {
      const arr = inputValue.split(".");
      const newInputValue = inputValue?.toString().replace(".", "");
      const lastValue = arr[1];
      const lastValueueLenght = lastValue?.toString().length;

      if (lastValueueLenght === 2) {
        formattedValue = `${arr[0]}.${lastValue}`;
      } else {
        const STRVAL = newInputValue?.toString();
        const arrval = STRVAL.split("");
        const joinVal = arrval.slice(0, -2).join("");

        formattedValue = parseFloat(
          `${parseFloat(joinVal)}.${arrval[arrval.length - 2]}${arrval[arrval.length - 1]}`
        );
      }
    } else {
      if (userInputLength > 2) {
        formattedValue = `${inputValue.slice(0, -2)}.${inputValue.slice(-2)}`;
      } else if (userInputLength === 2) {
        formattedValue = `0.${inputValue}`;
      } else if (userInputLength === 1) {
        formattedValue = `0.0${inputValue}`;
      }
    }
    // console.log(formattedValue,'formattedValue');
    let val = inputValue.includes(".") ? parseFloat(formattedValue) : formattedValue;
    // let val = inputValue.includes(".")
    //     ? parseFloat(formattedValue)
    //     : formattedValue.toFixed(2);

    return isNaN(val) ? "0.00" : val;
  };

  const update = callback => {
    if (callback) {
      callback();
    }
  };

  const takeInput = (e, id, type) => {
    if (type == "setPrice") {
      const list = [...rows];
      const index = list.findIndex(row => row.id === id);
      list[index]["col_rate"] = e;
      setRows(list);
      // setRows({ ...rows, [name]: value });
      updateAmount(id);
      summaryHandler();
    }

    const { name, value } = e.target;

    const feilds = ["col_disc", "col_debit", "col_credit"];
    var newval;

    if (name == "col_debit") {
      newval = handlePointChange(value);
    } else if (name == "col_credit") {
      newval = handlePointChange(value);
    } else if (name == "col_disc") {
      newval = handlePointChange(value);
    } else if (name == "col_rate") {
      newval = handlePointChange(value);
    } else {
      newval = value;
    }
    update();

    const list = [...rows];
    const index = list.findIndex(row => row.id === id);

    list[index][name] = newval;

    setRows(list);
    // setRows({ ...rows, [name]: value });
    updateAmount(id, name);
    summaryHandler();
    // console.log(list,'listlistlist');
  };
  // use this const data in useState

  useEffect(() => {
    const summ_handling = +subTotal.summ_handling
      ? +subTotal.summ_handling + +subtotal1
      : +subtotal1;

    if (subTotal.summ_handling) {
      if (subTotal.summ_handling === "0.00") {
        setSumm_handling("0.00");
      } else {
        setSumm_handling(parseFloat(+summ_handling).toFixed(2));
      }
    }

    const summ_shipping = +subTotal.summ_shipping
      ? +subTotal.summ_shipping + +summ_handling
      : +summ_handling;

    if (subTotal.summ_shipping) {
      if (subTotal.summ_shipping === "0.00") {
        setSumm_shipping("0.00");
      } else {
        setSumm_shipping(parseFloat(+summ_shipping).toFixed(2));
      }
    }

    // console.log(subTotal.disc_type == '%');
    const summ_discount = +subTotal.summ_discount
      ? subTotal.disc_type == "%"
        ? summ_shipping * (1 - +subTotal.summ_discount / 100)
        : +summ_shipping - +subTotal.summ_discount
      : +summ_shipping;

    if (subTotal.summ_discount) {
      if (subTotal.summ_discount === "0.00") {
        setSumm_discount("0.00");
      } else {
        setSumm_discount(parseFloat(+summ_discount).toFixed(2));
      }
    }

    const summ_adjustment = +subTotal.summ_adjustment
      ? +summ_discount - +subTotal.summ_adjustment
      : +summ_discount;

    if (subTotal.summ_adjustment) {
      if (subTotal.summ_adjustment === "0.00") {
        setSumm_adjustment("0.00");
      } else {
        setSumm_adjustment(parseFloat(+summ_adjustment).toFixed(2));
      }
    }

    setSumm_grandTotal(parseFloat(+summ_adjustment).toFixed(2));
  }, [subtotal1, subTotal]);

  useEffect(() => {
    let subtotal1 = rows.reduce((sum, item) => {
      const amount = Number(item?.col_amount);
      return +sum + amount;
    }, 0);

    let grand_total = 0;
    if (subtotal1) {
      grand_total = +subtotal1;
    }

    let grandsubtotal = isNaN(subtotal1) ? (subtotal1 = 0) : subtotal1;
    let grandvalue = isNaN(grand_total) ? (grand_total = 0) : grand_total;
    let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
    let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
    let summ_discount = subTotal?.summ_discount ? subTotal?.summ_discount : 0;
    let summ_adjustment = subTotal?.summ_adjustment ? subTotal?.summ_adjustment : 0;
    // let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
    grandvalue = +grand_total + +sum_handle + +sum_shipping - summ_adjustment;
    setGrandtotal(parseFloat(grand_total).toFixed(2));

    setsubTotal1(parseFloat(grandsubtotal).toFixed(2));
    if (grandsubtotal && grandvalue) {
      setSubTotal({
        ...subTotal,
        summ_subtotal: parseFloat(grandsubtotal).toFixed(2),
        summ_grandtotal: parseFloat(grandvalue).toFixed(2)
        // summ_adjustmentTotal:summ_adjustment,
        // summ_discountTotal:summ_discount,
        // summ_shipTotal:sum_shipping,
        // summ_handling:sum_handle,
      });
    }
  }, [rows]);

  useEffect(() => {
    setdifferenceDebitCredit(
      (() => {
        const totalAll = +totalDebit - +totalCredit;
        return totalAll.toFixed(2);
      })()
    );
  }, [totalDebit, totalCredit]);

  useEffect(() => {
    if (subTotal) {
      let new_total = 0;
      let new_total1 = 0;
      let update_disc = 0;

      if (Object.keys(subTotal).includes("summ_handleTotal")) {
        if (subTotal?.summ_handling !== "") {
          new_total1 = Number(subTotal?.summ_handling) + Number(subtotal1);
          settotalHandle(parseFloat(new_total1).toFixed(2));
        }

        if (subTotal?.summ_shipping === "") {
          settotalShipping(parseFloat(0).toFixed(2));
        }

        if (subTotal?.summ_discount === "") {
          settotaldiscount(parseFloat(0).toFixed(2));
        }

        if (subTotal?.summ_adjustment === "" || subTotal?.summ_adjustment === undefined) {
          settotaladjustment(parseFloat(0).toFixed(2));
        }

        if (subTotal?.summ_handling === "") {
          settotalHandle(parseFloat(0).toFixed(2));
        }

        if (subTotal?.summ_shipping !== "") {
          new_total =
            Number(subTotal?.summ_handling) + Number(subtotal1) + Number(subTotal.summ_shipping);
          settotalShipping(parseFloat(new_total).toFixed(2));

          if (subTotal?.summ_discount !== "") {
            let add_total =
              Number(subTotal?.summ_handling) + Number(subtotal1) + Number(subTotal.summ_shipping);
            let discount_val = (add_total / 100) * Number(subTotal.summ_discount);
            update_disc = Number(add_total) - discount_val;
            settotaldiscount(parseFloat(update_disc).toFixed(2));
          }

          if (subTotal?.summ_adjustment !== "" && subTotal?.summ_adjustment !== undefined) {
            let add_total =
              Number(subTotal?.summ_handling) + Number(subtotal1) + Number(subTotal.summ_shipping);

            update_disc = Number(add_total) - Number(subTotal.summ_adjustment);
            settotaladjustment(parseFloat(update_disc).toFixed(2));
          }
        }
      } else if (Object.keys(subTotal).includes("summ_shipTotal")) {
        if (subTotal?.summ_adjustment === "" || subTotal?.summ_adjustment === undefined) {
          settotaladjustment(parseFloat(0).toFixed(2));
        }

        if (subTotal?.summ_handling !== "") {
          new_total =
            Number(subTotal?.summ_shipping) + Number(subtotal1) + Number(subTotal.summ_handling);
          settotalShipping(parseFloat(new_total).toFixed(2));

          if (subTotal?.summ_discount !== "") {
            let add_total =
              Number(subTotal?.summ_shipping) + Number(subtotal1) + Number(subTotal.summ_handling);
            let discount_val = (add_total / 100) * Number(subTotal.summ_discount);
            update_disc = Number(add_total) - discount_val;
            settotaldiscount(parseFloat(update_disc).toFixed(2));
          }

          if (subTotal?.summ_handling === "") {
            settotalHandle(parseFloat(0).toFixed(2));
          }

          if (subTotal?.summ_discount === "") {
            settotaldiscount(parseFloat(0).toFixed(2));
          }

          if (subTotal?.summ_shipping === "") {
            settotalShipping(parseFloat(0).toFixed(2));
          }
        }
      } else if (Object.keys(subTotal).includes("summ_discountTotal")) {
        if (subTotal?.summ_discount !== "") {
          let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
          let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
          let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);

          const discountAmount = (total / 100) * Number(subTotal?.summ_discount);

          new_total = Number(total) - discountAmount;

          settotaldiscount(parseFloat(new_total).toFixed(2));
        }

        if (subTotal?.summ_handling === "") {
          settotalHandle(parseFloat(0).toFixed(2));
        }

        if (subTotal?.summ_shipping === "") {
          settotalShipping(parseFloat(0).toFixed(2));
        }

        if (subTotal?.summ_adjustment === "") {
          settotaladjustment(parseFloat(0).toFixed(2));
        }

        if (subTotal?.summ_discount === "") {
          settotaldiscount(parseFloat(0).toFixed(2));
        }
      } else if (Object.keys(subTotal).includes("summ_adjustmentTotal")) {
        if (subTotal?.summ_adjustment !== "" || subTotal?.summ_adjustment !== undefined) {
          let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
          let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
          let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);
          new_total = Number(total) - Number(subTotal?.summ_adjustment);
          settotaladjustment(parseFloat(new_total).toFixed(2));
        }

        if (subTotal?.summ_handling === "") {
          settotalHandle(parseFloat(0).toFixed(2));
        }

        if (subTotal?.summ_shipping === "") {
          settotalShipping(parseFloat(0).toFixed(2));
        }

        if (subTotal?.summ_discount === "") {
          settotaldiscount(parseFloat(0).toFixed(2));
        }

        if (subTotal?.summ_adjustment === "") {
          settotaladjustment(parseFloat(0).toFixed(2));
        }
      }

      if (Object.keys(subTotal).includes("sumrm_tax")) {
        let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
        let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
        let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);

        const discountAmount =
          (total / 100) * Number(subTotal?.summ_discount ? subTotal?.summ_discount : 0);

        new_total = Number(total) - Number(discountAmount);

        const taxAmount = (new_total / 100) * Number(subTotal?.summ_tax);

        let total_with_tax = Number(new_total) + Number(taxAmount);
        // console.log();

        setGrandtotal(parseFloat(total_with_tax).toFixed(2));
      }
    }
  }, [subTotal]);

  function removeCommas(inputString) {
    let result = "";
    for (let i = 0; i < inputString?.length; i++) {
      if (inputString[i] !== ",") {
        result += inputString[i];
      }
    }
    return result;
  }

  const handlePointChange1 = (num1, decimalPlaces = 0) => {
    const num = removeCommas(num1);
    // let val = inputValue.includes(".") ? parseFloat(formattedValue).toFixed(decimalPlaces) : formattedValue;
    let val;
    const inputValue = num?.toString();

    if (inputValue.includes(".")) {
      const arr = inputValue.split(".");
      const lastValue = arr[1];
      const newInputValue = inputValue?.toString().replace(".", "");
      const lastValueueLenght = lastValue?.toString().length;
      const STRVAL = newInputValue?.toString();
      const arrval = STRVAL.split("");
      const newArr = lastValue.split("");

      if (decimalPlaces == 0) {
        val = num;
      }

      if (decimalPlaces == 1) {
        val = lastValue / 10;
        if (arr[0] !== "0") {
          val = `${arr[0]}${lastValue / 10}`;
        }
      }
      if (decimalPlaces == 2) {
        if (lastValueueLenght === 2) {
          val = `${arr[0]}.${lastValue}`;
        } else {
          const joinVal = arrval.slice(0, -2).join("");
          val = `${parseFloat(joinVal)}.${arrval[arrval.length - 2]}${arrval[arrval.length - 1]}`;
        }
      }
      if (decimalPlaces == 3) {
        const joinVal = arrval.slice(0, -3).join("");

        if (newArr.length == 3) {
          val = `${parseFloat(joinVal)}.${newArr[0]}${newArr[1]}${newArr[2]}`;
        } else {
          val = `${parseFloat(joinVal)}.${newArr[1]}${newArr[2]}${newArr[3]}`;
        }
      }
      if (decimalPlaces == 4) {
        const joinVal = arrval.slice(0, -4).join("");
        if (newArr.length == 3) {
          val = `${0}.0${newArr[0]}${newArr[1]}${newArr[2]}`;
        } else {
          val = `${parseFloat(joinVal)}.${newArr[1]}${newArr[2]}${newArr[3]}${newArr[4]}`;
        }
      }

      if (decimalPlaces == 5) {
        const joinVal = arrval.slice(0, -5).join("");
        if (newArr.length == 3) {
          val = `${0}.00${newArr[0]}${newArr[1]}${newArr[2]}`;
        } else {
          val = `${parseFloat(joinVal)}.${newArr[1]}${newArr[2]}${newArr[3]}${newArr[4]}${
            newArr[5]
          }`;
        }
      }
    } else {
      if (decimalPlaces == 0) {
        val = inputValue;
        parseFloat(val).toFixed(decimalPlaces);
      }
      if (decimalPlaces == 1) {
        val = `0.${inputValue}`;
      }
      if (decimalPlaces == 2) {
        if (inputValue.length == 1) {
          // val = `0.0${inputValue}`;
          val = `${inputValue}.00`;
        } else {
          val = `${inputValue}.00`;
        }
      }
      if (decimalPlaces == 3) {
        val = `0.00${inputValue}`;
      }
      if (decimalPlaces == 4) {
        val = `0.000${inputValue}`;
      }
      if (decimalPlaces == 5) {
        val = `0.0000${inputValue}`;
      }
    }

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    }).format(
      isNaN(val) ? (decimalPlaces == "0" ? "0" : `${"0"}${"0".repeat(decimalPlaces)}`) : val
    );
    // return isNaN(val) ? decimalPlaces : val;
  };

  const FreeFormInput = (e, id, type, decimalPlace) => {
    const { name, value } = e.target;
    const value2 = type == "number" ? handlePointChange1(value, decimalPlace) : value;
    // alert(value2)
    const list = [...freeForm];
    const index = list.findIndex(row => row.id === id);
    list[index][name] = value2;
    setFreeformdata(list);

    // const err =  validateTextField(value,freeFormValidation[name])

    // setfreeFormError(prevError => {
    //   const newError = { ...prevError, [name]: err };
    //   return newError;
    // });

    const err = validateTextField(value, freeFormValidation[name]);

    setfreeFormError(preState => {
      preState[index] = { ...preState[index], [name]: err };
      return preState;
    });
  };

  const formcallback = (e, id, name) => {
    if (e) {
      let { value = "" } = e || "";
      const list = [...rows];
      const index = list.findIndex(row => row.id === id);
      list[index][name] = value;
      setRows(list);

      // alert(JSON.stringify(err));
      const err = validateTextField(value, freeFormValidation[name]);
      setfreeFormError(preState => {
        preState[index] = { ...preState[index], [name]: err };
        return preState;
      });
    }
  };

  const FreeFormCallBack = (e, id, name, itemObj, mapping) => {
    let mapfeild = {};

    if (mapping && Object.keys(mapping).length > 0) {
      const keys = Object.keys(mapping);
      const values = Object.values(mapping);

      for (let i = 0; i < keys.length; i++) {
        const obj = {
          ["name" + [i + 1]]: values[i],
          ["value" + [i + 1]]: itemObj[keys[i]]
        };
        mapfeild = { ...mapfeild, ...obj };
      }
    }
    // alert(JSON.stringify(mapfeild))

    if (e) {
      let { value = "" } = e || "";
      const list = [...freeForm];
      const index = list.findIndex(row => row.id === id);
      list[index][name] = e;
      if (mapfeild.name1) {
        list[index][allfeildsNames1[mapfeild.name1]] = mapfeild.value1;
      }
      if (mapfeild.name2) {
        list[index][allfeildsNames1[mapfeild.name2]] = mapfeild.value2;
      }
      if (mapfeild.name3) {
        list[index][allfeildsNames1[mapfeild.name3]] = mapfeild.value3;
      }
      // alert(JSON.stringify(list));
      setFreeformdata(list);
      const err = validateTextField(value, freeFormValidation[name]);
      setfreeFormError(preState => {
        preState[index] = { ...preState[index], [name]: err };
        return preState;
      });
    }
  };
  const FreeFormCallBackItem = (e, id, name) => {
    if (e) {
      let { value = "" } = e || "";
      const list = [...rows];
      const index = list.findIndex(row => row.id === id);
      list[index][name] = value;
      setRows(list);
      updateAmount(id);
      summaryHandler();
    }
  };

  const handledatachange = (e, id, name, mapfeild) => {
    const list = [...freeForm];
    const index = list.findIndex(row => row.id === id);
    list[index][name] = e;
    if (mapfeild) {
      list[index][allFeildForDoucmentSelect[mapfeild.name1]] = mapfeild.value1;
    }
    // alert()
    // alert(JSON.stringify(list))

    setFreeformdata(list);

    const err = validateTextField(e, freeFormValidation[name]);
    setfreeFormError(preState => {
      preState[index] = { ...preState[index], [name]: err };
      return preState;
    });
  };

  const handleAddRow = (e, reset = false) => {
    const newRow = {
      id: rows.length + 1,
      disc_type: "%",
      col_qty: "1",
      col_amount: "0.00",
      col_disc: "0.00"
    };
    if (e.target.value) {
      const numNewRows = parseInt(e.target.value);

      const newRows = Array.from({ length: numNewRows }, (_, i) => ({
        id: rows.length + i + 1,
        disc_type: "%"
      }));
      if(reset){
        setRows([...newRows]);
      } else {
        setRows([...rows, ...newRows]);
      }
    } else {
      if(reset){
        setRows([newRow]);
      } else {
        setRows([...rows, newRow]);
      }
    }
  };
  function filterComponentsRecursive(config) {
    const result = {};

    function processField(field) {
      const component = field.component || {};

      const { sType, sName, sDefaultValue } = component;

      if (
        [
          "TEXTFIELD",
          "AUTOCOMPLETE",
          "CHECKBOX",
          "TRANSFERLIST",
          "RADIOGROUP",
          "SELECT",
          "NUMBER",
          // "VARSELECT",
          "IMAGE",
          "DATETIME",
          "INPUT"
        ].includes(sType)
      ) {
        // Check if sType is CHECKBOX and default value is an empty string
        if (sType === "CHECKBOX") {
          result[sName] = sDefaultValue !== "" ? sDefaultValue || "No" : "No";
        } else {
          result[sName] = sDefaultValue || "";
        }
      }

      // Check if the field has a child array
      if (field.child && Array.isArray(field.child)) {
        // Nest child array data under the corresponding sName
        result[sName] = result[sName] || {};
        result[sName].child = {
          sType: sType,
          sInputTableName: sName,
          tabledetails: [filterComponentsRecursive(field.child)]
        };
        // alert(result);
        // Check if component.options.mode is present
        if (component.options) {
          result[sName].child.sInputTableMode = component.options.mode;
        }
      }
      // if (field.fixcolumns && Array.isArray(field.fixcolumns)) {
      //   result[sName] = result[sName] || {};
      //   result[sName].child = {
      //     sType: sType,
      //     sInputTableName: sName,
      //     tabledetails: [filterComponentsRecursive(field.fixcolumns)]
      //   };
      //   // alert(result);
      //   // Check if component.options.mode is present
      //   if (component.options) {
      //     result[sName].child.sInputTableMode = component.options.mode;
      //   }
      // }
    }
    config.forEach(processField);
    return result;
  }
  function getDataByType(sType, dataObject) {
    const result = [];

    function traverse(obj) {
      if (obj && obj.sType === sType) {
        result.push(obj);
      }

      for (const key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] === "object") {
          traverse(obj[key]);
        }
      }
    }

    traverse(dataObject);

    return result;
  }
  const handleAddRow1 = (e, reset = false) => {
    const filteredComponents = filterComponentsRecursive(mainFormData.details);
    const tableData = getDataByType("INPUTTABLE", filteredComponents);

    const existingIndex = tableData?.filter(
      item => item.sInputTableName === data?.component?.sName
    );

    // if (existingIndex[0]?.tabledetails && existingIndex[0]?.tabledetails.length >= 1 ) {

    //   setFreeformdata([{ id: 1,...existingIndex[0]?.tabledetails[0]}]);
    // }
    // delete existingIndex[0]?.tabledetails[0].id
    const newRow = {
      id: freeForm[freeForm.length - 1].id + 1,
      ...existingIndex[0]?.tabledetails[0],
      ...fixedColumnFeilds
    };

    if (e.target.value) {
      const numNewRows = parseInt(e.target.value);
      const newRows = Array.from({ length: numNewRows }, (_, i) => ({
        id: freeForm.length + i + 1,
        ...existingIndex[0]?.tabledetails[0],
        ...fixedColumnFeilds
      }));
      const updData = [...freeForm, ...newRows];
      updData.forEach((item, index) => {
        item.id = index + 1;
      });
      if(reset){
        setFreeformdata(newRows);
      } else {
        setFreeformdata(updData);
      }
    } else {
      const updData = [...freeForm, newRow];
      updData.forEach((item, index) => {
        item.id = index + 1;
      });
      if(reset){
        setFreeformdata([newRow]);
      } else {
        setFreeformdata(updData);
      }
    }
    // setFreeformdata([...freeForm, newRow]);
  };

  const handleCloneData = (data, ind) => {
    const arr = [];
    const filterData = data.filter(item => item.id === ind);

    for (let i = 0; i < data.length; i++) {
      if (i === ind - 1) {
        arr.push({ ...filterData[0] });
        arr.push({ ...filterData[0], id: filterData[0].id + 1 });
      } else if (i < ind - 1) {
        arr.push(data[i]);
      } else {
        arr.push({ ...data[i], id: data[i].id + 1 });
      }
    }
    setFreeformdata(arr);
  };
  const handleFocus = event => {
    const { target } = event;
    const { value } = target;
    // Move cursor to the end
    target.setSelectionRange(value.length, value.length);
  };

  const handleKeyDown = event => {
    const { key, target } = event;
    const { selectionStart, value } = target;

    // Disallow moving cursor except for the last digit
    if (
      (key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === "ArrowUp" ||
        key === "ArrowDown" ||
        key === "Home" ||
        key === "End") &&
      selectionStart !== value.length
    ) {
      event.preventDefault();
    }
  };
  // this is for child
  data?.component?.options?.mode === "DEFAULT" &&
    data?.child?.forEach(item => {
      columns.push({
        field: item.inputtable.sColumnID,
        headerName: item.inputtable.sHeader,
        width: item.inputtable.iWidth,
        editable: item.inputtable.bEditable,
        // description: item.sDescription,
        sortable: false,
        // valueGetter: item.sValue,
        renderCell: params => {
          if (item?.component.sType === "AUTOCOMPLETE") {
            // console.log(rows[params.row.id - 1],'kkiooaa');

            return (
              <AutoComplete
                textValue1={rows[params.row.id - 1]}
                formcallback={e => formcallback(e, params.row.id, item?.component?.sName)}
                data={item}
                rowsdataFree={
                  rows && rows[params.row.id - 1] && rows[params.row.id - 1][item?.component?.sName]
                }
                Automod={data?.component?.options?.mode}
                formaction={formAction}
                isSubmited={isSubmited}
                {...item?.component?.sProps}
              />
            );
          } else if (item?.component.sType === "TEXTFIELD") {
            return (
              <TextField
                name={item?.component?.sName}
                onChange={e => {
                  takeInput(e, params.row.id);
                  e.stopPropagation();
                }}
                value={
                  rows && rows[params.row.id - 1] && rows[params.row.id - 1][item?.component?.sName]
                }
                {...item?.component?.sProps}
                onKeyDown={event => {
                  event.stopPropagation();
                }}
              />
            );
          } else if (item?.component.sType === "DATETIME") {
            return (
              <DateComponent
                handledatechange={e => handledatachange(e, params.row.id, item?.component?.sName)}
                data={item}
                datavalue={
                  rows && rows[params.row.id - 1] && rows[params.row.id - 1][item?.component.sName]
                }
                datemod={data?.component?.options?.mode}
                datatextvalue=""
                formaction={formAction}
                {...item?.component?.sProps}
              />
            );
          } else if (item.component.sType === "CHECKBOX") {
            return (
              <CheckBoxComponent
                data={item}
                onChange={e => takeInput(e, params.row.id)}
                datacheckvalue={
                  rows && rows[params.row.id - 1] && rows[params.row.id - 1][item?.component.sName]
                }
                datemod={item?.component?.options?.mode}
                formactions={formAction}
                {...item?.component?.sProps}
              />
            );
          } else if (item?.component.sType === "SELECT") {
            return (
              <Grid item {...data?.grid_props}>
                <SelectMainComponent
                  setSelectAndAutocompleteSname={setSelectAndAutocompleteSname}
                  onChange={summaryHandler("summ_tax")}
                  onChildSelect={handleSelectChange()}
                  data={data}
                  selectTax={selectTax}
                  summaryId={"summ_tax"}
                  {...data?.component?.sProps}
                  taxUrl={item.sRoute}
                  handleClickOpen={handleClickOpen}
                />
              </Grid>
            );
          } else {
            return;
          }
        }
      });
    });
  const [isTextSelected, setIsTextSelected] = useState(false);
  const handleSelectionChange = event => {
    const { selectionStart, selectionEnd } = event.target;

    setIsTextSelected(selectionStart !== selectionEnd);
  };

  const handleSelectionBlur = event => {
    setIsTextSelected(false);
  };
  data?.component?.options?.mode === "FREEFORM" &&
    data?.child?.forEach(item => {
      /*eslint-disable no-undef*/
      // const addTodo = useMemo(() => {
      //   setAllfeildsNames(pre => ({
      //     ...pre,
      //     [item.inputtable.sColumnID]: item.component.sName,
      //     header: item.inputtable.sHeader
      //   }));
      //   setAllfeildsNames1(pre => ({
      //     ...pre,
      //     [item.inputtable.sColumnID]: item.component.sName
      //   }));

      //   setAllfeildsWithsType(pre => ({
      //     ...pre,
      //     [item.component.sName]: item.component.sType
      //   }));
      // }, [item]);

      const [isTextSelected, setIsTextSelected] = useState(false);
      const handleSelectionChange = event => {
        const { selectionStart, selectionEnd } = event.target;
        setIsTextSelected(selectionStart !== selectionEnd);
      };
      const handleSelectionBlur = event => {
        setIsTextSelected(false);
      };
      const handleFocus = event => {
        const { target, key } = event;
        const { value } = target;
        // Move cursor to the end
        if (!isTextSelected) {
          target.setSelectionRange(value.length, value.length);
        }
      };

      const handleNumerChange = (e, id) => {
        if (isTextSelected) {
          // alert(e.target.value[0])
          e.target.value =
            item?.component.iDecimalPlaces == 2
              ? "0.0" + e.target.value[e.target.value.length - 1]
              : e.target.value;
          setIsTextSelected(false);
        }
        FreeFormInput(e, id, "number", item?.component.iDecimalPlaces);
        //   takeInput(e, id, "CURRENCY", data?.inputType?.component.iDecimalPlaces);
      };

      function getKeyByValue(obj, value) {
        for (let key in obj) {
          if (obj[key] === value) {
            return value;
          }
        }
        return null;
      }

      function replaceSInventoryCode(uri, obj1, obj2) {
        let match = uri.match(/{(.*?)}/);
        let placeholder = match[1];
        let changedkey = getKeyByValue(obj2, placeholder);
        let changedData = obj1?.[changedkey];
        let newUri = uri?.replace(`{${placeholder}}`, changedData);
        return newUri;
      }

      function replacePlaceholders(uri, data) {
        if (uri) {
          const placeholderRegex = /{([^}]+)}/g;
          const replacedUri = uri?.replace(placeholderRegex, (match, placeholder) => {
            if (data.hasOwnProperty(placeholder)) {
              return data[placeholder];
            } else {
              return match;
            }
          });
          return replacedUri;
        }
      }

      /*eslint-enable no-undef*/
      // item?.inputtable?.bHidden == 0 &&
      item?.inputtable?.bVisible == "true" &&
        columns.push({
          field: item?.component?.sName,
          headerName: item.inputtable.sHeader,
          width: item.inputtable.iWidth,
          // editable: item.inputtable.bEditable,
          sortable: false,
          renderCell: params => {
            if (item?.component.sType === "VARVALUE") {
              const [updatedParamsRow, setUpdatedParamsRow] = useState();
              useEffect(() => {
                const row = JSON.parse(JSON.stringify(textValue));
                row[columnIdMapping.sInventoryCode] = params.row.sInventoryCode;
                setUpdatedParamsRow(row);
              }, [textValue, params.row.sInventoryCode])
             
              return (
                  <Grid item {...item?.grid_props}>
                    <VarValue data={item} textValue={updatedParamsRow} />
                  </Grid>
              );
            }
            if (item?.component.sType === "VARTEXT") {
              const styleFormatData = format?.data?.records?.find(
                item1 => item1?.sFieldName == item?.component?.sName 
                
              );
              const Icons = MUIICon[styleFormatData?.sStatusIcon];
              const parsedData = styleFormatData ? JSON.parse(styleFormatData?.sFieldFormat) : {};
              return (
                <>
                  {/* {JSON.stringify(format?.data?.records)} */}
                  <div
                    style={{ width: "100%" }}
                    id={
                      item?.component?.sName + "-" + item.inputtable.sColumnID + "-" + params.row.id
                    }
                  >
                    {/* {params.row.id - 1} */}
                    {/* {JSON.stringify(freeForm[0][item.component.sName])} */}
                    {/* {item?.inputtable?.bHidden == 0 ? ( */}
                      <Typography {...parsedData}>
                        {styleFormatData?.sStatusIcon && <Icons />}
                        {freeForm[params.row.id - 1]?.[item.component.sName]}
                      </Typography>
                    {/* ) : null} */}
                  </div>
                </>
              );
            }

            if(item?.component?.sType === "QUANTITY") {
              const editable = item.inputtable.bEditable == 0 ? true : false;
              // console.log(isDisabledTable == false ? editable : isDisabledTable,'kkkki');
              const val = useMemo(() => {
                if (freeForm && freeForm[params.row.id - 1]?.[item?.component?.sName] !== "") {
                  return handlePointChange1(
                    freeForm[params.row.id - 1]?.[item?.component?.sName]?.toString(),
                    item?.component.iDecimalPlaces
                  );
                }
              }, [freeForm]);

              setConversionNamesMapping((prev) => {
                if(!prev.hasOwnProperty(item?.component?.sName)){
                  return {...prev, [item?.component?.sName]: item?.component?.sConversionName}
                }
                return prev;
              })

              const [selectedValue, setSelectedValue] = useState();
              const [quantitySelectOptions, setquantitySelectOptions] = useState([]);

              useEffect(() => {
                if(quantitySelectOptions && quantitySelectOptions.length > 0 && !selectedValue){
                  const index = quantitySelectOptions.findIndex((qty) => qty.id == params.row.id);
                  if(index !== -1){
                    setSelectedValue(quantitySelectOptions[index]?.data?.[0]?.[item?.data?.sValueField])
                  }
                }
              }, [quantitySelectOptions.length])
              console.log("khfwbwbhewbew", quantitySelectOptions);

              useEffect(() => {
                // Define an async function to fetch data
                const fetchData = async () => {
                  let uri =
                    serverAddress +
                    replaceSInventoryCode(
                      item?.data?.sDataSource,
                      params.row,
                      allFeildForDoucmentSelect
                    );
            
                  try {
                    const inventoryCodeMatch = uri.match(/inventorycode=([^&]*)/);
                    const inventoryCode = inventoryCodeMatch ? decodeURIComponent(inventoryCodeMatch[1]).replace(/'/g, '') : null;
                    if(inventoryCode){
                      const response = await axios.get(uri, {
                        headers: {
                          Authorization: `Bearer ${token}`
                          // Other headers if needed
                        }
                      });
                      setquantitySelectOptions((prev) => {
                        const existingIndex = prev.findIndex((item) => item.id === params.row.id);
                        if (existingIndex !== -1) {
                          const updatedOptions = [...prev];
                          updatedOptions[existingIndex] = {
                            ...updatedOptions[existingIndex],
                            data: response.data.data.records,
                          };
                          return updatedOptions;
                        } else {
                          return [...prev, { id: params.row.id, data: response.data.data.records }];
                        }
                      });
                    }
                  } catch (error) {
                    // Set error if the API call fails
                    // setError(error);
                  } finally {
                    // Set loading to false once the request is complete
                    // setLoading(false);
                  }
                };
            
                // Call the async function
                fetchData();
              }, [
                params?.row?.[
                  getKeyByValue(
                    allFeildForDoucmentSelect,
                    item?.data?.sDataAware.replace(/[{}]/g, "")
                  )
                ]
              ]);

              const qtyIndex = quantitySelectOptions?.findIndex((qty) => qty.id == params.row.id);

              const handleChange = e => {
                setSelectedValue(e.target.value);
                const conversion = quantitySelectOptions[qtyIndex]?.data?.filter((prev) => prev.sRelativeUnitCode == e.target.value)[0]?.sConversion;
                const index = freeForm.findIndex((prev) => prev.id == params.row.id);
                const list = [...freeForm];
                list[index]["qtySelect"] = e.target.value;
                list[index][conversionNamesMapping[e.target.name]] = `${e.target.value}:${conversion}`;
                setFreeformdata(list);
              };
              return (
                <>
                  {item?.inputtable?.bVisible == "true" ? (
                      <div
                        style={{ width: "100%" }}
                        id={`${item?.component?.sName}-${item.inputtable.sColumnID}-${params.row.id}`}
                      >
                        <TextField
                          id={`${item?.component?.sName}-${params.row.id}`}
                          name={item?.component?.sName}
                          inputProps={{ style: { textAlign: item?.component?.sJustify } }}
                          onChange={e => handleNumerChange(e, params.row.id)}
                          disabled={isDisabledTable == false ? editable : isDisabledTable}
                          value={
                            freeForm[params.row.id - 1]?.[item?.component?.sName] == ""
                              ? freeForm[params.row.id - 1]?.[item?.component?.sName]
                              : val
                          }
                          {...item?.component?.sProps}
                          {...item?.component?.options?.others1}
                          onKeyDown={handleFocus}
                          onFocus={handleFocus}
                          onBlur={handleSelectionBlur}
                          onSelect={handleSelectionChange}
                          error={
                            getErrorDetails(freeFormError, params.row.id)[item?.component?.sName]
                          }
                          placeholder={item?.component?.sPlaceHolder}
                          helperText={
                            getErrorDetails(freeFormError, params.row.id)[item?.component?.sName] ||
                            item?.component?.sHelper
                          }
                          label={item?.component?.sLabel}
                          InputProps={
                            item?.component?.sAdornPosition?.toLowerCase() === "start"
                              ? {
                                  startAdornment: (
                                    <>
                                      {item?.component?.sAdornPosition &&
                                        item?.component?.sAdornType.toLowerCase() === "icon" && (
                                          <InputAdornment
                                            position={item?.component?.sAdornPosition}
                                          >
                                            <Icon iconName={item?.component?.sIcon} />
                                          </InputAdornment>
                                        )}
                                      {item?.component?.sAdornPosition &&
                                        item?.component?.sAdornType.toLowerCase() === "text" && (
                                          <InputAdornment
                                            position={item?.component?.sAdornPosition}
                                          >
                                            {item?.component?.sIcon}
                                          </InputAdornment>
                                        )}
                                    </>
                                  )
                                }
                              : {
                                  endAdornment: (
                                    <>
                                      {item?.component?.sAdornPosition &&
                                        item?.component?.sAdornType.toLowerCase() === "icon" && (
                                          <InputAdornment
                                            position={item?.component?.sAdornPosition}
                                          >
                                            <Icon iconName={item?.component?.sIcon} />
                                          </InputAdornment>
                                        )}
                                      {item?.component?.sAdornPosition &&
                                        item?.component?.sAdornType.toLowerCase() === "text" && (
                                          <InputAdornment
                                            position={item?.component?.sAdornPosition}
                                          >
                                            {item?.component?.sIcon}
                                          </InputAdornment>
                                        )}
                                    </>
                                  )
                                }
                          }
                        />
                      </div>
                  ) : null}
                  {/* Select */}
                  {console.log("jwnqfkjebwkjfwe", item)}
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Select Option</InputLabel>
                    <Select
                      id={`${item?.component?.sName}-type-${id}`}
                      value={selectedValue}
                      labelId="demo-simple-select-label"
                      name={item?.component?.sName}
                      label="Select Option"
                      onChange={handleChange}
                      {...item?.component?.sProps}
                    >
                      {quantitySelectOptions[qtyIndex]?.data?.map(qty => {
                        return (
                          <MenuItem value={qty[item?.data?.sValueField]}>
                            <div
                              component="span"
                              style={{ width: "100%" }}
                              dangerouslySetInnerHTML={{
                                __html:
                                qty && qty != "" && Object.keys(qty).length !== 0
                                    ? vsprintf(
                                      item?.data?.sDisplayFormat,
                                      replacePlaceholders(item?.data?.sDisplayField, qty)
                                        ?.replace(/[{}]/g, "")
                                        ?.split(",")
                                    )
                                    : ""
                              }}
                            />
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </>
              )
            }
            if (item?.component.sType === "VARNUMBER") {
              return (<>
              {/* {freeForm[params.row.id - 1]?.[item.component.sName]} */}
              <VARNUMBER data={item} value=  {freeForm[params.row.id - 1]?.[item.component.sName]}/>
              </>)
            }
            if (item?.component.sType === "NUMBER") {
              const editable = item.inputtable.bEditable == 0 ? true : false;
              // console.log(isDisabledTable == false ? editable : isDisabledTable,'kkkki');
              const val = useMemo(() => {
                if (freeForm && freeForm[params.row.id - 1]?.[item.component.sName] !== "") {
                  return handlePointChange1(
                    freeForm[params.row.id - 1]?.[item.component.sName]?.toString(),
                    item?.component.iDecimalPlaces
                  );
                }
              }, [freeForm]);
              return (
                <>
                  {item?.inputtable?.bVisible == "true" ? (
                    <>
                      {/* {item?.component?.sAdornPosition} */}
                      <div
                        style={{ width: "100%" }}
                        id={
                          item?.component?.sName +
                          "-" +
                          item.inputtable.sColumnID +
                          "-" +
                          params.row.id
                        }
                      >
                        <TextField
                          id={`${item?.component?.sName}-${params.row.id}`}
                          name={item?.component?.sName}
                          inputProps={{ style: { textAlign: item?.component?.sJustify } }}
                          onChange={e => handleNumerChange(e, params.row.id)}
                          disabled={isDisabledTable == false ? editable : isDisabledTable}
                          value={
                            freeForm[params.row.id - 1]?.[item.component.sName] == ""
                              ? freeForm[params.row.id - 1]?.[item.component.sName]
                              : val
                          }
                          {...item?.component?.sProps}
                          {...item?.component?.options?.others1}
                          onKeyDown={handleFocus}
                          onFocus={handleFocus}
                          onBlur={handleSelectionBlur}
                          onSelect={handleSelectionChange}
                          error={
                            getErrorDetails(freeFormError, params.row.id)[item?.component?.sName]
                          }
                          placeholder={item?.component?.sPlaceHolder}
                          helperText={
                            getErrorDetails(freeFormError, params.row.id)[item?.component?.sName] ||
                            item?.component?.sHelper
                          }
                          label={item?.component?.sLabel}
                          InputProps={
                            item?.component?.sAdornPosition?.toLowerCase() === "start"
                              ? {
                                  startAdornment: (
                                    <>
                                      {item?.component?.sAdornPosition &&
                                        item?.component?.sAdornType.toLowerCase() === "icon" && (
                                          <InputAdornment
                                            position={item?.component?.sAdornPosition}
                                          >
                                            <Icon iconName={item?.component?.sIcon} />
                                          </InputAdornment>
                                        )}
                                      {item?.component?.sAdornPosition &&
                                        item?.component?.sAdornType.toLowerCase() === "text" && (
                                          <InputAdornment
                                            position={item?.component?.sAdornPosition}
                                          >
                                            {item?.component?.sIcon}
                                          </InputAdornment>
                                        )}
                                    </>
                                  )
                                }
                              : {
                                  endAdornment: (
                                    <>
                                      {item?.component?.sAdornPosition &&
                                        item?.component?.sAdornType.toLowerCase() === "icon" && (
                                          <InputAdornment
                                            position={item?.component?.sAdornPosition}
                                          >
                                            <Icon iconName={item?.component?.sIcon} />
                                          </InputAdornment>
                                        )}
                                      {item?.component?.sAdornPosition &&
                                        item?.component?.sAdornType.toLowerCase() === "text" && (
                                          <InputAdornment
                                            position={item?.component?.sAdornPosition}
                                          >
                                            {item?.component?.sIcon}
                                          </InputAdornment>
                                        )}
                                    </>
                                  )
                                }
                          }
                        />
                      </div>
                    </>
                  ) : null}
                </>
              );
            }
            if (item?.component.sType === "AUTOCOMPLETE") {
              const editable = item.inputtable.bEditable == 0 ? true : false;
              setColumnIdMapping((prev) => {
                if(!prev[item?.component?.sName]){
                  return {...prev, [item?.component?.sName]: item.inputtable.sColumnID}
                }
                return prev;
              })
              return item?.inputtable?.bVisible == "true" ? (
                <>
                  {/* {JSON.stringify(typeof item?.inputtable?.bVisible.toLowerCase())} */}

                  <div
                    style={{ width: "100%" }}
                    id={
                      item?.component?.sName + "-" + item.inputtable.sColumnID + "-" + params.row.id
                    }
                  >
                    <AutoComplete
                      formcallback={(e, data, itemObj) =>
                        FreeFormCallBack(
                          e,
                          params?.row.id,
                          item?.component?.sName,
                          itemObj,
                          item.sMapping
                        )
                      }
                      data={item}
                      errors={getErrorDetails(freeFormError, params.row.id)[item?.component?.sName]}
                      textValue1={freeForm[params.row.id - 1]}
                      placeholder={item?.component?.sPlaceHolder}
                      rowsdataFree={
                        freeForm &&
                        freeForm[params.row.id - 1] &&
                        freeForm[params.row.id - 1][item?.component?.sName]
                      }
                      Automod={data?.component?.options?.mode}
                      formaction={formAction}
                      isDisabledTable={editable}
                      isSubmited={isSubmited}
                      {...item?.component?.sProps}
                    />
                  </div>
                </>
              ) : null;
            } else if (item?.component.sType === "TEXTFIELD") {
              const editable = item.inputtable.bEditable == 0 ? true : false;

              return item?.inputtable?.bVisible == "true" ? (
                <div
                  style={{ width: "100%" }}
                  id={
                    item?.component?.sName + "-" + item.inputtable.sColumnID + "-" + params.row.id
                  }
                >
                  <TextField
                    placeholder={item?.component?.sPlaceHolder}
                    name={item?.component?.sName}
                    helperText={
                      getErrorDetails(freeFormError, params.row.id)[item?.component?.sName] ||
                      item?.component?.sHelper
                    }
                    label={item?.component?.sLabel}
                    disabled={editable}
                    error={getErrorDetails(freeFormError, params.row.id)[item?.component?.sName]}
                    onChange={e => {
                      FreeFormInput(e, params.row.id);
                      e.stopPropagation();
                    }}
                    value={
                      freeForm &&
                      freeForm[params.row.id - 1] &&
                      freeForm[params.row.id - 1][item.component.sName]
                    }
                    onKeyDown={event => {
                      event.stopPropagation();
                    }}
                    InputProps={
                      item?.component?.sAdornPosition?.toLowerCase() === "start"
                        ? {
                            startAdornment: (
                              <>
                                {item?.component?.sAdornPosition &&
                                  item?.component?.sAdornType.toLowerCase() === "icon" && (
                                    <InputAdornment position={item?.component?.sAdornPosition}>
                                      <Icon iconName={item?.component?.sIcon} />
                                    </InputAdornment>
                                  )}
                                {item?.component?.sAdornPosition &&
                                  item?.component?.sAdornType.toLowerCase() === "text" && (
                                    <InputAdornment position={item?.component?.sAdornPosition}>
                                      {item?.component?.sIcon}
                                    </InputAdornment>
                                  )}
                              </>
                            )
                          }
                        : {
                            endAdornment: (
                              <>
                                {item?.component?.sAdornPosition &&
                                  item?.component?.sAdornType.toLowerCase() === "icon" && (
                                    <InputAdornment position={item?.component?.sAdornPosition}>
                                      <Icon iconName={item?.component?.sIcon} />
                                    </InputAdornment>
                                  )}
                                {item?.component?.sAdornPosition &&
                                  item?.component?.sAdornType.toLowerCase() === "text" && (
                                    <InputAdornment position={item?.component?.sAdornPosition}>
                                      {item?.component?.sIcon}
                                    </InputAdornment>
                                  )}
                              </>
                            )
                          }
                    }
                    {...item?.component?.sProps}
                  />
                </div>
              ) : null;
            } else if (item?.component.sType === "DATETIME") {
              const editable = item.inputtable.bEditable == 0 ? true : false;
              return item?.inputtable?.bVisible == "true" ? (
                <div
                  style={{ width: "100%" }}
                  id={
                    item?.component?.sName + "-" + item.inputtable.sColumnID + "-" + params.row.id
                  }
                >
                  <DateComponent
                    disabled={editable}
                    handledatechange={e =>
                      handledatachange(e, params.row.id, item?.component?.sName)
                    }
                    data={item}
                    placeholder={item?.component?.sPlaceHolder}
                    datavalue={
                      freeForm &&
                      freeForm[params.row.id - 1] &&
                      freeForm[params.row.id - 1][item?.component.sName]
                    }
                    datemod={data?.component?.options?.mode}
                    datatextvalue=""
                    formaction={formAction}
                    {...item?.component?.sProps}
                  />
                </div>
              ) : null;
            } else if (item?.component.sType === "CHECKBOX") {
              return item?.inputtable?.bVisible == "true" ? (
                <div
                  style={{ width: "100%" }}
                  id={
                    item?.component?.sName + "-" + item.inputtable.sColumnID + "-" + params.row.id
                  }
                >
                  <CheckBoxComponent
                    data={item}
                    handleCheckbox={e => handledatachange(e, params.row.id, item?.component?.sName)}
                    datacheckvalue={
                      freeForm &&
                      freeForm[params.row.id - 1] &&
                      freeForm[params.row.id - 1][item?.component.sName]
                    }
                    datemod={data?.component?.options?.mode}
                    formactions={formAction}
                    {...item?.component?.sProps}
                  />
                </div>
              ) : null;
            } else if (item?.component.sType === "SELECT") {
              // console.log(item,'component5666');

              const editable = item.inputtable.bEditable == 0 ? true : false;
              // alert(isDisabledTable == false? editable: isDisabledTable)

              const handleCustomChange = (e, params, itemObj) => {
                let mapfeild = {};

                if (item?.sMapping && Object.keys(item?.sMapping).length > 0) {
                  const keys = Object.keys(item?.sMapping);
                  const values = Object.values(item?.sMapping);

                  for (let i = 0; i < keys.length; i++) {
                    const obj = {
                      ["name" + [i + 1]]: values[i],
                      ["value" + [i + 1]]: itemObj[keys[i]]
                    };
                    mapfeild = { ...mapfeild, ...obj };
                  }
                }
                // e.target ={...mapfeild}
                // const customEvent = {
                //   target: {
                //     ...e.target,
                //     ...mapfeild
                //   }
                // };
                // alert(JSON.stringify(customEvent))
                handledatachange(e, params.row.id, item?.component?.sName, mapfeild);
              };

              return item?.inputtable?.bVisible == "true" ? (
                <div
                  style={{ width: "100%" }}
                  id={
                    item?.component?.sName + "-" + item.inputtable.sColumnID + "-" + params.row.id
                  }
                >
                  <Grid item {...data?.grid_props}>
                    {/* {JSON.stringify(item?.sMapping)} */}
                    {/* <FormControl {...item?.component?.options?.others1}> */}
                    <SelectMainComponent
                      isDisabledTable={isDisabledTable == false ? editable : isDisabledTable}
                      textValue={
                        freeForm && freeForm[params.row.id - 1] && freeForm[params.row.id - 1]
                      }
                      handledatasend={(e, obj) => handleCustomChange(e, params, obj)}
                      taxUrlFree={item?.data?.sDataSource}
                      sColumnID={item?.component?.sName}
                      errors={
                        getErrorDetails(freeFormError, params.row.id)?.[item?.component?.sName]
                      }
                      data={item}
                      {...item?.component?.sProps}
                      {...item?.component?.options?.others1}
                      datemod={data?.component?.options?.mode}
                      formaction={formAction}
                      selectEdit={
                        freeForm &&
                        freeForm[params.row.id - 1] &&
                        freeForm[params.row.id - 1][item?.component?.sName]
                      }
                      isSubmited={isSubmited}
                      handleClickOpen={handleClickOpen2}
                      setSelectAndAutocompleteSname={setSelectAndAutocompleteSname}
                    />
                    {/* </FormControl> */}
                  </Grid>
                </div>
              ) : null;
            } else {
              return;
            }
          }
        });
    });

  data?.fixcolumns?.forEach((item, ind) => {
    switch (item.sColumnID) {
      case "col_column1":
        (item?.bVisible == "true" || item?.bVisible == "!false") &&
          columns.push({
            field: item.sColumnID,
            headerName: item.sHeader,
            width: item.iWidth,
            // editable: item.bEditable,
            type: item.sType,
            sortable: true,
            renderCell: params => {
              const editable = item.bEditable == 0 ? true : false;
              // console.log(isDisabledTable == false ? editable : isDisabledTable,'kkkki');
              const val = useMemo(() => {
                if (freeForm[findIndexById(params.row.id)]?.[item.sColumnID] !== "") {
                  return handlePointChange1(
                    freeForm[findIndexById(params.row.id)]?.[item.sColumnID]?.toString(),
                    item?.inputType?.component?.iDecimalPlaces
                  );
                }
              }, [freeForm]);

              function findIndexById(id) {
                return freeForm.findIndex(item => item.id === id);
              }

              const handleNumerChange = (e, id) => {
                if (isTextSelected) {
                  // alert(e.target.value[0])
                  e.target.value =
                    item?.inputType?.component.iDecimalPlaces == 2
                      ? "0.0" + e.target.value[e.target.value.length - 1]
                      : e.target.value;
                  setIsTextSelected(false);
                }
                FreeFormInput(e, id, "number", item?.inputType?.component.iDecimalPlaces);
                //   takeInput(e, id, "CURRENCY", data?.inputType?.component.iDecimalPlaces);
              };
              return (
                <>
                  {/* {item?.inputType?.component?.sName} */}
                  {/* {params.row.id}----
{JSON.stringifsy(freeForm[findIndexById(params.row.id)]?.[item.sColumnID])} */}
                  <TextField
                    id={`${item?.inputType?.component?.sName}-${params.row.id}`}
                    name={item.sColumnID}
                    inputProps={{ style: { textAlign: item?.inputType?.component?.sJustify } }}
                    onChange={e => {
                      handleNumerChange(e, params.row.id);
                    }}
                    disabled={isDisabledTable == false ? editable : isDisabledTable}
                    value={
                      freeForm[findIndexById(params.row.id)]?.[item.sColumnID] == ""
                        ? freeForm[findIndexById(params.row.id)]?.[item.sColumnID]
                        : val
                    }
                    {...item?.inputType?.component?.sProps}
                    {...item?.inputType?.component?.options?.others1}
                    onKeyDown={handleFocus}
                    onFocus={handleFocus}
                    onBlur={handleSelectionBlur}
                    onSelect={handleSelectionChange}
                    placeholder={item?.inputType?.component?.sPlaceHolder}
                    helperText={item?.inputType?.component?.sHelper}
                    label={item?.inputType?.component?.sLabel}
                    InputProps={
                      item?.inputType?.component?.sAdornPosition?.toLowerCase() === "start"
                        ? {
                            startAdornment: (
                              <>
                                {item?.inputType?.component?.sAdornPosition &&
                                  item?.inputType?.component?.sAdornType.toLowerCase() ===
                                    "icon" && (
                                    <InputAdornment position={item?.component?.sAdornPosition}>
                                      <Icon iconName={item?.inputType?.component?.sIcon} />
                                    </InputAdornment>
                                  )}
                                {item?.component?.sAdornPosition &&
                                  item?.component?.sAdornType.toLowerCase() === "text" && (
                                    <InputAdornment position={item?.component?.sAdornPosition}>
                                      {item?.inputType?.component?.sIcon}
                                    </InputAdornment>
                                  )}
                              </>
                            )
                          }
                        : {
                            endAdornment: (
                              <>
                                {item?.inputType?.component?.sAdornPosition &&
                                  item?.inputType?.component?.sAdornType.toLowerCase() ===
                                    "icon" && (
                                    <InputAdornment
                                      position={item?.inputType?.component?.sAdornPosition}
                                    >
                                      <Icon iconName={item?.inputType?.component?.sIcon} />
                                    </InputAdornment>
                                  )}
                                {item?.inputType?.component?.sAdornPosition &&
                                  item?.inputType?.component?.sAdornType.toLowerCase() ===
                                    "text" && (
                                    <InputAdornment
                                      position={item?.inputType?.component?.sAdornPosition}
                                    >
                                      {item?.inputType?.component?.sIcon}
                                    </InputAdornment>
                                  )}
                              </>
                            )
                          }
                    }
                  />
                </>
              );
            }
          });
        break;
      case "col_column2":
        (item?.bVisible == "true" || item?.bVisible == "!false") &&
          columns.push({
            field: item.sColumnID,
            headerName: item.sHeader,
            width: item.iWidth,
            // editable: item.bEditable,
            type: item.sType,
            sortable: true,
            renderCell: params => {
              const editable = item.bEditable == 0 ? true : false;
              // console.log(isDisabledTable == false ? editable : isDisabledTable,'kkkki');
              const val = useMemo(() => {
                if (freeForm && freeForm[params.row.id - 1]?.[item.sColumnID] !== "") {
                  return handlePointChange1(
                    freeForm[params.row.id - 1]?.[item.sColumnID]?.toString(),
                    item?.inputType?.component?.iDecimalPlaces
                  );
                }
              }, [freeForm]);

              return (
                <>
                  {/* {item?.inputType?.component?.sName} */}

                  <TextField
                    id={`${item?.inputType?.component?.sName}-${params.row.id}`}
                    name={item.sColumnID}
                    inputProps={{ style: { textAlign: item?.inputType?.component?.sJustify } }}
                    onChange={e => {
                      FreeFormInput(
                        e,
                        params.row.id,
                        "number",
                        item?.inputType?.component.iDecimalPlaces
                      );
                    }}
                    disabled={isDisabledTable == false ? editable : isDisabledTable}
                    value={
                      freeForm[params.row.id - 1]?.[item.sColumnID] == ""
                        ? freeForm[params.row.id - 1]?.[item.sColumnID]
                        : val
                    }
                    {...item?.inputType?.component?.sProps}
                    {...item?.inputType?.component?.options?.others1}
                    onKeyDown={handleFocus}
                    onFocus={handleFocus}
                    placeholder={item?.inputType?.component?.sPlaceHolder}
                    helperText={item?.inputType?.component?.sHelper}
                    label={item?.inputType?.component?.sLabel}
                    InputProps={
                      item?.inputType?.component?.sAdornPosition?.toLowerCase() === "start"
                        ? {
                            startAdornment: (
                              <>
                                {item?.inputType?.component?.sAdornPosition &&
                                  item?.inputType?.component?.sAdornType.toLowerCase() ===
                                    "icon" && (
                                    <InputAdornment position={item?.component?.sAdornPosition}>
                                      <Icon iconName={item?.inputType?.component?.sIcon} />
                                    </InputAdornment>
                                  )}
                                {item?.component?.sAdornPosition &&
                                  item?.component?.sAdornType.toLowerCase() === "text" && (
                                    <InputAdornment position={item?.component?.sAdornPosition}>
                                      {item?.inputType?.component?.sIcon}
                                    </InputAdornment>
                                  )}
                              </>
                            )
                          }
                        : {
                            endAdornment: (
                              <>
                                {item?.inputType?.component?.sAdornPosition &&
                                  item?.inputType?.component?.sAdornType.toLowerCase() ===
                                    "icon" && (
                                    <InputAdornment
                                      position={item?.inputType?.component?.sAdornPosition}
                                    >
                                      <Icon iconName={item?.inputType?.component?.sIcon} />
                                    </InputAdornment>
                                  )}
                                {item?.inputType?.component?.sAdornPosition &&
                                  item?.inputType?.component?.sAdornType.toLowerCase() ===
                                    "text" && (
                                    <InputAdornment
                                      position={item?.inputType?.component?.sAdornPosition}
                                    >
                                      {item?.inputType?.component?.sIcon}
                                    </InputAdornment>
                                  )}
                              </>
                            )
                          }
                    }
                  />
                </>
              );
            }
          });
        break;
      default:
        item?.bHidden == 0 &&
          columns.push({
            field: item.sColumnID,
            headerName: item.sHeader,
            width: item.iWidth,
            editable: item.bEditable,
            type: item.sType,
            sortable: true,
            renderCell: params => (
              <>eee{InputTableDefaultAllComponent(item)}</>
              // <TextField
              //   name={item.sColumnID}
              //   onChange={e => takeInput(e, params.row.id)}
              //   variant="outlined"
              //   size="small"
              // />
            )
          });
        break;
    }
  });

  data?.component?.options?.mode === "DEFAULT" &&
    columns.push({
      field: "",
      headerName: " ",
      width: 80,
      sortable: false,
      disableColumnMenu: true,
      renderCell: params => {
        const handleDelete = () => {
          const newRows = rows?.filter(row => row.id !== params.row.id);
          setRows(newRows);
        };
        if (params.row.id === 1) {
          return (
            <>
              <IconButton disabled aria-label="delete">
                <RemoveCircleOutlineIcon />
              </IconButton>
              <IconButton onClick={e => handleAddRow(e)} aria-label="delete">
                <AddCircleOutlineSharpIcon />
              </IconButton>
            </>
          );
        }
        return (
          <>
            <IconButton onClick={handleDelete} aria-label="delete">
              <RemoveCircleOutlineIcon />
            </IconButton>
            <IconButton onClick={e => handleAddRow(e)} aria-label="delete">
              <AddCircleOutlineSharpIcon />
            </IconButton>
          </>
        );
      }
    });

  if (
    data?.component?.options?.enableRowDelete ||
    data?.component?.options?.enableRowClone ||
    data?.component?.options?.enableRowAdd
  ) {
    if (data?.component?.options?.mode === "FREEFORM") {
      columns.push({
        field: "actions",

        headerName: "Actions",
        width: 150,
        sortable: false,
        disableColumnMenu: true,
        renderCell: params => {
          const handleDelete1 = id => {
            const newRows = freeForm?.filter(row => row.id !== id);
            newRows?.forEach((field, index) => {
              field.id = index + 1;
            })
            setFreeformdata(newRows);
            // alert(JSON.stringify(newRows));
            if (freeForm.length == 1) {
              const filteredComponents = filterComponentsRecursive(mainFormData.details);
              const tableData = getDataByType("INPUTTABLE", filteredComponents);

              const existingIndex = tableData?.filter(
                item => item.sInputTableName === data?.component?.sName
              );

              // if (existingIndex[0]?.tabledetails && existingIndex[0]?.tabledetails.length >= 1 ) {
              //   setFreeformdata([{ id: 1,...existingIndex[0]?.tabledetails[0]}]);
              // }
              // delete existingIndex[0]?.tabledetails[0].id

              const newRow = {
                id: freeForm.length + 1,
                ...existingIndex[0]?.tabledetails[0],
                ...fixedColumnFeilds
              };

              const updData = [...newRows, newRow];
              updData.forEach((item, index) => {
                item.id = index + 1;
              });

              setFreeformdata(updData);
            }
          };

          if (params.row.id === 1) {
            return (
              <>
                {data?.component?.options?.enableRowAdd && (
                  <IconButton
                    id={data.component.sName + "-add-" + params.row.id}
                    onClick={e => handleAddRow1(e)}
                    aria-label="add"
                  >
                    <AddCircleOutlineSharpIcon />
                  </IconButton>
                )}
                {data?.component?.options?.enableRowClone && (
                  <IconButton
                    onClick={e => handleCloneData(freeForm, params.row.id)}
                    aria-label="clone"
                    id={data.component.sName + "-clone-" + params.row.id}
                  >
                    <MoveDownIcon />
                  </IconButton>
                )}
                {data?.component?.options?.enableRowDelete && (
                  <IconButton
                    id={data.component.sName + "-delete-" + params.row.id}
                    onClick={() => handleDelete1(params.row.id)}
                    aria-label="delete"
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                )}
              </>
            );
          } else {
            return (
              <>
                {data?.component?.options?.enableRowAdd && (
                  <IconButton
                    id={data.component.sName + "-add-" + params.row.id}
                    onClick={e => handleAddRow1(e)}
                    aria-label="add"
                  >
                    <AddCircleOutlineSharpIcon />
                  </IconButton>
                )}
                {data?.component?.options?.enableRowClone && (
                  <IconButton
                    id={data.component.sName + "-clone-" + params.row.id}
                    onClick={e => handleCloneData(freeForm, params.row.id)}
                    aria-label="clone"
                  >
                    <MoveDownIcon />
                  </IconButton>
                )}
                {data?.component?.options?.enableRowDelete && (
                  <IconButton
                    id={data.component.sName + "-delete-" + params.row.id}
                    onClick={() => handleDelete1(params.row.id)}
                    aria-label="delete"
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                )}
              </>
            );
          }
        }
      });
    }
  }

  const options = [
    { key: "1x", value: 1 },
    { key: "5x", value: 5 },
    { key: "10x", value: 10 },
    { key: "15x", value: 15 },
    { key: "20x", value: 20 }
  ];

  function moveItemToZerothIndex(arr, field, col_item) {
    const index = arr.findIndex(item => item[field] === col_item);
    if (index > -1) {
      const [removed] = arr.splice(index, 1);
      arr.unshift(removed);
    }
    return arr;
  }

  // Example usage:

  moveItemToZerothIndex(columns, "field", "col_item");
  /*eslint-disable no-undef*/
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  /*eslint-enable no-undef*/
  const handleClick2 = event => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl1(null);
  };
  const open1 = Boolean(anchorEl1);
  const id = open1 ? "simple-popover" : undefined;

  function transformData(data, allFields, mappingFields, ind = 2) {
    return data.map((item, index) => {
      let transformedItem = { id: index + 1 };

      // Copy all fields and values from allFields
      Object.entries(allFields).forEach(([key, value]) => {
        transformedItem[key] = value;
      });

      // Change the values of fields in mappingFields
      mappingFields.forEach(field => {
        if (item[field]) {
          transformedItem[field] = item[field];
        }
      });

      return transformedItem;
    });
  }

  function heraferidatauseEffect(matchfeild, allfeild, receivdata) {
    const arr = [];
    for (let i = 0; i < receivdata.length; i++) {
      // console.log(matchfeild,allfeild,'hero');
      let allFeildKeys = Object.keys(allfeild);
      let allFeildValues = Object.values(allfeild);
      let row = { id: i + 1 };
      allFeildKeys.map((elm, ind) => {
        return (row[allFeildValues[ind]] = receivdata[i][allFeildValues[ind]] || "");
      });

      let matchKey = Object.keys(matchfeild);
      let rowKey = Object.keys(receivdata[i]);
      const matchedElements = {};
      matchKey.forEach(item => {
        if (rowKey.includes(item)) {
          matchedElements[matchfeild[item]] = receivdata[i][item];
        }
      });
      arr.push(row);
      //  alert(JSON.stringify(arr));
    }

    return arr;
  }

  function heraferidata(matchfeild, allfeild, receivdata) {
    const arr = [];
    for (let i = 0; i < receivdata.length; i++) {
      let row = {};
      let matchKey = Object.keys(matchfeild);
      let rowKey = Object.keys(receivdata[i]);
      const matchedElements = {};
      matchKey.forEach(item => {
        if (rowKey.includes(item)) {
          matchedElements[matchfeild[item]] = receivdata[i][item];
        }
      });

      const replacedObject = replaceKeys(i, matchedElements, allfeild);
      arr.push(replacedObject);
    }
    return arr;
  }

  function replaceKeys(i, obj, allfeild) {
    const newObj = { id: i + 1 };
    for (const key in obj) {
      if (allfeild[key]) {
        newObj[allfeild[key]] = obj[key];
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }

  // Example usage
  async function hanldeGetDataFromElipsis(uri, type, mappingFeilds) {
    try {
      setLoading(true);
      const response = await axios.get(serverAddress + uri, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      });

      const filteredComponents = filterComponentsRecursive(mainFormData.details);
      // alert(JSON.stringify(filteredComponents))
      const tableData = getDataByType("INPUTTABLE", filteredComponents);
      const existingIndex = tableData?.filter(
        item => item.sInputTableName === data?.component?.sName
      );
      const newRow = {
        ...existingIndex[0]?.tabledetails[0]
      };
      const matchedFields = newRow;
      // const mappingFields = [...Object.keys(data?.component?.defaultLoad?.sMapping)];
      if (type == "useEffect") {
        // let transformedData = transformData(
        //   response?.data?.data?.records,
        //   matchedFields,
        //   mappingFields,
        //   1
        // );

        const newFreeData = heraferidata(
          { ...matchedFields, ...mappingFeilds },
          allfeildsNames,
          response?.data?.data?.records
        );
        const newData3 = [];
        for (let i = 0; i < newFreeData.length; i++) {
          newData3.push({ ...matchedFields, ...newFreeData[i] });
        }
        // alert(JSON.stringify(newData3));
        setFreeformdata(newData3);
      } else {
        // let transformedData = transformData(
        //   response?.data?.data?.records,
        //   matchedFields,
        //   mappingFields
        // );
        const newFreeData = heraferidata(
          { ...matchedFields, ...mappingFeilds },
          allfeildsNames,
          response?.data?.data?.records
        );
        const newData3 = [];
        for (let i = 0; i < newFreeData.length; i++) {
          newData3.push({ ...matchedFields, ...newFreeData[i] });
        }

        setFreeformdata(newData3);

        // setFreeformdata(pre => [...pre, ...transformedData]);
        // setFreeformdata(transformedData);
      }
      setLoading(false);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }

  const [selectedLoadfromFile, setSelectedLoadfromFile] = useState();
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  // alert(JSON.stringify(freeFormValidation))
  const validateData = () => {
    // const returnData =  freeForm.map((textValue)=>{
    //   const errors = globalvalidateTextField(textValue, freeFormValidation);
    //   setfreeFormError(errors)
    //   return isEmpty(errors)
    //  })

    const returnData = freeForm.map(textValue => {
      // alert(JSON.stringify(freeFormValidation))
      const errors = globalvalidateTextField(textValue, freeFormValidation);
      // alert(JSON.stringify(errors))

      const index = freeFormError.findIndex(row => row?.id == textValue?.id);

      if (index != -1) {
        const newData = JSON.parse(JSON.stringify(freeFormError));
        newData[index] = { ...errors, id: textValue?.id };
        setfreeFormError(newData);
      } else {
        setfreeFormError(preState => {
          const index = preState.findIndex(row => row?.id == textValue?.id);
          if (index == -1) {
            return [...preState, { ...errors, id: textValue?.id }];
          } else {
            return preState;
          }
        });
      }

      return isEmpty(errors);
    });

    return returnData.includes(false);
  };

  function replacePlaceholders2(uri, data) {
    const regex = /{([^}]+)}/g;
    const replacedUri = uri.replace(regex, (match, key) => {
      return key in data ? data[key] : match;
    });
    return replacedUri;
  }
  useEffect(() => {
    if (data.data.bCascade) {
      // alert(JSON.stringify(data.data?.sMapping))
      hanldeGetDataFromElipsis(
        replacePlaceholders2(data.data.sDataSource, textValue),
        "useEffect",
        data.data?.sMapping
      );
    }

    const fetchDataIfNeeded = async () => {
      if (data?.component?.defaultLoad?.bEnabled === true) {
        await hanldeGetDataFromElipsis(
          data?.component?.defaultLoad?.sDataSource,
          "useEffect",
          data?.component?.defaultLoad?.sMapping
        );
      }
    };

    fetchDataIfNeeded();
  }, [data, allfeildsNames, textValue[data?.data?.sDataAware?.replace("{", "")?.replace("}", "")]]);

  //================================================================================================================================
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMaxWidthChange = event => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value
    );
  };

  const handleFullWidthChange = event => {
    setFullWidth(event.target.checked);
  };

  function filterDataByMapping(data, mapping) {
    const allowedFields = Object.values(mapping);
  
    return data.map(item => {
      const filteredItem = {};
      allowedFields.forEach(field => {
        if (item[field] !== undefined) {
          filteredItem[field] = item[field];
        }
      });
      if(item["id"]){
        filteredItem["id"] = item["id"];
      }
      return filteredItem;
    });
  }

  const [BulkLoadData, setBulkLoadData] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleBulkLoad = type => {
    setLoading(true);
    const filteredComponents = filterComponentsRecursive(mainFormData.details);
    const tableData = getDataByType("INPUTTABLE", filteredComponents);
    const existingIndex = tableData?.filter(
      item => item?.sInputTableName === data?.component?.sName
    );
    const newRow = {
      ...existingIndex[0]?.tabledetails[0]
    };
    const matchedFields = newRow;
    const mappingFields = [...Object.keys(data?.component?.[type]?.sMapping)];

    let transformedData = transformData(BulkLoadData, matchedFields, mappingFields, 0);
    transformedData.forEach((transformedField) => {
      for (const [key, value] of Object.entries(data?.component?.[type]?.sMapping)) {
        if (typeof transformedField[key] === 'number' && !isNaN(transformedField[key])) {
          transformedField[key] = transformedField[key].toFixed(2);
      } 
        transformedField[allfeildsNames[value]] = transformedField[key];
      }
    })
    const mappedFilteredData = filterDataByMapping(transformedData, allfeildsNames);

    // setFreeformdata((pre)=>([...pre,...transformedData]));
    setFreeformdata(mappedFilteredData);
    // setFreeformdata((pre)=>([...pre,...transformedData]));
    // setFreeformdata([...freeForm, newRow]);
    handleClose();
  };

  useEffect(() => {
    if (freeForm.length > 0) {
      const checkRenderComplete = () => {
        requestAnimationFrame(() => {
          setLoading(false);
        });
      };
      checkRenderComplete();
    }
  }, [freeForm]);

  //================================================================================================================================
  const [actionType, setActionType] = useState("");
  const [fileInputKey] = useState(Date.now());
  const [csvFile, setCsvFile] = useState();

  function removeBlankObjects(data) {
    return data.filter(obj => Object.values(obj).some(val => val !== undefined && val !== ""));
  }
  const fileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };
 
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };
 
  const processFile = (file) => {
    const reader = new FileReader();
 
    reader.onload = (e) => {
      const data1 = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data1, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = jsonData[0];
      const dataArray = jsonData.slice(1);
      const result = dataArray.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });
      setCsvFile(removeBlankObjects(result));
 
      const arry = data?.component?.loadFromFile?.sMapping.split(", ");
      data?.child?.forEach((item) => {
        if (arry.includes(item?.inputtable?.sColumnID)) {
          setSelectedLoadfromFile((pre) => ({
            ...pre,
            [item?.inputtable?.sHeader]: Object.keys(removeBlankObjects(result)[0]).find(
              (items) => items === item?.inputtable?.sHeader
            ),
          }));
        }
      });
    };
    reader.onerror = error => {
      console.error(error);
    };
    reader.readAsArrayBuffer(file);
  }; 
  csvFile?.forEach((item, ind) => (item.id = ind + 1));
  const clearColumns = data => {
    // let allfeilds = Object.keys(allfeildsNames);
    const newVal = freeForm.map(item => {
      const newItem = { ...item }; // Create a copy of the item object
      // allfeilds.forEach(field => {
      //   console.log("ebjgebkjrenr",newItem, allfeildsNames, data?.sMapping, field === data?.sMapping)
      //   if (newItem.hasOwnProperty(field) && field === data?.sMapping) {
      //     newItem[field] = ""; // Clear the value of the field
      //   }
      // });
      Object.entries(allfeildsNames).forEach(([key, value]) => {
        if (newItem.hasOwnProperty(value) && key === data?.sMapping) {
          newItem[value] = 0;
        }
      });
      return newItem;
    });
    setFreeformdata(newVal);
  };

  function replacePlaceholder(uri, textValue) {
    // Find the key within {} in the URI
    let keyStartIndex = uri.indexOf("{") + 1;
    let keyEndIndex = uri.indexOf("}", keyStartIndex);
    let key = uri.substring(keyStartIndex, keyEndIndex);

    // Replace the placeholder in the URI with the corresponding value from textValue
    let updatedUri = uri.replace(`{${key}}`, textValue[key]);

    return updatedUri;
  }

  function maptoRow() {
    // setFreeformdata([]);
    const filteredComponents = filterComponentsRecursive(mainFormData?.details);
    const tableData = getDataByType("INPUTTABLE", filteredComponents);
    const existingIndex = tableData?.filter(
      item => item?.sInputTableName === data?.component?.sName
    );
    const newRow = {
      ...existingIndex[0]?.tabledetails[0]
    };
    const matchedFields = newRow;

    const mappingFields = [data?.component?.loadFromFile?.sMapping];
    let transformedData = transformData(csvFile, matchedFields, [selectedLoadfromFile]);
    // console.log(allfeildsNames,transformedData,selectedLoadfromFile,matchedFields,'selectedLoadfromFile');
    setFreeformdata(transformedData);
    handleClose();

    function transformData(data, allFields, mappingFields, ind = 2) {
      return data.map((item, index) => {
        let transformedItem = { id: index + 1 };
        // Copy all fields and values from allFields
        Object.entries(allFields).forEach(([key, value]) => {
          transformedItem[key] = value;
        });
        // Change the values of fields in mappingFields
        mappingFields.forEach((field, ind) => {
          Object.keys(field).forEach((elm, ind) => {
            if (elm == Object.keys(field)[ind]) {
              // transformedItem[Object.values(field)[ind]] = item[elm] ?item[elm].toString():"" ;
              transformedItem[allfeildsNames[elm]] = item[Object.values(field)[ind]];
            }
          });
        });
        return transformedItem;
      });
    }
  }

  // useEffect(() => {
  //   try {

  //     /*eslint-disable no-undef*/
  //     copyFreeFormData(
  //       data?.component?.sName,
  //       freeForm,
  //       setFreeformdata,
  //       textValue,

  //       );

  //     /*eslint-enable no-undef*/
  //   } catch (error) {
  //     // Handle the error here
  //     console.error("Error in copyFormData:", error);
  //   }
  // }, [textValue]);
  const [firstTotal, setFirstTotal] = useState("0.00");
  const [secondTotal, setSecondtTotal] = useState("0.00");
  useEffect(() => {
    // alert(JSON.stringify(freeForm))
    let value1 = 0; // Initialize value1 to avoid undefined behavior
    let value2 = 0; // Initialize value1 to avoid undefined behavior
    for (let i = 0; i < freeForm.length; i++) {
      value1 += +freeForm[i]["col_column1"]?.toString()?.replace(/,/g, "") || 0;
      value2 += +freeForm[i]["col_column2"]?.toString()?.replace(/,/g, "") || 0;
    }
    setFirstTotal(value1);
    setSecondtTotal(value2);
    // alert(`${value1}--${value2}`);
    setFreeFromTotals(value1 + value2);
    // alert(JSON.stringify(freeForm))
    setfreeFormValidateFunction(() => validateData);
    return () => {
      // setAllfeildsNames( {});
      // setAllfeildsNames1( {});
      // setAllfeildsWithsType( {});
      setfreeFormValidateFunction(false);
    };
  }, [freeForm]);
  function replaceKeysSendData(data1, data2) {
    const newData = [];

    for (let i = 0; i < data1.length; i++) {
      // alert(key)
      const newItem = { ...data1[i] };

      for (let key in data2) {
        // if (newItem[key]) {
        newItem[data2[key]] = newItem[key];
        delete newItem[key];
        // }
      }

      newData.push(newItem);
    }

    return newData;
    // // Iterate over each object in data1
    // // Iterate over each object in data1
    // data1.forEach(obj => {
    //   // Iterate over each key in the object
    //   Object.keys(obj).forEach(key => {
    //     // If the key matches a value in data2, replace the key
    //     if (data2[key]) {
    //       obj[data2[key]] = obj[key];
    //       delete obj[key];
    //     }
    //   });
    // });
    // return JSON.parse(JSON.stringify(data1));
  }
  function replaceKeys4(first, second) {
    let newObject = {};
    for (let key in first) {
      if (second.hasOwnProperty(key)) {
        newObject[second[key]] = first[key];
      } else {
        newObject[key] = first[key];
      }
    }
    return newObject;
  }
  function replaceValuesInArray(result, third, forth) {
    if (third) {
      let newArray = third?.map((_, index) => {
        // Create a new item or copy an existing item from the forth array
        let newItem = index < forth.length ? { ...forth[index] } : {};

        // Set the id property starting from 1
        newItem.id = index + 1;

        // Iterate over each key in the result object
        for (let key in result) {
          // If the key from the result object exists in the current forth object or it is a new item
          if (newItem.hasOwnProperty(key) || !forth[index]) {
            // Get the corresponding key from the result object
            let thirdKey = result[key];
            // Replace the value in the forth object with the value from the third object
            newItem[key] = third[index][thirdKey];
          }
        }

        return newItem;
      });

      return newArray;
    }
  }

  useEffect(() => {
    let result = replaceKeys4(documentSelectmappingData, allFeildForDoucmentSelect);
    // documentSelectTableData,
    const usingTable = documentSelectTableData.filter(
      item => item?.mappingTableName == data.component.sName
    );
    // mappingTableName
    // documentSelectmappingDataSU
    // let tableData = documentSelectTableData.filter(record => record.sInputTableName == data?.component?.sName )
    let tableData = usingTable?.tabledetails;

    if (usingTable && usingTable?.length > 0) {
      setFreeformdata(
        replaceValuesInArray(
          replaceKeys4(documentSelectmappingData, allFeildForDoucmentSelect),
          usingTable[0]?.tabledetails,
          freeForm
        )
      );
    }
  }, [documentSelectTableData, documentSelectmappingData]);
function openLoadFromDocument(data){
  setOpenDocumentSelect(true)
}
function mapDataKeys(data, mapToData) {
  const keysToMatch = Object.keys(mapToData);

  return data.map(item => {
    let newItem = {};

    keysToMatch.forEach(oldKey => {
      if (item.hasOwnProperty(oldKey)) {
        const newKey = mapToData[oldKey]; // Get the new key name from mapToData
        newItem[newKey] = item[oldKey]; // Assign the value to the new key in newItem
      }
    });

    return newItem;
  });
}

function replaceKeysWithmatchingKeys(data, feildsData) {
  return data.map(item => {
    let newItem = {};

    // Iterate over each key in the item
    Object.keys(item).forEach(key => {
      if (feildsData.hasOwnProperty(key) && key !== "col_column1" && key !== "col_column2") {
        // Replace key with the corresponding value from feildsData
        newItem[feildsData[key]] = item[key];
      } else {
        // Keep the key as is if it is "col_column1" or "col_column2"
        newItem[key] = item[key];
      }
    });

    return newItem;
  });
}
useEffect(()=>{
  if (multiDocumentSelectDataForTable.length > 0) {
    let data1 = mapDataKeys(multiDocumentSelectDataForTable,data?.component.loadfromdocument.sMapping)
    let data2 = replaceKeysWithmatchingKeys(data1,allfeildsNames1)

    for (let i = 0; i < data2.length; i++) {
      data2[i].id = i+1
      
    }
    // alert(JSON.stringify(data2))
    setFreeformdata(data2)
  }

},[multiDocumentSelectDataForTable])
// multiDocumentSelectDataForTable,setmultiDocumentSelectDataForTable

  function updateRowPosition(initialIndex, newIndex, rows) {
    return new Promise((resolve) => {
      setTimeout(
        () => {
          const rowsClone = [...rows];
          const row = rowsClone.splice(initialIndex, 1)[0];
          rowsClone.splice(newIndex, 0, row);
          resolve(rowsClone);
        },
        Math.random() * 500 + 100,
      );
    });
  }

  const handleRowOrderChange = async (params) => {
    const newRows = await updateRowPosition(
      params.oldIndex,
      params.targetIndex,
      rows,
    );

    setRows(newRows);
  };

  return (
    <>
      {/* {JSON.stringify(data)} */}

      {/* id={data.component.sName} */}
      {/* 
    {JSON.stringify( documentSelectTableData[0]?.mappingTableName )} */}
      {/* 
    {JSON.stringify(replaceKeys4(documentSelectmappingData, allFeildForDoucmentSelect) )} */}
      {/* <button onClick={()=>}>click</button> */}
      {/* {JSON.stringify(replaceValuesInArray(replaceKeys4(documentSelectmappingData, allFeildForDoucmentSelect),  documentSelectTableData[0]?.tabledetails
    , freeForm))}
      {JSON.stringify(freeForm)} */}
      {/* {JSON.stringify(documentSelectTableData[0]?.tabledetails)} */}

      {/* {data?.component?.sName} */}
      <>
        {/* {data.component?.options?.mode === "DEFAULT" && (
          <InputTableDefault
            data={data}
            formData={formData}
            defaultTableEditData={freeFormTabbleEditArrays}
            mainFormData={mainFormData}
            company={company}
            isSubmited={isSubmited}
            format={format}
            formAction={formAction}
            textValue={textValue}
            tabledata={tabledata}
            tablesummaryfields={tablesummaryfields}
            setdefaultTableValidateFunction={setdefaultTableValidateFunction}
          />
        )} */}

        {/* {data?.component?.options?.mode === "DEBITCREDIT" && (
          <DebitCredit
            freeFormTabbleEditArrays={freeFormTabbleEditArrays}
            setdifferenceDebitCredit={setdifferenceDebitCredit}
            tablefreeformfield={tablefreeformfield}
            setdebitCreditTableData={setdebitCreditTableData}
            freeFormTabbleArrays={freeFormTabbleArrays}
            setFreeFormTabbleArrays={setFreeFormTabbleArrays}
            isSubmited={isSubmited}
            company={company}
            format={format}
            mainFormData={mainFormData}
            formAction={formAction}
            data={data}
            baseURL={baseURL}
            formdata={formdata}
            setdebitCreditValidateFunction={setdebitCreditValidateFunction}
          />
        )} */}

        {/* {JSON.stringify(freeForm)}
        {data.component.sName} */}
        {data?.component?.options?.submode !== "HIDDEN" && (
          <>
            <Box style={{ display: "flex", justifyContent: "end" }}>
              {data?.component?.options?.mode === "FREEFORM" &&
                JSON.stringify(data?.component?.menu?.bEnabled) == "true" && (
                  <>
                    <IconButton sx={{ cursor: "pointer" }} onClick={handleClick2}>
                      <Icon
                        aria-describedby={id}
                        iconName={data?.component?.menu?.sIcon}
                        sProps={data?.component?.menu?.sIconProps}
                      />
                      <Typography id={`${data?.component?.sName}-actions`}>{data?.component?.menu?.sMenuCaption}</Typography>
                    </IconButton>
                    <Popover
                      id={id}
                      open={open1}
                      anchorEl={anchorEl1}
                      onBlur={handleClose2}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center"
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center"
                      }}
                    >
                      <List>
                        {data?.component?.defaultLoad?.bEnabled === true && (
                          <ListItem>
                            <Typography
                              id={`${data?.component?.sName}-actions-1`}
                              onClick={() => {
                                const filteredComponents = filterComponentsRecursive(
                                  mainFormData.details
                                );
                                const tableData = getDataByType("INPUTTABLE", filteredComponents);
                                const existingIndex = tableData?.filter(
                                  item => item.sInputTableName === data?.component?.sName
                                );
                                const newRow = {
                                  id: 1,
                                  ...existingIndex[0]?.tabledetails[0]
                                };
                                setFreeformdata([newRow]);
                                handleClose();
                              }}
                              className="cursor-pointer"
                            >
                              Reset Table
                            </Typography>
                          </ListItem>
                        )}
                        {data?.component?.clearValues?.bEnabled === true && (
                          <ListItem>
                            <Typography
                              id={`${data?.component?.sName}-actions-2`}
                              className="cursor-pointer"
                              onClick={() => clearColumns(data?.component?.clearValues)}
                            >
                              {data?.component?.clearValues?.sSubmenuCaption}
                            </Typography>
                          </ListItem>
                        )}
                        {data?.component?.resetTable?.bEnabled === true && (
                          <ListItem>
                            <Typography
                              id={`${data?.component?.sName}-actions-3`}
                              className="cursor-pointer"
                              onClick={(e) => {
                                setBulkLoadData([]);
                                setFreeformdata([]);
                                handleAddRow1(e, true);
                                handleClose2();
                              }}
                            >
                              {data?.component?.resetTable?.sSubmenuCaption}
                            </Typography>
                          </ListItem>
                        )}
                        {data?.component?.defaultLoad?.bEnabled === true && (
                          <ListItem>
                            <Typography
                              id={`${data?.component?.sName}-actions-4`}
                              className="cursor-pointer"
                              onClick={() =>
                                hanldeGetDataFromElipsis(
                                  data?.component?.defaultLoad?.sDataSource,
                                  "btn",
                                  data?.component?.defaultLoad?.sMapping
                                )
                              }
                            >
                              {data?.component?.defaultLoad?.sSubmenuCaption}
                            </Typography>
                          </ListItem>
                        )}
                        {data?.component?.bulkLoad?.bEnabled === true && (
                          <ListItem>
                            <Typography
                              id={`${data?.component?.sName}-actions-5`}
                              className="cursor-pointer"
                              onClick={() => {
                                handleClickOpen(), setActionType("bulkLoad");
                              }}
                            >
                              {data?.component?.bulkLoad?.sSubmenuCaption}
                            </Typography>
                          </ListItem>
                        )}
                        {data?.component?.bulkLoad2?.bEnabled === true && (
                          <ListItem>
                            <Typography
                              id={`${data?.component?.sName}-actions-6`}
                              className="cursor-pointer"
                              onClick={() => {
                                handleClickOpen(), setActionType("bulkLoad2");
                              }}
                            >
                              {data?.component?.bulkLoad2?.sSubmenuCaption}
                            </Typography>
                          </ListItem>
                        )}
                        {data?.component?.bulkLoad3?.bEnabled === true && (
                          <ListItem>
                            <Typography
                              id={`${data?.component?.sName}-actions-7`}
                              className="cursor-pointer"
                              onClick={() => {
                                handleClickOpen(), setActionType("bulkLoad3");
                              }}
                            >
                              {data?.component?.bulkLoad3?.sSubmenuCaption}
                            </Typography>
                          </ListItem>
                        )}

                        {data?.component?.loadFromFile?.bEnabled === true && (
                          <ListItem className="cursor-pointer">
                            <Typography
                              id={`${data?.component?.sName}-actions-8`}
                              className="cursor-pointer"
                              onClick={() => {
                                handleClickOpen(), setActionType("loadFromFile");
                              }}
                            >
                              {data?.component?.loadFromFile?.sSubmenuCaption}
                            </Typography>
                          </ListItem>
                        )}

                        {/* //loadfromdocument */}
                        {data?.component?.loadfromdocument?.bEnabled === true && (
                          <ListItem className="cursor-pointer">
                            id={`${data?.component?.sName}-actions-9`}
                            <Typography
                              className="cursor-pointer"
                              onClick={() => {
                             openLoadFromDocument(data?.component?.loadfromdocument)
                              }}
                            >
                              {data?.component?.loadfromdocument?.sSubmenuCaption}
                            </Typography>
                          </ListItem>
                        )}
                      </List>
                    </Popover>
                  </>
                )}{" "}
            </Box>

            {data?.component?.options?.mode === "FREEFORM" && (
              <Box id={data.component.sName}>
                {loading && (
                  <Spinner/>
                )}
                <DataGridPro
                  autoHeight
                  rows={freeForm}
                  //   rows={[{id:0,sInventoryCode:"0000000010",col_column1:1,col_column2:"0"},{id:1,sInventoryCode:"0000000019",col_column1:1},
                  //   {id:2,sInventoryCode:"0000000020",col_column1:1}]
                  // }
                  columns={columns}
                  pagination={true}
                  disableColumnMenu={true}
                  hideFooter={false}
                  {...data.component?.sProps}
                  rowReordering
                  onRowOrderChange={handleRowOrderChange}
                />
              </Box>
            )}
            <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
              {data.component?.options?.mode === "FREEFORM" &&
                data?.component?.options?.enableRowAdd && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      border: "1px solid #42a5f5",
                      height: "2%"
                    }}
                  >
                    <Button
                      startIcon={<AddCircleOutlinedIcon onClick={e => handleAddRow1(e)} />}
                      id={`${data?.component?.sName}-addrowbutton`}
                      sx={{
                        border: "none",
                        "&:hover": {
                          border: "none"
                        }
                      }}
                      variant="outlined"
                      onClick={e => handleAddRow1(e)}
                    >
                      Add Row
                    </Button>
                    <select
                      id={`${data?.component?.sName}-addrow`}
                      onChange={handleAddRow1}
                      style={{ border: "none", outline: "none" }}
                    >
                      <option></option>
                      {options.map((option, index) => {
                        return (
                          <option key={index} value={option?.value} id={`${data?.component?.sName}-addrow${option?.key}`}>
                            {option?.key}
                          </option>
                        );
                      })}
                    </select>
                  </Box>
                )}

              {/* {JSON.stringify(data?.component?.options?.submode.toLowerCase().includes('computation')) } */}
              {data?.component?.options?.submode?.toLowerCase()?.includes("computation") && (
                <Box style={{ minWidth: "570px" }}>
                  <Grid container>
                    <Grid item xs={4}>
                      Total
                    </Grid>
                    <Grid item xs={4} id={`${data?.component?.sName}-col_column1totals`}>
                      {handlePointChange1(parseFloat(firstTotal).toFixed(2), 2)}
                    </Grid>
                    <Grid item xs={4} id={`${data?.component?.sName}-col_column2totals`}>
                      {handlePointChange1(parseFloat(secondTotal).toFixed(2), 2)}
                    </Grid>
                  </Grid>
                </Box>
              )}
              {/* {console.log(data?.summaryfields?.sSummaryDetails, 7788)} */}
              {/* {JSON.stringify(freeForm)} */}
              {/* {console.log(rows, "emptyfreeform")} */}

              {data?.options?.mode === "FREEFORM" && (
                <Box {...data.summaryfields?.sContainerProps}>
                  {data?.summaryfields?.sSummaryDetails?.map(item => {
                    return (
                      <Box
                        key={item.sSummaryID}
                        py={1}
                        sx={{ display: "flex", align: "center", gap: 10 }}
                      >
                        <Typography>{item.sLabel}</Typography>
                        {item.sFieldInput === "TEXTFIELD" && item.sSummaryID === "summ_handling" ? (
                          // <TextField onChange={summaryHandler("summ_handling")} />
                          <>
                            <p>hello</p>
                          </>
                        ) : item.sFieldInput === "TEXTFIELD" &&
                          item.sSummaryID === "summ_shipping" ? (
                          <>
                            <TextField onChange={summaryHandler(item?.sAction, "summ_shipping")} />
                            <p>hello</p>
                          </>
                        ) : item.sFieldInput === "TEXTFIELD" &&
                          item.sSummaryID === "summ_discount" ? (
                          <>
                            <TextField onChange={summaryHandler(item?.sAction, "summ_discount")} />
                            <p>hello</p>
                          </>
                        ) : item.sFieldInput === "none" && item.sSummaryID === "summ_subtotal" ? (
                          <Typography>{subtotal1}</Typography>
                        ) : item.sFieldInput === "none" && item.sSummaryID === "summ_grandtotal" ? (
                          <Typography>{grand_total === 0 ? subtotal1 : grand_total}</Typography>
                        ) : null}
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          </>
        )}
      </>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={
          actionType === "bulkLoad" || actionType === "bulkLoad2" || actionType === "bulkLoad3"
            ? maxWidth
            : "sm"
        }
        open={open}
        //  onClose={handleClose}
      >
        <DialogTitle>
          {" "}
          {actionType === "bulkLoad" || actionType === "bulkLoad2" || actionType === "bulkLoad3"
            ? data?.component?.[actionType]?.sSubmenuCaption
            : data?.component?.loadFromFile?.sSubmenuCaption}
        </DialogTitle>
        <DialogContent>
          {actionType === "bulkLoad" || actionType === "bulkLoad2" || actionType === "bulkLoad3" ? (
            <SelectAllTransferList
              setBulkLoadData={setBulkLoadData}
              freeForm={freeForm}
              data={data}
              sDisplayFormat={data?.component?.bulkLoad?.sDisplayFormat}
              token={token}
              uri={replacePlaceholder(data?.component?.[actionType]?.sDataSource, textValue)}
            />
          ) : (
            <>
              {!csvFile ? (
                <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                onDragOver={(e) => e.preventDefault()}
              >
                <Paper
                  style={{ cursor: "pointer" }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) {
                      fileChange({ target: { files: [file] } }); 
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <label htmlFor="fileInput">
                    <Box width={500} height={140}>
                      <Box p={2} display="flex" flexDirection="column" alignItems="center">
                        <CloudUploadIcon fontSize="large" />
                        <Typography variant="body1" gutterBottom>
                          Click to file
                        </Typography>
                        <input
                          type="file"
                          id="fileInput"
                          key={fileInputKey}
                          accept=".csv, .xlsx, .xls"
                          maxLength={"5mb"}
                          style={{ display: "none" }}
                          onChange={fileChange}
                        />
                        <Typography variant="body2" color="primary" component="span">
                          Select a file
                        </Typography>
                        <Typography variant="body2" className="pt-3" component="span">
                          (CSV file, max file size of 5MB)
                        </Typography>
                      </Box>
                    </Box>
                  </label>
                </Paper>
                {/* {data?.component?.loadFromFile?.sMapping} */}
              </Box>
              ) : (
                <>
                  {/* {JSON.stringify(removeBlankObjects(csvFile))} */}

                  {(() => {
                    const arry = data?.component?.loadFromFile?.sMapping.split(", ");
                    return (
                      <>
                        {data?.child?.map(item => {
                          if (arry.includes(item?.inputtable?.sColumnID)) {
                            return (
                              <Box sx={{ display: "flex", margin: "10px" }}>
                                <Box sx={{ width: "50%", alignSelf: "center" }}>
                                  {item?.inputtable?.sHeader}
                                </Box>
                                <Box sx={{ width: "50%" }}>
                                  <Select
                                    fullWidth={true}
                                    labelId="select-label"
                                    id="select"
                                    name={item.inputtable.sColumnID}
                                    onChange={e =>
                                      setSelectedLoadfromFile(pre => ({
                                        ...pre,
                                        [e.target.name]: e.target.value
                                      }))
                                    }
                                    size="small"
                                    defaultValue={ Object.keys(csvFile[0])?.find((items)=> items == item?.inputtable?.sHeader) ? Object.keys(csvFile[0]).find((items)=> items == item?.inputtable?.sHeader) : "Select"}
                                  >
                                    <MenuItem value={"Select"}>
                                          Select
                                    </MenuItem>
                                    {Object.keys(csvFile[0]).map((item, index) => (
                                      <MenuItem key={item} value={item}>
                                        {item}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </Box>
                              </Box>
                            );
                          }
                        })}
                      </>
                    );
                  })()}
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            variant="contained"
            disabled={BulkLoadData.length == 0 && selectedLoadfromFile == undefined}
            onClick={() => {
              if (selectedLoadfromFile != undefined) {
                maptoRow();
              } else {
                handleBulkLoad(actionType);
              }
            }}
            id="button-save"
          >
            Save
          </Button>
          <Button size="small" variant="contained" onClick={handleClose} id="button-close">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TableComponent;
