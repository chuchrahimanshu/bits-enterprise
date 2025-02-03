import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { baseURL } from "../../api";
import Chip from "@mui/material/Chip";
import { Button, Checkbox, FormHelperText, Paper } from "@mui/material";
import CustomAlert from "../../component/AlertComponent/Alert";
import ListSubheader from "@mui/material/ListSubheader";
import { Global_Data } from "../../globalData/GlobalData";
import { vsprintf } from "sprintf-js";
import { Icon } from "../../utils/MuiIcons/Icon";
import { serverAddress } from "../../config";

export default function BasicSelect({
  url,
  dataComponent,
  data,setdTermDays,
  summaryId,
  taxUrl,
  handleClickOpen,
  textValue,formIsSubmited,
  errors,
  isDisabledTable,setSelectAndAutocompleteSname,
  def_value,
  subTotalDef,
  onChildSelect,
  selectTax,
  handledatachange,
  handledatamaindata,
  taxUrlFree,
  sColumnID,
  datasend,
  selectEdit,
  datemod,
  formaction,
  isSubmited
}) {
  const [dataCollection, setDataCollection] = React.useState([]);
  const [taxCollection, setTaxCollection] = React.useState([]);
  const [taxFree, setFree] = React.useState([]);
  const [def_selected, setDefSelected] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [displayItems, setDisplayItems] = useState({});
  const [valueBack, setValueBack] = useState("");
  const [singleSelected, setSingleSelected] = useState({});
  const [customError, setCustomError] = useState("");
  const formActionchecked = formaction;
  const { token, setDefaultTableSelectedLocation } = Global_Data();
  const [nativeSelected ,setNativeSelected] = useState([])
  useEffect(() => {
    if (isSubmited) {
      setTaxCollection([]);
      setDataCollection([]);
      setFree([]);
      setSelectedOption();
      setSelectedOptions([]);
      setCustomError("");
    }
  }, [isSubmited]);

  function extractDisplayValues(inputString) {
    const regex = /\{([^}]+)\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(inputString)) !== null) {
      matches.push(match[1]);
    }
    const displayObject = {};
    matches.forEach((match, index) => {
      const displayKey = `display${index + 1}`;
      displayObject[displayKey] = match;
    });
    return displayObject;
  }

  function handleInventoryName(sInventoryID, feild, retnfeild) {
    const inventory = dataCollection?.find(item => item[feild] === sInventoryID);
    return inventory ? inventory[retnfeild] : "";
  }

  useEffect(() => {
    if (dataCollection.length > 0) {
      const result = extractDisplayValues(data?.data?.sDisplayFormat);

      const keys = Object.keys(dataCollection[0]);

      const initialState = keys?.reduce((acc, field) => {
        acc[field] = "";
        return acc;
      }, {});

      initialState[result.display2] = data?.component?.sDefaultValue ?? null;
      initialState[result.display1] =
        handleInventoryName(data?.component?.sDefaultValue, result.display2, result.display1) ??
        null;
      setValueBack(data?.data?.sValueField);

      setDisplayItems(result);
    }
    // setAuto({sCustomerID:"",value:"",display:"",firstname:"",sInventoryCode:"",sAccountName:handlesAccountName(data?.component?.sDefaultValue), sInventoryID: data?.component?.sDefaultValue, sInventoryName: handleInventoryName(data?.component?.sDefaultValue),sAccountCode:""})
  }, [dataCollection]);

  // useEffect(() => {
  //   setSelectedOption(selectEdit ?? "");
  //   setSingleSelected(selectEdit ?? "")
  //   setSelectedOptions(selectEdit ?? "")
  // }, [selectEdit]);
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
  useEffect(() => {
    if (summaryId === "summ_tax") {
      axios
        .get(`${baseURL}${taxUrl}`, {
          headers: {
            Authorization: `Bearer ${token}`
            // Other headers if needed
          }
        })
        .then(result => {
          setTaxCollection(result?.data?.data);
        })
        .catch(() => {
          setCustomError("Something went Wrong");
        });
    } else if (sColumnID === "col_taxdescription") {
      axios
        .get(`${baseURL}${taxUrlFree}`, {
          headers: {
            Authorization: `Bearer ${token}`
            // Other headers if needed
          }
        })
        .then(result => {
          setFree(result?.data?.data?.records);
          setDataCollection(
            result?.data?.data?.records ? result?.data?.data?.records : result?.data?.data
          );
        })
        .catch(() => {
          setCustomError("Something went Wrong");
        });
    } else {
      let uri;
      if (data?.data?.sAction == "CASCADE") {
        uri = replaceUriParams(
          textValue,
          url?.startsWith("/") ? `${baseURL}${url}` : `${baseURL}/${url}`
        );
      } else {
        uri = replaceUriParams(
          textValue,
          url?.startsWith("/") ? `${baseURL}${url}` : `${baseURL}/${url}`
        );
      }
     

      let newUrl = replaceTextValues(uri,textValue)

      axios
        .get(newUrl, {
          headers: {
            Authorization: `Bearer ${token}`
            // Other headers if needed
          }
        })
        .then(result => {
          console.log("hjwevhjewfvhfewv", result);
          setDataCollection(
            result?.data?.data?.records ? result?.data?.data?.records : result?.data?.data
          );
        })
        .catch(err => {
          setCustomError(err.response.data.metadata.msg);
        });
    }
  }, [formIsSubmited,
    isSubmited,
    textValue?.[data?.data?.sDataAware && data?.data?.sDataAware?.replace(/[{}]/g, "")]
  ]);

  useEffect(() => {
    if(singleSelected?.sLocationCode){
      setDefaultTableSelectedLocation(singleSelected?.sLocationCode);
    }
  }, [singleSelected?.sLocationCode])

  const handleChange = (event) => {
    const selectedValue = event?.target?.value;
    if (selectedValue == "addnew") {
      openModalforGroupAdd(data);
      setSelectAndAutocompleteSname({ name: data.component.sName, value: data?.data.sValueField })
      return;
    }
    if (selectedValue === "") {
      setSingleSelected("");
      handledatachange("");
      datasend("");
      return;
    }

    let singleSelected;
    singleSelected = dataCollection?.find(
      option => option[data?.data?.sValueField] === selectedValue
    );
    setSingleSelected(singleSelected);
    // UPDATED BITS Enterprise.js
    // if (singleSelected.hasOwnProperty("dTermDays")) {
    //   setdTermDays(singleSelected.dTermDays)
    // }
    if (singleSelected.dTermDays) {
      setdTermDays(singleSelected.dTermDays)
    }
    handledatachange(singleSelected);
    datasend(singleSelected?.[valueBack], singleSelected);
  };
  const handleNativeChange = event => {
    const selectedValue = event?.target?.value;

    // alert(selectedValue)
    if (selectedValue == "") {
      setNativeSelected([])
      return
    }
    setNativeSelected(preState => {
      const exists = preState.some(option => option === selectedValue);

      if (exists) {
        // Remove the value if it exists
        return preState.filter(option => option !== selectedValue);
      } else {
        // Add the value if it doesn't exist
        return [...preState, selectedValue];
      }
    })
    // datasend(selectedValue);
  };

  const handleTax = event => {
    onChildSelect(event.target[displayItems.display2]);
    setSelectedOption(event.target[displayItems.display2]);
  };

  const handleOptionSelect = event => {
    const selectedValues = event.target.value;
    const lastSelectedValue = selectedValues[selectedValues.length - 1];

    setSelectedOptions(preState => {
      const exists = preState.some(option => option[data?.data?.sValueField] === lastSelectedValue);

      if (exists) {
        // Remove the value if it exists

        return preState.filter(option => option[data?.data?.sValueField] !== lastSelectedValue);
      } else {
        // Add the value if it doesn't exist
        const newSelectedOption = dataCollection?.find(
          option => option[data?.data?.sValueField] === lastSelectedValue
        );
        return [...preState, newSelectedOption];
      }
    });
  };

  const handleChangeMultiSelect = event => {
    const { value } = event.target;
    const selected = dataCollection?.filter(option =>
      value.includes(option[displayItems.display2])
    );
    setSelectedOptions(selected);
  };

  const handleChangeTax = event => {
    setSelectedOption(event.target[displayItems.display2]);
    handledatachange(event.target[displayItems.display2]);
  };
  function getVATPercentage(vatString) {
    // Use regular expressions to extract the percentage value from the string
    const matches = vatString && vatString?.match(/\((\d+(\.\d+)?)%\)/);

    if (matches && matches[1]) {
      // Parse the matched value as a floating-point number
      return parseFloat(matches[1]);
    }

    // Return a default value or handle errors as needed
    return null;
  }

  // const vatPercentage = getVATPercentage(def_value && def_value);
  // const vatPercentage = def_value

  if (subTotalDef) {
    var vald = getVATPercentage(subTotalDef?.summ_tax);
  }

  useEffect(() => {
    setDefSelected(selectedOption === "" ? +vald : selectedOption);
  }, [selectedOption]);

  // console.log('jjj',sColumnID,textValue);

  useEffect(() => {
    if (typeof textValue === "object") {
      // alert(JSON.stringify(textValue?.[sColumnID]));
      const selectData = dataCollection?.filter(item => {
        if (item?.[data?.data?.sValueField] == textValue?.[sColumnID]) {
          return item;
        }
      });
      // console.log(`jjj  ${sColumnID} ${JSON.stringify(selectData)}`)
      if (selectData.length > 0) {
        setSelectedOptions(selectData);
        setSingleSelected(selectData[0]);
        if (selectData[0].dTermDays) {
          setdTermDays(selectData[0].dTermDays)
        }
      } else {
        setSelectedOptions([]);
        // setSingleSelected(false);
      }
    }
    setNativeSelected([textValue?.[sColumnID]])
   
  }, [dataCollection, textValue?.[sColumnID]]);

  function replaceTextValues(displayFormat, textValue) {
    return displayFormat.replace(/\{([^}]+)\}/g, function (match, key) {
      return textValue[key] || ""; // Replace with the value from textValue or an empty string if not found
    });
  }
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

  function openModalforGroupAdd(data) {
    const mode = {
      options: {
        mode: "DEFAULT",
        handler: "handleDialog",
        dialog: data.data.sAdd.sAddForm,
        sDataSource: data.data.sDataSource
      }
    };
    handleClickOpen("s", mode);
  }

  const [isRestricted, setRestricted] = useState(false);

  // function fetchActivity() {
  //   const urlCapture =
  //     serverAddress +
  //     `/form/isallowed/transaction?module=${mainFormData.form.sFormName}&activity=${data?.component.options.mode}`;
  //   axios
  //     .get(urlCapture, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //         // Other headers if needed
  //       }
  //     })
  //     .then(result => {

  //       if (result.data.data.Access == "No") {
  //         setRestricted(true);
  //       }
  //     })
  //     .catch(error => {
  //       console.error(error, "error456");
  //     });
  // }

  // useEffect(() => {
  //   if (data?.component.options.action !== "CANCEL" && data?.component.options.action !== "CLOSE") {
  //     fetchActivity();
  //   }
  //   return ()=>{
  //     setRestricted(false)
  //   }
  // }, [mainFormData, data]);
  const uniqueClasses = Array.from(
    new Set(dataCollection.map(item => item?.[data?.data?.sGroupField]))
  );

  const [activityBTN, setActivityBTN] = useState(false);

  function fetchActivity() {
    if (data?.data?.sAdd?.sFormName && data?.data?.sAdd?.sAction) {
      const urlCapture =
        serverAddress +
        `/form/isallowed/transaction?module=${data?.data?.sAdd?.sFormName}&activity=${data?.data?.sAdd?.sAction}`;
      axios
        .get(urlCapture, {
          headers: {
            Authorization: `Bearer ${token}`
            // Other headers if needed
          }
        })
        .then(result => {
          if (result.data.data.Access == "No") {
            setActivityBTN(true);
          }
        })
        .catch(error => {
          console.error(error, "error456");
        });
    }
  }

  React.useEffect(() => {
    fetchActivity();
  }, []);
  return (
    <>
{/* {data.data.sValueField} */}
      {/* {JSON.stringify(singleSelected)}
      {JSON.stringify(textValue?.[sColumnID])} */}
      {customError !== "" && <CustomAlert severity="error" message={customError} />}
      <Box>
        {dataComponent?.options?.mode === "DEFAULT" ? (
          <>
          {/* {JSON.stringify(data?.component?.options?.textFieldProps)} */}
            <FormControl
              {...data?.component?.options?.textFieldProps }
              fullWidth
              //size={summaryId === "summ_tax" ? "small" : undefined}
              // style={{ minWidth: summaryId === "summ_tax" ? "100%" : undefined }}
            >
              <InputLabel id="demo-simple-select-label">
                {formActionchecked === "EDIT"
                  ? datemod === "FREEFORM"
                    ? selectedOption
                    : dataComponent?.sLabel
                  : dataComponent?.sLabel}
              </InputLabel>
{/* {data.data.sDisplayField} */}
              {/* {JSON.stringify(data?.component?.options?.textFieldProps)} */}
              <Select
                labelId="demo-simple-select-label"
                id={data?.component?.sName}
                // size="small"
                fullWidth={true}
                name={data?.component?.sName}
                error={errors}
                {...data?.component?.options?.textFieldProps }
                label={dataComponent?.sLabel}
                value={summaryId === "summ_tax" ? def_selected : singleSelected}
                onChange={handleChange}
                renderValue={selected => {
                  // alert(JSON.stringify(selected));
                  return singleSelected[data?.data?.sValueField] == undefined ? (
                    ""
                  ) : (
                    <span style={{ whiteSpace: "pre-line" }}>
                     <div component="span" style={{width:"100%"}} dangerouslySetInnerHTML={{ __html:singleSelected &&
                    singleSelected != "" &&
                    Object.keys(singleSelected).length !== 0
                      ? vsprintf(
                          data.data.sDisplayFormat,
                          replacePlaceholders(data.data.sDisplayField, singleSelected)
                            ?.replace(/[{}]/g, "")
                            ?.split(",")
                        )
                      : ""}}/>
                      {/* {  replaceTextValues(data?.data?.sDisplayFormat,singleSelected)} */}
                    </span>
                  );
                }}
                // renderValue={selected => {
                //   return singleSelected[data?.data?.sValueField] == undefined ? (
                //     ""
                //   ) : (
                //     <span style={{ whiteSpace: "pre-line" }}>
                //       {
                //       singleSelected &&
                //       singleSelected != "" &&
                //       Object.keys(singleSelected).length !== 0
                //         ? vsprintf(
                //             data.data.sDisplayFormat,
                //             replacePlaceholders(data.data.sDisplayField, singleSelected)
                //               .replace(/[{}]/g, "")
                //               .split(",")
                //           )
                //         : ""}

                //       {/* {  replaceTextValues(data?.data?.sDisplayFormat,singleSelected)} */}
                //     </span>
                //   );
                //   // const display1Value = selected[displayItems.display1];
                //   // const display2Value = selected[displayItems.display2];
                //   // if (display1Value) {
                //   //   if (display2Value) {
                //   //     return <span>{`${display1Value} (${display2Value})`}</span>;
                //   //   } else {
                //   //     return <span>{`${display1Value} `}</span>;
                //   //   }
                //   // } else {
                //   //   return "";
                //   // }
                // }}
                disabled={isDisabledTable}
                {...data?.component?.sProps}
                {...data?.component?.sProps?.InputProps}
                {...data?.component?.options?.textFieldProps}
              >
                <MenuItem value="">
                  <em>{data?.component.sPlaceHolder}</em>
                </MenuItem>

                {uniqueClasses.flatMap(className => [
                  <ListSubheader key={`header-${className}`}>
                    {className?.toUpperCase()}
                  </ListSubheader>,
                  ...dataCollection
                    .filter(item => item?.[data.data.sGroupField] === className)
                    .map(item => (
                      <MenuItem
                        key={item.value}
                        value={item[data?.data.sValueField]}
                        style={{ whiteSpace: "pre-line" }}
                      > 
                      {/* {JSON.stringify(item)}{data?.data.sValueField}  */}
                        <Box sx={{ marginLeft: 2 }}>
                        <div component="span" style={{width:"100%"}} dangerouslySetInnerHTML={{ __html:item &&
                    item != "" &&
                    Object.keys(item).length !== 0
                      ? vsprintf(
                          data.data.sDisplayFormat,
                          replacePlaceholders(data.data.sDisplayField, item)
                            ?.replace(/[{}]/g, "")
                            ?.split(",")
                        )
                      : ""}}/>
                        </Box>
                      </MenuItem>
                    ))
                ])}
              </Select>
            </FormControl>
          </>
        ) : dataComponent?.options?.mode === "MULTISELECT" &&
          dataComponent?.options?.submode === "DEFAULT" ? (
          <>
            <FormControl {...dataComponent?.options?.textFieldProps }>
              <InputLabel id="demo-simple-select-label">
                {formActionchecked === "EDIT"
                  ? datemod === "FREEFORM"
                    ? selectedOption
                    : dataComponent?.sLabel
                  : dataComponent?.sLabel}
              </InputLabel>
              {/* {JSON.stringify(selectedOptions)} */}
              <Select
                multiple={dataComponent?.options?.mode === "MULTISELECT" ? true : false}
                value={selectedOptions}
                onChange={handleOptionSelect}
                label={dataComponent?.sLabel}
                size="small"
                renderValue={selected => (
                  <div>
                    {selectedOptions?.map((item, ind) =>

                     <div component="span" style={{width:"100%"}} dangerouslySetInnerHTML={{ __html:item &&
                    item != "" &&
                    Object.keys(item).length !== 0
                      ? vsprintf(
                          data.data.sDisplayFormat,
                          replacePlaceholders(data.data.sDisplayField, item)
                            .replace(/[{}]/g, "")
                            .split(",")
                        )
                      : ""}}/>
                    )}
                  </div>
                )}
                {...data?.component?.options?.textFieldProps }
                {...data?.component?.sProps}
                {...data?.component?.options?.textFieldProps}
              >
                <FormHelperText>{dataComponent?.sHelper}</FormHelperText>
                <MenuItem value=""> </MenuItem>

                {uniqueClasses.flatMap(className => [
                  <ListSubheader key={`header-${className}`}>
                    {className?.toUpperCase()}
                  </ListSubheader>,
                  ...dataCollection
                    .filter(item => item?.[data.data.sGroupField] === className)
                    .map(item => (
                      <MenuItem
                        key={item.value}
                        value={item[data?.data.sValueField]}
                        style={{ whiteSpace: "pre-line" }}
                      >
                        <Box sx={{ marginLeft: 2 }}>
                        <div component="span" style={{width:"100%"}} dangerouslySetInnerHTML={{ __html:item &&
                    item != "" &&
                    Object.keys(item).length !== 0
                      ? vsprintf(
                          data.data.sDisplayFormat,
                          replacePlaceholders(data.data.sDisplayField, item)
                            .replace(/[{}]/g, "")
                            .split(",")
                        )
                      : ""}}/>
                          
                        </Box>
                        {/* {replaceTextValues(data?.data?.sDisplayFormat,item)}d */}
                        {/* {item[displayItems.display1]}{" "}
{item[displayItems.display2] && ` (${item[displayItems.display2]})`} */}
                      </MenuItem>
                    ))
                ])}
                {taxCollection?.map(option => (
                  <MenuItem
                    key={option[data?.data.sValueField]}
                    value={option[data?.data.sValueField]}
                  >
                    {option[displayItems.display1]} {option[displayItems.display2]}
                  </MenuItem>
                ))}
                {taxFree?.map(option => {
                  return (
                    <MenuItem
                      key={option[data?.data.sValueField]}
                      value={option[data?.data.sValueField]}
                    >
                      {option[displayItems.display1]} {option[displayItems.display2]}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </>
        ) : dataComponent?.options?.mode === "MULTISELECT" &&
          dataComponent?.options?.submode === "CHECKBOXES" ? (
          <>
            <FormControl {...dataComponent?.options?.textFieldProps }>
              <InputLabel id="demo-simple-select-label">
                {formActionchecked === "EDIT"
                  ? datemod === "FREEFORM"
                    ? selectedOption
                    : dataComponent?.sLabel
                  : dataComponent?.sLabel}
              </InputLabel>
              <Select
                multiple
                value={selectedOptions}
                onChange={handleOptionSelect}
                renderValue={items => (
                  <>
                  {
                    items?.map((item) => <div component="span" style={{width:"100%"}} dangerouslySetInnerHTML={{ __html:item &&
                      item != "" &&
                      Object.keys(item).length !== 0
                      ? vsprintf(
                        data.data.sDisplayFormat,
                        replacePlaceholders(data.data.sDisplayField, item)
                        .replace(/[{}]/g, "")
                        .split(",")
                      )
                      : ""}}/> )
                  }
                 
                   
                    </>
                )}
                {...data?.component?.options?.textFieldProps }
                {...data?.component?.sProps}
                {...data?.component?.options?.textFieldProps}
              >
                {uniqueClasses.flatMap(className => [
                  <ListSubheader key={`header-${className}`}>
                    {className?.toUpperCase()}
                  </ListSubheader>,
                  ...dataCollection
                    .filter(item => item?.[data.data.sGroupField] === className)
                    .map(item => (
                      <MenuItem
                        key={item.value}
                        value={item[data?.data.sValueField]}
                        style={{ whiteSpace: "pre-line" }}
                      >
                        <Box sx={{ marginLeft: 2 ,display:'flex',alignItems:"center",gap:1}}>
                          <Checkbox
                            checked={
                              selectedOptions?.find(
                                o => o[data?.data.sValueField] === item[data?.data.sValueField]
                              ) !== undefined
                            }
                          />

                          <div component="span" style={{width:"100%"}} dangerouslySetInnerHTML={{ __html:item &&
                      item != "" &&
                      Object.keys(item).length !== 0
                        ? vsprintf(
                            data.data.sDisplayFormat,
                            replacePlaceholders(data.data.sDisplayField, item)
                              .replace(/[{}]/g, "")
                              .split(",")
                          )
                        : ""}}/>
                        </Box>
                        {/* {replaceTextValues(data?.data?.sDisplayFormat,item)}d */}
                        {/* {item[displayItems.display1]}{" "}
{item[displayItems.display2] && ` (${item[displayItems.display2]})`} */}
                      </MenuItem>
                    ))
                ])}
              </Select>
            </FormControl>
          </>
        ) : dataComponent?.options?.mode === "MULTISELECT" &&
          dataComponent?.options?.submode === "CHIP" ? (
          <>
            <FormControl {...dataComponent?.options?.textFieldProps }>
              <InputLabel id="demo-simple-select-label">
                {formActionchecked === "EDIT"
                  ? datemod === "FREEFORM"
                    ? dataComponent?.sLabel
                    : dataComponent?.sLabel
                  : dataComponent?.sLabel}
              </InputLabel>

              <Select
                multiple={dataComponent?.options?.mode === "MULTISELECT" ? true : false}
                value={selectedOptions}
                onChange={handleOptionSelect}
                label={dataComponent?.sLabel}
                renderValue={() => {
                  return (
                    <Box>
                      {selectedOptions?.map(option => (
                        <Chip
                          key={option[data?.data.sValueField]}
                          label={
                            option && option != "" && Object.keys(option).length !== 0
                              ? vsprintf(
                                  data.data.sDisplayFormat,
                                  replacePlaceholders(data.data.sDisplayField, option)
                                    .replace(/[{}]/g, "")
                                    .split(",")
                                )
                              : ""
                          }
                        />
                      ))}
                    </Box>
                  );
                }}
                {...data?.component?.options?.textFieldProps }
                {...data?.component?.sProps}
                {...data?.component?.options?.textFieldProps}
              >
                <FormHelperText>{dataComponent?.sHelper}</FormHelperText>
                <MenuItem value=""> </MenuItem>
                {uniqueClasses.flatMap(className => [
                  <ListSubheader key={`header-${className}`}>
                    {className?.toUpperCase()}
                  </ListSubheader>,
                  ...dataCollection
                    .filter(item => item?.[data.data.sGroupField] === className)
                    .map(item => (
                      <MenuItem
                        key={item.value}
                        value={item[data?.data.sValueField]}
                        style={{ whiteSpace: "pre-line" }}
                      >
                        <Box sx={{ marginLeft: 2 }}>
                        <div component="span" style={{width:"100%"}} dangerouslySetInnerHTML={{ __html:item &&
                      item != "" &&
                      Object.keys(item).length !== 0
                        ? vsprintf(
                            data.data.sDisplayFormat,
                            replacePlaceholders(data.data.sDisplayField, item)
                              .replace(/[{}]/g, "")
                              .split(",")
                          )
                        : ""}}/>
                          
                        </Box>
                        {/* {replaceTextValues(data?.data?.sDisplayFormat,item)}d */}
                        {/* {item[displayItems.display1]}{" "}
{item[displayItems.display2] && ` (${item[displayItems.display2]})`} */}
                      </MenuItem>
                    ))
                ])}

                {taxCollection?.map(option => (
                  <MenuItem
                    key={option[data?.data.sValueField]}
                    value={option[data?.data.sValueField]}
                  >
                    {option[displayItems.display1]}{" "}
                    {option[displayItems.display2] && ` (${option[displayItems.display2]})`}
                  </MenuItem>
                ))}
                {taxFree?.map(option => (
                  <MenuItem
                    key={option[data?.data.sValueField]}
                    value={option[data?.data.sValueField]}
                  >
                    {option[displayItems.display1]}{" "}
                    {option[displayItems.display2] && ` (${option[displayItems.display2]})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        ) : dataComponent?.options?.mode === "MULTISELECT" &&
          dataComponent?.options?.submode === "NATIVE" ? (
          <>
            {/* {JSON.stringify(selectedOptions)} */}
            <FormControl {...dataComponent?.options?.textFieldProps }>
              <InputLabel
                id="demo-simple-select-label"
                shrink={
                  dataComponent?.options?.mode === "MULTISELECT" &&
                  dataComponent?.options?.submode === "NATIVE" &&
                  true
                }
              >
                {formActionchecked === "EDIT"
                  ? datemod === "FREEFORM"
                    ? selectedOption
                    : dataComponent?.sLabel
                  : dataComponent?.sLabel}
              </InputLabel>
      
              <Select
                multiple={dataComponent?.options?.mode === "MULTISELECT" ? true : false}
                // defaultValue={dataComponent?.sDefaultValue}
                native={
                  dataComponent?.options?.mode === "MULTISELECT" &&
                  dataComponent?.options?.submode === "NATIVE"
                    ? true
                    : false
                }
                value={nativeSelected}
                onChange={handleNativeChange}
                label={dataComponent?.sLabel}
                {...data?.component?.options?.textFieldProps }
                inputProps={{
                  id: "select-multiple-native"
                }}
                {...data?.component?.sProps}
                {...data?.component?.options?.textFieldProps}
                renderValue={selected => {
                  return selected[data?.data?.sValueField] == undefined ? (
                    ""
                  ) : (
                    <div component="span" style={{width:"100%"}} dangerouslySetInnerHTML={{ __html:selected &&
                      selected != "" &&
                      Object.keys(selected).length !== 0
                        ? vsprintf(
                            data.data.sDisplayFormat,
                            replacePlaceholders(data.data.sDisplayField, selected)
                              .replace(/[{}]/g, "")
                              .split(",")
                          )
                        : ""}}/>
                   
                  );
                 
                }}
              >
                <FormHelperText>{dataComponent?.sHelper}</FormHelperText>
                <option value=""> </option>
                {dataCollection?.map(item => (
                  <option key={item[data?.data.sValueField]} value={item[data?.data.sValueField]}>
                   <div component="span" style={{width:"100%"}} dangerouslySetInnerHTML={{ __html:item &&
                      item != "" &&
                      Object.keys(item).length !== 0
                        ? vsprintf(
                            data.data.sDisplayFormat,
                            replacePlaceholders(data.data.sDisplayField, item)
                              .replace(/[{}]/g, "")
                              .split(",")
                          )
                        : ""}}/>
                  </option>
                ))}
                {taxCollection?.map(item => (
                  <option key={item?.display} value={item?.display}>
                    {item[displayItems.display1]}{" "}
                    {item[displayItems.display2] && ` (${item[displayItems.display2]})`}
                  </option>
                ))}
                {taxFree?.map(item => (
                  <option key={item?.display} value={item?.display}>
                    {item[displayItems.display1]}{" "}
                    {item[displayItems.display2] && ` (${item[displayItems.display2]})`}
                  </option>
                ))}
              </Select>
            </FormControl>
          </>
        ) : sColumnID === "col_taxdescription" ? (
          <>
            <FormControl {...dataComponent?.options?.textFieldProps }>
              <InputLabel id="demo-simple-select-label">
                {formActionchecked === "EDIT"
                  ? datemod === "FREEFORM"
                    ? selectedOption
                    : dataComponent?.sLabel
                  : dataComponent?.sLabel}
              </InputLabel>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label={dataComponent?.sLabel}
                value={selectedOption || ""}
                onChange={handleChangeTax}
                {...data?.component?.options?.textFieldProps }
                {...data?.component?.sProps}
                {...data?.component?.options?.textFieldProps}
              >
                <FormHelperText>{dataComponent?.sHelper}</FormHelperText>
                <MenuItem value=""> </MenuItem>
                {/* {dataCollection?.map(option => (
                  <MenuItem
                    key={option[data?.data.sValueField]}
                    value={option[data?.data.sValueField]}
                  >
                    {option?.display}
                  </MenuItem>
                ))} */}

                {dataCollection?.map(option => (
                  <MenuItem
                    key={option[data?.data?.sValueField]}
                    value={option[data?.data?.sValueField]}
                  >
                 
                       <div component="span" style={{width:"100%"}} dangerouslySetInnerHTML={{ __html:option &&
                      option != "" &&
                      Object.keys(option).length !== 0
                        ? vsprintf(
                            data.data.sDisplayFormat,
                            replacePlaceholders(data.data.sDisplayField, option)
                              .replace(/[{}]/g, "")
                              .split(",")
                          )
                        : ""}}/>
                  </MenuItem>
                ))}

                {taxCollection?.map(option => (
                  <MenuItem
                    key={option[data?.data.sValueField]}
                    value={option[data?.data.sValueField]}
                  >
                    {option.display}
                  </MenuItem>
                ))}
                {taxFree?.map(option => {
                  return (
                    <MenuItem
                      key={option[data?.data.sValueField]}
                      value={option[data?.data.sValueField]}
                    >
                      {option[displayItems.display1]} {option[displayItems.display2]}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </>
        ) : null}
        {dataComponent?.options?.mode === "ADD" && (
          <>
            <FormControl
              {...data?.component?.options?.textFieldProps }
              // fullWidth
              //size={summaryId === "summ_tax" ? "small" : undefined}
              // style={{ minWidth: summaryId === "summ_tax" ? "100%" : undefined }}
            >
              <InputLabel id="demo-simple-select-label">
                {formActionchecked === "EDIT"
                  ? datemod === "FREEFORM"
                    ? selectedOption
                    : dataComponent?.sLabel
                  : dataComponent?.sLabel}
              </InputLabel>

              {/* {JSON.stringify(data?.component?.options?.textFieldProps)} */}
              <Select
                labelId="demo-simple-select-label"
                id={data?.component?.sName}
                // size="small"
                // fullWidth
                name={data?.component?.sName}
                {...data?.component?.options?.textFieldProps }
                label={dataComponent?.sLabel}
                value={summaryId === "summ_tax" ? def_selected : singleSelected}
                onChange={handleChange}
                renderValue={selected => {
                  return singleSelected[data?.data?.sValueField] == undefined ? (
                    ""
                  ) : (
                    <div component="span" style={{width:"100%"}} dangerouslySetInnerHTML={{ __html:singleSelected &&
                      singleSelected != "" &&
                      Object.keys(singleSelected).length !== 0
                        ? vsprintf(
                            data.data.sDisplayFormat,
                            replacePlaceholders(data.data.sDisplayField, singleSelected)
                              .replace(/[{}]/g, "")
                              .split(",")
                          )
                        : ""}}/>
                    
                  );
                  // const display1Value = selected[displayItems.display1];
                  // const display2Value = selected[displayItems.display2];
                  // if (display1Value) {
                  //   if (display2Value) {
                  //     return <span>{`${display1Value} (${display2Value})`}</span>;
                  //   } else {
                  //     return <span>{`${display1Value} `}</span>;
                  //   }
                  // } else {
                  //   return "";
                  // }
                }}
                disabled={isDisabledTable}
                {...data?.component?.sProps}
                {...data?.component?.options?.textFieldProps}
              >
                <MenuItem
                  sx={{
                    color: "primary.main",
                    justifyContent: "flex-start",
                    pl: 2,
                    mt: 2,
                    position: "sticky",
                    backgroundColor: "white",
                    opacity: 1,
                    top: 0,
                    zIndex: 100000
                  }}
                  value="addnew"
                  disabled={activityBTN}
                >

                  <Icon iconName={data?.data?.sAdd?.sAddIcon}  sProps={data?.data?.sAdd?.sIconProps} />    {data?.data?.sAdd?.sAddMessage} 
                </MenuItem>

                <MenuItem value="">
                  <em>{data?.component.sPlaceHolder}</em>
                </MenuItem>
                {uniqueClasses.flatMap(className => [
                  <ListSubheader   key={`header-${className}`}>
                    {className?.toUpperCase()}
                  </ListSubheader>,
                  ...dataCollection
                    .filter(item => item?.[data.data.sGroupField] === className)
                    .map(item => (
                      <MenuItem
                        key={item.value}
                        value={item[data?.data.sValueField]}
                        style={{ whiteSpace: "pre-line" }}
                      >
                        <Box sx={{ marginLeft: 2 }}>
                        <div component="span" style={{width:"100%"}} dangerouslySetInnerHTML={{ __html:item &&
                      item && item != "" && Object.keys(item).length !== 0
                      ? vsprintf(
                          data.data.sDisplayFormat,
                          replacePlaceholders(data.data.sDisplayField, item)
                            .replace(/[{}]/g, "")
                            .split(",")
                        )
                      : ""}}/>
                         
                        </Box>
                      </MenuItem>
                    ))
                ])}
              </Select>

              {/* <GroupedSelect renderData={dataCollection} data={data} /> */}
            </FormControl>
          </>
        )}
      <FormHelperText sx={{ color: errors && errors && "red" }} id={`${data?.component?.sName}-helper-text`}>
        {(errors && errors) || data?.component?.sHelper}
      </FormHelperText>
      </Box>
    
    </>
  );
}