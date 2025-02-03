import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import { Box } from "@mui/system";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Button from "@mui/material/Button";
import * as XLSX from "xlsx";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from '@mui/material/CircularProgress';

import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Popover,
  Select,
  Skeleton,
  TextField,
  Typography
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import { baseURL } from "../../api";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

import InputTableDefaultAllComponent from "./InputTableDefaultAllComponent";
import { Icon } from "../../utils/MuiIcons/Icon";
import axios from "axios";
import { serverAddress } from "../../config";
import { Global_Data } from "../../globalData/GlobalData";
import SelectAllTransferList from "./Transfer/TransferList";
import { globalvalidateTextField, validateTextField } from "../../utils/validations/Validation";
import { vsprintf } from "sprintf-js";
import WarningModal from "../../component/WarningModal/WarningModal";
import Spinner from "../../component/spinner/Spinner";

function getErrorDetails(data, Id) {
  const rtnData = data.filter(elm => elm?.id == Id);
  if (rtnData?.length > 0) {
    return rtnData[0];
  } else {
    return false;
  }
}

const CustomLoader = ({ loading, rows = [], columns = [], rowHeight = 52 }) => {
  if (!loading) return null;
  const columnWidths = columns.map(col => col.width || 150);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          paddingBottom: 1, 
          borderBottom: '1px solid #e0e0e0', 
          marginBottom: 1, 
        }}
      >
        {columns.map((col, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="rectangular"
            width={col?.width || 150}  
            height={48} 
            sx={{
              marginRight: 1,
              borderRadius: 1,
            }}
          />
        ))}
      </Box>

      <Box sx={{ width: '100%', height: '100%' }}>
        {Array.from({ length: rows.length }).map((_, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 1, 
            }}
          >
            {columnWidths.map((width, colIndex) => (
              <Skeleton
                key={colIndex}
                variant="rectangular"
                width={width}  
                height={rowHeight}  
                sx={{
                  marginRight: 1, 
                  borderRadius: 1,  // Optional: rounded corners for the skeletons
                }}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

function InputTableDefault({
  isSubmited,
  formAction,
  data,
  format,
  company,
  handleClickOpen2,
  textValue,
  tabledata,
  tablesummaryfields,
  mainFormData,
  formData,
  freeFromTotals,
  setcheckMaxTotalValue,
  setallowZeroValue,
  setdefaultTableNameAndModel,
  documentSelectTableData,
  documentSelectmappingData,
  setFreeFromTotal,
  defaultTableEditData,
  setdefaultTableValidateFunction,
  freeFormTabbleEditMainrecord,
  setFreeFormTabbleEditMainrecord
}) {
  const {
    token,
    setTextValue,
    defaultTableSummaryData,
    defaultTableSummaryFeild,
    setdefaultTableSummaryFeild,
    globalvariables,
    setDefaultTableSummaryData,
    globalDefaultAutoValueData,
    setDefaultTableCSVFile,
    clearWithholdingTax, setClearWithholdingTax, defaultTableSelectedSupplier, defaultTableSelectedDataAwareData,
    conversionNamesMapping
  } = Global_Data();
  const [rows, setRows] = useState([]);
  const [defalutState, setDefaultState] = useState({});
  const [price, setPrice] = useState(null);
  const [colTaxOption, setcolTaxOption] = useState([]);
  const [colTaxOptions, setcolTaxOptions] = useState([]);
  const [totalLimit, setTotalLimit] = useState(null);
  const [loader, setLoader] = useState();
  const [columnDataAware, setColumnDataAware] = useState([]);
  const [dataAwareDynamicColumns, setDataAwareDynamicColumns] = useState([]);
  const [dataAwareFixColumns, setDataAwareFixColumns] = useState([]);
  const [resetTable, setResetTable] = useState(false);
  const [rowClone, setRowClone] = useState();
  const [csvFile, setCsvFile] = useState();
  const [loadQtyCodesCSVData, setLoadQtyCodesCSVData] = useState([]);
  const [csvFileLoader, setCSVFileLoader] = useState(false);

  const [subTotal, setsubTotal] = useState("0.00");
  const [summaryFeilds, setsummaryFeilds] = useState({});
  const [resetQuantityTypeDefault, setResetQuantityTypeDefault] = useState([]);
  const [taxDefaultValueCode, setTaxDefaultValueCode] = useState([]);
  const [isPriceSelectClicked, setIsPriceSelectClicked] = useState(false);
  // console.log("taxDefaultValueCode", taxDefaultValueCode);

  const [summ_handling, setSumm_handling] = useState(parseFloat(0).toFixed(2));
  const [summ_shipping, setSumm_shipping] = useState(parseFloat(0).toFixed(2));
  const [summ_discount, setSumm_discount] = useState(parseFloat(0).toFixed(2));
  const [summ_adjustment, setSumm_adjustment] = useState(parseFloat(0).toFixed(2));
  const [summ_tax, setSumm_tax] = useState(parseFloat(0).toFixed(2));
  const [summ_grandTotal, setSumm_grandTotal] = useState(parseFloat(0).toFixed(2));
  const [bulkDataLoaded, setBulkDataLoaded] = useState(false);

  const [summaryTaxSelect, setSummaryTaxSelect] = React.useState({});
  const [allFeildForDoucmentSelect, setallFeildForDoucmentSelect] = React.useState({});
  const [allfeildsNames, setAllfeildsNames] = useState({});
  const [summaryValidationFeilds, setsummaryValidationFeilds] = useState([]);
  const [summaryFeildsBPayLoad, setsummaryFeildsBPayLoad] = useState({});

  const [summaryForBackend, setSummaryForBackend] = useState([]);
  const [mainTableID, setMainTableID] = useState("");
  const [quantityTypeMapping, setQuantityTypeMapping] = useState([]);

  const [alloceteValue, setAllocate] = useState("Percentage");
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [defaultTableError, setdefaultTableError] = useState([]);
  const [summaryError, setSummaryError] = useState({});
  const [defaultTableValidation, setdefaultTableValidation] = useState({});
  const [kitMappingArray, setkitMappingArray] = useState([]);
  const [selectedCurrency, setSelectedCurrecy] = useState("");
  const [editCurrencyPopulated, setEditCurrencyPopulated] = useState(false);
  const [selectedTax, setSelectedTax] = useState("Exclusive");
  const [priceSelect, setPriceSelect] = useState("Manual");
  const [loading, setLoading] = useState(false);
  const [summaryTaxID, setSummaryTaxID] = useState("");

  const [priceSelectFetchApi, setPriceSelectFetchApi] = useState("");

  const [allTypesTaxes, setAllTypesTaxes] = useState([]);
  const [allTypesTaxesArry, setAllTypesTaxesArry] = useState([]);
  const [exchangeRateField, setexchangeRateField] = useState({});
  const [availableFieldDataAware, setAvailableFieldDataAware] = useState([]);
  const [editDataQtyType, setEditDataQtyType] = useState([]);
  const csvBatchSize = 50;

  useEffect(() => {
    setLoader(true);

    const timer = setTimeout(() => {
      setLoader(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  function isDecimal(number) {
    return number % 1 !== 0;
  }

  function convertTwoDigits(value) {
    // Convert the value to a number if it's a string
    let num = parseFloat(value);
    // Separate the integer and decimal parts
    let integerPart = Math.floor(num);
    let decimalPart = Math.floor((num - integerPart) * 100);
    // Construct the final number
    let result = integerPart + decimalPart / 100;
    return isDecimal(result) ? result : parseFloat(result).toFixed(2);
  }
  useEffect(() => {
    if(formAction === "EDIT" && defaultTableEditData && defaultTableEditData.length > 0){
      const editTaxData = [];
      const editQtyType = [];
      defaultTableEditData[0]?.tabledetails?.forEach((item) => {
        editTaxData.push({
          id: item.id,
          sTaxCode: item.sTaxCode,
          sTaxName: item.sTaxName,
          applied: false
        });
        editQtyType.push({id: item.id, qtyType: Number(item["sUnitConversion"]?.split(":")[1])})
      })
      setEditDataQtyType(editQtyType);
      setTaxDefaultValueCode(editTaxData);
    }
  }, [defaultTableEditData])

  useEffect(() => {
    if(formAction === "EDIT" && defaultTableEditData && defaultTableEditData.length > 0){
      const qtyTypeMappingData = [];
      const colRateIndex = data?.fixcolumns?.findIndex((item) => item.sColumnID == "col_rate");
      defaultTableEditData[0]?.tabledetails?.forEach((item) => {
        qtyTypeMappingData.push({
          id: Number(item.id),
          sPriceOption1: parseKeyValueString(freeFormTabbleEditMainrecord?.[data?.component?.sName])?.priceoption === "sPriceOption1" ? (Number(item[data?.fixcolumns[colRateIndex].inputType.component.sName])/Number(item["sUnitConversion"]?.split(":")[1])) : "0.00",
          sPriceOption2: parseKeyValueString(freeFormTabbleEditMainrecord?.[data?.component?.sName])?.priceoption === "sPriceOption2" ? (Number(item[data?.fixcolumns[colRateIndex].inputType.component.sName])/Number(item["sUnitConversion"]?.split(":")[1])) : "0.00",
          sInventoryCode: item["sInventoryCode"],
          sAccountTo: freeFormTabbleEditMainrecord["sVendorCode"],
          [Object.keys(allFeildForDoucmentSelect).find(key => allFeildForDoucmentSelect[key] === "sVendorCode")]: item["sVendorCode"]
        });
      })
      setQuantityTypeMapping(qtyTypeMappingData);
    }
  }, [defaultTableEditData, freeFormTabbleEditMainrecord])
  
  useEffect(() => {
    data?.summaryfields?.sSummaryDetails?.forEach((summ) => {
      if(summ?.sSummaryID === "summ_tax"){
        setSummaryTaxID(`${data?.component?.sName}-${summ?.sSummaryID}`)
      }
    })
    setMainTableID(data?.component?.sName);
  }, [data])

  function getTaxCode(taxType) {
    allTypesTaxesArry?.forEach((tax) => {
      if(tax.taxType === taxType){
        return tax.taxCode;
      }
    })
    return "002";
  }

  const fetchCurrencyOptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(serverAddress + "/record/get/query?query=getCurrencyAll", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Set the data from the response
      setCurrencyOptions(response.data.data.records);
    } catch (error) {
      // Set error if the API call fails
      // setError(error);
    } finally {
      // Set loading to false once the request is complete
      setLoading(false);
    }
  };

  console.log("jkwbekjefvwefw", documentSelectTableData);

  function parseFreeFormMainrecordDetails(detailsString) {
    const pairs = detailsString?.split(';');
    const result = {};
    pairs?.forEach(pair => {
      if (pair) {
        const [key, value] = pair.split(':');
        result[key] = value || null;
      }
    });
    return result;
  }

  useEffect(() => {
    setdefaultTableNameAndModel(data.component);

    fetchCurrencyOptions();
    if(formAction === "EDIT"){
      if(freeFormTabbleEditMainrecord){
        setSelectedTax(parseFreeFormMainrecordDetails(freeFormTabbleEditMainrecord[data?.component?.sName])?.["taxcalculation"]);
        setSelectedCurrecy(parseFreeFormMainrecordDetails(freeFormTabbleEditMainrecord[data?.component?.sName])?.["currency"])
      }
    } else {
      setSelectedTax(data?.component?.taxcalculation?.sDefaultValue);
    }

    return () => {
      setdefaultTableSummaryFeild({});
      // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 169", rows);
      setRows([]);
      // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 169", []);
    };
  }, [data, freeFormTabbleEditMainrecord]);

  function setTableEditData() {
    // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 176", rows);
    setRows([]);
    // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 176", []);
    const existingIndex = defaultTableEditData?.filter(
      item => item.sInputTableName === data?.component?.sName
    );

    if (Array.isArray(existingIndex[0]?.tabledetails)) {
      const dr = existingIndex[0].tabledetails.map((obj, ind) => {
        // const val = replaceKeysEditData(obj);

        const { id, ...all } = obj;

        let allFieldsKeys = Object.keys(allfeildsNames);
        let allFieldsValues = Object.values(allfeildsNames);
        const row = { id };
        const datareduce = allFieldsKeys.reduce(
          (acc, item, i, array) => {
            // alert( obj['dDiscount'] )
            return {
              ...acc,
              ["disc_type"]: obj["dDiscount"]?.endsWith("%") ? "%" : "Fix",
              [allFieldsKeys[i]]: obj[allFieldsValues[i]]?.toString()?.endsWith("%")
                ? obj[allFieldsValues[i]]?.toString().replace("%", "")
                : obj[allFieldsValues[i]] + "",
              ["sUnitConversion"]: `${obj["sUnitConversion"]}`,
              ["sTaxCode"]: `${obj["sTaxCode"]}`,
              ["sTaxName"]: `${obj["sTaxName"]}`,
              [Object.keys(allFeildForDoucmentSelect).find(key => allFeildForDoucmentSelect[key] === "sVendorCode")]: `${obj["sVendorCode"]}`
            };
          },
          { id: id }
        );

        return datareduce;
      });
      // setRows([])

      const newData = [];
      for (let i = 0; i < dr?.length; i++) {
        dr[i].id = i + 1;
        const row = dr[i];
        const qty = +row.col_qty?.toString().replace(/,/g, "") || 0; // parseFloat(row.col_qty || 1);
        const rate = +row.col_rate?.toString().replace(/,/g, "") || 0;
        // console.log("bwaejkbfjwkbkjwjefb", rate);
        const disc = +row.col_disc?.toString().replace(/,/g, "") || 0; // parseFloat(row.col_disc || 0);
        let tax;
        if (typeof row?.col_tax == "string") {
          tax = getVATPercentage(
            getPercent(
              row.sTaxCode
                ? row.sTaxCode
                : colTaxOption.length == 1
                ? colTaxOption[0]?.sTaxCode
                : row.col_tax
            )[0]
          );
        } else {
          tax = getVATPercentage(
            getPercent(
              row.sTaxCode
                ? row.sTaxCode
                : colTaxOption.length == 1
                ? colTaxOption[0]?.sTaxCode
                : row.col_tax
            )[0]
          );
        }
        let disctype = row?.disc_type || "%";
        const discDecimal = disc / 100;
        const taxDecimal = tax / 100 || 0;
        let amount = 0;

        if (disctype === "%") {
          amount = qty * rate * (1 - discDecimal) * (1 + taxDecimal);
        }
        if (disctype === "Fix") {
          amount = (qty * rate - disc) * (1 + taxDecimal);
        }
        let numAsNumber = +amount?.toString().replace(/,/g, "");
        let result = numAsNumber.toLocaleString();
        // result = parseFloat(result).toFixed(2);

        const updatedRow = {
          ...row,
          // col_amount: handlePointChange(parseFloat(numAsNumber).toFixed(2), 2)
        };

        let taxAmount = 0;
        if (selectedTax == "Exclusive") {
          taxAmount = parseFloat((amount * (tax / 100)).toFixed(2));
        } else {
          taxAmount = parseFloat(((amount / ((100 + tax) / 100)) * (tax / 100)).toFixed(2));
        }
        updateTaxData({
          id: row.id,
          taxCode: row.sTaxCode,
          taxAmount: taxAmount,
          amountOf: Number(
            selectedTax == "Exclusive"
              ? amount?.toString().replaceAll(",", "")
              : (amount - taxAmount)?.toString().replaceAll(",", "")
            ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          taxType: findObjectByValue(colTaxOption || [], row.sTaxCode).sTaxName || row.sTaxName
        });

        newData.push(updatedRow);
      }

      // alert(JSON.stringify(newData))

      // alert(`${disc} / ${ taxDecimal } / ${discDecimal}`)

      // const updatedRows = [...list];
      // updatedRows[rowIdx] = updatedRow;
      // setRows(updatedRows);
      // alert('dd')
      // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 270", rows);
      setRows(newData);
      // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 270", newData);
      updateAmountFunction(newData);
      // takeInput({target:{}})
    }

    // setting summury data
    if (Array.isArray(existingIndex[0]?.tablesummary)) {
      const updatedSummary = existingIndex[0]?.tablesummary.map(item => {
        const { sDocNumber, ...rest } = item;
        return rest;
      });
      
      setSummaryForBackend(updatedSummary);
      existingIndex[0].tablesummary.map((item, ind) => {
        for (let key in summaryFeilds) {
          if (item.sSummaryID === "summ_withholding" && item.sInputValue) {
            setsummaryFeilds(pre => ({
              ...pre,
              ["withholding_disc_type"]: (item.sInputValue.includes("%") ? "%" : "Fix")
            }));
          }
          if (key == item.sSummaryID) {
            // alert(item.sInputValue);
            setsummaryFeilds(pre => ({
              ...pre,
              [item.sSummaryID]: (item.sSummaryID == "summ_withholding" && item.sInputValue)
                ? (item.sInputValue.includes("%") ? item.sInputValue.replace("%", ":").split(":")[1] : item.sInputValue.replace("Fix", ":").split(":")[1])
                : item.sInputValue,
            }));
          }
        }
      });
    }
  }

  function replaceKeysEditData(obj) {
    const { id, ...all } = obj;
    const row = { id };
    let allFieldsKeys = Object.keys(allfeildsNames);
    let allFieldsValues = Object.values(allfeildsNames);
    if (allfeildsNames) {
      for (let i = 0; i < allFieldsKeys?.length; i++) {
        row[allFieldsKeys[i]] =
          obj[allFieldsValues[i]] + "".endsWith("%")
            ? obj[allFieldsValues[i]] + "".replace("%", "")
            : obj[allFieldsValues[i]] + "";
        if (obj[allFieldsValues[i]] + "".endsWith("%")) {
          row["disc_type"] = "%";
        } else {
          row["disc_type"] = "Fix";
        }
      }
    }

    return row;
  }

  useEffect(() => {
    if (formAction == "ADD") {
      const filterSummary = data?.summaryfields?.sSummaryDetails.map((elm, ind) => {
        return { sSummaryID: elm.sSummaryID, sAccountCode: "", sInputValue: "", sValue: "" };
      });
      setSummaryForBackend(filterSummary);
      const summaryValidationFeilds = data?.summaryfields?.sSummaryDetails.map((elm, ind) => {
        if (elm.bHidden == 0) {
          return {
            sSummaryID: elm.sSummaryID,
            validation: elm?.inputType?.validation,
            bPayload: elm?.inputType?.data?.bPayload
          };
        }
      });

      const summaryFeildspayload = {};
      data?.summaryfields?.sSummaryDetails.map((elm, ind) => {
        // if (elm.bVisible == "true") {
        summaryFeildspayload[elm.sSummaryID] = elm?.inputType?.data?.bPayload;
        // }
      });

      setsummaryFeildsBPayLoad(summaryFeildspayload);
      setsummaryValidationFeilds(summaryValidationFeilds);
    } else {
      setTableEditData();
      const summaryFeildspayload = {};
      data?.summaryfields?.sSummaryDetails.map((elm, ind) => {
        // if (elm.bVisible == "true") {
        summaryFeildspayload[elm.sSummaryID] = elm?.inputType?.data?.bPayload;
        // }
      });

      setsummaryFeildsBPayLoad(summaryFeildspayload);
    }
  }, [
    allfeildsNames,
    data.summaryfields.sSummaryDetails,
    defaultTableEditData,
    data,
    defaultTableEditData,
    colTaxOption
  ]);

  // console.log(summaryForBackend, "summ_grandtotal");

  const [allAccountData, setallAccountData] = useState([]);
  // console.log(allAccountData,'allAccountData');
  function removeCommas(inputString) {
    let result = "";
    for (let i = 0; i < inputString?.length; i++) {
      if (inputString[i] !== ",") {
        result += inputString[i];
      }
    }
    return result;
  }
  const handlePointChange = (num1, decimalPlaces = 0) => {
    const num = removeCommas(num1);
    // let val = inputValue.includes(".") ? parseFloat(formattedValue).toFixed(decimalPlaces) : formattedValue;
    let val;
    const inputValue = num?.toString();

    if (inputValue.includes(".")) {
      const arr = inputValue.split(".");
      const lastValue = arr[1];
      const newInputValue = inputValue?.toString().replace(".", "");
      const lastValueueLenght = lastValue?.toString()?.length;
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
          val = `${parseFloat(joinVal)}.${arrval[arrval?.length - 2]}${arrval[arrval?.length - 1]}`;
        }
      }
      if (decimalPlaces == 3) {
        const joinVal = arrval.slice(0, -3).join("");

        if (newArr?.length == 3) {
          val = `${parseFloat(joinVal)}.${newArr[0]}${newArr[1]}${newArr[2]}`;
        } else {
          val = `${parseFloat(joinVal)}.${newArr[1]}${newArr[2]}${newArr[3]}`;
        }
      }
      if (decimalPlaces == 4) {
        const joinVal = arrval.slice(0, -4).join("");
        if (newArr?.length == 3) {
          val = `${0}.0${newArr[0]}${newArr[1]}${newArr[2]}`;
        } else {
          val = `${parseFloat(joinVal)}.${newArr[1]}${newArr[2]}${newArr[3]}${newArr[4]}`;
        }
      }

      if (decimalPlaces == 5) {
        const joinVal = arrval.slice(0, -5).join("");
        if (newArr?.length == 3) {
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
        if (inputValue?.length == 1) {
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

  const update = callback => {
    if (callback) {
      callback();
    }
  };

  function getPercent(item) {
    let filteredItems;
    filteredItems = colTaxOption.filter(elm => elm.sTaxCode == item);
    if(colTaxOption.length === 0 && formAction === "EDIT" && filteredItems.length === 0 && defaultTableEditData && defaultTableEditData.length > 0){
      filteredItems = defaultTableEditData[0]?.tabledetails.filter(elm => elm.sTaxCode == item);
    }
    return filteredItems.map(elm => elm.dPercentage);
  }

  function getPercentSummary(item) {
    const filteredItems = colTaxOptions.filter(elm => elm.sTaxCode == item);
    return filteredItems.map(elm => elm.dPercentage);
  }

  function getVATPercentage(vatString) {
    // Use regular expressions to extract the percentage value from the string

    if (typeof vatString === "string") {
      const matches = vatString && vatString?.match(/\((\d+(\.\d+)?)%\)/);

      if (matches && matches[1]) {
        // Parse the matched value as a floating-point number
        return parseFloat(matches[1]);
      }

      // Return a default value or handle errors as needed
      return "";
    } else {
      return vatString;
    }
  }

  const updateAmount = (id, name, iDecimalPlaces) => {
    const rowIdx = rows.findIndex(item => item.id === id);
    if (rowIdx === -1) return; // Row not found, do nothing
    const row = rows[rowIdx];
    const qty = +row.col_qty?.toString().replace(/,/g, "") || 0; // parseFloat(row.col_qty || 1);
    const rate = +row.col_rate?.toString().replace(/,/g, "") || 0;
    // console.log("bwaejkbfjwkbkjwjefb", rate);
    const disc = +row.col_disc?.toString().replace(/,/g, "") || 0; // parseFloat(row.col_disc || 0);

    let tax;
    if (typeof row.col_tax == "string") {
      tax = getVATPercentage(row.col_tax);
    } else {
      tax = row.col_tax;
    }

    let disctype = row.disc_type || "%";
    const discDecimal = disc / 100;
    const taxDecimal = tax / 100;
    let amount = 0;

    if (disctype === "%") {
      amount = qty * rate * (1 - discDecimal) * (1 + taxDecimal);
    } else if (disctype === "Fix") {
      amount = rate * (tax / 100) + qty * rate - +disc;
    }

    let numAsNumber = +amount?.toString().replace(/,/g, "");
    let result = numAsNumber.toLocaleString();
    result = parseFloat(result).toFixed(2);
    //  console.log(ro,'result66');
    const updatedRow = {
      ...row,
      col_amount: handlePointChange(result, 2)
    };
    console.log("jlehfkjqwghjgfwehjewf", "COL_AMT 592", handlePointChange(result, 2));

    const updatedRows = [...rows];
    updatedRows[rowIdx] = updatedRow;
    // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 536", rows);
    setRows(updatedRows);
    // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 536", updatedRows);
  };

  //   const rowIdx = rows.findIndex(item => item.id === id);
  //   if (rowIdx === -1) return; // Row not found, do nothing

  //   const row = rows[rowIdx];

  //   const qty = +row.col_qty || 0; // parseFloat(row.col_qty || 1);
  //   const rate = +row.col_rate || 0;
  //   const disc = +row.col_disc || 0; // parseFloat(row.col_disc || 0);

  //   const debit = +row.col_debit || 0; // parseFloat(row.col_disc || 0);
  //   let tax;

  //   if (typeof row.col_tax == "string") {
  //     tax = getVATPercentage(row.col_tax);
  //   } else {
  //     tax = row.col_tax;
  //   }
  //   let disctype = row.disc_type || "%"; // parseFloat(row.col_disc || 0);
  //   const credit = +row.col_credit || 0; // parseFloat(row.col_tax || 0);
  //   // const tax = +row.col_tax_select || 0; // parseFloat(row.col_tax || 0);

  //   const discDecimal = disc / 100;
  //   const taxDecimal = tax / 100;
  //   let amount = 0;

  //   if (disctype === "%") {
  //     // amount = (rate*(tax/100)) + qty * rate * (1 - disc / 100);

  //     amount = qty * rate * (1 - discDecimal) * (1 + taxDecimal);

  //   } else if (disctype === "Fix") {
  //     // console.log(qty,rate,disc,tax, "called updade66");
  //     amount = rate * (tax / 100) + qty * rate - disc;
  //     // amount = qty * rate - (1 - discDecimal) * (1 + taxDecimal);
  //   }

  //   let col_amount_fixed = 0;
  //   let col_rate_fixed = 0;
  //   let col_qty_fixed = 0;
  //   let col_disc_fixed = 0;

  //   if (typeof row.col_amount == "string" && row.col_amount.includes(".")) {
  //     const newArr1 = row.col_amount.split(".");
  //     col_amount_fixed = newArr1[newArr1.length - 1].length;
  //   }

  //   if (typeof row.col_rate == "string" && row.col_rate.includes(".")) {
  //     const newArr2 = row.col_rate.split(".");
  //     col_rate_fixed = newArr2[newArr2.length - 1].length;
  //   }

  //   if (typeof row.col_qty == "string" && row.col_qty.includes(".")) {
  //     const newArr3 = row.col_qty.split(".");
  //     col_qty_fixed = newArr3[newArr3.length - 1].length;
  //   }
  //   if (typeof row.col_disc == "string" && row.col_disc.includes(".")) {
  //     const newArr4 = row.col_disc.split(".");
  //     col_disc_fixed = newArr4[newArr4.length - 1].length;
  //   }
  //   const updatedRow = {
  //     ...row,
  //     col_amount:
  //       name == "col_amount"
  //         ? parseFloat(amount).toFixed(iDecimalPlaces)
  //         : amount.toFixed(col_amount_fixed),
  //     col_qty:
  //       name == "col_qty" ? parseFloat(qty).toFixed(iDecimalPlaces) : qty.toFixed(col_disc_fixed),
  //     col_rate:
  //       name == "col_rate"
  //         ? parseFloat(rate).toFixed(iDecimalPlaces)
  //         : rate.toFixed(col_rate_fixed),
  //     col_tax: tax,
  //     // disc_type:disctype,
  //     col_disc:
  //       name == "col_disc" ? parseFloat(disc).toFixed(iDecimalPlaces) : disc.toFixed(col_disc_fixed)
  //   };

  //   const updatedRows = [...rows];
  //   updatedRows[rowIdx] = updatedRow;

  //   setRows(updatedRows);
  // };

  async function getAllAccountTaxes(api, token) {
    try {
      const response = await fetch(api, {
        headers: {
          Authorization: `Bearer ${token}`
          // Add other headers if needed
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return data.data.records;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async function fetchData(api) {
    try {
      const uri = serverAddress + api; // Your API base URL

      const accountTaxes = await getAllAccountTaxes(uri, token);
      //  alert('2e2')

      // setcolTaxOptions(accountTaxes);
      // Do something with the fetched data
    } catch (error) {
      // Handle errors
    }
  }

  useEffect(() => {
    if(rows && rows.length > 0) {
      updateAmountFunction(rows);
    }
  }, [selectedTax]);

  function updateAmountFunction(rows, time) {
    //  alert('dd')
    const newRows = [];
    try {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const qty = +row.col_qty?.toString().replace(/,/g, "") || 0;
        const rate = +row.col_rate?.toString().replace(/,/g, "") || 0;
        // console.log("bwaejkbfjwkbkjwjefb", rate);
        const disc = +row.col_disc?.toString().replace(/,/g, "") || 0;
        let tax = getVATPercentage(
          getPercent(
            row.sTaxCode
              ? row.sTaxCode
              : row.col_tax
              ? row.col_tax
              : colTaxOption.length == 1
              ? colTaxOption[0]?.sTaxCode
              : row.col_tax
          )[0]
        );

        let disctype = row.disc_type || "%";
        const discDecimal = disc / 100;
        const taxDecimal = 0;
        let amount = 0;

        if (disctype === "%") {
          amount = qty * rate * (1 - discDecimal) * (1 + taxDecimal);
        }
        if (disctype === "Fix") {
          amount = (qty * rate - disc) * (1 + taxDecimal);
        }
        let numAsNumber = +amount?.toString().replace(/,/g, "");

        if(!tax){
          tax = 0;
        }

        let taxAmount = 0;
        if (selectedTax == "Exclusive") {
          //col_amount (dAmount) x  (selected tax.sComputeField (dPercentage) / 100)
          taxAmount = parseFloat((amount * (tax / 100)).toFixed(2));
          // parseFloat(taxAmount).toFixed(2)
        } else {
          // Tax= col_amount (dAmount) / ( ((100 + selected tax.sComputeField (dPercentage)) / 100) * (selected tax.sComputeField (dPercentage) / 100)
          taxAmount = parseFloat(((amount / ((100 + tax) / 100)) * (tax / 100)).toFixed(2));
          // taxAmount = parseFloat(taxAmount).toFixed(2)
        }
        // alert(`${parseFloat(taxAmount).toFixed(2)} -- ${amount}`)

        updateTaxData({
          id: row.id,
          taxCode: row.sTaxCode,
          taxAmount: taxAmount,
          amountOf: Number(
            selectedTax == "Exclusive"
              ? amount?.toString().replaceAll(",", "")
              : (amount - taxAmount)?.toString().replaceAll(",", "")
            ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          // handlePointChange(
          //     parseFloat(
          //       selectedTax == "Exclusive"
          //         ? amount
          //         : parseFloat(amount?.toString()?.replace(/,/g, "")) - taxAmount
          //     ).toFixed(2),
          //     2
          //   )
          // amountOf: selectedTax == "Exclusive" ? amount : selectedTax == "Exclusive" ? amount :parseFloat(taxAmount).toFixed(2)  ,
          taxType: findObjectByValue(colTaxOption || [], row.sTaxCode).sTaxName || row.sTaxName
        });
        const updatedRow = {
          ...JSON.parse(JSON.stringify(row)),
          col_amount: handlePointChange(
            parseFloat(
              selectedTax == "Exclusive" ? numAsNumber : amount - parseFloat(taxAmount).toFixed(2)
            ).toFixed(2),
            2
          ),
          col_otheramount: +handlePointChange(
            parseFloat(numAsNumber + +row.col_other.toString().replace(/,/g, "")).toFixed(2),
            2
          ),
        };
        // console.log("kjkekhbwbjewqkjefw", taxDefaultValueCode, defaultTableEditData);

        console.log("jlehfkjqwghjgfwehjewf", "COL_AMT 803", handlePointChange(
          parseFloat(
            selectedTax == "Exclusive" ? numAsNumber : amount - parseFloat(taxAmount).toFixed(2)
          ).toFixed(2),
          2
        ));
        // if(quantityTypeMapping && quantityTypeMapping.length > 0 && formAction === "EDIT"){
        //   updatedRow.col_rate = quantityTypeMapping[row.id - 1][priceSelect]
        // }
        newRows.push(updatedRow);
      }
      // console.log(newRows);

      let timeoutId;
      // Clear the existing timer if it's already running
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Set a new timer
      timeoutId = setTimeout(
        () => {
          if (newRows.length > 0) {
            // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 753", rows);
            setRows(newRows);
            // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 753", newRows);
          }
        },
        time == "NoTime" ? 0 : 2000
      ); // 2000 milliseconds = 2 seconds

      // Example usage: call startTimer whenever you need to reset the timer
    } catch (err) {
      console.log("error =>", err);
    }
  }

  function updateAmountOnPriceSelect(rows) {
    //  alert('dd')
    const newRows = [];
    try {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const qty = +row.col_qty?.toString().replace(/,/g, "") || 0;
        let rate = +row.col_rate?.toString().replace(/,/g, "") || 0;
        // if(editDataQtyType && editDataQtyType.length > 0 && (priceSelect === "sPriceOption1" || priceSelect === "sPriceOption2")){
        //   const existingIndex = editDataQtyType.findIndex((item) => item.id == row.id);
        //   if(existingIndex !== -1){
        //     rate = quantityTypeMapping?.[i]?.[priceSelect];
        //   }
        // }
        // console.log("bwaejkbfjwkbkjwjefb", rate);
        const disc = +row.col_disc?.toString().replace(/,/g, "") || 0;
        let tax = getVATPercentage(
          getPercent(
            row.sTaxCode
              ? row.sTaxCode
              : row.col_tax
              ? row.col_tax
              : colTaxOption.length == 1
              ? colTaxOption[0]?.sTaxCode
              : row.col_tax
          )[0]
        );

        let disctype = row.disc_type || "%";
        const discDecimal = disc / 100;
        const taxDecimal = 0;
        let amount = 0;

        if (disctype === "%") {
          amount = qty * rate * (1 - discDecimal) * (1 + taxDecimal);
        }
        if (disctype === "Fix") {
          amount = (qty * rate - disc) * (1 + taxDecimal);
        }
        let numAsNumber = +amount?.toString().replace(/,/g, "");

        if(!tax){
          tax = 0;
        }

        let taxAmount = 0;
        if (selectedTax == "Exclusive") {
          //col_amount (dAmount) x  (selected tax.sComputeField (dPercentage) / 100)
          taxAmount = parseFloat((amount * (tax / 100)).toFixed(2));
          // parseFloat(taxAmount).toFixed(2)
        } else {
          // Tax= col_amount (dAmount) / ( ((100 + selected tax.sComputeField (dPercentage)) / 100) * (selected tax.sComputeField (dPercentage) / 100)
          taxAmount = parseFloat(((amount / ((100 + tax) / 100)) * (tax / 100)).toFixed(2));
          // taxAmount = parseFloat(taxAmount).toFixed(2)
        }
        // alert(`${parseFloat(taxAmount).toFixed(2)} -- ${amount}`)

        updateTaxData({
          id: row.id,
          taxCode: row.sTaxCode,
          taxAmount: taxAmount,
          amountOf: Number(
            selectedTax == "Exclusive"
              ? amount?.toString().replaceAll(",", "")
              : (amount - taxAmount)?.toString().replaceAll(",", "")
            ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          // handlePointChange(
          //     parseFloat(
          //       selectedTax == "Exclusive"
          //         ? amount
          //         : parseFloat(amount?.toString()?.replace(/,/g, "")) - taxAmount
          //     ).toFixed(2),
          //     2
          //   )
          // amountOf: selectedTax == "Exclusive" ? amount : selectedTax == "Exclusive" ? amount :parseFloat(taxAmount).toFixed(2)  ,
          taxType: findObjectByValue(colTaxOption || [], row.sTaxCode).sTaxName || row.sTaxName
        });
        const updatedRow = {
          ...JSON.parse(JSON.stringify(row)),
          col_amount: handlePointChange(
            parseFloat(
              selectedTax == "Exclusive" ? numAsNumber : amount - parseFloat(taxAmount).toFixed(2)
            ).toFixed(2),
            2
          ),
          col_otheramount: +handlePointChange(
            parseFloat(numAsNumber + +row.col_other.toString().replace(/,/g, "")).toFixed(2),
            2
          ),
        };

        // console.log("jlehfkjqwghjgfwehjewf", "COL_AMT 803", handlePointChange(
        //   parseFloat(
        //     selectedTax == "Exclusive" ? numAsNumber : amount - parseFloat(taxAmount).toFixed(2)
        //   ).toFixed(2),
        //   2
        // ));
        // if(quantityTypeMapping && quantityTypeMapping.length > 0 && formAction === "EDIT"){
        //   updatedRow.col_rate = quantityTypeMapping[row.id - 1][priceSelect]
        // }

        newRows.push(updatedRow);
      }
      setRows(newRows);
    } catch (err) {
      console.log("error =>", err);
    }
  }

  // useEffect(() => {
  //   updateAmountOnPriceSelect(rows);
  // }, [priceSelect])


  useEffect(() => {
    // let key = {}
    setdefaultTableSummaryFeild(preState => ({
      ...preState,
      [data.component.sName]: `priceoption:${
        priceSelect ? priceSelect : ""
      };taxcalculation:${selectedTax || ""};currency:${
        selectedCurrency || ""
      }:${parseFloat(exchangeRateField?.[data?.component?.currency?.dExchangeRateField]).toFixed(2)};othercostallocation:${/true/.test(data?.otherCost?.bEnabled) ? alloceteValue || "" : ""}`
    }));
    // alert('kk')
  }, [data, selectedTax, priceSelect, selectedCurrency, exchangeRateField?.[data?.component?.currency?.dExchangeRateField]]);

  // const takeInput = (e, id, type, iDecimalPlaces) => {}

  const updateTaxData = newRow => {
    if(newRow?.taxCode !== "undefined" && newRow?.taxType !== "undefined"){
      setAllTypesTaxesArry(prevData => {
        // Check if the row with the same id already exists
        const index = prevData?.findIndex(row => row?.id === newRow?.id);

        if (index !== -1) {
          // If it exists, replace it
          const updatedData = [...prevData];
          updatedData[index] = newRow;
          return updatedData;
        } else {
          // If it doesn't exist, add the new row
          return [...prevData, newRow];
        }
      });
    }
  };

  const findObjectByValue = (dataArray, searchValue) => {
    // Iterate through each object in the array
    for (let obj of dataArray) {
      // Iterate through each key in the current object
      for (let key in obj) {
        // If the value matches the searchValue, return the object
        if (obj[key] === searchValue) {
          return obj;
        }
      }
    }
    // If no match is found, return an empty object
    return {};
  };
  const takeInput = (e, id, type, iDecimalPlaces, form) => {
    const {
      name,
      value,
      name1,
      value1,
      value2,
      name2,
      name3,
      name4,
      name5,
      name6,
      name7,
      value3,
      value4,
      value5,
      value6,
      value7,
      updated_price,
      updated_value
    } = e?.target;

    // alert(JSON.stringify(type));
    const colTaxIndex = data?.fixcolumns?.findIndex((item) => item.sColumnID == "col_tax");
    if(colTaxIndex != -1){
      const colTaxItem = data?.fixcolumns[colTaxIndex];
      if((colTaxItem.bVisible == "false" || !colTaxItem.bVisible) && colTaxItem?.inputType?.data?.bPayload == 1){
        setRows((prev) => {
          const rowIndex = prev.findIndex((field) => field.id == id);
          if(rowIndex != -1){
            prev[rowIndex][colTaxItem?.inputType?.component?.sName] = colTaxItem?.inputType?.component?.sDefaultValue;
          }
          return prev;
        })
      }
    }

    var newval = value;
    if (type === "CURRENCY" || type === "setPrice") {
      newval = handlePointChange(value, iDecimalPlaces);
    } else {
      newval = value;
    }
    // alert(`${name} -- ${newval}`);
    const list = [...rows];
    const index = list.findIndex(row => row.id === id);
    const rowIdx = rows.findIndex(item => item.id === id);
    if (rowIdx === -1) return;
    const row = rows[rowIdx];
    if (typeof iDecimalPlaces == "object") {
      list[index][iDecimalPlaces.name] = iDecimalPlaces.value;
      list[index][name] = newval;
      if (name1) {
        list[index][name1] = value1;
        if (name1 == "sConversion") {
          list[index]["col_amount"] = list[index][name1] * list[index]["col_amount"];
          // alert(list[index][name1] *  list[index]['col_amount'])
        }
        console.log("jlehfkjqwghjgfwehjewf", "COL_AMT 928", list[index][name1] * list[index]["col_amount"]);
      }
      if (name2) {
        list[index][name1] = value2;
        if (name2 == "col_tax") {
          list[index]["col_tax"] = getVATPercentage(getPercent(value2)) || "";
        }
      }
      if (name3) {
        list[index][name3] = value3;
      }
      if (name4) {
        list[index][name4] = value4;
      }
      if (name5) {
        list[index][name5] = value5;
      }
      if (name6) {
        list[index][name6] = value6;
      }
      if (name7) {
        list[index][name1] = value7;
      }

      list[index]["col_tax"] =
        getVATPercentage(getPercent(row.sTaxCode ? row.sTaxCode : row.col_tax)[0]) || "";
    } else {
      list[index][name] = newval;
      list[index][name1] = value1;
      list[index][name2] = value2;
      if (name3) {
        list[index][name3] = value3;
      }
      if (name4) {
        // alert(`${name}--${newval}`)
        list[index][name4] = value4;
      }
      if (name5) {
        list[index][name5] = value5;
      }
      if (name6) {
        list[index][name6] = value6;
      }
      if (name7) {
        list[index][name7] = value7;
      }

      // alert(getPercent(row.sTaxCode ? row.sTaxCode : row.col_tax)[0])
      const existingIndex = editDataQtyType.findIndex((item) => item.id === id);
      if(updated_price == "updated_price" && updated_value && existingIndex == -1){
        if(editDataQtyType && editDataQtyType.length > 0){
          const existingIndex = editDataQtyType.findIndex((item) => item.id === id);
          if(existingIndex !== -1){
            list[index]["col_rate"] = updated_value * editDataQtyType[existingIndex].qtyType;
            // console.log("bwaejkbfjwkbkjwjefb", updated_value * editDataQtyType[existingIndex].qtyType);
          }
        }else{
          list[index]["col_rate"] = updated_value;
          // console.log("bwaejkbfjwkbkjwjefb", updated_value);
        }
      }
      if (!csvFile && name1 == "sConversion" && (priceSelect == "sPriceOption1" || priceSelect == "sPriceOption2") && value1) {
        list[index]["col_rate_og"] = !list[index]["col_rate_og"]
          ? list[index]["col_rate"] + ""
          : list[index]["col_rate_og"] + "";
        quantityTypeMapping.forEach((field) => {
          if(list[index]["id"] === field.id){
            list[index]["col_rate"] = (list[index]["col_rate_og"] != 0 && list[index]["col_rate_og"])
              ? value1 * parseFloat(field[priceSelect])
              : value1 * parseFloat(field[priceSelect] + ""?.replace(/,/g, ""));

              // console.log("bwaejkbfjwkbkjwjefb", (list[index]["col_rate_og"] != 0 && list[index]["col_rate_og"])
              // ? value1 * parseFloat(field[priceSelect])
              // : value1 * parseFloat(field[priceSelect] + ""?.replace(/,/g, "")));
            list[index]["col_amount"] = list[index]["col_rate"] * list[index]["col_qty"];
            console.log("jlehfkjqwghjgfwehjewf", "COL_AMT 986", value1, parseFloat(field[priceSelect]), field[priceSelect], quantityTypeMapping, list[index]["col_qty"]);
          }
        })
        if(list[index]["col_rate"] === "NaN" || isNaN(list[index]["col_rate"])){
          list[index]["col_rate"] = "0.00";
          // console.log("bwaejkbfjwkbkjwjefb", "0.00");
        }
      }
      list[index]["col_tax"] =
        getVATPercentage(getPercent(row.sTaxCode ? row.sTaxCode : row.col_tax)[0]) || "";
    }

    const qty = +row.col_qty?.toString().replace(/,/g, "") || 0; // parseFloat(row.col_qty || 1);
    // const rate = ((priceSelect === "sPriceOption1" || priceSelect === "sPriceOption2") ? quantityTypeMapping?.[id - 1]?.[priceSelect] : +row.col_rate?.toString().replace(/,/g, "") || 0) || 0;
    let rate = +row.col_rate?.toString().replace(/,/g, "") || 0;

    // if(editDataQtyType && editDataQtyType.length > 0 && (priceSelect === "sPriceOption1" || priceSelect === "sPriceOption2") && quantityTypeMapping?.[id - 1]?.[priceSelect]){
    //   const existingIndex = editDataQtyType.findIndex((item) => item.id == id);
    //   if(existingIndex !== -1){
    //     rate = quantityTypeMapping?.[id - 1]?.[priceSelect];
    //   }
    // }
    // console.log("bwaejkbfjwkbkjwjefb", rate);
    
    const disc = +row.col_disc?.toString().replace(/,/g, "") || 0; // parseFloat(row.col_disc || 0);
    // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "rate", rate);
    // if(rate){
    //   list[index]["col_rate"] = rate;
    // }

    let tax;
    if (typeof row.col_tax == "string") {
      tax =
        getVATPercentage(
          getPercent(
            row.sTaxCode
              ? row.sTaxCode
              : row.col_tax
              ? row.col_tax
              : colTaxOption.length == 1
              ? colTaxOption[0]?.sTaxCode
              : row.col_tax
          )[0]
        ) || 0;
    } else {
      tax =
        getVATPercentage(
          getPercent(
            row.sTaxCode
              ? row.sTaxCode
              : row.col_tax
              ? row.col_tax
              : colTaxOption.length == 1
              ? colTaxOption[0]?.sTaxCode
              : row.col_tax
          )[0]
        ) || 0;
    }
    if (row.sTaxCode == 0) {
      tax = 0;
    }

    // alert(tax)
    let disctype = row.disc_type || "%";
    const discDecimal = disc / 100;
    const taxDecimal = 0;
    // alert(`${disc} / ${ taxDecimal } / ${discDecimal}`)
    let amount = 0;
    // if (priceSelect == 'sPriceOption1') {

    if (disctype === "%") {
      amount = qty * rate * (1 - discDecimal) * (1 + taxDecimal);
    }
    if (disctype === "Fix") {
      amount = (qty * rate - disc) * (1 + taxDecimal);
    }

    let taxAmount = 0;
    if (selectedTax == "Exclusive") {
      //col_amount (dAmount) x  (selected tax.sComputeField (dPercentage) / 100)
      taxAmount = parseFloat((amount * (tax / 100)).toFixed(2));
    } else {
      // Tax= col_amount (dAmount) / ( ((100 + selected tax.sComputeField (dPercentage)) / 100) * (selected tax.sComputeField (dPercentage) / 100)
      taxAmount = parseFloat(((amount / ((100 + tax) / 100)) * (tax / 100)).toFixed(2));
    }
    updateTaxData({
      id: list[index].id,
      taxCode: row.sTaxCode,
      taxAmount: Number(taxAmount.toFixed(2)),
      // amountOf: selectedTax == "Exclusive" ? amount : handlePointChange(parseFloat( selectedTax == "Exclusive" ? amount : (parseFloat(amount) - taxAmount)).toFixed(2), 2)  ,
      amountOf: Number(
        selectedTax == "Exclusive"
          ? amount?.toString().replaceAll(",", "")
          : (amount - taxAmount)?.toString().replaceAll(",", "")
        ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),

      taxType: findObjectByValue(colTaxOption || [], row.sTaxCode).sTaxName || row.sTaxName
    });

    // setAllTypesTaxes((prevState) => {
    //   const taxIndex = prevState.findIndex(tax => tax.taxType === taxType);
    //   let taxAmount = 0;
    //   if (selectedTax == 'Exclusive') {
    //     //col_amount (dAmount) x  (selected tax.sComputeField (dPercentage) / 100)
    //     taxAmount = amount * (tax /100)
    //   }else{
    //     // Tax= col_amount (dAmount) / ( ((100 + selected tax.sComputeField (dPercentage)) / 100) * (selected tax.sComputeField (dPercentage) / 100)
    //     taxAmount = amount / ((100 + tax) / 100) * (tax / 100)
    //   }
    //   // alert(taxAmount)

    //   if (taxIndex !== -1) {
    //     // Update the existing tax entry
    //     const updatedTaxes = [...prevState];
    //     updatedTaxes[taxIndex] = {
    //       ...updatedTaxes[taxIndex],
    //       taxAmount: String(Number(updatedTaxes[taxIndex].taxAmount) + taxAmount),
    //       amountOf:amount
    //     };
    //     return updatedTaxes;
    //   } else {
    //     // Add a new tax entry
    //     // if (taxType) {
    //     if (taxAmount && !isNaN(taxAmount)) {
    //       return [...prevState, { taxType: taxType, taxAmount: taxAmount , amountOf:amount}];
    //     }else{
    //         return prevState

    //     }
    //   }
    //   // else{
    //   // }
    // // }
    // });

    let numAsNumber = +amount?.toString().replace(/,/g, "");
    let result = numAsNumber.toLocaleString();
    // result = parseFloat(result).toFixed(2);
    // alert(taxAmount)
    const updatedRow = {
      ...row,
      col_amount: handlePointChange(
        parseFloat(selectedTax == "Exclusive" ? numAsNumber : numAsNumber - taxAmount).toFixed(2),
        2
      ),
      // newValue:numAsNumber
      col_otheramount: numAsNumber,
      // col_rate: typeof row?.col_rate === "number" ? row.col_rate.toFixed(2) : row?.col_rate
    };
    console.log("jlehfkjqwghjgfwehjewf", "COL_AMT 1120", handlePointChange(
      parseFloat(selectedTax == "Exclusive" ? numAsNumber : numAsNumber - taxAmount).toFixed(2),
      2
    ));

    let defaultIndex = quantityTypeMapping.findIndex((item) => (item.id === id));
    let defaultPricing = "";
    if(updated_price !== "updated_price"){
      if(defaultIndex !== -1){
        defaultPricing = quantityTypeMapping[defaultIndex][priceSelect];
      }
      if(defaultIndex !== -1 && quantityTypeMapping[defaultIndex]["initialState"]){
        updatedRow.col_rate = ((priceSelect === "sPriceOption1" || priceSelect === "sPriceOption2") && defaultPricing) ? Number(defaultPricing).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
        // console.log("bwaejkbfjwkbkjwjefb", ((priceSelect === "sPriceOption1" || priceSelect === "sPriceOption2") && defaultPricing) ? Number(defaultPricing).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00");
      }
    }
    // updatedRow.col_rate = existingItemIndex !== -1 ? "0.00" : (priceSelect === "sPriceOption1" && defaultPricing) ? defaultPricing : typeof row?.col_rate === "number" ? row.col_rate.toFixed(2) : row?.col_rate;
    // updatedRow.col_rate = (existingItemIndex !== -1) ? "0.00" : ((priceSelect === "sPriceOption1" || priceSelect === "sPriceOption2") && defaultPricing) ? Number(defaultPricing).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : typeof row?.col_rate === "number" ? row.col_rate.toFixed(2) : row?.col_rate;
    if(defaultIndex !== -1 && quantityTypeMapping[defaultIndex]["initialState"]){
      setQuantityTypeMapping((prev) => {
        const existingItemIndex = prev.findIndex((item) => item.id === id);
      
        if (existingItemIndex !== -1) {
          return prev.map((item, index) =>
            index === existingItemIndex
              ? { ...item, initialState: false }
              : item
          );
        }
      
        return [...prev];
      });
    }

    const updatedRows = [...list];
    // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 1052", rows);
    updatedRows[rowIdx] = updatedRow;
    // if(updatedColRate && !isNaN(updatedColRate) && updatedColRate !== "0.00" && updatedColRate !== 0 && updatedColRate !== "NaN" && updatedColRate !== "0"){
    //   updatedRows[rowIdx]["col_rate"] = updatedColRate;
    // }
    // if(rows?.[rowIdx]?.["col_rate"] && !isNaN(rows?.[rowIdx]?.["col_rate"]) && rows?.[rowIdx]?.["col_rate"] !== "0.00" && rows?.[rowIdx]?.["col_rate"] !== 0 && rows?.[rowIdx]?.["col_rate"] !== "NaN" && rows?.[rowIdx]?.["col_rate"] !== "0"){
    //   alert(rows?.[rowIdx]?.["col_rate"])
    //   updatedRows[rowIdx]["col_rate"] = rows?.[rowIdx]?.["col_rate"];
    // }
    // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 5656565", rows[0]["col_rate"], row["col_rate"]);
    // alert(JSON.stringify(updatedRows));
    setRows(updatedRows);
    // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 5656565", updatedRows[0]["col_rate"], row["col_rate"]);
    // alert('jj')
    // if (form == "priceApi") {
      // updateAmountFunction(updatedRows);
    // }
    updateAmountOnPriceSelect(updatedRows);

    const err = validateTextField(value, defaultTableValidation[name]);
    let err1;
    if (name1) {
      err1 = validateTextField(String(value1), defaultTableValidation[name1]);
    }
    let err2;
    if (name2) {
      err2 = validateTextField(value2, defaultTableValidation[name2]);
    }
    let err3;
    if (name3) {
      err3 = validateTextField(value3, defaultTableValidation[name3]);
    }
    let err4;
    if (name4) {
      err4 = validateTextField(value4, defaultTableValidation[name4]);
    }
    let err5;
    if (name5) {
      err5 = validateTextField(value5, defaultTableValidation[name5]);
    }
    let err6;
    if (name6) {
      err6 = validateTextField(value6, defaultTableValidation[name6]);
    }
    let err7;
    if (name7) {
      err7 = validateTextField(value7, defaultTableValidation[name7]);
    }
    // alert(JSON.stringify(index))
    setdefaultTableError(preState => {
      preState[index] = {
        ...preState[index],
        [name]: err,
        [name1]: err1,
        [name2]: err2,
        [name3]: err3,
        [name4]: err4,
        [name5]: err5,
        [name6]: err6,
        [name7]: err7,
        id: preState[index]?.id || index + 1
      };
      return preState;
    });
  };

  const calculateAmount = item => {
    const { col_qty, col_rate, col_disc, disc_type, col_tax } = item;

    let amount = col_qty * col_rate;

    if (disc_type === "%") {
      amount -= (col_disc / 100) * amount;
    } else {
      amount -= parseFloat(col_disc);
    }

    amount += (col_tax / 100) * amount;

    return amount.toFixed(2);
  };

  const handleSummaryChange = (e, id, type, iDecimalPlaces) => {
    const { name, value } = e.target;

    var newval;
    if (type === "CURRENCY") {
      newval = handlePointChange(value, iDecimalPlaces);
    } else {
      newval = value;
    }
    setSummaryForBackend(prevState =>
      prevState.map(item =>
        item.sSummaryID === name ? { ...item, ["sInputValue"]: newval } : item
      )
    );
    setsummaryFeilds(preState => ({
      ...preState,
      [name]: type === "Tax" || type === "Select" ? newval : newval
    }));

    const filtervalidation = summaryValidationFeilds.filter(elm => elm?.sSummaryID == name);
    const err = validateTextField(newval, filtervalidation[0]?.validation || {});
    // alert(JSON.stringify(err))
    // // alert(name) 
    if(e.target.name !== "summ_withholding"){
      setSummaryError(pre => ({ ...pre, [name]: err }));
    }
    // setdefaultTableError(preState => {
    //   preState[index] = { ...preState[index], [name]: err,id: preState[index]?.id || index+1 };
    //   return preState;
    // });
    // summaryValidationFeilds
    // setSummaryError({[name]:"error hai bhai"})
  };

  useEffect(() => {
    const withholdingItem = summaryForBackend.find(elm => elm.sSummaryID === "summ_withholding");
    if (withholdingItem && !withholdingItem.sAccountCode && clearWithholdingTax.update) {
      handleSummaryChange({ target: { name: "summ_withholding", value: "0" } });
      setClearWithholdingTax({initial: false, update: false});
    }
    if(withholdingItem && withholdingItem.sAccountCode){
      setClearWithholdingTax({initial: true, update: false});
    }
    if (withholdingItem && !withholdingItem.sAccountCode && clearWithholdingTax.initial) {
      setClearWithholdingTax({initial: false, update: true});
    }
  }, [summaryForBackend]);


  // let dataAwareResult = true;
  // if (!item?.inputtable?.sColDataAware || item?.inputtable?.sColDataAware == "false") {
  //   dataAwareResult = item?.inputtable?.bVisible;
  // } else {
  //   console.log("jhewkjhbfeqwkjbfwekj", defaultTableSelectedDataAwareData);
  //   if (item?.inputtable?.sColDataAwareSource) {
  //     const uri = serverAddress + generateDynamicAPI(item?.inputtable?.sColDataAwareSource, defaultTableSelectedDataAwareData);
  //     axios
  //       .get(uri, {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //           // Other headers if needed
  //         }
  //       })
  //       .then(result => {
  //         const findObj = result?.data?.data?.records[0];
  //         const dataAwareField = item?.inputtable?.sColDataAwareField?.replace("{", "").replace("}", "");
  //         console.log("jewqbkjfbwqhjfe", uri, findObj, dataAwareField, item?.inputtable?.sColVisibleValue);
  //         if (findObj[dataAwareField] == item?.inputtable?.sColVisibleValue) {
  //           dataAwareResult = true;
  //         } else {
  //           dataAwareResult = false;
  //         }
  //       })
  //       .catch(error => {
  //         console.log("error", error);
  //       });
  //   } else {
  //     const dataAwareField = item?.inputtable?.sColDataAwareField?.replace("{", "").replace("}", "");
  //     if (defaultTableSelectedDataAwareData[dataAwareField] == item?.inputtable?.sColVisibleValue) {
  //       dataAwareResult = true;
  //     } else {
  //       dataAwareResult = false;
  //     }
  //   }
  // }
  function extractCurlyBraceValues(input) {
    const regex = /\{([^{}]+)\}/g;
    let match;
    const result = [];
    while ((match = regex.exec(input)) !== null) {
      result.push(match[1]);
    }
    return result;
  }

  useEffect(() => {
    const dataAwareFields = [];
    data?.child?.forEach((item) => {
      if (item.inputtable.sColDataAware != false && item.inputtable.sColDataAware != "false") {
        if (item.inputtable.sColDataAwareSource) {
          extractCurlyBraceValues(item.inputtable.sColDataAwareSource).forEach((val) => {
            dataAwareFields.push(val);
          })
        } else {
          extractCurlyBraceValues(item.inputtable.sColDataAwareField).forEach((val) => {
            dataAwareFields.push(val);
          })
        }
      }
    });
    setColumnDataAware([...new Set(dataAwareFields)])
  }, [data])

  useEffect(() => {
    const updatedColumns = [];
    const fetchColumns = async () => {
      if (data?.component?.options?.mode === "DEFAULT") {
        for (const item of data?.child || []) {
          const data1 = { inputType: item };
          let dataAwareResult = true;

          if (!item?.inputtable?.sColDataAware || item?.inputtable?.sColDataAware == "false") {
            dataAwareResult = item?.inputtable?.bVisible == "true" ? true : false;
          } else {
            if (item?.inputtable?.sColDataAwareSource) {
              const uri = serverAddress + generateDynamicAPI(item?.inputtable?.sColDataAwareSource, defaultTableSelectedDataAwareData);
              if (!uri.includes("{") && !uri.includes("}")) {
                try {
                  const response = await axios.get(uri, {
                    headers: { Authorization: `Bearer ${token}` },
                  })
                  const findObj = response?.data?.data?.records[0];
                  const dataAwareField = item?.inputtable?.sColDataAwareField?.replace("{", "").replace("}", "");
                  dataAwareResult = findObj[dataAwareField] == item?.inputtable?.sColVisibleValue;
                  if(dataAwareResult){
                    setDataAwareDynamicColumns((prev) => ([...prev, item]));
                  } else {
                    setDataAwareDynamicColumns((prev) => {
                      const filteredItems = prev.filter((field) => field?.component?.sName != item?.component?.sName);
                      return filteredItems;
                    });
                  }
                } catch (error) {
                  console.error("Error fetching data:", error);
                }
              }
            } else {
              const dataAwareField = item?.inputtable?.sColDataAwareField?.replace("{", "").replace("}", "");
              dataAwareResult = defaultTableSelectedDataAwareData[dataAwareField] == item?.inputtable?.sColVisibleValue;
            }
          }
          if (dataAwareResult) {
            updatedColumns.push(item);
          }
        }
      }
    };
    fetchColumns();
    setDataAwareDynamicColumns(updatedColumns);
  }, columnDataAware.map(dep => defaultTableSelectedDataAwareData[dep]));

  const columns = [];
  if (data?.component?.options?.mode === "DEFAULT") {
    columns.unshift({
      field: "SN",
      headerName: "No.",
      width: 70,
      sortable: true,
      disableColumnMenu: true,
      renderCell: params => {
        const index = rows.findIndex((row) => row.id === params.row.id) + 1;
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
  }
  // this is for  child
  data?.component?.options?.mode === "DEFAULT" &&
    data?.child?.forEach(item => {
      const addTodo = useMemo(() => {
        setAllfeildsNames(pre => ({ ...pre, [item.inputtable.sColumnID]: item.component.sName }));
      }, []);
      // setAllfeildsNames((pre)=>({...pre,[ item.inputtable.sColumnID]:''}))
      const data1 = {
        inputType: item
      };
      if (dataAwareDynamicColumns && dataAwareDynamicColumns.length > 0) {
        const itemIndex = dataAwareDynamicColumns.findIndex((field) => field?.component?.sName == item?.component?.sName);
        if (itemIndex != -1) {
      item?.inputtable?.bVisible == "true" &&
        columns.push({
          field: item.inputtable.sColumnID,
          headerName: item.inputtable.sHeader,
          width: item.inputtable.iWidth,
          // editable: item.inputtable.bEditable,
          // description: item.sDescription,
          sortable: false,
          // valueGetter: item.sValue,
          renderCell: params => {
            const rowDataFilter = rows.filter((item) => item.id == params?.row?.id)?.[0];
            return (
              <>
                {/* {JSON.stringify(data1)} */}
                {/* {JSON.stringify(item.component.sType)} */}
                <InputTableDefaultAllComponent
                  item={item}
                  priceSelect={priceSelect}
                  csvRowCalculation={csvRowCalculation}
                  loadQtyCodesCSVData={loadQtyCodesCSVData}
                  csvFile={csvFile}
                  documentSelectTableData={documentSelectTableData}
                  rowClone={rowClone}
                  setRowClone={setRowClone}
                  isSubmited={isSubmited}
                  formAction={formAction}
                  handleClickOpen2={handleClickOpen2}
                  data={data1}
                  defaultTableEditData={defaultTableEditData}
                  format={format}
                  feildName={item.inputtable.sColumnID}
                  error={
                    getErrorDetails(defaultTableError, params.row.id)[item.inputtable.sColumnID]
                  }
                  takeInput={takeInput}
                  id={params.row.id}
                  value={params.row[item.inputtable.sColumnID]}
                  params={params}
                  mainData={mainTableID}
                  setQuantityTypeMapping={setQuantityTypeMapping}
                  quantityTypeMapping={quantityTypeMapping}
                  resetQuantityTypeDefault={resetQuantityTypeDefault}
                  setResetQuantityTypeDefault={setResetQuantityTypeDefault}
                  taxDefaultValueCode={taxDefaultValueCode}
                  setTaxDefaultValueCode={setTaxDefaultValueCode}
                  priceSelectFetchApi={priceSelectFetchApi}
                  availableFieldDataAware={availableFieldDataAware}
                  setAvailableFieldDataAware={setAvailableFieldDataAware}
                  setEditDataQtyType={setEditDataQtyType}
                  setBulkDataLoaded={setBulkDataLoaded}
                  bulkDataLoaded={bulkDataLoaded}
                  setIsPriceSelectClicked={setIsPriceSelectClicked}
                  isPriceSelectClicked={isPriceSelectClicked}
                  formData={data}
                  baseURL={baseURL}
                  paramsRow={params.row}
                  rowData={rowDataFilter}
                  allFeildForDoucmentSelect={allFeildForDoucmentSelect}
                />
              </>
            );
          }
        });
        }
      }
    });
  function replaceUriPlaceholders(data, uri) {
    return uri.replace(/{([^}]+)}/g, (match, key) => {
      return key in data ? data[key] : match;
    });
  }

  const selectedOBJ = item => {
    // alert(JSON.stringify(item));

    //  d=d+1
    //     alert(d)
    let uri =
      serverAddress +
      replaceUriPlaceholders(
        item,
        "/record/get/query?query=getInventoryKit&filter='{sInventoryCode}'"
      );

    const items = { id: 1, disc_type: "%" };
    data?.fixcolumns?.forEach(
      item => (items[item?.sColumnID] = item?.inputType?.component?.sDefaultValue || "")
    );
    data?.child?.forEach(
      item => (items[item.inputtable.sColumnID] = item?.component?.sDefaultValue || "")
    );

    const { id, ...obj } = items;
    const newRow = {
      // id: rows?.length + 1,
      ...obj
    };

    // setRows([]);
    if (item.sMode == "KIT") {
      // alert(JSON.stringify([newRow,newRow,newRow]));
      setLoading(true);
      axios
        .get(uri, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          let newData = response.data.data.records.map((items, ind) => ({
            ...newRow,
            id: items.id || ind + 1,
            col_item: items.sGroupKitItemCode,
            col_qty: items.dQuantity
          }));
          // setRows([])
          // alert(JSON.stringify(response.data.data.records));
          if (newData.length > 0) {
            // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 1255", rows);
            setRows(newData);
            // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 1255", newData);
            // alert(JSON.stringify('ddd'))
          }
          // setTimeout(() => {
          // }, 1000);
        })
        .catch(error => {
          console.error("Error fetching transaction document:", error);
        }).finally(() => {
          setLoading(false);
        });
    }
  };
  function getColumnIndexByHeaderName(columns, headerName) {
    // alert(JSON.stringify(columns))
    return columns.findIndex(column => column.field == headerName);
  }

  useEffect(() => {
    const updatedColumns = [];
    const fetchColumns = async () => {
      for (const item of data?.fixcolumns || []) {
        const data1 = { inputType: item };
        let dataAwareResult = true;

        if (!item?.sColDataAware || item?.sColDataAware == "false") {
          dataAwareResult = item?.bVisible == "true" ? true : false;
        } else {
          if (item?.sColDataAwareSource) {
            const uri = serverAddress + generateDynamicAPI(item?.sColDataAwareSource, defaultTableSelectedDataAwareData);
            if (!uri.includes("{") && !uri.includes("}")) {
              try {
                const response = await axios.get(uri, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                const findObj = response?.data?.data?.records[0];
                const dataAwareField = item?.sColDataAwareField?.replace("{", "").replace("}", "");
                dataAwareResult = findObj[dataAwareField] == item?.sColVisibleValue;
                if(dataAwareResult){
                  setDataAwareFixColumns((prev) => ([...prev, item]));
                } else {
                  setDataAwareFixColumns((prev) => {
                    const filteredItems = prev.filter((field) => field?.component?.sName != item?.component?.sName);
                    return filteredItems;
                  });
                }
              } catch (error) {
                console.error("Error fetching data:", error);
              }
            }
          } else {
            const dataAwareField = item?.sColDataAwareField?.replace("{", "").replace("}", "");
            dataAwareResult = defaultTableSelectedDataAwareData[dataAwareField] == item?.sColVisibleValue;
          }
        }
        if (dataAwareResult) {
          updatedColumns.push(item);
        }
      }
    };
    fetchColumns();
    setDataAwareFixColumns(updatedColumns);
  }, columnDataAware.map(dep => defaultTableSelectedDataAwareData[dep]));
  // this is for  fixcolumns
  data?.fixcolumns?.forEach((item, ind) => {
    const addTodo = useMemo(() => {
      setAllfeildsNames(pre => ({ ...pre, [item?.sColumnID]: item?.inputType?.component?.sName }));
    }, []);

    // const editable = true
    const editable = item?.bEditable == 0 ? true : false;
    if (dataAwareFixColumns && dataAwareFixColumns.length > 0) {
      const itemIndex = dataAwareFixColumns.findIndex((field) => field?.inputType?.component?.sName == item?.inputType?.component?.sName);
      if (itemIndex != -1) {
    switch (item.sColumnID) {
      case "col_qty":
        item?.bVisible == "true" &&
          columns.push({
            field: item.sColumnID,
            headerName: item.sHeader,
            width: item.iWidth,
            // editable: item.bEditable,
            type: item.sType,
            sortable: true,
            renderCell: params => {
              const index = rows.findIndex(row => row.id === params.row.id);
              return (
                <>
                  {/* {index+1} {getColumnIndexByHeaderName(columns, item.sColumnID)+1} */}
                  {/* {getErrorDetails(defaultTableError,params.row.id)[item?.sColumnID]} */}
                  <InputTableDefaultAllComponent
                    item={item}
                    isSubmited={isSubmited}
                    priceSelect={priceSelect}
                    csvRowCalculation={csvRowCalculation}
                    loadQtyCodesCSVData={loadQtyCodesCSVData}
                    csvFile={csvFile}
                    documentSelectTableData={documentSelectTableData}
                    rowClone={rowClone}
                  setRowClone={setRowClone}
                    formAction={formAction}
                    handleClickOpen2={handleClickOpen2}
                    data={item}
                    rowData={params.row}
                    error={getErrorDetails(defaultTableError, params.row.id)[item?.sColumnID]}
                    feildName={item.sColumnID}
                    takeInput={takeInput}
                    allFeildForDoucmentSelect={allFeildForDoucmentSelect}
                    data2={data}
                    id={params.row.id}
                    defaultTableEditData={defaultTableEditData}
                    qtySelectValue={params.row["qtySelect"]}
                    textValue={textValue}
                    value={params.row[item?.sColumnID]}
                    editable={editable}
                    params={params}
                    mainData={mainTableID}
                    setQuantityTypeMapping={setQuantityTypeMapping}
                    quantityTypeMapping={quantityTypeMapping}
                    resetQuantityTypeDefault={resetQuantityTypeDefault}
                    setResetQuantityTypeDefault={setResetQuantityTypeDefault}
                    taxDefaultValueCode={taxDefaultValueCode}
                  setTaxDefaultValueCode={setTaxDefaultValueCode}
                  priceSelectFetchApi={priceSelectFetchApi}
                  availableFieldDataAware={availableFieldDataAware}
                  setAvailableFieldDataAware={setAvailableFieldDataAware}
                  setEditDataQtyType={setEditDataQtyType}
                  setBulkDataLoaded={setBulkDataLoaded}
                  bulkDataLoaded={bulkDataLoaded}
                  setIsPriceSelectClicked={setIsPriceSelectClicked}
                  isPriceSelectClicked={isPriceSelectClicked}
                  formData={data}
                  baseURL={baseURL}
                  paramsRow={params.row}
                  />
                </>
              );
            }
            // InputTableDefaultAllComponent(
            //   item,
            //   takeInput,
            //   params.row.id,
            //   params.row[item?.sColumnID],
            //   editable
            // )
          });
        break;
      case "col_rate":
        // setAllfeildsNames((pre)=>({...pre,[item.sColumnID]:""}))
        const modifiedRows = rows.map(obj => replaceKeys(obj, allfeildsNames));
        // alert(JSON.stringify(item.inputType.component))
        item?.bVisible == "true" &&
          columns.push({
            field: item.sColumnID,
            headerName: item.sHeader,
            width: item.iWidth,
            // editable: item.bEditable,
            type: item.sType,
            sortable: true,
            renderCell: params => {
              const index = rows.findIndex(row => row.id === params.row.id);
              return (
                <>
                  {/* {priceSelectFetchApi} */}
                  {/* { generateDynamicAPI(priceSelectFetchApi, modifiedRows?.[params.row.id - 1])} */}
                  {/* {index+1} {getColumnIndexByHeaderName(columns, item.sColumnID)+1} */}
                  {/* {console.log("jsagdhkjBKJ", params)} */}
                  <InputTableDefaultAllComponent
                    item={item}
                    data={item}
                    handleClickOpen2={handleClickOpen2}
                    takeInput={takeInput}
                    defaultTableEditData={defaultTableEditData}
                    priceSelect={priceSelect}
                    csvRowCalculation={csvRowCalculation}
                    loadQtyCodesCSVData={loadQtyCodesCSVData}
                    csvFile={csvFile}
                    documentSelectTableData={documentSelectTableData}
                    rowClone={rowClone}
                  setRowClone={setRowClone}
                    id={params.row.id}
                    feildName={item.sColumnID}
                    error={getErrorDetails(defaultTableError, params.row.id)[item?.sColumnID]}
                    isSubmited={isSubmited}
                    formAction={formAction}
                    setTaxFirstOption={
                      baseURL +
                      generateDynamicAPI(priceSelectFetchApi, modifiedRows?.[params.row.id - 1])
                    }
                    // setTaxFirstOption={`${baseURL}/getCustomerPrice?pricetype=CUSTOMER&pricefor=${
                    //   textValue.sByPass === "Yes" ? "DEFAULT" : textValue?.sCustomerID
                    // }&item=${rows?.[params.row.id - 1]?.["col_item"]}`}
                    setPrice={setPrice}
                    value={params.row[item?.sColumnID]}
                    editable={editable}
                    params={params}
                    mainData={mainTableID}
                    setQuantityTypeMapping={setQuantityTypeMapping}
                    quantityTypeMapping={quantityTypeMapping}
                    resetQuantityTypeDefault={resetQuantityTypeDefault}
                    setResetQuantityTypeDefault={setResetQuantityTypeDefault}
                    taxDefaultValueCode={taxDefaultValueCode}
                  setTaxDefaultValueCode={setTaxDefaultValueCode}
                  priceSelectFetchApi={priceSelectFetchApi}
                  availableFieldDataAware={availableFieldDataAware}
                  setAvailableFieldDataAware={setAvailableFieldDataAware}
                  setEditDataQtyType={setEditDataQtyType}
                  setBulkDataLoaded={setBulkDataLoaded}
                  bulkDataLoaded={bulkDataLoaded}
                  setIsPriceSelectClicked={setIsPriceSelectClicked}
                  isPriceSelectClicked={isPriceSelectClicked}
                  formData={data}
                  baseURL={baseURL}
                  paramsRow={params.row}
                  />
                </>
              );
            }

            // InputTableDefaultAllComponent(
            //   item,
            //   takeInput,
            //   params.row.id,
            //   params.row[item?.sColumnID],
            //   `${baseURL}/getCustomerPrice?pricetype=CUSTOMER&pricefor=${
            //     textValue.sByPass === "Yes" ? "DEFAULT" : textValue?.sCustomerID
            //   }&item=${rows?.[params.row.id - 1]?.["col_item"]}`,
            //   setPrice
            // )
          });
        break;
      case "col_disc":
        item?.bVisible == "true" &&
          columns.push({
            field: item.sColumnID,
            headerName: item.sHeader,
            width: item.iWidth,
            // editable: item.bEditable,

            type: item.sType,
            sortable: true,
            renderCell: params => (
              <>
                {
                  <InputTableDefaultAllComponent
                    item={item}
                    isSubmited={isSubmited}
                    handleClickOpen2={handleClickOpen2}
                    defaultTableEditData={defaultTableEditData}
                    priceSelect={priceSelect}
                    csvRowCalculation={csvRowCalculation}
                    loadQtyCodesCSVData={loadQtyCodesCSVData}
                    csvFile={csvFile}
                    documentSelectTableData={documentSelectTableData}
                    rowClone={rowClone}
                  setRowClone={setRowClone}
                    formAction={formAction}
                    data={item}
                    error={getErrorDetails(defaultTableError, params.row.id)[item?.sColumnID]}
                    takeInput={takeInput}
                    feildName={item.sColumnID}
                    id={params.row.id}
                    value={params.row[item?.sColumnID]}
                    editable={editable}
                    params={params}
                    mainData={mainTableID}
                    setQuantityTypeMapping={setQuantityTypeMapping}
                    quantityTypeMapping={quantityTypeMapping}
                    resetQuantityTypeDefault={resetQuantityTypeDefault}
                    setResetQuantityTypeDefault={setResetQuantityTypeDefault}
                    taxDefaultValueCode={taxDefaultValueCode}
                  setTaxDefaultValueCode={setTaxDefaultValueCode}
                  priceSelectFetchApi={priceSelectFetchApi}
                  availableFieldDataAware={availableFieldDataAware}
                  setAvailableFieldDataAware={setAvailableFieldDataAware}
                  setEditDataQtyType={setEditDataQtyType}
                  setBulkDataLoaded={setBulkDataLoaded}
                  bulkDataLoaded={bulkDataLoaded}
                  setIsPriceSelectClicked={setIsPriceSelectClicked}
                  isPriceSelectClicked={isPriceSelectClicked}
                  formData={data}
                  baseURL={baseURL}
                  paramsRow={params.row}
                  />
                }

                <Box>
                  <Select
                    size="small"
                    name={"disc_type"}
                    {...item?.inputType?.component?.sProps}
                    {...item?.inputType?.component?.options?.others1}
                    value={params.row.disc_type}
                    onChange={e => takeInput(e, params.row.id, "Tax")}
                    id={`${item?.inputType?.component?.sName}-type-${params.row.id}`}
                  >
                    <MenuItem value={"%"}>%</MenuItem>
                    <MenuItem value={"Fix"}>Fix</MenuItem>
                  </Select>
                  <FormHelperText sx={{ color: getErrorDetails(defaultTableError, params.row.id)[item?.sColumnID] && getErrorDetails(defaultTableError, params.row.id)[item?.sColumnID] && "red" }}>{""}</FormHelperText>
                  {/* <FormHelperText sx={{}}>ff </FormHelperText> */}
                </Box>
              </>
            )
          });
        break;
      case "col_amount":
        item?.bVisible == "true" &&
          columns.push({
            field: item.sColumnID,
            headerName: item.sHeader,
            width: item.iWidth,
            // editable: item.bEditable,
            type: item.sType,

            sortable: true,
            renderCell: params => (
              <>
                {/* {JSON.stringify(getErrorDetails(defaultTableError,params.row.id)[item?.sColumnID])} */}
                <InputTableDefaultAllComponent
                  item={item}
                  handleClickOpen2={handleClickOpen2}
                  isSubmited={isSubmited}
                  defaultTableEditData={defaultTableEditData}
                  formAction={formAction}
                  data={item}
                  priceSelect={priceSelect}
                  csvRowCalculation={csvRowCalculation}
                  loadQtyCodesCSVData={loadQtyCodesCSVData}
                  csvFile={csvFile}
                  documentSelectTableData={documentSelectTableData}
                  rowClone={rowClone}
                  setRowClone={setRowClone}
                  feildName={item.sColumnID}
                  takeInput={takeInput}
                  id={params.row.id}
                  // error={getErrorDetails(defaultTableError, params.row.id)[item?.sColumnID]}
                  value={params.row[item?.sColumnID]}
                  editable={editable}
                  params={params}
                  mainData={mainTableID}
                  setQuantityTypeMapping={setQuantityTypeMapping}
                  quantityTypeMapping={quantityTypeMapping}
                  resetQuantityTypeDefault={resetQuantityTypeDefault}
                  setResetQuantityTypeDefault={setResetQuantityTypeDefault}
                  taxDefaultValueCode={taxDefaultValueCode}
                  setTaxDefaultValueCode={setTaxDefaultValueCode}
                  priceSelectFetchApi={priceSelectFetchApi}
                  availableFieldDataAware={availableFieldDataAware}
                  setAvailableFieldDataAware={setAvailableFieldDataAware}
                  setEditDataQtyType={setEditDataQtyType}
                  setBulkDataLoaded={setBulkDataLoaded}
                  bulkDataLoaded={bulkDataLoaded}
                  setIsPriceSelectClicked={setIsPriceSelectClicked}
                  isPriceSelectClicked={isPriceSelectClicked}
                  formData={data}
                  baseURL={baseURL}
                  paramsRow={params.row}
                />
              </>
            )
          });
        break;
      case "col_description":
        item?.bVisible == "true" &&
          columns.push({
            field: item.sColumnID,
            headerName: item.sHeader,
            width: item.iWidth,
            // editable: item.bEditable,
            type: item.sType,
            sortable: true,
            renderCell: params => (
              <InputTableDefaultAllComponent
                item={item}
                handleClickOpen2={handleClickOpen2}
                isSubmited={isSubmited}
                defaultTableEditData={defaultTableEditData}
                error={getErrorDetails(defaultTableError, params.row.id)[item?.sColumnID]}
                formAction={formAction}
                priceSelect={priceSelect}
                csvRowCalculation={csvRowCalculation}
                loadQtyCodesCSVData={loadQtyCodesCSVData}
                csvFile={csvFile}
                documentSelectTableData={documentSelectTableData}
                rowClone={rowClone}
                  setRowClone={setRowClone}
                data={item}
                feildName={item.sColumnID}
                takeInput={takeInput}
                id={params.row.id}
                value={params.row[item?.sColumnID]}
                editable={editable}
                params={params}
                mainData={mainTableID}
                setQuantityTypeMapping={setQuantityTypeMapping}
                quantityTypeMapping={quantityTypeMapping}
                resetQuantityTypeDefault={resetQuantityTypeDefault}
                setResetQuantityTypeDefault={setResetQuantityTypeDefault}
                taxDefaultValueCode={taxDefaultValueCode}
                  setTaxDefaultValueCode={setTaxDefaultValueCode}
                  priceSelectFetchApi={priceSelectFetchApi}
                  availableFieldDataAware={availableFieldDataAware}
                  setAvailableFieldDataAware={setAvailableFieldDataAware}
                  setEditDataQtyType={setEditDataQtyType}
                  setBulkDataLoaded={setBulkDataLoaded}
                  bulkDataLoaded={bulkDataLoaded}
                  setIsPriceSelectClicked={setIsPriceSelectClicked}
                  isPriceSelectClicked={isPriceSelectClicked}
                  formData={data}
                  baseURL={baseURL}
                  paramsRow={params.row}
                />
            )
          });
        break;
      case "col_item":
        const data1 = [{ data: item }];
        const size = { withwidth: item.iWidth + 100, fullWidth: true, size: "small" };
        // item?.bHidden == 0 &&
        // alert(item.sColumnID)
        item?.bVisible == "true" &&
          columns.push({
            field: item.sColumnID,
            headerName: item.sHeader,
            width: item.iWidth,
            // editable: item.bEditable,
            type: item.sType,
            sortable: true,
            renderCell: params => (
              <>
                <InputTableDefaultAllComponent
                  item={item}
                  priceSelect={priceSelect}
                  csvRowCalculation={csvRowCalculation}
                  loadQtyCodesCSVData={loadQtyCodesCSVData}
                  csvFile={csvFile}
                  documentSelectTableData={documentSelectTableData}
                  rowClone={rowClone}
                  setRowClone={setRowClone}
                  defaultTableEditData={defaultTableEditData}
                  handleClickOpen2={handleClickOpen2}
                  isSubmited={isSubmited}
                  error={getErrorDetails(defaultTableError, params.row.id)[item?.sColumnID]}
                  formAction={"ADD"}
                  data={item}
                  selectedOBJ={selectedOBJ}
                  mapping={item?.sMapping || {}}
                  setallAccountData={allAccountData?.length == 0 ? setallAccountData : null}
                  feildName={item.sColumnID}
                  setkitMappingArray={setkitMappingArray}
                  takeInput={takeInput}
                  id={params.row.id}
                  value={params.row[item?.sColumnID]}
                  editable={editable}
                  params={params}
                  mainData={mainTableID}
                  setQuantityTypeMapping={setQuantityTypeMapping}
                  quantityTypeMapping={quantityTypeMapping}
                  resetQuantityTypeDefault={resetQuantityTypeDefault}
                  setResetQuantityTypeDefault={setResetQuantityTypeDefault}
                  taxDefaultValueCode={taxDefaultValueCode}
                  setTaxDefaultValueCode={setTaxDefaultValueCode}
                  priceSelectFetchApi={priceSelectFetchApi}
                  availableFieldDataAware={availableFieldDataAware}
                  setAvailableFieldDataAware={setAvailableFieldDataAware}
                  setEditDataQtyType={setEditDataQtyType}
                  setBulkDataLoaded={setBulkDataLoaded}
                  bulkDataLoaded={bulkDataLoaded}
                  setIsPriceSelectClicked={setIsPriceSelectClicked}
                  isPriceSelectClicked={isPriceSelectClicked}
                  formData={data}
                  baseURL={baseURL}
                  paramsRow={params.row}
                />
              </>
            )
          });
        break;

      case "col_tax":
        // fetchData(item.inputType.data.sDataSource)

        item?.bVisible == "true" &&
          columns.push({
            field: item.sColumnID,
            headerName: item.sHeader,
            width: item.iWidth,
            // editable: item.bEditable,
            type: item.sType,
            sortable: true,
            renderCell: params => {
              const setcolTaxOptionFun = item => {
                // alert(JSON.stringify(item) )
                if (colTaxOption.length == 0) {
                  setcolTaxOption(item);
                }
                // setcolTaxOption(pre => {
                //   if (pre.length == 0) {
                //     return item;
                //   }
                // });
              };
              return (
                <>
                  {/* {params.row[item?.sColumnID]} */}
                  <InputTableDefaultAllComponent
                    item={item}
                    priceSelect={priceSelect}
                    csvRowCalculation={csvRowCalculation}
                    loadQtyCodesCSVData={loadQtyCodesCSVData}
                    csvFile={csvFile}
                    documentSelectTableData={documentSelectTableData}
                    rowClone={rowClone}
                  setRowClone={setRowClone}
                    isSubmited={isSubmited}
                    defaultTableEditData={defaultTableEditData}
                    formAction={formAction}
                    handleClickOpen2={handleClickOpen2}
                    data={item}
                    valueStaxCode={params.row["sTaxCode"]}
                    error={getErrorDetails(defaultTableError, params.row.id)[item.sColumnID]}
                    setcolTaxOption={setcolTaxOptionFun}
                    feildName={item.sColumnID}
                    takeInput={takeInput}
                    id={params.row.id}
                    value={params.row[item?.sColumnID]}
                    editable={editable}
                    params={params}
                    mainData={mainTableID}
                    setQuantityTypeMapping={setQuantityTypeMapping}
                    quantityTypeMapping={quantityTypeMapping}
                    resetQuantityTypeDefault={resetQuantityTypeDefault}
                    setResetQuantityTypeDefault={setResetQuantityTypeDefault}
                    taxDefaultValueCode={taxDefaultValueCode}
                  setTaxDefaultValueCode={setTaxDefaultValueCode}
                  priceSelectFetchApi={priceSelectFetchApi}
                  availableFieldDataAware={availableFieldDataAware}
                  setAvailableFieldDataAware={setAvailableFieldDataAware}
                  setEditDataQtyType={setEditDataQtyType}
                  setBulkDataLoaded={setBulkDataLoaded}
                  bulkDataLoaded={bulkDataLoaded}
                  setIsPriceSelectClicked={setIsPriceSelectClicked}
                  isPriceSelectClicked={isPriceSelectClicked}
                  formData={data}
                  baseURL={baseURL}
                  paramsRow={params.row}
                  />
                </>
              );
            }
          });
        break;
      case "col_account":
        item?.bVisible == "true" &&
          columns.push({
            field: item.sColumnID,
            headerName: item.sHeader,
            width: item.iWidth,
            // editable: item.bEditable,
            type: item.sType,
            sortable: true,
            renderCell: params => (
              <>
                {/* {params.row[item?.sColumnID]} */}

                <InputTableDefaultAllComponent
                  item={item}
                  defaultTableEditData={defaultTableEditData}
                  handleClickOpen2={handleClickOpen2}
                  priceSelect={priceSelect}
                  csvRowCalculation={csvRowCalculation}
                  loadQtyCodesCSVData={loadQtyCodesCSVData}
                  csvFile={csvFile}
                  documentSelectTableData={documentSelectTableData}
                  rowClone={rowClone}
                  setRowClone={setRowClone}
                  isSubmited={isSubmited}
                  formAction={"ADD"}
                  data={item}
                  error={getErrorDetails(defaultTableError, params.row.id)[item.sColumnID]}
                  mapping={item?.sMapping || {}}
                  feildName={item.sColumnID}
                  takeInput={takeInput}
                  id={params.row.id}
                  col_item={params.row["col_item"]}
                  value={params.row[item?.sColumnID]}
                  editable={editable}
                  params={params}
                  mainData={mainTableID}
                  setQuantityTypeMapping={setQuantityTypeMapping}
                  quantityTypeMapping={quantityTypeMapping}
                  resetQuantityTypeDefault={resetQuantityTypeDefault}
                  setResetQuantityTypeDefault={setResetQuantityTypeDefault}
                  taxDefaultValueCode={taxDefaultValueCode}
                  setTaxDefaultValueCode={setTaxDefaultValueCode}
                  priceSelectFetchApi={priceSelectFetchApi}
                  availableFieldDataAware={availableFieldDataAware}
                  setAvailableFieldDataAware={setAvailableFieldDataAware}
                  setEditDataQtyType={setEditDataQtyType}
                  setBulkDataLoaded={setBulkDataLoaded}
                  bulkDataLoaded={bulkDataLoaded}
                  setIsPriceSelectClicked={setIsPriceSelectClicked}
                  isPriceSelectClicked={isPriceSelectClicked}
                  formData={data}
                  baseURL={baseURL}
                  paramsRow={params.row}
                />
                <br />
              </>
            )
          });
        break;
      case "col_other":
        /true/.test(data?.otherCost?.bEnabled) &&
        /true/.test(item?.bVisible) &&
          columns.push({
            field: item.sColumnID,
            headerName: item.sHeader,
            width: item.iWidth,
            // editable: item.bEditable,
            type: item.sType,
            sortable: true,
            renderCell: params => (
              <>
                <InputTableDefaultAllComponent
                  item={item}
                  isSubmited={isSubmited}
                  formAction={"ADD"}
                  defaultTableEditData={defaultTableEditData}
                  priceSelect={priceSelect}
                  csvRowCalculation={csvRowCalculation}
                  loadQtyCodesCSVData={loadQtyCodesCSVData}
                  csvFile={csvFile}
                  documentSelectTableData={documentSelectTableData}
                  rowClone={rowClone}
                  setRowClone={setRowClone}
                  handleClickOpen2={handleClickOpen2}
                  data={item}
                  setallAccountData={allAccountData.length == 0 ? setallAccountData : null}
                  feildName={item.sColumnID}
                  takeInput={takeInput}
                  id={params.row.id}
                  col_item={params.row["col_item"]}
                  value={params.row[item?.sColumnID]}
                  editable={editable}
                  params={params}
                  mainData={mainTableID}
                  setQuantityTypeMapping={setQuantityTypeMapping}
                  quantityTypeMapping={quantityTypeMapping}
                  resetQuantityTypeDefault={resetQuantityTypeDefault}
                  setResetQuantityTypeDefault={setResetQuantityTypeDefault}
                  taxDefaultValueCode={taxDefaultValueCode}
                  setTaxDefaultValueCode={setTaxDefaultValueCode}
                  priceSelectFetchApi={priceSelectFetchApi}
                  availableFieldDataAware={availableFieldDataAware}
                  setAvailableFieldDataAware={setAvailableFieldDataAware}
                  setEditDataQtyType={setEditDataQtyType}
                  setBulkDataLoaded={setBulkDataLoaded}
                  bulkDataLoaded={bulkDataLoaded}
                  setIsPriceSelectClicked={setIsPriceSelectClicked}
                  isPriceSelectClicked={isPriceSelectClicked}
                  formData={data}
                  baseURL={baseURL}
                  paramsRow={params.row}
                />
              </>
            )
          });

        break;
      case "col_otheramount":
        /true/.test(data?.otherCost?.bEnabled) &&
          /true/.test(item?.bVisible) &&
          columns.push({
            field: item.sColumnID,
            headerName: item.sHeader,
            width: item.iWidth,
            // editable: item.bEditable,
            type: item.sType,
            sortable: true,
            renderCell: params => (
              <>
                {/* {params.row[item?.sColumnID]} */}
                <InputTableDefaultAllComponent
                  item={item}
                  isSubmited={isSubmited}
                  formAction={"ADD"}
                  handleClickOpen2={handleClickOpen2}
                  defaultTableEditData={defaultTableEditData}
                  priceSelect={priceSelect}
                  csvRowCalculation={csvRowCalculation}
                  loadQtyCodesCSVData={loadQtyCodesCSVData}
                  csvFile={csvFile}
                  documentSelectTableData={documentSelectTableData}
                  rowClone={rowClone}
                  setRowClone={setRowClone}
                  data={item}
                  setallAccountData={allAccountData.length == 0 ? setallAccountData : null}
                  feildName={item.sColumnID}
                  takeInput={takeInput}
                  id={params.row.id}
                  col_item={params.row["col_item"]}
                  value={params.row[item?.sColumnID]}
                  editable={editable}
                  params={params}
                  mainData={mainTableID}
                  setQuantityTypeMapping={setQuantityTypeMapping}
                  quantityTypeMapping={quantityTypeMapping}
                  resetQuantityTypeDefault={resetQuantityTypeDefault}
                  setResetQuantityTypeDefault={setResetQuantityTypeDefault}
                  taxDefaultValueCode={taxDefaultValueCode}
                  setTaxDefaultValueCode={setTaxDefaultValueCode}
                  priceSelectFetchApi={priceSelectFetchApi}
                  availableFieldDataAware={availableFieldDataAware}
                  setAvailableFieldDataAware={setAvailableFieldDataAware}
                  setEditDataQtyType={setEditDataQtyType}
                  setBulkDataLoaded={setBulkDataLoaded}
                  bulkDataLoaded={bulkDataLoaded}
                  setIsPriceSelectClicked={setIsPriceSelectClicked}
                  isPriceSelectClicked={isPriceSelectClicked}
                  formData={data}
                  baseURL={baseURL}
                  paramsRow={params.row}
                />
              </>
            )
          });
        break;
      default:
        item?.bVisible == "true" &&
          columns.push({
            field: item.sColumnID,
            headerName: item.sHeader,
            width: item.iWidth,
            // editable: item.bEditable,
            type: item.sType,
            sortable: true,
            renderCell: params => (
              <>
                {/* {params.row[item?.sColumnID]} */}
                <InputTableDefaultAllComponent
                  item={item}
                  isSubmited={isSubmited}
                  formAction={"ADD"}
                  priceSelect={priceSelect}
                  csvRowCalculation={csvRowCalculation}
                  loadQtyCodesCSVData={loadQtyCodesCSVData}
                  csvFile={csvFile}
                  documentSelectTableData={documentSelectTableData}
                  rowClone={rowClone}
                  setRowClone={setRowClone}
                  handleClickOpen2={handleClickOpen2}
                  defaultTableEditData={defaultTableEditData}
                  data={item}
                  setallAccountData={allAccountData.length == 0 ? setallAccountData : null}
                  feildName={item.sColumnID}
                  takeInput={takeInput}
                  id={params.row.id}
                  col_item={params.row["col_item"]}
                  value={params.row[item?.sColumnID]}
                  editable={editable}
                  params={params}
                  mainData={mainTableID}
                  setQuantityTypeMapping={setQuantityTypeMapping}
                  quantityTypeMapping={quantityTypeMapping}
                  resetQuantityTypeDefault={resetQuantityTypeDefault}
                  setResetQuantityTypeDefault={setResetQuantityTypeDefault}
                  taxDefaultValueCode={taxDefaultValueCode}
                  setTaxDefaultValueCode={setTaxDefaultValueCode}
                  priceSelectFetchApi={priceSelectFetchApi}
                  availableFieldDataAware={availableFieldDataAware}
                  setAvailableFieldDataAware={setAvailableFieldDataAware}
                  setEditDataQtyType={setEditDataQtyType}
                  setBulkDataLoaded={setBulkDataLoaded}
                  bulkDataLoaded={bulkDataLoaded}
                  setIsPriceSelectClicked={setIsPriceSelectClicked}
                  isPriceSelectClicked={isPriceSelectClicked}
                  formData={data}
                  baseURL={baseURL}
                  paramsRow={params.row}
                />
              </>
            )
          });
        break;
        }
      }
    }
  });

  // this is for adding row to the table
  const handleAddRow = (e, rowData, rowId, reset = false) => {
    // setRows([{ id: 1 }, { id: 2 }, { id: 3 }]);
    const items = { id: 1, disc_type: "%" };
    data?.fixcolumns?.forEach(
      item => (items[item?.sColumnID] = item?.inputType?.component?.sDefaultValue)
    );
    data?.child?.forEach(
      item => (items[item.inputtable.sColumnID] = item?.component?.sDefaultValue)
    );
    const maxId = Math.max(...rows.map(row => row.id));
    const { id, ...obj } = items;
    const newRow = {
      id: maxId + 1,
      ...obj
    };

    if (e.target.value) {
      const numNewRows = parseInt(e.target.value);
      const newRows = Array.from({ length: numNewRows }, (_, i) => ({
        id: maxId + i + 1,
        ...obj
      }));

      if(reset){
        // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 1743", rows);
        setRows([...newRows]);
        // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 1743", [...newRows]);
      } else {
        // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 1747", rows);
        setRows([...rows, ...newRows]);
        // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 1747", [...rows, ...newRows]);
      }
    } else {
      if(reset){
        // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 1753", rows);
        setRows([newRow]);
        // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 1753", [newRow]);
      } else {
        // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 1757", rows);
        if(rowId){
          const leftRowIndex = rows.findIndex((item) => item.id == rowId);
          const updatedRows = [];
          for(let index = 0; index <= leftRowIndex; index++){
            updatedRows.push(rows[index]);
          }
          updatedRows.push(newRow);
          for(let index = leftRowIndex + 1; index < rows.length; index++){
            updatedRows.push(rows[index]);
          }
          setRows(updatedRows);
        } else {
          setRows([...rows, newRow]);
        }
        // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 1757", [...rows, newRow]);
      }
    }
  };

  useEffect(() => {
    if(formAction == "EDIT"){
      rows.forEach((row) => {
        const qty = +row.col_qty?.toString().replace(/,/g, "") || 0;
        let rate = +row.col_rate?.toString().replace(/,/g, "") || 0;
        const disc = +row.col_disc?.toString().replace(/,/g, "") || 0;
        let tax;
        if (typeof row.col_tax == "string") {
          tax =
            getVATPercentage(
              getPercent(
                row.sTaxCode
                  ? row.sTaxCode
                  : row.col_tax
                  ? row.col_tax
                  : colTaxOption.length == 1
                  ? colTaxOption[0]?.sTaxCode
                  : row.col_tax
              )[0]
            ) || 0;
        } else {
          tax =
            getVATPercentage(
              getPercent(
                row.sTaxCode
                  ? row.sTaxCode
                  : row.col_tax
                  ? row.col_tax
                  : colTaxOption.length == 1
                  ? colTaxOption[0]?.sTaxCode
                  : row.col_tax
              )[0]
            ) || 0;
        }
        if (row.sTaxCode == 0) {
          tax = 0;
        }
        let disctype = row.disc_type || "%";
        const discDecimal = disc / 100;
        const taxDecimal = 0;
        let amount = 0;  
        if (disctype === "%") {
          amount = qty * rate * (1 - discDecimal) * (1 + taxDecimal);
        }
        if (disctype === "Fix") {
          amount = (qty * rate - disc) * (1 + taxDecimal);
        } 
        let taxAmount = 0;
        if (selectedTax == "Exclusive") {
          taxAmount = parseFloat((amount * (tax / 100)).toFixed(2));
        } else {
          taxAmount = parseFloat(((amount / ((100 + tax) / 100)) * (tax / 100)).toFixed(2));
        }
        updateTaxData({
          id: row.id,
          taxCode: row.sTaxCode,
          taxAmount: taxAmount,
          amountOf: Number(
            selectedTax == "Exclusive"
              ? amount?.toString().replaceAll(",", "")
              : (amount - taxAmount)?.toString().replaceAll(",", "")
            ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          taxType: findObjectByValue(colTaxOption || [], row.sTaxCode).sTaxName || row.sTaxName
        });
      })
    }
  }, [rows])

  const handleCloneData = (data, ind) => {
    const rowData = data.filter(item => item.id === ind);
    const qtyTypeMappData = quantityTypeMapping.filter(item => item.id === rowData[0]?.id);
    console.log("jhwgqbhvfehjwvfewe", rowData, qtyTypeMappData, ind);
    const maxId = Math.max(...rows.map(row => row.id));
    const leftRowIndex = rows.findIndex((item) => item.id == ind);
    const updatedRows = [];
    const updatedQtyTypeMapping = [ ...quantityTypeMapping ];
    for(let index = 0; index <= leftRowIndex; index++){
      updatedRows.push(rows[index]);
    }
    updatedRows.push({ ...rowData[0], id: maxId + 1 });
    updatedQtyTypeMapping.push({ ...qtyTypeMappData[0], id: maxId + 1 });
    for(let index = leftRowIndex + 1; index < rows.length; index++){
      updatedRows.push(rows[index]);
    }
    // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 1777", rows);
    setRows(updatedRows);
    setRowClone({id: maxId + 1, qtySelect: rowData[0]["qtySelect"]});
    setQuantityTypeMapping(updatedQtyTypeMapping);
    // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 1777", updatedRows);
  };
  //   this is for add row in table
  if (
    data?.component?.options?.enableRowDelete ||
    data?.component?.options?.enableRowClone ||
    data?.component?.options?.enableRowAdd
  ) {
    data?.component?.options?.mode === "DEFAULT" &&
      columns.push({
        field: "col_actions",
        headerName: "",
        width: 100,
        sortable: false,
        disableColumnMenu: true,
        renderCell: params => {
          const handleDelete = () => {
            const newRows = rows.filter(row => row.id !== params.row.id);
            // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 1797", rows);
            setRows(newRows);
            const allTypesTaxArray = allTypesTaxesArry.filter((item) => item.id !== params.row.id);
            setAllTypesTaxesArry(allTypesTaxArray);
            // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 1797", newRows);
            const qtyTypeMapping = quantityTypeMapping.filter(row => row.id !== params.row.id);
            setQuantityTypeMapping(qtyTypeMapping);

            if (rows.length == 1) {
              const items = { id: 1, disc_type: "%" };
              data?.fixcolumns?.forEach(
                item => (items[item?.sColumnID] = item?.inputType?.component?.sDefaultValue)
              );
              data?.child?.forEach(
                item => (items[item.inputtable.sColumnID] = item?.component?.sDefaultValue)
              );

              const { id, ...obj } = items;
              const newRow = {
                id: 1,
                ...obj
              };
              // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 1815", rows);
              setRows([newRow]);
              // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 1815", [newRow]);
            }
          };
          if (params.row.id === 1) {
            return (
              <>
                {data?.component?.options?.enableRowAdd && (
                  <IconButton 
                    id={data.component.sName + "-add-" + params.row.id}
                    onClick={e => handleAddRow(e, rows, params.row.id)} 
                    aria-label="add"
                  >
                    <AddCircleOutlineSharpIcon />
                  </IconButton>
                )}
                {data?.component?.options?.enableRowClone && (
                  <IconButton
                    onClick={e => handleCloneData(rows, params.row.id)}
                    aria-label="clone"
                    id={data.component.sName + "-clone-" + params.row.id}
                  >
                    <MoveDownIcon />
                  </IconButton>
                )}
                {data?.component?.options?.enableRowDelete && (
                  <IconButton 
                    onClick={() => handleDelete()} 
                    aria-label="delete"
                    id={data.component.sName + "-delete-" + params.row.id}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                )}
              </>
            );
          }
          return (
            <>
              {data?.component?.options?.enableRowAdd && (
                <IconButton 
                  onClick={e => handleAddRow(e, rows, params.row.id)} 
                  aria-label="add"
                  id={data.component.sName + "-add-" + params.row.id}
                >
                  <AddCircleOutlineSharpIcon />
                </IconButton>
              )}
              {data?.component?.options?.enableRowClone && (
                <IconButton 
                  onClick={e => handleCloneData(rows, params.row.id)} 
                  aria-label="clone"
                  id={data.component.sName + "-clone-" + params.row.id}
                >
                  <MoveDownIcon />
                </IconButton>
              )}
              {data?.component?.options?.enableRowDelete && (
                <IconButton 
                  onClick={() => handleDelete()} 
                  aria-label="delete"
                  id={data.component.sName + "-delete-" + params.row.id}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              )}
            </>
          );
        }
      });
  }

  // console.log(rows,'fgwufgdwygfuwefg');
  useEffect(() => {
    const validate = {};
    const items = { id: 1, disc_type: "%", qtySelect: "" };
    const allFeildForDoucmentSelect = {};
    data?.fixcolumns?.forEach(item => {
      items[item?.sColumnID] = item?.inputType?.component?.sDefaultValue;
      allFeildForDoucmentSelect[item?.sColumnID] = item?.inputType?.component?.sName;
      if (item?.sColumnID == "col_otheramount") {
        if (data?.otherCost?.bEnabled) {
          validate[item?.sColumnID] = item?.inputType?.validation;
        }
      } else if (item?.sColumnID == "col_other") {
        if (data?.otherCost?.bEnabled) {
          validate[item?.sColumnID] = item?.inputType?.validation;
        }
      } else if (item?.sColumnID == "col_tax") {
        items["col_tax"] = getVATPercentage(
          getPercent(
            item?.inputType?.component?.sDefaultValue
              ? item?.inputType?.component?.sDefaultValue
              : colTaxOption.length == 1
              ? colTaxOption[0]?.sTaxCode
              : item?.inputType?.component?.sDefaultValue
          )[0]
        );
        validate[item?.sColumnID] = item?.inputType?.validation;
      } else {
        validate[item?.sColumnID] = item?.inputType?.validation;
      }

      if (item?.sColumnID == "col_qty") {
        // alert(JSON.stringify(item.bVisible) )
        if (item.bVisible == "false") {
          items[item?.sColumnID] = 1;
        }
      }
    });
    // initial State for child columns
    data?.child?.forEach(item => {
      // alert(JSON.stringify(item.inputtable.sColumnID));
      items[item.inputtable.sColumnID] = item?.component.sDefaultValue || "";
      allFeildForDoucmentSelect[item.inputtable.sColumnID] = item?.component.sName || "";
      validate[item.inputtable.sColumnID] = item?.validation;
    });
    // alert(JSON.stringify(items))
    setDefaultState(items);
    setallFeildForDoucmentSelect(allFeildForDoucmentSelect);
    setdefaultTableValidation(validate);
    if (formAction == "ADD" && (!data?.data?.bCascade || !data?.data?.sDataAware)) {
      // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 1938", rows);
      setRows([items]);
      // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 1938", [items]);
    }
  }, [data, colTaxOption]);

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

  function moveItemToFirstIndex(arr, field, col_account) {
    const index = arr.findIndex(item => item[field] === col_account);
    if (index > -1) {
      const [removed] = arr.splice(index, 1);
      arr.unshift(removed);
    }
    return arr;
  }

  moveItemToFirstIndex(columns, "field", "col_account");
  moveItemToZerothIndex(columns, "field", "col_item");
  moveItemToZerothIndex(columns, "field", "SN");
  const [BulkLoadData, setBulkLoadData] = useState([]);
  useEffect(() => {
    const items = { disc_type: "%", withholding_disc_type: "%" };
    data?.summaryfields?.sSummaryDetails?.forEach(
      item => (items[item?.sSummaryID] = item?.inputType?.component?.sDefaultValue)
    );
    // initial State for child columns
    setsummaryFeilds(items);
  }, []);

  useEffect(() => {
    // summaryValidationFeilds
    // alert(JSON.stringify(summaryFeilds))
    setSummaryForBackend(prevState =>
      prevState.map(item =>
        item.sSummaryID === "summ_subtotal"
          ? { ...item, ["sValue"]: subTotal.toLocaleString() || 0 }
          : item
      )
    );
    const summ_handling = summaryFeilds?.summ_handling
      ? +summaryFeilds.summ_handling.replace(/,/g, "") + +subTotal.replace(/,/g, "")
      : +subTotal.replace(/,/g, "");

    if (summaryFeilds.summ_handling) {
      if (summaryFeilds.summ_handling === "0.00") {
        setSumm_handling("0.00");
        setSummaryForBackend(prevState =>
          prevState.map(item =>
            item.sSummaryID === "summ_handling" ? { ...item, ["sValue"]: "0.00" } : item
          )
        );
      } else {
        setSumm_handling(handlePointChange(parseFloat(summaryFeilds.summ_handling).toFixed(2), 2));
        setSummaryForBackend(prevState =>
          prevState.map(item =>
            item.sSummaryID === "summ_handling"
              ? {
                  ...item,
                  ["sValue"]: handlePointChange(
                    parseFloat(summaryFeilds.summ_handling).toFixed(2),
                    2
                  )
                }
              : item
          )
        );
      }
    }

    const summ_shipping = summaryFeilds.summ_shipping
      ? +summaryFeilds.summ_shipping.replace(/,/g, "") + +summ_handling
      : +summ_handling;

    if (summaryFeilds.summ_shipping) {
      if (summaryFeilds.summ_shipping === "0.00") {
        setSumm_shipping("0.00");
        setSummaryForBackend(prevState =>
          prevState.map(item =>
            item.sSummaryID === "summ_shipping" ? { ...item, ["sValue"]: "0.00" } : item
          )
        );
      } else {
        setSumm_shipping(handlePointChange(parseFloat(summaryFeilds.summ_shipping).toFixed(2), 2));
        setSummaryForBackend(prevState =>
          prevState.map(item =>
            item.sSummaryID === "summ_shipping"
              ? {
                  ...item,
                  ["sValue"]: handlePointChange(
                    parseFloat(summaryFeilds.summ_shipping).toFixed(2),
                    2
                  )
                }
              : item
          )
        );
      }
    }

    // console.log(summaryFeilds.disc_type == '%');
    const summ_discount = summaryFeilds.summ_discount
      ? summaryFeilds.disc_type == "%"
        ? summ_shipping * (1 - +summaryFeilds.summ_discount.replace(/,/g, "") / 100)
        : +summ_shipping - +summaryFeilds.summ_discount.replace(/,/g, "")
      : +summ_shipping;

    let discountVal =
      summaryFeilds.disc_type == "%"
        ? (summ_shipping * +summaryFeilds?.summ_discount?.replace(/,/g, "")) / 100
        : +summaryFeilds?.summ_discount?.replace(/,/g, "");
    if (summaryFeilds.summ_discount) {
      if (summaryFeilds.summ_discount === "0.00") {
        setSumm_discount("0.00");
        setSummaryForBackend(prevState =>
          prevState.map(item =>
            item.sSummaryID === "summ_discount" ? { ...item, ["sValue"]: "0.00" } : item
          )
        );
      } else {
        setSumm_discount(handlePointChange(parseFloat(discountVal).toFixed(2), 2));
        setSummaryForBackend(prevState =>
          prevState.map(item =>
            item.sSummaryID === "summ_discount"
              ? {
                  ...item,
                  ["sValue"]: handlePointChange(parseFloat(discountVal).toFixed(2), 2),
                  ["sInputValue"]: item.sInputValue.endsWith("%")
                    ? summaryFeilds.disc_type == "%"
                      ? item.sInputValue
                      : item.sInputValue.replace("%", "")
                    : summaryFeilds.disc_type == "%"
                    ? item.sInputValue + "%"
                    : item.sInputValue

                  //  item.sInputValue
                  // :
                  // ? item.sInputValue + "%"
                  // : item.sInputValue.replace("%", "")
                }
              : item
          )
        );
      }
    }

    const summ_adjustment = summaryFeilds.summ_adjustment
      ? +summ_discount - +summaryFeilds.summ_adjustment.replace(/,/g, "")
      : +summ_discount;

    if (summaryFeilds.summ_adjustment) {
      if (summaryFeilds.summ_adjustment === "0.00") {
        setSumm_adjustment("0.00");
        setSummaryForBackend(prevState =>
          prevState.map(item =>
            item.sSummaryID === "summ_adjustment" ? { ...item, ["sValue"]: "0.00" } : item
          )
        );
      } else {
        setSumm_adjustment(
          handlePointChange(parseFloat(summaryFeilds.summ_adjustment).toFixed(2), 2)
        );
        setSummaryForBackend(prevState =>
          prevState.map(item =>
            item.sSummaryID === "summ_adjustment"
              ? {
                  ...item,
                  ["sValue"]: handlePointChange(
                    parseFloat(summaryFeilds.summ_adjustment).toFixed(2),
                    2
                  )
                }
              : item
          )
        );
      }
    }

    // summ_tax
    // alert(   getPercent(summaryFeilds.summ_tax) )
    const summ_Tax = getVATPercentage(getPercentSummary(summaryFeilds.summ_tax))
      ? +summ_adjustment *
        (1 +
          getVATPercentage(
            getVATPercentage(getPercentSummary(summaryFeilds.summ_tax)) == ""
              ? 0
              : +getVATPercentage(getPercentSummary(summaryFeilds.summ_tax))
          ) /
            100)
      : +summ_adjustment;
    // if (getVATPercentage(getPercent(summaryFeilds.summ_tax))) {
    const taxnew =
      ((getVATPercentage(getPercentSummary(summaryFeilds.summ_tax)) == ""
        ? 0
        : +getVATPercentage(getPercentSummary(summaryFeilds.summ_tax))) *
        summ_adjustment) /
      100;
    // alert(getVATPercentage(getPercent(summaryFeilds.summ_tax)))
    if (
      getVATPercentage(getPercentSummary(summaryFeilds.summ_tax)) === "0.00" ||
      getVATPercentage(getPercentSummary(summaryFeilds.summ_tax)) === "" ||
      getVATPercentage(getPercentSummary(summaryFeilds.summ_tax)) == 0
    ) {
      setSumm_tax("0.00");
      setSummaryForBackend(prevState =>
        prevState.map(item =>
          item.sSummaryID === "summ_tax" ? { ...item, ["sValue"]: "0.00" } : item
        )
      );
    } else {
      // alert(taxnew)
      setSumm_tax(handlePointChange(parseFloat(taxnew).toFixed(2), 2));
      setSummaryForBackend(prevState =>
        prevState.map(item =>
          item.sSummaryID === "summ_tax"
            ? {
                ...item,
                sInputValue: summaryFeilds.summ_tax,
                ["sValue"]: handlePointChange(parseFloat(taxnew).toFixed(2), 2)
              }
            : item
        )
      );
    }

    // }

    // * (1 + taxDecimal)
    setSumm_grandTotal(handlePointChange(parseFloat(summ_Tax).toFixed(2), 2));
    setSummaryForBackend(prevState =>
      prevState.map(item =>
        item.sSummaryID === "summ_grandtotal"
          ? {
              ...item,
              ["sValue"]: `${handlePointChange(
                (
                  parseFloat(summ_Tax) +
                  allTypesTaxesArry.reduce((acc, item) => acc + item.taxAmount, 0)
                ).toFixed(2),
                2
              )}`
            }
          : item
      )
    );
  }, [rows, summaryFeilds, subTotal]);
  //(parseFloat(summ_grandTotal?.toString()?.replace(/,/g, ""))).toFixed(2)
  function replaceKeys(obj, allfields) {
    // const {...obj} = obf
    // delete obj.col_tax

    const newObj = {};
    for (const key in obj) {
      if (key in allfields) {
        if (key == "col_disc") {
          newObj[allfields[key]] = obj["disc_type"] == "%" ? obj[key] + "%" : obj[key];
        } else {
          if(key === "col_tax"){
            newObj[allfields[key]] = obj[allfields[key]];
          }else if (key != "disc_type") {
            newObj[allfields[key]] = obj[key];
          }
        }
      } else {
        newObj[key] = obj[key];
      }
    }
    const { col_tax, disc_type, ...newRow } = newObj;
    return newRow;
  }

  const [warningModalOpen, setwarningModalOpen] = useState(false);

  const checkMaxTotalValue = async () => {
    try {
      let uri =
        serverAddress + replacePlaceholders2(data.component.totals?.sMaxTotalDataSource, textValue);
      const response = await axios.get(uri, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (
        parseFloat(summ_grandTotal.replace(/,/g, "")) >
        response.data.data.records[0][data.component.totals?.sMaxTotalField]
      ) {
        // alert(`${parseFloat(summ_grandTotal.replace(/,/g, ""))}-- ${response.data.data.records[0][data.component.totals?.sMaxTotalField]} --- ${parseFloat(summ_grandTotal.replace(/,/g, "")) >
        //   response.data.data.records[0][data.component.totals?.sMaxTotalField]}`)
        // alert(JSON.stringify(response.data.data.records[0][data.component.totals?.sMaxTotalField]));
        setcheckMaxTotalValue(true);
        setwarningModalOpen(true);
      } else {
        setwarningModalOpen(false);
        setcheckMaxTotalValue(false);
      }
    } catch (error) {
      // setError(error);
    }
  };

  useEffect(() => {
    if (data?.component?.totals?.checkMaxTotalValue && data?.component?.totals?.checkMaxTotalValue !== "false") {
      checkMaxTotalValue();
    }
  }, [
    textValue[data?.component?.totals?.sMaxTotalDataAware.replace("{", "").replace("}", "")],
    summ_grandTotal
  ]);

  function consolidateSummary(summaryArray) {
    const grouped = {};
    summaryArray.forEach((item) => {
      const { sInputValue, sValue } = item;
        const numericValue = parseFloat(sValue.replace(/,/g, ''));
      if (grouped[sInputValue]) {
        grouped[sInputValue].sValue += numericValue;
      } else {
        grouped[sInputValue] = { ...item, sValue: numericValue };
      }
    });
    return Object.values(grouped).map((item) => ({
      ...item,
      sValue: item.sValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    }));
  }

  function createSummaryArray(arry) {
    if (arry) {
      const summaryArray = arry.map(elm => {
        let result = findObjectByValue(colTaxOption, elm.taxType);

        return {
          sSummaryID: "summ_tax",
          sAccountCode: "",
          sInputValue: result.sTaxCode,
          sValue: `${Number(elm.amountOf?.toString().replaceAll(",", "")).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        };
      });
      return consolidateSummary(summaryArray);
    }
  }
  function transformDataRemoveKeys(data, deleteKeys) {
    return data.map(item => {
      // Merge qtySelect value with col_qty
      if (item.qtySelect) {
        item.dQuantity = `${item.dQuantity}`;
      }
      if (item.sConversion) {
        item[conversionNamesMapping.dQuantity] = `${item.qtySelect}:${item.sConversion}`;
      }
      if(item.sExpectedConversion){
        item[conversionNamesMapping.dExpectedQuantity] = `${item.expectedQtySelect}:${item.sExpectedConversion}`;
      }
      // Remove the keys specified in deleteKeys
      deleteKeys.forEach(key => {
        delete item[key];
      });
      return item;
    });
  }
  useEffect(() => {
    if (!data?.component?.totals?.allowZeroValue) {
      // alert( parseFloat(summ_grandTotal.replace(/,/g, "")))
      setallowZeroValue(parseFloat(summ_grandTotal.replace(/,/g, "")) == 0);
    } else {
      setallowZeroValue(false);
    }

    if (rows?.length && Object.values(rows[0])?.length > 1) {
      const modifiedRows = rows.map(obj => replaceKeys(obj, allfeildsNames));
      let deleteKeys = ["qtySelect", "col_rate_og", "sConversion"];
      tabledata(transformDataRemoveKeys(modifiedRows, deleteKeys));
    }

    if (Object.values(summaryFeilds)?.length >= 2) {
      /* 
     parseFloat(
                              +calculateWithHoldingTax(
                                +convertTwoDigits(subTotal?.toString()?.replace(/,/g, "")),
                                +convertTwoDigits(
                                  summaryFeilds["summ_withholding"]?.toString()?.replace(/,/g, "")
                                ),
                                summaryFeilds.withholding_disc_type
                              )
                            ).toFixed(2)*/
      //                   const newUpdData = summaryFeilds.map((elm)=>{
      // console.log('elmEdit==>',elm);

      //                   })

      tablesummaryfields(summaryFeilds);

      //  alert(JSON.stringify(summaryFeilds))
    }
  }, [rows, allfeildsNames, summaryFeilds, subTotal]);

  /////////////////////////////////////////////////////////
  const [open, setOpen] = React.useState(false);

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");

  function isEmpty(obj) {
    return Object.keys(obj)?.length === 0;
  }

  const validateData = () => {
    // const returnData = rows.map(textValue => {
    //   const errors = globalvalidateTextField(textValue, defaultTableValidation);
    //   setdefaultTableError(errors);
    //   return isEmpty(errors)
    // });
    if (data?.component?.totals?.checkMaxTotalValue && data?.component?.totals?.checkMaxTotalValue !== "false") {
      checkMaxTotalValue();
    }

    const returnData = rows.map(textValue => {
      let errors = globalvalidateTextField(textValue, defaultTableValidation);

      if(!textValue.hasOwnProperty("col_item") || (textValue.hasOwnProperty("col_item") && !textValue.col_item)){
        errors.col_item = defaultTableValidation?.col_item?.sErrorMessage;
        errors.id = textValue.id;
      }

      const index = defaultTableError.findIndex(row => row?.id == textValue?.id);
      // alert(JSON.stringify(errors))
      if (index != -1) {
      setdefaultTableError((prevData) => {
        const newData = JSON.parse(JSON.stringify(prevData));
        newData[index] = { ...errors, id: textValue.id };
        return newData;
      });
      } else {
        setdefaultTableError(preState => {
          const index = preState.findIndex(row => row?.id == textValue?.id);
          if (index == -1) {
            return [...preState, { ...errors, id: textValue.id }];
          } else {
            return preState;
          }
        });
      }
      return isEmpty(errors);
    });
    const summaryReturntData = checkGlobalSummary();

    // alert(`${JSON.stringify(returnData.includes(false) && su mmaryReturntData.includes(false) )} ${JSON.stringify(summaryReturntData.includes(false))}` );

    if (returnData.includes(false)) {
      return true;
    }
    if (summaryReturntData.includes(false)) {
      return true;
    }

    return false;
  };

  const checkGlobalSummary = () => {
    const newValidateFeild = {};

    for (let i = 0; i < summaryValidationFeilds?.length; i++) {
      const elm = summaryValidationFeilds[i];
      const name = elm?.sSummaryID;
      const validateFeild = elm?.validation;
      newValidateFeild[name] = validateFeild;
    }

    const errors = globalvalidateTextField(summaryFeilds, newValidateFeild);

    setSummaryError(errors);
    if (Object.keys(errors)?.length > 0) {
      return [false];
    } else {
      return [true];
    }
  };

  useEffect(() => {
    if (setdefaultTableValidateFunction) {
      setdefaultTableValidateFunction(() => validateData);
    }
    return () => {
      setdefaultTableValidateFunction(false);
    };
  }, [rows, summaryFeilds]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [anchorEl12, setAnchorEl1] = React.useState(null);
  const [anchorEl3, setAnchorEl3] = React.useState(null);

  const handleClick2 = event => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClick3 = event => {
    setAnchorEl3(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl1(null);
  };
  const handleClose3 = () => {
    setAnchorEl3(null);
  };
  const open1 = Boolean(anchorEl12);
  const open3 = Boolean(anchorEl3);
  const id = open1 ? "simple-popover" : undefined;
  const id3 = open3 ? "simple-popover" : undefined;
  //================================================================
  const [actionType, setActionType] = useState("");
  //================================================================
  function filterComponentsRecursive(config) {
    const result = {};

    function processField(field) {
      const component = field?.component || field || {};
      const { sType, sName, sDefaultValue } = component;
      if (
        [
          "TEXTFIELD",
          "AUTOCOMPLETE",
          "CHECKBOX",
          "TRANSFERLIST",
          "RADIOGROUP",
          "SELECT",
          "VARTEXT",
          "NUMBER",
          "VARSELECT",
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
          tabledetails: [filterComponentsRecursive(field.fixcolumns)]
        };

        // Check if component.options.mode is present
        if (component.options) {
          result[sName].child.sInputTableMode = component.options.mode;
        }
      }
      if (field.fixcolumns && Array.isArray(field.fixcolumns)) {
        // Nest child array data under the corresponding sName
        if (field.fixcolumns) {
          // alert(JSON.stringify( field.fixcolumns) )
        }
        result[sName] = result[sName] || {};
        result[sName].fixcolumns = {
          sType: sType,
          sInputTableName: sName,
          tabledetails: [filterComponentsRecursive(field.fixcolumns)]
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

  //================================================================
  const clearColumns = arr => {
    const items = { id: 1, disc_type: "%" };
    data?.fixcolumns?.forEach(
      item => (items[item?.sColumnID] = item?.inputType?.component?.sDefaultValue)
    );
    // initial State for child columns
    data?.child?.forEach(
      item => (items[item.inputtable.sColumnID] = item?.component.sDefaultValue)
    );
    let allfeilds = arr.sMapping.split(", ");

    const newVal = rows.map(item => {
      const newItem = { ...item }; // Create a copy of the item object
      allfeilds.forEach(field => {
        if (newItem.hasOwnProperty(field)) {
          newItem[field] = items[field]; // Clear the value of the field
        }
      });
      return newItem;
    });
    // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 2546", rows);
    setRows(newVal);
    // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 2546", newVal);
    handleClose2();
  };
  //================================================================

  function getInventoryCode(sInventoryCode) {
    const data = allAccountData;
    //  console.log(allAccountData ,sInventoryCode,'stringify56');
    for (let i = 0; i < data?.length; i++) {
      if (data[i].sInventoryCode === sInventoryCode) {
        return data[i].sAccountCode;
      }
    }

    // Return null if the sItemName is not found in the data
    return null;
  }

  function transformData(data, allFields, mappingFields, ind = 2) {
    return data.map((item, index) => {
      let transformedItem = { id: index + 1 };
      // Copy all fields and values from allFields
      Object.entries(allFields).forEach(([key, value]) => {
        transformedItem[key] = value;
      });
      //alert('Loading')
      // Change the values of fields in mappingFields
      mappingFields.forEach((field, ind) => {
        Object.keys(field).forEach((elm, ind) => {
          if (elm == Object.keys(field)[ind]) {
            if (Object.values(field)[ind] == "col_item") {
              transformedItem[Object.values(field)[ind]] = item[elm] ? item[elm].toString() : "";
              transformedItem["col_account"] = getInventoryCode(item[elm]);
            } else if (Object.values(field)[ind] != "col_account") {
              transformedItem[Object.values(field)[ind]] = item[elm] ? item[elm].toString() : "";
            }
          }
        });
      });
      return transformedItem;
    });
  }

  console.log("jkhafbweqhjkbfwfew", rows, quantityTypeMapping);

  async function hanldeGetDataFromElipsis(uri, type, sMapping) {
    try {
      setLoading(true);
      const response = await axios.get(serverAddress + uri, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const items = { disc_type: "%" };
      data?.fixcolumns?.forEach(
        item => (items[item?.sColumnID] = item?.inputType?.component?.sDefaultValue)
      );
      // initial State for child columns

      data?.child?.forEach(
        item => (items[item.inputtable.sColumnID] = item?.component.sDefaultValue)
      );
      const matchedFields = items;

      const mappingFields = [sMapping];

      let transformedData = transformData(
        response?.data?.data?.records,
        matchedFields,
        mappingFields
      );


      if (transformedData?.length > 0) {
        // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 2621", rows);
        setRows(transformedData);
        // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 2621", transformedData);
      } else {
        const items = { id: 1, disc_type: "%" };
        data?.fixcolumns?.forEach(
          item => (items[item?.sColumnID] = item?.inputType?.component?.sDefaultValue | "")
        );
        data?.child?.forEach(
          item => (items[item.inputtable.sColumnID] = item?.component?.sDefaultValue | "")
        );

        const { id, ...obj } = items;
        const newRow = {
          id: 1,
          ...obj
        };
        if (!data?.data?.bCascade || !data?.data?.sDataAware) {
          // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 2638", rows);
          setRows([newRow]);
          // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 2638", [newRow]);
        }
      }
      if (transformedData.length === 0 && (data?.data?.bCascade || data?.data?.sDataAware)) {
        // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 3411", rows);
        setRows([]);
        // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 3411", []);
      }
      handleClose();
      setLoading(false);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }
  //////////================================================================
  const handleBulkLoad = type => {
    const maxId = Math.max(...rows.map(row => row.id)) + 1;
    const items = { disc_type: "%" };
    data?.fixcolumns?.forEach(
      item => (items[item?.sColumnID] = item?.inputType?.component?.sDefaultValue)
    );
    // initial State for child columns
    data?.child?.forEach(
      item => (items[item.inputtable.sColumnID] = item?.component.sDefaultValue)
    );
    const matchedFields = items;
    const mappingFields = [data?.component?.[type]?.sMapping];
    // mappingFields[0]["dPurchasePrice"] = "col_rate";
    let transformedData = transformData(BulkLoadData, matchedFields, mappingFields);
    setEditDataQtyType([]);
    const qtyMappingItems = [];
    BulkLoadData?.forEach((row, index) => {
      const defaultPricing = row[(data?.pricingOptions?.sPriceOption1?.sPriceField).toString().replace("{", "").replace("}", "")] || "0.00";
      const supplierPricing = row[(data?.pricingOptions?.sPriceOption2?.sPriceField).toString().replace("{", "").replace("}", "")] || "0.00";
      if(resetTable){
        const resetMaxId = Math.max(...rows.map(row => row.id));
        qtyMappingItems.push({id: resetMaxId + index, sInventoryCode: row["sInventoryCode"], initialState: false, sPriceOption1: defaultPricing, sPriceOption2: supplierPricing, sAccountTo: defaultTableSelectedSupplier })
      } else if(quantityTypeMapping && quantityTypeMapping.length == 0){
        qtyMappingItems.push({id: index + 1, sInventoryCode: row["sInventoryCode"], initialState: false, sPriceOption1: defaultPricing, sPriceOption2: supplierPricing, sAccountTo: defaultTableSelectedSupplier })
      } else {
        qtyMappingItems.push({id: maxId + index, sInventoryCode: row["sInventoryCode"], initialState: false, sPriceOption1: defaultPricing, sPriceOption2: supplierPricing, sAccountTo: defaultTableSelectedSupplier })
      }
    })
    setBulkDataLoaded(true);
    const updatedQtyTypeMapping = [...quantityTypeMapping, ...qtyMappingItems];
    setQuantityTypeMapping(updatedQtyTypeMapping);
    data?.fixcolumns?.forEach((item) => {
      if(item?.inputType?.component?.sType === "NUMBER"){
        transformedData?.forEach((field) => {
          if(item?.sColumnID === "col_rate" && priceSelect == "Manual"){
            field[item?.sColumnID] = Number(0).toFixed(2);
            // console.log("bwaejkbfjwkbkjwjefb", Number(0).toFixed(2));
          } else {
            field[item?.sColumnID] = Number(field[item?.sColumnID]).toFixed(2);
            // console.log("bwaejkbfjwkbkjwjefb", Number(field[item?.sColumnID]).toFixed(2), item?.sColumnID);
          }
        })
      }
    })
    // alert(JSON.stringify(mappingFields))
    // setFreeformdata(pre => [...pre, ...transformedData]);
    // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 2671", rows);
    let updatedRowData = [];
    if(resetTable){
      const resetMaxId = Math.max(...rows.map(row => row.id));
      transformedData.forEach((row, index) => row.id = resetMaxId + index);
      updatedRowData = [...transformedData];
    } else if(rows.length == 1 && rows[0]["col_item"] == ""){
      updatedRowData = [...transformedData];
    } else {
      transformedData.forEach((row, index) => row.id = maxId + index);
      updatedRowData = [...rows, ...transformedData]
    }
    setRows(updatedRowData);
    // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 2671", transformedData);
    setResetTable(false);
    handleClose();
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
  function replacePlaceholders2(uri, data) {
    const regex = /{([^}]+)}/g;
    const replacedUri = uri?.replace(regex, (match, key) => {
      return key in data ? data[key] : match;
    });
    return replacedUri;
  }
  useEffect(() => {
    const fetchDataIfNeeded = async () => {
      if (data?.component?.defaultLoad?.bEnabled === true) {
        await hanldeGetDataFromElipsis(
          data?.component?.defaultLoad?.sDataSource,
          "useEffect",
          data?.component?.defaultLoad?.sMapping
        );
      }

      if (data?.data?.bCascade) {
        // alert(JSON.stringify(data.data?.sMapping))
        hanldeGetDataFromElipsis(
          replacePlaceholders2(data?.data?.sDataSource, textValue),
          "useEffect",
          data.data?.sMapping
        );
      }
    };

    fetchDataIfNeeded();
  }, [data, textValue[data?.data?.sDataAware?.replace("{", "")?.replace("}", "")], allAccountData]);

  //============================================================================
  const [selectedLoadfromFile, setSelectedLoadfromFile] = useState();
  const [csvBackup, setCSVBackup] = useState();
  const [fileInputKey] = useState(Date.now());

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
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });
      const maxId = Math.max(...rows.map(row => row.id)) + 1;
      const csvResult = removeBlankObjects(result);
      if(resetTable){
        const resetMaxId = Math.max(...rows.map(row => row.id));
        for(let index = 0; index < csvResult.length; index++){
          csvResult[index]["matchId"] = resetMaxId + index
        }
      } else if(rows.length == 1 && rows[0]["col_item"] == ""){
        for(let index = 0; index < csvResult.length; index++){
          csvResult[index]["matchId"] = index + 1;
        }
      } else {
        for(let index = 0; index < csvResult.length; index++){
          csvResult[index]["matchId"] = maxId + index
        }
      }

      setCsvFile(csvResult);
      setCSVBackup(csvResult);
    };

    reader.onerror = error => {
      console.error(error);
    };

    reader.readAsArrayBuffer(file);
  };
  csvFile?.forEach((item, ind) => (item.id = ind + 1));

  function csvRowCalculation(conversionRate, id) {
    const updatedRows = [...rows];
    const rowId = updatedRows.findIndex((item) => item.id == id);
    if(rowId !== -1){
      const qtyTypeMappingIndex = quantityTypeMapping.findIndex((qtyMapp) => qtyMapp.id == id);
      if(qtyTypeMappingIndex !== -1){
        updatedRows[rowId]["col_rate"] = conversionRate * quantityTypeMapping[qtyTypeMappingIndex][priceSelect];
        updatedRows[rowId]["col_amount"] = updatedRows[rowId]["col_rate"] * updatedRows[rowId]["col_qty"];
      }
      setRows(updatedRows);
    }
  }

  useEffect(() => {
    if(csvFile && csvFile.length > 0 && (priceSelect == "sPriceOption1" || priceSelect == "sPriceOption2")){
      const updatedRows = [...rows];
      updatedRows.forEach((row) => {
        const qtyTypeMappingIndex = quantityTypeMapping.findIndex((qtyMapp) => qtyMapp.id == row.id);
        if(qtyTypeMappingIndex !== -1){
          row["col_rate"] = quantityTypeMapping[qtyTypeMappingIndex][priceSelect];
          row["col_amount"] = row["col_rate"] * row["col_qty"];
        }
      });
      setRows(updatedRows);
    }
  }, [priceSelect])


  // useEffect(() => {
  //   if (csvRows.length === 0) return;
  //   const addRowsInBatches = () => {
  //     let index = 0;
  //     const interval = setInterval(() => {
  //       const batch = csvRows.slice(index, index + csvBatchSize);
  //       setOptimizedCSVRows((prevRows) => [...prevRows, ...batch]);
  //       index += csvBatchSize;
  //       if (index >= csvRows.length) {
  //         clearInterval(interval);
  //       }
  //     }, 2000);
  //   };
  //   addRowsInBatches();
  // }, [csvRows]);
  // useEffect(() => {
  //     if (csvRows.length === 0) return;
  //     let index = 0;
  //     setCSVBatchLoading(true);
  //     const processBatch = () => {
  //       if (index >= csvRows.length) {
  //         setCSVBatchLoading(false);
  //         return;
  //       }
  //       requestAnimationFrame(() => {
  //         const batch = csvRows.slice(index, index + csvBatchSize);
  //         setOptimizedCSVRows((prevRows) => [...prevRows, ...batch]);
  //         index += csvBatchSize;
  //       });
  //       requestIdleCallback(processBatch);
  //     };
  //     requestIdleCallback(processBatch);
  //     return () => setCSVBatchLoading(false);
  //   }, [csvRows]);
  
  async function maptoRow() {
    const items = { disc_type: "%" };
    data?.fixcolumns?.forEach(item => (items[item?.sColumnID] = item?.inputType?.component?.sDefaultValue));
    data?.child?.forEach(item => (items[item.inputtable.sColumnID] = item?.component?.sDefaultValue));
    const matchedFields = items;
    const maxId = 1;

    if(rows.length == 1 && rows[0]["col_item"] == ""){
      setRows([]);
    }
    let { transformedData, listOfCSVCodes } = await transformData(csvFile, matchedFields, [selectedLoadfromFile]);
    setCSVFileLoader(false);
    const sortedListOfCSVCodes = listOfCSVCodes.sort((a, b) => a.id - b.id);
    
    transformedData.forEach(async (item) => {
      const qtyCodeIndex = sortedListOfCSVCodes.findIndex((code) => code.id == item.id);
      if (qtyCodeIndex != -1) {
        const qtyCodes = sortedListOfCSVCodes[qtyCodeIndex]?.qtyCodes;
        const filteredQtyCode = qtyCodes?.filter((code) => code.sUnitAbbrev == item["qtySelect"])?.[0];
        if (filteredQtyCode) {
          item["qtySelect"] = filteredQtyCode?.sRelativeUnitCode;
          item["sConversion"] = filteredQtyCode?.sConversion;
        }
      }
    })
    let updatedRowData = [];
    transformedData.forEach((row, index) => row.id = maxId + index);
    sortedListOfCSVCodes.forEach((row, index) => row.id = maxId + index);
    updatedRowData = [...transformedData]
    
    const qtyMappingItems = [];
    updatedRowData.forEach((row, index) => {
      const autoValueGlobalData = globalDefaultAutoValueData.filter((item) => item.sInventoryCode == row.col_item)[0];
      const priceKeyDefault = (data?.pricingOptions?.sPriceOption1?.sPriceField)?.toString()?.replace("{", "")?.replace("}", "");
      const priceKeySupplier = (data?.pricingOptions?.sPriceOption2?.sPriceField)?.toString()?.replace("{", "")?.replace("}", "");
      const defaultPricing = priceKeyDefault ? autoValueGlobalData?.[priceKeyDefault] || "0.00" : "0.00";
      const supplierPricing = priceKeySupplier ? autoValueGlobalData?.[priceKeySupplier] || "0.00" : "0.00";
      if(priceSelect == "sPriceOption1"){
        updatedRowData[index].col_rate = defaultPricing * Number(updatedRowData[index].sConversion);
        updatedRowData[index].col_amount = defaultPricing * Number(updatedRowData[index].sConversion) * updatedRowData[index].col_qty;
      }
      qtyMappingItems.push({ id: maxId + index, sInventoryCode: row["col_item"], initialState: false, sPriceOption1: defaultPricing, sPriceOption2: supplierPricing, sAccountTo: defaultTableSelectedSupplier })
    })
    setQuantityTypeMapping(qtyMappingItems);
    setLoadQtyCodesCSVData(sortedListOfCSVCodes);
    setRows(updatedRowData)
    // alert('dd')
    handleClose();
    
    function getInventoryCode(value) {
      const item = globalDefaultAutoValueData.filter((row) => row.sItemName === value);
      if (item && item.length > 0) return item;
      return globalDefaultAutoValueData.filter((row) => row.sItemSKU === value);
    }
    
    async function fetchUnitConversion(inventory_code) {
      const qtyIndex = data?.fixcolumns?.findIndex((item) => item.sColumnID === "col_qty");
      const qtyDataSource = data?.fixcolumns?.[qtyIndex].inputType?.data?.sDataSource;
      const response = await axios.get(serverAddress + qtyDataSource?.replaceAll("sInventoryCode", inventory_code).replaceAll("{", "").replaceAll("}", ""), {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      });
      return response?.data?.data?.records;
    }

    async function transformData(inputData, allFields, mappingFields, ind = 2) {
      const listOfCSVCodes = [];
      
      const transformedData = await Promise.all(
        inputData.map(async (item, index) => {
          let transformedItem = { id: index + 1 };
          
          Object.entries(allFields).forEach(([key, value]) => {
            transformedItem[key] = value;
          });

          mappingFields.forEach((field, ind) => {
            Object.keys(field).forEach((elm, ind) => {
              if (elm == Object.keys(field)[ind]) {
                // transformedItem[Object.values(field)[ind]] = item[elm] ?item[elm].toString():"" ;
                transformedItem[elm] = item[Object.values(field)[ind]];
              }
            });
          });
          
          const colItemCode = getInventoryCode(item[mappingFields[0].col_item])?.[0]?.sInventoryCode;
          
          transformedItem.col_item = colItemCode;
          if (!colItemCode) {
            transformedItem.col_rate = "0.00";
          }
          const qtyCodes = await fetchUnitConversion(colItemCode);
          listOfCSVCodes.push({ id: index + 1, qtyCodes: qtyCodes });
          transformedItem.col_amount = transformedItem.col_rate * transformedItem.col_qty;
          return transformedItem;
        })
      );
      return { transformedData, listOfCSVCodes };
    }
  }
  
  function generateDynamicAPI(template, obj) {
    let apiEndpoint = template;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const regex = new RegExp(`{${key}}`, "g");
        apiEndpoint = apiEndpoint?.replace(regex, obj[key]);
      }
    }
    return apiEndpoint;
  }
  
  const fetchPrice = () => {
    // alert(generateDynamicAPI(priceSelect, textValue))
    // if (price) {
      if (priceSelect == "sPriceOption1") {
        setPriceSelectFetchApi(
          generateDynamicAPI(data?.pricingOptions?.sPriceOption1?.sDataSource, textValue)
        );
      } else if (priceSelect == "sPriceOption2") {
        // alert( generateDynamicAPI(data?.pricingOptions?.sPriceOption2?.sDataSource, textValue))
        
        setPriceSelectFetchApi(
          generateDynamicAPI(data?.pricingOptions?.sPriceOption2?.sDataSource, textValue)
        );
      } else if (priceSelect == "sPriceOption3") {
        setPriceSelectFetchApi(
          generateDynamicAPI(data?.pricingOptions?.sPriceOption3?.sDataSource, textValue)
        );
      } else {
        setPriceSelectFetchApi("");
      }
    };
    
    useEffect(() => {
      fetchPrice();
    }, [priceSelect, textValue]);
    
  const handleSummaryAdjustment = itemData => {
    setSummaryForBackend(prevState =>
      prevState.map(item =>
        item.sSummaryID === itemData?.target?.name
        ? { ...item, ["sAccountCode"]: itemData?.target?.value }
        : item.sSummaryID === itemData?.target?.name
        ? { ...item, ["sAccountCode"]: itemData?.target?.value }
          : item
      )
    );
  };
  // function filterData(data, data3) {

  //  const data2 = JSON.parse(JSON.stringify(data3))
  //   //
  //   return data2.filter(item => {

  //     if (item.sSummaryID == "summ_subtotal") {
  //       return item;
  //     }
  //     if (item.sSummaryID == "summ_withholding") {
  //       let val ={sSummaryID:"summ_withholding",  sAccountCode:'',sInputValue:`${item.sAccountCode}:${item.sInputValue}${summaryFeilds.withholding_disc_type}`,sValue:subTotal}

  //       return val;
  //     }
  //      if (item.sSummaryID == "summ_grandtotal") {
  //       // console.log('item44',item);

  //       item.sValue = convertTwoDigits(
  //         +convertTwoDigits(summ_grandTotal?.toString()?.replace(/,/g, "")) +
  //           +convertTwoDigits(
  //             allTypesTaxesArry.reduce((acc, item) => acc + item.taxAmount, 0)
  //           ) -
  //           +calculateWithHoldingTax(
  //             +convertTwoDigits(subTotal?.toString()?.replace(/,/g, "")),
  //             +convertTwoDigits(
  //               summaryFeilds["summ_withholding"]?.toString()?.replace(/,/g, "")
  //             ),
  //             summaryFeilds.withholding_disc_type
  //           )
  //       )
  //       // item.sValue = convertTwoDigits(
  //       //   +convertTwoDigits(summ_grandTotal?.toString()?.replace(/,/g, "")) +
  //       //     +convertTwoDigits(
  //       //       allTypesTaxesArry.reduce((acc, item) => acc + item.taxAmount, 0)
  //       //     ) -
  //       //     +calculateWithHoldingTax(
  //       //       +convertTwoDigits(subTotal?.toString()?.replace(/,/g, "")),
  //       //       +convertTwoDigits(
  //       //         summaryFeilds["summ_withholding"]?.toString()?.replace(/,/g, "")
  //       //       ),
  //       //       summaryFeilds.withholding_disc_type
  //       //     )
  //       // )
  //       return item ;
  //     }
  //     if (data[item.sSummaryID] === 1) {
  //       return item;
  //     }
  //   });
  // }
  function filterData(data, data3) {
    const data2 = JSON.parse(JSON.stringify(data3));

    const filteredData = data2.map(item => {
      if (item.sSummaryID == "summ_subtotal") {
        return item; // Keep the item as is
      }
      if (item.sSummaryID == "summ_withholding") {
        let val = {
          sSummaryID: "summ_withholding",
          sAccountCode: item.sAccountCode,
          sInputValue: item.sInputValue,
          sValue: Number(
            +calculateWithHoldingTax(
              +convertTwoDigits(subTotal?.toString()?.replace(/,/g, "")),
              +convertTwoDigits(
                summaryFeilds["summ_withholding"]?.toString()?.replace(/,/g, "")
              ),
              summaryFeilds.withholding_disc_type
            )
          ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        };
        const addedChars = `${summaryFeilds.withholding_disc_type}`;
        if(!val.sInputValue.toString().includes(addedChars)){
          if(val.sInputValue){
            val.sInputValue = val.sInputValue + addedChars;
          } else {
            val.sInputValue = `0.00` + addedChars;
          }
        }
        if(!val.sInputValue.toString().includes(`${item.sAccountCode}:`)){
          val.sInputValue = `${item.sAccountCode}:${val.sInputValue}`;
        }
        return val; // Return the new val object
      }
      if (item.sSummaryID == "summ_grandtotal") {
        // item.sValue = (Number((summ_grandTotal).replaceAll(",", "")) + (allTypesTaxesArry.reduce(
        //       (acc, item) => acc + item.taxAmount,
        //       0
        //     )) - Number(calculateWithHoldingTax(
        //       Number(subTotal?.toString()?.replace(",", "")),
        //       summaryFeilds["summ_withholding"]?.toString()?.replaceAll(",", ""),
        //       summaryFeilds.withholding_disc_type
        //     ))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const sumgrandTotalValue = Number(summ_grandTotal?.toString().replaceAll(",", "")).toFixed(2);
          const allTypesTaxesArryValue = Number(allTypesTaxesArry.reduce((acc, item) => acc + item.taxAmount,0)?.toString().replaceAll(",", "")).toFixed(2);
          const calculateWithHoldingTaxValue = Number(
            +calculateWithHoldingTax(
              +convertTwoDigits(subTotal?.toString()?.replace(/,/g, "")),
              +convertTwoDigits(
                summaryFeilds["summ_withholding"]?.toString()?.replace(/,/g, "")
              ),
              summaryFeilds.withholding_disc_type
            ));
          item.sValue = ((Number(sumgrandTotalValue) + Number(allTypesTaxesArryValue)) - Number(calculateWithHoldingTaxValue)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            // convertTwoDigits(
            //   +convertTwoDigits(summ_grandTotal?.toString()?.replace(/,/g, "")) +
            //     +convertTwoDigits(allTypesTaxesArry.reduce((acc, item) => acc + item.taxAmount, 0)) -
            //     +calculateWithHoldingTax(
            //       +convertTwoDigits(subTotal?.toString()?.replace(/,/g, "")),
            //       +convertTwoDigits(summaryFeilds["summ_withholding"]?.toString()?.replace(/,/g, "")),
            //       summaryFeilds.withholding_disc_type
            //     )
        return item; // Return the modified item
      }
      if (data[item.sSummaryID] === 1) {
        return item; // Keep the item as is
      }

      return null; // Return null for items that don't match the conditions
    });

    // Filter out null values from the array
    return filteredData.filter(item => item !== null);
  }

  function finalSummaryFilter(payload_data, data) {
    const updatedData = data.filter(item => {
      if (item["sSummaryID"] == "summ_subtotal") {
        return true;
      }
      if (item["sSummaryID"] == "summ_grandtotal") {
        return true;
      }
      if (payload_data[item["sSummaryID"]] === 1) {
        return true;
      } else {
        return false;
      }
    });
    return updatedData;
  }

  function updateExistingData(existingData, updatedData) {
    const updatedTaxData = updatedData.filter(item => item.sSummaryID === 'summ_tax');
    const updatedExistingData = existingData.map(existingItem => {
        if (existingItem.sSummaryID === 'summ_tax') {
            const matchingUpdate = updatedTaxData.find(
                updatedItem => updatedItem.sInputValue === existingItem.sInputValue
            );
            if (matchingUpdate) {
                return { ...existingItem, ...matchingUpdate };
            }
        }
        return existingItem;
    });
    updatedTaxData.forEach(updatedItem => {
      const existsInExisting = existingData.some(
          existingItem =>
              existingItem.sSummaryID === 'summ_tax' &&
              existingItem.sInputValue === updatedItem.sInputValue
      );

      if (!existsInExisting) {
          updatedExistingData.push(updatedItem);
      }
    });
    return updatedExistingData;
}

  useEffect(
    () => {
      let newData = JSON.parse(JSON.stringify(summaryForBackend));
      const filteredData = filterData(summaryFeildsBPayLoad, newData);
      const combineData = updateExistingData(filteredData, createSummaryArray(allTypesTaxesArry))
      const summaryFilterData = combineData.filter(item => {
        if (item.sSummaryID == "summ_tax") {
          if (item.sInputValue == "") {
            // alert(JSON.stringify(item))
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      });
      const finalFilter = finalSummaryFilter(summaryFeildsBPayLoad, summaryFilterData);
      setDefaultTableSummaryData(finalFilter);
      // const newUpdData = checkDataBeforeSending(summaryFeildsBPayLoad, [
      //   ...summaryFilterData,
      //   ...createSummaryArray(allTypesTaxesArry)
      // ]);
      // if(formAction === "EDIT"){
      //   setDefaultTableSummaryData(newUpdData);
      // } else {
        // const updfilteredData = filterData(summaryFeildsBPayLoad, newUpdData);
        
      // }
    },
    [summaryForBackend, summaryFeildsBPayLoad, allTypesTaxesArry, summaryFeilds, rows]
    //
  );

  async function setTotalLimitBYApi(api) {
    const uri = generateDynamicAPI(api, textValue);
    if(!uri?.includes('{') && !uri?.includes('}')){
      try {
        const response = await axios.get(serverAddress + uri, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTotalLimit(
          response.data.data.records[0][
            data?.pricingOptions?.sPriceOption1?.sMaxTotalField.replace(/[{}]/g, "")
          ]
        );
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    if (priceSelect) {
      if (priceSelect == "Manual Pricing") {
        if (data?.pricingOptions?.menu?.sDefaultMaxTotal != "0") {
          setTotalLimit(data?.pricingOptions?.menu?.sDefaultMaxTotal);
        }
      } else {
        if (data?.pricingOptions?.menu?.sDefaultMaxTotal != "0") {
          setTotalLimitBYApi(data?.pricingOptions?.sPriceOption1?.sDataSource);
        }
      }
    }
  }, [priceSelect, data]);

  // useEffect(() => {
  //   if (alloceteValue !='Manual') {
  //   let val = freeFromTotals / rows.length;
  //   setRows(data => {
  //     let newData = [];
  //     for (let i = 0; i < data.length; i++) {
  //       const element = data[i];
  //       element["col_other"] = val;
  //       // alert( element['col_amount'].replace(/[, ]+/g, "").trim())
  //       // element["col_otheramount"] = +element["col_amount"].replace(/[, ]+/g, "").trim() + val;
  //     }
  //     return data;
  //   });
  // }
  // }, [freeFromTotals, rows]);
  useEffect(() => {
    let val = freeFromTotals / rows.length;
    // alert(freeFromTotals)
    if (data?.otherCost?.bEnabled) {
      // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 3011", rows);
      setRows(data => {
        const parseQty = qty => parseInt(qty + ""?.replace(/,/g, ""), 10);

        for (let i = 0; i < data.length; i++) {
          const element = data[i];

          if (alloceteValue == "Percentage") {
            element["col_other"] = parseQty(val);

            element["col_otheramount"] = parseFloat(
              +parseFloat(parseQty(val) || 0)?.toFixed(2) +
                +element["col_amount"].toString().replace(/,/g, "")
            )?.toFixed(2);
            // alert(typeof +element["col_amount"]?.toString()?.replace(/,/g, "") )
            // parseQty(val) + +parseQty(element["col_amount"].toString().replace(/,/g, "") || 0);
          }
          if (alloceteValue == "Quantity") {
            let totalQty = rows?.reduce((sum, item) => sum + parseQty(item.col_qty), 0);

            let Percentage = parseQty(element["col_qty"] || 0) / totalQty;

            let Col_other = +freeFromTotals * Percentage;

            let Col_otherAmount = +parseQty(element["col_amount"] || 0) + +Col_other.toFixed(2);
            element["col_other"] = Col_other.toFixed(2);
            element["col_otheramount"] = Col_otherAmount.toFixed(2);
          }
          if (alloceteValue == "Value") {
            let totalAmount = rows?.reduce((sum, item) => sum + parseQty(item.col_amount), 0);
            let Percentage = parseQty(element["col_amount"] || 0) / totalAmount;
            let Col_other = +freeFromTotals * Percentage;
            let Col_otherAmount = parseQty(element["col_amount"] || 0) + Col_other;
            element["col_other"] = Col_other.toFixed(2);
            element["col_otheramount"] = Col_otherAmount.toFixed(2);
          }
          if (alloceteValue == "Manual") {
            element["col_other"] = element.col_other || "0.00";
            element["col_otheramount"] =
              parseQty(element.col_other) + parseQty(element["col_amount"]);
          }
        }

        const sumOfColAmount = data.reduce(
          (sum, item) => sum + parseFloat(item.col_otheramount?.toString().replace(/,/g, "")),
          0
        );
        setsubTotal(handlePointChange(parseFloat(sumOfColAmount)?.toFixed(2), 2));
        setsummaryFeilds(preState => ({
          ...preState,
          ["summ_subtotal"]: sumOfColAmount.toLocaleString()
        }));

        // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 3011", data);
        return data;
      });
    } else {
      const sumOfColAmount = rows.reduce(
        (sum, item) => sum + parseFloat(item.col_amount?.toString().replace(/,/g, "")),
        0
      );
      setsubTotal(handlePointChange(parseFloat(sumOfColAmount)?.toFixed(2), 2));
      setsummaryFeilds(preState => ({
        ...preState,
        ["summ_subtotal"]: sumOfColAmount.toLocaleString()
      }));
    }

    //    rows.reduce((sum, item) =>  alert(JSON.stringify(item.col_otheramount)),
    //   0
    // );
    // (sum, item) => sum +   parseFloat( item.col_otheramount?.toString().replace(/,/g, "")),
  }, [freeFromTotals, alloceteValue, rows]);

  function replaceKeys4(first, second) {
    let newObject = {};
    for (let key in first) {
      if (second.hasOwnProperty(key)) {
        newObject[second[key]] = first[key];
        // alert(JSON.stringify(newObject))
      } else {
        newObject[key] = first[key];
      }
    }
    return newObject;
  }

  function checkQtySelectType(value) {
    if (value.includes("piece")) {
      return "piece";
    }
    if (value.includes("box")) {
      return "box";
    }
    if (value.includes("crate")) {
      return "crate";
    } else {
      return value;
    }
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
            // alert(third[index][thirdKey])
            // Replace the value in the forth object with the value from the third object
            newItem[key] =
              typeof third[index][thirdKey] == "string"
                ? checkQtySelectType(third[index][thirdKey])
                : third[index][thirdKey];
          }
        }

        return newItem;
      });

      return newArray;
    }
  }

  function replaceKeysWithValue(data1, data2) {
    // Iterate over each object in data2
    data2?.forEach(item => {
      // Check if each key in data1 exists in the item
      for (const key in data1) {
        if (data1.hasOwnProperty(key) && item.hasOwnProperty(data1[key])) {
          // Replace key in item with the value from data1
          item[key] = item[data1[key]];
          // Remove the old key-value pair
          delete item[data1[key]];
        }
      }
    });
    return data2;
  }

  useEffect(() => {
    setDefaultTableCSVFile(csvFile);
  }, [csvFile])

  useEffect(() => {
    // let result = replaceKeys4(documentSelectmappingData, allFeildForDoucmentSelect);
    // documentSelectTableData,
    // documentSelectmappingData
    // let tableData = documentSelectTableData.filter(record => record.sInputTableName == data?.component?.sName )
    let tableData = documentSelectmappingData[0]?.tabledetails;
    if (documentSelectTableData.length > 0) {
      // setRows(
      //   replaceKeysWithValue (allFeildForDoucmentSelect,replaceValuesInArray(
      //     replaceKeys4(documentSelectmappingData, allFeildForDoucmentSelect),
      //     documentSelectTableData[0]?.tabledetails,
      //     []
      //   ))
      // );

      const usingTable = documentSelectTableData.filter(
        item => item?.mappingTableName == data.component.sName
      );

      const mappingData = {
        ...documentSelectmappingData, qtySelect: "sUnitConversion"
      }

      if(allFeildForDoucmentSelect.hasOwnProperty("col_purchaseaccount")){
        mappingData["col_purchaseaccount"] = allFeildForDoucmentSelect["col_purchaseaccount"];
      }

      const newRow = replaceKeysWithValue(
        allFeildForDoucmentSelect,
        replaceValuesInArray(
          replaceKeys4(
            mappingData,
            allFeildForDoucmentSelect
          ),
          usingTable[0]?.tabledetails,
          []
        )
      );
      if (newRow) {
        // newRow.map((obj, ind) => {
        //   // const val = replaceKeysEditData(obj);

        //   const { id, ...all } = obj;

        //   let allFieldsKeys = Object.keys(allfeildsNames);
        //   let allFieldsValues = Object.values(allfeildsNames);
        //   const row = { id };

        //   const datareduce = allFieldsKeys.reduce(
        //     (acc, item, i, array) => {
        //       // alert( obj['dDiscount'] )
        //       return {
        //         ...acc,
        //         ["disc_type"]: obj['dDiscount']?.endsWith("%") ? "%" : "Fix",
        //         [allFieldsKeys[i]]: obj[allFieldsValues[i]]?.toString()?.endsWith("%")
        //           ? obj[allFieldsValues[i]]?.toString()?.replace("%", "")
        //           : obj[allFieldsValues[i]] + "",
        //       };
        //     },
        //     { id: id }
        //   );

        //   return datareduce;
        // });
        // setRows([])

        const dr = newRow.map(elm => ({
          ...elm,
          disc_type: elm.col_disc?.endsWith("%") ? "%" : "Fix",
          col_disc: elm.col_disc?.toString()?.replace("%", "")
        }));
        // alert(JSON.stringify(newr));

        const newData = [];
        for (let i = 0; i < dr?.length; i++) {
          dr[i].id = i + 1;
          const row = dr[i];
          const qty = +row.col_qty?.toString().replace(/,/g, "") || 0; // parseFloat(row.col_qty || 1);
          const rate = +row.col_rate?.toString().replace(/,/g, "") || 0;
          // console.log("bwaejkbfjwkbkjwjefb", rate);
          const disc = +row.col_disc?.toString().replace(/,/g, "") || 0; // parseFloat(row.col_disc || 0);
          let tax;
          if (typeof row?.col_tax == "string") {
            tax = getVATPercentage(
              getPercent(
                row.sTaxCode
                  ? row.sTaxCode
                  : row.col_tax
                  ? row.col_tax
                  : colTaxOption.length == 1
                  ? colTaxOption[0]?.sTaxCode
                  : row.col_tax
              )[0]
            );
          } else {
            tax = getVATPercentage(
              getPercent(
                row.sTaxCode
                  ? row.sTaxCode
                  : row.col_tax
                  ? row.col_tax
                  : colTaxOption.length == 1
                  ? colTaxOption[0]?.sTaxCode
                  : row.col_tax
              )[0]
            );
          }
          let disctype = row?.disc_type || "%";
          const discDecimal = disc / 100;
          const taxDecimal = tax / 100 || 0;
          let amount = 0;

          if (disctype === "%") {
            amount = qty * rate * (1 - discDecimal) * (1 + taxDecimal);
          }
          if (disctype === "Fix") {
            amount = (qty * rate - disc) * (1 + taxDecimal);
          }
          let numAsNumber = +amount?.toString().replace(/,/g, "");
          let result = numAsNumber.toLocaleString();
          // result = parseFloat(result).toFixed(2);
          // list[index]["col_tax"] =

          // alert(JSON.stringify(row.sTaxCode));
          const updatedRow = {
            ...row,
            // col_tax:
            //   getVATPercentage(
            //     getPercent(
            //       row.sTaxCode
            //         ? row.sTaxCode
            //         : colTaxOption.length == 1
            //         ? colTaxOption[0]?.sTaxCode
            //         : row.col_tax
            //     )[0]
            //   ) || "",
            col_tax: row.sTaxCode,
            col_amount: handlePointChange(parseFloat(numAsNumber).toFixed(2), 2)
          };
          console.log("jlehfkjqwghjgfwehjewf", "COL_AMT 3638", handlePointChange(parseFloat(numAsNumber).toFixed(2), 2));

          let taxAmount = 0;
          if (selectedTax == "Exclusive") {
            //col_amount (dAmount) x  (selected tax.sComputeField (dPercentage) / 100)
            taxAmount = parseFloat((amount * (tax / 100)).toFixed(2));
            // parseFloat(taxAmount).toFixed(2)
          } else {
            // Tax= col_amount (dAmount) / ( ((100 + selected tax.sComputeField (dPercentage)) / 100) * (selected tax.sComputeField (dPercentage) / 100)
            taxAmount = parseFloat(((amount / ((100 + tax) / 100)) * (tax / 100)).toFixed(2));
            // taxAmount = parseFloat(taxAmount).toFixed(2)
          }

          updateTaxData({
            id: row.id,
            taxCode: row.sTaxCode,
            taxAmount: Number(taxAmount.toFixed(2)),
            // amountOf: selectedTax == "Exclusive" ? amount : handlePointChange(parseFloat( selectedTax == "Exclusive" ? amount : (parseFloat(amount) - taxAmount)).toFixed(2), 2)  ,
            amountOf: Number(
              selectedTax == "Exclusive"
                ? amount?.toString().replaceAll(",", "")
                : (amount - taxAmount)?.toString().replaceAll(",", "")
              ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      
            taxType: findObjectByValue(colTaxOption || [], row.sTaxCode).sTaxName || row.sTaxName
          });
          newData.push(updatedRow);
        }
        // alert(JSON.stringify(newData));
        // alert(JSON.stringify(newData));
        // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 3290", rows);
        setRows(newData);
        // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 3290", newData);
      }
    }
  }, [documentSelectTableData, documentSelectmappingData]);
  function replacePlaceholders(uri, data) {
    // Regular expression to match placeholders like {placeholderName}
    if (uri) {
      const placeholderRegex = /{([^}]+)}/g;

      // Replace placeholders in the uri with values from data
      const replacedUri = uri?.replace(placeholderRegex, (match, placeholder) => {
        // Check if the placeholder exists in the data object
        if (data.hasOwnProperty(placeholder)) {
          // Replace placeholder with corresponding value from data
          return data[placeholder];
        } else {
          // If placeholder doesn't exist in data, return the original placeholder
          return match;
        }
      });
      return replacedUri;
    }
  }
  function transformKitData(kitData, rows) {
    return rows.map(row => {
      let matchedData = kitData.find(kit => kit.id === row.id);
      if (matchedData) {
        let result = { ...row };
        for (let key in matchedData) {
          if (key.startsWith("name")) {
            let valueKey = "value" + key.slice(4); // Get corresponding value key
            if(typeof matchedData[valueKey] === "number"){
              result[matchedData[key]] = matchedData[valueKey].toFixed(2);
            } else {
              result[matchedData[key]] = matchedData[valueKey];
            }
          }
        }
        return result;
      }
      return row; // Return original row if no match found
    });
  }
  const lastDataRef = useRef(kitMappingArray);
  const timerRef = useRef(null);

  function parseKeyValueString(str) {
    const result = {};
    const pairs = str?.split(';');
    pairs?.forEach(pair => {
      const [key, ...values] = pair?.split(':');
      result[key] = values.join(':');
    });
    return result;
  }

  useEffect(() => {
    const result = parseKeyValueString(freeFormTabbleEditMainrecord?.[data?.component?.sName]);
    if((result?.priceoption === "sPriceOption1" || result?.priceoption === "sPriceOption2") && formAction === "EDIT"){
      setPriceSelect(result?.priceoption);
      // setFreeFormTabbleEditMainrecord({})
    }
  }, [freeFormTabbleEditMainrecord])

  useLayoutEffect(() => {
    if (kitMappingArray !== lastDataRef.current) {
      lastDataRef.current = kitMappingArray;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // timerRef.current = setTimeout(() => {
      //   // setMainData(kitMappingArray);
      //   setRows(rows => transformKitData(kitMappingArray, rows));
      // }, 1000); // 2000 ms (2 seconds) delay
    }
  }, [kitMappingArray]);
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  async function fetchCurrencyValue() {
    let uri =
      serverAddress +
      replacePlaceholders2(data?.component?.currency?.sCurrencyDefaultDataSource, textValue);
    try {
      // Make the API call
      setLoading(true);
      const response = await axios.get(uri, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      //data.component.currency.sValueField
      // Set the data from the response
      if (response?.data?.data?.records[0]?.[data?.component?.currency?.sValueField]) {
        if(formAction === "EDIT" && freeFormTabbleEditMainrecord && !editCurrencyPopulated){
          setSelectedCurrecy(parseFreeFormMainrecordDetails(freeFormTabbleEditMainrecord[data?.component?.sName])?.["currency"])
          setEditCurrencyPopulated(true);
        } else {
          setSelectedCurrecy(
            response?.data?.data?.records[0]?.[data?.component?.currency?.sValueField]
          );
        }
      } else {
        if (
          textValue[data?.component?.currency?.sCurrencyDataAware.replace("{", "").replace("}", "")]
        ) {
          setSelectedCurrecy("");
        }
      }
    } catch (error) {
      // Set error if the API call fails
      // setError(error);
    } finally {
      // Set loading to false once the request is complete
      setLoading(false);
    }
  }
  useEffect(() => {
    const fieldName = data?.component?.currency?.sCurrencyDataAware.replace("{", "").replace("}", "");
    if(textValue[fieldName] && textValue[fieldName] !== "undefined" && textValue[fieldName] !== ""){
      fetchCurrencyValue();
    }
  }, [textValue[data?.component?.currency?.sCurrencyDataAware.replace("{", "").replace("}", "")]]);

  function handleChangeCurrency(val) {
    setSelectedCurrecy(val);
  }

  const combineByTaxType = data => {
    const combinedData = {};

    data.forEach(item => {
      const { taxType, taxAmount, amountOf, taxCode } = item;
      // alert(convertTwoDigits(taxAmount))
      if (combinedData[taxType]) {
        combinedData[taxType].taxAmount += Number(taxAmount);
        combinedData[taxType].amountOf = (Number(combinedData[taxType].amountOf?.toString().replaceAll(",", "")) + Number(amountOf?.toString().replaceAll(",", ""))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        combinedData[taxType].taxCode = taxCode;
      } else {
        combinedData[taxType] = {
          taxType,
          taxAmount,
          amountOf,
          taxCode
        };
      }
    });
    // Convert the map back to an array and filter out objects with amountOf = 0
    return Object.values(combinedData);
    // return Object.values(combinedData).filter(item => item.amountOf > 0);
  };

  function calculateWithHoldingTax(total, percent, disType) {
    // Convert inputs to numbers if they are in string format
    total = parseFloat(total);
    percent = parseFloat(percent);

    let value;
    if (disType === "%") {
      // Calculate percentage value
      value = total * (percent / 100);
    } else if (disType === "Fix") {
      // Use fixed value
      value = percent;
    } else {
      value = "0.00";
    }

    return value;
  }

  useEffect(() => {
    //  alert(JSON.stringify(self))
    if(formAction === "EDIT"){
      if(freeFormTabbleEditMainrecord){
        setSelectedCurrecy(parseFreeFormMainrecordDetails(freeFormTabbleEditMainrecord[data?.component?.sName])?.["currency"])
      }
    } else {
      const returnValue = findObjectByValue1(data?.component?.currency?.sDefaultValue);
      handleChangeCurrency(returnValue?.[data?.component?.currency?.sValueField]);
    }
  }, [currencyOptions, freeFormTabbleEditMainrecord]);
  function findObjectByValue1(value) {
    return currencyOptions.find(obj => Object.values(obj).includes(value));
  }

  function checkDataBeforeSending(payload_data, data) {
    const updatedData = data.filter(item => {
      if (item["sSummaryID"] == "summ_subtotal") {
        return true;
      }
      if (item["sSummaryID"] == "summ_grandtotal") {
        return true;
      }
      if (!payload_data.hasOwnProperty(item["sSummaryID"])) {
        return true;
      }
      if (payload_data[item["sSummaryID"]] === 1) {
        return true;
      } else {
        return false;
      }
    });
    return updatedData;
  }

 
  useEffect(() => {
    const data2 = currencyOptions?.filter(item => {
      return item[data?.component?.currency?.sValueField] == selectedCurrency;
    });
    // setexchangeRateField()
    setexchangeRateField(data2[0]);
    // alert(JSON.stringify(data2[0]))
  }, [selectedCurrency, data, currencyOptions]);

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
      {/* {JSON.stringify(summaryFeildsBPayLoad)} */}
      {/* {JSON.stringify(data?.component?.currency?.sDefaultValue == selectedCurrency)} */}
      {/* <br /> */}
      {/* ---------- */}
      {/* {JSON.stringify( documentSelectmappingData)} */}
      {/* <br /> */}
      {/* ---------- */}
      {/* {data?.component?.currency?.sDefaultValue} */}
      {/* <br /> */}
      {/* {JSON.stringify(documentSelectTableData)} */}
      {/* {JSON.stringify(allTypesTaxesArry)}
      <br />
      ==================
      <br />
       */}

       {/* {parseFloat(exchangeRateField?.[data?.component?.currency?.dExchangeRateField]).toFixed(2)} */}
      <WarningModal
        title={"Warning"}
        warningModalOpen={warningModalOpen}
        setwarningModalOpen={setwarningModalOpen}
        details={"Total transaction amount is greater than the maximum allowable amount of "}
      />
      <Grid container alignItems="center">
        <Grid item xs={8}>
          {/* {data?.pricingOptions?.menu?.bPriceOptionEnabled && ( */}
          <Grid container alignItems="center">
            {data?.pricingOptions?.menu?.bPriceOptionEnabled && (
              <>
                <Grid item>
                  <Typography {...data?.pricingOptions?.menu?.sLabelProps}>
                    <Icon aria-describedby={id} iconName={data?.pricingOptions?.menu?.sIcon} />{" "}
                    {data?.pricingOptions?.menu?.sMenuCaption}
                  </Typography>
                </Grid>
                {/* {JSON.stringify(data?.pricingOptions)} */}
                <Grid item {...data?.pricingOptions?.menu?.sSelectProps}>
                  <FormControl {...data?.pricingOptions?.menu?.sSelectProps}>
                    {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                    <Select
                      labelId="demo-simple-select-label"
                      id={`${data?.component?.sName}-pricing`}
                      value={priceSelect}
                      label="Age"
                      {...data?.pricingOptions?.menu?.sSelectProps}
                      size="small"
                      onChange={e => { 
                        setIsPriceSelectClicked(true);
                        setPriceSelect(e.target.value);
                        setEditDataQtyType([]);
                      }}
                    >
                      <MenuItem value={"Manual"}>
                        {data?.pricingOptions?.menu?.sManualPriceCaption}
                      </MenuItem>
                      {data?.pricingOptions?.sPriceOption1?.bEnabled && <MenuItem value={"sPriceOption1"}>
                        {data?.pricingOptions?.sPriceOption1?.sSubmenuCaption}
                      </MenuItem>}
                      {data?.pricingOptions?.sPriceOption2?.bEnabled && <MenuItem value={"sPriceOption2"}>
                        {data?.pricingOptions?.sPriceOption2?.sSubmenuCaption}
                      </MenuItem>}
                      {data?.pricingOptions?.sPriceOption3?.bEnabled && <MenuItem value={"sPriceOption3"}>
                        {data?.pricingOptions?.sPriceOption3?.sSubmenuCaption}
                      </MenuItem>}
                      {/* <MenuItem value={data?.pricingOptions?.menu?.sManualPriceCaption}>{data?.pricingOptions?.menu?.sManualPriceCaption}</MenuItem> */}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            {data.component.taxcalculation.bVisible == "true" && (
              <Grid
                item
                xs={4}
                style={{ display: "flex", justifyContent: "end", alignItems: "center" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <Icon aria-describedby={id} iconName={data?.component?.taxcalculation?.sIcon} />
                  <Typography {...data?.component?.taxcalculation?.sLabelProps}>
                    {data?.component?.taxcalculation?.sCaption}
                  </Typography>
                </div>
                <FormControl {...data?.component?.taxcalculation?.sSelectProps}>
                  {/* <InputLabel id="select-label">Select an Option</InputLabel> */}
                  <Select
                    // labelId="select-label"
                    id={`${data?.component?.sName}-tax`}
                    value={selectedTax + ""}
                    onChange={e => setSelectedTax(e.target.value)}
                  >
                    <MenuItem value={""}> </MenuItem>
                    {["Inclusive", "Exclusive"].map((item, i) => {
                      return (
                        <MenuItem value={item} style={{ whiteSpace: "pre-line" }}>
                          <div
                            component="span"
                            style={{ width: "100%" }}
                            dangerouslySetInnerHTML={{
                              __html: item
                            }}
                          />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
          {/* )} */}
        </Grid>

        <Grid item xs={4} style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
          {/* <IconButton sx={{ cursor: "pointer" }} > */}
          <div
            style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}
          >
            <Icon aria-describedby={id} iconName={data?.component?.currency?.sIcon} />
            <Typography {...data?.component?.currency?.sLabelProps}>
              {data?.component?.currency?.sCurrencyCaption}
            </Typography>
          </div>
          {/* </IconButton> */}
          <FormControl {...data?.component?.currency?.sSelectProps}>
            {/* <InputLabel id="select-label">Select an Option</InputLabel> */}
            <Select
              // labelId="select-label"
              id={`${data?.component?.sName}-currency`}
              value={selectedCurrency + ""}
              onChange={e => handleChangeCurrency(e.target.value)}
            >
              <MenuItem value={""}> </MenuItem>
              {currencyOptions.map((item, i) => {
                return (
                  <MenuItem
                    value={item[data?.component?.currency?.sValueField]}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    <div
                      component="span"
                      style={{ width: "100%" }}
                      dangerouslySetInnerHTML={{
                        __html:
                          item && item != "" && Object.keys(item).length !== 0
                            ? vsprintf(
                                data?.component?.currency?.sDisplayFormat,
                                replacePlaceholders(data?.component?.currency?.sDisplayField, item)
                                  ?.replace(/[{}]/g, "")?.split(",")
                              )
                            : ""
                      }}
                    />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {data?.component?.options?.mode === "DEFAULT" &&
            data?.component?.menu?.bEnabled === true && (
              <>
                <IconButton sx={{ cursor: "pointer" }} onClick={handleClick2}>
                  <Icon aria-describedby={id} iconName={data?.component?.menu?.sIcon} />
                  <Typography id={`${data?.component?.sName}-actions`}>{data?.component?.menu?.sMenuCaption}</Typography>
                </IconButton>

                <Popover
                  id={id}
                  open={open1}
                  anchorEl={anchorEl12}
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
                    {/* {JSON.stringify(  mainFormData?.details)} */}
                    {data?.component?.resetTable?.bEnabled === true && (
                      <ListItem>
                        <Typography
                          id={`${data?.component?.sName}-actions-1`}
                          onClick={(e) => {
                            // const items = { id: 1, disc_type: "%" };
                            // data?.fixcolumns?.forEach(
                            //   item =>
                            //     (items[item?.sColumnID] = "")
                            // );
                            // // initial State for child columns
                            // data?.child?.forEach(
                            //   item =>
                            //     (items[item.inputtable.sColumnID] = "")
                            // );
                            // setRows([items])
                            // console.log("jbsgklv", items);
                            // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "PREV 3706", rows);
                            setRows([]);
                            setQuantityTypeMapping([]);
                            setResetTable(true);
                            // console.log("sadbkjfbajkqfbeajkfbewajfewhjkwef", "NEXT 3706", []);
                            handleAddRow(e, rows, rows.length, true);
                            handleClose2();
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
                            handleClickOpen(); 
                            setActionType("loadFromFile");
                            setCsvFile();
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
        </Grid>
      </Grid>
      {loading && (
        <Spinner />
      )}
      {csvFile && csvFile.length > 0 ?
        <div style={{ ...data?.component?.sParentContainerProps?.style }}>
          <DataGridPro
            getRowId={(row) => row.id}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={data?.component?.slotProps}
            loading={false}
            rows={rows}
            columns={columns}
            pagination={false}
            localeText={{
              noRowsLabel: 'No records',
            }}
            disableColumnMenu={true}
            hideFooter={true}
            {...data?.component?.sProps}
            rowReordering
            onRowOrderChange={handleRowOrderChange}
          />
        </div>
        : formAction === "EDIT" ? <Box sx={{ position: 'relative' }}>
          {/* <div style={{ ...data?.component?.sParentContainerProps?.style }}> */}
            <DataGridPro
              getRowId={(row) => row.id}
              slots={{
                toolbar: GridToolbar,
              }}
              slotProps={data?.component?.slotProps}
              loading={false}
              rows={rows}
              columns={columns}
              localeText={{
                noRowsLabel: 'No records',
              }}
              pagination={false}
              disableColumnMenu={true}
              hideFooter={true}
              {...data?.component?.sProps}
              rowReordering
              onRowOrderChange={handleRowOrderChange}
            />
          {/* </div> */}
          {/* <CustomLoader loading={loader} rowCount={5} columnWidths={columnWidths} /> */}
          <CustomLoader loading={loader} rows={rows} columns={columns} rowHeight={60} />
        </Box> : <DataGridPro
          autoHeight
          loading={false}
          rows={rows}
          columns={columns}
          pagination={false}
          localeText={{
            noRowsLabel: 'No records',
          }}
          disableColumnMenu={true}
          hideFooter={true}
          {...data?.component?.sProps}
          rowReordering
          onRowOrderChange={handleRowOrderChange}
        />}
      {/* {JSON.stringify(summaryForBackend)}  */}
      <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
        <Box>
            {data?.component?.options?.mode === "DEFAULT" &&
              data?.component?.options?.enableRowAdd && (
              <Box sx={{ border: "1px solid #42a5f5", width: "200px" }}>
                  <Button
                    startIcon={<AddCircleOutlinedIcon onClick={e => handleAddRow(e)} />}
                    id={`${data?.component?.sName}-addrowbutton`}
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
                      );
                    })}
                  </select>
                  </Box>
              )}
          {/true/.test(data?.otherCost?.bEnabled) && (
            <Box
              sx={{
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "200px"
              }}
            >
              <p style={{ alignSelf: "center" }}>Allocate By: </p>{" "}
              <FormControl size="small" sx={{ minWidth: "200px" }}>
                {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={alloceteValue}
                  small
                  label="Age"
                  onChange={e => setAllocate(e.target.value)}
                >
                  <MenuItem value={"Percentage"}>Percentage</MenuItem>
                  <MenuItem value={"Quantity"}>Quantity</MenuItem>
                  <MenuItem value={"Value"}>Value</MenuItem>
                  <MenuItem value={"Manual"}>Manual</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>
        {data.fixcolumns && (
          <Box
            className="overflow-hidden"
            {...data.summaryfields?.sSummarycontainer?.sContainerProps}
            style={{ width: "620px" }}
          >
            {data?.summaryfields?.sSummaryDetails?.map(
              item =>
                (item.bVisible == "true" || item.bVisible == "!false") &&
                item?.sSummaryID !== "summ_grandtotal" &&
                item?.sSummaryID !== "summ_withholding" && (
                  <Grid container py={1} gap={3}>
                    <Grid item xs={4}>
                      {formAction === "EDIT" && loader ? 
                        <Skeleton
                          variant="text"
                          sx={{
                            ...((item?.sLabelProps?.sx?.[0] || {})),
                            fontSize: item?.sLabelProps?.variant === "body1" ? "1rem" : undefined,
                            width: '100%',
                            height: '1em',
                          }}
                        /> : 
                        <Typography {...item?.sLabelProps} id={`${item?.sSummaryID}-label`}>
                          {item?.sSummaryID === "summ_adjustment" ? (
                            <>
                              {(() => {
                                const data = {
                                  inputType: item?.adjustInputType
                                };
                                return (
                                  <>
                                    {
                                      <InputTableDefaultAllComponent
                                        summary={item?.sSummaryID ? item?.sSummaryID : ""}
                                        item={data}
                                        handleClickOpen2={handleClickOpen2}
                                        priceSelect={priceSelect}
                                        csvRowCalculation={csvRowCalculation}
                                        loadQtyCodesCSVData={loadQtyCodesCSVData}
                                        csvFile={csvFile}
                                        documentSelectTableData={documentSelectTableData}
                                        rowClone={rowClone}
                  setRowClone={setRowClone}
                                        isSubmited={isSubmited}
                                        defaultTableEditData={defaultTableEditData}
                                        formAction={"ADD"}
                                        data={data}
                                        error={summaryError[item.sSummaryID]}
                                        feildName={item.sSummaryID}
                                        takeInput={handleSummaryAdjustment}
                                        id={5}
                                        value={summaryForBackend[1]?.sAccountCode || ""}
                                        editable={true}
                                        mainData={mainTableID}
                                        setQuantityTypeMapping={setQuantityTypeMapping}
                                        quantityTypeMapping={quantityTypeMapping}
                                        resetQuantityTypeDefault={resetQuantityTypeDefault}
                                        setResetQuantityTypeDefault={setResetQuantityTypeDefault}
                                        taxDefaultValueCode={taxDefaultValueCode}
                                        setTaxDefaultValueCode={setTaxDefaultValueCode}
                                        priceSelectFetchApi={priceSelectFetchApi}
                                        availableFieldDataAware={availableFieldDataAware}
                                        setAvailableFieldDataAware={setAvailableFieldDataAware}
                                        setEditDataQtyType={setEditDataQtyType}
                                        setBulkDataLoaded={setBulkDataLoaded}
                                        bulkDataLoaded={bulkDataLoaded}
                                        setIsPriceSelectClicked={setIsPriceSelectClicked}
                                        isPriceSelectClicked={isPriceSelectClicked}
                                        formData={data}
                                        baseURL={baseURL}
                                      />
                                    }
                                  </>
                                );
                              })()}
                            </>
                          ) : item?.sSummaryID === "summ_withholding" ? (
                            <>
                              {(() => {
                                const data = {
                                  inputType: item?.withHeldInputType
                                };
                                return (
                                  <>
                                    {/* {summaryForBackend[1]?.sAccountCode} */}
                                    {
                                      <InputTableDefaultAllComponent
                                        summary={item?.sSummaryID ? item?.sSummaryID : ""}
                                        item={data}
                                        handleClickOpen2={handleClickOpen2}
                                        priceSelect={priceSelect}
                                        csvRowCalculation={csvRowCalculation}
                                        loadQtyCodesCSVData={loadQtyCodesCSVData}
                                        csvFile={csvFile}
                                        documentSelectTableData={documentSelectTableData}
                                        rowClone={rowClone}
                  setRowClone={setRowClone}
                                        isSubmited={isSubmited}
                                        formAction={"ADD"}
                                        defaultTableEditData={defaultTableEditData}
                                        data={data}
                                        error={summaryError[item.sSummaryID]}
                                        feildName={item.sSummaryID}
                                        takeInput={handleSummaryAdjustment}
                                        id={5}
                                        value={summaryForBackend[1]?.sAccountCode || ""}
                                        editable={true}
                                        mainData={mainTableID}
                                        setQuantityTypeMapping={setQuantityTypeMapping}
                                        quantityTypeMapping={quantityTypeMapping}
                                        resetQuantityTypeDefault={resetQuantityTypeDefault}
                                        setResetQuantityTypeDefault={setResetQuantityTypeDefault}
                                        taxDefaultValueCode={taxDefaultValueCode}
                                        setTaxDefaultValueCode={setTaxDefaultValueCode}
                                        priceSelectFetchApi={priceSelectFetchApi}
                                        availableFieldDataAware={availableFieldDataAware}
                                        setAvailableFieldDataAware={setAvailableFieldDataAware}
                                        setEditDataQtyType={setEditDataQtyType}
                                        setBulkDataLoaded={setBulkDataLoaded}
                                        bulkDataLoaded={bulkDataLoaded}
                                        setIsPriceSelectClicked={setIsPriceSelectClicked}
                                        isPriceSelectClicked={isPriceSelectClicked}
                                        formData={data}
                                        baseURL={baseURL}
                                      />
                                    }
                                  </>
                                );
                              })()}
                            </>
                          ) : (
                            <>
                              {item.sLabel}
                              {item.sLabel.toLocaleLowerCase().includes("total") &&
                                !item.sLabel.toLocaleLowerCase().includes("sub total") &&
                                ` (${globalvariables?.BaseCurrency})`}
                            </>
                          )}
                        </Typography>
                      }
                    </Grid>
                    <Grid item style={{ display: "flex" }} xs={4}>
                      {formAction === "EDIT" && loader ? 
                        <Skeleton
                          variant="text"
                          sx={{
                            ...((item?.sLabelProps?.sx?.[0] || {})),
                            fontSize: item?.sLabelProps?.variant === "body1" ? "1rem" : undefined,
                            width: '100%',
                            height: '1em',
                          }}
                        /> : 
                        <>
                      {
                        <InputTableDefaultAllComponent
                          item={item}
                          handleClickOpen2={handleClickOpen2}
                          priceSelect={priceSelect}
                          csvRowCalculation={csvRowCalculation}
                          loadQtyCodesCSVData={loadQtyCodesCSVData}
                          csvFile={csvFile}
                          documentSelectTableData={documentSelectTableData}
                          rowClone={rowClone}
                  setRowClone={setRowClone}
                          isSubmited={isSubmited}
                          defaultTableEditData={defaultTableEditData}
                          formAction={"ADD"}
                          data={item}
                          error={summaryError[item.sSummaryID]}
                          callingFrom={"summary"}
                          setcolTaxOptions={setcolTaxOptions}
                          isFromSummary={true}
                          setSummaryTaxSelect={setSummaryForBackend}
                          feildName={item.sSummaryID}
                          takeInput={handleSummaryChange}
                          id={5}
                          value={summaryFeilds[item?.sSummaryID]}
                          mainData={mainTableID}
                          setQuantityTypeMapping={setQuantityTypeMapping}
                          quantityTypeMapping={quantityTypeMapping}
                          resetQuantityTypeDefault={resetQuantityTypeDefault}
                          setResetQuantityTypeDefault={setResetQuantityTypeDefault}
                          taxDefaultValueCode={taxDefaultValueCode}
                          setTaxDefaultValueCode={setTaxDefaultValueCode}
                          priceSelectFetchApi={priceSelectFetchApi}
                          availableFieldDataAware={availableFieldDataAware}
                          setAvailableFieldDataAware={setAvailableFieldDataAware}
                          setEditDataQtyType={setEditDataQtyType}
                          setBulkDataLoaded={setBulkDataLoaded}
                          bulkDataLoaded={bulkDataLoaded}
                          setIsPriceSelectClicked={setIsPriceSelectClicked}
                          isPriceSelectClicked={isPriceSelectClicked}
                          formData={data}
                          baseURL={baseURL}
                        />
                      }

                      {item?.sSummaryID === "summ_discount" && (
                        <Grid item>
                          <Select
                            size="small"
                            name={"disc_type"}
                            fullWidth={true}
                            value={`${summaryFeilds.disc_type}`}
                            onChange={e => handleSummaryChange(e, 8, "Tax")}
                            id={`${data?.component?.sName}-${item?.sSummaryID}-type`}
                          >
                            <MenuItem value={"%"}>%</MenuItem>
                            <MenuItem value={"Fix"}>Fix</MenuItem>
                          </Select>
                        </Grid>
                      )}
                      {item?.sSummaryID === "summ_withholding" && (
                        <Grid item>
                          <Select
                            size="small"
                            name={"disc_type"}
                            fullWidth={true}
                            value={`${summaryFeilds.disc_type}`}
                            onChange={e => handleSummaryChange(e, 8, "Tax")}
                          >
                            <MenuItem value={"%"}>%</MenuItem>
                            <MenuItem value={"Fix"}>Fix</MenuItem>
                          </Select>
                        </Grid>
                      )}
                    </>
                    }
                    </Grid>
                    <Grid item xs={3}>
                      {item?.sLabel === "Sub Total" ? (
                        <Grid item>
                          {formAction === "EDIT" && loader ? 
                            <Skeleton
                              variant="text"
                              sx={{
                                ...((item?.sLabelProps?.sx?.[0] || {})),
                                fontSize: item?.sLabelProps?.variant === "body1" ? "1rem" : undefined,
                                width: '100%',
                                height: '1em',
                              }}
                            /> : 
                          <Typography {...item?.sLabelProps} align="right" id={`${data?.component?.sName}-${item?.sSummaryID}-amount`}>
                            {subTotal}
                          </Typography>
                          }
                        </Grid>
                      ) : item?.sLabel === "Handling" ? (
                        <Grid item>
                          {formAction === "EDIT" && loader ? 
                            <Skeleton
                              variant="text"
                              sx={{
                                ...((item?.sLabelProps?.sx?.[0] || {})),
                                fontSize: item?.sLabelProps?.variant === "body1" ? "1rem" : undefined,
                                width: '100%',
                                height: '1em',
                              }}
                            /> : 
                          <Typography {...item?.sLabelProps} align="right" id={`${data?.component?.sName}-${item?.sSummaryID}-amount`}>
                            {/* {summ_handling} */}
                            {summaryFeilds.summ_handling}
                          </Typography>
                          }
                        </Grid>
                      ) : item?.sLabel === "Shipping" ? (
                        <Grid item>
                          {formAction === "EDIT" && loader ? 
                            <Skeleton
                              variant="text"
                              sx={{
                                ...((item?.sLabelProps?.sx?.[0] || {})),
                                fontSize: item?.sLabelProps?.variant === "body1" ? "1rem" : undefined,
                                width: '100%',
                                height: '1em',
                              }}
                            /> : 
                          <Typography {...item?.sLabelProps} align="right" id={`${data?.component?.sName}-${item?.sSummaryID}-amount`}>
                            {/* {summ_shipping} */}
                            {summaryFeilds.summ_shipping}
                          </Typography>
                          }
                        </Grid>
                      ) : item?.sLabel === "Discount" ? (
                        <Grid item>
                          {formAction === "EDIT" && loader ? 
                            <Skeleton
                              variant="text"
                              sx={{
                                ...((item?.sLabelProps?.sx?.[0] || {})),
                                fontSize: item?.sLabelProps?.variant === "body1" ? "1rem" : undefined,
                                width: '100%',
                                height: '1em',
                              }}
                            /> : 
                          <Typography {...item?.sLabelProps} align="right" id={`${data?.component?.sName}-${item?.sSummaryID}-amount`}>
                            {summ_discount}
                          </Typography>
                          }
                        </Grid>
                      ) : item?.sLabel === "Adjustment" ? (
                        <Grid item>
                          {formAction === "EDIT" && loader ? 
                            <Skeleton
                              variant="text"
                              sx={{
                                ...((item?.sLabelProps?.sx?.[0] || {})),
                                fontSize: item?.sLabelProps?.variant === "body1" ? "1rem" : undefined,
                                width: '100%',
                                height: '1em',
                              }}
                            /> : 
                          <Typography {...item?.sLabelProps} align="right" id={`${data?.component?.sName}-${item?.sSummaryID}-amount`}>
                            {/* {summ_adjustment} */}
                            {convertTwoDigits(summaryFeilds.summ_adjustment)}
                          </Typography>
                          }
                        </Grid>
                      ) : item?.sLabel === "Tax" ? (
                        <Grid item>
                          {formAction === "EDIT" && loader ? 
                            <Skeleton
                              variant="text"
                              sx={{
                                ...((item?.sLabelProps?.sx?.[0] || {})),
                                fontSize: item?.sLabelProps?.variant === "body1" ? "1rem" : undefined,
                                width: '100%',
                                height: '1em',
                              }}
                            /> : 
                          <Typography {...item?.sLabelProps} align="right" id={`${data?.component?.sName}-${item?.sSummaryID}-amount`}>
                            {summ_tax}
                          </Typography>
                          }
                        </Grid>
                      ) : (
                        ""
                      )}
                    </Grid>
                  </Grid>
                )
            )}
            {combineByTaxType(allTypesTaxesArry).map(item => {
              if (item.taxType) {
                return (
                  <>
                    <Grid container py={1} gap={3}>
                      <Grid item xs={4}>
                        {formAction === "EDIT" && loader ? 
                          <Skeleton
                            variant="text"
                            sx={{
                              ...((item?.sLabelProps?.sx?.[0] || {})),
                              fontSize: item?.sLabelProps?.variant === "body1" ? "1rem" : undefined,
                              width: '100%',
                              height: '1em',
                            }}
                          /> : 
                        <Typography color={"black"} id={`${summaryTaxID}-${item?.taxCode ? item?.taxCode : "002"}-label`}>{item.taxType}</Typography>
                        }
                      </Grid>
                      <Grid item xs={4}>
                        {formAction === "EDIT" && loader ? 
                          <Skeleton
                            variant="text"
                            sx={{
                              ...((item?.sLabelProps?.sx?.[0] || {})),
                              fontSize: item?.sLabelProps?.variant === "body1" ? "1rem" : undefined,
                              width: '100%',
                              height: '1em',
                            }}
                          /> : 
                        <Typography color={"black"} id={`${summaryTaxID}-${item?.taxCode ? item?.taxCode : "002"}-value`}>
                          {item.amountOf.toString().includes(".") ? Number(item.amountOf?.toString().replaceAll(",", "")).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : Number(item.amountOf?.toString().replaceAll(",", "")).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                        }
                      </Grid>
                      <Grid item xs={3}>
                          {formAction === "EDIT" && loader ? 
                            <Skeleton
                              variant="text"
                              sx={{
                                ...((item?.sLabelProps?.sx?.[0] || {})),
                                fontSize: item?.sLabelProps?.variant === "body1" ? "1rem" : undefined,
                                width: '100%',
                                height: '1em',
                              }}
                            /> : 
                        <Typography color={"black"} align="right" id={`${summaryTaxID}-${item?.taxCode ? item?.taxCode : "002"}-amount`}>
                          {item.taxAmount.toString().includes(".") ? item.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : item.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                          }
                      </Grid>
                    </Grid>
                  </>
                );
              }
            })}
            {/* {JSON.stringify(summaryFeilds)} */}
            {data?.summaryfields?.sSummaryDetails?.map(
              item =>
                (item.bVisible == "true" || item.bVisible == "!false") &&
                (item?.sSummaryID === "summ_grandtotal" || item?.sSummaryID === "summ_withholding") && (
                  <Grid container py={1} gap={3}>
                    {/* {JSON.stringify(item)} */}
                    {item?.sSummaryID === "summ_withholding" && (
                      <Grid item xs={12}>
                        {formAction === "EDIT" && loader ? 
                            <Skeleton
                              variant="text"
                              sx={{
                                ...((item?.sLabelProps?.sx?.[0] || {})),
                                fontSize: item?.sLabelProps?.variant === "body1" ? "1rem" : undefined,
                                width: '100%',
                                height: '1em',
                              }}
                            /> : 
                         <Typography color={"black"} id={`${item?.sSummaryID}-label`}>{item.sLabel}</Typography>
                          }
                      </Grid>
                    )}
                    <Grid item xs={4}>
                      {
                        <Typography {...item?.sLabelProps} id={`${item?.sSummaryID}-label`}>
                          {item?.sSummaryID === "summ_withholding" ? (
                            <>
                              {(() => {
                                const data = {
                                  inputType: item?.withHeldInputType
                                };
                                return (
                                  <>
                                  {formAction === "EDIT" && loader ? 
                                    <Skeleton
                                      variant="text"
                                      sx={{
                                        ...((item?.sLabelProps?.sx?.[0] || {})),
                                        fontSize: item?.sLabelProps?.variant === "body1" ? "1rem" : undefined,
                                        width: '100%',
                                        height: '1em',
                                      }}
                                    /> : 
                                  <>
                                    {
                                      <InputTableDefaultAllComponent
                                      summary={item?.sSummaryID ? item?.sSummaryID : ""}
                                        defaultTableEditData={defaultTableEditData}
                                        item={data}
                                        handleClickOpen2={handleClickOpen2}
                                        priceSelect={priceSelect}
                                        csvRowCalculation={csvRowCalculation}
                                        loadQtyCodesCSVData={loadQtyCodesCSVData}
                                        csvFile={csvFile}
                                        documentSelectTableData={documentSelectTableData}
                                        rowClone={rowClone}
                  setRowClone={setRowClone}
                                        isSubmited={isSubmited}
                                        formAction={"ADD"}
                                        data={data}
                                        error={summaryError[item.sSummaryID]}
                                        feildName={item.sSummaryID}
                                        takeInput={handleSummaryAdjustment}
                                        id={5}
                                        // value={'WC040' || ""}
                                        value={
                                          summaryForBackend.filter(elm => {
                                            if (elm.sSummaryID == "summ_withholding") {
                                              return elm.sAccountCode;
                                            }
                                          })?.[0]?.sAccountCode
                                        }
                                        editable={true}
                                        mainData={mainTableID}
                                        setQuantityTypeMapping={setQuantityTypeMapping}
                                        quantityTypeMapping={quantityTypeMapping}
                                        resetQuantityTypeDefault={resetQuantityTypeDefault}
                                        setResetQuantityTypeDefault={setResetQuantityTypeDefault}
                                        taxDefaultValueCode={taxDefaultValueCode}
                                        setTaxDefaultValueCode={setTaxDefaultValueCode}
                                        priceSelectFetchApi={priceSelectFetchApi}
                                        availableFieldDataAware={availableFieldDataAware}
                                        setAvailableFieldDataAware={setAvailableFieldDataAware}
                                        setEditDataQtyType={setEditDataQtyType}
                                        setBulkDataLoaded={setBulkDataLoaded}
                                        bulkDataLoaded={bulkDataLoaded}
                                        setIsPriceSelectClicked={setIsPriceSelectClicked}
                                        isPriceSelectClicked={isPriceSelectClicked}
                                        formData={data}
                                        baseURL={baseURL}
                                      />
                                    }
                                  </>
                                  }
                                  </>
                                );
                              })()}
                            </>
                          ) : (
                            <>
                              {formAction === "EDIT" && loader ? 
                              <Skeleton
                                variant="text"
                                sx={{
                                  ...((item?.sLabelProps?.sx?.[0] || {})),
                                  fontSize: item?.sLabelProps?.variant === "body1" ? "1rem" : undefined,
                                  width: '100%',
                                  height: '1em',
                                }}
                              /> : 
                            <>
                              {item.sLabel}
                              {item.sLabel.toLocaleLowerCase().includes("total") &&
                                !item.sLabel.toLocaleLowerCase().includes("sub total") &&
                                ` (${findObjectByValue1(selectedCurrency)?.sCurrencyCode || ""})`}
                                </>
                              }
                            </>
                          )}
                        </Typography>
                      }
                    </Grid>
                    <Grid item style={{ display: "flex" }} xs={4}>
                          {formAction === "EDIT" && loader ? (
                            <Skeleton
                              variant="rectangular"
                              sx={{
                                height: 53,
                                borderRadius: 1,
                                width: "100%",
                              }}
                            />
                          ) : (
                            <>
                      { <InputTableDefaultAllComponent
                          item={item}
                          handleClickOpen2={handleClickOpen2}
                          priceSelect={priceSelect}
                          csvRowCalculation={csvRowCalculation}
                          loadQtyCodesCSVData={loadQtyCodesCSVData}
                          csvFile={csvFile}
                          documentSelectTableData={documentSelectTableData}
                          rowClone={rowClone}
                  setRowClone={setRowClone}
                          isSubmited={isSubmited}
                          formAction={"ADD"}
                          defaultTableEditData={defaultTableEditData}
                          data={item}
                          error={summaryError[item.sSummaryID]}
                          callingFrom={"summary"}
                          setcolTaxOptions={setcolTaxOptions}
                          isFromSummary={true}
                          setSummaryTaxSelect={setSummaryForBackend}
                          feildName={item.sSummaryID}
                          takeInput={handleSummaryChange}
                          id={5}
                          sWithholdCode={summaryForBackend.filter(elm => {
                            if (elm.sSummaryID == "summ_withholding") {
                              return elm.sAccountCode;
                            }
                          })}
                          value={summaryFeilds[item?.sSummaryID]}
                          mainData={mainTableID}
                          setQuantityTypeMapping={setQuantityTypeMapping}
                          quantityTypeMapping={quantityTypeMapping}
                          resetQuantityTypeDefault={resetQuantityTypeDefault}
                          setResetQuantityTypeDefault={setResetQuantityTypeDefault}
                          taxDefaultValueCode={taxDefaultValueCode}
                          setTaxDefaultValueCode={setTaxDefaultValueCode}
                          priceSelectFetchApi={priceSelectFetchApi}
                          availableFieldDataAware={availableFieldDataAware}
                          setAvailableFieldDataAware={setAvailableFieldDataAware}
                          setEditDataQtyType={setEditDataQtyType}
                          setBulkDataLoaded={setBulkDataLoaded}
                          bulkDataLoaded={bulkDataLoaded}
                          setIsPriceSelectClicked={setIsPriceSelectClicked}
                          isPriceSelectClicked={isPriceSelectClicked}
                          formData={data}
                          baseURL={baseURL}
                        /> }
                            </>
                          )}
                      {item?.sSummaryID === "summ_withholding" && (
                        <Grid item>
                          {formAction === "EDIT" && loader ? (
                            <Skeleton
                              variant="rectangular"
                              sx={{
                                height: 53,
                                borderRadius: 4,
                                width: "100%",
                              }}
                            />
                          ) : (
                          <Select
                            size="small"
                            name={"withholding_disc_type"}
                            fullWidth={true}
                            value={`${summaryFeilds.withholding_disc_type}`}
                            onChange={e => handleSummaryChange(e, 8, "Tax")}
                            id={`${data?.component?.sName}-${item?.sSummaryID}-type`}
                            sx={{height: "53px"}}
                          >
                            <MenuItem value={"%"}>%</MenuItem>
                            <MenuItem value={"Fix"}>Fix</MenuItem>
                          </Select>
                          )}
                        </Grid>
                      )}
                    </Grid>
                    <Grid item xs={3}>
                      {item?.sLabel === "Withholding Tax" ? (
                        <Grid item>
                          {formAction === "EDIT" && loader ? 
                            <Skeleton
                              variant="text"
                              sx={{
                                ...((item?.sLabelProps?.sx?.[0] || {})),
                                fontSize: item?.sLabelProps?.variant === "body1" ? "1rem" : undefined,
                                width: '100%',
                                height: '1em',
                              }}
                            /> : 
                          <Typography {...item?.sLabelProps} align="right" id={`${data?.component?.sName}-${item?.sSummaryID}-amount`}>
                            {/* {calculateWithHoldingTax( +convertTwoDigits(subTotal?.toString()?.replace(/,/g, "")), +convertTwoDigits(summaryFeilds[item.sSummaryID]?.toString()?.replace(/,/g, "")),summaryFeilds.withholding_disc_type) } */}
                            {Number(
                              +calculateWithHoldingTax(
                                +convertTwoDigits(subTotal?.toString()?.replace(/,/g, "")),
                                +convertTwoDigits(
                                  summaryFeilds["summ_withholding"]?.toString()?.replace(/,/g, "")
                                ),
                                summaryFeilds.withholding_disc_type
                              )
                            ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Typography>
                          }
                        </Grid>
                      ) : item?.sSummaryID === "summ_grandtotal" ? (
                        <Grid item>
                          {formAction === "EDIT" && loader ? 
                            <Skeleton
                              variant="text"
                              sx={{
                                ...((item?.sLabelProps?.sx?.[0] || {})),
                                fontSize: item?.sLabelProps?.variant === "body1" ? "1rem" : undefined,
                                width: '100%',
                                height: '1em',
                              }}
                            /> : 
                            <>
                          <Typography {...item?.sLabelProps} align="right" id={`${data?.component?.sName}-${item?.sSummaryID}-amount`}>
                            {/* {JSON.stringify(selectedTax == 'Exclusive')} */}
                            {/* {
                                  (convertTwoDigits(parseFloat(summ_grandTotal?.toString()?.replace(/,/g, "")) +
                                  convertTwoDigits(allTypesTaxesArry.reduce((acc, item) => acc + item.taxAmount, 0))))
                                  } */}
                            {/* {5 +
                            isNaN(
                              convertTwoDigits(
                                allTypesTaxesArry.reduce((acc, item) => acc + item.taxAmount, 0)
                              )
                            )
                              ? 5
                              : 2}{" "}
                            ---
                            {+convertTwoDigits(summ_grandTotal?.toString()?.replace(/,/g, ""))}--
                            {convertTwoDigits(
                              +convertTwoDigits(summ_grandTotal?.toString()?.replace(/,/g, "")) +
                                isNaN(
                                  +convertTwoDigits(
                                    allTypesTaxesArry.reduce((acc, item) => acc + item.taxAmount, 0)
                                  )
                                )
                                ? 0
                                : +convertTwoDigits(
                                    allTypesTaxesArry.reduce((acc, item) => acc + item.taxAmount, 0)
                                  ) -
                                    +calculateWithHoldingTax(
                                      +convertTwoDigits(subTotal?.toString()?.replace(/,/g, "")),
                                      +convertTwoDigits(
                                        summaryFeilds["summ_withholding"]
                                          ?.toString()
                                          ?.replace(/,/g, "")
                                      ),
                                      summaryFeilds.withholding_disc_type
                                    )
                            )} */}

                            {!isNaN(
                              +convertTwoDigits(
                                allTypesTaxesArry.reduce((acc, item) => acc + item.taxAmount, 0)
                              )
                            ) ? (
                              <>
                                {/* {Number(
                                  convertTwoDigits(
                                    +convertTwoDigits(
                                      summ_grandTotal?.toString()?.replace(/,/g, "")
                                    ) +
                                    +allTypesTaxesArry.reduce(
                                      (acc, item) => acc + item.taxAmount,
                                      0
                                    ) -
                                    +calculateWithHoldingTax(
                                      +convertTwoDigits(subTotal?.toString()?.replace(/,/g, "")),
                                      +convertTwoDigits(
                                        summaryFeilds["summ_withholding"]
                                          ?.toString()
                                          ?.replace(/,/g, "")
                                      ),
                                      summaryFeilds.withholding_disc_type
                                    )
                                  )
                                ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} */}
                                  {/* {(Number((summ_grandTotal).replaceAll(",", "")) + (allTypesTaxesArry.reduce(
                                      (acc, item) => acc + item.taxAmount,
                                      0
                                    )) - Number(calculateWithHoldingTax(
                                      Number(subTotal?.toString()?.replace(",", "")),
                                      summaryFeilds["summ_withholding"]?.toString()?.replaceAll(",", ""),
                                      summaryFeilds.withholding_disc_type
                                    ))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} */}
                                    {
                                      ((Number(Number(summ_grandTotal?.toString().replaceAll(",", "")).toFixed(2)) + Number(Number(allTypesTaxesArry.reduce((acc, item) => acc + item.taxAmount, 0)?.toString().replaceAll(",", "")).toFixed(2))) - Number(Number(
                                        +calculateWithHoldingTax(
                                          +convertTwoDigits(subTotal?.toString()?.replace(/,/g, "")),
                                          +convertTwoDigits(
                                            summaryFeilds["summ_withholding"]?.toString()?.replace(/,/g, "")
                                          ),
                                          summaryFeilds.withholding_disc_type
                                        )))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                    }
                                
                                {/* {Number(
                                    +convertTwoDigits(
                                      summ_grandTotal?.toString()?.replace(/,/g, "")
                                    ) +
                                    +allTypesTaxesArry.reduce(
                                      (acc, item) => acc + item.taxAmount,
                                      0
                                    ) -
                                    +calculateWithHoldingTax(
                                      +convertTwoDigits(subTotal?.toString()?.replace(/,/g, "")),
                                      +convertTwoDigits(
                                        summaryFeilds["summ_withholding"]
                                          ?.toString()
                                          ?.replace(/,/g, "")
                                      ),
                                      summaryFeilds.withholding_disc_type
                                    )
                                  )
                                .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} */}
                              </>
                            ) : (
                              <>
                                {" "}
                                {
                                  isNaN(
                                    parseFloat(
                                      Number(
                                        convertTwoDigits(
                                          +summ_grandTotal?.toString()?.replace(/,/g, "") +
                                            +allTypesTaxesArry.reduce(
                                              (acc, item) => acc + item.taxAmount,
                                              0
                                            )
                                        )
                                      )
                                    ).toFixed(2)
                                  )
                                    ? "0.00"
                                    : parseFloat(
                                        Number(
                                          convertTwoDigits(
                                            +summ_grandTotal?.toString()?.replace(/,/g, "") +
                                              +allTypesTaxesArry.reduce(
                                                (acc, item) => acc + item.taxAmount,
                                                0
                                              )
                                          )
                                        )
                                      )
                                        .toFixed(2)
                                        .toLocaleString()
                                }
                              </>
                            )}

                            {/* {convertTwoDigits(summ_grandTotal?.toString()?.replace(/,/g, ""))} */}
                            {/* {selectedTax != 'Inclusive'? summ_grandTotal: (parseFloat(summ_grandTotal?.toString()?.replace(/,/g, ""))  + allTypesTaxesArry.reduce((acc, item) => acc + item.taxAmount, 0)).toFixed(2)} */}
                          </Typography>
                          {/* {totalLimit} */}
                          <Typography color={"red"} align="right" >
                            {totalLimit != 0 &&
                              +summ_grandTotal?.toString()?.replace(/,/g, "") >
                                +totalLimit?.toString()?.replace(/,/g, "") && <p>Limit Exceed</p>}
                          </Typography>
                            </>
                          }
                        </Grid>
                      ) : (
                        ""
                      )}
                    </Grid>
                    <Grid item xs={12} sx={{marginTop: "-15px"}} >
                     {item?.sSummaryID === "summ_grandtotal" && 
                     <>
                        {formAction === "EDIT" && loader ? 
                          <Skeleton
                            variant="text"
                            sx={{
                              ...((item?.sLabelProps?.sx?.[0] || {})),
                              fontSize: item?.sLabelProps?.variant === "body1" ? "1rem" : undefined,
                              width: '100%',
                              height: '1em',
                            }}
                          /> : 
                          <Typography id={`${data?.component?.sName}-grandtotal-conversion`}>
                        {data?.component?.currency?.sDefaultValue != selectedCurrency && (
                        <>
                          {data?.component?.currency?.sDefaultValue}{" "}
                          {/* {handlePointChange} */}
                          {(Number(
                            !isNaN(
                              +convertTwoDigits(
                                allTypesTaxesArry.reduce((acc, item) => acc + item.taxAmount, 0)
                              )
                            )
                              ? convertTwoDigits(
                                  +convertTwoDigits(
                                    summ_grandTotal?.toString()?.replace(/,/g, "")
                                  ) +
                                    +allTypesTaxesArry.reduce(
                                      (acc, item) => acc + item.taxAmount,
                                      0
                                    ) -
                                    +calculateWithHoldingTax(
                                      +convertTwoDigits(subTotal?.toString()?.replace(/,/g, "")),
                                      +convertTwoDigits(
                                        summaryFeilds["summ_withholding"]
                                          ?.toString()
                                          ?.replace(/,/g, "")
                                      ),
                                      summaryFeilds.withholding_disc_type
                                    )
                                )
                              : parseFloat(
                                  Number(
                                    convertTwoDigits(
                                      +summ_grandTotal?.toString()?.replace(/,/g, "") +
                                        +allTypesTaxesArry.reduce(
                                          (acc, item) => acc + item.taxAmount,
                                          0
                                        )
                                    )
                                  )
                                ).toFixed(2)
                          ) *
                            exchangeRateField?.[data?.component?.currency?.dExchangeRateField])?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                          @ {selectedCurrency} 1 = {data?.component?.currency?.sDefaultValue}{" "}
                          {parseFloat(exchangeRateField?.[data?.component?.currency?.dExchangeRateField]).toFixed(2)}
                        </>
                      )}
                     </Typography>
                        }
                     </>
                    }
                    </Grid>
                  </Grid>
                )
            )}
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
        <IconButton
            onClick={()=>{
              handleClose(false);
              if(csvBackup){
                setCsvFile(csvBackup);
              }
            }}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        <DialogTitle>
          {" "}
          {actionType === "bulkLoad" || actionType === "bulkLoad2" || actionType === "bulkLoad3"
            ? data?.component?.[actionType]?.sSubmenuCaption
            : data?.component?.loadFromFile?.sSubmenuCaption}
        </DialogTitle>
        <DialogContent>
          {actionType === "bulkLoad" || actionType === "bulkLoad2" || actionType === "bulkLoad3" ? (
            <>
              {/* {replacePlaceholder(data?.component?.[actionType]?.sDataSource, textValue)} */}
              <SelectAllTransferList
                data={data}
                setBulkLoadData={setBulkLoadData}
                freeForm={rows}
                sDisplayFormat={data?.component?.[actionType]?.sDisplayFormat}
                token={token}
                uri={replacePlaceholder(data?.component?.[actionType]?.sDataSource, textValue)}
              />
            </>
          ) : (
            <>
              {!csvFile ? (
                <Box display="flex" flexDirection="column" alignItems="center" onDragOver={(e) => e.preventDefault()}>
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
                    id="select-box"
                  >
                    <label htmlFor="fileInput">
                      <Box width={500} height={140}>
                        <Box p={2} display="flex" flexDirection="column" alignItems="center">
                          <CloudUploadIcon sx={{fontSize: "48px"}} />
                          <Typography variant="body1" gutterBottom>
                            Click here to select a file or drag and drop a file
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
                <Box>
                  <Typography variant="p" className="pb-3 " component={"p"}>
                    Mapping Details
                  </Typography>
                  <hr />
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={6}>
                    <InputLabel style={{ marginTop: "10px" }}>Input Fields</InputLabel>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <InputLabel style={{ marginTop: "10px" }}>Map to</InputLabel>
                  </Grid>
                </Grid>
                  {(() => {
                    const arry = data?.component?.loadFromFile?.sMapping?.split(", ");
                    return (
                      <>
                        {data?.fixcolumns?.map(item => {
                          if (arry.includes(item.sColumnID)) {
                            return (
                              <Box sx={{ display: "flex", margin: "10px" }}>
                                <Box sx={{ width: "50%", alignSelf: "center" }}>{item.sColumnID === "col_qty" ? `${item.sHeader} / Unit` : item.sHeader}</Box>
                                <Box sx={{ width: "50%" }}>
                                  {item.sColumnID === "col_qty" ? <Box sx={{ display: "flex", gap: 1 }}>
                                    <Select
                                      fullWidth={true}
                                      labelId="select-label"
                                      id={item.sColumnID}
                                      name={item.sColumnID}
                                      onChange={e =>
                                        setSelectedLoadfromFile(pre => ({
                                          ...pre,
                                          [e.target.name]: e.target.value
                                        }))
                                      }
                                      size="small"
                                    >
                                      {Object.keys(csvFile[0]).map((item, index) => (
                                        item !== "matchId" && (
                                          <MenuItem key={item} value={item}>
                                            {item}
                                          </MenuItem>
                                        )
                                      ))}
                                    </Select>
                                    <Select
                                      fullWidth={true}
                                      labelId="select-label"
                                      id={`${item.sColumnID}-unit`}
                                      name="qtySelect"
                                      onChange={e =>
                                        setSelectedLoadfromFile(pre => ({
                                          ...pre,
                                          [e.target.name]: e.target.value
                                        }))
                                      }
                                      size="small"
                                    >
                                      {Object.keys(csvFile[0]).map((item, index) => (
                                        item !== "matchId" && (
                                          <MenuItem key={item} value={item}>
                                            {item}
                                          </MenuItem>
                                        )
                                      ))}
                                    </Select>
                                  </Box> : <Select
                                    fullWidth={true}
                                    labelId="select-label"
                                    id={item.sColumnID}
                                    name={item.sColumnID}
                                    onChange={e =>
                                      setSelectedLoadfromFile(pre => ({
                                        ...pre,
                                        [e.target.name]: e.target.value
                                      }))
                                    }
                                    size="small"
                                  >
                                    {Object.keys(csvFile[0]).map((item, index) => (
                                      item !== "matchId" && (
                                        <MenuItem key={item} value={item}>
                                          {item}
                                        </MenuItem>
                                      )
                                    ))}
                                  </Select>}
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
            disabled={BulkLoadData?.length == 0 && selectedLoadfromFile == undefined}
            onClick={() => {
              if (selectedLoadfromFile != undefined) {
                maptoRow();
                setCSVFileLoader(true);
              } else {
                handleBulkLoad(actionType);
              }
            }}
            id="button-save"
          >
            {csvFileLoader ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ marginRight: 1 }} />
                Fetching data
              </>
            ) : (
              'Save'
            )}
          </Button>
          <Button size="small" variant="contained" onClick={() => {
            handleClose();
            if(csvBackup){
              setCsvFile(csvBackup);
            }
          }} id="button-close">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default InputTableDefault;
