import * as React from "react";
import { DataGrid, GridActionsCellItem, GridToolbar, renderActionsCell } from "@mui/x-data-grid";
//import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PrintIcon from "@mui/icons-material/Print";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
//import SecurityIcon from '@mui/icons-material/Security';
//import FileCopyIcon from '@mui/icons-material/FileCopy';
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { baseURL } from "../../api";
import { sprintf, vsprintf } from "sprintf-js";
import axios from "axios";

import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
//import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { Global_Data } from "../../globalData/GlobalData";
import { serverAddress } from "../../config";
import * as MUIICon from "@mui/icons-material";
import Spinner from "../../component/spinner/Spinner";

import { useDemoData } from "@mui/x-data-grid-generator";
import { styled } from "@mui/material/styles";

import CircularProgress from "@mui/material/CircularProgress";

const StyledGridOverlay = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  backgroundColor:
    theme.palette.mode === "light" ? "rgba(255, 255, 255, 0.9)" : "rgba(18, 18, 18, 0.9)"
}));

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Typography variant="caption" component="div" color="text.primary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

function CustomLoadingOverlay() {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prevProgress => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <StyledGridOverlay>
      <CircularProgressWithLabel value={progress} />
      <Box sx={{ mt: 2 }}>Loading rows…</Box>
    </StyledGridOverlay>
  );
}
export default function ColumnTypesGrid({
  data,
  formdata,
  formDetails,
  setselectedRowsDataGrid,
  format,
  setFreeFormTabbleEditMainrecord 
}) {
  const [rows, setRows] = React.useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const [filter1, setFilter1] = React.useState([]);
  const [filter2, setFilter2] = React.useState([]);
  const [filter3, setFilter3] = React.useState([]);
  const [filter4, setFilter4] = React.useState([]);
  const [selectFilter, setSelectFilter] = React.useState();
  const {
    modalActionTypeAndID,
    setModalActionTypeAndID,
    token,
    handleClickOpen,
    modalEditData,
    setModalEditData,
    textValue,
    setTextValue,
    setFetchDataHandleDataGrid,
    editApi,
    setEditApi,
    setModalPrimaryKry,
    mainFormData,
    setOverLaySplit,
    overlaySplit,
    setOverLayDataFetchApi,
    multiDocumentSelectData,
    setMultiDocumentSelectData,
  } = Global_Data();
  const { pathname } = useLocation();
  function replaceUriParams(data, uri) {
    // Iterate over each key in the data object
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Create a regular expression to match {key}
        const regex = new RegExp(`{${key}}`, "g");
        // Replace {key} with the corresponding value from data
        uri = uri.replace(regex, data[key]);
      }
    }
    return uri;
  }
  const [progress, setProgress] = React.useState(true);

  const fetchDataHandleDataGrid = async () => {
    setRows([]);

    try {
      const response = await axios.get(
        baseURL + replaceUriParams(textValue, formdata.data.sDataSource),
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // setRows(true);
      let items = [];
      for (let i = 0; i < response?.data?.data.records.length; i++) {
        let elm = response?.data?.data.records[i];
        elm.id = i + 1;
        items.push(elm);
      }
      const dates = [];
      formdata?.fixcolumns?.forEach((clm) => {
        if(clm.sType === "date") dates.push(clm.sColumnID); 
      })
      if(items && items.length > 0){
        items.forEach((itm) => {
          for(let i = 0; i < dates.length; i++){
            if(!itm[dates[i]]){
              itm[dates[i]] = "";
            }
          }
        })
      }
      if(formdata && formdata.fixcolumns && formdata.fixcolumns.length > 0){
        formdata.fixcolumns.forEach((clm) => {
          if(clm.sType === 'number'){
            for(let i = 0; i < items.length; i++){
              if(items[i][clm.sColumnID] == 0){
                items[i][clm.sColumnID] = String(items[i][clm.sColumnID]);
              }
            }
          }
        })
      }
      // alert(JSON.stringify(items))
      setRows(items);
      setProgress(false);
      
      localStorage.setItem('GridData', JSON.stringify(items));

      // setTimeout(() => {
      // }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataHandleDataGrid();
  }, [])

  //get filter1
  function findObjects(data, keyName, value) {
    const index = data.findIndex(item => item[keyName] === value);

    if (index === -1) {
      return null; // Return null if the object is not found
    }

    return {
      preOBJ: data[index - 1] || null,
      cruntOBJ: data[index],
      nextOBJ: data[index + 1] || null
    };
  }
  useEffect(() => {
    if (formdata?.data?.sFilters?.filter1?.enabled === true) {
      axios
        .get(`${baseURL}${formdata?.data?.sFilters?.filter1?.sSource}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(result => {
          setFilter1(result?.data?.data.records);
        })
        .catch(error => {
          console.log(error);
        });
    }

    if (formdata?.data?.sFilters?.filter2?.enabled === true) {
      axios
        .get(`${baseURL}${formdata.data.sFilters.filter2.sSource}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(result => {
          setFilter2(result?.data?.data.records);
        })
        .catch(error => {
          console.log(error);
        });
    }

    if (formdata?.data?.sFilters?.filter3?.enabled === true) {
      axios
        .get(`${baseURL}${formdata.data.sFilters.filter3.sSource}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(result => {
          setFilter3(result?.data?.data.records);
        })
        .catch(error => {
          console.log(error);
        });
    }

    if (formdata?.data?.sFilters?.filter4?.enabled === true) {
      axios
        .get(`${baseURL}${formdata.data.sFilters.filter4.sSource}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(result => {
          setFilter4(result?.data?.data.records);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [formdata, pathname]);

  // const deleteItem = React.useCallback(
  //   id => () => {
  //     /*setTimeout(() => {
  //       setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  //     }); */
  //     var data = {};
  //     var datasection = [];
  //     //    var key, value;
  //     var mainrecord = {};

  //     let metadata = {
  //       sPrimaryKey: formDetails.sPrimaryKey,
  //       id: formDetails.id,
  //       sPrimaryTable: formDetails.sPrimaryTable,
  //       sFormType: formDetails.sFormType,
  //       sPrimaryKeyValue: id
  //     };
  //     let headers = {
  //       "Content-type": "application/json"
  //     };

  //     datasection.push({ mainrecord: { mainrecord } });
  //     data["metadata"] = metadata;
  //     data["data"] = datasection;

  //     const uri = baseURL + formdata?.data?.sAction?.actionDelete;

  //     axios
  //       .delete(
  //         uri,
  //         { headers, data },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`
  //           }
  //         }
  //       )
  //       .then(result => {
  //         if (result.data) {
  //           if (result.data.metadata.status == "OK") {
  //             alert("Success");
  //             setTimeout(() => {
  //               setRows(prevRows => prevRows.filter(row => row.id !== id));
  //             });
  //           } else {
  //             alert(result.data.metadata.msg);
  //           }
  //         }
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       });
  //   },
  //   []
  // );

  const handleFilter1 = uri => {
    setRows([]);
    const filterdata = filter1?.filter(elm => elm?.sValue === uri);
    setSelectFilter(filterdata[0]?.sValue);
    axios
      .get(baseURL + uri, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        response?.data?.data.records.map((row, index) => (row["id"] = index + 1));
        let items = [];
        for (let i = 0; i < response?.data?.data.records.length; i++) {
          let elm = response?.data?.data.records[i];
          elm.id = i + 1;
          items.push(elm);
        }
        const dates = [];
        formdata?.fixcolumns?.forEach((clm) => {
          if(clm.sType === "date") dates.push(clm.sColumnID); 
        })
        if(items && items.length > 0){
          items.forEach((itm) => {
            for(let i = 0; i < dates.length; i++){
              if(!itm[dates[i]]){
                itm[dates[i]] = "";
              }
            }
          })
        }
        if(formdata && formdata.fixcolumns && formdata.fixcolumns.length > 0){
          formdata.fixcolumns.forEach((clm) => {
            if(clm.sType === 'number'){
              for(let i = 0; i < items.length; i++){
                if(items[i][clm.sColumnID] == 0){
                  items[i][clm.sColumnID] = String(items[i][clm.sColumnID]);
                }
              }
            }
          })
        }
        setRows(items);
        // response?.data?.data.records.map(
        //   (row, index) => (row["id"] = row[formDetails.sPrimaryKey])
        // );
        // setRows(response?.data?.data.records);
      })
      .catch(error => console.log(error));
  };

  // useEffect(() => {
  //   handleFilter1()
  // },[pathname]);

  const cancelItem = (id, params) => {
    // editApi, setEditApi,
    const EditData = data?.details.filter((item, index) => item?.component?.sFormAction === "EDIT");

    setEditApi(
      `${EditData[0]?.component?.sFormSource}${params?.row[mainFormData.form.sPrimaryKey]}`
    );

    if (formdata.data.sAction.actionCancelType === "dialog") {
      const mode = {
        options: {
          mode: "DEFAULT",
          handler: "handleDialog",
          dialog: formdata.data.sAction.actionCancel
        }
      };
      // setModalActionTypeAndID({ type: "edit", id: params?.row[mainFormData.form.sPrimaryKey] });
      setModalActionTypeAndID({
        type: "delete",
        id: params?.row[mainFormData.form.sPrimaryKey],
        row: params?.row,
        PrimaryKey: params?.row[mainFormData.form.sPrimaryKey]
      });
      // alert(JSON.stringify({
      //   type: "delete",
      //   id: params?.row[mainFormData.form.sPrimaryKey],
      //   row: params?.row,
      //   PrimaryKey: params?.row[mainFormData.form.sPrimaryKey]
      // }));
      // setModalEditData(params.row);

      handleClickOpen(mode);
    } else {
      navigate(
        formdata.data.sAction.actionCancel + "?id=" + params?.row[mainFormData.form.sPrimaryKey],
        { state: { id: params?.row[mainFormData.form.sPrimaryKey] } }
      );
    }
  };
  const editItem = (id, params) => {
    // editApi, setEditApi,

    const EditData = data?.details.filter((item, index) => item?.component?.sFormAction === "EDIT");

    setEditApi(
      `${EditData[0]?.component?.sFormSource}${params?.row[mainFormData.form.sPrimaryKey]}`
    );

    if (formdata.data.sAction.actionEditType === "dialog") {
      const mode = {
        options: {
          mode: "DEFAULT",
          handler: "handleDialog",
          dialog: formdata.data.sAction.actionEdit
        }
      };
      setModalActionTypeAndID({ type: "edit", id: params?.row[mainFormData.form.sPrimaryKey] });
      setModalEditData(params.row);

      handleClickOpen(mode);
    } else {
      // alert(mainFormData.form.sPrimaryKey)
      navigate(
        formdata.data.sAction.actionEdit + "?id=" + params?.row[mainFormData.form.sPrimaryKey],
        { state: { id: params?.row[mainFormData.form.sPrimaryKey] } }
      );
    }
  };

  const viewItem = (id, params) => {
    if (formdata.data.sAction.actionViewType === "dialog") {
      const mode = {
        options: {
          mode: "DEFAULT",
          handler: "handleDialog",
          dialog: formdata.data.sAction.actionView
        }
      };
      handleClickOpen(mode);
    } else if (formdata.data.sAction.actionViewType === "overlay-url") {
      // alert('kk')
      let keyName = mainFormData.form.sPrimaryKey;
      let value = params?.row?.[data.form.sPrimaryKey];
     
      const result = findObjects(rows, keyName, value);
     
      if (id && formdata.data.sAction.actionView) {
        // alert(id)
        setOverLaySplit(true);
        setOverLayDataFetchApi(
          formdata.data.sAction.actionView +
            `?id=${id}&next=${result?.nextOBJ?.[keyName] || null}&pre=${
              result?.preOBJ?.[keyName] || null
            }`
        );
        window.history.pushState(
          {},
          "",
          `?id=${id}&next=${result?.nextOBJ?.[keyName] || null}&pre=${
            result?.preOBJ?.[keyName] || null
          }`
        );
        // navigate(formdata.data.sAction.actionView + `?id=${id}&next=${result?.nextOBJ?.[keyName]||null}&pre=${result?.preOBJ?.[keyName]||null}`);
      }
    } else {
      // navigate(formdata.data.sAction.actionView + "&id=" + id);
      // alert(JSON.stringify(prams))
      let keyName = mainFormData.form.sPrimaryKey;
      let value = params?.row?.[mainFormData.form.sPrimaryKey];
      const result = findObjects(rows, keyName, value);
      // alert(JSON.stringify(result))
      if (id && formdata.data.sAction.actionView) {
        // alert(id)
        navigate(
          formdata.data.sAction.actionView +`?id=${id}`
        );
      }
    }
  };

  const printIten = () => {
    if (formdata.data.sAction.actionPrintType === "dialog") {
      const mode = {
        options: {
          mode: "DEFAULT",
          handler: "handleDialog",
          dialog: formdata.data.sAction.actionPrint
        }
      };
      handleClickOpen(mode);
    } else {
      // navigate(formdata.data.sAction.actionView + "&id=" + id);
      navigate(formdata.data.sAction.actionPrint);
    }
  };
  const deleteItem = params => {
    if (formdata.data.sAction.actionDeleteType === "dialog") {
      const mode = {
        options: {
          mode: "DEFAULT",
          handler: "handleDialog",
          dialog: formdata.data.sAction.actionDelete
        }
      };
      // alert(mainFormData.form.sPrimaryKey)
      setModalActionTypeAndID({
        type: "delete",
        id: params?.row[mainFormData.form.sPrimaryKey],
        row: params?.row,
        PrimaryKey: params?.row[mainFormData.form.sPrimaryKey]
      });

      handleClickOpen(mode);
    }
  };

  // const editItem = React.useCallback( id => () => {
  //     /*setTimeout(() => {
  //       setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  //     }); */
  //     // navigate(formdata.data.sAction.actionEdit + "&id=" + id);
  //   },
  //   []
  // );

  // const viewItem = React.useCallback(
  //   id => () => {
  //     /*setTimeout(() => {
  //       setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  //     }); */

  //     navigate(formdata.data.sAction.actionView + "&id=" + id);
  //   },
  //   []
  // );

  /*
  const toggleAdmin = React.useCallback(
    (id) => () => {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, isAdmin: !row.isAdmin } : row,
        ),
      );
    },
    [],
  );*/

  /*
  const duplicateUser = React.useCallback(
    (id) => () => {
      setRows((prevRows) => {
        const rowToDuplicate = prevRows.find((row) => row.id === id);
        return [...prevRows, { ...rowToDuplicate, id: Date.now() }];
      });
    },
    [],
  );
  */

  const [isViewRestricted, setViewRestricted] = useState(false);
  const [isDELETERestricted, setDELETERestricted] = useState(false);
  const [isEDITRestricted, setEDITRestricted] = useState(false);
  const [isCANCELRestricted, setCANCELRestricted] = useState(false);
  const [isPRINTRestricted, setPRINTRestricted] = useState(false);

  function fetchActivity(activity) {
    const urlCapture =
      serverAddress +
      `/form/isallowed/transaction?module=${data?.form?.sFormName}&activity=${activity}`;
    axios
      .get(urlCapture, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      })
      .then(result => {
        if (result.data.data.Access == "No") {
          if (activity == "VIEW") {
            setViewRestricted(true);
          } else if (activity == "EDIT") {
            setEDITRestricted(true);
          } else if (activity == "DELETE") {
            setDELETERestricted(true);
          } else if (activity == "PRINT") {
            setPRINTRestricted(true);
          } else if (activity == "TXCANCEL") {
            setCANCELRestricted(true);
          }
        }
      })
      .catch(error => {
        console.error(error, "error456");
      });
  }

  useEffect(() => {
    // if (data?.component.options.action !== "CANCEL" && data?.component.options.action !== "CLOSE") {
    fetchActivity("ADD");
    fetchActivity("EDIT");
    fetchActivity("DELETE");
    fetchActivity("VIEW");
    fetchActivity("PRINT");
    fetchActivity("TXCANCEL");
    // }
    return () => {
      setViewRestricted(false);
      setEDITRestricted(false);
      setDELETERestricted(false);
    };
  }, [mainFormData, data, overlaySplit]);

  const handleChange = event => {
    setFilter1(event.target.value);
  };
  const formatDate = (date, format) => {

    // alert(JSON.stringify(`${date}--${date == 'Invalid Date'}`))    

    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    // let formattedDate = (date && data != 'Invalid Date' )? new Intl.DateTimeFormat("en-US", options)?.format(new Date(date?date:"")):"";
    let formattedDate = (date && !isNaN(new Date(date).getTime())) 
    ? new Intl.DateTimeFormat("en-US", options)?.format(new Date(date)) 
    : "";
    const [month, day, year] = formattedDate.split("/");

    switch (format) {
      case "dd-mm-yyyy":
        return `${day}-${month}-${year}`;
      case "mm-dd-yyyy":
        return `${month}-${day}-${year}`;
      case "yyyy-mm-dd":
        return `${year}-${month}-${day}`;
      default:
        return formattedDate; // Default to mm/dd/yyyy if format not recognized
    }
  };
  // const formatData = 'mm-dd-yyyy';
  const columns = [];
  formdata?.fixcolumns?.forEach((item, index) => {
    if (item.sType == "date") {
      columns.push({
        field: item.sColumnID,
        headerName: item.sHeader,
        width: item.iWidth,
        editable: item.bEditable,
        type: item.sType,
        sortable: item.bSortable,
        valueGetter: params => new Date(params.value),
        renderCell: params => (
          <div id={formdata?.component?.sName + "-" + item.sColumnID + "-" + params.row.id}>
            <Typography>
              {formatDate(params.value, item.sFormat)}
              {/* {JSON.stringify(item)} */}
            </Typography>
          </div>
        )
      });
    } else if (item.sType == "string") {
      columns.push({
        field: item.sColumnID,
        headerName: item.sHeader,
        width: item.iWidth,
        editable: item.bEditable,
        type: item.sType,
        sortable: item.bSortable,
        renderCell: (params, ii) => {
          let sysObj = findObjectByFieldValue(params.value, item.sColumnID);
          const parsedData = sysObj?.sFieldFormat ? JSON.parse(sysObj?.sFieldFormat) : {};
          const Icons = MUIICon[sysObj?.sStatusIcon];
       
          return (
            <>
              <div id={formdata?.component?.sName + "-" + item.sColumnID + "-" + params.row.id}>
                {/* {JSON.stringify()} */}
                <Typography {...parsedData}>
                  {" "}
                  {sysObj?.sStatusIcon && <Icons />}{" "}
                  <span dangerouslySetInnerHTML={{ __html: params.value }} />
                </Typography>
              </div>
            </>
          );
          // return <Typography>{params.value}</Typography>;
        }
      });
    } else if (item.sType == "number") {
      columns.push({
        field: item.sColumnID,
        headerName: item.sHeader,
        width: item.iWidth,
        editable: item.bEditable,
        type: item.sType,
        sortable: item.bSortable,
        renderCell: params => {
          const data = sprintf(item.sFormat || "", params.value || "");
          const formatter = new Intl.NumberFormat("en-US", {
            // style: 'currency',
            currency: "USD",
            minimumFractionDigits: 2
          });
          return (
            <>
              <div id={formdata?.component?.sName + "-" + item.sColumnID + "-" + params.row.id}>
                {" "}
                <Typography>{formatter.format(data)}</Typography>
              </div>
            </>
          );
        }
      });
    } else {
      columns.push({
        field: item.sColumnID,
        headerName: item.sHeader,
        width: item.iWidth,
        editable: item.bEditable,
        type: item.sType,
        sortable: item.bSortable,
        renderCell: params => {
          return (
            <div id={formdata?.component?.sName + "-" + item.sColumnID + "-" + params.row.id}>
              {" "}
              <Typography>{params.value}</Typography>
            </div>
          );
        }
      });
    }
  });
  columns.push({
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: 250,
    getActions: params => {
      const items = [];
      // console.log('kkoop',params);
      if (formdata.data.sAction.actionEdit && formdata.data.sAction.actionEdit !== "") {
        items.push(
          <>
            {/* {JSON.stringify(formdata.data)} */}
            <GridActionsCellItem
              disabled={isEDITRestricted}
              icon={
                <EditOutlinedIcon
                  color={isEDITRestricted ? "text.secondary" : "primary"}
                  sx={{ fontSize: "16px" }}
                />
              }
              label="Edit"
              // id={formdata.component.sName + "-edit-" + params.row.id}
              id={formdata.component.sName + "-edit-" + params.row[mainFormData.form.sPrimaryKey]}
              onClick={() => {
                setFreeFormTabbleEditMainrecord([]);
                editItem(params.id, params);
              }}
            />
          </>
        );
      }

      if (formdata.data.sAction.actionView && formdata.data.sAction.actionView !== "") {
        items.push(
          <GridActionsCellItem
            icon={
              <RemoveRedEyeOutlinedIcon
                color={isViewRestricted ? "text.secondary" : "success"}
                sx={{ fontSize: "16px" }}
              />
            }
            label="View"
            // id={formdata.component.sName + "-view-" + params.row.id}
            id={formdata.component.sName + "-view-" + params.row[mainFormData.form.sPrimaryKey]}
            disabled={isViewRestricted}
            onClick={() => viewItem(params.row[mainFormData.form.sPrimaryKey], params)}
          />
        );
      }
      if (formdata.data.sAction.actionCancel && formdata.data.sAction.actionCancel !== "") {
        items.push(
          <GridActionsCellItem
            disabled={isCANCELRestricted}
            icon={
              <CancelIcon
                color={isCANCELRestricted ? "text.secondary" : "error"}
                sx={{ fontSize: "16px" }}
              />
            }
            label="Edit"
            // id={formdata.component.sName + "-cancel-" + params.id}
            id={formdata.component.sName + "-cancel-" + params.row[mainFormData.form.sPrimaryKey]}
            onClick={() => cancelItem(params.id, params)}
          />
        );
      }
      if (formdata.data.sAction.actionDelete && formdata.data.sAction.actionDelete !== "") {
        items.push(
          <GridActionsCellItem
            disabled={isDELETERestricted}
            icon={
              <DeleteIcon
                color={isDELETERestricted ? "text.secondary" : "error"}
                sx={{ fontSize: "16px" }}
              />
            }
            label="delete"
            // id={formdata.component.sName + "-delete-" + params.id}
            id={formdata.component.sName + "-delete-" + params.row[mainFormData.form.sPrimaryKey]}
            onClick={() => deleteItem(params)}
          />
        );
      }
      if (formdata.data.sAction.actionPrint && formdata.data.sAction.actionPrint !== "") {
        items.push(
          <GridActionsCellItem
            icon={<PrintIcon sx={{ fontSize: "16px" }} />}
            disabled={isPRINTRestricted}
            label="print"
            id={formdata.component.sName + "-print-" + params.id}
            onClick={() => printIten(params.id)}
          />
        );
      }

      return items;
    }
  });

  function parseMenuProps(sMenuProps) {
    try {
      const menuPropsObject = JSON.parse(sMenuProps);
      return menuPropsObject;
    } catch (error) {
      console.error("Error parsing :", error);
      return null;
    }
  }

  useEffect(() => {
    setSelectFilter(filter1[0]?.sValue);
  }, [filter1, pathname]);

  useEffect(() => {
    if (formdata?.data?.sDataAware?.replace(/[{}]/g, "") != "") {
      if (textValue[formdata?.data?.sDataAware?.replace(/[{}]/g, "")]) {
        fetchDataHandleDataGrid();
      } else {
        setRows([]);
      }
    } else {
      fetchDataHandleDataGrid();
    }
  }, [
    formdata,
    rows.id,
    filter1,
    filter2,
    filter3,
    filter4,
    pathname,
    formdata.data.sDataSource,
    textValue[formdata?.data?.sDataAware?.replace(/[{}]/g, "")]
  ]);

  // alert(JSON.stringify(rows))
  useEffect(() => {
    setFetchDataHandleDataGrid({
      fetchDataHandleDataGrid: handleFilter1,
      uri: selectFilter || formdata.data.sDataSource
    });
  }, [
    selectFilter,
    formdata,
    rows.id,
    filter1,
    filter2,
    filter3,
    filter4,
    pathname,
    formdata.data.sDataSource
  ]);
  // alert(JSON.stringify(rows))

  const handleRowSelection = (selectionModelArray, data) => {

    // multiple selection of data
    setMultiDocumentSelectData(getObjectsByIndex(rows,selectionModelArray))


    let arr = selectionModelArray[selectionModelArray.length - 1];
    // alert(JSON.stringify(arr))

    // const selectionModel = selectionModelArray[selectionModelArray.length - 1];
    // alert(JSON.stringify(selectionModel))

    const indexSet =  new Set([arr].map(index => parseInt(index, 10)));

    // Filter the data based on whether the index exists in the set
    const filteredData = data.filter((item, index) => indexSet.has(index + 1));
    setselectedRowsDataGrid(filteredData);
    // alert(JSON.stringify(filteredData));
    // console.log("Selected rows:", filteredData);
    
    // alert(JSON.stringify());
    
    setTimeout(() => {
      viewItem(filteredData[0]?.[mainFormData.form.sPrimaryKey], { row: filteredData[0] });
    }, 1000);
    // alert(filteredData[0]?.[mainFormData.form.sPrimaryKey] )
  };
  function findObjectByFieldValue(fieldValue, columnName) {
    const foundObject = format?.data?.records?.find(
      item => item.sFieldValue === fieldValue && item.sFieldName == columnName
    );
    return foundObject || {};
  }

  function getObjectsByIndex(data, indexArray) {
    return indexArray
    .filter(i => i !== undefined && i > 0 && i <= data.length) // Filter out undefined, out-of-bounds, or non-positive positions
    .map(i => data[i - 1]); // Convert 1-based position to 0-based index
  }
  return (
    <>
      <>
        {/* {
rows.length>0? 
*/}
        <>
          <Grid container alignItems="center">
            {/* successMessage */}
            {/* {JSON.stringify(formdata.data.sFilters.filter1.sName + '-filter-label')} */}
            <Grid item>
              {formdata?.data?.sFilters?.filter1?.enabled === true ? (
                <Typography
                  id={formdata.data.sFilters.filter1.sName + "-filter-label"}
                  {...formdata.data.sFilters.filter1.sLabelProps}
                >
                  {formdata.data.sFilters.filter1.sLabel}
                </Typography>
              ) : null}
            </Grid>
            <Grid item {...formdata.data.sFilters.filter1.sSelectProps}>
              {formdata?.data?.sFilters?.filter1?.enabled === true ? (
                <Box>
                  <FormControl {...formdata.data.sFilters.filter1.sSelectProps}>
                    <Select
                      id={formdata.data.sFilters.filter1.sName}
                      onChange={(e, t) => handleFilter1(e.target.value)}
                      value={selectFilter || ""} // Set the value prop to the default value
                    >
                      {filter1?.map(item => (
                        <MenuItem key={item?.sValue} value={item?.sValue}>
                          {item?.sChoice}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              ) : null}
            </Grid>

            <Grid item>
              {formdata?.data?.sFilters?.filter2?.enabled === true ? (
                <Typography {...formdata.data.sFilters.filter2.sLabelProps}>
                  {formdata.data.sFilters.filter2.sLabel}
                </Typography>
              ) : null}
            </Grid>
            <Grid item xs={1}>
              {formdata?.data?.sFilters?.filter2?.enabled === true ? (
                <Box>
                  <FormControl {...formdata.data.sFilters.filter2.sSelectProps}>
                    <Select id={formdata.data.sFilters.filter2.sName} defaultValue={"All"}>
                      {filter2?.map(item => (
                        <MenuItem value={item?.sValue}>{item?.sChoice}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              ) : null}
            </Grid>
            <Grid item>
              {formdata?.data?.sFilters?.filter3?.enabled === true ? (
                <Typography {...formdata.data.sFilters.filter3.sLabelProps}>
                  {formdata.data.sFilters.filter3.sLabel}
                </Typography>
              ) : null}
            </Grid>
            <Grid item xs={1}>
              {formdata?.data?.sFilters?.filter3?.enabled === true ? (
                <Box>
                  <FormControl {...formdata.data.sFilters.filter3.sSelectProps}>
                    <Select id={formdata.data.sFilters.filter3.sName} defaultValue={"All"}>
                      {filter3?.map(item => (
                        <MenuItem value={item?.sValue}>{item?.sChoice}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              ) : null}
            </Grid>
            <Grid item>
              {formdata?.data?.sFilters?.filter4?.enabled === true ? (
                <Typography {...formdata.data.sFilters.filter4.sLabelProps}>
                  {formdata.data.sFilters.filter4.sLabel}
                </Typography>
              ) : null}
            </Grid>
            <Grid item xs={1}>
              {formdata?.data?.sFilters?.filter4?.enabled === true ? (
                <Box>
                  <FormControl {...formdata.data.sFilters.filter4.sSelectProps}>
                    <Select id={formdata.data.sFilters.filter4.sName} defaultValue={"All"}>
                      {filter3?.map(item => (
                        <MenuItem value={item?.sValue}>{item?.sChoice}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              ) : null}
            </Grid>
          </Grid>
          <Box
            {...formdata.component?.options?.sParentContainerProps}
            {...formdata?.component?.options?.others1}
          >
            {/* {JSON.stringify(rows)} */}
            {/* {formdata.component.sName} */}
            <div id={formdata.component.sName}>
              <DataGrid
                id={formdata.component.sName}
                // slotProps={{id: formdata.component.sName}}
                rows={rows}
                loading={progress}
                columns={columns}
                {...formdata?.component?.sProps}
                slots={{
                  toolbar: GridToolbar,
                  loadingOverlay: progress ? CustomLoadingOverlay : "LinearProgress"
                }}
                // onSelectionModelChange={handleRowSelection}

                onRowSelectionModelChange={newRowSelectionModel => {
                  handleRowSelection(newRowSelectionModel, rows);

                  // alert(JSON.stringify(newRowSelectionModel));
                }}
                // rowSelectionModel={}
              />
            </div>
          </Box>
        </>
        {/* //   :
//   <div
//   style={{
//     height: "75vh",
//     width: "80vw",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center"
//   }}
// >
//   <div>
//     <Spinner/>
//   </div>
// </div>
// } */}
      </>
    </>
  );
}
