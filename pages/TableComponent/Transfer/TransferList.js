import * as React from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { serverAddress } from "../../../config";
import { vsprintf } from "sprintf-js";
import { TextField } from "@mui/material";

function not(a, b) {
  return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter(value => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

function extractKeysFromFormat(displayFormat) {
  // Regular expression to match content inside curly braces
  const regex = /\{(.*?)\}/g;

  // Extract matches from the display format
  const matches = displayFormat.match(regex);

  // Create an object with keys display1 and display2
  const result = {
    display1: matches && matches.length > 0 ? matches[0].replace(/[{}]/g, "") : null,
    display2: matches && matches.length > 1 ? matches[1].replace(/[{}]/g, "") : null
  };

  return result;
}

export default function SelectAllTransferList({ data,uri, token, sDisplayFormat, freeForm,setBulkLoadData }) {
  const displayItem = extractKeysFromFormat(sDisplayFormat);

  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);


  
  React.useEffect(() => {
    axios
      .get(serverAddress + uri, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      })
      .then(res => {
        // const matchedFields = Object.keys(freeForm[0]);
        const newArray = res?.data?.data?.records?.map((item, index) => {
          // const newItem = matchedFields.reduce((acc, field) => {
          //   if (field === "id") {
          //     acc[field] = index + 1;
          //   }
          //   else {
          //     acc[field] = item[field];
          //   }
          //   return acc;
          // }, {});

          return { id: index + 1, ...item };
        });
        // alert(JSON.stringify(newArray));
        // alert(JSON.stringify(displayItem));
        setLeft(newArray);
      })
      .catch(err => alert(JSON.stringify(err)));
  }, [uri]);
  const [checked, setChecked] = useState([]);


 

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = value => () => {
    const currentIndex = checked.findIndex(item => item.id === value.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = items => intersection(checked, items).length;

  const handleToggleAll = items => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
 
  };
 React.useEffect(() => {
  
  setBulkLoadData(right)
  },[right])

  function replacePlaceholders(uri, data) {

    // Regular expression to match placeholders like {placeholderName}
    const placeholderRegex = /{([^}]+)}/g;
      // alert(uri)
      // alert(JSON.stringify(data['sItemSKU']))
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
// alert(replacedUri)
    return replacedUri;
  }

  const [searchTerm, setSearchTerm] = useState('');

  const filterTheSearchedItems = (items) => {
    return items.filter(item => {
      const displayString = vsprintf(
        data?.component?.bulkLoad?.sDisplayFormat,
        replacePlaceholders(data?.component?.bulkLoad?.sDisplayField, item)
          ?.replace(/[{}]/g, "")
          ?.split(",")
      );
      
      return displayString.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }
  const customList = (title, items, side, checkboxId) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onChange={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected"
            }}
            id={checkboxId}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      {side === "left" && 
        <TextField
        sx={{ px: 2, py: 1 }}
        // label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search"
        id="item-search"
        />
      }

      <Divider />
      <List
        sx={{
          width: 500,
          height: 230,
          bgcolor: "background.paper",
          overflow: "auto"
        }}
        dense
        component="div"
        role="list"
      >
        {side === "left" ? filterTheSearchedItems(items).map(value => {
          const labelId = `transfer-list-all-item-${value.id}-label`;

          return (
            <ListItemButton key={value.id} role="listitem" onClick={handleToggle(value)}>
              {console.log("hgqbfdhgwqhjwfq", value)}
              <ListItemIcon>
                <Checkbox
                  onChange={handleToggle(value)}
                  checked={checked.some(item => item.id === value.id)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId
                  }}
                  id={`itemselect-checkbox-${value.id}`}
                />
              </ListItemIcon>
             
              <ListItemText
                id={labelId}
                primary={ 
                  <span dangerouslySetInnerHTML={ {__html:Object.keys(value).length !== 0
                    ? vsprintf(
                      data?.component?.bulkLoad?.sDisplayFormat,
                        replacePlaceholders(data?.component?.bulkLoad?.sDisplayField, value)
                          ?.replace(/[{}]/g, "")
                          ?.split(",")
                      )
                    : "" }} />
                  }
                    // primary={` ${value[displayItem.display1]} (${value[displayItem.display2]})`}
                    />
            </ListItemButton>
          );
        }) : items.map(value => {
          const labelId = `transfer-list-all-item-${value.id}-label`;

          return (
            <ListItemButton key={value.id} role="listitem" onClick={handleToggle(value)}>
  
              <ListItemIcon>
                <Checkbox
                  onChange={handleToggle(value)}
                  checked={checked.some(item => item.id === value.id)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId
                  }}
                  id={`itemchosen-checkbox-${value.id}`}
                />
              </ListItemIcon>
             
              <ListItemText
                id={labelId}
                primary={ 
                  <span dangerouslySetInnerHTML={ {__html:Object.keys(value).length !== 0
                    ? vsprintf(
                      data?.component?.bulkLoad?.sDisplayFormat,
                        replacePlaceholders(data?.component?.bulkLoad?.sDisplayField, value)
                          ?.replace(/[{}]/g, "")
                          ?.split(",")
                      )
                    : "" }} />
                  }
                    // primary={` ${value[displayItem.display1]} (${value[displayItem.display2]})`}
                    />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      
      <Grid item>{customList("Choices", left, "left", "choices-select")}</Grid>
      <Grid item>
        
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
            id="itemadd-button"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
            id="itemremove-button"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList("Chosen", right, "right", "chosen-select")}  </Grid>
    </Grid>
  );
}
