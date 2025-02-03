import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import AutoComplete from "../AutoComplete/AutoComplete";
import TextField from "@mui/material/TextField";
import DateComponent from "../DateComponent/DateComponent";
import CheckBoxComponent from "../CheckBox/CheckBoxComponent";
import SelectMainComponent from "../SelectComponent/SelectMainComponent";
import Button from "@mui/material/Button";
import { IconButton, Typography } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";
import { baseURL } from "../../api";
import dayjs from "dayjs";

const TableComponent = ({
  data,
  isSubmited,
  tabledata,
  tablesummaryfields,
  tablefreeformfield,
  formAction,
  formdata,
}) => {
  const [subtotal1, setsubTotal] = useState(0);
  const [grand_total, setGrandtotal] = useState(0);
  const [subTotal, setSubTotal] = useState({});
  const [selectTax, setSelectTax] = useState();
  let urlCapture = window.location.pathname + window.location.search;

  // default data
  const [rows, setRows] = useState([]);
  const [freeForm, setFreeformdata] = useState([]);
  // end default

  useEffect(() => {
    const columns = { id: 1 };
    const freeclms = { id: 1 };
    let subtotalcols = {};
    // console.log(data);
    if (data?.component?.options?.mode === "DEFAULT" && data?.child) {
      data.child.forEach((item) => {
        switch (item.component.sType) {
          case "AUTOCOMPLETE":
          case "TEXTFIELD":
          case "CHECKBOX":
          case "SELECT":
            columns[item.component.sName] = "";
            break;
          case "DATETIME":
            let date = dayjs(data?.component?.sDefaultValue);
            let date_format = `${date.$D}-${date.$M}-${date.$y}`;
            freeclms[item.component.sName] = date_format;
          default:
            break;
        }
      });
    }
    if (data?.fixcolumns) {
      data.fixcolumns.forEach((item, index) => {
        switch (item.sColumnID) {
          case "col_qty":
          case "col_rate":
          case "col_disc":
          case "col_amount":
          case "col_description":
            columns[item.sColumnID] = "";
            break;
          default:
            break;
        }
      });
      data?.summaryfields?.sSummaryDetails?.forEach((item, index) => {
        switch (item.sFieldInput) {
          case "TEXTFIELD":
            switch (item.sSummaryID) {
              case "summ_handling":
              case "summ_shipping":
              case "summ_discount":
                subtotalcols[item.sSummaryID] = "";
                break;
              default:
                break;
            }
            break;
          case "none":
            switch (item.sSummaryID) {
              case "summ_subtotal":
              case "summ_grandtotal":
                subtotalcols[item.sSummaryID] = "";
                break;
              default:
                break;
            }
            break;
          case "SELECT":
            if (item.sSummaryID === "summ_tax") {
              subtotalcols[item.sSummaryID] = "";
            }
            break;
          default:
            break;
        }
      });
    }
    if (data?.component?.options?.mode === "FREEFORM" && data?.child) {
      data.child.forEach((item) => {
        switch (item.component.sType) {
          case "AUTOCOMPLETE":
          case "TEXTFIELD":
          case "CHECKBOX":
          case "SELECT":
            freeclms[item.component.sName] = "";
            break;
          case "DATETIME":
            let date = dayjs(data?.component?.sDefaultValue);
            let date_format = `${date.$D}-${date.$M}-${date.$y}`;
            freeclms[item.component.sName] = date_format;
          default:
            break;
        }
      });
    }

    setRows([columns]);
    setFreeformdata([freeclms]);
    setSubTotal(subtotalcols);
  }, [data]);

  useEffect(() => {
    axios
      .get(`${baseURL}/test/edit?test=inputtableEditResponse&id=`)
      .then((response) => {
        if (response?.data?.metadata?.status === "OK") {
          let finaldata = [];
          let finaldata1 = [];
          let data = response?.data?.data[1]?.tablerecords[0]?.tabledetails;
          let datahandling =
            response?.data?.data[1].tablerecords[0].tablesummary;
          let dataFreeForm =
            response?.data?.data[1]?.tablerecords[1]?.tabledetails;
          data.map((item, index = 1) => {
            finaldata.push({ ...item, id: index + 1 });
          });
          dataFreeForm.map((item, index = 1) => {
            finaldata1.push({ ...item, id: index + 1 });
          });
          if (formAction === "EDIT") {
            setRows(finaldata);
            setFreeformdata(finaldata1);

            const initialValues = {};
            for (const summary of datahandling) {
              initialValues[summary.sSummaryID] = summary.sInputValue;
            }
            setSubTotal(initialValues);
          }
        }
      });
  }, [formAction]);

  useEffect(() => {
    if (rows?.length && Object.values(rows[0])?.length > 1) {
      tabledata(rows);
    }

    if (Object.values(subTotal).length >= 2) {
      tablesummaryfields(subTotal);
    }

    if (freeForm?.length && Object.values(freeForm[0])?.length > 1) {
      tablefreeformfield(freeForm);
    }
  }, [rows, freeForm, subTotal]);

  useEffect(() => {
    if (isSubmited || urlCapture) {
   
      setRows([]);
      setFreeformdata([]);
      setSubTotal([]);
    }
  }, [isSubmited, urlCapture]);
  
  const takeInput = (e, id) => {
    const { name, value } = e.target;
    const list = [...rows];
    const index = list.findIndex((row) => row.id === id);
    list[index][name] = value;
    setRows(list);
    // setRows({ ...rows, [name]: value });
    updateAmount(id);
  };

  const updateAmount = (id) => {
    const rowIdx = rows.findIndex((item) => item.id === id);
    if (rowIdx === -1) return; // Row not found, do nothing

    const row = rows[rowIdx];
    const qty = parseFloat(row.col_qty || 0);
    const rate = parseFloat(row.col_rate || 0);
    const disc = parseFloat(row.col_disc || 0);

    const amount = qty * rate * (1 - disc / 100);
    const updatedRow = { ...row, col_amount: amount.toFixed(2) };
    const updatedRows = [...rows];
    updatedRows[rowIdx] = updatedRow;

    setRows(updatedRows);
  };

  const handleSelectChange = (prop) => (value) => {
  
    if (prop === "summ_tax") {
      let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
      console.log(sum_handle);
      let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
      console.log(sum_shipping);
      let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);
     
      const discountAmount =
        (total / 100) *
        Number(subTotal?.summ_discount ? subTotal?.summ_discount : 0);

      let new_total = Number(total) - Number(discountAmount);

      const taxAmount = (new_total / 100) * Number(value);

      let total_with_tax = Number(new_total) + Number(taxAmount);

      console.log(total_with_tax);
      setSubTotal({
        ...subTotal,
        summ_grandtotal: total_with_tax.toFixed(2),
      });
      setGrandtotal(total_with_tax.toFixed(2));
    }

    setSelectTax(value);
  };

  const columns = [];

  const summaryHandler = (prop, value) => (event) => {

    let new_total;
    if (prop === "ADD" && value === "summ_handling") {
      if (subTotal?.summ_shipping) {
        new_total =
          Number(event.target.value) +
          Number(subtotal1) +
          Number(subTotal.summ_shipping);
      } else {
        new_total = Number(event.target.value) + Number(subtotal1);
      }
    } else if (prop === "ADD" && value === "summ_shipping") {
      if (subTotal?.summ_handling) {
        new_total =
          Number(event.target.value) +
          Number(subtotal1) +
          Number(subTotal.summ_handling);
      } else {
        new_total = Number(event.target.value) + Number(subtotal1);
      }
    } else if (prop === "SUBTRACT" && value === "summ_discount") {
      let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
      let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
      let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);

      const discountAmount = (total / 100) * Number(event.target.value);

      new_total = Number(total) - discountAmount;
    } else if (prop === "SUBTRACT" && value === "summ_adjustment") {
      let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
      let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
      let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);
      new_total = Number(total) - Number(event.target.value);
    }
    setSubTotal({
      ...subTotal,
      [value]: event.target.value,
      summ_grandtotal: new_total.toFixed(2),
    });
    setGrandtotal(new_total.toFixed(2));
  };
  // use this const data in useState

  useEffect(() => {
    let subtotal1 = rows.reduce((sum, item) => {
      const amount = Number(item.col_amount);
      return sum + amount;
    }, 0);

    const subtotal =
      subtotal1 +
      (Number(subTotal.summ_handling) + Number(subTotal.summ_shipping));
    const discountPercentage = Number(subTotal.summ_discount); // assuming summdiscount is the discount percentage entered by the user
    const discountAmount = (discountPercentage / 100) * subtotal;

    let grand_total = 0;
    if (subtotal1) {
      grand_total = subtotal1;
    }

    // console.log("grand_total", grand_total);
    // if (subTotal.summ_handling) {
    //   grand_total = subtotal1 + Number(subTotal.summ_handling);
    // }
    // console.log("grand_total", grand_total);
    // if (subTotal.summ_shipping) {
    //   grand_total = subtotal1 + Number(subTotal.summ_shipping);
    // }
    // if (subTotal.summ_handling && subTotal.summ_shipping) {
    //   grand_total =
    //     subtotal1 +
    //     Number(subTotal.summ_handling) +
    //     Number(subTotal.summ_shipping);
    // }
    // if (discountAmount) {
    //   grand_total = subtotal1 - Number(subTotal.summ_discount);
    // }
    // if (
    //   subTotal.summ_handling &&
    //   subTotal.summ_shipping &&
    //   subTotal.summ_discount
    // ) {
    //   grand_total =
    //     subtotal1 +
    //     Number(subTotal.summ_handling) +
    //     Number(subTotal.summ_shipping) -
    //     discountAmount;
    // }
    // if (selectTax !== undefined) {
    //   if (
    //     subTotal.summ_handling &&
    //     subTotal.summ_shipping &&
    //     subTotal.summ_discount
    //   ) {
    //     let S_grand_total =
    //       subtotal1 +
    //       Number(subTotal.summ_handling) +
    //       Number(subTotal.summ_shipping) -
    //       discountAmount;
    //     let tax_grand_total = (selectTax / 100) * S_grand_total;
    //     grand_total = S_grand_total + tax_grand_total;
    //   }
    // }

    let grandsubtotal = isNaN(subtotal1) ? (subtotal1 = 0) : subtotal1;
    let grandvalue = isNaN(grand_total) ? (grand_total = 0) : grand_total;
    setGrandtotal(grand_total.toFixed(2));
    setsubTotal(grandsubtotal.toFixed(2));
    if (grandsubtotal && grandvalue) {
      // console.log(grandsubtotal);
      setSubTotal({
        ...subTotal,
        summ_subtotal: grandsubtotal.toFixed(2),
        summ_grandtotal: grandvalue,
      });
    }
  }, [
    rows,
    // subTotal.summ_shipping,
    // subTotal.summ_handling,
    // selectTax,
    // subTotal.summ_discount,
  ]);

  const FreeFormInput = (e, id) => {
    const { name, value } = e.target;
    const list = [...freeForm];
    const index = list.findIndex((row) => row.id === id);
    list[index][name] = value;
    setFreeformdata(list);
  };

  const formcallback = (e, id, name) => {
    if (e) {
      let { display = "", value = "" } = e || "";
      const list = [...rows];
      const index = list.findIndex((row) => row.id === id);
      list[index][name] = value;
      // list[index].sInvDesc = display;
      setRows(list);
    }
  };

  const FreeFormCallBack = (e, id, name) => {
    if (e) {
      let { display = "", value = "" } = e || "";
      const list = [...freeForm];
      const index = list.findIndex((row) => row.id === id);
      list[index][name] = value;
      // list[index].sInvDesc = display;
      setFreeformdata(list);
    }
  };

  const handledatachange = (e, id, name) => {
    const list = [...freeForm];
    const index = list.findIndex((row) => row.id === id);
    list[index][name] = e;
    setFreeformdata(list);
  };
  const handleAddRow = (e) => {
    const newRow = {
      id: rows.length + 1,
    };
    setRows([...rows, newRow]);
  };
  const handleAddRow1 = () => {
    const newRow = {
      id: freeForm.length + 1,
    };
    setFreeformdata([...freeForm, newRow]);
  };
  data.component?.options?.mode === "DEFAULT" &&
    data?.child?.forEach((item) => {
      // console.log(item);
      columns.push({
        field: item.inputtable.sColumnID,
        headerName: item.inputtable.sHeader,
        width: item.inputtable.iWidth,
        editable: item.inputtable.bEditable,
        // description: item.sDescription,
        sortable: false,
        // valueGetter: item.sValue,
        renderCell: (params) => {
          if (item.component.sType === "AUTOCOMPLETE") {
            return (
              <AutoComplete
                formcallback={(e) =>
                  formcallback(e, params.row.id, item?.component?.sName)
                }
                data={item}
                rowsdataFree={
                  rows &&
                  rows[params.row.id - 1] &&
                  rows[params.row.id - 1][item?.component?.sName]
                }
                Automod={data.component?.options?.mode}
                formaction={formAction}
                // rowsdataName={rows[params.row.id - 1].sInvDesc}
                {...item?.component?.sProps}
              />
            );
          } else if (item.component.sType === "TEXTFIELD") {
            return (
              <TextField
                name={item?.component?.sName}
                onChange={(e) => takeInput(e, params.row.id)}
                value={
                  rows &&
                  rows[params.row.id - 1] &&
                  rows[params.row.id - 1][item?.component?.sName]
                }
                {...item?.component?.sProps}
              />
            );
          } else if (item.component.sType === "DATETIME") {
            return (
              <DateComponent
                handledatechange={(e) =>
                  handledatachange(e, params.row.id, item?.component?.sName)
                }
                data={item}
                datavalue={
                  rows &&
                  rows[params.row.id - 1] &&
                  rows[params.row.id - 1][item.component.sName]
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
                onChange={(e) => takeInput(e, params.row.id)}
                datacheckvalue={
                  rows &&
                  rows[params.row.id - 1] &&
                  rows[params.row.id - 1][item.component.sName]
                }
                datemod={item.component?.options?.mode}
                formactions={formAction}
                {...item?.component?.sProps}
              />
            );
          } else if (item.component.sType === "SELECT") {
            return (
              <SelectMainComponent
                onChange={summaryHandler("summ_tax")}
                onChildSelect={handleSelectChange}
                data={data}
                selectTax={selectTax}
                summaryId={"summ_tax"}
                {...data?.component?.sProps}
                taxUrl={item.sRoute}
              />
            );
          } else {
            return;
          }
        },
      });
    });
  data.component?.options?.mode === "FREEFORM" &&
    data?.child?.forEach((item) => {
      columns.push({
        field: item.inputtable.sColumnID,
        headerName: item.inputtable.sHeader,
        width: item.inputtable.iWidth,
        // editable: item.inputtable.bEditable,
        sortable: false,
        renderCell: (params) => {
          if (item.component.sType === "AUTOCOMPLETE") {
            return (
              <AutoComplete
                formcallback={(e) =>
                  FreeFormCallBack(e, params.row.id, item?.component?.sName)
                }
                data={item}
                rowsdataFree={
                  freeForm &&
                  freeForm[params.row.id - 1] &&
                  freeForm[params.row.id - 1][item?.component?.sName]
                }
                Automod={data.component?.options?.mode}
                formaction={formAction}
                {...item?.component?.sProps}
              />
            );
          } else if (item.component.sType === "TEXTFIELD") {
            return (
              <TextField
                name={item?.component?.sName}
                onChange={(e) => FreeFormInput(e, params.row.id)}
                value={
                  freeForm &&
                  freeForm[params.row.id - 1] &&
                  freeForm[params.row.id - 1][item.component.sName]
                }
                {...item?.component?.sProps}
              />
            );
          } else if (item.component.sType === "DATETIME") {
            return (
              <DateComponent
                handledatechange={(e) =>
                  handledatachange(e, params.row.id, item?.component?.sName)
                }
                data={item}
                datavalue={
                  freeForm &&
                  freeForm[params.row.id - 1] &&
                  freeForm[params.row.id - 1][item.component.sName]
                }
                datemod={data.component?.options?.mode}
                datatextvalue=""
                formaction={formAction}
                {...item?.component?.sProps}
              />
            );
          } else if (item.component.sType === "CHECKBOX") {
            // console.log(item);
            return (
              <CheckBoxComponent
                data={item}
                handleCheckbox={(e) =>
                  handledatachange(e, params.row.id, item?.component?.sName)
                }
                datacheckvalue={
                  freeForm &&
                  freeForm[params.row.id - 1] &&
                  freeForm[params.row.id - 1][item.component.sName]
                }
                datemod={data.component?.options?.mode}
                formactions={formAction}
                {...item?.component?.sProps}
              />
            );
          } else if (item.component.sType === "SELECT") {
            return (
              <SelectMainComponent
                handledatasend={(e) =>
                  handledatachange(e, params.row.id, item?.component?.sName)
                }
                taxUrlFree={item?.data?.sDataSource}
                sColumnID={"col_taxdescription"}
                data={data}
                {...data?.component?.sProps}
                datemod={data.component?.options?.mode}
                formaction={formAction}
                selectEdit={
                  freeForm &&
                  freeForm[params.row.id - 1] &&
                  freeForm[params.row.id - 1][item?.component?.sName]
                }
              />
            );
          } else {
            return;
          }
        },
      });
    });

  data?.fixcolumns?.forEach((item, index) => {
    switch (item.sColumnID) {
      case "col_qty":
      case "col_rate":
      case "col_disc":
        columns.push({
          field: item.sColumnID,
          headerName: item.sHeader,
          width: item.iWidth,
          editable: item.bEditable,
          type: item.sType,
          sortable: true,
          renderCell: (params) => (
            <TextField
              name={item.sColumnID}
              value={rows?.[params.row.id - 1]?.[item.sColumnID]}
              onChange={(e) => takeInput(e, params.row.id)}
              variant="outlined"
              size="small"
            />
          ),
        });
        break;
      case "col_amount":
        columns.push({
          field: item.sColumnID,
          headerName: item.sHeader,
          width: item.iWidth,
          editable: item.bEditable,
          type: item.sType,
          sortable: true,
          renderCell: (params) => rows?.[params.row.id - 1]?.[item.sColumnID],
        });
        break;
      case "col_description":
        columns.push({
          field: item.sColumnID,
          headerName: item.sHeader,
          width: item.iWidth,
          editable: item.bEditable,
          type: item.sType,
          sortable: true,
          renderCell: (params) => (
            <TextField
              name={item.sColumnID}
              value={rows?.[params.row.id - 1]?.[item?.component?.sName]}
              onChange={(e) => takeInput(e, params.row.id)}
              variant="outlined"
              size="small"
            />
          ),
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
          renderCell: (params) => (
            <TextField
              onChange={(e) => takeInput(e, params.row.id)}
              variant="outlined"
              size="small"
            />
          ),
        });
        break;
    }
  });

  data.component?.options?.mode === "DEFAULT" &&
    columns.push({
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const handleDelete = () => {
          const newRows = rows.filter((row) => row.id !== params.row.id);
          setRows(newRows);
        };
        if (params.row.id === 1) {
          return (
            <>
              <IconButton disabled aria-label="delete">
                <RemoveCircleOutlineIcon />
              </IconButton>
            </>
          );
        }
        return (
          <>
            <IconButton onClick={handleDelete} aria-label="delete">
              <RemoveCircleOutlineIcon />
            </IconButton>
          </>
        );
      },
    });
  if (data.component?.options?.mode === "FREEFORM") {
    columns.push({
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const handleDelete1 = () => {
          const newRows = freeForm.filter((row) => row.id !== params.row.id);
          setFreeformdata(newRows);
        };

        if (params.row.id === 1) {
          return (
            <IconButton disabled aria-label="delete">
              <RemoveCircleOutlineIcon />
            </IconButton>
          );
        } else {
          return (
            <IconButton onClick={handleDelete1} aria-label="delete">
              <RemoveCircleOutlineIcon />
            </IconButton>
          );
        }
      },
    });
  }

  return (
    <>
      <Box sx={{ width: "100%", marginBottom: "1rem" }}>
        {data.component?.options?.mode === "DEFAULT" ? (
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            pagination={false}
            disableColumnMenu={true}
            hideFooter={true}
            {...data.component.sProps}
          />
        ) : (
          <DataGrid
            autoHeight
            rows={freeForm}
            columns={columns}
            pagination={false}
            disableColumnMenu={true}
            hideFooter={true}
            {...data.component.sProps}
          />
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {data.component?.options?.mode === "DEFAULT" ? (
            <Box>
              <Button variant="outlined" onClick={(e) => handleAddRow(e)}>
                Add Row
              </Button>
            </Box>
          ) : (
            <Box>
              <Button variant="outlined" onClick={(e) => handleAddRow1(e)}>
                Add Row
              </Button>
            </Box>
          )}
          {/* {data.fixcolumns && (
            <Box {...data.summaryfields.sContainerProps}>
              {data?.summaryfields?.sSummaryDetails?.map((item, index) => {
                return (
                  <Box
                    key={item.sSummaryID}
                    py={1}
                    sx={{ display: "flex", align: "center", gap: 10 }}
                  >
                    <Typography>{item.sLabel}</Typography>
                    {item.sFieldInput === "TEXTFIELD" &&
                    item.sSummaryID === "summ_handling" ? (
                      <TextField
                        onChange={summaryHandler(
                          item?.sAction,
                          "summ_handling"
                        )}
                        value={subTotal.summ_handling}
                      />
                    ) : item.sFieldInput === "TEXTFIELD" &&
                      item.sSummaryID === "summ_shipping" ? (
                      <TextField
                        onChange={summaryHandler(
                          item?.sAction,
                          "summ_shipping"
                        )}
                        value={subTotal.summ_shipping}
                      />
                    ) : item.sFieldInput === "TEXTFIELD" &&
                      item.sSummaryID === "summ_discount" ? (
                      <TextField
                        onChange={summaryHandler(
                          item?.sAction,
                          "summ_discount"
                        )}
                        value={subTotal.summ_discount}
                      />
                    ) : item.sFieldInput === "none" &&
                      item.sSummaryID === "summ_subtotal" ? (
                      <Typography value={subTotal.summ_subtotal}>
                        {subtotal1 || 0}
                      </Typography>
                    ) : item.sFieldInput === "none" &&
                      item.sSummaryID === "summ_grandtotal" ? (
                      <Typography value={subTotal.summ_grandtotal}>
                        {grand_total || 0}
                      </Typography>
                    ) : item.sFieldInput === "SELECT" &&
                      item.sSummaryID === "summ_tax" ? (
                      <SelectMainComponent
                        onChange={summaryHandler(item?.sAction, "summ_tax")}
                        valueTax={subTotal.summ_tax}
                        data={data}
                        onChildSelect={handleSelectChange("summ_tax")}
                        summaryId={"summ_tax"}
                        name="summ_tax"
                        {...data?.component?.sProps}
                        taxUrl={item.sRoute}
                      />
                    ) : null}
                  </Box>
                );
              })}
            </Box>
          )} */}
          {data.fixcolumns && (
            <Box {...data.summaryfields.sContainerProps}>
              {data?.summaryfields?.sSummaryDetails?.map((item, index) => (
                <Box
                  key={item.sSummaryID}
                  py={1}
                  sx={{ display: "flex", align: "center", gap: 10 }}
                >
                  <Typography>{item.sLabel}</Typography>
                  {item.sFieldInput === "TEXTFIELD" ? (
                    <TextField
                      onChange={summaryHandler(item?.sAction, item.sSummaryID)}
                      value={subTotal[item.sSummaryID] || ""}
                    />
                  ) : item.sFieldInput === "none" ? (
                    <Typography>{subTotal[item.sSummaryID]}</Typography>
                  ) : item.sFieldInput === "SELECT" ? (
                    <SelectMainComponent
                      onChange={summaryHandler(item?.sAction, item.sSummaryID)}
                      valueTax={subTotal[item.sSummaryID] || ""}
                      data={data}
                      onChildSelect={handleSelectChange("summ_tax")}
                      summaryId={item.sSummaryID}
                      name={item.sSummaryID}
                      {...data?.component?.sProps}
                      taxUrl={item.sRoute}
                    />
                  ) : null}
                </Box>
              ))}
            </Box>
          )}

          {data?.options?.mode === "FREEFORM" && (
            <Box {...data.summaryfields.sContainerProps}>
              {data?.summaryfields?.sSummaryDetails?.map((item, index) => {
                // console.log(item);
                return (
                  <Box
                    key={item.sSummaryID}
                    py={1}
                    sx={{ display: "flex", align: "center", gap: 10 }}
                  >
                    <Typography>{item.sLabel}</Typography>
                    {item.sFieldInput === "TEXTFIELD" &&
                    item.sSummaryID === "summ_handling" ? (
                      // <TextField onChange={summaryHandler("summ_handling")} />
                      <TextField
                        onChange={summaryHandler(
                          item?.sAction,
                          "summ_handling"
                        )}
                      />
                    ) : item.sFieldInput === "TEXTFIELD" &&
                      item.sSummaryID === "summ_shipping" ? (
                      <TextField
                        onChange={summaryHandler(
                          item?.sAction,
                          "summ_shipping"
                        )}
                      />
                    ) : item.sFieldInput === "TEXTFIELD" &&
                      item.sSummaryID === "summ_discount" ? (
                      <>
                        <TextField
                          onChange={summaryHandler(
                            item?.sAction,
                            "summ_discount"
                          )}
                        />
                      </>
                    ) : item.sFieldInput === "none" &&
                      item.sSummaryID === "summ_subtotal" ? (
                      <Typography>{subtotal1}</Typography>
                    ) : item.sFieldInput === "none" &&
                      item.sSummaryID === "summ_grandtotal" ? (
                      <Typography>
                        {grand_total === 0 ? subtotal1 : grand_total}
                      </Typography>
                    ) : null}
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default TableComponent;
