import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Input,
  Modal,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
// import { Link } from "react-router-dom";
import { baseURL } from "../../api";
import { Icon } from "../../utils/MuiIcons/Icon";
import { useNavigate, useLocation } from "react-router-dom";
import { validateTextField, globalvalidateTextField } from "../../utils/validations/Validation";
import TableComponent from "../TableComponent/TableComponent";
import DataGridComponent from "../DataGridComponent/DataGridComponent";
import BasicTabs from "../TabComponent/TabComponent";
import FormBar from "./formmenu";
import dayjs from "dayjs";
import DataTableComponent from "../DataTableComponent/DataTableComponent";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  renderTypography,
  renderTextfield,
  renderpasswordTextfield,
  renderlinkfield,
  renderCounter,
  renderCurrency,
  renderFixedvalue,
  renderAutoComplete,
  rendercheckbox,
  renderTransferList,
  renderRadioGroup,
  renderSelect,
  renderImage,
  renderDatecomponent,
  renderButtonComponent,
  renderCardComponent,
  avatarcomponent,
  rendervartextcomponent,
  renderglobaltextcomponent,
  renderdialogboxcomponent,
  renderNestedDialog
} from "../hooks/ComponentsData";

import { serverAddress } from "../../config";
import ListItemdata from "../../component/ListItem/ListItem";
import MessageError from "./MessageError";
import CustomAlert from "../../component/AlertComponent/Alert";
import TitleHeader from "../../component/TitleHeader/TitleHeader";
import FormFooter from "../../component/FormFooter/FormFooter";
import { Global_Data } from "../../globalData/GlobalData";
import Varselect from "../../component/VarSelect/Varselect";
import NUMBER from "../../component/NUMBER/NUMBER";
import Loadfrom from "../../component/Loadfrom/Loadfrom";
import Counter from "../../component/Counter/Counter";
import ButtonDropdown from "../../component/Button Dropdown/ButtonDropdown";
import FileUpload from "../../component/FileUpload/FileUpload";
import Multirecord from "../TableComponent/Multirecord";
import MediaDialog from "../../component/MediaDialog/MediaDialog";
import ImageComponent from "../../component/ImageComponent/ImageComponent";
import ImgComponent from "../../component/ImgComponent/ImgComponent";
import AlertPopup from "../../component/AlertComponent/AlertPopup";
import Vartext from "../../component/VARTEXT/Vartext";
import AccordianComponent from "../../component/Accordian/AccordianComponent";
import AllTablesMain from "../TableComponent/AllTablesMain";
import Child from "./Child";
import VarValue from "../../component/Accordian/VarValue";
import DocumentSelect from "../../component/DocumentSelect/DocumentSelect";
import EVENT from "../../component/EVENT/EVENT";
import Spinner from "../../component/spinner/Spinner";
import VarDateTime from "../../component/VARDATETIME/VarDateTime";
import CUSTOMBOX from "../../component/CUSTOMBOX/CUSTOMBOX";
import OverLayDrawer from "../../component/OverLayDrawer/OverLayDrawer";
import VARCUSTOMHTML from "../../component/VARCUSTOMHTML/VARCUSTOMHTML";
import SECTION from "../../component/SECTION/SECTION";
import VarConcat from "../../component/VarConcat/VarConcat";
import DialogDrawer from "../../component/DialogDrawer/DialogDrawer";
import VARNUMBER from "../../component/VARNUMBER/VARNUMBER";
import RenderBarchart from "../../component/Charts/BARCHART";
import RenderLineChart from "../../component/Charts/LINECHART";
import RenderPieChart from "../../component/Charts/PIECHART";
import RenderVarstore from "../../component/VARSTORE/RenderVarstore";

const Form = ({ route, setFetchMainApi }) => {
  const parseURL = urlString => {
    try {
      // Find the index of "?" in the URL
      const queryIndex = urlString.indexOf("&");
      // Extract the pathname
      const pathname = queryIndex !== -1 ? urlString.slice(0, queryIndex) : urlString;
      // Extract the search  query
      const searchQuery = queryIndex !== -1 ? urlString.slice(queryIndex) : "";
      // Return the results
      return { pathname, searchQuery };
    } catch (error) {
      // Handle invalid URLs
      return null;
    }
  };
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token,
    LogoutOnError,
    setHandleClickOpen,
    modalEditData,
    setModalEditData,
    textValue,
    modalActionTypeAndID,
    setTextValue,
    openModalData,
    setOpenModalData,
    open,
    isAlertPopup,isDialogDrawerOpen,
    setOpen,
    fetchDataHandleDataGrid,
    globalFormData,
    setGlobalFormData,
    setModalPrimaryKry,
    modalPrimaryKey,
    fetchFormaData1,
    freeFormInitState,
    setOverLaySplit,
    overlaySplit,
    setFreeFormInitState,
    mainFormData,
    setmainFormData,
    overLayDataFetchApi,
    defaultTableSummaryData,
    setDefaultTableSummaryData,
    setglobalvariables,
    globalvariables,
    freeFromtableRowDataStore,
    setFormData,
    formData,
    sAlertPopup,varCustomDialogData,
    overlaySplitOldData,
    setOverLaySplitOldData,
    setIsAlertPopup,
    setFreeFromTableRowDataStore,
    openModalChildData,
    openModalDataActive,
    defaultTableSummaryFeild,
    isoverLayDataLoading,
    setdefaultTableSummaryFeild,
    setisPageLoading,
    isPageLoading,
    nestedDialog,
    setNestedDialog,varCutomDialogApi,
    isOpenModalChildData,
    setIsOpenModalChildData,
    setOpenModalChildData,varCustomDialogTitle,
    sideBarStyle,setFreeFormToDefault,
    setDefaultTableSelectedLocation,
    setDefaultTableSelectedDataAwareData,
    setDefaultTableSelectedSupplier,
    setDebugSectionAPIData,
    setOpenDebugSection,
    freeFormDataSubmit,
    sectionComponentDataAware,
    setSectionComponentDataAware,
    conversionNamesMapping,
    setConversionNamesMapping
  } = Global_Data?.() || {};

  const [formMetadata, setformMetata] = useState();
  const [IsTable, setIsTable] = useState(false);
  const [freeFromTotals, setFreeFromTotals] = useState("0.00");
  const [freeFormTabbleArrays, setFreeFormTabbleArrays] = useState([]);
  const [freeFormTabbleEditArrays, setFreeFormTabbleEditArrays] = useState([]);
  const [freeFormTabbleEditMainrecord, setFreeFormTabbleEditMainrecord] = useState([]);
  const [varValue, setVarValue] = useState({});
  const [error, setError] = useState({});
  const [index, setIndex] = useState(-1);
  const [tablesampledata, SetTabledata] = useState();
  const [summaryfields, setsummaryfields] = useState();
  const [freeformdata, setFreeformfield] = useState();
  const [defaultTableMode, setDefaultTableMode] = useState("");
  const [defaultTableName, setDefaultTableName] = useState("");
  const [freeformTableMode, setFreeformTableMode] = useState("");
  const [debitCreditTableMode, setdebitCreditTableMode] = useState("");
  const [debitCreditTotal, setdebitCreditTotal] = useState({});
  const [debitCreditTotalBalanced, setdebitCreditTotalBalanced] = useState(true);
  const [debitCreditTableData, setdebitCreditTableData] = useState([]);
  const [debitCreditTableName, setdebitCreditTableName] = useState("");
  const [freeformTableName, setFreeformTableName] = useState("");
  const [filterDefault, setfilterDefault] = useState();
  const [differenceDebitCredit, setdifferenceDebitCredit] = useState(1);
  const [filterFreeform, setfilterfreeForm] = useState();
  const [isSubmited, setIssubmited] = useState(false);
  const [formIsSubmited, setformIsSubmited] = useState(false);
  const [successMessage, setmessage] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [tableMianData, setTablemaindata] = useState("");
  const [validaterules, setValidationRules] = useState({});
  const [resultData, setResultData] = useState("");
  const [singlefileImg, setSingleImg] = useState();
  const [handleModalclick, sethandleModalclick] = useState(false);
  const [multiplefileImg, setmultiplefileImg] = useState({});
  const [imageuploadURL, setImgUploadURL] = useState("");
  const [isDisabledTable, setIsDisabledTable] = useState(false);
  const [isFileUpload, setIsFileUpload] = useState([]);
  const [filesForBackend, setFilesForBackend] = useState([]);
  const [editFiledata, setEditFormFiles] = useState([]);
  const [multiRecordForBackend, setMultiRecordForBackend] = useState([]);
  const [imagesIdsFromMedia, setImagesIdsFromMedia] = useState([]);
  const [bPayloads, setbPayloads] = useState({});
  const [bPayloadsDailog, setbPayloadsDailog] = useState({});
  const [bPayloadsDailogOld, setbPayloadsDailogOld] = useState({});
  const [selectAndAutocompleteSname, setSelectAndAutocompleteSname] = useState("");
  const [freeFormValidateFunction, setfreeFormValidateFunction] = useState();
  const [multirecordValidateFunction, setmultirecordValidateFunction] = useState();
  const [defaultTableValidateFunction, setdefaultTableValidateFunction] = useState();
  const [debitCreditValidateFunction, setdebitCreditValidateFunction] = useState();
  const [multirecordExist, setmultirecordExist] = useState(false);
  const [selectedRowsDataGrid, setselectedRowsDataGrid] = useState([]);
  const [documentSelectTableData, setdocumentSelectTableData] = useState([]);
  const [documentSelectmappingData, setdocumentSelectmappingData] = useState({});
  const [openModalFreeFormName, setopenModalFreeFormName] = useState([]);

  const [defaultTableNameAndModel, setdefaultTableNameAndModel] = useState({});
  const [dTermDays, setdTermDays] = useState(0);

  const [checkMaxTotalValue, setcheckMaxTotalValue] = useState("");
  const [allowZeroValue, setallowZeroValue] = useState("");
  const [nestedDialogMode, setNestedDialogMode] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setResultData();
      setmessage();
    }, 5000);
  }, [resultData, successMessage]);

  // alert('dd')

  const [recordData, setRecordData] = useState({});
  const urlCapture = window.location.pathname + window.location.search;

  // dialog

  const [dialogMode, setDialogMode] = React.useState();
  const [dialogTextValue, setDialogTextValue] = useState({});

  function handleClickOpen(mode) {
    setDialogTextValue(textValue);
    setError(null);

    sethandleModalclick(true);
    if (mode.options.nested) {
      setNestedDialogMode(mode);
      setNestedDialog(true);
    } else {
      setDialogMode(mode);
      setOpen(true);
    }
  }

  useEffect(() => {

    setHandleClickOpen(() => handleClickOpen);

  }, [textValue]);

  const handleClose = () => {
    if (isOpenModalChildData) {
      setbPayloadsDailog(bPayloadsDailogOld);
      setIsOpenModalChildData(false);
      setNestedDialog(false);
    } else {
      // isOpenModalChildData, setIsOpenModalChildData
      setOpen(false);
      // alert('ii')
    }

    removeFreeFormTable(openModalChildData);
    setTextValue(dialogTextValue);
    setModalEditData({});
    sethandleModalclick(false);

    // setFreeFormTabbleArrays([])
  };
  function removeFreeFormTable(data) {
    for (let i = 0; i < data?.length; i++) {
      let obj = { ...data[i] };
      if (obj?.component?.options?.mode === "FREEFORM") {
        setopenModalFreeFormName(preState => [...preState, obj.component.sName]);
        // setFreeFormTabbleArrays((preState)=> {
        //   alert(JSON.stringify(preState.filter(item=> obj.component.sName != item?.sInputTableName )))
        //   return preState.filter(item=> obj.component.sName != item?.sInputTableName )
        // })

        // for (let j = 0; j < freeFormTabbleArrays.length; j++) {
        //   if (obj.component.sName != freeFormTabbleArrays[i]?.sInputTableName) {
        //    alert(obj.component.sName)
        //  }
        // }
      }
    }
  }
  const [company, setCompany] = useState({});
  const [user, setUser] = useState({});
  const [format, setFormat] = useState([]);

  function fetchFormaData() {
    setdocumentSelectTableData([]);
    setdocumentSelectmappingData({});
    setFormData("");
    setisPageLoading(true);
    setResultData("");
    const urlCapture = baseURL + window.location.pathname + window.location.search;
    const result = parseURL(urlCapture);
    axios
      .get(
        result.searchQuery.startsWith("&doc")
          ? result.pathname + result.searchQuery
          : result.pathname,
        {
          headers: {
            Authorization: `Bearer ${token}`
            // Other headers if needed
          }
        }
      )
      .then(result => {
        setFormData(result?.data?.data ? result?.data?.data : result?.data);
        setmainFormData(result?.data?.data ? result?.data?.data : result?.data);
        setisPageLoading(false);
      })
      .catch(error => {
        if (error?.response.status == "400") {
          setIsAlertPopup({ open: true, msg: error?.response?.data?.metadata.msg });
          navigate(-1);
        }
      });
  }

  useEffect(() => {
    setdocumentSelectTableData([]);
    setdocumentSelectmappingData({});

    // setdebitCreditTableMode(null);
    return () => {
      setformIsSubmited(false);
      setdocumentSelectTableData([]);
      setFreeFromTableRowDataStore([]);
      setdocumentSelectmappingData({});
      setTextValue({});
      setdefaultTableSummaryFeild("");
      setdefaultTableSummaryFeild({});
      setVarValue({});
      setdebitCreditTableMode(null);
      setfilterDefault([]);
      setFreeFormTabbleArrays([]);
      setdebitCreditTableData([]);
      setMultiRecordForBackend([]);
      setmultirecordValidateFunction(false);
      setmultirecordExist(false);
      setfreeFormValidateFunction(false);
      setdefaultTableValidateFunction(false);
      setdebitCreditValidateFunction(false);
      setIsDisabledTable(false);
      setFreeFormTabbleEditArrays([]);
      setImagesIdsFromMedia([]);
      setFreeFormTabbleArrays([]);
      setfilterfreeForm(undefined);
      setEditFormFiles([]);
    };
  }, [route, urlCapture]);

  useEffect(() => setFetchMainApi(() => () => fetchFormaData()), []);

  useEffect(() => {
    const desiredObject = formData?.details?.find(obj => {
      if (obj.component.sPrimaryKey) {
        return obj.component;
      }
    });
    // setModalPrimaryKry(textValue[desiredObject?.component?.sPrimaryKey]);
  }, [textValue]);
  //
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const getFieldValue = sName => {
    const [orgKey, fieldName] = sName?.split(".") ?? [];
    switch (orgKey) {
      case "organization":
        return company?.data?.[fieldName];
      case "user":
        return user?.data?.[fieldName];
      case "format":
        return format?.data?.[fieldName];
      default:
        return undefined;
    }
  };

  //  working
  const [bodycontent, setBodycontent] = useState([]);

  useEffect(() => {
    axios
      .get(`${serverAddress}/record/get/all/sys_formatting`, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      })
      .then(formatResponse => {
        setFormat(formatResponse.data);
      })
      .catch(() => {
        // setGlobalError(error);
      });

    axios
      .get(`${serverAddress}/globalvariables/all`, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      })
      .then(response => {
        localStorage.setItem("globalvariables", JSON.stringify(response.data.data.globalvariables));

        setglobalvariables(response.data.data.globalvariables);
      })
      .catch(() => {
        // setGlobalError(error);
      });
  }, [formData, route, urlCapture]);
  // edit table form.sFormSource

  let url;

  if (location?.state) {
    url = formData?.form?.sFormSource + location?.state?.id;
  } else {
    // alert(JSON.stringify(window.location.search))
    const searchParams = new URLSearchParams(window.location.search);
    // const searchParams = new URLSearchParams(overlaySplit?overLayDataFetchApi.split("/form/get/coaView")[1]: location.search);
    // alert(overLayDataFetchApi.split("/form/get/coaView")[1])
    let id = searchParams.get("id");
    let next = searchParams.get("next");
    let pre = searchParams.get("pre");
    // alert(id)
    const idPart = window.location.href.split("?id=")[1] || window.location.href.split("id=")[1];
    if (!pre && !next) {
      if (idPart) {
        id = idPart;
      }
    }

    if (formData?.form?.sFormSource.endsWith("/")) {
      if (id) {
        url = formData?.form?.sFormSource + id;
      } else {
        url = formData?.form?.sFormSource;
      }
    } else {
      url = formData?.form?.sFormSource + "/" + id;
    }
  }

  function convertNumericToString(obj) {
    for (let key in obj) {
      if (typeof obj[key] === "number") {
        obj[key] = obj[key].toString();
      }
    }
    return obj;
  }

  const urlObj = new URL(baseURL + varCutomDialogApi);

  // Use URLSearchParams to get the 'id' parameter
  const id3 = urlObj.searchParams.get('id');

  let dialogURI = ` ${baseURL}${ varCustomDialogData?.form?.sFormSource}${id3}`
  useEffect(() => {
    // alert(JSON.stringify(isDialogDrawerOpen))
    if (
      (url !== undefined &&  formData?.form?.sFormAction === "EDIT") ||
      formData?.form?.sFormAction === "VIEW" ||
      formData?.form?.sFormType === "VIEW" ||
      formData?.form?.sFormType === "EDIT" || isDialogDrawerOpen
    ) {
      // alert(JSON.stringify(baseURL + varCutomDialogApi))
      axios
        .get(isDialogDrawerOpen? dialogURI:`${baseURL}${url}`, {
          // .get(`${baseURL}${url}`, {
          headers: {
            Authorization: `Bearer ${token}`
            // Other headers if needed
          }
        })
        .then(response => {
          const data = response?.data?.data?.mainrecord || response?.data?.data?.records?.[0]|| {};
          setFreeFormTabbleEditArrays(response?.data?.data?.tablerecords);
          setFreeFormTabbleEditMainrecord(response?.data?.data?.mainrecord);
          
          const initialValues = {};

          for (const key in data) {
            initialValues[key] = data[key];
          }

          setEditFormFiles(response?.data?.data?.files);
          setVarValue(convertNumericToString(data)||{});
          setRecordData(response.data);
          setBodycontent(response?.data?.data[1]?.imagerecords);
        })
        .catch(() => {
          setGlobalError(error);
        });
    } else {
      // setTextValue({});
      SettingInitialValues();
      setBodycontent([]);
      sethandleModalclick(false);
    }
  }, [url, formData, location?.state?.id,isDialogDrawerOpen]);

  function findMatchingFields(dialogform, modalEditData) {
    const matchingFields = {};

    for (const key in dialogform) {
      if (modalEditData?.hasOwnProperty(key)) {
        // matchingFields[key] = dialogform[key] !== '' ? dialogform[key]:modalEditData[key];
        matchingFields[key] = modalEditData[key] == null ? "" : modalEditData[key];
      } else {
        matchingFields[key] = dialogform[key];
      }
    }
    return matchingFields;
  }

  function copyMatchingValues(backendObj, frontendObj) {
    const result = {};
    if(backendObj.hasOwnProperty("sAccountTo") && formData.form.sFormAction === "EDIT"){
      frontendObj["sAccountTo"] = "";
    }
    for (const key in frontendObj) {
      if (backendObj.hasOwnProperty(key)) {
        result[key] = backendObj[key];
      } else {
        result[key] = frontendObj[key];
      }
    }
    return result;
  }
  
  const dateformat = (date, sourceFormat = "YYYY-MM-DD", returnFormat) => {
    if (date) {
      const parseDate = (date, format) => {
        const parts = date?.split('-');
        const formatParts = format.toLowerCase().split('-');
        const dateObj = {};
  
        formatParts.forEach((part, index) => {
          dateObj[part] = parseInt(parts[index], 10);
        });
  
        return new Date(dateObj.yyyy, dateObj.mm - 1, dateObj.dd);
      };
  
      const formatDate = (dateObj, format) => {
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const yyyy = dateObj.getFullYear();
  
        switch (format) {
          case 'dd-mm-yyyy':
            return `${dd}-${mm}-${yyyy}`;
          case 'yyyy-dd-mm':
            return `${yyyy}-${dd}-${mm}`;
          case 'yyyy-mm-dd':
            return `${yyyy}-${mm}-${dd}`;
          case 'mm-dd-yyyy':
            return `${mm}-${dd}-${yyyy}`;
          default:
            return '';
        }
      };
  
      // Convert sourceFormat and returnFormat to lowercase
      const parsedDate = parseDate(date, sourceFormat.toLowerCase());
  
      if (isNaN(parsedDate)) {
        return '';
      }
      // alert(formatDate(parsedDate, returnFormat?.toLowerCase()))
      return formatDate(parsedDate, returnFormat?.toLowerCase());
    } else {
      return '';
    }
  };
  
  
