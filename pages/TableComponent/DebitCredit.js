import React from "react";
import AutoComplete from "../AutoComplete/AutoComplete";
import * as XLSX from "xlsx";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  MenuItem,
  Paper,
  Popover,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

import MoveDownIcon from "@mui/icons-material/MoveDown";
import * as MUIICon from "@mui/icons-material";

import dayjs from "dayjs";
import { Icon } from "../../utils/MuiIcons/Icon";
import DateComponent from "../DateComponent/DateComponent";
import CheckBoxComponent from "../CheckBox/CheckBoxComponent";
import SelectMainComponent from "../SelectComponent/SelectMainComponent";
import InputTableDefaultAllComponent from "./InputTableDefaultAllComponent";
import { DataGrid } from "@mui/x-data-grid";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import { useCallback, useEffect, useMemo, useState } from "react";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import { globalvalidateTextField, validateTextField } from "../../utils/validations/Validation";
import { Global_Data } from "../../globalData/GlobalData";
import axios from "axios";
import { serverAddress } from "../../config";
import SelectAllTransferList from "./Transfer/TransferList";
import Spinner from "../../component/spinner/Spinner";
function DebitCredit({
  isSubmited,
  company,
  formdata,
  baseURL,
  mainFormData,
  data,
  formAction,
  freeFormTabbleEditArrays,
  setdebitCreditTableData,
  setdifferenceDebitCredit,
  tablefreeformfield,setdebitCreditTableMode,
  setdebitCreditTableName,
  freeFormTabbleArrays,
  setdebitCreditTotal,
  setdebitCreditTotalBalanced,
  textValue,
  format,
  setFreeFormTabbleArrays,
  setdebitCreditValidateFunction
}) {
  const { token } = Global_Data();
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  //states for debit credit
  const [debitCreditData, setDebitCreditData] = useState([]);
  const [debitCreditInitData, setDebitCreditInitData] = useState();
  const [fixedItemsKeys, setFixedItemsKeys] = useState({});
  const [fixedItemsKeys1, setFixedItemsKeys1] = useState({});
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [debitCreditValidation, setDebitCreditValidation] = useState({});
  const [debitCreditError, setDebitCreditError] = useState([]);
  const [feildsWithColumns, setfeildsWithColumns] = useState({});
  const [selectedLoadfromFile, setSelectedLoadfromFile] = useState();
  const [loading, setLoading] = useState();

  function takeInputForDebit(e, id, type, decimalPlace) {
    const { name, value } = e.target;
    //  setIsTextSelected(selectionStart !== selectionEnd);
    // alert(name)
    const value2 =
      type == "number"
        ? handlePointChange1(value.length == 1 ? value : value, decimalPlace)
        : value;
    setIsTextSelected(false);
    // alert(id);
    const list = [...debitCreditData];
    const index = list.findIndex(row => row.id === id);
    // alert(value2)
if (name == 'col_debit') {
  
  list[index][name] = value2;
  list[index]['col_credit'] = '0.00';
}
else if (name == 'col_credit') {
  
  list[index][name] = value2;
  list[index]['col_debit'] = '0.00';
}else{
  list[index][name] = value2;

}
    setDebitCreditData(list);
    updateAmount(id, name);
    // alert(index)

    const err = validateTextField(value, debitCreditValidation[name]);

    setDebitCreditError(preState => {
      preState[index] = { ...preState[index], [name]: err };
      return preState;
    });
    // setDebitCreditError(prevError => {
    //   const newError = { ...prevError, [name]: err };
    //   return newError;
    // });
  }
  // useEffect(() => {

  //   freeFormTabbleEditArrays

  //   }, [formAction, formdata?.form?.sFormSource, baseURL]);
  function replaceKeys(data1, data2) {
    // Iterate through each object in data1 array
    for (let i = 0; i < data1.length; i++) {
      const obj = data1[i];
      // Iterate through keys in each object
      for (let key in obj) {
        // Check if the key exists in data2
        if (key in data2) {
          // Replace the key with the corresponding value from data2
          obj[data2[key]] = obj[key];
          delete obj[key]; // Remove the old key
        }
      }
    }
    return data1;
  }

  function matchKeys(data1 = [], data2 = []) {
    // Extract keys from the first object in data1
    if (data1) {
      if (data2[0]) {
        const keys1 = Object.keys(data1[0]);

        // Filter keys of the first object in data2 that match keys1
        const matchedKeys = Object.keys(data2[0])?.filter(key => keys1?.includes(key));

        // Map over data2 and create objects with only the matched keys
        const matchedData = data2?.map(obj => {
          const newObj = {};
          matchedKeys?.forEach(key => {
            newObj[key] = obj[key];
          });
          return newObj;
        });

        return matchedData;
      }
    }
  }

  useEffect(() => {
    const existingIndex = freeFormTabbleEditArrays?.filter(
      item => item.sInputTableName === data?.component?.sName
    );

    if (existingIndex[0]?.tabledetails) {
      const newArray = existingIndex[0]?.tabledetails;
      for (let i = 0; i < newArray.length; i++) {
        if (!newArray[i].id) {
          newArray[i].id = i + 1;
        }
      }

      // setDebitCreditData(newArray);
      if (debitCreditInitData) {
        if (matchKeys([debitCreditInitData], replaceKeys(newArray, fixedItemsKeys) || [])) {
          setDebitCreditData(
            matchKeys([debitCreditInitData], replaceKeys(newArray, fixedItemsKeys))
          );
        }
      }
    }
    // if (
    //   existingIndex &&
    //   existingIndex[0]?.tabledetails &&
    //   existingIndex[0]?.tabledetails.length >= 1
    // ) {
    //   const filteredComponents = filterComponentsRecursive(mainFormData.details);
    //   const tableData = getDataByType("INPUTTABLE", filteredComponents);
    //   const existingIndexsecond = tableData?.filter(
    //     item => item.sInputTableName === data?.component?.sName
    //   );
    //   const newRow = {
    //     ...existingIndexsecond[0]?.tabledetails[0]
    //   };
    //   const matchedFields = newRow;
    //   const newFreeData = heraferidatauseEffect(
    //     { ...data?.component?.defaultLoad?.sMapping },
    //     allfeildsNames1,
    //     existingIndex[0]?.tabledetails
    //   );
    //   const newData3 = [];
    //   for (let i = 0; i < newFreeData.length; i++) {
    //     newData3.push({ ...matchedFields, ...newFreeData[i] });
    //   }
    //   // console.log(newData3,'newData3');
    //   // setFreeformdata();

    //   setFreeformdata(newData3);
    // }
    // }else{
    //   const existingIndex = freeFormTabbleArrays.findIndex(
    //     item => item.sInputTableName ===  data?.component?.sName
    //   );
    //   const newRow  ={id : 1 ,...freeFormTabbleArrays[existingIndex].tabledetails[0]}

    //   setFreeformdata(newRow);
    // }
  }, [freeFormTabbleEditArrays, debitCreditInitData, fixedItemsKeys]);

  // useEffect(() => {

  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`${baseURL}${formdata?.form?.sFormSource}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //           // Other headers if needed
  //         }
  //       });
  //       alert(JSON.stringify(formdata?.form?.sFormSource));
  //       if (response?.data?.metadata?.status === "OK") {
  //         const { tabledetails: data = [], tablesummary: datahandling = [] } =
  //           response?.data?.data[1]?.tablerecords[0] || {};
  //         const { tabledetails: dataFreeForm = [] } =
  //           response?.data?.data[1]?.tablerecords[1] || {};

  //         const finaldata = data?.map((item, index) => ({ ...item, id: index + 1 }));
  //         const finaldata1 = dataFreeForm?.map((item, index) => ({ ...item, id: index + 1 }));

  //         if (formAction === "EDIT") {
  //           setDebitCreditData(finaldata);
  //          // setFreeformdata(finaldata1);

  //           // const initialValues = {};
  //           // for (const { sSummaryID, sInputValue } of datahandling) {
  //           //   initialValues[sSummaryID] = sInputValue;
  //           // }
  //          // setSubTotal(initialValues);
  //           //setSubTotalDef(initialValues);
  //         }
  //       }
  //     } catch (error) {
  //       // Handle error
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [formAction, formdata?.form?.sFormSource, baseURL]);

  useEffect(()=>{
    hanldeGetDataFromElipsis(data?.component?.defaultLoad?.sDataSource, "useEffect");
  },[data?.component?.defaultLoad?.sDataSource])

  const updateAmount = (id, name) => {
    const rowIdx = debitCreditData.findIndex(item => item.id === id);
    if (rowIdx === -1) return; // Row not found, do nothing

    const row = debitCreditData[rowIdx];
    const debit = +row.col_debit?.toString()?.replace(/,/g, ""); // parseFloat(row.col_disc || 0);
    const credit = +row.col_credit?.toString()?.replace(/,/g, ""); // parseFloat(row.col_tax || 0);

    const zero = 0;
    const updatedRow = {
      ...row,
      col_debit: name === "col_credit" ? zero.toFixed(2) : debit.toFixed(2),
      col_credit: name === "col_debit" ? zero.toFixed(2) : credit.toFixed(2)
    };

    const updatedRows = [...debitCreditData];
    updatedRows[rowIdx] = updatedRow;

    // setDebitCreditData(updatedRows);
  };

  function removeCommas(inputString) {
    let result = "";
    for (let i = 0; i < inputString?.length; i++) {
      if (inputString[i] !== ",") {
        result += inputString[i];
      }
    }
    return result;
  }

  const DebitCreditCallBackItem = (e, id, name) => {
    if (e) {
      let value = e || "";
      const list = [...debitCreditData];
      const index = list.findIndex(row => row.id === id);
      list[index][name] = value;
      setDebitCreditData(list);
      // alert(JSON.stringify(e));
      const err = validateTextField(value, debitCreditValidation[name]);

      setDebitCreditError(preState => {
        preState[index] = { ...preState[index], [name]: err };
        return preState;
      });
    }
  };

  const handledatachange = (e, id, name) => {
    const list = [...debitCreditData];
    const index = list.findIndex(row => row.id === id);
    list[index][name] = e;
    setDebitCreditData(list);
    const err = validateTextField(e, debitCreditValidation[name]);

    setDebitCreditError(preState => {
      preState[index] = { ...preState[index], [name]: err };
      return preState;
    });
  };

  function handlePointChange1(num1, decimalPlaces = 0) {
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
  }

  const handleAddRow = e => {

    const newRow = {
      ...debitCreditInitData,
      id: debitCreditData[debitCreditData.length-1].id + 1
    };
    if (e.target.value) {
      const numNewRows = parseInt(e.target.value);
      const newRows = Array.from({ length: numNewRows }, (_, i) => ({
        id: debitCreditData[debitCreditData.length-1].id + i + 1,
        ...debitCreditInitData
      }));
      setDebitCreditData([...debitCreditData, ...newRows]);
    } else {
      setDebitCreditData([...debitCreditData, newRow]);
    }

  };
  function getErrorDetails(data, Id) {
    const rtnData = data.filter(elm => elm.id == Id);
    if (rtnData.length > 0) {
      return rtnData[0];
    } else {
      return false;
    }
  }

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
    setDebitCreditData(arr);
  };
  // const [isTextSelected, setIsTextSelected] = useState(false);
  const handleSelectionChange = event => {
    const { selectionStart, selectionEnd } = event.target;
    setIsTextSelected(selectionStart !== selectionEnd);
  };
  const evaluateCondition = (condition) => {
    if (condition === 'true') return true;
    if (condition === 'false') return false;
    if (condition === '!true') return false;
    if (condition === '!false') return true;
    return false;
  };
  const handleFocus = event => {
    const { target } = event;
    const { value } = target;
    // Move cursor to the end
    // target.setSelectionRange(value.length, value.length);
    if (!isTextSelected) {
      target.setSelectionRange(value.length, value.length);
    }
  };
  const handleSelectionBlur = event => {
    setIsTextSelected(false);
  };

  function  getColumnIndexByHeaderName  (columns, headerName)  {
    // alert(JSON.stringify(columns))
    return columns.findIndex(column => column.field == headerName);
  };

  const columns = [];
  data?.component?.options?.mode === "DEBITCREDIT" &&
  data?.child?.forEach((item, index) => {
    const data1 = [{ data: item }];
    const uniqueFieldId = `${item.inputtable.sColumnID}_${index}`
    // alert( evaluateCondition(item?.inputtable?.bVisible))
       evaluateCondition(item?.inputtable?.bVisible) &&
        columns.push({
          field: uniqueFieldId,
          headerName: item.inputtable.sHeader,
          width: item.inputtable.iWidth,
          // editable: item.inputtable.bEditable,
          sortable: false,
          renderCell: params => {
            if (item?.component.sType === "VARTEXT") {
              const styleFormatData = format?.data?.records?.find(
                item1 => item1?.sFieldName == item?.component?.sName
              );
              const parsedData = styleFormatData ? JSON.parse(styleFormatData?.sFieldFormat) : {};
              const Icons = MUIICon[styleFormatData?.sStatusIcon];
              return (
                <>
                  {/* {console.log("params", params.row[item.component.sName])} */}
                  {   evaluateCondition(item?.inputtable?.bVisible) ? (
                    <Typography {...parsedData}>
                      {styleFormatData?.sStatusIcon && <Icons />}
                      {/* {debitCreditData &&
                        debitCreditData[params.row.id - 1] &&
                        debitCreditData[params.row.id - 1][item.component.sName]} */}
                      {params.row[item.component.sName]}
                    </Typography>
                  ) : null}
                </>
              );
            }
            if (item.component.sType === "AUTOCOMPLETE") {
              return (
                <>
                  <AutoComplete
                    formcallback={e =>
                      DebitCreditCallBackItem(e, params.row.id, item?.component?.sName)
                    }
                    textValue1={debitCreditData[params.row.id - 1]}
                    errors={
                      getErrorDetails(debitCreditError, params.row.id)[item?.component?.sName]
                    }
                    data={data1[0].data}
                  />
                </>
              );
            } else if (item.component.sType === "TEXTFIELD") {
              return (
                <>
                  {/* {debitCreditData[params.row.id - 1][item.component.sName]} */}
                  <TextField
                    id={`${item?.component?.sName}-${params.row.id}`}
                    name={item?.component?.sName}
                    onChange={e => {
                      takeInputForDebit(e, params.row.id);
                      e.stopPropagation();
                    }}
                    value={
                      debitCreditData &&
                      debitCreditData[params.row.id - 1] &&
                      debitCreditData[params.row.id - 1][item.component.sName]
                    }
                    onKeyDown={event => {
                      event.stopPropagation();
                    }}
                    //error={error && error[data?.component?.sName]}
                    error={getErrorDetails(debitCreditError, params.row.id)[item?.component?.sName]}
                    disabled={item?.component?.sProps?.disabled}
                    placeholder={item?.component?.sPlaceHolder}
                    helperText={
                      getErrorDetails(debitCreditError, params.row.id)[item?.component?.sName] ||
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
                </>
              );
            } else if (item.component.sType === "DATETIME") {
              return (
                <DateComponent
                  handledatechange={e => handledatachange(e, params.row.id, item?.component?.sName)}
                  data={item}
                  datavalue={
                    debitCreditData &&
                    debitCreditData[params.row.id - 1] &&
                    debitCreditData[params.row.id - 1][item.component.sName]
                  }
                  datemod={data.component?.options?.mode}
                  datatextvalue=""
                  formaction={formAction}
                  {...item?.component?.sProps}
                />
              );
            } else if (item.component.sType === "CHECKBOX") {
              return (
                <CheckBoxComponent
                  data={item}
                  handleCheckbox={e => handledatachange(e, params.row.id, item?.component?.sName)}
                  datacheckvalue={
                    debitCreditData &&
                    debitCreditData[params.row.id - 1] &&
                    debitCreditData[params.row.id - 1][item.component.sName]
                  }
                  datemod={data.component?.options?.mode}
                  formactions={formAction}
                  {...item?.component?.sProps}
                />
              );
            } else if (item.component.sType === "SELECT") {
              return (
                <>
                  {/* {JSON.stringify(item   .component)} */}
                  <SelectMainComponent
                    handledatasend={e => handledatachange(e, params.row.id, item?.component?.sName)}
                    taxUrlFree={item?.data?.sDataSource}
                    sColumnID={item?.component?.sName}
                    data={item}
                    errors={
                      getErrorDetails(debitCreditError, params.row.id)[item?.component?.sName]
                    }
                    {...data?.component?.sProps}
                    datemod={item?.component?.options?.mode}
                    formaction={formAction}
                    textValue={
                      debitCreditData &&
                      debitCreditData[params.row.id - 1] &&
                      debitCreditData[params.row.id - 1]
                    }
                    isSubmited={isSubmited}
                  />
                </>
              );
            } else {
              return;
            }
          }
        });
    });
  function removeCommas1(inputString) {
    let result = "";
    for (let i = 0; i < inputString?.length; i++) {
      if (inputString[i] !== ",") {
        result += inputString[i];
      }
    }
    return result;
  }
  const handlePointChange = (num1, decimalPlaces = 0) => {
    const num = removeCommas1(num1);
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

  const handleNumerChange = (e, item, params) => {

    const { selectionStart, selectionEnd } = e.target;
    if (isTextSelected) {
      // alert(JSON.stringify( e.target.value))
      e.target.value =
        item?.inputType?.component.iDecimalPlaces == 2
          ? e.target.value.includes(".")
            ? e.target.value
            : "0.0" + e.target.value
          : e.target.value;
    }
    setIsTextSelected(false);
    //     // takeInput(e, id, "CURRENCY", data?.inputType?.component.iDecimalPlaces);
    // alert(JSON.stringify( e.target.value))
    // alert(params.row.id)
    takeInputForDebit(e, params.row.id , "number", 2);
  };


 
  data?.fixcolumns?.forEach((item, ind) => {
    switch (item.sColumnID) {
      case "col_debit":
        // alert(JSON.stringify(item?.component));
        columns.push({
          field: item.sColumnID,
          headerName: item.sHeader,
          width: item.iWidth,
          // editable: item.bEditable,
          type: item.sType,
          sortable: true,
          renderCell: (params,i) => {
            const index = debitCreditData.findIndex(row => row.id === params.row.id);
          console.log();
         
            return (
              <>
             
                {/* {JSON.stringify( columns)} */}
                {/* {item?.inputType?.component.iDecimalPlaces} */}
                {/* {params.row.col_debit} */}
               
                {/* {JSON.stringify(columnIndexMap[params.field])} */}
                <Grid item name={'test-t'} id={item?.inputType?.component?.sName +'-'+ params.rowIndex}>
                
                  {/* {params.row.col_debit}
              {JSON.stringify(params.row)} */}
                  {/* {params.row.id} ===
              {debitCreditData[params.row.id - 1]?.id} */}
                  <TextField
                    placeholder={item?.inputType?.component?.sPlaceHolder}
                    name={item.sColumnID}
                    // id={`${data.component.sName}-${item.sColumnID}-${item?.inputType?.component?.sName}-${index+1}-${getColumnIndexByHeaderName(columns,'col_debit')+1}`}
                    id={`${item?.inputType?.component?.sName}-${params.row.id}`}
                    inputProps={{ style: { textAlign: item?.inputType?.component?.sJustify } }}
                    onChange={e => handleNumerChange(e, item, params)}
                    // onChange={e => {
                    //   FreeFormInput(e, params.row.id, "number", item?.inputType?.component.iDecimalPlaces);
                    // }}
                    // disabled={isDisabledTable == false ? editable : isDisabledTable}
                    // value={handlePointChange(debitCreditData[params.row.id - 1]?.col_debit,2)}
                    value={handlePointChange1(
                      debitCreditData[index]?.col_debit + "",
                      2
                    )}
                    // value={debitCreditData[params.row.id - 1]?.col_debit || "0.00"}
                    // value={handlePointChange1(
                    //   parseFloat(debitCreditData[params.row.id - 1]?.col_debit).toFixed(2),
                    //   2
                    // )}
                    // value={ debitCreditData[params.row.id - 1]?.col_debit || "0.00"}
                    {...item?.inputType?.component?.sProps}
                    {...item?.inputType?.component?.options?.others1}
                    onBlur={handleSelectionBlur}
                    onKeyDown={handleFocus}
                    onFocus={handleFocus}
                    onSelect={handleSelectionChange}
                    onKeyUp={handleSelectionChange}
                    onMouseUp={handleSelectionChange}
                    InputProps={
                      item?.inputType?.component?.sAdornPosition === "Start"
                        ? {
                            startAdornment: (
                              <>
                                {item?.inputType?.component?.sAdornPosition &&
                                  item?.inputType?.component?.sAdornType === "Icon" && (
                                    <InputAdornment
                                      position={item?.inputType?.component?.sAdornPosition}
                                    >
                                      <Icon
                                        iconName={item?.inputType?.component?.sIcon?.slice(0, -4)}
                                      />
                                    </InputAdornment>
                                  )}
                                {item?.inputType?.component?.sAdornPosition &&
                                  item?.inputType?.component?.sAdornType === "Text" && (
                                    <InputAdornment
                                      position={item?.inputType?.component?.sAdornPosition}
                                    >
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
                                  item?.inputType?.component?.sAdornType === "Icon" && (
                                    <InputAdornment
                                      position={item?.inputType?.component?.sAdornPosition}
                                    >
                                      <Icon
                                        iconName={item?.inputType?.component?.sIcon.slice(0, -4)}
                                      />
                                    </InputAdornment>
                                  )}
                                {item?.inputType?.component?.sAdornPosition &&
                                  item?.inputType?.component?.sAdornType === "Text" && (
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
                  <FormHelperText>{item?.inputType?.component?.sHelper}</FormHelperText>
                </Grid>
                {/* <TextField
                name={item.sColumnID}
                onChange={e => takeInputForDebit(e, params.row.id, "number", 2)}
                variant="outlined"
                size="small"
                value={debitCreditData[params.row.id - 1]?.col_debit || "0.00"}
                /> */}
              </>
            );
          }
        });
        break;
      case "col_credit":
        columns.push({
          field: item.sColumnID,
          headerName: item.sHeader,
          width: item.iWidth,
          // editable: item.bEditable,
          type: item.sType,
          sortable: true,
          renderCell: params => {
            const handleNumerChange = (e, item, params) => {
              const { selectionStart, selectionEnd } = e.target;
              if (isTextSelected) {
                // alert(JSON.stringify( e.target.value))
                e.target.value =
                  item?.inputType?.component.iDecimalPlaces == 2
                    ? e.target.value.includes(".")
                      ? e.target.value
                      : "0.0" + e.target.value
                    : e.target.value;
                
              }
              setIsTextSelected(false);
              //     // takeInput(e, id, "CURRENCY", data?.inputType?.component.iDecimalPlaces);
              // alert(JSON.stringify( e.target.value))
              takeInputForDebit(e, params?.row?.id, "number", 2);
            };
            const index = debitCreditData.findIndex(row => row.id === params.row.id);
            // const ii =  columns?.length  - (ind)
            return (
              <>
                {/* { debitCreditData[index]?.col_credit}kk */}
                {/* {ii} */}
               
                <Box>
                  <TextField
                    placeholder={item?.inputType?.component?.sPlaceHolder}
                    name={item.sColumnID}
                    id={`${item?.inputType?.component?.sName}-${params.row.id}`}
                    // id={data?.component?.sName+'-'+item.sColumnID+'-'+item?.inputType?.component?.sName +'-'+params.row.id}
                    // id={`${data.component.sName}-${item.sColumnID}-${item?.inputType?.component?.sName}-${index+1}-${getColumnIndexByHeaderName(columns,'col_debit')+1}`}
                    inputProps={{ style: { textAlign: item?.inputType?.component?.sJustify } }}
                    onChange={e => handleNumerChange(e, item, params)}
                    // onChange={e => {
                    //   FreeFormInput(e, params.row.id, "number", item?.inputType?.component.iDecimalPlaces);
                    // }}
                    // disabled={isDisabledTable == false ? editable : isDisabledTable}
                    value={handlePointChange1(
                      debitCreditData[index]?.col_credit + "",
                      2
                    )}
                    // value={debitCreditData[params.row.id - 1]?.col_credit || "0.00"}
                    {...item?.inputType?.component?.sProps}
                    {...item?.inputType?.component?.options?.others1}
                    
                    onBlur={handleSelectionBlur}
                    onKeyDown={handleFocus}
                    onFocus={handleFocus}
                    onSelect={handleSelectionChange}
                    onKeyUp={handleSelectionChange}
                    onMouseUp={handleSelectionChange}
                    InputProps={
                      item?.inputType?.component?.sAdornPosition === "Start"
                        ? {
                            startAdornment: (
                              <>
                                {item?.inputType?.component?.sAdornPosition &&
                                  item?.inputType?.component?.sAdornType === "Icon" && (
                                    <InputAdornment
                                      position={item?.inputType?.component?.sAdornPosition}
                                    >
                                      <Icon
                                        iconName={item?.inputType?.component?.sIcon?.slice(0, -4)}
                                      />
                                    </InputAdornment>
                                  )}
                                {item?.inputType?.component?.sAdornPosition &&
                                  item?.inputType?.component?.sAdornType === "Text" && (
                                    <InputAdornment
                                      position={item?.inputType?.component?.sAdornPosition}
                                    >
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
                                  item?.inputType?.component?.sAdornType === "Icon" && (
                                    <InputAdornment
                                      position={item?.inputType?.component?.sAdornPosition}
                                    >
                                      <Icon
                                        iconName={item?.inputType?.component?.sIcon.slice(0, -4)}
                                      />
                                    </InputAdornment>
                                  )}
                                {item?.inputType?.component?.sAdornPosition &&
                                  item?.inputType?.component?.sAdornType === "Text" && (
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

                  <FormHelperText>{item?.inputType?.component?.sHelper}</FormHelperText>
                </Box>

                {/* <TextField
         name={item.sColumnID}
         onChange={e => takeInputForDebit(e, params.row.id, "number", 2)}
         variant="outlined"
         size="small"
         value={debitCreditData[params.row.id - 1]?.col_debit || "0.00"}
         /> */}
              </>
              // <TextField
              //   name={item.sColumnID}
              //   onChange={e => takeInputForDebit(e, params.row.id, "number", 2)}
              //   variant="outlined"
              //   value={debitCreditData[params.row.id - 1]?.col_credit || "0.00"}
              //   size="small"
              // />
            );
          }
        });
        break;
      default:
        columns.push({
          field: item.sColumnID,
          headerName: item.sHeader,
          width: item.iWidth,
          editable: item.bEditable,
          type: item.sType,
          sortable: true,
          renderCell: params => <>{InputTableDefaultAllComponent(item)}</>
        });
        break;
    }
  });

  data?.component?.options?.mode === "DEBITCREDIT" &&
    columns.push({
      field: "",
      headerName: " ",
      width: 100,
     
      sortable: false,
      disableColumnMenu: true,
      renderCell: params => {
        const handleDelete = () => {
          const newRows = debitCreditData.filter(row => row.id !== params.row.id);
          if (newRows.length == 0) {
            setDebitCreditData([
              {
                ...debitCreditInitData,
                id: 1
              }
            ]);
          } else {
            // alert(JSON.stringify(newRows))
            setDebitCreditData(newRows);
          }
        };
        if (params.row.id === 1) {
          return (
            <>
              {data?.component?.options?.enableRowAdd && (
                <IconButton onClick={e => handleAddRow(e)} aria-label="add" id={data.component.sName + "-add-" + params.row.id}>
                  <AddCircleOutlineSharpIcon />
                </IconButton>
              )}
              {data?.component?.options?.enableRowClone && (
                <IconButton onClick={e => handleCloneData(debitCreditData, params.row.id)} aria-label="clone" id={data.component.sName + "-clone-" + params.row.id}>
                  <MoveDownIcon />
                </IconButton>
              )}
              {data?.component?.options?.enableRowDelete && (
                <IconButton onClick={handleDelete} aria-label="delete" id={data.component.sName + "-delete-" + params.row.id}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
              )}
            </>
          );
        }
        return (
          <>
            {data?.component?.options?.enableRowAdd && (
              <IconButton onClick={e => handleAddRow(e)} aria-label="add" id={data.component.sName + "-add-" + params.row.id}>
                <AddCircleOutlineSharpIcon />
              </IconButton>
            )}

            {data?.component?.options?.enableRowClone && (
              <IconButton onClick={e => handleCloneData(debitCreditData, params.row.id)} aria-label="clone" id={data.component.sName + "-clone-" + params.row.id}>
                <MoveDownIcon />
              </IconButton>
            )}
            {data?.component?.options?.enableRowDelete && (
              <IconButton onClick={handleDelete} aria-label="delete" id={data.component.sName + "-delete-" + params.row.id}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            )}
          </>
        );
      }
    });
  const options = [
    { key: "1x", value: 1 },
    { key: "5x", value: 5 },
    { key: "10x", value: 10 },
    { key: "15x", value: 15 },
    { key: "20x", value: 20 }
  ];

  useEffect(() => {
    const columns = { id: 1 };
    const feildsWithColumns = {};
    let date, date_format;
    const validate = {};
    if (data?.component?.options?.mode === "DEBITCREDIT" && data?.child) {
      data?.child.forEach(item => {
        switch (item?.component.sType) {
          case "AUTOCOMPLETE":
          case "TEXTFIELD":
          case "CHECKBOX":
          case "INPUT":
          case "VARTEXT":
          case "SELECT":
            feildsWithColumns[item.inputtable.sColumnID] = item?.component.sName;
            columns[item?.component.sName] = item?.component.sDefaultValue || "";
            validate[item?.component.sName] = item.validation;
            break;
          case "DATETIME":
            date = dayjs(data?.component?.sDefaultValue);
            date_format = `${date.$D}-${date.$M}-${date.$y}`;
            validate[item?.component.sName] = item.validation;
            break;
          default:
            break;
        }
      });
    }
    const fixedFeilds = {};
    const fixedFeilds1 = {};
    if (data?.fixcolumns) {
      data.fixcolumns.forEach(item => {
        switch (item.sColumnID) {
          case "col_debit":
            columns[item.sColumnID] = "0.00";
            fixedFeilds[item?.inputType?.component?.sName] = item.sColumnID;
            fixedFeilds1[item.sColumnID] = item?.inputType?.component?.sName;
            feildsWithColumns[item.sColumnID] = item.sColumnID;

            break;
          case "col_credit":
            columns[item.sColumnID] = "0.00";
            fixedFeilds[item?.inputType?.component?.sName] = item.sColumnID;
            fixedFeilds1[item.sColumnID] = item?.inputType?.component?.sName;
            feildsWithColumns[item.sColumnID] = item.sColumnID;
            break;
          default:
            break;
        }
      });
      setfeildsWithColumns(feildsWithColumns);
      setFixedItemsKeys(fixedFeilds);
      setFixedItemsKeys1(fixedFeilds1);
    }
    setdebitCreditTableMode(data?.component?.options.mode)
    setdebitCreditTableName(data.component?.sName)
    // alert(JSON.stringify(fixedFeilds));
    setDebitCreditValidation(validate);
    setDebitCreditData([columns, { ...columns, id: 2 }]);
    // alert(JSON.stringify(columns));
    setDebitCreditInitData(JSON.parse(JSON.stringify(columns)));
  }, [data]);

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const validateData = () => {
    const returnData = debitCreditData.map(textValue => {
      const errors = globalvalidateTextField(textValue, debitCreditValidation);
      const index = debitCreditError.findIndex(row => row?.id == textValue?.id);
      if (index != -1) {
        const newData = JSON.parse(JSON.stringify(debitCreditError));
        newData[index] = { ...errors, id: textValue?.id };
        setDebitCreditError(newData);
      } else {
        setDebitCreditError(preState => {
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

  useEffect(() => {


    // const totalDebit = debitCreditData.reduce((sum, item) => {

    //   const debitValue = parseFloat(item?.col_debit ? item?.col_debit+""?.replace(/,/g, ''):0);
    //   let num = item?.col_debit+""?.replace(/,/g, '')
    //   // Check if debitValue is a valid number
    //   // if (!isNaN(debitValue)) {
    //     return sum + +num;
    //   // }
    //   // return sum;
    // }, 0);

    // // alert()
    // const totalCredit = debitCreditData.reduce((sum, item) => {
    //   const creditValue = parseFloat(item?.col_credit?item?.col_credit+""?.replace(/,/g, ''):0);

    //   // Check if creditValue is a valid number
    //   if (!isNaN(creditValue)) {
    //     return sum + creditValue;
    //   }

    //   return sum;
    // }, 0);
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

    let sumDebit = 0;
let sumCredit = 0;

debitCreditData.forEach(entry => {
    let debit = typeof entry.col_debit === 'string' ? parseFloat(entry.col_debit.replace(/,/g, '')) : entry.col_debit;
    let credit = typeof entry.col_credit === 'string' ? parseFloat(entry.col_credit.replace(/,/g, '')) : entry.col_credit;
    
    sumDebit += debit;
    sumCredit += credit;
});
    setTotalDebit(sumDebit);
    setTotalCredit(sumCredit);
    setdebitCreditTotal({ sumDebit, sumCredit });
    // setdebitCreditTotalBalanced()
    // alert(JSON.stringify(debitCreditData))

    // setdebitCreditTableData([{hh:"sf"}]);

    //worlking here
    setdebitCreditTableData(replaceKeysSendData(debitCreditData, fixedItemsKeys1));
    setdebitCreditValidateFunction(() => validateData);
    return () => {
      setdebitCreditValidateFunction(false);
    };
  }, [debitCreditData, fixedItemsKeys]);
  // =================================================================
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");
  const [actionType, setActionType] = useState("");
  const [fileInputKey] = useState(Date.now());
  const [csvFile, setCsvFile] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  /*eslint-enable no-undef*/
  const handleClick2 = event => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl1(null);
  };

  const open1 = Boolean(anchorEl1);
  const id = open1 ? "simple-popover" : undefined;

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

        // Check if component.options.mode is present
        if (component.options) {
          result[sName].child.sInputTableMode = component.options.mode;
        }
      }
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
  // csvFile?.forEach((item, ind) => (item.id = ind + 1));
  const clearColumns = data => {
    //  let allfeildsr =["sAccountCode","sDescription","col_debit","col_credit" ];
    let allfeilds = data.sMapping
      .split(",")
      .map(key => feildsWithColumns[key.trim()])
      .filter(value => value !== undefined);

    // let allfeilds = Object.keys(data.sMapping);
    const newVal = debitCreditData.map(item => {
      const newItem = { ...item }; // Create a copy of the item object
      allfeilds.forEach(field => {
        // alert(JSON.stringify(field))
        if (newItem.hasOwnProperty(field.trim())) {
          newItem[field.trim()] = ""; // Clear the value of the field
        }
      });
      return newItem;
    });
    // alert(JSON.stringify(data.sMapping.split(',')))
    // alert(JSON.stringify(allfeilds))

    setDebitCreditData(newVal);
  };
  function transformData(data, allFields, mappingFields, ind = 2) {
    return data.map((item, index) => {
      let transformedItem = { id: index + 1 };

      // Copy all fields and values from allFields
      Object.entries(allFields).forEach(([key, value]) => {
        transformedItem[key] = value;
      });

      // Change the values of fields in mappingFields
      mappingFields?.forEach(field => {
        if (item[field]) {
          transformedItem[field] = item[field];
        }
      });

      return transformedItem;
    });
  }
  function heraferidata(matchfeild, allfeild, receivdata) {
    const arr = [];
    for (let i = 0; i < receivdata.length; i++) {
      let matchKey = Object.keys(matchfeild);
      let rowKey = Object.keys(receivdata[i]);
      const matchedElements = {};
      matchKey?.forEach(item => {
        if (rowKey.includes(item)) {
          matchedElements[matchfeild[item]] =
            receivdata[i][item] !== "" ? receivdata[i][item] : matchedElements[matchfeild[item]];
        }
      });

      const replacedObject = replaceKeys12(i, matchedElements, allfeild);
      arr.push({ sAction: "", ...replacedObject });
    }
    return arr;
  }

  function replaceKeys12(i, obj, allfeild) {
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
  async function hanldeGetDataFromElipsis(uri, type) {
    try {
      setLoading(true);
      const response = await axios.get(serverAddress + uri, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      });
      const filteredComponents = filterComponentsRecursive(mainFormData.details);
      const tableData = getDataByType("INPUTTABLE", filteredComponents);
      const existingIndex = tableData?.filter(
        item => item.sInputTableName === data?.component?.sName
      );
      const newRow = {
        ...existingIndex[0]?.tabledetails[0]
      };
      const matchedFields = newRow;
      const mappingFields = [...Object.keys(data?.component?.defaultLoad?.sMapping)];
      if (type == "useEffect") {
        let transformedData = transformData(
          response?.data?.data?.records,
          matchedFields,
          mappingFields,
          1
        );

        const newFreeData = heraferidata(
          { ...matchedFields, ...data?.component?.defaultLoad?.sMapping },
          feildsWithColumns,
          response?.data?.data?.records
        );
        const newData3 = [];
        for (let i = 0; i < newFreeData.length; i++) {
          newData3.push({ ...matchedFields, ...newFreeData[i], ...transformData[i] });
        }
        const finalData = []
        for(let i = 0; i < newData3.length; i++){
          finalData.push({...newData3[i], ...transformedData[i]})
        }
        setDebitCreditData(finalData);
      } else {
        // let transformedData = transformData(
        //   response?.data?.data?.records,
        //   matchedFields,
        //   mappingFields
        // );
        const newFreeData = heraferidata(
          { ...matchedFields, ...data?.component?.defaultLoad?.sMapping },
          feildsWithColumns,
          response?.data?.data?.records
        );
        const newData3 = [];
        for (let i = 0; i < newFreeData.length; i++) {
          newData3.push({ ...matchedFields, ...newFreeData[i] });
        }

        setDebitCreditData(newData3);

        // setFreeformdata(pre => [...pre, ...transformedData]);
        // setFreeformdata(transformedData);
      }
      setLoading(false);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }

  const [BulkLoadData, setBulkLoadData] = useState([]);
  const handleBulkLoad = type => {
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

    setDebitCreditData(transformedData);
    handleClose();
  };

  const fileChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = e => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = jsonData[0];
      const dataArray = jsonData.slice(1);
      const result = dataArray.map(row => {
        const obj = {};
        headers?.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });
      setCsvFile(removeBlankObjects(result));
    };
    reader.onerror = error => {
      console.error(error);
    };
    reader.readAsArrayBuffer(file);
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
    setDebitCreditData([]);
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
    setDebitCreditData(transformedData);
    handleClose();
    function transformData(data, allFields, mappingFields, ind = 2) {
      return data.map((item, index) => {
        let transformedItem = { id: index + 1 };
        // Copy all fields and values from allFields
        Object.entries(allFields)?.forEach(([key, value]) => {
          transformedItem[key] = value;
        });
        // Change the values of fields in mappingFields
        mappingFields?.forEach((field, ind) => {
          Object.keys(field)?.forEach((elm, ind) => {
            if (elm == Object.keys(field)[ind]) {
              // transformedItem[Object.values(field)[ind]] = item[elm] ?item[elm].toString():"" ;
              transformedItem[feildsWithColumns[elm]] = item[Object.values(field)[ind]];
            }
          });
        });
        return transformedItem;
      });
    }
  }
  function removeBlankObjects(data) {
    return data.filter(obj => Object.values(obj).some(val => val !== undefined && val !== ""));
  }
  
  return (
    <>
    {/* {JSON.stringify(columns)} */}
    
    <br />
      {/* {JSON.stringify(debitCreditData)} */}
      <Box style={{ display: "flex", justifyContent: "end" }}>
        {data?.component?.options?.mode === "DEBITCREDIT" &&
          JSON.stringify(data?.component?.menu?.bEnabled) == "true" && (
            <>
              <IconButton sx={{ cursor: "pointer" }} onClick={handleClick2}>
                <Icon aria-describedby={id} iconName={data?.component?.menu?.sIcon} sProps={data?.component?.menu?.sIconProps}/>
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
                  <ListItem>
                    {data?.component?.resetTable?.bEnabled === true && (
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
                          const newRow = [
                            {
                              id: 1,
                              ...existingIndex[0]?.tabledetails[0],
                              col_debit: "0.00",
                              col_credit: "0.00"
                            },
                            {
                              id: 2,
                              ...existingIndex[0]?.tabledetails[0],
                              col_debit: "0.00",
                              col_credit: "0.00"
                            }
                          ];

                          setDebitCreditData(newRow);
                          handleClose2();
                        }}
                        className="cursor-pointer"
                      >
                        Reset Table
                      </Typography>
                    )}
                  </ListItem>
                  <ListItem>
                    {data?.component?.clearValues?.bEnabled === true && (
                      <Typography
                      id={`${data?.component?.sName}-actions-2`}
                        className="cursor-pointer"
                        onClick={() => {
                          clearColumns(data?.component?.clearValues);
                          handleClose2();
                        }}
                      >
                        {data?.component?.clearValues?.sSubmenuCaption}
                      </Typography>
                    )}
                  </ListItem>
                  <ListItem>
                    {data?.component?.defaultLoad?.bEnabled === true && (
                      <Typography
                      id={`${data?.component?.sName}-actions-3`}
                        className="cursor-pointer"
                        onClick={() => {
                          hanldeGetDataFromElipsis(data?.component?.defaultLoad?.sDataSource, "btn");
                          handleClose2();
                        }}
                      >
                        {data?.component?.defaultLoad?.sSubmenuCaption}
                      </Typography>
                    )}
                  </ListItem>
                  <ListItem>
                    {data?.component?.bulkLoad?.bEnabled === true && (
                      <Typography
                      id={`${data?.component?.sName}-actions-4`}
                        className="cursor-pointer"
                        onClick={() => {
                          handleClickOpen(), 
                          setActionType("bulkLoad");
                          handleClose2();
                        }}
                      >
                        {data?.component?.bulkLoad?.sSubmenuCaption}
                      </Typography>
                    )}
                  </ListItem>
                  <ListItem>
                    {data?.component?.bulkLoad2?.bEnabled === true && (
                      <Typography
                      id={`${data?.component?.sName}-actions-5`}
                        className="cursor-pointer"
                        onClick={() => {
                          handleClickOpen(), setActionType("bulkLoad2");
                          handleClose2();
                        }}
                      >
                        {data?.component?.bulkLoad2?.sSubmenuCaption}
                      </Typography>
                    )}
                  </ListItem>
                  <ListItem>
                    {data?.component?.bulkLoad3?.bEnabled === true && (
                      <Typography
                      id={`${data?.component?.sName}-actions-6`}
                        className="cursor-pointer"
                        onClick={() => {
                          handleClickOpen(), setActionType("bulkLoad3");
                          handleClose2();
                        }}
                      >
                        {data?.component?.bulkLoad3?.sSubmenuCaption}
                      </Typography>
                    )}
                  </ListItem>

                  <ListItem className="cursor-pointer">
                    {data?.component?.loadFromFile?.bEnabled === true && (
                      <Typography
                      id={`${data?.component?.sName}-actions-7`}
                        className="cursor-pointer"
                        onClick={() => {
                          handleClickOpen(), setActionType("loadFromFile");
                          handleClose2();
                        }}
                      >
                        {data?.component?.loadFromFile?.sSubmenuCaption}
                      </Typography>
                    )}
                  </ListItem>
                </List>
              </Popover>
            </>
          )}{" "}
      </Box>
      {loading && (
        <Spinner />
      )}
      {data?.component?.options?.mode === "DEBITCREDIT" && (
        <DataGrid
          autoHeight
          rows={debitCreditData}
          columns={columns}
          pagination={false}
          disableColumnMenu={true}
          hideFooter={true}
          {...data.component?.sProps}
        />
      )}

      <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
        {data.component?.options?.mode === "DEBITCREDIT" && (
          <Box sx={{ border:data?.component?.options?.enableRowAdd &&"1px solid #42a5f5", height: "2%" }}>
            {data?.component?.options?.enableRowAdd && (
              <>
                <Button
                  startIcon={<AddCircleOutlinedIcon onClick={e => handleAddRow(e)} />}
                  id={`${data?.component?.sName}-addrow_button`}
                  sx={{
                    border: "none",
                    "&:hover": {
                      border: "none"
                    }
                  }}
                  variant="outlined"
                  onClick={e => handleAddRow(e)}
                >
                  Add Row
                </Button>
                <select onChange={handleAddRow} style={{ border: "none", outline: "none" }} id={`${data?.component?.sName}-addrow`}>
                  <option></option>
                  {options?.map((option, index) => {
                    return (
                      <option key={index} value={option?.value} id={`${data?.component?.sName}-addrow${option?.key}`}>
                        {option?.key}
                      </option>
                    )
                  })}
                </select>
              </>
            )}
          </Box>
        )}

        {data.component?.options?.mode === "DEBITCREDIT" && (
          <Box {...data.summaryfields?.sSummarycontainer?.sContainerProps}>
            <Grid container gap={10}>
              <Grid item>
                {/* <Typography component={"p"} variant="p">
                  Sub Total
                </Typography> */}
                <Typography variant="h6" className="w-[150px]" component={"h6"}>
                  Total 
                  {/* ({company?.data?.sBaseCurrency}) */}
                </Typography>
                <Typography className="text-red-500" variant="p" component={"p"}>
                  Difference
                </Typography>
              </Grid>
              <Grid item className="overflow-hidden">
               {/* <Typography component={"p"} variant="p" className="w-[150px] overflow-hidden ">
                  
                  {handlePointChange1(parseFloat(totalDebit).toFixed(2), 2)}
                </Typography>  */}
                <Typography variant="h6" component={"h6"} className="w-[110px] overflow-hidden" id={`${data?.component?.sName}-col_debittotals`}>
                  {/* {totalDebit?.toFixed(2)} */}
                  {handlePointChange1(parseFloat(totalDebit).toFixed(2), 2)}
                </Typography>
              </Grid>
              <Grid item>
                {/* <Typography component={"p"} variant="p" className="w-[150px] overflow-hidden">
                 
                  {handlePointChange1(parseFloat(totalCredit).toFixed(2), 2)}
                </Typography> */}
                <Typography variant="h6" component={"h6"} className="w-[140px] overflow-hidden" id={`${data?.component?.sName}-col_credittotals`}>
                  {/* {totalCredit?.toFixed(2)} */}
                  {handlePointChange1(parseFloat(totalCredit).toFixed(2), 2)}
                </Typography>
                <Typography
                  // className="text-red-500 w-[80px] overflow-hidden"
                  variant="p"
                  component={"p"}
                  id={`${data?.component?.sName}-difference`}
                >
                  {(() => {
                    const totalAll = +totalDebit - +totalCredit;
                    setdebitCreditTotalBalanced(!totalAll == 0);
                    return handlePointChange1(totalAll.toFixed(2),2);
                  })()}

                  {/* {()=>{ return +totalDebit?.toFixed(2) - +totalCredit?.toFixed(2)()}} */}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>

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
              freeForm={debitCreditData}
              sDisplayFormat={data?.component?.bulkLoad?.sDisplayFormat}
              token={token}
              data={data}
              uri={replacePlaceholder(data?.component?.[actionType]?.sDataSource, textValue)}
            />
          ) : (
            <>
              {!csvFile ? (
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Paper style={{ cursor: "pointer" }}>
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
                </Box>
              ) : (
                <>
                  {(() => {
                    const arry = Object.values(data?.component?.loadFromFile?.sMapping);
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
                                  >
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
}

export default DebitCredit;
