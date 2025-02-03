import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import AutoComplete from "../AutoComplete/AutoComplete";
import TextField from "@mui/material/TextField";
import DateComponent from "../DateComponent/DateComponent";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import CheckBoxComponent from "../CheckBox/CheckBoxComponent";
import SelectMainComponent from "../SelectComponent/SelectMainComponent";
import * as XLSX from "xlsx";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import * as MUIICon from "@mui/icons-material";

import Button from "@mui/material/Button";
import {
  Autocomplete,
  FormControl,
  Grid,
  textValue,
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
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import { Global_Data } from "../../globalData/GlobalData";
import { Icon } from "../../utils/MuiIcons/Icon";
import { serverAddress } from "../../config";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import SelectAllTransferList from "./Transfer/TransferList";
import { globalvalidateTextField, validateTextField } from "../../utils/validations/Validation";
import { toast } from "react-toastify";
import Spinner from "../../component/spinner/Spinner";

const TableComponent = ({
  formData,
  data,
  textValue,
  isSubmited,
  formAction,
  format,
  isDisabledTable,
  setmultirecordExist,
  formdata,
  setMultiRecordForBackend,
  setmultirecordValidateFunction
}) => {
  const [subTotal, setSubTotal] = useState({});
  const [subTotalDef, setSubTotalDef] = useState(null);

  const [firstTotal, setFirstTotal] = useState(0.0);
  const [secondTotal, setSecondtTotal] = useState(0.0);
  const [allfeildsNames, setAllfeildsNames] = useState({});

  const [fixedColumnFeilds, setFixedColumnFeilds] = useState({});

  const [multiRecordData, setMultiRecordData] = useState([]);
  const [deletedRows, setDeletedRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token, mainFormData } = Global_Data();
  // =================================

  // =================================
  // default data

  const [freeForm, setFreeformdata] = useState([]);
  const [comesFromDataBase, setComesFromDataBase] = useState([]);

  const [initialData, setInitialData] = useState([]);

  const [multiRecordError, setmultiRecordError] = useState([]);
  const [multiRecordValidation, setmultiRecordValidation] = useState({});

  const evaluateCondition = (condition) => {
    if (condition === 'true') return true;
    if (condition === 'false') return false;
    if (condition === '!true') return false;
    if (condition === '!false') return true;
    return false;
  };

  useEffect(() => {
    if(freeForm && freeForm.length == 0){
      setFreeformdata([{ ...initialData[0], id: freeForm.length + 1}])
    }
  }, [freeForm])

  useEffect(() => {
    const freeclms = { id: 1 };
    const validate = {};
    if (data?.child) {
      data.child?.forEach(item => {
        if (item?.component.sType == "CHECKBOX") {
          freeclms[item?.component.sName] = item.component.sDefaultValue;
          validate[item?.component.sName] = item.validation;
        } else {
          freeclms[item?.component.sName] = item?.component.sDefaultValue || "";
          validate[item?.component.sName] = item.validation;
        }
      });
    }

    data.fixcolumns?.forEach(item => {
      freeclms[item?.sColumnID] = item?.inputType?.component?.sDefaultValue;
    });

    setmultiRecordValidation(validate);
    setInitialData([JSON.parse(JSON.stringify(freeclms))]);
    setFreeformdata([freeclms]);
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
          const finaldata1 = response?.data?.data.records?.map((item, index) => ({
            ...item,
            id: index + 1
          }));

          //  alert(JSON.stringify( typeof response?.data?.data.records))
          if (formAction === "EDIT") {
            // setRows(finaldata);

            setFreeformdata(finaldata1);

            const initialValues = {};
            for (const { sSummaryID, sInputValue } of datahandling) {
              initialValues[sSummaryID] = sInputValue;
            }
            setSubTotal(initialValues);
            setSubTotalDef(initialValues);
          }
        }
        setLoading(false);
      } catch (error) {
        // Handle error
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [formAction, formdata?.form?.sFormSource, baseURL]);

  const columns = [];

  // use this const data in useState

  function removeCommas(inputString) {
    let result = "";
    for (let i = 0; i < inputString?.length; i++) {
      if (inputString[i] !== ",") {
        result += inputString[i];
      }
    }
    return result;
  }

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

  const FreeFormInput = (e, id, type, decimalPlace) => {
    const { name, value } = e.target;
    // alert(value)
    const value2 = type == "number" ? handlePointChange1(value, decimalPlace) : value;
    // alert(value2)
    const list = [...freeForm];
    const index = list.findIndex(row => row.id === id);
    list[index][name] = value2;

    list[index]["sAction"] = list[index]["sAction"]
      ? list[index]["sAction"]
      : comesFromDataBase.length > 0
      ? "EDIT"
      : "ADD";
    setFreeformdata(list);
    const err = validateTextField(value, multiRecordValidation[name]);
    setmultiRecordError(preState => {
      preState[index] = { ...preState[index], [name]: err };
      return preState;
    });
  };
  const fixedClmNumberInput2 = (e, id, type, decimalPlace, name) => {
    const { value } = e.target;
    const value2 = type == "number" ? handlePointChange1(value, decimalPlace) : value;
    const list = [...freeForm];
    const index = list.findIndex(row => row.id === id);
    list[index][name] = value2;
    list[index]["sAction"] = list[index]["sAction"] || "EDIT";
    setFreeformdata(list);
    const err = validateTextField(value, multiRecordValidation[name]);
    setmultiRecordError(preState => {
      preState[index] = { ...preState[index], [name]: err };
      return preState;
    });
  };

  const FreeFormCallBack = (e, id, name) => {
    if (e) {
      let { value = "" } = e || "";
      const list = [...freeForm];
      const index = list.findIndex(row => row.id === id);
      list[index][name] = e;
      list[index]["sAction"] = list[index]["sAction"]
        ? list[index]["sAction"]
        : comesFromDataBase.length > 0
        ? "EDIT"
        : "ADD";

      // alert(JSON.stringify(list));
      setFreeformdata(list);
      const err = validateTextField(value, multiRecordValidation[name]);
      setmultiRecordError(preState => {
        preState[index] = { ...preState[index], [name]: err };
        return preState;
      });
    }
  };

  const handledatachange = (e, id, name) => {
    const list = [...freeForm];
    const index = list.findIndex(row => row.id === id);
    list[index][name] = e;
    list[index]["sAction"] = list[index]["sAction"]
      ? list[index]["sAction"]
      : comesFromDataBase.length > 0
      ? "EDIT"
      : "ADD";

    setFreeformdata(list);

    const err = validateTextField(e, multiRecordValidation[name]);
    setmultiRecordError(preState => {
      preState[index] = { ...preState[index], [name]: err };
      return preState;
    });
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
          "VARTEXT",
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
    config?.forEach(processField);
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

  const handleAddRow1 = e => {
    const filteredComponents = filterComponentsRecursive(mainFormData.details);
    const tableData = getDataByType("MULTIRECORD", filteredComponents);
    const existingIndex = tableData?.filter(
      item => item.sInputTableName === data?.component?.sName
    );
    const newRow = {};

    if(freeForm?.[0]){
      Object.keys(freeForm[0]).map(elm => (newRow[elm] = ""));
    }

    if (e?.target?.value) {
      const numNewRows = parseInt(e.target.value);
      const newRows = Array.from({ length: numNewRows }, (_, i) => ({
        id: freeForm.length + i + 1,
        ...initialData[0]
      }));

      const updArr = [...freeForm, ...newRows];
      updArr?.forEach((item, index) => {
        item.id = index + 1;
        item.sAction = "ADD";
      });

      setFreeformdata(updArr);
    } else {
      setFreeformdata([
        ...freeForm,
        { ...initialData[0], id: freeForm.length + 1, sAction: "ADD" }
      ]);
    }
  };

  function getErrorDetails(data, Id) {
    const rtnData = data.filter(elm => elm?.id == Id);
    if (rtnData.length > 0) {
      return rtnData[0];
    } else {
      return false;
    }
  }

  const handleCloneData = (data, ind) => {
    const arr = [];
    const filterData = data.filter(item => item?.id === ind);

    for (let i = 0; i < data.length; i++) {
      if (i === ind - 1) {
        arr.push({ ...filterData[0] });
        arr.push({ ...filterData[0], id: filterData[0]?.id + 1 });
      } else if (i < ind - 1) {
        arr.push(data[i]);
      } else {
        arr.push({ ...data[i], id: data[i]?.id + 1 });
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

  const handleDelete1 = id => {
    const array = [...freeForm];
    const indexToRemove = array.findIndex(item => item.id === id);
    const deletedRow = array[indexToRemove];
    deletedRow["sAction"] = "DELETE";
    setDeletedRows(preState => [...preState, deletedRow]);
    if (indexToRemove !== -1) {
      array.splice(indexToRemove, 1);
      for (let i = indexToRemove; i < array.length; i++) {
        array[i].id = i + 1;
      }
    }
    
    if (array.length == 0) {
      // alert('ll')
      setFreeformdata([{ id: 1, ...initialData[0] }]);
    } else {
      // alert('llww')
      setFreeformdata(array);
    }
  };

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  const validatefeilds = () => {
    // const returnData = freeForm.map(textValue => {
    //   const errors = globalvalidateTextField(textValue, multiRecordValidation);

    //   const index = multiRecordError.findIndex(row => row.id == textValue.id);

    //   if (index != -1) {
    //     alert(1)
    //     const newData = JSON.parse(JSON.stringify(multiRecordError));
    //     newData[index] = { ...errors, id: index +1 };
    //     setmultiRecordError(newData);
    //   } else {
    //     alert(2)
    //     setmultiRecordError(preState => {
    //       const index = preState.findIndex(row => row.id == textValue.id);
    //       if (index == -1) {
    //         return [...preState, { ...errors, id: index +1  }];
    //       }else{
    //         return preState
    //       }
    //     });
    //   }

    //   return isEmpty(errors);
    //   // setmultiRecordError(errors);
    //   // return isEmpty(errors);
    // });

    let value1 = 0; // Initialize value1 to avoid undefined behavior
    let value2 = 0; // Initialize value1 to avoid undefined behavior
    for (let i = 0; i < freeForm.length; i++) {
      value1 += +freeForm[i]["col_column1"]?.toString()?.replace(/,/g, "");
      value2 += +freeForm[i]["col_column2"]?.toString()?.replace(/,/g, "");
    }

    if (data?.component?.options?.submode == "ALLOWEQUAL" && value1 != value2) {
      toast.warn("Debit and Credit Should Be Equal");
      return true;
    }

    const returnData = freeForm.map(textValue => {
      let errors = globalvalidateTextField(textValue, multiRecordValidation);
      const index = multiRecordError.findIndex(row => row?.id == textValue?.id);
      if(freeForm && freeForm.length == 1 && deletedRows && deletedRows.length > 0){
        errors = [];
      }
      if (index != -1) {
        const newData = JSON.parse(JSON.stringify(multiRecordError));
        newData[index] = { ...errors, id: textValue.id };
        setmultiRecordError(newData);
      } else {
        setmultiRecordError(preState => {
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

  function removeEmptyActions(arr) {
    return arr.filter(obj => obj.sAction !== undefined && obj.sAction.trim() !== "");
  }

  function compareAndUpdateActions(Backenddata, changedData) {
    if (Backenddata.length > 0 && changedData.length > 0) {
      changedData?.forEach(changedObj => {
        const correspondingObj = Backenddata.find(obj => {
          // alert(`${obj.id}  has ${changedObj.id}`)
          return obj?.id == changedObj?.id;
        });
        if (correspondingObj) {
          const allKeysMatch = Object.keys(changedObj).every(
            key => changedObj[key] == correspondingObj[key]
          );
          if (!allKeysMatch) {
            changedObj.sAction = "EDIT";
          }
        } else {
          changedObj.sAction = "ADD";
        }
      });
      return changedData;
    }
  }
  function removeEmptyObjects(data, notCheckKeys) {
    return data?.filter(obj => {
      for (let key in obj) {
        if (
          !notCheckKeys.includes(key) &&
          obj[key] !== "" &&
          obj[key] !== "0.00" &&
          obj[key] !== "ADD"
        ) {
          return true; // Object should be kept if any non-excluded key has a non-empty value
        }
      }
      return false; // Remove object if all non-excluded keys are empty
    });
  }
  function replaceKeysforBackend(dataArray, fieldData) {
    const newDataArray = [];
    dataArray?.forEach(item => {
      const newItem = {};

      for (const key in item) {
        if (fieldData?.hasOwnProperty(key)) {
          newItem[fieldData[key]] = item[key];
        } else {
          newItem[key] = item[key];
        }
      }
      newDataArray.push(newItem);
    });
    return newDataArray;
  }
  function matchArrays(arr1, arr2, excludeFields) {
    // Check if arrays have the same length
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Iterate over each object in the arrays
    for (let i = 0; i < arr1.length; i++) {
      const obj1 = arr1[i];
      const obj2 = arr2[i];

      // Check if number of keys is the same
      const keys1 = Object.keys(obj1)
        .filter(key => !excludeFields.includes(key))
        .sort();
      const keys2 = Object.keys(obj2)
        .filter(key => !excludeFields.includes(key))
        .sort();
      if (keys1.length !== keys2.length || !keys1.every((key, index) => key === keys2[index])) {
        return false;
      }

      // Compare key-value pairs
      for (const key of keys1) {
        if (obj1[key] !== obj2[key]) {
          return false;
        }
      }
    }

    // Arrays are identical
    return true;
  }

  useEffect(() => {
    // const sTermIDs = new Map(comesFromDataBase.map(obj => [obj.sInventoryCode, true]));
    // Loop through data2 to update sAction

    // const updatedData2 = mergedData.map(obj => {
    //   if (!sTermIDs.has(obj.sTermID)) {
    //     if (obj.sAction !== "DELETE" && obj.sAction !== "EDIT") {
    //       obj.sAction = "ADD" ;
    //     }
    //   }
    //   return obj;
    // });

    const mergedData = freeForm;

    //  alert(JSON.stringify(freeForm));
    const updatedData = compareAndUpdateActions(comesFromDataBase, mergedData) || mergedData;
    const updatedData2 = updatedData?.concat(deletedRows);
    // Sort merged array based on the id
    // updatedData?.sort((a, b) => a.id - b.id);
    // Update the id of each object
    // alert(JSON.stringify(updatedData2));
    updatedData?.forEach((item, index) => {
      item.id = index + 1;
    });
    const notCheck = ["id"];
    const result = removeEmptyObjects(updatedData2, notCheck);
    setMultiRecordData(result);

    const modifiedData = replaceKeysforBackend(result, fixedColumnFeilds);

    let excludeFields = ["id"];
    let resultMatched = matchArrays(modifiedData, comesFromDataBase, excludeFields);
    if (resultMatched) {
      setMultiRecordForBackend([]);
    } else {
      // setMultiRecordForBackend( modifiedData);
      setMultiRecordForBackend(removeEmptyActions(modifiedData));
    }

    let value1 = 0; // Initialize value1 to avoid undefined behavior
    let value2 = 0; // Initialize value1 to avoid undefined behavior
    for (let i = 0; i < freeForm.length; i++) {
      value1 += +freeForm[i]["col_column1"]?.toString()?.replace(/,/g, "");
      value2 += +freeForm[i]["col_column2"]?.toString()?.replace(/,/g, "");
    }
    setFirstTotal(value1);
    setSecondtTotal(value2);
    setmultirecordExist(true);
    setmultirecordValidateFunction(() => validatefeilds);
    return () => {
      setmultirecordValidateFunction(false);
      setmultirecordExist(false);
    };
  }, [freeForm, comesFromDataBase]);

  data?.child?.forEach(item => {
    const addTodo = useMemo(() => {
      setAllfeildsNames(pre => ({
        ...pre,
        [item?.inputtable?.sColumnID]: item?.component?.sName,
        header: item?.inputtable?.sHeader
      }));
    }, [item]);
    // alert(JSON.stringify(item))
evaluateCondition(item?.inputtable?.bVisible) &&
      columns.push({
        field: item.inputtable.sColumnID,
        headerName: item.inputtable.sHeader,
        width: item.inputtable.iWidth,
        // editable: item.inputtable.bEditable,
        sortable: false,
        renderCell: params => {
          if (item?.component?.sType === "VARTEXT") {
            const styleFormatData = format?.data?.records?.find(
              item1 => item1?.sFieldName == item?.component?.sName
            );
            const Icons = MUIICon?.[styleFormatData?.sStatusIcon];
            const parsedData = styleFormatData ? JSON.parse(styleFormatData?.sFieldFormat) : {};
            return (
              <>
                {/* {JSON.stringify(styleFormatData?.sFieldFormat)} */}
                {evaluateCondition(item?.inputtable?.bVisible) ? (
                  <Typography {...parsedData}>
                    {styleFormatData?.sStatusIcon && <Icons />}
                    {freeForm[params?.row?.id - 1]?.[item?.component?.sName]}
                  </Typography>
                ) : null}
              </>
            );
          }

          if (item?.component.sType === "NUMBER") {
            const editable = item.inputtable.bEditable == 0 ? true : false;
            // console.log(isDisabledTable == false ? editable : isDisabledTable,'kkkki');
            const val = useMemo(() => {
              if (freeForm && freeForm[params.row.id - 1]?.[item.component.sName] !== "") {
                return handlePointChange1(
                  freeForm[params.row.id - 1]?.[item.component.sName]?.toString(),
                  item?.component?.iDecimalPlaces
                );
              }
            }, [freeForm]);

            return (
              <>
                {evaluateCondition(item?.inputtable?.bVisible)? (
                  <>
                    <TextField
                      id={`${item?.component?.sName}-${params.row.id}`}
                      placeholder={item?.component?.sPlaceHolder}
                      name={item?.component?.sName}
                      inputProps={{ style: { textAlign: item?.component?.sJustify } }}
                      onChange={e => {
                        FreeFormInput(e, params.row.id, "number", item?.component.iDecimalPlaces);
                      }}
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
                      InputProps={
                        item?.component?.sAdornPosition === "Start"
                          ? {
                              startAdornment: (
                                <>
                                  {item?.component?.sAdornPosition &&
                                    item?.component?.sAdornType === "Icon" && (
                                      <InputAdornment position={item?.component?.sAdornPosition}>
                                        <Icon iconName={item?.component?.sIcon?.slice(0, -4)} />
                                      </InputAdornment>
                                    )}
                                  {item?.component?.sAdornPosition &&
                                    item?.component?.sAdornType === "Text" && (
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
                                    item?.component?.sAdornType === "Icon" && (
                                      <InputAdornment position={item?.component?.sAdornPosition}>
                                        <Icon iconName={item?.component?.sIcon.slice(0, -4)} />
                                      </InputAdornment>
                                    )}
                                  {item?.component?.sAdornPosition &&
                                    item?.component?.sAdornType === "Text" && (
                                      <InputAdornment position={item?.component?.sAdornPosition}>
                                        {item?.component?.sIcon}
                                      </InputAdornment>
                                    )}
                                </>
                              )
                            }
                      }
                    />
                  </>
                ) : null}
              </>
            );
          }
          if (item?.component.sType === "AUTOCOMPLETE") {
            const editable = item.inputtable.bEditable == 0 ? true : false;

            return evaluateCondition(item?.inputtable?.bVisible) ? (
              <>
                {/* {JSON.stringify(item)} */}
                <AutoComplete
                  formcallback={e => FreeFormCallBack(e, params?.row.id, item?.component?.sName)}
                  data={item}
                  textValue1={freeForm[params.row.id - 1]}
                  placeholder={item?.component?.sPlaceHolder}
                  rowsdataFree={
                    freeForm &&
                    freeForm[params.row.id - 1] &&
                    freeForm[params.row.id - 1][item?.component?.sName]
                  }
                  errors={getErrorDetails(multiRecordError, params.row.id)[item?.component?.sName]}
                  Automod={data?.component?.options?.mode}
                  formaction={formAction}
                  isDisabledTable={editable}
                  isSubmited={isSubmited}
                  {...item?.component?.sProps}
                />
              </>
            ) : null;
          } else if (item?.component.sType === "TEXTFIELD") {
            const editable = item.inputtable.bEditable == 0 ? true : false;
            const validateInput = (value) => /^[a-zA-Z0-9-\s]*$/.test(value);
            return evaluateCondition(item?.inputtable?.bVisible) ? (
              <TextField
                id={`${item?.component?.sName}-${params.row.id}`}
                placeholder={item?.component?.sPlaceHolder}
                name={item?.component?.sName}
                // helperText={
                //   getErrorDetails(multiRecordError, params.row.id)[item?.component?.sName] ||
                //   item?.component?.sHelper
                // }
                helperText={
                  !validateInput(freeForm?.[params.row.id - 1]?.[item.component.sName])
                    ? item?.validation?.sErrorMessage
                    : getErrorDetails(multiRecordError, params.row.id)[item?.component?.sName] ||
                      item?.component?.sHelper
                }
                // helperText={error?.[data?.component?.sName]||data?.component?.sHelper}
                // error={getErrorDetails(multiRecordError, params.row.id)[item?.component?.sName]}
                error={
                  !validateInput(freeForm?.[params.row.id - 1]?.[item.component.sName]) ||
                  getErrorDetails(multiRecordError, params.row.id)[item?.component?.sName]
                }
                label={item?.component?.sLabel}
                disabled={editable}
                onChange={e => {
                  FreeFormInput(e, params.row.id);
                  e.stopPropagation();
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
                value={
                  freeForm &&
                  freeForm[params.row.id - 1] &&
                  freeForm[params.row.id - 1][item.component.sName]
                }
                {...item?.component?.sProps}
                onKeyDown={event => {
                  event.stopPropagation();
                }}
              />
            ) : null;
          } else if (item?.component.sType === "DATETIME") {
            const editable = item.inputtable.bEditable == 0 ? true : false;

            return evaluateCondition(item?.inputtable?.bVisible) ? (
              <DateComponent
                disabled={editable}
                handledatechange={e => handledatachange(e, params.row.id, item?.component?.sName)}
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
            ) : null;
          } else if (item?.component.sType === "CHECKBOX") {
            return evaluateCondition(item?.inputtable?.bVisible)? (
              <CheckBoxComponent
                data={item}
                handleCheckbox={e => handledatachange(e, params.row.id, item?.component?.sName)}
                datacheckvalue={
                  freeForm &&
                  freeForm[params.row.id - 1] &&
                  freeForm[params.row.id - 1][item?.component.sName]
                }
                params={params}
                datemod={data?.component?.options?.mode}
                formactions={formAction}
                {...item?.component?.sProps}
              />
            ) : null;
          } else if (item?.component.sType === "SELECT") {
            // console.log(item,'component5666');

            const editable = item.inputtable.bEditable == 0 ? true : false;
            // alert(isDisabledTable == false? editable: isDisabledTable)

            return evaluateCondition(item?.inputtable?.bVisible)? (
              <FormControl {...item?.component?.options?.others1}>
                <SelectMainComponent
                  isDisabledTable={isDisabledTable == false ? editable : isDisabledTable}
                  textValue={freeForm && freeForm[params.row.id - 1] && freeForm[params.row.id - 1]}
                  handledatasend={e => handledatachange(e, params.row.id, item?.component?.sName)}
                  taxUrlFree={item?.data?.sDataSource}
                  errors={getErrorDetails(multiRecordError, params.row.id)[item?.component?.sName]}
                  sColumnID={item?.component?.sName}
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
                />
              </FormControl>
            ) : null;
          } else {
            return;
          }
        }
      });
  });
  data?.fixcolumns?.forEach((item, ind) => {
    // const addTodo = useMemo(() => {
    //   setFixedColumnFeilds((pre)=>({...pre, [item.sColumnID]: item.inputType?.component.sName}))
    // }, [item]);

    // const editable = true

    evaluateCondition(item?.bVisible) &&
      columns.push({
        field: item.sColumnID,
        headerName: item.sHeader,
        width: item.iWidth,
        // editable: item.bEditable,
        type: item.sType,
        sortable: true,
        renderCell: params => {
          useMemo(() => {
            setFixedColumnFeilds(pre => ({
              ...pre,
              [item.sColumnID]: item.inputType?.component.sName
            }));
          }, []);
          const editable = item.bEditable == 0 ? true : false;
          return (
            <>
              {evaluateCondition(item?.bVisible)? (
                <>
                  <TextField
                    id={`${item?.inputType?.component?.sName}-${params.row.id}`}
                    placeholder={item?.inputType?.component?.sPlaceHolder}
                    name={item?.inputType?.component?.sName}
                    inputProps={{ style: { textAlign: item?.inputType?.component?.sJustify } }}
                    onChange={e => {
                      fixedClmNumberInput2(
                        e,
                        params.row.id,
                        "number",
                        item?.inputType?.component.iDecimalPlaces,
                        item.sColumnID
                      );
                    }}
                    disabled={isDisabledTable == false ? editable : isDisabledTable}
                    value={freeForm[params.row.id - 1]?.[item.sColumnID]}
                    {...item?.inputType?.component?.sProps}
                    {...item?.inputType?.component?.options?.others1}
                    onKeyDown={handleFocus}
                    onFocus={handleFocus}
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
                </>
              ) : null}
            </>
          );
        }
      });
  });

  if (
    data?.component?.options?.enableRowDelete ||
    data?.component?.options?.enableRowClone ||
    data?.component?.options?.enableRowAdd
  ) {
    {
      columns.push({
        field: "actions",
        headerName: "Actions",
        width: 150,
        sortable: false,
        disableColumnMenu: true,
        renderCell: params => {
          if (params.row.id === 1) {
            return (
              <>
                {data?.component?.options?.enableRowAdd && (
                  <IconButton 
                    onClick={e => handleAddRow1(e)} 
                    aria-label="add"
                    id={data.component.sName + "-add-" + params.row.id}
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
                    onClick={() => handleDelete1(params.row.id)} 
                    aria-label="delete"
                    id={data.component.sName + "-delete-" + params.row.id}
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
                    onClick={e => handleAddRow1(e)} 
                    aria-label="add" 
                    id={data.component.sName + "-add-" + params.row.id}
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
                    onClick={() => handleDelete1(params.row.id)} 
                    aria-label="delete" 
                    id={data.component.sName + "-delete-" + params.row.id}
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
  const [anchorEl1, setAnchorEl1] = React.useState(null);

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
      mappingFields?.forEach(field => {
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
      matchKey?.forEach(item => {
        if (rowKey.includes(item)) {
          matchedElements[matchfeild[item]] = receivdata[i][item];
        }
      });
      arr.push(row);
    }

    return arr;
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

      const replacedObject = replaceKeys(i, matchedElements, allfeild);
      arr.push({ sAction: "", ...replacedObject });
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
  async function hanldeGetDataFromElipsis(uri, type) {
    try {
      setLoading(true)
      const response = await axios.get(serverAddress + uri, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      });

      const matchedFields = initialData[0];
      const respData = response?.data?.data?.records
      ? response?.data?.data?.records
      : response?.data?.data?.multirecord;

      const newFreeData = heraferidata(
        { ...matchedFields, ...data?.component?.defaultLoad?.sMapping },
        allfeildsNames,
        respData
      );

      let newData3 = [];
      for (let i = 0; i < newFreeData.length; i++) {
        newData3.push({ ...matchedFields, ...newFreeData[i] });
      }

      // first time data load
      setFreeformdata(newData3);

      setComesFromDataBase(JSON.parse(JSON.stringify(newData3)));
      setLoading(false);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }

  const [selectedLoadfromFile, setSelectedLoadfromFile] = useState();

  useEffect(() => {
    const fetchDataIfNeeded = async () => {
      await hanldeGetDataFromElipsis(data?.component?.defaultLoad?.sDataSource, "useEffect");
    };

    fetchDataIfNeeded();
  }, [initialData]);

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

    setFreeformdata(transformedData);
    handleClose();
  };

  //================================================================================================================================
  const [actionType, setActionType] = useState("");
  const [fileInputKey] = useState(Date.now());
  const [csvFile, setCsvFile] = useState();

  function removeBlankObjects(data) {
    return data.filter(obj => Object.values(obj).some(val => val !== undefined && val !== ""));
  }

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
  csvFile?.forEach((item, ind) => (item.id = ind + 1));
  // const clearColumns = data => {
  //   let allfeilds = Object.keys(data.sMapping);
  //   const newVal = freeForm.map(item => {
  //     const newItem = { ...item }; // Create a copy of the item object
  //     allfeilds?.forEach(field => {
  //       if (newItem.hasOwnProperty(field)) {
  //         newItem[field] = ""; // Clear the value of the field
  //       }
  //     });
  //     return newItem;
  //   });
  //   setFreeformdata(newVal);
  // };

  const handlePointChange = (num1, decimalPlaces = 0) => {
    // function handlePointChange1(num1, decimalPlaces = 0) {
      if (num1) {
        
      
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
    }

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
        if (newItem.hasOwnProperty(value) && key === data?.component?.clearValues?.sMapping) {
          data?.child?.forEach((item) => {
            if(item?.component?.iDecimalPlaces){
              newItem[value] = handlePointChange(0, item?.component?.iDecimalPlaces);
            } else {
              newItem[value] = 0;
            }
          })
        }
      });
      return newItem;
    });
    setFreeformdata(newVal);
    handleClose2();
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
    setFreeformdata([]);
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
        Object.entries(allFields)?.forEach(([key, value]) => {
          transformedItem[key] = value;
        });
        // Change the values of fields in mappingFields
        mappingFields?.forEach((field, ind) => {
          Object.keys(field)?.forEach((elm, ind) => {
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

  return (
    <>
      {/* {JSON.stringify(data.component.sType)} */}
{/* aaa */}
      <Box sx={{ width: "100%", marginBottom: "1rem", marginTop: "1rem" }}>
        {data?.component?.options?.submode !== "HIDDEN" && (
          <>
            <Box style={{ display: "flex", justifyContent: "end" }}>
              {JSON.stringify(data?.component?.menu?.bEnabled) == "true" && (
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
                            onClick={() => clearColumns(data)}
                          >
                            {data?.component?.clearValues?.sSubmenuCaption}
                          </Typography>
                        </ListItem>
                      )}
                      {data?.component?.defaultLoad?.bEnabled === true && (
                        <ListItem>
                          <Typography
                            id={`${data?.component?.sName}-actions-3`}
                            className="cursor-pointer"
                            onClick={() =>
                              hanldeGetDataFromElipsis(
                                data?.component?.defaultLoad?.sDataSource,
                                "btn"
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
                            id={`${data?.component?.sName}-actions-4`}
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
                            id={`${data?.component?.sName}-actions-5`}
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
                            id={`${data?.component?.sName}-actions-6`}
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
                            id={`${data?.component?.sName}-actions-7`}
                            className="cursor-pointer"
                            onClick={() => {
                              handleClickOpen(), setActionType("loadFromFile");
                            }}
                          >
                            {data?.component?.loadFromFile?.sSubmenuCaption}
                          </Typography>
                        </ListItem>
                      )}
                    </List>
                  </Popover>
                </>
              )}{" "}
            </Box>
            {loading && (
                  <Spinner />
            )}
            <DataGrid
              autoHeight
              rows={freeForm}
              columns={columns}
              pagination={true}
              disableColumnMenu={true}
              hideFooter={false}
              {...data.component?.sProps}
            />

            <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
              {data?.component?.options?.enableRowAdd && (
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
                    onChange={e => handleAddRow1(e)}
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
              {data?.component?.options?.mode == "COMPUTATIONAL" && (
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
            </Box>
          </>
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
              freeForm={freeForm}
              sDisplayFormat={data?.component?.bulkLoad?.sDisplayFormat}
              token={token}
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
};

export default TableComponent;
