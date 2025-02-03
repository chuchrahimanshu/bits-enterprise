import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";



function DynamicForm1({apidata}) {
  const [rows, setRows] = useState([{DiscountType:"Percentage"}]);
  const [handlingFee, setHandlingFee] = useState("");
  const [shipping, setShipping] = useState("");

  const addRow = () => {
    setRows([...rows, {}]);
  };


//   const tableHead = [];
  let head =[]
  
  const tableData =  apidata &&  apidata?.details.filter((elm,ind)=>elm?.fixcolumns)

    const tableHead = [...tableData[0]?.fixcolumns];
    tableHead?.splice(1, 0, { Child: tableData[0]?.child });

    tableHead.map(item =>
        head.push({
            field: item.sHeader,
            width: item.iWidth,
            headerName: item.sHeader
        })
    )

//   console.log(apidata);



  const calculateAmount = (row) => {
    const quantity = parseFloat(row.Quantity || 0);
    const price = parseFloat(row.Price || 0);
    const discountType = row.DiscountType || "";
    const discountValue = parseFloat(row.DiscountValue || 0);

    if (discountType === "Percentage") {
      return (quantity * price * (1 - discountValue / 100)).toFixed(2);
    } else if (discountType === "Fixed") {
      return (quantity * price - discountValue).toFixed(2);
    } else {
      return (quantity * price).toFixed(2);
    }
  };

  const calculateSubtotal = () => {
    let subtotal = 0;
    rows.forEach((row) => {
      if (row.Amount) {
        subtotal += parseFloat(row.Amount);
      }
    });
    return subtotal.toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal()) || 0;
    const handling = parseFloat(handlingFee) || 0;
    const ship = parseFloat(shipping) || 0;
    return (subtotal + handling + ship).toFixed(2);
  };
  const calculateHanlling = () => {
    const subtotal = parseFloat(calculateSubtotal()) || 0;
    const handling = parseFloat(handlingFee) || 0;
    return subtotal + handling;
  };
  const calculateShipping = () => {
    const subtotal = parseFloat(calculateSubtotal()) || 0;
    const handling = parseFloat(handlingFee) || 0;
    const ship = parseFloat(shipping) || 0;
    return subtotal + handling + ship;
  };

  const handleInputChange = (rowIndex, fieldName, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [fieldName]: value };

    if (
      fieldName === "Item" &&
      !updatedRows[rowIndex].Quantity &&
      !updatedRows[rowIndex].Price
    ) {
      // Set default values for Quantity and Price when Item is entered
      updatedRows[rowIndex].Quantity = "1";
      updatedRows[rowIndex].Price = "00.00";
    }

    // Calculate the "Amount" field based on the entered values
    updatedRows[rowIndex].Amount = calculateAmount(updatedRows[rowIndex]);

    setRows(updatedRows);
  };

  
  return (
    <div>
      <Grid container spacing={2} style={{ marginBottom: "16px" }}>
        {tableHead?.map((elm, ind) => {
          return (
            <>
              <Grid item   width={elm?.iWidth}  >
                <strong> {elm.sHeader}</strong>
              </Grid>
              {elm.Child?.map((elm, ind) => {
                return (
                  <Grid width={elm.inputtable?.iWidth} item>
                    <strong>{elm.inputtable.sHeader}</strong>
                  </Grid>
                );
              })}
              {/* {elm.Child?.map((elm, ind) => {
              return <Grid item xs={2}><strong>{elm.inputtable.sHeader}</strong></Grid>;
            })}
           <Grid item xs={2}> <strong>{ind > 0 && elm.sHeader}</strong></Grid> */}
            </>
          );
        })}
      </Grid>
      {/* <Grid container spacing={2} style={{ marginBottom: "16px" }}>
        <Grid item xs={2}>
          <strong>Item</strong>
        </Grid>
        <Grid item xs={2}>
          <strong>Description</strong>
        </Grid>
        <Grid item xs={1}>
          <strong>Quantity</strong>
        </Grid>
        <Grid item xs={1}>
          <strong>Price</strong>
        </Grid>
        <Grid item xs={3}>
          <strong>Discount</strong>
        </Grid>

        <Grid item xs={2}>
          <strong>Amount</strong>
        </Grid>
      </Grid> */}

      {rows?.map((row, rowIndex) => (
        <div
          key={rowIndex}
          elevation={3}
          style={{ padding: "16px", marginBottom: "16px" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <TextField
               name="Item"
                fullWidth
                size="small"
                value={row.Item || ""}
                onChange={(e) =>
                  handleInputChange(rowIndex, "Item", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
               name="Description"
                fullWidth
                size="small"
                value={row.Description || ""}
                onChange={(e) =>
                  handleInputChange(rowIndex, "Description", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
               name="Quantity"
                fullWidth
                size="small"
                value={row.Quantity || ""}
                onChange={(e) =>
                  handleInputChange(rowIndex, "Quantity", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
               name="Price"
                fullWidth
                size="small"
                value={row.Price || ""}
                onChange={(e) =>
                  handleInputChange(rowIndex, "Price", e.target.value)
                }
              />
            </Grid>
            <Grid  item xs={2}>
                <Box display={"flex"}>
              <TextField
                name="Discount Value"
                fullWidth
                size="small"
                value={row.DiscountValue || ""}
                onChange={(e) =>
                  handleInputChange(rowIndex, "DiscountValue", e.target.value)
                }
              />
              <FormControl fullWidth>
                {/* <InputLabel>Discount</InputLabel> */}
                <Select
                size="small"
                  value={row.DiscountType || ""}
                  onChange={(e) =>
                    handleInputChange(rowIndex, "DiscountType", e.target.value)
                  }
                >
                
                  <MenuItem value="Percentage">%</MenuItem>
                  <MenuItem value="Fixed">Fix</MenuItem>
                </Select>
              </FormControl>
            </Box>
            </Grid>
            
            
            <Grid item >
              <TextField
               name="Amount"
               size="small"
                fullWidth
                value={row.Amount || "00.00"}
                onChange={(e) =>
                  handleInputChange(rowIndex, "Amount", e.target.value)
                }
              />
            </Grid>
            <Grid item >
              <TextField
               name="Amount"
               size="small"
                fullWidth
                value={row.Amount || "00.00"}
                onChange={(e) =>
                  handleInputChange(rowIndex, "Amount", e.target.value)
                }
              />
            </Grid>
          </Grid>
        </div>
      ))}
      <Box elevation={3} style={{ padding: "16px", marginBottom: "16px" }}>

        <Grid container spacing={2}>
          <Grid item xs={9}> <Button variant="contained" color="primary" onClick={addRow}>
        Add Row
      </Button></Grid>
          <Grid item xs={1}>
            Sub Total
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={1}>
            {calculateSubtotal()}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={9}></Grid>
          <Grid item xs={1}>
            Handling
          </Grid>
          <Grid item xs={1}>
            <TextField
             name="Handling Fee"
              fullWidth
              size="small"
              value={handlingFee}
              onChange={(e) => setHandlingFee(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            {calculateHanlling()}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={9}></Grid>
          <Grid item xs={1}>
            Shipping
          </Grid>
          <Grid item xs={1}>
            <TextField
             name="Shipping"
              fullWidth
              size="small"
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            {calculateShipping()}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={9}></Grid>
          <Grid item xs={1}>
            Total
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={1}>
            {calculateTotal()}
          </Grid>
        </Grid>
      </Box>
     

   
    </div>
  );
}

export default DynamicForm1;