//   const dateformat = (date, dateFormat) => {
//     const d = new Date(date);
    
//     // Check for an invalid date

//     if (isNaN(d)) {
//       return "Invalid date";
//     }


//     const dd = d.getDate().toString().padStart(2, "0");
//     const mm = (d.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
//     const yyyy = d.getFullYear();

//     let month = ("0" + (d.getMonth() + 1)).slice(-2); // getMonth() returns month index from 0 to 11
// let day = ("0" + d.getDate()).slice(-2);
// let year = d.getFullYear();
  
//     switch (dateFormat) {
//       case "DD-MM-YYYY":
//         return `${dd}-${mm}-${yyyy}`;
//       case "YYYY-DD-MM":
//         return `${yyyy}-${dd}-${mm}`;
//       case "YYYY-MM-DD":
//         return `${yyyy}-${mm}-${dd}`;
//       case "MM-DD-YYYY":
//         return `${month}-${day}-${year}`;
//       default:
//         return "Invalid date format pattern";
//     }
//   };


  // function getOpenDialogType(){
  // let type = '';

  // for (let i = 0; i < formData?.details?.length; i++) {
  //   const element = formData?.details?.[i]

  //   if (element..component.sFormAction) {

  //   }
  // }

  // }

  function createDiaLogForm(maindata, dialogform, dialogformvalidate) {
    maindata?.forEach((data) => {
      switch (data?.component?.sType) {
        case "TEXTFIELD":
        case "COUNTER":
        case "AUTOCOMPLETE":
        case "PASSWORDTEXTFIELD":
        case "FIXVALUE":
        case "CHECKBOX":
        case "TRANSFERLIST":
        case "VARTEXT":
        case "VARNUMBER":
        case "IMG":
        case "VARCONCAT":
        case "SELECT":
        case "NUMBER":
        case "VARSELECT":
        case "IMAGE":
        case "INPUT":
          dialogform[data?.component?.sName] =
            data?.component?.sDefaultValue !== "" ? data?.component?.sDefaultValue : "";
          dialogformvalidate[data?.component?.sName] = data?.validation;
          break;
        case "BOX":
          createDiaLogForm(data?.child, dialogform, dialogformvalidate)
          break;
        case "SECTION":
          createDiaLogForm(data?.child, dialogform, dialogformvalidate)
          break;
        case "DATETIME":
          dialogform[data?.component?.sName] =
            data?.component?.sDefaultValue !== ""
              ? dateformat(data?.component?.sDefaultValue,data?.component?.sSourceFormat, data?.component?.sSendFormat)
              : "";
              
          dialogformvalidate[data?.component?.sName] = data?.validation;
          break;
        case "RADIOGROUP":
          dialogform[data?.component?.sName] = data?.component?.sProps?.defaultValue
            ? data?.component?.sProps?.defaultValue
            : " ";
  
          //   dialogform[data?.component?.sName] =
          //   data?.component?.sDefaultValue !== "" ? data?.component?.sDefaultValue : "";
          dialogformvalidate[data?.component?.sName] = data?.validation;
          break;
        default:
          break;
      }
    });
  }

  useEffect(() => {
    if(conversionNamesMapping){
      const conversions = Object.values(conversionNamesMapping);
      if(conversions && conversions.length > 0){
        const conversionObj = {};
        conversions.forEach((value) => conversionObj[value] = 1);
        setbPayloads((prev) => ({
          ...prev, ...conversionObj
        }))
      }
    }
  }, [conversionNamesMapping]);

  useEffect(() => {
    const taxtvaluecols = {};
    const validate = {};
    let dialogform = {};
    const dialogformvalidate = {};
    /* eslint-disable no-fallthrough */
    formData?.details?.forEach(data => {
      if (handleModalclick) {
        if (data?.component?.sType === "DIALOG") {
          if (
            data?.component.sFormAction === "ADD" ||
            data?.component.sFormAction === "" ||
            data?.component.sFormAction === "EDIT"
          ) {
            setbPayloadsDailog(predata => {
              if (!isOpenModalChildData) {
                setbPayloadsDailogOld(predata);
              }
              return payloadData(openModalChildData);
            });

            createDiaLogForm(openModalChildData, dialogform, dialogformvalidate);
            // openModalChildData.forEach(data => {
            //   switch (data?.component?.sType) {
            //     case "TEXTFIELD":
            //     case "COUNTER":
            //     case "AUTOCOMPLETE":
            //     case "PASSWORDTEXTFIELD":
            //     case "FIXVALUE":
            //     case "CHECKBOX":
            //     case "TRANSFERLIST":
            //     case "VARTEXT":
            //     case "VARNUMBER":
            //     case "IMG":
            //     case "VARCONCAT":

            //     case "SELECT":
            //     case "NUMBER":
            //     case "VARSELECT":
            //     case "IMAGE": {
            //       /* rfg 9 may 23*/
            //     }
            //     case "INPUT":
            //       dialogform[data?.component?.sName] =
            //         data?.component?.sDefaultValue !== "" ? data?.component?.sDefaultValue : "";
            //       dialogformvalidate[data?.component?.sName] = data?.validation;
            //       break;
            //     // break;
            //     case "DATETIME":
            //       dialogform[data?.component?.sName] =
            //         data?.component?.sDefaultValue !== ""
            //           ? dateformat(data?.component?.sDefaultValue,data?.component?.sSourceFormat, data?.component?.sSendFormat)
            //           : "";
                      
            //       dialogformvalidate[data?.component?.sName] = data?.validation;
            //       break;
            //     case "RADIOGROUP":
            //       dialogform[data?.component?.sName] = data?.component?.sProps?.defaultValue
            //         ? data?.component?.sProps?.defaultValue
            //         : " ";

            //       //   dialogform[data?.component?.sName] =
            //       //   data?.component?.sDefaultValue !== "" ? data?.component?.sDefaultValue : "";
            //       dialogformvalidate[data?.component?.sName] = data?.validation;
            //       break;
            //     default:
            //       break;
            //   }
            // });
          }
        }
      } else {
        switch (data?.component?.sType) {
          case "TEXTFIELD":
          case "PASSWORDTEXTFIELD":
          case "FIXVALUE":
          case "AUTOCOMPLETE":
          case "CHECKBOX":
          case "TRANSFERLIST":
          case "COUNTER":
          case "RADIOGROUP":
          case "VARSELECT":
          case "SELECT":
          case "VARCONCAT":
          case "VARTEXT":
          case "VARNUMBER":
          case "IMG":
          case "DATAGRID":
            if (data?.component?.sType === "CHECKBOX") {
              taxtvaluecols[data?.component?.sName] = data?.component?.sDefaultValue
                ? data?.component?.sDefaultValue
                : "";
            } else if (
              (data?.component?.sType === "TEXTFIELD" && data?.validation?.sType === "COUNTER") ||
              data?.validation?.sType === "FIXVALUE"
            ) {
              taxtvaluecols[data?.component?.sName] = data?.component?.sDefaultValue
                ? data?.component?.sDefaultValue
                : " ";
            } else if (
              data?.component?.sType === "RADIOGROUP" &&
              data?.component?.sProps?.defaultValue
            ) {
              taxtvaluecols[data?.component?.sName] = data?.component?.sProps?.defaultValue
                ? data?.component?.sProps?.defaultValue
                : " ";
            } else {
              taxtvaluecols[data?.component?.sName] = data?.component?.sDefaultValue
                ? data?.component?.sDefaultValue
                : "";
              validate[data?.component?.sName] = data?.validation;
            }
            break;
          case "INPUT":
            taxtvaluecols[data?.component?.sName] =
              data?.component?.sDefaultValue !== "" ? data?.component?.sDefaultValue : "";
            validate[data?.component?.sName] = data?.validation;
            break;
          case "DATETIME":
            taxtvaluecols[data?.component.sName] =
              dateformat(data?.component?.sDefaultValue,data?.component?.sSourceFormat, data?.component?.sSendFormat) || "";
            break;
          case "NUMBER":
            taxtvaluecols[data?.component?.sName] = data?.component?.sDefaultValue
              ? parseFloat(data?.component?.sDefaultValue)
              : " ";
            break;
          default:
            break;
        }
      }
    });

    function validationData(data) {
      const validation = {};
      data?.forEach(elm => {
        if (elm.validation) {
          validation[elm.component.sName] = elm.validation;
        }
        if (elm.child) {
          Object.assign(validation, validationData(elm.child));
        }
      });
      return validation;
    }

    function payloadData(data) {
      const payload = {};
      data?.forEach(elm => {
        if (elm?.data?.bPayload || elm?.data?.bPayload == 0) {
          payload[elm.component.sName] = elm?.data?.bPayload;
        }
        if (elm?.inputType?.data?.bPayload || elm?.inputType?.data?.bPayload == 0) {
          payload[elm?.inputType?.component?.sName] = elm?.inputType?.data?.bPayload;
        }
        if (elm.child) {
          // alert(JSON.stringify(elm.component.sType));
          if (elm.component.sType != "DIALOG") {
            Object.assign(payload, payloadData(elm.child));
          }
        }
        if (elm.fixcolumns) {
          // alert(JSON.stringify(elm.component.sType));
          if (elm.component.sType != "DIALOG") {
            Object.assign(payload, payloadData(elm.fixcolumns));
          }
        }
      });
      if(conversionNamesMapping){
        const conversions = Object.values(conversionNamesMapping);
        if(conversions && conversions.length > 0){
          conversions.forEach((value) => payload[value] = 1);
        }
      }
      return payload;
    }
    setbPayloads(payloadData(formData?.details));

    // console.log('TextField2',validationData( formData?.details));

    /* eslint-enable no-fallthrough */
    if (handleModalclick) {
      // alert(JSON.stringify(textValue))
      setValidationRules(dialogformvalidate);
      setformMetata(dialogform);

      if (modalActionTypeAndID.type !== "delete") {
        // alert
        // aler
        const matchingFields = findMatchingFields(dialogform, modalEditData);
        // if (!isOpenModalChildData) {
        // }
        setTextValue({...textValue, ...matchingFields});

        // alert(JSON.stringify( data?.component.sFormAction));
      } else {
        setTextValue(dialogform);
      }
    } else {
      // alert("eee");
      setValidationRules(validationData(formData?.details));

      // setTextValue(taxtvaluecols);
    }
  }, [formData, openModalChildData, urlCapture, isSubmited, modalEditData, handleModalclick]);

  const [summerydata, setSummerydata] = useState();

  useEffect(() => {
    const summaryObj = summaryfields || {};
    const summaryArr = Object.entries(summaryObj)?.map(([key, value]) => {
      if (key === "summ_handling") {
        return {
          sSummaryID: key,
          sInputValue: value,
          sValue: summaryObj?.handlettotal?.summ_handleTotal
        };
      } else if (key === "summ_shipping") {
        return {
          sSummaryID: key,
          sInputValue: value,
          sValue: summaryObj?.handlettotal?.summ_shipTotal
        };
      } else if (key === "disc_type") {
        return {
          sSummaryID: key,
          sInputValue: value,
          sValue: summaryObj?.handlettotal?.disc_type
        };
      } else if (key === "summ_discount") {
        return {
          sSummaryID: key,
          sInputValue: value,
          sValue: summaryObj?.handlettotal?.summ_discountTotal
        };
      } else if (key === "summ_adjustment") {
        return {
          sSummaryID: key,
          sInputValue: value,
          sValue: summaryObj?.handlettotal?.summ_adjustmentTotal
        };
      } else if (key === "summ_tax") {
        return {
          sSummaryID: key,
          sInputValue: value,
          sValue: summaryObj?.handlettotal?.summ_taxTotal
        };
      } else {
        return {
          sSummaryID: key,
          sInputValue: value,
          sValue: ""
        };
      }
    });

    // console.log(summaryArr, "summaryArr");
    // console.log(tableMianData, "tableMianData");
    const resultArr = [];
    tableMianData?.length > 0 &&
      tableMianData?.map((tableObj, index) => {
        summaryArr?.map((summaryObj, ind) => {
          if (tableObj.sSummaryID === summaryObj.sSummaryID) {
            if (summaryObj?.sValue) {
              if (
                tableObj?.sFieldInput === "TEXTFIELD" ||
                tableObj?.sFieldInput === "SELECT" ||
                tableObj?.sField === "NUMBER" ||
                tableObj?.sField === "VARSELECT"
              ) {
                resultArr.push({
                  sSummaryID: tableObj.sSummaryID,
                  sInputValue: summaryObj.sInputValue,
                  sValue: summaryObj?.sValue
                });
              } else {
                resultArr.push({
                  sSummaryID: tableObj.sSummaryID,
                  sInputValue: "",
                  sValue: summaryObj.sInputValue
                });
              }
            } else {
              if (tableObj?.sFieldInput === "TEXTFIELD" || tableObj?.sFieldInput === "SELECT") {
                resultArr.push({
                  sSummaryID: tableObj.sSummaryID,
                  sInputValue: summaryObj.sInputValue,
                  sValue: ""
                });
              } else {
                resultArr.push({
                  sSummaryID: tableObj.sSummaryID,
                  sInputValue: "",
                  sValue: summaryObj.sInputValue
                });
              }
              // resultArr.push({
              //   sSummaryID: tableObj.sSummaryID,
              //   sInputValue: summaryObj.sInputValue,
              // });
            }
          }
        });
      });

    let value = [];
    resultArr?.map(item => {
      value.push(item);
    });

    value.push({
      sSummaryID: "disc_type",
      sInputValue: summaryObj.disc_type
    });

    setSummerydata(value);
  }, [summaryfields, urlCapture, isSubmited]);

  // eslint-disable-next-line
  const handleCancel = (destination, nextaction) => {
    navigate(destination);
  };
  // eslint-disable-next-line
  const handleNext = (destination, nextaction) => {
    navigate(nextaction);
  };

  function hasInputTable(data) {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        if (hasInputTable(data[i])) {
          return true;
        }
      }
    } else if (typeof data === "object" && data !== null) {
      if (data.hasOwnProperty("sType") && data.sType === "INPUTTABLE") {
        return true;
      } else {
        // Recursively check nested objects
        for (const key in data) {
          if (hasInputTable(data[key])) {
            return true;
          }
        }
      }
    }
    return false;
  }

  useEffect(() => {
    // Example usage with an 8-level nested array
    const nestedArray = formData; /* Your 8-level nested array here */
    const hasInputTableResult = hasInputTable(nestedArray);
    if (hasInputTableResult) {
      setIsTable(hasInputTableResult);
    }

    // alert(JSON.stringify(formData && formData?.details))
    [formData]?.map(item => {
      item &&
        item?.details?.map(data => {
          // alert(JSON.stringify( item?.details))
          switch (data?.component?.sType) {
            case "TEXTFIELD":
              // Do something for TEXTFIELD
              break;
            case "COUNTER":
              // Do something for TEXTFIELD
              break;
            case "AUTOCOMPLETE":
              // Do something for AUTOCOMPLETE
              break;
            case "CHECKBOX":
              // Do something for CHECKBOXTEXTFIELD
              break;
            case "PASSWORDTEXTFIELD":
              // Do something for CHECKBOXTEXTFIELD
              break;
            case "FIXVALUE":
              // Do something for CHECKBOXTEXTFIELD
              break;
            case "RADIOGROUP":
              // Do something for RADIOGROUP
              break;
            case "SELECT":
              // Do something for SELECT
              break;
            case "NUMBER":
              // Do something for NUMBER
              break;
            case "VARSELECT":
              // Do something for NUMBER
              break;
            case "DATETIME":
              // Do something for DATETIME
              break;
            case "INPUTTABLE":
              if (data?.component?.options.mode === "DEFAULT") {
                setDefaultTableMode(data?.component?.options.mode);
                setDefaultTableName(data?.component.sName);
              }
              if (data?.component?.options.mode === "FREEFORM") {
                setFreeformTableMode(data?.component?.options.mode);
                setFreeformTableName(data?.component.sName);
              }
              if (data?.component?.options.mode === "DEBITCREDIT") {
                setdebitCreditTableMode(data?.component?.options.mode);
                setdebitCreditTableName(data?.component.sName);
                // console.log(data?.component?.options.mode,'data?.component?.options.mode');
              }
              // else {
              //   setdebitCreditTableMode(data?.component?.options.mode || "");
              //   setdebitCreditTableName(data?.component.sName || " ");
              // }

              break;
            // default:
            // Do something for unknown sType values
            // break;
          }
        });
    });
  }, [formData, isSubmited, urlCapture]);

  useEffect(() => {
    if (tablesampledata) {
      const tabledata = tablesampledata;
      const filterDefaultData = tabledata?.map(({ ...rest }) => rest);
      setfilterDefault(filterDefaultData);
    }
    if (freeformdata) {
      const tablefreeform = freeformdata;
      const filterFreeformData = tablefreeform?.map(({ ...rest }) => rest);
      setfilterfreeForm(filterFreeformData);
    }
  }, [tablesampledata, freeformdata]);

  function removeObjectsWithZeroColRate(data) {
    if (data) {
      return data?.filter(item => item.col_rate !== "0.00" && item.col_item);
    }
  }

  function validateData(data) {
    // Check each object in the array
    for (const item of data) {
      // Convert col_credit and col_debit to numbers for strict comparison
      const credit = parseFloat(item.col_credit);
      const debit = parseFloat(item.col_debit);

      // console.log(credit,debit,777777788);
      if (isNaN(credit) || isNaN(debit)) {
        return false;
      }
      // Check if both col_credit and col_debit are "0.00"
      if (credit === 0 && debit === 0) {
        return false; // Return false if condition is met
      }
    }

    // If no object with both col_credit and col_debit as "0.00" is found, return true
    return true;
  }

  function filterNonEmptyFields(dataArray) {
    return dataArray.map(table => {
      table.tabledetails = table?.tabledetails?.filter(detail => {
        for (const key in detail) {
          // Exclude bPrimary from the check
          if (
            key !== "bPrimary" &&
            key !== "id" &&
            key !== "bShippingPrimary" &&
            detail[key] !== ""
          ) {
            return true;
          }
        }
        return false;
      });
      return table;
    });
  }
  function removeBlankRow(data) {
    let val = data?.filter(obj => {
      // Condition 1: Remove object if all fields are empty ("") or 0
      if (
        Object.keys(obj)
          .filter(key => key !== "id")
          .every(key => obj[key] === "" || obj[key] === "0")
      ) {
        return false;
      }

      // Condition 2: Keep object if any field is not empty ("") and not 0
      if (Object.values(obj).some(value => value !== "" && value !== "0")) {
        return true;
      }
      // Condition 3: Keep object if all fields are empty ("") but any field is not 0
      if (
        Object.keys(obj)
          .filter(key => key !== "id")
          .every(key => obj[key] === "")
      ) {
        return Object.values(obj).some(value => value !== "0");
      }
      return true; // Keep object for other cases
    });
    return val;
  }
  function filterFields(payload, data2) {
    const filteredData = {};
    for (const key in payload) {
      if (payload[key] == 1) {
        filteredData[key] = data2[key];
      }
      if(key == "sAccountTo" && payload[key] == 1 && !data2[key]){
        filteredData[key] = "";
      }
    }
    return filteredData;
  }
  function filterFieldsWithPayload(data, payload) {
    if (data) {
      const filteredData = JSON.parse(JSON.stringify(data));
      filteredData.forEach(obj => {
        Object.keys(obj).forEach(key => {
          // (key === "sUnitConversion" && payload["dQuantity"] == "1") || (key === "sExpectedUnitConversion" && payload["dExpectedQuantity"] == "1") || 
          if(key === "sAction"){
            // Do Nothing
          } else if ((!payload[key] || payload[key] != "1") && key != "id") {
            delete obj[key];
          }
        });
      });
      return filteredData;
    }
  }
  // alert(JSON.stringify(freeFormTabbleArrays))
  const handleSubmit = (destination, nextaction) => {
    const metadata =
      formData && formData.form
        ? {
            sFormName: formData.form.id ? formData.form.id : formData.form.sFormName || "",
            sFormAction: formData.form.sFormAction || "",
            sPrimaryKey: formData.form.sPrimaryKey || "",
            sPrimaryTable: formData.form.sPrimaryTable || "",
            sFormType: formData.form.sFormType || "",
            sPrimaryKeyValue: textValue[formData.form.sPrimaryKey]
          }
        : {};

    const dataWithoutIds = multiRecordForBackend.map(item => {
      // Create a copy of each item to avoid modifying the original array
      const newItem = { ...item };
      // Remove the "id" property from each item
      delete newItem.id;
      return newItem;
    });

    let data = {
      metadata: metadata,
      data: {}
    };
    if (dataWithoutIds.length == 0) {
      data.data.mainrecord = { ...filterFields(bPayloads, textValue) };
      // alert(JSON.stringify(bPayloads))
    }
    if (dataWithoutIds.length > 0) {
      data.data.multirecord = filterFieldsWithPayload(dataWithoutIds, bPayloads);
    }

    if (filesForBackend.length > 0) {
      data.data.files = filesForBackend;
    }
    // console.log(defaultTableMode, freeformTableMode, 9999);
    // alert(defaultTableMode)
    if (filterDefault && filterDefault?.length > 0) {
      filterDefault.forEach((row, index) => row.id = index + 1);
      if (!data.data.tablerecords) {
        data.data.tablerecords = [];
      }
      data.data.mainrecord = { ...filterFields(bPayloads, textValue), ...defaultTableSummaryFeild };
      // alert(JSON.stringify(bPayloads));
      // console.log("sInputTableName",defaultTableNameAndModel.sName);
      // console.log("sInputTableMode",defaultTableNameAndModel.options.mode);
      data.data.tablerecords.push({
        sInputTableName: defaultTableNameAndModel.sName || defaultTableName,
        sInputTableMode: defaultTableNameAndModel?.options?.mode || defaultTableMode,
        tablesummary: defaultTableSummaryData,
        tabledetails: filterFieldsWithPayload(filterDefault, bPayloads)
      });
    }
    // UPDATED - BITS Enterprise.js
    // try {
    //   const sourceLocation = data?.data?.mainrecord?.sSourceLocationCode;
    //   const toLocation = data?.data?.mainrecord?.sToLocationCode;
    //   const docType = data?.data?.mainrecord?.sDocType;
    //   console.log("jwkebnfjqbwkjefbkjqew", sourceLocation, toLocation, docType, data);
    //   /*eslint-disable no-undef*/
    //   const result = InventoryTransferValidate(sourceLocation, toLocation, docType);
    //   if(result){
    //     toast.error(result);
    //     return;
    //   }
    // } catch (error) {
    //   console.error("Error in InventoryTransferValidate:", error);
    // }

    // try {
    //   const fromAccount = data?.data?.mainrecord?.sFromAccount;
    //   const toAccount = data?.data?.mainrecord?.sToAccount;
    //   const amount = Number(data?.data?.mainrecord?.dAmount.toString().replaceAll(",", ""));
    //   const balanceAmount = textValue?.balanceAmount;
    //   const docType = data?.data?.mainrecord?.sDocType;

    //   /*eslint-disable no-undef*/
    //   const result = InterbankTransferValidate(fromAccount, toAccount, amount, balanceAmount, docType);
    //   if(result){
    //     toast.error(result);
    //     return;
    //   }
    // } catch (error) {
    //   console.error("Error in InterbankTransferValidate:", error);
    // }

    if (
      debitCreditTableMode === "DEBITCREDIT" &&
      filterFieldsWithPayload(debitCreditTableData, bPayloads).length > 0
    ) {
      //totalDebit,totalCredit

      if (debitCreditTotalBalanced) {
        toast.error("Debit and credit should equal");
        return;
      }
      if (debitCreditTotal?.totalDebit == 0 || debitCreditTotal?.totalCredit == 0) {
        toast.error("Zero total, nothing to save");
        return;
      }

      if (!data.data.tablerecords) {
        data.data.tablerecords = [];
      }
      if (data.data.tablerecords) {
        data.data.tablerecords.push({
          sInputTableName: debitCreditTableName,
          sInputTableMode: debitCreditTableMode,
          tabledetails: filterFieldsWithPayload(debitCreditTableData, bPayloads)
        });
      }
    }
    // alert(JSON.stringify(freeFormTabbleArrays));

    if (freeFormTabbleArrays?.length > 0) {
      if (!data.data.tablerecords) {
        data.data.tablerecords = [];
      }

      //removeBlankRo
      let newData = [];
      for (let i = 0; i < freeFormTabbleArrays.length; i++) {
        const tableName = freeFormTabbleArrays[i];
        // freeFormTabbleArrays.filter ((item=>item?.sInputTableName !== tableName))
        newData = freeFormTabbleArrays.filter(item => item?.sInputTableName !== tableName);
        // alert(JSON.stringify( freeFormTabbleArrays.filter ((item=>item?.sInputTableName !== tableName))));
      }
      // alert(JSON.stringify(openModalFreeFormName))
      const returnData = filterNonEmptyFields(newData);
      returnData.forEach((item, ind) => {
        item.tabledetails = filterFieldsWithPayload(removeBlankRow(item?.tabledetails), bPayloads);
      });
      returnData.map(item => {
        if (item.sInputTableMode === "FREEFORM") {
          return data.data.tablerecords.push(item);
        }
      });
    }

    if(freeFormTabbleArrays?.length > 0 && data?.data?.tablerecords?.[0]?.sInputTableMode == "FREEFORM"){
      data?.data?.tablerecords?.forEach((record) => {
        record.tabledetails.forEach((item, index) => {
          // item["sUnitConversion"] = freeFormDataSubmit?.[index]?.["sUnitConversion"];
          if(!item?.id && freeFormDataSubmit[index]?.["id"]){
            item["id"] = freeFormDataSubmit[index]?.["id"]
          }
          for (const [key, value] of Object.entries(bPayloads)) {
            if(value && freeFormDataSubmit?.[index]?.[key]){
              item[key] = freeFormDataSubmit?.[index]?.[key];
            }
          }
        })
      })
    }

    if (singlefileImg && singlefileImg !== undefined) {
      const formData = new FormData();
      formData.append("file", singlefileImg);
      axios
        .post(`${serverAddress}${imageuploadURL}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
            // Other headers if needed
          }
        })
        .then(response => {
          // Handle successful upload
          SettingInitialValues();
          // console.log("File uploaded successfully:", response.data);
        })
        .catch(() => {
          CustomAlert("error", "Something Went Wrong");
        });
    }
    if (Object.keys(multiplefileImg)?.length > 0) {
      for (let i = 0; i < multiplefileImg?.length; i++) {
        if (multiplefileImg[i] !== undefined) {
          const formData = new FormData();
          formData.append("file", multiplefileImg[i]);

          axios
            .post(`${serverAddress}${imageuploadURL}`, formData, {
              headers: {
                Authorization: `Bearer ${token}`
                // Other headers if needed
              }
            })
            .then(response => {
              // Handle successful upload
              SettingInitialValues();
              // console.log("File uploaded successfully:", response.data);
            })
            .catch(() => {
              CustomAlert("error", "Something Went Wrong");
            });
        }
      }
    }

    // UPDATED - BITS Enterprise.js
    // try {
    //   /*eslint-disable no-undef*/
    //   const result = checkInventoryCheckboxChecked(textValue);
    //   if(result && result.length > 0){
    //     result.forEach((res) => {
    //       if(!res.status) return;
    //       data.data.mainrecord[res.field] = res.value;
    //     })
    //   }
    // } catch (error) {
    //   console.log("BITS Enterprise JS checkInventoryCheckboxChecked", error);
    // }
    // Remove tablerecords property if it exists but is empty
    //   if (data.data[1] && data.data[1].tablerecords?.length === 0) {
    //  //   delete data.data[1].tablerecords;
    //   }
    const uri = baseURL + destination;

    let newUrl = "";
    if (destination.startsWith("/")) {
      newUrl = baseURL + destination;
    } else {
      newUrl = baseURL + "/" + destination;
    }
    if (data?.data?.mainrecord?.dLimit === "") {
      data.data.mainrecord.dLimit = "0.00";
    }

    if (Array.isArray(freeFormTabbleArrays) && freeFormTabbleArrays.length > 0) {
      if (
        data &&
        data.data &&
        Array.isArray(data.data.tablerecords) &&
        data.data.tablerecords.length > 0 &&
        data.data.tablerecords[0].sInputTableMode === "FREEFORM"
      ) {
        if (sectionComponentDataAware && typeof sectionComponentDataAware === 'object') {
          const componentDataAwareKey = Object.keys(sectionComponentDataAware)?.[0];
          if (componentDataAwareKey && textValue[componentDataAwareKey] && textValue[componentDataAwareKey] === "No") {
            for (let record of data.data.tablerecords) {
              if (record.sInputTableName == sectionComponentDataAware[componentDataAwareKey]) {
                record.tabledetails = [];
              }
            }
          }
        }
      }
    }

    axios
      .post(newUrl, data, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      })
      .then(result => {
        if (result.data) {
          if (result.data.metadata.status == "OK") {
            setIssubmited(true);
            CustomAlert("OK", result?.data?.metadata?.msg);
            setOpenDebugSection(true);
            setDebugSectionAPIData((prev) => [...prev, {"type": "form", "api": newUrl, "payload": data, "response": result}])
            navigate(nextaction);
            // setTextValue({});
            setFreeFormToDefault(true);
            setFreeFromTableRowDataStore([]);
            sethandleModalclick(false);
            setBodycontent([]);
            SetTabledata("");
            setError(null);
            setsummaryfields("");
            setFreeformfield("");
            setDefaultTableMode("");
            setDefaultTableName("");
            setFreeformTableMode("");
            setFreeformTableName("");
            setDefaultTableSelectedLocation("")
            setDefaultTableSelectedDataAwareData({})
            setDefaultTableSelectedSupplier("")
            setSingleImg();
            SettingInitialValues();
            setmultiplefileImg({});
            setImgUploadURL("");
            setDialogMode();
            setOpen(false);
            setSectionComponentDataAware();
            setConversionNamesMapping({});
          } else if (result.data.metadata.status == "ERROR") {
            CustomAlert("error", result?.data?.metadata?.msg);
          } else if (result.data.metadata.status == "WARNING") {
            CustomAlert("warning", result?.data?.metadata?.msg);
          } else if (result.data.metadata.status == "INFO") {
            CustomAlert("INFO", result?.data?.metadata?.msg);
          }
        }
      })
      .catch(error => {
        // setGlobalError(error);
        // console.log(error);
        // alert(JSON.stringify(error));
        // alert(JSON.stringify(uri));
        // alert(JSON.stringify(data));
        if (error.response.data.metadata.status == "ERROR") {
          CustomAlert("error", error.response?.data?.metadata?.msg);
        } else if (error.response.data.metadata.status == "WARNING") {
          CustomAlert("warning", error.response?.data?.metadata?.msg);
        } else if (error.response.data.metadata.status == "INFO") {
          CustomAlert("INFO", error.response?.data?.metadata?.msg);
        }
      });
  };

  console.log("jwqgefkvkhew", bPayloads, conversionNamesMapping)

  // console.log(formData?.details, 3344553);
  const handlemodaldata = (destination, nextaction, mode) => {
    const desiredObject = formData?.details?.find(obj => {
      if (obj.component.sPrimaryKey) {
        return obj.component;
      }
    });

    let metadata;

    if (mode?.options?.submode === "dialogformsubmit") {
      metadata = {
        // id: desiredObject?.component?.id,
        sFormAction: openModalDataActive.sFormAction,
        // sFormSource: desiredObject?.component?.sFormSource,
        sFormType: desiredObject?.component?.sFormType ? desiredObject?.component?.sFormType : "",
        sPrimaryKey: openModalDataActive.sPrimaryKey,
        sPrimaryKeyValue: textValue[openModalData.sPrimaryKey],
        sPrimaryTable: desiredObject?.component?.sPrimaryTable,
        sFormName: openModalDataActive.sFormName
      };
    } else {
      metadata = {
        sFormAction: openModalDataActive.sFormAction,
        // sFormSource: desiredObject?.component?.sFormSource,
        sFormType: desiredObject?.component?.sFormType ? desiredObject?.component?.sFormType : "",
        sPrimaryKey: openModalDataActive.sPrimaryKey,
        sPrimaryKeyValue: textValue[openModalData.sPrimaryKey],
        sPrimaryTable: desiredObject?.component?.sPrimaryTable,
        sFormName: openModalDataActive.sFormName
      };
    }

    // const {
    //   sFormType,
    //   sFormAction,
    //   sPrimarykeyvalue,
    //   sFormname,
    //   sPrimarykey,
    //   sPrimaryTable,
    //   ...newItem
    // } = textValue;
    if (textValue.dCreditLimit) {
      textValue.dCreditLimit = textValue.dCreditLimit === "0.00" ? "" : textValue.dCreditLimit;
    }

    let data = {
      metadata: metadata,
      data: {
        mainrecord: filterFields(bPayloadsDailog, textValue)
      }
    };

    const query = Object.keys(textValue)
      ?.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(textValue[key])}`)
      .join("&");

    const uri = `${baseURL}${destination}`;

    if (openModalData.sFormAction === "DELETE" || openModalData.sFormAction === "TXCANCEL") {
      // alert(JSON.stringify(openModalData));
      // alert(JSON.stringify(modalActionTypeAndID?.row));
      let uri;
      if (destination?.endsWith("/")) {
        uri = `${baseURL}${destination}${
          modalActionTypeAndID?.PrimaryKey || modalActionTypeAndID?.row[modalPrimaryKey]
        }`;
      } else {
        uri = `${baseURL}${destination}/${
          modalActionTypeAndID?.PrimaryKey || modalActionTypeAndID?.row[modalPrimaryKey]
        }`;
      }
      if(openModalData.sFormAction === "DELETE"){
        axios
        .delete(uri, {
          headers: {
            Authorization: `Bearer ${token}`
            // Other headers if needed
          }
        })
        .then(result => {
          // alert(JSON.stringify('result'));
          fetchDataHandleDataGrid?.fetchDataHandleDataGrid(fetchDataHandleDataGrid.uri);
          if (result?.data) {
            if (result?.data?.metadata?.status == "OK") {
              setIssubmited(true);
              CustomAlert("OK", result.data.metadata.msg);

              navigate(nextaction);
              // setTextValue({});
              SettingInitialValues();
              sethandleModalclick(false);
              setBodycontent([]);
              SetTabledata("");
              setOverLaySplit(false);
              setError(null);
              setsummaryfields("");
              setFreeformfield("");
              setDefaultTableMode("");
              setDefaultTableName("");
              setFreeformTableMode("");
              setFreeformTableName("");
              setSingleImg();
              setmultiplefileImg({});
              setImgUploadURL("");
              setDialogMode();
              setOpen(false);
              // setResultData("OK");
              return;
            }
            if (result?.data?.metadata?.status == "ERROR") {
              setResultData("ERROR");
              setmessage(result?.data?.metadata.msg);
              CustomAlert("error", result.data.metadata.msg);
              return;
            } else if (result?.data?.metadata.status == "WARNING") {
              setResultData("WARNING");
              setmessage(result?.data?.metadata.msg);
              return;
            } else {
              setResultData("INFO");
              setmessage(result?.metadata?.msg);
            }
          }
        })
        .catch(error => {
          // setGlobalError(error);
          CustomAlert("error", error?.response?.data?.metadata?.msg);
          setResultData("ERROR");
          setmessage(error?.response?.data?.metadata?.msg);
          sethandleModalclick(false);
          setOpen(false);
        });
      } else {
        axios
        .post(uri, null, {
          headers: {
            Authorization: `Bearer ${token}`
            // Other headers if needed
          }
        })
        .then(result => {
          // alert(JSON.stringify('result'));
          fetchDataHandleDataGrid?.fetchDataHandleDataGrid(fetchDataHandleDataGrid.uri);
          if (result?.data) {
            if (result?.data?.metadata?.status == "OK") {
              setIssubmited(true);
              CustomAlert("OK", result.data.metadata.msg);

              navigate(nextaction);
              // setTextValue({});
              SettingInitialValues();
              sethandleModalclick(false);
              setBodycontent([]);
              SetTabledata("");
              setOverLaySplit(false);
              setError(null);
              setsummaryfields("");
              setFreeformfield("");
              setDefaultTableMode("");
              setDefaultTableName("");
              setFreeformTableMode("");
              setFreeformTableName("");
              setSingleImg();
              setmultiplefileImg({});
              setImgUploadURL("");
              setDialogMode();
              setOpen(false);
              // setResultData("OK");
              return;
            }
            if (result?.data?.metadata?.status == "ERROR") {
              setResultData("ERROR");
              setmessage(result?.data?.metadata.msg);
              CustomAlert("error", result.data.metadata.msg);
              return;
            } else if (result?.data?.metadata.status == "WARNING") {
              setResultData("WARNING");
              setmessage(result?.data?.metadata.msg);
              return;
            } else {
              setResultData("INFO");
              setmessage(result?.metadata?.msg);
            }
          }
        })
        .catch(error => {
          // setGlobalError(error);
          CustomAlert("error", error?.response?.data?.metadata?.msg);
          setResultData("ERROR");
          setmessage(error?.response?.data?.metadata?.msg);
          sethandleModalclick(false);
          setOpen(false);
        });
      }
    }

    if (openModalData.sFormAction === "EDIT") {
      let uri;
      if (destination.endsWith("/")) {
        uri = `${baseURL}${destination}`;
      } else {
        uri = `${baseURL}${destination}`;
      }

      axios
        .post(uri, data, {
          headers: {
            Authorization: `Bearer ${token}`
            // Other headers if needed
          }
        })
        .then(result => {
          fetchDataHandleDataGrid?.fetchDataHandleDataGrid(fetchDataHandleDataGrid.uri);
          setResultData("OK");
          setIssubmited(true);
          setmessage(result?.data?.metadata?.msg);

          if (result?.data) {
            if (result?.data?.metadata?.status == "OK") {
              setIssubmited(true);
              // setmessage("Submitted Successfully");
              navigate(nextaction);
              // setTextValue({});
              SettingInitialValues();
              sethandleModalclick(false);
              setBodycontent([]);
              SetTabledata("");
              setError(null);
              setsummaryfields("");
              setFreeformfield("");
              setDefaultTableMode("");
              setDefaultTableName("");
              setFreeformTableMode("");
              setFreeformTableName("");
              setSingleImg();
              setmultiplefileImg({});
              setImgUploadURL("");
              setDialogMode();
              setOpen(false);
            }
            if (result?.data?.metadata?.status == "ERROR") {
              setResultData("ERROR");
              setmessage(result?.data?.metadata.msg);
            } else if (result?.data?.metadata.status == "WARNING") {
              setResultData("WARNING");
              setmessage(result?.data?.metadata.msg);
            } else if (result?.data?.metadata.status == "INFO") {
              setResultData("INFO");
              setmessage(result?.metadata?.msg);
            }
          }
        })
        .catch(error => {
          // setGlobalError(error);
          setResultData("ERROR");
          setmessage(error?.response?.data?.metadata?.msg);
          sethandleModalclick(false);
          setOpen(false);
        });
    }
    if (openModalData.sFormAction === "ADD") {
      const uri = `${baseURL}${destination}`;

      axios
        .post(uri, data, {
          headers: {
            Authorization: `Bearer ${token}`
            // Other headers if needed
          }
        })
        .then(result => {
          fetchDataHandleDataGrid?.fetchDataHandleDataGrid(fetchDataHandleDataGrid.uri);
          if (result?.data) {
            if (result?.data?.metadata?.status == "OK") {
              setResultData("OK");
              CustomAlert("OK", result.data.metadata.msg);
              setIssubmited(true);
              // setmessage("Submitted Successfully");
              navigate(nextaction);
              // setTextValue({});
              SettingInitialValues();
              sethandleModalclick(false);
              setBodycontent([]);
              SetTabledata("");
              setError(null);
              setsummaryfields("");
              setFreeformfield("");
              setDefaultTableMode("");
              setDefaultTableName("");
              setFreeformTableMode("");
              setFreeformTableName("");
              setSingleImg();
              setmultiplefileImg({});
              setImgUploadURL("");
              setDialogMode();
              setOpen(false);
            }
            if (result?.data?.metadata?.status == "ERROR") {
              setResultData("ERROR");
              setmessage(result?.data?.metadata.msg);
            } else if (result?.data?.metadata.status == "WARNING") {
              setResultData("WARNING");
              setmessage(result?.data?.metadata.msg);
            } else if (result?.data?.metadata.status == "INFO") {
              setResultData("INFO");
              setmessage(result?.metadata?.msg);
            }
          }
        })
        .catch(error => {
          // setGlobalError(error);
          setResultData("ERROR");
          setmessage(error?.response?.data?.metadata?.msg);
          sethandleModalclick(false);
          setOpen(false);
        });
    }
  };

  // useEffect(() => {
  //   if (!open) {
  //     // setOpenModalChildData([]);
  //   }
  // }, [open]);

  function getTableName(data) {
    const tableData = {};
    if (data) {
      for (let i = 0; i < data?.length; i++) {
        if (
          data[i]?.component?.sType == "INPUTTABLE" ||
          data[i]?.component?.sType == "MULTIRECORD"
        ) {
          tableData[data[i].component.sName] = data[i].component;
        }
      }
    }
    return tableData;
  }

  function replaceURIParams(data, uri) {
    // Regular expression to match placeholders like {S6-SELECT-004}
    const placeholderRegex = /{([^}]+)}/g;

    // Replace each placeholder in the URI
    const replacedURI = uri.replace(placeholderRegex, (match, placeholder) => {
      // Remove any leading and trailing whitespaces from the placeholder
      placeholder = placeholder.trim();

      // Check if the placeholder exists in the data object
      if (data.hasOwnProperty(placeholder)) {
        // If the placeholder exists, return its corresponding value
        return data[placeholder];
      } else {
        // If the placeholder doesn't exist, return the original placeholder
        return match;
      }
    });

    return replacedURI;
  }
  function checkMultirecorInModal(data) {
    let result = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i]?.component?.sType == "MULTIRECORD") {
        result = true;
      }
    }
    return result;
  }
  // this is for button event handling
  const handleclickdata = (e, mode, uri, data) => {
    // this is for modal cancel
    if (mode?.options?.handler == "handleCancel") {
      setDefaultTableSelectedLocation("");
      setDefaultTableSelectedSupplier("");
      handleCancel(uri?.sAction);
      handleClose();

      return;
    }
    if (mode?.options?.handler == "handleSubmit") {
      // this is for main form submit
      setDefaultTableSelectedLocation("");
      setDefaultTableSelectedSupplier("");
      if (mode?.options.action == "CANCEL") {
        navigate(uri?.sAction);
        return;
      }
      // alert(JSON.stringify(allowZeroValue))

      const errors = globalvalidateTextField(textValue, validaterules);

      // alert(JSON.stringify(errors));
      // alert(JSON.stringify(textValue));
      // alert(JSON.stringify(validaterules));

      // alert(JSON.stringify(textValue));
      // alert(JSON.stringify(errors));
      if (Object.keys(errors)?.length > 0) {
        setError(prevError => ({
          ...prevError,
          ...errors
        }));
        return;
      }

      const freeformErr = freeFormValidateFunction ? freeFormValidateFunction() : false;
      const multirecordErr = multirecordValidateFunction ? multirecordValidateFunction() : false;
      const debitCreditErr = debitCreditValidateFunction ? debitCreditValidateFunction() : false;
      const defaultTableErr = defaultTableValidateFunction ? defaultTableValidateFunction() : false;

      // alert(Object.keys(openModalDataActive).length == 0 )

      // alert(JSON.stringify(freeformErr));
      // const errors = globalvalidateTextField(textValue, validaterules);

      if (freeformErr || multirecordErr || debitCreditErr || defaultTableErr) {
        // alert(JSON.stringify(` ${freeformErr } ${ multirecordErr } ${ debitCreditErr } ${ defaultTableErr}`))
        return;
      }
      // alert(JSON.stringify(multirecordExist))
      if (multirecordExist && multiRecordForBackend.length == 0) {
        toast.error("No Changes to Save");
        return;
      }
      if (allowZeroValue) {
        toast.error("Total cannot be zero value");
        return;
      }
      if (checkMaxTotalValue) {
        // toast.error('Total cannot be zero value')
        return;
      }
      handleSubmit(
        replaceURIParams(textValue, uri?.sDataDestination),
        replaceURIParams(textValue, uri?.sAction)
      );
      // fetchDataHandleDataGrid?.fetchDataHandleDataGrid(fetchDataHandleDataGrid.uri);
      return;
    }
    if (mode?.options?.handler == "handleEdit") {
      // alert("handleEdit");
      return;
    }
    if (mode?.options?.handler == "handleView") {
      // alert("handleView");
      return;
    }
    if (mode?.options?.handler == "handleNext") {
      handleNext(uri?.sDataSource, uri?.sAction, uri);
      return;
    }
    if (mode?.options?.handler == "handleDialogFormSubmit") {
      if (modalActionTypeAndID.type == "delete") {
        // alert(JSON.stringify())
        handlemodaldata(uri?.sDataDestination, uri?.sAction);
        // alert(JSON.stringify(fetchDataHandleDataGrid))
        if (Object.keys(fetchDataHandleDataGrid).length > 0) {
          fetchDataHandleDataGrid?.fetchDataHandleDataGrid(fetchDataHandleDataGrid.uri);
        }
        return;
      }
      // this is for form submission of dialog data
      const dataWithoutIds = multiRecordForBackend.map(item => {
        const newItem = { ...item };
        delete newItem.id;
        return newItem;
      });
      const errors = globalvalidateTextField(textValue, validaterules);
      if (Object.keys(errors)?.length > 0) {
        setError(prevError => ({
          ...prevError,
          ...errors
        }));
        return;
      }

      let data2 = {
        metadata: {
          sPrimaryTable: openModalDataActive.sPrimaryTable,
          sPrimaryKey: openModalDataActive.sPrimaryKey,
          sPrimaryKeyValue: textValue[openModalDataActive.sPrimaryKey],
          sFormName: openModalDataActive.sFormName,
          sFormAction: openModalDataActive.sFormAction,
          sFormType: openModalDataActive.sFormType
        },
        data: {}
      };
      // alert(JSON.stringify(openModalChildData));
      if (dataWithoutIds.length == 0) {
        // alert(JSON.stringify( bPayloadsDailog))
        // alert(JSON.stringify(textValue));
        data2.data.mainrecord = filterFields(bPayloadsDailog, textValue);
      }
      // alert(JSON.stringify(bPayloadsDailog))
      for (const key in getTableName(openModalChildData)) {
        for (let i = 0; i < openModalChildData.length; i++) {
          if (openModalChildData[i].component.sName == key) {
            if (openModalChildData[i].component.sType == "MULTIRECORD") {
              data2.data.multirecord = filterFieldsWithPayload(dataWithoutIds, bPayloadsDailog);
              const multirecordErr = multirecordValidateFunction
                ? multirecordValidateFunction()
                : false;
              if (multirecordErr) {
                return;
              }
            }
            if (
              openModalChildData[i].component.sType == "INPUTTABLE" &&
              openModalChildData[i].component.options.mode == "FREEFORM"
            ) {
              data2.data.tablerecord = {
                sInputTableName: openModalChildData[i].component.sName,
                sInputTableMode: openModalChildData[i].component.options.mode,
                tabledetails: [filterFieldsWithPayload(filterFreeform, bPayloadsDailog)]
              };
              const freeformErr = freeFormValidateFunction ? freeFormValidateFunction() : false;
              if (freeformErr) {
                return;
              }
            }
            if (
              openModalChildData[i].component.sType == "INPUTTABLE" &&
              openModalChildData[i].component.options.mode == "DEFAULT"
            ) {
              data2.data.tablerecord = {
                sInputTableName: openModalChildData[i].component.sName,
                sInputTableMode: openModalChildData[i].component.options.mode,
                tabledetails: [filterFieldsWithPayload(filterDefault, bPayloadsDailog)]
              };
              const defaultTableErr = defaultTableValidateFunction
                ? defaultTableValidateFunction()
                : false;
              if (defaultTableErr) {
                return;
              }
            }
            if (
              openModalChildData[i].component.sType == "INPUTTABLE" &&
              openModalChildData[i].component.options.mode == "DEBITCREDIT"
            ) {
              data2.data.tablerecord = {
                sInputTableName: openModalChildData[i].component.sName,
                sInputTableMode: openModalChildData[i].component.options.mode,
                tabledetails: [filterFieldsWithPayload(debitCreditTableData, bPayloadsDailog)]
              };
              // const debitCreditErr = debitCreditValidateFunction
              //   ? debitCreditValidateFunction()
              //   : false;
              // if (debitCreditErr) {
              //   return;
              // }
            }
          }
        }
      }

      // alert(JSON.stringify(checkMultirecorInModal (openModalChildData)) );
      if (
        checkMultirecorInModal(openModalChildData) &&
        multirecordExist &&
        multiRecordForBackend.length == 0
      ) {
        toast.error("No Changes to Save");
        return;
      }
      if (filesForBackend.length > 0) {
        data2.data.files = filesForBackend;
      }
      const filteredMultirecord = data2?.data?.multirecord?.filter((record) => {
        const hasUnitFields = !record.sUnitAbbrev && !record.sUnitDescription && record.sUnitCode === "AUTOGENERATE";
        const hasDimensionFields = !record.sDimensionAbbrev && !record.sDimensionDescription && record.sDimensionCode === "AUTOGENERATE";
        const hasWeightFields = !record.sWeightAbbrev && !record.sWeightDescription && record.sWeightCode === "AUTOGENERATE";
        return !(hasUnitFields || hasDimensionFields || hasWeightFields);
      });

      const apiData = JSON.parse(JSON.stringify(data2));
      
      if(apiData?.data?.multirecord){
        apiData.data.multirecord = filteredMultirecord;
      }
      axios
        .post(`${serverAddress}${uri?.sDataDestination}`, apiData, {
          headers: {
            Authorization: `Bearer ${token}`
            // Other headers if needed
          }
        })
        .then(response => {
          // alert(JSON.stringify(selectAndAutocompleteSname))
          setDefaultTableSelectedDataAwareData({})
          setOpenDebugSection(true);
          setDebugSectionAPIData((prev) => [...prev, {"type": "dialog", "api": `${serverAddress}${uri?.sDataDestination}`, "payload": apiData, "response": response}])
          setformIsSubmited((prev) => !prev);
          setMultiRecordForBackend([])
          if (selectAndAutocompleteSname) {
            setTimeout(() => {
              setTextValue(preValue => {
                // alert(JSON.stringify(response?.data.data.mainrecord[selectAndAutocompleteSname.value]));
                return {
                  ...preValue,
                  [selectAndAutocompleteSname.name]:
                    response?.data.data.mainrecord?.[selectAndAutocompleteSname.value]
                };
              });
              setSelectAndAutocompleteSname("");
            }, 350);
          }
          // alert(JSON.stringify(response?.data.data.mainrecord))
          // alert(JSON.stringify(response?.data.data.mainrecord[selectAndAutocompleteSname.value]))
          // Handle successful upload
          CustomAlert("OK", response?.data?.metadata?.msg);
          // alert(JSON.stringify(selectAndAutocompleteSname))
          // setTimeout(() => {

          handleClose();
          // alert(fetchDataHandleDataGrid.uri)
          // }, 1000);
          // console.log("File uploaded successfully:", response.data);
          if (Object.keys(fetchDataHandleDataGrid).length > 0) {
            fetchDataHandleDataGrid?.fetchDataHandleDataGrid(fetchDataHandleDataGrid.uri);
          }
          if (!isOpenModalChildData) {
            if (uri.sAction && formData?.form?.sFormAction !== "EDIT") {
              navigate(uri.sAction);
            }
            // SettingInitialValues();
          }
          setOverLaySplit(false);

          if (selectAndAutocompleteSname) {
            setTextValue(preValue => {
              return {
                ...preValue,
                [selectAndAutocompleteSname.name]:
                  response?.data.data.mainrecord?.[selectAndAutocompleteSname.value]
              };
            });
            setSelectAndAutocompleteSname("");
          }
        })
        .catch(error => {
          CustomAlert("error", error?.response?.data?.metadata?.msg);
        });
      // handleNext(uri?.sDataSource, uri?.sAction, uri);
      return;
    }
    if (mode?.options?.handler == "handleDialog") {
      handleClickOpen(mode);
      return;
    }
    if (mode?.options?.handler == "handleClose") {
      handleClose();
      return;
    }
    if (mode?.options?.submode === "submit") {
      if (modalActionTypeAndID.type !== "delete") {
        const errors = globalvalidateTextField(textValue, validaterules);
        if (errors) {
          handleClose();
        }
        if (Object.keys(errors)?.length > 0) {
          setError(prevError => ({
            ...prevError,
            ...errors
          }));
          return;
        }
      }

      handlemodaldata(uri?.sDataSource, uri?.sAction);
    }
    if (mode?.options?.submode === "dialogformsubmit") {
      const errors = globalvalidateTextField(textValue, validaterules);

      if (errors) {
        if (Object.keys(errors)?.length > 0) {
          setError(prevError => ({
            ...prevError,
            ...errors
          }));
          return;
        }
      }
      handlemodaldata(uri?.sDataSource, uri?.sAction, mode);
    }
  };

  const handleLinkOpenModal = data => {
    const mode = {
      options: {
        mode: "DEFAULT",
        handler: "handleDialog",
        dialog: data.data.sDataSource
      }
    };
    handleClickOpen(mode);
  };

  useEffect(() => {
    if (urlCapture) {
      SetTabledata("");
      // setTextValue({});
      SettingInitialValues();
      sethandleModalclick(false);
      setBodycontent([]);
      setError(null);
      setsummaryfields("");
      setFreeformfield("");
      setDefaultTableMode("");
      setDefaultTableName("");
      setFreeformTableMode("");
      setFreeformTableName("");
      // setResultData("");
      setSingleImg();
      setmultiplefileImg({});
      setImgUploadURL("");
      // setmessage("");
      setDialogMode();
      setOpen(false);
    }
  }, [urlCapture]);

  useEffect(() => {
    const isTextValueEmpty = Object.keys(textValue)?.length === 0;
    if (isTextValueEmpty) {
      setIssubmited(false);
    }
  }, [textValue]);

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

    const inputValue = num.toString();
    const userInputLength = inputValue?.length;
    let formattedValue;

    if (inputValue.includes(".")) {
      const arr = inputValue.split(".");
      const newInputValue = inputValue.toString().replace(".", "");
      const lastValue = arr[1];
      const lastValueueLenght = lastValue.toString()?.length;

      if (lastValueueLenght === 2) {
        formattedValue = `${arr[0]}.${lastValue}`;
      } else {
        const STRVAL = newInputValue.toString();
        const arrval = STRVAL.split("");
        const joinVal = arrval.slice(0, -2).join("");

        formattedValue = parseFloat(
          `${parseFloat(joinVal)}.${arrval[arrval?.length - 2]}${arrval[arrval?.length - 1]}`
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

    let val = inputValue.includes(".") ? parseFloat(formattedValue) : formattedValue.toFixed(2);

    return isNaN(val) ? "0.00" : val;
  };

  const handleTextValue = (event, ind, validate) => {
    let { name, value } = event.target;
    setIndex(ind);
    if (name === "currency-textend" || name === "currency-text") {
      value = handlePointChange(value);
      setTextValue(textValue => ({ ...textValue, [name]: parseFloat(value).toFixed(2) }));
    } else {
      setTextValue(textValue => ({ ...textValue, [name]: value }));
    }

    let trimmedValue;
    if (name === "currency-textend" || name === "currency-text") {
      trimmedValue = value;
    } else {
      trimmedValue = value?.trim();
    }

    const error = validateTextField(trimmedValue, validate);
    setError(prevError => {
      const newError = { ...prevError, [name]: error };
      return newError;
    });
  };

  const handleTextValue1 = (event, ind, validate) => {
    const { name, value, decimalPlaces } = event.target;
    let formattedValue;
    // alert(decimalPlaces)
    if (decimalPlaces == "0") {
      formattedValue = value;
    } else {
      formattedValue = value.includes(".") ? value : `${value == "" ? 0 : value}.00`;
    }
    // console.log(formattedValue, value, "decimalPlaces7");
    setIndex(ind);
    setTextValue({ ...textValue, [name]: formattedValue });

    const trimmedValue = value?.trim();
    const error = validateTextField(trimmedValue, validate);

    setError(prevError => {
      const newError = { ...prevError, [name]: error };
      return newError;
    });
  };

  const handletabledata = e => {
    SetTabledata(e);
  };
  const tablesummaryfields = (e, data) => {
    setTablemaindata(data?.summaryfields?.sSummaryDetails);
    setsummaryfields(e);
  };

  const tablefreeformfield = e => {
    setFreeformfield(e);
  };

  const handledatechange = (e, name) => {
    setTextValue({ ...textValue, [name]: e });
  };

  const autoCompleteOnchange = (e, name) => {
    // console.log(e, name,'e, name');

    let { value = "", display = "" } = e || "";
    // console.log(e,'value');
    setTextValue({ ...textValue, [name]: e });

    // let trimmedValue;
    // if (name === "currency-textend" || name === "currency-text") {
    //   trimmedValue = value;
    // } else {
    //   trimmedValue = value?.trim();
    // }

    const error = validateTextField(e, validaterules[name]);
    //  alert(error)
    setError(prevError => {
      const newError = { ...prevError, [name]: error };
      return newError;
    });
  };

  const handleCheckboxOnchange = (e, name) => {
    setTextValue({ ...textValue, [name]: e });
  };

  // UPDATED - BITS Enterprise.js
  // const handleselectOnchange = (e, name, mainAllData) => {
  //   let value;
  //   if (typeof e === "object") {
  //     value = e.value;
  //   } else {
  //     value = e.toString();
  //   }
  const handleselectOnchange = (e, name) => {
    let value;
    if (typeof e === "object") {
      value = e.value;
    } else {
      value = e.toString();
    }
    // UPDATED - BITS Enterprise.js
    // setTextValue(textValue => ({ ...textValue, [name]: value, "balanceAmount": name === "sFromAccount" ? mainAllData.total : textValue.balanceAmount }));
    setTextValue(textValue => ({ ...textValue, [name]: value }));

    const error = validateTextField(value, validaterules[name]);
    setError(prevError => {
      const newError = { ...prevError, [name]: error };
      return newError;
    });
  };

  const handleradiovalue = (e, name) => {
    setTextValue({ ...textValue, [name]: e });
  };

  const getfilename = (files, b, mode, url) => {
    if (
      formData?.form?.sFormAction === "EDIT" &&
      mode === "SINGLE" &&
      typeof files === "string" &&
      files
    ) {
      setTextValue(prevTextValue => ({ ...prevTextValue, [b]: files }));
    } else {
      const fileNames = [];
      setImgUploadURL(url);

      const filesdata = [];
      for (let i = 0; i < files?.length; i++) {
        const fileName = files[i]?.file?.name || files[i]?.src;
        const filedata = files[i]?.file;
        fileNames.push(fileName);
        filesdata.push(filedata);
      }
      if (mode === "SINGLE") {
        setTextValue(prevTextValue => ({ ...prevTextValue, [b]: fileNames[0] }));
        setSingleImg(filesdata[0]);
      } else {
        setTextValue(prevTextValue => ({ ...prevTextValue, [b]: fileNames }));
        setmultiplefileImg(filesdata);
      }
    }
  };

  //List 1
  function useListData(dataDefault) {
    const [listData, setListData] = useState([]);

    useEffect(() => {
      axios
        .get(`${baseURL}${dataDefault}`, {
          headers: {
            Authorization: `Bearer ${token}`
            // Other headers if needed
          }
        })
        .then(result => {
          setListData(result.data);
        })
        .catch(error => {
          // setGlobalError(error);
          console.log(error, "error");
        });
    }, [dataDefault]);

    return listData;
  }

  function DefaultComponent({ dataDefault, data }) {
    const listItems = useListData(dataDefault);
    return ListItemdata(format?.data, data, listItems);
  }

  //
  // List2
  function ListAvatar({ dataDefault, data }) {
    const listAvatarItem = useListData(dataDefault);
    return ListItemdata(format?.data, data, listAvatarItem);
  }

  // List 3
  function ListIcon({ dataDefault, data }) {
    const icon = data?.fieldIcon?.replace("Icon", "");
    const listIconItem = useListData(dataDefault);
    return ListItemdata(format?.data, data, listIconItem, icon);
  }
  //List 4
  function ListAvatarIconItem({ dataDefault, data }) {
    const listAvatarIcon = useListData(dataDefault);
    return ListItemdata(format?.data, data, listAvatarIcon);
  }

  const renderComponent = componentData => {
    return (
      <Grid container>
        {componentData?.map((data, ind) => {
          switch (data?.component?.sType) {
            case "TYPOGRAPHY":
              return renderTypography(data);
            case "TEXTFIELD":
              return renderTextfield(data, ind, index, error, textValue, handleTextValue, varValue);
            case "COUNTER":
              return (
                <Counter
                  data={data}
                  ind={ind}
                  index={index}
                  error={error}
                  textValue={textValue}
                  handleTextValue={handleTextValue}
                />
              );
            case "PASSWORDTEXTFIELD":
              return renderpasswordTextfield(data, ind, textValue, handleTextValue, index, error);
            case "LINK":
              return renderlinkfield(data, handleLinkOpenModal, openStaticDialog);
            case "AUTOCOMPLETE":
              // alert(JSON.stringify(data))
              return renderAutoComplete(
                data,
                error,
                autoCompleteOnchange,
                handleclickdata,
                textValue,
                formIsSubmited,
                setSelectAndAutocompleteSname
              );

            case "CHECKBOX":
              return rendercheckbox(data, handleCheckboxOnchange, textValue);

            case "TRANSFERLIST":
              return renderTransferList(data);

            case "RADIOGROUP":
              return renderRadioGroup(data, handleradiovalue, textValue, freeFormTabbleEditArrays, freeFormTabbleEditMainrecord, formData?.form?.sFormAction);

            case "SELECT":
              return renderSelect(
                data,
                error,
                handleselectOnchange,
                textValue,
                handleclickdata,
                formIsSubmited,
                setSelectAndAutocompleteSname,
                setdTermDays,
                formData?.form?.sFormAction
              );

            // case "COUNTER":
            //   return renderCounter(data, error, handleselectOnchange, textValue);
            case "CURRENCY":
              return renderCurrency(
                data,
                error,
                company,
                ind,
                textValue,
                handleTextValue,
                handleTextValue1
              );
            case "FIXVALUE":
              return renderFixedvalue(data, handleselectOnchange);

            case "IMAGE":
              return (
                <>
                  <ImageComponent
                    value={textValue[data.component.sName]}
                    textValue={textValue}
                    setTextValue={setTextValue}
                    formAction={formData?.form?.sFormAction}
                    imagesIdsFromMedia={imagesIdsFromMedia}
                    setImagesIdsFromMedia={setImagesIdsFromMedia}
                    openStaticDialog={openStaticDialog}
                    imagesName={imagesName}
                    data={data}
                    bodycontent={bodycontent}
                  />
                </>
              );
            // case "IMAGE":
            //   return renderImage(
            //     data,
            //     (a, b, mode, url) => getfilename(a, b, mode, url),
            //     bodycontent,
            //     formData?.form?.sFormAction
            //   );

            case "DATETIME":
              return (
                <>
                  {/* {JSON.stringify(dTermDays)} */}
                  {renderDatecomponent(data, handledatechange, textValue, formData, setTextValue)}
                </>
              );
            case "CUSTOMBOX":
              return (
                <>
                  {/* {JSON.stringify(dTermDays)} */}
                  <CUSTOMBOX data={data} />
                </>
              );
            case "MULTIRECORD":
              return (
                <Multirecord
                  data={data}
                  format={format}
                  setMultiRecordForBackend={setMultiRecordForBackend}
                  company={company}
                  setmultirecordValidateFunction={setmultirecordValidateFunction}
                  setmultirecordExist={setmultirecordExist}
                  isDisabledTable={isDisabledTable}
                  textValue={textValue}
                  setdifferenceDebitCredit={setdifferenceDebitCredit}
                  isSubmited={isSubmited}
                  tabledata={handletabledata}
                  tablesummaryfields={e => tablesummaryfields(e, data)}
                  tablefreeformfield={tablefreeformfield}
                  freeFormTabbleEditArrays={freeFormTabbleEditArrays}
                  setFreeFormTabbleArrays={setFreeFormTabbleArrays}
                  freeFormTabbleArrays={freeFormTabbleArrays}
                  freeformTableMode={freeformTableMode}
                  freeformTableName={freeformTableName}
                  formAction={formData?.form?.sFormAction}
                  formdata={formData}
                />
              );

            case "INPUTTABLE":
              //  if (data.component.options.mode == "FREEFORM") {
              //   setFreeformTableMode(data?.component?.options.mode);
              //   setFreeformTableName(data?.component.sName);
              // }

              return (
                <>
                  {/* {JSON.stringify(defaultTableNameAndModel.sName)} */}
                  {/* {JSON.stringify(defaultTableNameAndModel.options.mode)} */}
                  <AllTablesMain
                    data={data}
                    setdefaultTableNameAndModel={setdefaultTableNameAndModel}
                    setSelectAndAutocompleteSname={setSelectAndAutocompleteSname}
                    company={company}
                    setcheckMaxTotalValue={setcheckMaxTotalValue}
                    setallowZeroValue={setallowZeroValue}
                    isDisabledTable={isDisabledTable}
                    textValue={textValue}
                    setdebitCreditTableMode={setdebitCreditTableMode}
                    setdebitCreditTableName={setdebitCreditTableName}
                    handleClickOpen={handleclickdata}
                    setdebitCreditTotal={setdebitCreditTotal}
                    setdebitCreditTotalBalanced={setdebitCreditTotalBalanced}
                    format={format}
                    freeFromTotals={freeFromTotals}
                    setFreeFromTotals={setFreeFromTotals}
                    setdifferenceDebitCredit={setdifferenceDebitCredit}
                    isSubmited={isSubmited}
                    setdebitCreditTableData={setdebitCreditTableData}
                    tabledata={handletabledata}
                    tablesummaryfields={e => tablesummaryfields(e, data)}
                    tablefreeformfield={tablefreeformfield}
                    freeFormTabbleEditArrays={freeFormTabbleEditArrays}
                    freeFormTabbleEditMainrecord={freeFormTabbleEditMainrecord}
                    setFreeFormTabbleEditMainrecord={setFreeFormTabbleEditMainrecord}
                    setFreeFormTabbleArrays={setFreeFormTabbleArrays}
                    freeFormTabbleArrays={freeFormTabbleArrays}
                    freeformTableMode={freeformTableMode}
                    freeformTableName={freeformTableName}
                    formAction={formData?.form?.sFormAction}
                    formdata={formData}
                    documentSelectTableData={documentSelectTableData}
                    documentSelectmappingData={documentSelectmappingData}
                    setfreeFormValidateFunction={setfreeFormValidateFunction}
                    setmultirecordValidateFunction={setmultirecordValidateFunction}
                    setmultirecordExist={setmultirecordExist}
                    setdefaultTableValidateFunction={setdefaultTableValidateFunction}
                    setdebitCreditValidateFunction={setdebitCreditValidateFunction}
                  />
                </>
              );

            case "BUTTON":
              // alert(JSON.stringify(data))
              return renderButtonComponent(
                data,
                handleclickdata,
                openModalDataActive.sFormName || mainFormData?.form?.sFormName
              );

            case "BUTTONDROPDOWN":
              return <ButtonDropdown data={data} handleclickdata={handleclickdata} />;

            case "FILE":
              return (
                <FileUpload
                  editFiledata={editFiledata}
                  type={formData?.form?.sFormAction}
                  data={data}
                  setFilesForBackend={setFilesForBackend}
                  handleclickdata={handleclickdata}
                />
              );

            case "VARSELECT":
              return (
                <Varselect error={error} ind={ind} data={data} handleclickdata={handleTextValue} />
              );
            case "NUMBER":
              return (
                <NUMBER
                  ind={ind}
                  index={index}
                  error={error}
                  textValue={textValue}
                  data={data}
                  handleTextValue={handleTextValue1}
                />
              );
            case "DOCUMENTSELECT":
              return (
                // documentSelectTableData,
                // documentSelectmappingData
                <DocumentSelect
                  setdocumentSelectmappingData={setdocumentSelectmappingData}
                  setdocumentSelectTableData={setdocumentSelectTableData}
                  setselectedRowsDataGrid={setselectedRowsDataGrid}
                  selectedRowsDataGrid={selectedRowsDataGrid}
                  renderComponent={renderComponent}
                  data={data}
                />
              );

            case "DATAGRID":
              return (
                <Grid item {...data?.grid_props}>
                  <DataGridComponent
                    data={formData}
                    setselectedRowsDataGrid={setselectedRowsDataGrid}
                    formdata={data}
                    format={format}
                    formDetails={formData?.form}
                    {...data?.component?.sProps}
                    setFreeFormTabbleEditMainrecord={setFreeFormTabbleEditMainrecord }
                  />
                </Grid>
              );
            case "DATATABLE":
              {
                /* rfg 8 May 23 */
              }
              return (
                <Grid item {...data?.grid_props}>
                  {/* {JSON.stringify(varValue)} */}
                  <DataTableComponent
                    renderComponent={renderComponent}
                    formdata={data}
                    setVarValue={setVarValue}
                    varValue={varValue}
                    format={format}
                    formDetails={formData?.form}
                    recordData={recordData}
                    {...data?.component?.sProps}
                  />
                </Grid>
              );
            case "BOX": {
              return (
                // <Grid item {...data?.grid_props}>
                //   <Box {...data?.component?.sProps} id={data?.component?.sName}>
                //     <Grid container {...data?.component?.options?.others1}>
                //       {/* {JSON.stringify(data?.child)} */}
                //       {renderComponent(data?.child)}
                //     </Grid>
                //   </Box>
                // </Grid>
                // sx={{width: "100%"}}
                <Grid item {...data?.grid_props}>
                  <Box {...data?.component?.sProps} id={data?.component?.sName}>
                    {/* {JSON.stringify(data?.child)} */}
                    {renderComponent(data?.child)}
                  </Box>
                </Grid>
              );
            }
            case "SECTION": {
              // return (
              //   /true/.test(data?.component?.options?.visible) && (
              //     <Grid item {...data?.grid_props}>
              //       <Box {...data?.component?.sProps} id={data?.component?.sName}>
              //         <Grid container>
              //           {/* {JSON.stringify(data?.child)} */}
              //           {renderComponent(data?.child)}
              //         </Grid>
              //       </Box>
              //     </Grid>
              //   )
              // );
              return (
                <SECTION data={data} textValue={textValue} renderComponent={renderComponent} varValue={varValue}  />
              );
            }
            case "PAPER": {
              return (
                <Grid item {...data.grid_props}>
                  {/* {JSON.stringify(data)} */}
                  {/* {JSON.stringify(data?.component?.sProps)} */}
                  <Paper
                    id={data.component.sName}
                    sx={data?.component?.sProps}
                    {...data?.component?.sProps}
                  >
                    <Grid container {...data?.component?.options?.others1}>
                      {renderComponent(data?.child)}
                    </Grid>
                  </Paper>
                </Grid>
              );
            }

            case "CARD": {
              return renderCardComponent(data, handleclickdata);
            }

            case "GLOBALTEXT": {
              return renderglobaltextcomponent(data, globalvariables, format);
            }
            case "DIVIDER": {
              return (
                <Grid item {...data.grid_props}>
                  <Divider {...data?.component?.sProps}>{renderComponent(data?.child)}</Divider>
                </Grid>
              );
            }
            case "STACK":
              return (
                <Grid item {...data?.grid_props}>
                  <Stack {...data?.component?.sProps}>
                    <Grid container {...data?.component?.options?.others1}>
                      {data?.child?.map(item1 => {
                        switch (item1?.component?.sType) {
                          case "TYPOGRAPHY":
                            return renderTypography(item1);
                          default:
                            return null;
                        }
                      })}
                    </Grid>
                  </Stack>
                </Grid>
              );
            case "ICON": {
              const icon = data?.component?.sIcon?.replace("Icon", "");
              return (
                <Grid item {...data?.grid_props}>
                  <Icon id={data?.component?.sName} {...data?.component?.sProps} iconName={icon} />
                </Grid>
              );
            }
            case "VARDATETIME": {
              return (
                <>
                  <VarDateTime data={data} value={textValue[data.component.sName] ? textValue[data.component.sName] : varValue[data.component.sName]} />
                </>
              );
            }
            case "AVATAR": {
              switch (data?.component?.sAdornType) {
                case "IMG":
                case "TEXT":
                case "ICON":
                  return avatarcomponent(data);
                default:
                  return null;
              }
            }
            case "VARTEXT": {
              // return rendervartextcomponent(data, varValue, format,setVarValue);
              return <Vartext data={data} varValue={varValue} format={format} />;
            }
            case "VARNUMBER": {
              // return rendervartextcomponent(data, varValue, format,setVarValue);
              return <VARNUMBER data={data} varValue={varValue} format={format} />;
            }
            case "VARCONCAT": {
              // return rendervartextcomponent(data, varValue, format,setVarValue);
              return <VarConcat data={data} varValue={varValue} format={format} />;
            }
            case "VARCUSTOMHTML": {
              // return rendervartextcomponent(data, varValue, format,setVarValue);
              return <VARCUSTOMHTML data={data} varValue={varValue} format={format} />;
            }
            case "EVENT": {
              // return rendervartextcomponent(data, varValue, format,setVarValue);
              return (
                <EVENT
                  data={data}
                  setdocumentSelectmappingData={setdocumentSelectmappingData}
                  setdocumentSelectTableData={setdocumentSelectTableData}
                  setTextValue={setTextValue}
                />
              );
            }
            case "IMG": {
              let srcImg = `${baseURL}${data?.data?.sDataSource}`;
              const sProps = {
                ...data?.component?.sProps
              };
              const { sx } = sProps;
              const mappedSx = {
                width: parseInt(sx?.width),
                height: parseInt(sx?.height)
              };
              return (
                <>
                  {/* kk
                {JSON.stringify(data)} */}
                  <ImgComponent
                    data={data}
                    imagesIdsFromMedia={imagesIdsFromMedia}
                    setImagesIdsFromMedia={setImagesIdsFromMedia}
                    value={textValue[data.component.sName]}
                    textValue={textValue}
                    setTextValue={setTextValue}
                    formAction={formData?.form?.sFormAction}
                    openStaticDialog={openStaticDialog}
                    imagesName={imagesName}
                    bodycontent={bodycontent}
                  />
                </>
              );
            }
            case "AVATARGROUP": {
              return (
                <Grid item {...data.grid_props}>
                  <AvatarGroup {...data?.component?.sProps}>
                    {data?.child?.map(item1 => {
                      if (item1?.component?.sType === "AVATAR") {
                        switch (item1?.component?.sAdornType) {
                          case "IMG":
                          case "TEXT":
                          case "ICON":
                            return avatarcomponent(item1);
                          default:
                            return null;
                        }
                      }
                    })}
                  </AvatarGroup>
                </Grid>
              );
            }
            case "INPUT": {
              return (
                <Input
                  {...data?.component?.sProps}
                  name={data?.component?.sName}
                  defaultValue={data?.component?.sDefaultValue}
                />
              );
            }
            case "TAB":
              return <BasicTabs data={data} renderComponent={renderComponent} />;
            case "BUTTONGROUP": {
              return (
                <Grid item {...data.grid_props}>
                  <ButtonGroup id={data?.component?.sName} {...data?.component?.sProps}>
                    {data?.child?.map(item1 => {
                      switch (item1?.component?.sType) {
                        case "BUTTON":
                          return renderButtonComponent(item1, handleclickdata);
                        default:
                          return null;
                      }
                    })}
                  </ButtonGroup>
                </Grid>
              );
            }
            case "BADGE": {
              const icon = data?.component?.sIcon?.replace("Icon", "");
              return data?.component?.sType === "BADGE" ? (
                <Grid item {...data?.grid_props}>
                  <Badge {...data?.component?.sProps}>
                    <Icon {...data?.component?.options?.others1} iconName={icon} />
                  </Badge>
                </Grid>
              ) : null;
            }

            case "VARVALUE": {
              return (
                <Grid item {...data?.grid_props}>
                  <VarValue data={data} textValue={textValue} />
                </Grid>
              );
            }

            case "ACCORDION": {
              return (
                <>
                  <AccordianComponent
                    textValue={textValue}
                    data={data}
                    renderComponent={renderComponent}
                  />
                  {/* <Grid item {...data?.grid_props}>
                  <Accordion {...data?.component?.sProps}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>{data?.component?.sTitle}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>{ renderComponent(data.child )}</AccordionDetails>
                  </Accordion>
                </Grid> */}
                </>
              );
            }
            // case "ACCORDION2": {
            //   return (
            //     <Grid item xs={8}>
            //       <Accordion>
            //         <AccordionSummary
            //           expandIcon={<ExpandMoreIcon />}
            //           aria-controls="panel1a-content"
            //           id="panel1a-header"
            //         >
            //           <Typography>Purchase Orders</Typography>
            //         </AccordionSummary>
            //         <AccordionDetails></AccordionDetails>
            //       </Accordion>
            //       <Accordion>
            //         <AccordionSummary
            //           expandIcon={<ExpandMoreIcon />}
            //           aria-controls="panel2a-content"
            //           id="panel2a-header"
            //         >
            //           <Typography>Bills</Typography>
            //         </AccordionSummary>
            //         <AccordionDetails></AccordionDetails>
            //       </Accordion>
            //       <Accordion>
            //         <AccordionSummary
            //           expandIcon={<ExpandMoreIcon />}
            //           aria-controls="panel2a-content"
            //           id="panel2a-header"
            //         >
            //           <Typography>Payment Made</Typography>
            //         </AccordionSummary>
            //         <AccordionDetails></AccordionDetails>
            //       </Accordion>
            //       <Accordion>
            //         <AccordionSummary
            //           expandIcon={<ExpandMoreIcon />}
            //           aria-controls="panel2a-content"
            //           id="panel2a-header"
            //         >
            //           <Typography>Debit Notes</Typography>
            //         </AccordionSummary>
            //         <AccordionDetails></AccordionDetails>
            //       </Accordion>
            //       <Accordion>
            //         <AccordionSummary
            //           expandIcon={<ExpandMoreIcon />}
            //           aria-controls="panel2a-content"
            //           id="panel2a-header"
            //         >
            //           <Typography>Payments Received</Typography>
            //         </AccordionSummary>
            //         <AccordionDetails></AccordionDetails>
            //       </Accordion>
            //       <Accordion>
            //         <AccordionSummary
            //           expandIcon={<ExpandMoreIcon />}
            //           aria-controls="panel2a-content"
            //           id="panel2a-header"
            //         >
            //           <Typography>Expenses</Typography>
            //         </AccordionSummary>
            //         <AccordionDetails></AccordionDetails>
            //       </Accordion>
            //     </Grid>
            //   );
            // }
            case "CHIP":
              // return renderchipcomponent(data)
              return (
                <Grid item {...data.grid_props}>
                  {(() => {
                    switch (data?.component?.sAdornType) {
                      case "NONE":
                        if (data?.component.sName === "sStatus") {
                          const foundItem = format.data?.find(item => item?.sFieldFormat);
                          const fieldFormat = foundItem ? JSON.parse(foundItem.sFieldFormat) : {};

                          return (
                            <Grid item {...data?.component?.grid_props}>
                              <Chip label={textValue[data?.component.sName]} {...fieldFormat} />
                            </Grid>
                          );
                        }
                        break;

                      case "IMG":
                        return (
                          <Grid item {...data?.component?.grid_props}>
                            <Chip
                              avatar={
                                <Avatar
                                  alt={data?.data?.sAction}
                                  src={`${serverAddress}${data?.data?.sDataSource}`}
                                  {...data?.component?.sProps}
                                />
                              }
                              label={textValue[data?.component.sName]}
                            />
                          </Grid>
                        );
                      case "ICON":
                        return (
                          <Grid item {...data?.component?.grid_props}>
                            <Chip
                              icon={<Icon iconName={data?.component?.sIcon?.replace("Icon", "")} />}
                              label={textValue[data?.component.sName]}
                              {...data?.component?.sProps}
                            />
                          </Grid>
                        );
                      case "LINK":
                        return (
                          <Grid item {...data?.component?.grid_props}>
                            <Chip
                              label={textValue[data?.component.sName]}
                              onClick={() => navigate(data?.component?.options?.others2)}
                            />
                          </Grid>
                        );
                      default:
                        return null;
                    }
                  })()}
                </Grid>
              );

            case "LISTITEMS": {
              return (
                <Grid item {...data.grid_props}>
                  {(() => {
                    switch (data?.component?.options?.mode) {
                      case "DEFAULT":
                        return (
                          <DefaultComponent
                            dataDefault={data?.data?.sDataSource}
                            data={data}
                            format={format}
                          />
                        );
                      case "AVATAR":
                        return (
                          <ListAvatar
                            dataDefault={data?.data?.sDataSource}
                            data={data}
                            format={format}
                          />
                        );
                      case "ICON":
                        return (
                          <ListIcon
                            dataDefault={data?.data?.sDataSource}
                            data={data}
                            format={format}
                          />
                        );
                      case "LISTAVATARICON":
                        return (
                          <ListAvatarIconItem
                            dataDefault={data?.data?.sDataSource}
                            data={data}
                            format={format}
                          />
                        );
                      default:
                        return null;
                    }
                  })()}
                </Grid>
              );
            }
            case "LOADFROM":
              return <Loadfrom data={data} />;
            case "DIALOG":
              // alert(JSON.stringify(open))
              // if (dialogMode?.options?.nested) {
              //   return renderNestedDialog(data,nestedDialog,dialogMode,handleClose,renderComponent)
              // } else {
              return renderdialogboxcomponent(
                data,
                open,
                handleClose,
                dialogMode,
                renderComponent,
                nestedDialog,
                nestedDialogMode
              );
            case "VARSTORE":
              return (
                <RenderVarstore freeFormTabbleEditMainrecord={freeFormTabbleEditMainrecord} data={data} />
              );
            case "BARCHART":
              return (
                <Grid item {...data?.grid_props}>
                  <RenderBarchart data={data} />
                </Grid>
              )
            case "LINECHART":
              return (
                <Grid item {...data?.grid_props}>
                  <RenderLineChart data={data} />
                </Grid>
              )
            case "PIECHART":
              return (
                <Grid item {...data?.grid_props}>
                  <RenderPieChart data={data} />
                </Grid>
              )
            default:
              return null;
          }
        })}
      </Grid>
    );
  };

  useEffect(() => {
    try {
      //BITSENTERPRISE.JS version 1.7
      /*eslint-disable no-undef*/
      copyFormData(
        textValue.bSameAsAddress,
        setTextValue,
        formData?.form?.sFormName,
        textValue,
        setIsDisabledTable
      );

      /*eslint-enable no-undef*/
    } catch (error) {
      // Handle the error here
      console.error("Error in copyFormData:", error);
    }
  }, [textValue.bSameAsAddress, textValue.bUseRelativeUnit, formData]);

  useEffect(() => {
    try {
      // UPDATED - BITS Enterprise.js
      // let testEs = addDaysToDate(textValue.dtDate, dTermDays);
      /*eslint-disable no-undef*/
      let testEs = addDaysToDate(textValue.dtDueDate, dTermDays);
      setTextValue(pre => ({ ...pre, dtDueDate: testEs }));
      /*eslint-enable no-undef*/
    } catch (error) {
      // Handle the error here
      console.error("Error in copyFormData:", error);
    }
  }, [textValue.sPaymentTerms, textValue.dTermDays, dTermDays, formData]);
  //  alert( `${textValue.dtDueDate} - ${dTermDays}`)

  //   useEffect(() => {

  //     /*eslint-disable no-undef*/
  //   copyFreeFormData(
  //   data?.component?.sName,
  //   freeclms,
  //   setFreeformdata,
  //   textValue,

  //   );
  // /*eslint-enable no-undef*/
  //   },[])
  //----------------------------------------------------------------

  // find all initial data
  const handleTime = event => {
    const item_date = `${event.$D}-${event.$M + 1}-${event.$y}`;
    return item_date;
  };

  function removeCommas(inputString) {
    let result = "";
    for (let i = 0; i < inputString.length; i++) {
      if (inputString[i] !== ",") {
        result += inputString[i];
      }
    }
    return result;
  }

  const handlePointChangeTable = (num1, decimalPlaces = 0, sThousandSeparator) => {
    const num = removeCommas(num1.replace(/\s/g, ","));

    // let val = inputValue.includes(".") ? parseFloat(formattedValue).toFixed(decimalPlaces) : formattedValue;
    let val;
    const inputValue = num.toString();

    if (inputValue.includes(".")) {
      const arr = inputValue.split(".");
      const lastValue = arr[1];
      const newInputValue = inputValue.toString().replace(".", "");
      const lastValueueLenght = lastValue.toString().length;
      const STRVAL = newInputValue.toString();
      const arrval = STRVAL.split("");
      const newArr = lastValue.split("");

      if (decimalPlaces == 0) {
        val = num * 1000;
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
        val = `0.0${inputValue}`;
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

    const newVal = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
      // useGrouping:true
    }).format(
      isNaN(val) ? (decimalPlaces == "0" ? "0" : `${"0"}${"0".repeat(decimalPlaces)}`) : val
    );

    if (sThousandSeparator == ",") {
      return newVal;
    } else {
      return newVal.replace(/,/g, " ");
    }
    // return isNaN(val) ? decimalPlaces : val;
  };
  function filterComponentsRecursive(config) {
    const result = {};

    function processField(field) {
      const component = field.component || {};
      const {
        sType,
        sName,
        sDefaultValue,
        sSendFormat,
        sUncheckedValue,
        iDecimalPlaces,
        sThousandSeparator
      } = component;

      if (
        [
          "TEXTFIELD",
          "COUNTER",
          "AUTOCOMPLETE",
          "CHECKBOX",
          "TRANSFERLIST",
          "RADIOGROUP",
          "PASSWORDTEXTFIELD",
          "FIXVALUE",
          "SELECT",
          "VARTEXT",
          "VARNUMBER",
          "IMG",
          "VARCONCAT",
          "RADIOGROUP",
          "NUMBER",
          "VARSELECT",
          "IMAGE",
          "DATETIME",
          "INPUT"
        ].includes(sType)
      ) {
        // Check if sType is CHECKBOX and default value is an empty string
        if (sType === "CHECKBOX") {
          result[sName] = sDefaultValue !== "" ? sDefaultValue || sUncheckedValue : sUncheckedValue;
        } else if (sType === "RADIOGROUP") {
          //data?.component?.sProps?.defaultValue
          result[sName] = component.sProps.defaultValue;
        } else if (sType === "DATETIME") {
          const date = handleTime(dayjs(sDefaultValue));
          result[sName] = dateformat(date, sSendFormat);
        } else if (sType === "COUNTER") {
          result[sName] =
            component?.options?.sDefaultValue === "Yes"
              ? component.options.enabledValue
              : component.options.mode === "DEFAULT"
              ? sDefaultValue
              : "";
        } else if (sType === "NUMBER") {
          const val = handlePointChangeTable(sDefaultValue, iDecimalPlaces, sThousandSeparator);

          result[sName] = sDefaultValue == "" ? "" : val || "";
        } else {
          result[sName] = sDefaultValue || "";
        }
      }

      // Check if the field has a child array
      if (sType !== "DIALOG") {
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
  //  getting data by sname
  function getDataByName(obj, targetName) {
    if (obj && typeof obj === "object") {
      if (targetName in obj) {
        return obj[targetName];
      } else {
        for (const key in obj) {
          const result = getDataByName(obj[key], targetName);
          if (result !== null) {
            return result;
          }
        }
      }
    }
    return null;
  }

  function getDataByMode(obj, modeToFind) {
    const resultArray = [];
    function search(obj) {
      if (obj && typeof obj === "object") {
        if ("mode" in obj && obj.mode === modeToFind) {
          resultArray.push(obj);
        }

        for (const key in obj) {
          search(obj[key]);
        }
      }
    }

    search(obj);
    return resultArray;
  }

  const [intdata, setinitdata] = useState([]);
  function extractDynamicData(jsonData, result = {}, excludedKeys = []) {
    if (jsonData.sType != "DOCUMENTSELECT") {
      if (jsonData.sType != "MULTIRECORD") {
        if (jsonData.sType !== "INPUTTABLE") {
          for (const key in jsonData) {
            if (!excludedKeys.includes(key)) {
              if (typeof jsonData[key] === "object" && jsonData[key] !== null) {
                extractDynamicData(jsonData[key], result, excludedKeys);
              } else {
                result[key] = jsonData[key] || "";
              }
            }
          }
        }
      }
    }

    return result;
  }

  const yourConfig = formData?.details; // Replace this with your actual configuration
  function SettingInitialValues() {
    if (yourConfig) {
      const filteredComponents = filterComponentsRecursive(yourConfig);
      const tableData = getDataByType("INPUTTABLE", filteredComponents);
      const tab = getDataByType("TAB", filteredComponents);
      const excludedKeys = [
        // "sMode",
        "mode",
        "DIALOG",
        "DOCUMENTSELECT",
        "sType",
        "inventory_image",
        "sInputTableMode",
        "sInputTableName"
      ];

      const extractedData = extractDynamicData(filteredComponents, {}, excludedKeys);
      // alert(JSON.stringify(extractedData))

      let rtnData = {};
      // if (Object.keys(varValue).length > 0 ) {
      // alert(JSON.stringify(extractedData))
      rtnData = copyMatchingValues(varValue, extractedData);
      // alert(JSON.stringify(varValue))
      setTextValue(rtnData);
      // }
      //       setTextValue(rtnData);
      // setTextValue(preValue => ({
      //   ...preValue,
      //   ...rtnData
      // }));

      setinitdata(tableData);

      setFreeFormInitState(tableData);
      setFreeFormTabbleArrays(tableData);
      // alert(JSON.stringify(tableData))
      setfilterfreeForm(tableData);
      try {
        /* eslint-disable no-fallthrough */
        /*global copyTableInormation, a*/
        /*eslint no-undef: "error"*/
        // copyTableInormation(formData?.form?.sFormName, tableData, textValue);
        /*eslint no-undef: "error"*/
        /* eslint-disable no-fallthrough */
      } catch (error) {
        console.log(error);
      }
    }
  }

  function hasFile(object) {
    if (object?.component?.sType === "FILE") {
      return true;
    }
    if (object.child && hasFile(object.child)) {
      return true;
    }
    return false;
  }
  /* eslint-disable no-fallthrough */
  useEffect(() => {
    SettingInitialValues();
    if (formData) {
      const fileExists = formData?.details?.some(obj => hasFile(obj));

      if (fileExists) {
        setIsFileUpload(true);
      } else {
        setIsFileUpload(false);
      }
    }
  }, [formData, varValue]);
  /* eslint-disable no-fallthrough */

  // useEffect(() => {
  //   if (yourConfig) {
  //     const filteredComponents = filterComponentsRecursive(yourConfig);
  //     const tableData = getDataByType("INPUTTABLE", filteredComponents);
  //     const tab = getDataByType("TAB", filteredComponents);
  //     // console.log(tab[0]?.tabledetails[0]?.inventory_tracking?.child?.tabledetails[0], "tabuttt");
  //     const excludedKeys = [
  //       "sMode",
  //       "mode",
  //       "DIALOG",
  //       "sType",
  //       "inventory_image",
  //       "sInputTableMode",
  //       "sInputTableName"
  //     ];
  //     const extractedData = extractDynamicData(filteredComponents, {}, excludedKeys);

  //     setTextValue(preValue => ({
  //       ...preValue,
  //       ...extractedData
  //     }));
  //     setinitdata(tableData);
  //     setFreeFormInitState(tableData);
  //     setFreeFormTabbleArrays(tableData);
  //     setfilterfreeForm(tableData);
  //     console.log(extractedData, "key1234");
  //   }
  // }, [formData]);

  //----------------------------------------------------------------
  const [typingTimer, setTypingTimer] = useState(null);

  const memo = useMemo(() => {
    if (yourConfig) {
      const filteredComponents = filterComponentsRecursive(yourConfig);
      const tableData = getDataByType("INPUTTABLE", filteredComponents);

      // existingIndex[0]?.tabledetails[0]?.sContactID
      // setFreeformdata([
      //   {
      //     id: 1,
      //     ...freeFormTabbleArrays[existingIndex]?.tabledetails[0],
      // sContactID:
      //   existingIndex2[0]?.tabledetails[0]?.sContactID ||
      //   freeFormTabbleArrays[existingIndex]?.tabledetails[0].sContactID,
      // sShippingID:
      //   existingIndex2[0]?.tabledetails[0]?.sShippingID ||
      //   freeFormTabbleArrays[existingIndex]?.tabledetails[0].sShippingID
      //   }
      // ]);

      try {
        if (tableData.length > 0) {
          const mostdata = tableData.map((item, ind) => {
            // const memoData = useCallback(()=>{

            const existingIndex2 = freeFormTabbleEditArrays?.filter(
              item1 => item1.sInputTableName === item.sInputTableName
            );

            // alert(JSON.stringify( dataforAutoGenrate));

            // },[item])

            //   const returnArray =[0]
            //   alert(JSON.stringify('returnArray'))
            //   let dataforAutoGenrate = {

            //   };
            //   if (returnArray.sContactID) {
            //     dataforAutoGenrate =  { sContactID: existingIndex2[0]?.tabledetails[0]?.sContactID || "AUTOGENERATE",
            //   }
            // }
            //   if (returnArray.sShippingID) {
            //     dataforAutoGenrate =  {
            //       sShippingID: existingIndex2[0]?.tabledetails[0]?.sShippingID || "AUTOGENERATE"
            //     }
            //   }

            let tableName = item.sInputTableName;
            let tableRow = item.tabledetails[0];
            let tableType = item.sType;

            let data = {
              sInputTableMode: item.sInputTableMode,
              sInputTableName: item.sInputTableName,
              sType: item.sType,
              /*eslint-disable no-undef*/
              tabledetails: [
                {
                  ...copyFreeFormData(
                    tableName,
                    tableRow,
                    setFreeFormTabbleArrays,
                    textValue,
                    tableData,
                    tableType,
                    "main"
                  )[0]
                }
              ]
            };

            if (
              copyFreeFormData(
                tableName,
                tableRow,
                setFreeFormTabbleArrays,
                textValue,
                tableData,
                tableType,
                "main"
              )[0].sContactID
            ) {
              data.tabledetails[0].sContactID =
                existingIndex2[0]?.tabledetails[0]?.sContactID || "AUTOGENERATE";
            }

            if (
              copyFreeFormData(
                tableName,
                tableRow,
                setFreeFormTabbleArrays,
                textValue,
                tableData,
                tableType,
                "main"
              )[0].sShippingID
            ) {
              data.tabledetails[0].sShippingID =
                existingIndex2[0]?.tabledetails[0]?.sShippingID || "AUTOGENERATE";
            }

            /*eslint-enable no-undef*/
            return data;
          });
          // alert(JSON.stringify(mostdata));

          setFreeFormTabbleArrays(mostdata);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [
    freeFormTabbleEditArrays,
    // textValue,
    formData,
    textValue.sDepartment,
    textValue.sFirstName,
    textValue.sLastName,
    textValue.sMiddleName,
    textValue.sMobileNumber,
    textValue.sPhoneNumber,
    textValue.sCustomerEmail,
    textValue.sVendorEmail,
    textValue.sAddressCity,
    textValue.sAddressCountry,
    textValue.sAddressFax,
    textValue.sAddressPhone,
    textValue.sAddressProvinceState,
    textValue.sAddressStreet,
    textValue.sAddressZip
  ]);

  console.log("nfklejnklnfekln", textValue)

  //   const [typingTimer, setTypingTimer] = useState(null);
  // useEffect(() => {
  //   if (yourConfig) {
  //     const filteredComponents = filterComponentsRecursive(yourConfig);
  //     const tableData = getDataByType("INPUTTABLE", filteredComponents)

  //  try {
  //   clearTimeout(typingTimer);
  //   setTypingTimer(
  //     setTimeout(() => {
  //       if (tableData.length > 0) {
  //         const mostdata =  tableData.map((item, ind) => {
  //              let tableName = item.sInputTableName;
  //              let tableRow = item.tabledetails[0];
  //              let tableType = item.sType;
  //              let data =     {
  //                sInputTableMode: item.sInputTableMode,
  //                sInputTableName: item.sInputTableName,
  //                sType:item.sType,
  //                /*eslint-disable no-undef*/
  //                tabledetails : copyFreeFormData(tableName, tableRow, setFreeFormTabbleArrays, textValue,tableData,tableType,'main')
  //                /*eslint-enable no-undef*/
  //              }
  //              return data
  //            });
  //            setFreeFormTabbleArrays( mostdata);

  //          }
  //     }, 300)
  //   );

  //  } catch (error) {
  //   console.log(error);
  //  }

  //   }
  // },[textValue,formData, textValue.sDepartment,textValue.sLastName,textValue.sMiddleName,textValue.sMobileNumber,textValue.sPhoneNumber])
  const [staticDialog, setStaticDialog] = useState(false);
  const [imagesName, setImageName] = useState("");

  function openStaticDialog(data, sName) {
    setStaticDialog(data);
    setImageName(sName);
  }

  useEffect(() => {
    const rtnData = copyMatchingValues(varValue, textValue);
    setTextValue(rtnData);
    // alert(JSON.stringify(rtnData));
  }, [varValue]);

  // console.log('chuttttyyyi');

  const [cloneFormData, setCloneFormData] = useState([]);

  // const []
  useEffect(() => {
    if (!overlaySplit) {
      setCloneFormData(formData);
      // setmainFormData({});
    }
  }, [formData]);

  return (
    <>
      <Grid
        id={formData?.form?.sFormName}
        container
        {...formData?.form?.sGridProps}
        key={formData?.form?.id}
      >
        <Grid item xs={12}>
          {!isPageLoading ? (
            [cloneFormData]?.map(item => {
              return (
                <>
                  <Grid
                    id="mainform-grid"
                    container
                    {...formData?.form?.sGridProps}
                    key={formData?.form?.id}
                  >
                    {/* {globalError && <MessageError message={globalError} />} */}
                    {/* <Grid item md={12} py={1}> */}

                    <TitleHeader
                      item={item}
                      style={{ ...item?.form?.sProps }}
                      formData={formData}
                      title={item?.form?.sTitle}
                    />

                    {/* <Typography {...item?.form?.sProps}>{item?.form?.sTitle}</Typography> */}
                    {/* </Grid> */}
                    {/* <Grid item md={12}>
                      <Breadcrumbs aria-label="breadcrumb">
                      <Link underline="hover" color="inherit" href="/">
                      {item?.form?.sBreadCrumbs}
                      </Link>
                      </Breadcrumbs>
                      </Grid> */}
                    <Grid container id={item?.form?.sFormName + "-menu"}>
                      {" "}
                      {/* Form Menu */}
                      <FormBar toggle={0} item={item} menu={item?.form?.sMenu} />
                    </Grid>
                    <Box>
                      {resultData === "ERROR" && (
                        <Box style={{ marginTop: "65px" }}>
                          <CustomAlert
                            setResultData={setResultData}
                            severity="error"
                            message={successMessage}
                          />
                        </Box>
                      )}

                      {resultData === "WARNING" && (
                        <CustomAlert
                          severity="warning"
                          setResultData={setResultData}
                          message={successMessage}
                        />
                      )}

                      {resultData === "INFO" && (
                        <CustomAlert
                          setResultData={setResultData}
                          severity="info"
                          message={successMessage}
                        />
                      )}

                      {resultData === "OK" && (
                        <Box style={{ margin: "40px 0 10px  0" }}>
                          <CustomAlert
                            setResultData={setResultData}
                            severity="success"
                            message={successMessage}
                          />
                        </Box>
                      )}
                    </Box>

                    {location?.state?.dialog ? (
                      <Dialog fullWidth={true} open={true}>
                        <Box style={{ margin: "10px" }}> {renderComponent(item?.details)}</Box>
                      </Dialog>
                    ) : (
                      <Box style={{ marginTop: item?.form?.sMenu === "" ? "50px" : 0 }}> </Box>
                    )}
                    {isAlertPopup.open && (
                      <AlertPopup open={isAlertPopup} setClose={setIsAlertPopup} />
                    )}

                    {/* {JSON.stringify(bPayloads)} */}
                    {/* {JSON.stringify(freeFormTabbleArrays)}  */}

                    {renderComponent(item?.details)}

                    <MediaDialog
                      setImageName={setImageName}
                      imagesName={imagesName}
                      setImagesIdsFromMedia={setImagesIdsFromMedia}
                      open={staticDialog}
                      setOpen={setStaticDialog}
                    />
                    <FormFooter formData={formData?.footer} renderComponent={renderComponent} />
                  </Grid>
                </>
              );
            })
          ) : (
            <div
              style={{
                height: "75vh",
                width: "80vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <div>
                <Spinner />
              </div>
            </div>
          )}
        </Grid>

        {overlaySplit && (
          <Grid item xs={6}>
            <OverLayDrawer
              cloneFormData={cloneFormData}
              formData={formData}
              setFormData={setFormData}
              isOpen={overlaySplit}
              setIsOpen={setOverLaySplit}
            >
              {!isoverLayDataLoading ? (
                [formData]?.map(item => {
                  return (
                    <>
                      <Grid
                        id="mainform-grid"
                        container
                        {...formData?.form?.sGridProps}
                        key={formData?.form?.id}
                      >
                        {/* {globalError && <MessageError message={globalError} />} */}
                        {/* <Grid item md={12} py={1}> */}

                        <TitleHeader
                          item={item}
                          style={{ ...item?.form?.sProps }}
                          formData={formData}
                          title={item?.form?.sTitle}
                        />

                        <Grid container id={item?.form?.sFormName + "-menu"}>
                          {" "}
                          {/* Form Menu */}
                          <FormBar toggle={0} item={item} menu={item?.form?.sMenu} />
                        </Grid>
                        <Box>
                          {resultData === "ERROR" && (
                            <Box style={{ marginTop: "65px" }}>
                              <CustomAlert
                                setResultData={setResultData}
                                severity="error"
                                message={successMessage}
                              />
                            </Box>
                          )}

                          {resultData === "WARNING" && (
                            <CustomAlert
                              severity="warning"
                              setResultData={setResultData}
                              message={successMessage}
                            />
                          )}

                          {resultData === "INFO" && (
                            <CustomAlert
                              setResultData={setResultData}
                              severity="info"
                              message={successMessage}
                            />
                          )}

                          {resultData === "OK" && (
                            <Box style={{ margin: "40px 0 10px  0" }}>
                              <CustomAlert
                                setResultData={setResultData}
                                severity="success"
                                message={successMessage}
                              />
                            </Box>
                          )}
                        </Box>

                        {location?.state?.dialog ? (
                          <Dialog fullWidth={true} open={true}>
                            <Box style={{ margin: "10px" }}> {renderComponent(item?.details)}</Box>
                          </Dialog>
                        ) : (
                          <Box style={{ marginTop: item?.form?.sMenu === "" ? "50px" : 0 }}> </Box>
                        )}
                        {isAlertPopup.open && (
                          <AlertPopup open={isAlertPopup} setClose={setIsAlertPopup} />
                        )}

                        {renderComponent(item?.details)}

                        <MediaDialog
                          setImageName={setImageName}
                          imagesName={imagesName}
                          setImagesIdsFromMedia={setImagesIdsFromMedia}
                          open={staticDialog}
                          setOpen={setStaticDialog}
                        />
                        {/* {JSON.stringify(lund())}dd */}
                        <FormFooter formData={formData?.footer} renderComponent={renderComponent} />
                      </Grid>
                    </>
                  );
                })
              ) : (
                <div
                  style={{
                    height: "75vh",
                    width: "80vw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <Spinner />
                  </div>
                </div>
              )}
            </OverLayDrawer>
          </Grid>
        )}

        <DialogDrawer>
          {[varCustomDialogData]?.map(item => {
            return (
              <>
{/* //varCustomDialogTitle */}
                <Grid
                  id="mainform-grid"
                  container
                  {...formData?.form?.sGridProps}
                   key={formData?.form?.id} 
                >

                  <TitleHeader
                    item={item}
                    style={{ ...item?.form?.sProps }}
                    formData={formData}
                    title={item?.form?.sTitle}
                  />

                  <Grid container id={item?.form?.sFormName + "-menu"}>
                    <FormBar toggle={0} item={item} menu={item?.form?.sMenu} />
                  </Grid>
                  <Box>
                    {resultData === "ERROR" && (
                      <Box style={{ marginTop: "65px" }}>
                        <CustomAlert
                          setResultData={setResultData}
                          severity="error"
                          message={successMessage}
                        />
                      </Box>
                    )}

                    {resultData === "WARNING" && (
                      <CustomAlert
                        severity="warning"
                        setResultData={setResultData}
                        message={successMessage}
                      />
                    )}

                    {resultData === "INFO" && (
                      <CustomAlert
                        setResultData={setResultData}
                        severity="info"
                        message={successMessage}
                      />
                    )}

                    {resultData === "OK" && (
                      <Box style={{ margin: "40px 0 10px  0" }}>
                        <CustomAlert
                          setResultData={setResultData}
                          severity="success"
                          message={successMessage}
                        />
                      </Box>
                    )}
                  </Box>

                  {location?.state?.dialog ? (
                    <Dialog fullWidth={true} open={true}>
                      <Box style={{ margin: "10px" }}> {renderComponent(item?.details)}</Box>
                    </Dialog>
                  ) : (
                    <Box style={{ marginTop: item?.form?.sMenu === "" ? "50px" : 0 }}> </Box>
                  )}
                  {isAlertPopup.open && (
                    <AlertPopup open={isAlertPopup} setClose={setIsAlertPopup} />
                  )}
                  {renderComponent(item?.details)}
                  <MediaDialog
                    setImageName={setImageName}
                    imagesName={imagesName}
                    setImagesIdsFromMedia={setImagesIdsFromMedia}
                    open={staticDialog}
                    setOpen={setStaticDialog}
                  />
                  {/* {JSON.stringify(lund())}dd */}
                  <FormFooter formData={formData?.footer} renderComponent={renderComponent} />
                </Grid>
              </>
            );
          })}
        </DialogDrawer>
      </Grid>
    </>
  );
};

export default memo(Form);
