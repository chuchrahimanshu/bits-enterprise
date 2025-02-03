import * as React from "react";
import { useState, useEffect } from "react";
import { baseURL } from "../../api";
import axios from "axios";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Global_Data } from "../../globalData/GlobalData";
import { sprintf } from "sprintf-js";
import VARCUSTOMHTML from "../../component/VARCUSTOMHTML/VARCUSTOMHTML";
import VarDateTime from "../../component/VARDATETIME/VarDateTime";
import VARNUMBER from "../../component/VARNUMBER/VARNUMBER";
import IconButton from '@mui/material/IconButton';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

export default function ColumnTypesTable({
  varValue,
  setVarValue,
  format,
  formdata,
  formDetails,
  recordData,
  renderComponent
}) {
  //const [rows, setRows] = React.useState("");
  const { token, textValue, varCutomDialogApi, setModalActionTypeAndID, setModalEditData, handleClickOpen } = Global_Data();
  const [tableRecords, setTableRecords] = useState([]);

  function getQueryParams(url) {
    if (url) {
      const urlObj = new URL(url, baseURL);
      const params = urlObj.searchParams;
      const queryParams = {};
      params.forEach((value, key) => {
        queryParams[key] = value;
      });

      return queryParams;
    }
  }

  function populateQueryParams(url, options) {
    return url.replace(/\[([^\]]+)\]/g, (match, key) => options[key] || match);
  }

  const fetchData = uri => {
    if (!uri.includes('{')) {
      axios
        .get(baseURL + uri, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          // setRows(true);
          setTableRecords(response.data.data.records);
          // if (setVarValue) {
          //   setVarValue(response.data.data.records);
          // }
          // response.data.map((row, index) => row["id"] = row[formDetails.sPrimaryKey] );
          // setRows(response.data);
        })
        .catch(error => console.log(error));
    }
  };
  function replacePlaceholders(uri, data) {
    const regex = /{([^}]+)}/g;
    const replacedUri = uri.replace(regex, (match, key) => {
      return key in data ? data[key] : match;
    });
    return replacedUri;
  }

  const url = window.location.href;
  const urlObj = new URL(url);
  const id = urlObj.searchParams.get("id");

  useEffect(() => {
    if (formdata.component.defaultLoad.bEnabled) {
      if (varCutomDialogApi) {
        fetchData(populateQueryParams(formdata.component.defaultLoad.sDataSource, getQueryParams(varCutomDialogApi)));
      } else {
        fetchData(formdata.component.defaultLoad.sDataSource);
      }
    } else if (formdata.data.bCascade) {
      fetchData(
        replacePlaceholders(
          formdata.data.sDataSource,
          textValue[formdata?.data?.sDataAware?.replace(/[{}]/g, "")]
            ? textValue
            : { [formdata?.data?.sDataAware?.replace(/[{}]/g, id)]: "" }
        )
      );
    } else {
      setTableRecords(recordData?.data?.tablerecords[1].tabledetails);
    }
  }, [formdata, textValue[formdata?.data?.sDataAware?.replace(/[{}]/g, "")]]);

  /* useEffect(() => {
    axios
    .get(baseURL+formdata.data.sDataSource)
    .then((response) => {
    setRows(true);
    console.log(response.data);
    response.data.map((row, index) => row["id"] = row[formDetails.sPrimaryKey] );
    setRows(response.data);
    });
    }, [rows.id]);

    function priceRow(qty, unit) {
        return qty * unit;
      }
      
      function createRow(col_items1, col_qty, col_rate, col_disc) {
        const col_amount = priceRow(col_qty, col_rate) * col_disc;
        return { col_items1, col_qty, col_rate, col_disc, col_amount };
      }
      
      function subtotal(items) {
        return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
      }
      
      const rows = [
        createRow('Paperclips (Box)', 100, 1.15, 0.10),
        createRow('Paper (Case)', 10, 45.99, 0.10),
        createRow('Waste Basket', 2, 17.99, 0.10),
      ];
*/

  if (recordData?.metadata?.status === "OK") {
    let finaldata = [];
    let finaldata1 = [];
    let tbrecs = recordData?.data[1]?.tablerecords;

    //get each table record
    /*tableRecords.forEach(element => {
        if (element?.sInputTableName === formdata?.component?.sName) {
            setTableRecords({element});
        }
    });*/

    tbrecs?.forEach(item => {
      if (item?.sInputTableName === formdata?.component?.sName) {
        tableRecords.push(item);
      }
    });
  }

  const columns = [];
  formdata?.child?.forEach((item, index) => {
    item.inputtable?.bHidden != 1 &&
      columns.push({
        field: item.inputtable?.sColumnID,
        headerName: item.inputtable?.sHeader,
        width: item.inputtable?.iWidth,
        editable: item.inputtable?.bEditable,
        sortable: item.inputtable?.iOrder,
        props: item.inputtable?.sProps,
        component: item.component
      });
  });

  formdata?.fixcolumns?.forEach((item, index) => {
    columns.push({
      field: item?.sColumnID,
      headerName: item?.sHeader,
      width: item?.iWidth,
      editable: item?.bEditable,
      sortable: item?.bSortable,
      props: item?.sProps
    });
  });

  function getKeyByValue(obj, value) {
    for (let key in obj) {
      if (obj[key] === value) {
        return key;
      }
    }
    return null;
  }

  if (formdata?.component.hasOwnProperty("sAction")) {
    columns.push({
      field: "actions",
      headerName: "Actions",
      width: 250,
    })
  }

  const editIconButtonClicked = (record, id) => {

    // const EditData = data?.details.filter((item, index) => item?.component?.sFormAction === "EDIT");
    // setEditApi(
    //   `${EditData[0]?.component?.sFormSource}${params?.row[mainFormData.form.sPrimaryKey]}`
    // );
    // console.log("kjqewbfdkjqbvwjebqw", formdata);
    if (formdata.component.sAction.actionEditType === "dialog") {
      const mode = {
        options: {
          mode: "DEFAULT",
          handler: "handleDialog",
          dialog: formdata.component.sAction.actionEdit
        }
      };
      setModalActionTypeAndID({ type: "edit", id: record[formdata.component.sAction.sPrimaryKey] });
      setModalEditData(record);
      handleClickOpen(mode);
    } 
    // else {
    //   // alert(mainFormData.form.sPrimaryKey)
    //   navigate(
    //     formdata.data.sAction.actionEdit + "?id=" + params?.row[mainFormData.form.sPrimaryKey],
    //     { state: { id: params?.row[mainFormData.form.sPrimaryKey] } }
    //   );
    // }
  };

  return (
    <>
      <TableContainer component={Box} {...formdata?.component?.sProps}>
        <Table aria-label="spanning table">
          <TableHead>
            <TableRow>
              {columns?.map(col => (
                <TableCell align="center">{col?.headerName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRecords?.map((record, ind) => (
              <TableRow>
                {(function () {
                  var colID = 0;
                  return formdata?.child.map((child, i) => {
                    colID = colID + 1;
                    return (
                      child.inputtable?.bHidden != 1 && (
                        <>
                          <TableCell style={{ textAlign: "center" }}>
                            {/* {tableRecords[ind]?.[child.component.sName]} */}
                            {child.component.sType == "VARCUSTOMHTML" && (
                              <VARCUSTOMHTML
                                data={child}
                                format={format}
                                varValue={varValue}
                                id={
                                  formdata.component.sName +
                                  "-" +
                                  child.component.sName +
                                  "-" +
                                  (ind + 1)
                                }
                                value={tableRecords[ind]?.[child.component.sName] || tableRecords[ind]?.[getKeyByValue(formdata.component.defaultLoad.sMapping, child.inputtable.sColumnID)]}
                              />
                            )}
                            {child.component.sType == "VARTEXT" && (
                              <VartextComp
                                data={child}
                                id={
                                  formdata.component.sName +
                                  "-" +
                                  child.component.sName +
                                  "-" +
                                  (ind + 1)
                                }
                                value={tableRecords[ind]?.[child.component.sName] || tableRecords[ind]?.[getKeyByValue(formdata.component.defaultLoad.sMapping, child.inputtable.sColumnID)]}
                                format={format}
                                varValue={varValue}
                              />
                            )}

                            {child.component.sType == "VARDATETIME" && (
                              <>
                                {/* {tableRecords[ind]?.[child.component.sName]} */}
                                <VarDateTime
                                  data={child}
                                  id={
                                    formdata.component.sName +
                                    "-" +
                                    child.component.sName +
                                    "-" +
                                    (ind + 1)
                                  }
                                  value={tableRecords[ind]?.[child.component.sName] || tableRecords[ind]?.[getKeyByValue(formdata.component.defaultLoad.sMapping, child.inputtable.sColumnID)]}
                                />
                              </>
                            )}
                            {child.component.sType == "VARNUMBER" && (
                              <>
                                <VARNUMBER
                                  data={child}
                                  value={tableRecords[ind]?.[child.component.sName] || tableRecords[ind]?.[getKeyByValue(formdata.component.defaultLoad.sMapping, child.inputtable.sColumnID)]}
                                  varValue={varValue}
                                  format={format}
                                  id={
                                    formdata.component.sName +
                                    "-" +
                                    child.component.sName +
                                    "-" +
                                    (ind + 1)
                                  }
                                />
                              </>
                            )}
                          </TableCell>
                        </>
                      )
                    );
                  });
                })()}
                {formdata?.component?.hasOwnProperty("sAction") && <>
                  <TableCell sx={{display: "flex", justifyContent: "center"}}>
                    {formdata.component.sAction.actionEdit && formdata.component.sAction.actionEdit !== "" &&
                      <IconButton label="Edit" onClick={() => editIconButtonClicked(record, ind + 1)}>
                        <ModeEditOutlineOutlinedIcon color="primary" sx={{ fontSize: "16px" }} />
                      </IconButton>
                    }
                    {formdata.component.sAction.actionView && formdata.component.sAction.actionView !== "" &&
                      <IconButton label="View">
                        <RemoveRedEyeOutlinedIcon color="success" sx={{ fontSize: "16px" }} />
                      </IconButton>
                    }
                    {formdata.component.sAction.actionCancel && formdata.component.sAction.actionCancel !== "" &&
                      <IconButton label="Cancel">
                        <CancelIcon color="error" sx={{ fontSize: "16px" }} />
                      </IconButton>
                    }
                    {formdata.component.sAction.actionDelete && formdata.component.sAction.actionDelete !== "" &&
                      <IconButton label="Delete">
                        <DeleteIcon color="error" sx={{ fontSize: "16px" }} />
                      </IconButton>
                    }
                    {formdata.component.sAction.actionPrint && formdata.component.sAction.actionPrint !== "" &&
                      <IconButton label="Print">
                        <LocalPrintshopIcon sx={{ fontSize: "16px" }} />
                      </IconButton>
                    }
                  </TableCell>
                </>}
              </TableRow>
            ))}
            {/* { formdata?.child.map(child => child.inputtable?.bHidden != 1 && <TableCell > { renderComponent([child]) } </TableCell> )}*/}
            {/* ))} */}
            {/* {tableRecords[0]?.tabledetails !== undefined
            ? tableRecords[0]?.tabledetails?.map(row => (
                <TableRow>
                  {columns?.map(col => (
                    <TableCell {...col?.props}>{row[col?.field]}</TableCell>
                  ))}
                </TableRow>
              ))
            : null} */}
            {/* {tableRecords[0]?.tablesummary !== undefined
            ? tableRecords[0]?.tablesummary.map(row =>
                row.sSummaryID === "summ_subtotal" ? (
                  <TableRow>
                    <TableCell rowSpan={6} />
                    <TableCell colSpan={1} />
                    <TableCell>{row.sLabel}</TableCell>
                    <TableCell align="center">{row.sInputValue}</TableCell>
                    <TableCell align="center">{row.sValue}</TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={1} />
                    <TableCell>{row.sLabel}</TableCell>
                    <TableCell align="center">{row.sInputValue}</TableCell>
                    <TableCell align="center">{row.sValue}</TableCell>
                  </TableRow>
                )
              )
            : null} */}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

function VartextComp({ data, value, id, format, varValue }) {
  const formatedData = value != undefined ? sprintf(data.component.sDisplayFormat, value) : "";
  function addThousandSeparatorToNumber(numberString) {
    const formattedNumber = parseFloat(numberString).toFixed(2);
    const [integerPart, decimalPart] = formattedNumber.split(".");
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formattedIntegerPart}.${decimalPart}`;
  }

  function formatAllNumbersInString(input) {
    return input.replace(/-?\d+(\.\d+)?/g, match => addThousandSeparatorToNumber(match));
  }
  const styleFormat = format?.data?.records?.find(
    item => item?.sFieldName == data?.component?.sName && item?.sFieldValue == value
  );
  const parsedData = styleFormat ? JSON.parse(styleFormat?.sFieldFormat) : {};

  return (
    <>
      <Typography id={id} name={data.component.sName} {...data.component.sProps} {...parsedData}>
        {formatedData == "undefined" ? (
          ""
        ) : (
          <span dangerouslySetInnerHTML={{ __html: formatedData }} />
          // <span dangerouslySetInnerHTML={{ __html: formatAllNumbersInString(formatedData) }} />
        )}
      </Typography>
      {/* {
       <Vartext data={data} varValue={varValue} format={format} />
      } */}
    </>
  );
}
