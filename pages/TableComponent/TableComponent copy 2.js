import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import React, { useEffect, useState } from "react";
import AutoComplete from "../AutoComplete/AutoComplete";
import TextField from "@mui/material/TextField";
import DateComponent from "../DateComponent/DateComponent";
import CheckBoxComponent from "../CheckBox/CheckBoxComponent";
import SelectMainComponent from "../SelectComponent/SelectMainComponent";
import Button from "@mui/material/Button";
import { Autocomplete, Grid, IconButton, MenuItem, Select, Typography } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import axios from "axios";
import { baseURL } from "../../api";
import dayjs from "dayjs";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import { useLocation } from "react-router-dom";
import DynamicForm1 from "./DefaultTable";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const TableComponent = ({
  data,
  textValue,
  isSubmited,
  tabledata,
  tablesummaryfields,
  tablefreeformfield,
  formAction,
  formdata,
  formData
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
  const [handlettotal, sethandletotal] = useState({});
  const [price, setPrice] = useState();

  // default data
  const [rows, setRows] = useState([{ id: 9, DiscountType: "Percentage" }]);
  const [freeForm, setFreeformdata] = useState([]);
  // end default
  const [emptyrows, setEmptyRow] = useState([]);
  const [emptyfreeform, setEmptyFreeform] = useState([]);
  const loacation = useLocation();
  const path = loacation?.search?.toLocaleLowerCase();
  // console.log(selectTax,'selectTax');
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

  const calculateTotal = obj => {
    let total = 0;

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        total += parseFloat(obj[key]);
      }
    }

    return total.toFixed(2);
  };

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}${formdata?.form?.sFormSource}`);
        if (response?.data?.metadata?.status === "OK") {
          const { tabledetails: data = [], tablesummary: datahandling = [] } =
            response?.data?.data[1]?.tablerecords[0] || {};

          const { tabledetails: dataFreeForm = [] } =
            response?.data?.data[1]?.tablerecords[1] || {};

          const finaldata = data.map((item, index) => ({ ...item, id: index + 1 }));
          const finaldata1 = dataFreeForm.map((item, index) => ({ ...item, id: index + 1 }));

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

  useEffect(() => {
    if (rows?.length && Object.values(rows[0])?.length > 1) {
      tabledata(rows);
    }

    if (Object.values(subTotal)?.length >= 2) {
      tablesummaryfields(subTotal);
 
    }

    if (freeForm?.length && Object.values(freeForm[0])?.length > 1) {
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
    const columns = { id: 1, disc_type: "%" };
    const freeclms = { id: 1 };
    let date, date_format;
    let subtotalcols = {};
    if (data?.component?.options?.mode === "DEFAULT" && data?.child) {
      data.child.forEach(item => {
        switch (item.component.sType) {
          case "AUTOCOMPLETE":
          case "TEXTFIELD":
          case "CHECKBOX":
          case "SELECT":
            columns[item.component.sName] = "";
            break;
          case "DATETIME":
            date = dayjs(data?.component?.sDefaultValue);
            date_format = `${date.$D}-${date.$M}-${date.$y}`;
            freeclms[item.component.sName] = date_format;
            break;
          default:
            break;
        }
      });
    }
    if (data?.fixcolumns) {
      data.fixcolumns.forEach(item => {
        switch (item.sColumnID) {
          case "col_qty":
            columns[item.sColumnID] = "";
            break;
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
      data?.summaryfields?.sSummaryDetails?.forEach(item => {
        switch (item.sFieldInput) {
          case "TEXTFIELD":
           
            switch (item.sSummaryID) {
              case "summ_handling":
                subtotalcols[item.sSummaryID] = "";
                break;
              case "summ_shipping":
                subtotalcols[item.sSummaryID] = "";
                break;
              case "summ_discount":
                subtotalcols[item.sSummaryID] = "";
                subtotalcols["disc_type"] = "%";
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
      data.child.forEach(item => {
        switch (item.component.sType) {
          case "AUTOCOMPLETE":
          case "TEXTFIELD":
          case "CHECKBOX":
          case "SELECT":
          case "DATETIME":
            freeclms[item.component.sName] = "";
            break;
          default:
            break;
        }
      });
    }
    // console.log(columns,'columns');
    setRows([columns]);
    setFreeformdata([freeclms]);
    setEmptyRow([columns]);
    setEmptyFreeform([freeclms]);
    setSubTotal(subtotalcols);
  }, [data, isSubmited, urlCapture]);

  const updateAmount = id => {
    const rowIdx = rows.findIndex(item => item.id === id);
    if (rowIdx === -1) return; // Row not found, do nothing

    const row = rows[rowIdx];
    const qty = +row.col_qty || 1; // parseFloat(row.col_qty || 1);
    const rate = +row.col_rate || 0;
    const disc = +row.col_disc; // parseFloat(row.col_disc || 0);
    const tax = +row.col_tax || 0; // parseFloat(row.col_tax || 0);

    const discDecimal = disc / 100;
    const taxDecimal = tax / 100;
    let amount = 0;
    if (row.disc_type === "%") {
      // amount = (rate*(tax/100)) + qty * rate * (1 - disc / 100);
      amount = qty * rate * (1 - discDecimal) * (1 + taxDecimal);
    } else {
      amount = rate * (tax / 100) + qty * rate - disc;
      // console.log(disc);
    }

    const updatedRow = {
      ...row,
      col_amount: amount.toFixed(2),
      col_qty: qty,
      col_rate: rate.toFixed(2)
    };
    const updatedRows = [...rows];
    updatedRows[rowIdx] = updatedRow;

    setRows(updatedRows);
  };

  const handleSelectChange = prop => value => {
    if (prop === "summ_tax") {
      let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;

      let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;

      let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);

      const discountAmount =
        (total / 100) * Number(subTotal?.summ_discount ? subTotal?.summ_discount : 0);

      let new_total = Number(total) - Number(discountAmount);

      const taxAmount = (new_total / 100) * Number(value);

      let total_with_tax = Number(new_total) + Number(taxAmount);

      setSubTotal({
        ...subTotal,
        [prop]: value,
        summ_grandtotal: parseFloat(total_with_tax).toFixed(2)
      });

      setGrandtotal(parseFloat(total_with_tax).toFixed(2));
      setTotalTax(parseFloat(total_with_tax).toFixed(2));
    }

    setSelectTax(value);
  };

  const columns = [];

  const summaryHandler = (prop, value) => event => {
    let new_total = 0;
    let update_disc;

    if (prop === "ADD" && value === "summ_handling") {
      if (event.target.value !== "") {
        new_total = Number(event.target.value) + Number(subtotal1);
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
      if (event.target.value === "") {
        settotalHandle(parseFloat(0).toFixed(2));
      }
      if (subTotal?.summ_shipping !== "") {
        new_total = Number(event.target.value) + Number(subtotal1) + Number(subTotal.summ_shipping);
        settotalShipping(parseFloat(new_total).toFixed(2));
        if (subTotal?.summ_discount !== "") {
          let add_total =
            Number(event.target.value) + Number(subtotal1) + Number(subTotal.summ_shipping);
          let discount_val = (add_total / 100) * Number(subTotal.summ_discount);
          update_disc = Number(add_total) - discount_val;

          settotaldiscount(parseFloat(update_disc).toFixed(2));
        }
        if (subTotal?.summ_adjustment !== "") {
          let add_total =
            Number(event.target.value) + Number(subtotal1) + Number(subTotal.summ_shipping);

          update_disc = Number(add_total) - subTotal?.summ_adjustment;
          settotaladjustment(parseFloat(update_disc).toFixed(2));
        }
      }
    } else if (prop === "ADD" && value === "summ_shipping") {
      if (subTotal?.summ_adjustment === "" || subTotal?.summ_adjustment === undefined) {
        settotaladjustment(parseFloat(0).toFixed(2));
      }
      if (event.target.value !== "") {
        new_total = Number(event.target.value) + Number(subtotal1) + Number(subTotal.summ_handling);
        settotalShipping(parseFloat(new_total).toFixed(2));
        if (subTotal?.summ_discount !== "") {
          let add_total =
            Number(event.target.value) + Number(subtotal1) + Number(subTotal.summ_handling);
          let discount_val = (add_total / 100) * Number(subTotal.summ_discount);
          update_disc = Number(add_total) - discount_val;

          settotaldiscount(parseFloat(update_disc).toFixed(2));
        }
        if (subTotal?.summ_adjustment !== "" && subTotal?.summ_adjustment !== undefined) {
          let add_total =
            Number(event.target.value) + Number(subtotal1) + Number(subTotal?.summ_handling);

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

      if (event.target.value === "") {
        settotalShipping(parseFloat(0).toFixed(2));
      }
    } else if (prop === "SUBTRACT" && value === "summ_discount") {
      if (event.target.value !== "") {
        let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
        let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
        let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);

        const discountAmount = (total / 100) * Number(event.target.value);

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
      if (event.target.value === "") {
        settotaldiscount(parseFloat(0).toFixed(2));
      }
    } else if (prop === "MULTIPLY" && value === "summ_discount") {
    
      if (event.target.value !== "") {
        let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
        let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
        let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);

        let discountAmount;

        if (subTotal.disc_type === "%") {
          discountAmount = Number(event.target.value) / 100;
          discountAmount = total * discountAmount;
        } else {
          discountAmount = Number(event.target.value);
        }

        new_total = Number(total) - Number(discountAmount);

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
      if (event.target.value === "") {
        settotaldiscount(parseFloat(0).toFixed(2));
      }
    } else if (prop === "MULTIPLY" && value === "disc_type") {
   

      if (event.target.value === "%") {
        setSubTotal(pre => ({ ...pre, [event.target.name]: event.target.value }));
        // return console.log(subTotal, 990);
      } else if (event.target.value === "Fix") {
        setSubTotal(pre => ({ ...pre, [event.target.name]: event.target.value }));
        // return console.log(subTotal, 990);
      }
      // if (event.target.value !== "") {
      let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
      let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
      let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);

    
      let discountAmount;

      if (event.target.value === "%") {
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
      // if (event.target.value === "") {
      //   settotaldiscount(parseFloat(0).toFixed(2));
      // }
    } else if (prop === "SUBTRACT" && value === "summ_adjustment") {
      if (event.target.value !== "") {
        let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
        let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
        let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);
        new_total = Number(total) - Number(event.target.value);
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
      if (event.target.value === "") {
        settotaladjustment(parseFloat(0).toFixed(2));
      }
    }

    // Update summ_grandtotal using the latest new_total
    if (event.target.value === "%" || event.target.value === "Fix") {
      return setSubTotal({
        ...subTotal,
        [value]: event.target.value,
        summ_grandtotal: parseFloat(new_total).toFixed(2)
      });
    }
    setSubTotal({
      ...subTotal,
      [value]: parseFloat(event.target.value).toFixed(2),
      summ_grandtotal: parseFloat(new_total).toFixed(2)
    });
  };

  //   const summaryHandler = (prop, value) => event => {
  //     console.log(prop, value, "prop, value");
  //     console.log(event.target.value,990);
  //     console.log(event.target.value == "%");
  //     if (event.target.value == "%") {
  //       setSubTotal((pre)=>({...pre,[event.target.name]:event.target.value}))
  // //================================================================

  // if (subTotal?.summ_handling === "") {
  //   settotalHandle(parseFloat(0).toFixed(2));
  // }
  // if (subTotal?.summ_shipping === "") {
  //   settotalShipping(parseFloat(0).toFixed(2));
  // }
  // if (subTotal?.summ_adjustment === "") {
  //   settotaladjustment(parseFloat(0).toFixed(2));
  // }
  // if (event.target.value === "") {
  //   settotaldiscount(parseFloat(0).toFixed(2));
  // }
  // //================================================================

  //       return   console.log(subTotal,990);
  //     } else if (event.target.value == "Fix")  {
  //       setSubTotal((pre)=>({...pre,[event.target.name]:event.target.value}))
  //      return console.log(subTotal,990);
  //     }
  //     let new_total = 0;
  //     // let new_total1;
  //     let update_disc;
  //     if (prop === "ADD" && value === "summ_handling") {
  //       if (event.target.value !== "") {
  //         new_total = Number(event.target.value) + Number(subtotal1);
  //         settotalHandle(parseFloat(new_total).toFixed(2));
  //       }
  //       if (subTotal?.summ_shipping === "") {
  //         settotalShipping(parseFloat(0).toFixed(2));
  //       }
  //       if (subTotal?.summ_discount === "") {
  //         settotaldiscount(parseFloat(0).toFixed(2));
  //       }
  //       if (subTotal?.summ_adjustment === "") {
  //         settotaladjustment(parseFloat(0).toFixed(2));
  //       }
  //       if (event.target.value === "") {
  //         settotalHandle(parseFloat(0).toFixed(2));
  //       }
  //       if (subTotal?.summ_shipping !== "") {
  //         new_total = Number(event.target.value) + Number(subtotal1) + Number(subTotal.summ_shipping);
  //         settotalShipping(parseFloat(new_total).toFixed(2));
  //         if (subTotal?.summ_discount !== "") {
  //           let add_total =
  //             Number(event.target.value) + Number(subtotal1) + Number(subTotal.summ_shipping);
  //           let discount_val = (add_total / 100) * Number(subTotal.summ_discount);
  //           update_disc = Number(add_total) - discount_val;

  //           settotaldiscount(parseFloat(update_disc).toFixed(2));
  //         }
  //         if (subTotal?.summ_adjustment !== "") {
  //           let add_total =
  //             Number(event.target.value) + Number(subtotal1) + Number(subTotal.summ_shipping);

  //           update_disc = Number(add_total) - subTotal?.summ_adjustment;
  //           settotaladjustment(parseFloat(update_disc).toFixed(2));
  //         }
  //       }
  //     } else if (prop === "ADD" && value === "summ_shipping") {
  //       if (subTotal?.summ_adjustment === "" || subTotal?.summ_adjustment === undefined) {
  //         settotaladjustment(parseFloat(0).toFixed(2));
  //       }
  //       if (event.target.value !== "") {
  //         new_total = Number(event.target.value) + Number(subtotal1) + Number(subTotal.summ_handling);
  //         settotalShipping(parseFloat(new_total).toFixed(2));
  //         if (subTotal?.summ_discount !== "") {
  //           let add_total =
  //             Number(event.target.value) + Number(subtotal1) + Number(subTotal.summ_handling);
  //           let discount_val = (add_total / 100) * Number(subTotal.summ_discount);
  //           update_disc = Number(add_total) - discount_val;

  //           settotaldiscount(parseFloat(update_disc).toFixed(2));
  //         }
  //         if (subTotal?.summ_adjustment !== "" && subTotal?.summ_adjustment !== undefined) {
  //           let add_total =
  //             Number(event.target.value) + Number(subtotal1) + Number(subTotal?.summ_handling);

  //           update_disc = Number(add_total) - Number(subTotal.summ_adjustment);
  //           settotaladjustment(parseFloat(update_disc).toFixed(2));
  //         }
  //       }

  //       if (subTotal?.summ_handling === "") {
  //         settotalHandle(parseFloat(0).toFixed(2));
  //       }
  //       if (subTotal?.summ_discount === "") {
  //         settotaldiscount(parseFloat(0).toFixed(2));
  //       }

  //       if (event.target.value === "") {
  //         settotalShipping(parseFloat(0).toFixed(2));
  //       }
  //     } else if (prop === "SUBTRACT" && value === "summ_discount") {
  //       if (event.target.value !== "") {
  //         let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
  //         let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
  //         let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);

  //         const discountAmount = (total / 100) * Number(event.target.value);

  //         new_total = Number(total) - discountAmount;

  //         settotaldiscount(parseFloat(new_total).toFixed(2));
  //       }

  //       if (subTotal?.summ_handling === "") {
  //         settotalHandle(parseFloat(0).toFixed(2));
  //       }
  //       if (subTotal?.summ_shipping === "") {
  //         settotalShipping(parseFloat(0).toFixed(2));
  //       }
  //       if (subTotal?.summ_adjustment === "") {
  //         settotaladjustment(parseFloat(0).toFixed(2));
  //       }
  //       if (event.target.value === "") {
  //         settotaldiscount(parseFloat(0).toFixed(2));
  //       }
  //     } else if (prop === "MULTIPLY" && value === "summ_discount") {
  //       if (event.target.value !== "") {

  //         let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
  //         let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
  //         let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);

  //         let discountAmount;

  //         if (subTotal.disc_type == "%") {
  //           discountAmount = Number(event.target.value) / 100;
  //           discountAmount = total * discountAmount;
  //         } else {
  //           discountAmount = Number(event.target.value);
  //         }

  //         new_total = Number(total) - Number(discountAmount);

  //         settotaldiscount(parseFloat(new_total).toFixed(2));
  //       }

  //       if (subTotal?.summ_handling === "") {
  //         settotalHandle(parseFloat(0).toFixed(2));
  //       }
  //       if (subTotal?.summ_shipping === "") {
  //         settotalShipping(parseFloat(0).toFixed(2));
  //       }
  //       if (subTotal?.summ_adjustment === "") {
  //         settotaladjustment(parseFloat(0).toFixed(2));
  //       }
  //       if (event.target.value === "") {
  //         settotaldiscount(parseFloat(0).toFixed(2));
  //       }
  //     }

  //     else if (prop === "SUBTRACT" && value === "summ_adjustment") {
  //       if (event.target.value !== "") {
  //         let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
  //         let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
  //         let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);
  //         new_total = Number(total) - Number(event.target.value);
  //         settotaladjustment(parseFloat(new_total).toFixed(2));
  //       }
  //       if (subTotal?.summ_handling === "") {
  //         settotalHandle(parseFloat(0).toFixed(2));
  //       }
  //       if (subTotal?.summ_shipping === "") {
  //         settotalShipping(parseFloat(0).toFixed(2));
  //       }
  //       if (subTotal?.summ_discount === "") {
  //         settotaldiscount(parseFloat(0).toFixed(2));
  //       }
  //       if (event.target.value === "") {
  //         settotaladjustment(parseFloat(0).toFixed(2));
  //       }
  //     }
  //     setSubTotal({
  //       ...subTotal,
  //       [value]: event.target.value,
  //       summ_grandtotal: parseFloat(new_total).toFixed(2)
  //     });
  //     // setGrandtotal(new_total);
  //   };
  const update = callback => {
    if (callback) {
      callback();
    }
  };

  const takeInput = (e, id, type) => {
    // console.log(type, 456);
    if (type == "setPrice") {
      // console.log(e, 456);
      const list = [...rows];
      const index = list.findIndex(row => row.id === id);
      list[index]["col_rate"] = e;
      setRows(list);
      // setRows({ ...rows, [name]: value });
      updateAmount(id);
      summaryHandler();
    }
    const { name, value } = e.target;

    update();
    // console.log( name, value,456);
    const list = [...rows];
    const index = list.findIndex(row => row.id === id);
    list[index][name] = value;
    setRows(list);
    // setRows({ ...rows, [name]: value });
    updateAmount(id);
    summaryHandler();
    // console.log(list,'listlistlist');
  };
  // use this const data in useState

  useEffect(() => {
    let subtotal1 = rows.reduce((sum, item) => {
      const amount = Number(item.col_amount);
      return +sum + amount;
    }, 0);

    let grand_total = 0;
    if (subtotal1) {
      grand_total = +subtotal1;
    }
    // console.log(subtotal1, "subtotal1");
    let grandsubtotal = isNaN(subtotal1) ? (subtotal1 = 0) : subtotal1;
    let grandvalue = isNaN(grand_total) ? (grand_total = 0) : grand_total;
    setGrandtotal(parseFloat(grand_total).toFixed(2));
    setsubTotal1(parseFloat(grandsubtotal).toFixed(2));
    if (grandsubtotal && grandvalue) {
      setSubTotal({
        ...subTotal,
        summ_subtotal: parseFloat(grandsubtotal).toFixed(2),
        summ_grandtotal: parseFloat(grandvalue).toFixed(2)
      });
    }
  }, [rows]);

  // useEffect(() => {
  //   let new_total;
  //   let new_total1;
  //   let update_disc;

  //   if (Object.keys(subTotal).includes("summ_handleTotal") !== "") {
  //     if (subTotal?.summ_handling !== "") {
  //       new_total1 = Number(subTotal?.summ_handling) + Number(subtotal1);
  //       settotalHandle(parseFloat(new_total1).toFixed(2));
  //     }
  //     if (subTotal?.summ_shipping === "") {
  //       settotalShipping(parseFloat(0).toFixed(2));
  //     }
  //     if (subTotal?.summ_discount === "") {
  //       settotaldiscount(parseFloat(0).toFixed(2));
  //     }
  //     if (subTotal?.summ_adjustment === "" || subTotal?.summ_adjustment === undefined) {
  //       settotaladjustment(parseFloat(0).toFixed(2));
  //     }
  //     if (subTotal?.summ_handling === "") {
  //       settotalHandle(parseFloat(0).toFixed(2));
  //     }
  //     if (subTotal?.summ_shipping !== "") {
  //       new_total =
  //         Number(subTotal?.summ_handling) + Number(subtotal1) + Number(subTotal.summ_shipping);
  //       settotalShipping(parseFloat(new_total).toFixed(2));
  //       if (subTotal?.summ_discount !== "") {
  //         let add_total =
  //           Number(subTotal?.summ_handling) + Number(subtotal1) + Number(subTotal.summ_shipping);
  //         let discount_val = (add_total / 100) * Number(subTotal.summ_discount);
  //         update_disc = Number(add_total) - discount_val;
  //         settotaldiscount(parseFloat(update_disc).toFixed(2));
  //       }
  //       if (subTotal?.summ_adjustment !== "" && subTotal?.summ_adjustment !== undefined) {
  //         let add_total =
  //           Number(subTotal?.summ_handling) + Number(subtotal1) + Number(subTotal.summ_shipping);

  //         update_disc = Number(add_total) - subTotal?.summ_adjustment;
  //         settotaladjustment(parseFloat(update_disc).toFixed(2));
  //       }
  //     }
  //   } else if (Object.keys(subTotal).includes("summ_shipTotal") !== "") {
  //     if (subTotal?.summ_adjustment === "" || subTotal?.summ_adjustment === undefined) {
  //       settotaladjustment(parseFloat(0).toFixed(2));
  //     }
  //     if (subTotal?.summ_handling !== "") {
  //       new_total =
  //         Number(subTotal?.summ_shipping) + Number(subtotal1) + Number(subTotal.summ_handling);
  //       settotalShipping(parseFloat(new_total).toFixed(2));
  //       if (subTotal?.summ_discount !== "") {
  //         let add_total =
  //           Number(subTotal?.summ_shipping) + Number(subtotal1) + Number(subTotal.summ_handling);
  //         let discount_val = (add_total / 100) * Number(subTotal.summ_discount);
  //         update_disc = Number(add_total) - discount_val;
  //         settotaldiscount(parseFloat(update_disc).toFixed(2));
  //       }
  //       if (subTotal?.summ_adjustment !== "" && subTotal?.summ_adjustment !== undefined) {
  //         let add_total =
  //           Number(subTotal?.summ_shipping) + Number(subtotal1) + Number(subTotal?.summ_handling);

  //         update_disc = Number(add_total) - Number(subTotal.summ_adjustment);
  //         settotaladjustment(parseFloat(update_disc).toFixed(2));
  //       }
  //     }

  //     if (subTotal?.summ_handling === "") {
  //       settotalHandle(parseFloat(0).toFixed(2));
  //     }
  //     if (subTotal?.summ_discount === "") {
  //       settotaldiscount(parseFloat(0).toFixed(2));
  //     }

  //     if (subTotal?.summ_shipping === "") {
  //       settotalShipping(parseFloat(0).toFixed(2));
  //     }
  //   } else if (Object.keys(subTotal).includes("summ_discountTotal") !== "") {
  //     if (subTotal?.summ_discount !== "") {
  //       let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
  //       let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
  //       let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);

  //       const discountAmount = (total / 100) * Number(subTotal?.summ_discount);

  //       new_total = Number(total) - discountAmount;

  //       settotaldiscount(parseFloat(new_total).toFixed(2));
  //     }

  //     if (subTotal?.summ_handling === "") {
  //       settotalHandle(parseFloat(0).toFixed(2));
  //     }
  //     if (subTotal?.summ_shipping === "") {
  //       settotalShipping(parseFloat(0).toFixed(2));
  //     }
  //     if (subTotal?.summ_adjustment === "") {
  //       settotaladjustment(parseFloat(0).toFixed(2));
  //     }
  //     if (subTotal?.summ_discount === "") {
  //       settotaldiscount(parseFloat(0).toFixed(2));
  //     }
  //   } else if (Object.keys(subTotal).includes("summ_adjustmentTotal") !== "") {
  //     if (subTotal?.summ_adjustment !== "" || subTotal?.summ_adjustment !== undefined) {
  //       let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
  //       let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
  //       let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);
  //       new_total = Number(total) - Number(subTotal?.summ_adjustment);
  //       settotaladjustment(parseFloat(new_total).toFixed(2));
  //     }
  //     if (subTotal?.summ_handling === "") {
  //       settotalHandle(parseFloat(0).toFixed(2));
  //     }
  //     if (subTotal?.summ_shipping === "") {
  //       settotalShipping(parseFloat(0).toFixed(2));
  //     }
  //     if (subTotal?.summ_discount === "") {
  //       settotaldiscount(parseFloat(0).toFixed(2));
  //     }
  //     if (subTotal?.summ_adjustment === "") {
  //       settotaladjustment(parseFloat(0).toFixed(2));
  //     }
  //   }

  //   if (Object.keys(subTotal).includes("summ_tax")) {
  //     let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;

  //     let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;

  //     let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);

  //     const discountAmount =
  //       (total / 100) * Number(subTotal?.summ_discount ? subTotal?.summ_discount : 0);

  //     let new_total = Number(total) - Number(discountAmount);

  //     const taxAmount = (new_total / 100) * Number(subTotal?.summ_tax);

  //     // console.log(taxAmount,555);
  //     let total_with_tax = Number(new_total) + Number(taxAmount);
  //     setGrandtotal(parseFloat(total_with_tax).toFixed(2));
  //   }
  // }, [subTotal]);
  useEffect(() => {
    // Ensure subTotal is defined
    if (subTotal) {
      // Initialize variables
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
        // console.log(122222);
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

      if (Object.keys(subTotal).includes("summ_tax")) {
        let sum_handle = subTotal?.summ_handling ? subTotal?.summ_handling : 0;
        let sum_shipping = subTotal?.summ_shipping ? subTotal?.summ_shipping : 0;
        let total = Number(sum_handle) + Number(subtotal1) + Number(sum_shipping);

        const discountAmount =
          (total / 100) * Number(subTotal?.summ_discount ? subTotal?.summ_discount : 0);

        new_total = Number(total) - Number(discountAmount);

        const taxAmount = (new_total / 100) * Number(subTotal?.summ_tax);

        let total_with_tax = Number(new_total) + Number(taxAmount);
        setGrandtotal(parseFloat(total_with_tax).toFixed(2));
      }
    }
  }, [subTotal]);

  const FreeFormInput = (e, id) => {
    const { name, value } = e.target;
    const list = [...freeForm];
    const index = list.findIndex(row => row.id === id);
    list[index][name] = value;
    setFreeformdata(list);
  };

  const formcallback = (e, id, name) => {
    if (e) {
      let { value = "" } = e || "";
      const list = [...rows];
      const index = list.findIndex(row => row.id === id);
      list[index][name] = value;
      setRows(list);
    }
  };

  const FreeFormCallBack = (e, id, name) => {
    if (e) {
      let { value = "" } = e || "";
      const list = [...freeForm];
      const index = list.findIndex(row => row.id === id);
      list[index][name] = value;
      setFreeformdata(list);
    }
  };
  const FreeFormCallBackItem = (e, id, name) => {
    if (e) {
      let { value = "" } = e || "";
      // console.log( name, value,456);
      const list = [...rows];
      const index = list.findIndex(row => row.id === id);
      list[index][name] = value;
      setRows(list);
      updateAmount(id);
      summaryHandler();
    }
  };

  const handledatachange = (e, id, name) => {
    const list = [...freeForm];
    const index = list.findIndex(row => row.id === id);
    list[index][name] = e;
    setFreeformdata(list);
  };
  const handleAddRow = e => {
    const newRow = {
      id: rows.length + 1,
      disc_type: "%"
    };
    if (e.target.value) {
      const numNewRows = parseInt(e.target.value);

      const newRows = Array.from({ length: numNewRows }, (_, i) => ({
        id: rows.length + i + 1
      }));
      setRows([...rows, ...newRows]);
    } else {
      setRows([...rows, newRow]);
    }
  };

  const fetchTax = async sDataSource => {
   
    const res = await axios.get(`${baseURL}${sDataSource}`);
    if (res?.data?.metadata.status == "OK") {
      setTaxOptions(res.data.data);
    }
  };
  const handleDragEnd = result => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [movedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, movedItem);

    setRows(newItems);
  };

  const handleAddRow1 = e => {
    const newRow = {
      id: freeForm.length + 1
    };
    if (e.target.value) {
      const numNewRows = parseInt(e.target.value);

      const newRows = Array.from({ length: numNewRows }, (_, i) => ({
        id: freeForm.length + i + 1
      }));
      setFreeformdata([...freeForm, ...newRows]);
    } else {
      setFreeformdata([...freeForm, newRow]);
    }
    // setFreeformdata([...freeForm, newRow]);
  };
  data.component?.options?.mode === "DEFAULT" &&
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
          if (item.component.sType === "AUTOCOMPLETE") {
            return (
              <AutoComplete
                formcallback={e => formcallback(e, params.row.id, item?.component?.sName)}
                data={item}
                rowsdataFree={
                  rows && rows[params.row.id - 1] && rows[params.row.id - 1][item?.component?.sName]
                }
                Automod={data.component?.options?.mode}
                formaction={formAction}
                isSubmited={isSubmited}
                {...item?.component?.sProps}
              />
            );
          } else if (item.component.sType === "TEXTFIELD") {
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
          } else if (item.component.sType === "DATETIME") {
            return (
              <DateComponent
                handledatechange={e => handledatachange(e, params.row.id, item?.component?.sName)}
                data={item}
                datavalue={
                  rows && rows[params.row.id - 1] && rows[params.row.id - 1][item.component.sName]
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
                onChange={e => takeInput(e, params.row.id)}
                datacheckvalue={
                  rows && rows[params.row.id - 1] && rows[params.row.id - 1][item.component.sName]
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
                onChildSelect={handleSelectChange()}
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
        }
      });
    });

  data.component?.options?.mode === "FREEFORM" &&
    data?.child?.forEach(item => {
      columns.push({
        field: item.inputtable.sColumnID,
        headerName: item.inputtable.sHeader,
        width: item.inputtable.iWidth,
        // editable: item.inputtable.bEditable,
        sortable: false,
        renderCell: params => {
          if (item.component.sType === "AUTOCOMPLETE") {
            return (
              <AutoComplete
                formcallback={e => FreeFormCallBack(e, params.row.id, item?.component?.sName)}
                data={item}
                rowsdataFree={
                  freeForm &&
                  freeForm[params.row.id - 1] &&
                  freeForm[params.row.id - 1][item?.component?.sName]
                }
                Automod={data.component?.options?.mode}
                formaction={formAction}
                isSubmited={isSubmited}
                {...item?.component?.sProps}
              />
            );
          } else if (item.component.sType === "TEXTFIELD") {
            return (
              <TextField
                name={item?.component?.sName}
                onChange={e => {
                  FreeFormInput(e, params.row.id);
                  e.stopPropagation();
                }}
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
            );
          } else if (item.component.sType === "DATETIME") {
            return (
              <DateComponent
                handledatechange={e => handledatachange(e, params.row.id, item?.component?.sName)}
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
            return (
              <CheckBoxComponent
                data={item}
                handleCheckbox={e => handledatachange(e, params.row.id, item?.component?.sName)}
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
                handledatasend={e => handledatachange(e, params.row.id, item?.component?.sName)}
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
                isSubmited={isSubmited}
              />
            );
          } else {
            return;
          }
        }
      });
    });

  data?.fixcolumns?.forEach(item => {
    switch (item.sColumnID) {
      case "col_qty":
        columns.push({
          field: item.sColumnID,
          headerName: item.sHeader,
          width: item.iWidth,
          editable: item.bEditable,
          type: item.sType,
          sortable: true,
          renderCell: params => (
            <>
              <TextField
                name={item.sColumnID}
                value={rows?.[params.row.id - 1]?.[item.sColumnID]}
                onChange={e => takeInput(e, params.row.id)}
                variant="outlined"
                size="small"
              />
            </>
          )
        });
        break;
      case "col_rate":
        columns.push({
          field: item.sColumnID,
          headerName: item.sHeader,
          width: item.iWidth,
          editable: item.bEditable,
          type: item.sType,
          sortable: true,
          renderCell: params => (
            <>
              {/* <TextField
            name={item.sColumnID}
            value={rows?.[params.row.id - 1]?.[item.sColumnID]}
            onChange={e => takeInput(e, params.row.id)}
            variant="outlined"
            size="small"
          />   */}
             
              <PriceComponent
                isbyPass={textValue.sByPass}
                update={update}
                setPrice={setPrice}
                api={`${baseURL}/getCustomerPrice?pricetype=CUSTOMER&pricefor=${
                  textValue.sByPass === "Yes" ? "DEFAULT" : textValue?.sCustomerID
                }&item=${rows?.[params.row.id - 1]?.["col_item"]}`}
                name={item.sColumnID}
                value={rows?.[params.row.id - 1]?.[item.sColumnID]}
                takeInput={takeInput}
                id={params.row.id}
              />
            </>
          )
        });
        break;
      case "col_disc":
        columns.push({
          field: item.sColumnID,
          headerName: item.sHeader,
          width: item.iWidth,
          editable: item.bEditable,
          type: item.sType,
          sortable: true,
          renderCell: params => (
            <>
              <TextField
                name={item.sColumnID}
                value={rows?.[params.row.id - 1]?.[item.sColumnID]}
                onChange={e => takeInput(e, params.row.id)}
                variant="outlined"
                size="small"
              />

              <Select
                size="small"
                name={"disc_type"}
                value={rows[params.row.id - 1]?.disc_type}
                onChange={e => takeInput(e, params.row.id)}
              >
                <MenuItem value="%">%</MenuItem>
                <MenuItem value="Fixed">Fix</MenuItem>
              </Select>
            </>
          )
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
          renderCell: params => rows?.[params.row.id - 1]?.[item.sColumnID]
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
          renderCell: params => (
            <TextField
              name={item.sColumnID}
              value={rows?.[params.row.id - 1]?.[item?.component?.sName]}
              onChange={e => takeInput(e, params.row.id)}
              variant="outlined"
              size="small"
            />
          )
        });
        break;
      case "col_item":
        const data1 = [{ data: item }];
     
        const size = { withwidth: item.iWidth + 100, fullWidth: true, size: "small" };

        columns.push({
          field: item.sColumnID,
          headerName: item.sHeader,
          width: item.iWidth,
          editable: item.bEditable,
          type: item.sType,
          sortable: true,
          renderCell: params => (
            // <TextField
            //   name={item.sColumnID}
            //   value={rows?.[params.row.id - 1]?.[item?.component?.sName]}
            //   onChange={e => takeInput(e, params.row.id)}
            //   variant="outlined"
            //   size="small"
            // />
            <>
              <DragIndicatorIcon className="cursor-pointer" />
              <AutoComplete
                formcallback={e => FreeFormCallBackItem(e, params.row.id, item.sColumnID)}
                data={data1[0]}
                {...size}
              />
            </>
          )
        });
        break;
      case "col_tax":
        //  const option =  fetchTax(item.sDataSource)

        // console.log(taxOption,'item0');
        columns.push({
          field: item.sColumnID,
          headerName: item.sHeader,
          width: item.iWidth,
          editable: item.bEditable,
          type: item.sType,
          sortable: true,
          renderCell: params => (
            // <Select
            //        size="small"
            //         name={ item.sColumnID}
            //         value={rows[params.row.id - 1].disc_type}
            //         onChange={e => takeInput(e, params.row.id)}
            //       >
            //         {
            //           taxOption.map(item =><MenuItem value={item.value}>{item.display}</MenuItem>)
            //         }

            //       </Select>

            <SelectComponent
              api={`${baseURL}${item.sDataSource}`}
              takeInput={takeInput}
              id={params.row.id}
              name={item.sColumnID}
              value={rows[params.row.id - 1]?.col_tax}
            />
          )
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
          renderCell: params => (
            <TextField
              name={item.sColumnID}
              onChange={e => takeInput(e, params.row.id)}
              variant="outlined"
              size="small"
            />
          )
        });
        break;
    }
  });

  data.component?.options?.mode === "DEFAULT" &&
    columns.push({
      field: "actions",
      headerName: " ",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: params => {
        const handleDelete = () => {
          const newRows = rows.filter(row => row.id !== params.row.id);
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
  if (data.component?.options?.mode === "FREEFORM") {
    columns.push({
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: params => {
        const handleDelete1 = () => {
          const newRows = freeForm.filter(row => row.id !== params.row.id);
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
      }
    });
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

  return (
    <>
      <Box sx={{ width: "100%", marginBottom: "1rem" }}>
        {data.component?.options?.mode === "DEFAULT" ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="table">
            {(provided)=> 
            <div ref={provided.innerRef} {...provided.droppableProps}>
            <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
                pagination={false}
                disableColumnMenu={true}
                hideFooter={true}
                {...data.component?.sProps}
                />
                </div>
                }
            </Droppable>
          </DragDropContext>
        ) : (
          // formdata &&   <DynamicForm1 apidata={formdata}/>
          <DataGrid
            autoHeight
            rows={freeForm}
            columns={columns}
            pagination={false}
            disableColumnMenu={true}
            hideFooter={true}
            {...data.component?.sProps}
          />
        )}
        <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
          {data.component?.options?.mode === "DEFAULT" ? (
            <Box sx={{ border: "1px solid #42a5f5", height: "2%" }}>
              <Button
                startIcon={<AddCircleOutlinedIcon onClick={e => handleAddRow(e)} />}
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
              <select onChange={handleAddRow} style={{ border: "none", outline: "none" }}>
                <option></option>
                {options.map((option, index) => {
                  return (
                    <option key={index} value={option?.value}>
                      {option?.key}
                    </option>
                  );
                })}
              </select>
            </Box>
          ) : (
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
              <select onChange={handleAddRow1} style={{ border: "none", outline: "none" }}>
                <option></option>
                {options.map((option, index) => {
                  return (
                    <option key={index} value={option?.value}>
                      {option?.key}
                    </option>
                  );
                })}
              </select>
            </Box>
          )}

          {data.fixcolumns && (
            <Box {...data.summaryfields.sContainerProps}>
              {data?.summaryfields?.sSummaryDetails?.map(item => (
                <Grid container key={item.sSummaryID} sx={{ gap: 2 }} py={1}>
                  <Grid item xs={3.3}>
                    <Typography>
                      {item.sLabel}{" "}
                      {item.sLabel.toLocaleLowerCase().includes("total") &&
                        !item.sLabel.toLocaleLowerCase().includes("sub total") &&
                        "(USD)"}
                    </Typography>
                  </Grid>
                  {item.sFieldInput === "TEXTFIELD" ? (
                    <>
                      <Grid item sx={{ display: "flex" }} xs={5.2}>
                        <TextField
                          onChange={summaryHandler(item?.sAction, item.sSummaryID)}
                          value={subTotal[item.sSummaryID] || ""}
                          variant="outlined"
                          size="small"
                        />
                        {/* {console.log(subTotal["disc_type"], "9999")} */}
                        {item.sSummaryID === "summ_discount" && (
                          <Select
                            size="small"
                            name={"disc_type"}
                            value={subTotal?.["disc_type"] || ""}
                            onChange={summaryHandler(item?.sAction, "disc_type")}
                          >
                            <MenuItem value="%">%</MenuItem>
                            <MenuItem value="Fix">Fix</MenuItem>
                          </Select>
                        )}
                      </Grid>
                      {item?.sLabel === "Handling" ? (
                        <Grid item xs={2}>
                          <Typography align="right">{totalHandle}</Typography>
                        </Grid>
                      ) : item?.sLabel === "Shipping" ? (
                        <Grid item xs={2}>
                          <Typography align="right">{totalShipping}</Typography>
                        </Grid>
                      ) : item?.sLabel === "Discount" ? (
                        <Grid item xs={2}>
                          <Typography align="right">{totaldiscount}</Typography>
                        </Grid>
                      ) : item?.sLabel === "Adjustment" ? (
                        <Grid item xs={2}>
                          <Typography align="right">{totaladjustment}</Typography>
                        </Grid>
                      ) : (
                        ""
                      )}
                    </>
                  ) : item.sFieldInput === "none" ? (
                    <>
                      <Grid item xs={5.2}></Grid>
                      <Grid item xs={2}>
                        {/* {item.sLabel !== "Total" ? (
                          <Typography align="right">
                            {subTotal[item.sSummaryID] || parseFloat(0).toFixed(2)}
                          </Typography>
                        ) : (
                          <Typography align="right">
                            {console.log(subTotal[item.sSummaryID] || parseFloat(0).toFixed(2), 89)}
                            <Typography>{calculateTotal(handlettotal)}</Typography>
                          </Typography>
                        )} */}
                        <Typography align="right">
                          {subTotal[item.sSummaryID] || parseFloat(0).toFixed(2)}
                        </Typography>
                      </Grid>
                    </>
                  ) : item.sFieldInput === "SELECT" ? (
                    <Grid item xs={5}>
                      {path.includes("edit") ? (
                        subTotalDef ? ( // Check if subTotalDef exists
                          <SelectMainComponent
                            onChange={summaryHandler(item?.sAction, item.sSummaryID)}
                            valueTax={subTotal[item.sSummaryID] || ""}
                            data={data}
                            def_value={subTotalDef}
                            subTotalDef={subTotalDef}
                            onChildSelect={handleSelectChange(item.sSummaryID)}
                            summaryId={item.sSummaryID}
                            name={item.sSummaryID}
                            {...data?.component?.sProps}
                            taxUrl={item.sRoute}
                          />
                        ) : null
                      ) : (
                        <SelectMainComponent
                          onChange={summaryHandler(item?.sAction, item.sSummaryID)}
                          valueTax={subTotal[item.sSummaryID] || ""}
                          data={data}
                          def_value={subTotalDef}
                          subTotalDef={subTotalDef}
                          onChildSelect={handleSelectChange(item.sSummaryID)}
                          summaryId={item.sSummaryID}
                          name={item.sSummaryID}
                          {...data?.component?.sProps}
                          taxUrl={item.sRoute}
                        />
                      )}
                    </Grid>
                  ) : null}
                </Grid>
              ))}
            </Box>
          )}
          {/* {console.log(rows,'emptyfreeform')} */}
          {data?.options?.mode === "FREEFORM" && (
            <Box {...data.summaryfields.sContainerProps}>
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
                    ) : item.sFieldInput === "TEXTFIELD" && item.sSummaryID === "summ_shipping" ? (
                      <>
                        <TextField onChange={summaryHandler(item?.sAction, "summ_shipping")} />
                        <p>hello</p>
                      </>
                    ) : item.sFieldInput === "TEXTFIELD" && item.sSummaryID === "summ_discount" ? (
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
      </Box>
    </>
  );
};
const SelectComponent = ({ api, name, value, takeInput, id }) => {
  const [taxOption, setTaxOption] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(api);
        setTaxOption(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Select
      size="small"
      name={name}
      value={value == undefined ? "" : value}
      onChange={e => takeInput(e, id)}
    >
      {" "}
      {taxOption.map(item => (
        <MenuItem key={item.value} value={item.value}>
          {" "}
          {item.display}{" "}
        </MenuItem>
      ))}
    </Select>
  );
};
const PriceComponent = ({ update, setPrice, api, name, isbyPass, value, takeInput, id }) => {
  // console.log(api,'responsep');
  const fetchData = async () => {
    try {
      // if (isbyPass === 'No') {
      //  return takeInput('0.00', id, "setPrice");
      // }
      const response = await axios.get(api);
      
      setPrice(response.data.data);
  
      takeInput(response.data.data[0].price, id, "setPrice");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    update(fetchData);
    fetchData();
  }, [api]);
 
  return (
    <TextField size="small" name={name} value={value} onChange={e => takeInput(e, id)}></TextField>
  );
};

export default TableComponent;
