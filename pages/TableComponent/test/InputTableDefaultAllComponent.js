import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { baseURL } from "../../api";
import { Global_Data } from "../../globalData/GlobalData";
import AutoComplete from "../AutoComplete/AutoComplete";
import * as MUIICon from "@mui/icons-material";

import { Icon } from "../../utils/MuiIcons/Icon";
import { serverAddress } from "../../config";
import ImgComponent from "../../component/ImgComponent/ImgComponent";
import SelectMainComponent from "../SelectComponent/SelectMainComponent";
import { sprintf, vsprintf } from "sprintf-js";
import VarDateTime from "../../component/VARDATETIME/VarDateTime";
import VarValue from "../../component/Accordian/VarValue";

function InputTableDefaultAllComponent({
  data,
  takeInput,
  setcolTaxOption,
  format,
  priceSelect,
  id,
  value,
  setTaxFirstOption,valueStaxCode,
  callingFrom,
  setcolTaxOptions,
  isFromSummary,
  allFeildForDoucmentSelect,
  setPrice,
  setkitMappingArray,
  editable,
  sWithholdCode,
  rowData,
  formAction,
  selectedOBJ,
  isSubmited,
  mapping,
  feildName,
  handleClickOpen2,
  item,
  setSummaryTaxSelect,
  col_item,
  data2,qtySelectValue,
  setallAccountData,
  error,
  defaultTableEditData,
  textValue,
  params,
  summary,
  mainData,
  setQuantityTypeMapping,
  quantityTypeMapping,
  resetQuantityTypeDefault, setResetQuantityTypeDefault,
  taxDefaultValueCode, setTaxDefaultValueCode,
  priceSelectFetchApi,
  baseURL,
  formData,
  paramsRow,
  setEditDataQtyType,
  isPriceSelectClicked,
  setIsPriceSelectClicked,
  setBulkDataLoaded,
  bulkDataLoaded,
  rowClone,
  setRowClone,
  documentSelectTableData,
  csvFile,
  loadQtyCodesCSVData
}) {
  const [selectedAUTOCOMPLETE, setselectedAUTOCOMPLETE] = useState({});
  const [updateImage, setUpdateImage] = useState(false);
const [selectedQuentity, setselectedQuentity] = useState({});
  if (data?.inputType?.component.sType === "IMG") {
    return (
      <>
        <ImgComponent value={value || ""} data={data.inputType} id={id} updateImage={updateImage} setUpdateImage={setUpdateImage} />
        {/* <Grid {...data?.inputType.grid_props}> */}
      </>
    );
  }
  if (data?.inputType?.component.sType === "VARVALUE") {

    const [updatedParamsRow, setUpdatedParamsRow] = useState();
    const { defaultTableSelectedLocation } = Global_Data();
    useEffect(() => {
      const row = JSON.parse(JSON.stringify(paramsRow));
      if(defaultTableSelectedLocation){
        row.sLocationCode = defaultTableSelectedLocation;
      }
      setUpdatedParamsRow(row);
    }, [paramsRow, defaultTableSelectedLocation])

    return (
        <Grid item {...data?.inputType?.grid_props}>
          <VarValue data={data?.inputType} textValue={updatedParamsRow} />
        </Grid>
    );
  }
  if (data?.inputType?.component.sType === "VARNUMBER") {
    
    let isPositive = Number(paramsRow[params["field"]]) >= 0;

    let sxProps = isPositive
    ? data?.inputType?.component?.sPositiveProps
    : data?.inputType?.component?.sNegativeProps || {};

    const formatedData = paramsRow[params["field"]]
    ? sprintf(
        isPositive ? data?.inputType?.component?.sPositiveFormat : data?.inputType?.component?.sNegativeFormat,
        paramsRow[params["field"]]
      )
    : "";

    const addThousandSeparatorToNumber = (numberString) => {
      const formattedNumber = parseFloat(numberString).toFixed(2);
      const [integerPart, decimalPart] = formattedNumber.split(".");
      const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (data?.inputType?.component?.iDecimalPlaces == 0) {
        return `${formattedIntegerPart}`; 
      }
      if (data?.inputType?.component?.iDecimalPlaces == 1) {
        return parseFloat(`${formattedIntegerPart}.${decimalPart}`).toFixed(1);
      }
      if (data?.inputType?.component?.iDecimalPlaces == 2) {
        return `${formattedIntegerPart}.${decimalPart}`;
      }
    }

    const formatAllNumbersInString = (input) => {
      return input.replace(/-?\d+(\.\d+)?/g, match => addThousandSeparatorToNumber(match));
    }

    return (
      <Grid item {...data?.grid_props}>
        <Typography {...sxProps} id={`${data?.inputType?.component?.sName}-${params.id}`}>
          {/* {console.log("kjewqbnkjfwbfewq", data)} */}
          {formatedData.includes(undefined)
            ? ""
            : <span dangerouslySetInnerHTML={{ __html: formatAllNumbersInString(formatedData) }} /> ||
              ""}
        </Typography>
      </Grid>
    );
  }
  if (data?.inputType?.component.sType === "SELECT") {
    // alert(data?.inputType?.component.sType)

    const handleSelectChange = e => {
      const event = {
        target: {
          name: feildName,
          value: e
        }
      };

      takeInput(event, id);
    };
    return (
      <>
        {/* {JSON.stringify(data?.inputType?.component?.options?.mode)} */}

        <FormControl {...item?.component?.options?.others1}>
          <SelectMainComponent
            // isDisabledTable={isDisabledTable == false ? editable : isDisabledTable}
            textValue={{ [feildName]: value }}
            errors={error}
            handledatasend={e => handleSelectChange(e, id, feildName)}
            taxUrlFree={data?.inputType?.data?.sDataSource}
            sColumnID={feildName}
            data={data.inputType}
            datemod={data?.inputType?.component?.options?.mode}
            formaction={"Add"}
            selectEdit={feildName}
            // isSubmited={isSubmited}
          />
        </FormControl>
      </>
    );
  }

  // {data?.inputType?.component.sType === "AUTOCOMPLETE" ? (
  //   <Typography  {...item?.component?.sProps}>
  //     { value}
  //   </Typography>
  // ) : null}
  function setselectedAUTOCOMPLETEFunction(item) {
    // alert(JSON.stringify(item));
    setselectedAUTOCOMPLETE(item);
    if (selectedOBJ && Object.keys(item).length > 0) {
      //  setTimeout(() => {
      //   selectedOBJ(item)
      //  }, 1000);
      selectedOBJ(item);
    }
  }

  if (data?.inputType?.component.sType === "QUANTITY") {
    const { setConversionNamesMapping } = Global_Data();
    const qtyHandleSelect = (val, newData) => {
      const event = {
        target: {
          name: data?.inputType?.component.sName == "dQuantity" ? "qtySelect" : "expectedQtySelect",
          value: val,
          ...newData
        }
      };
      takeInput(event, id);
    };
    setConversionNamesMapping((prev) => {
      if(!prev.hasOwnProperty(data?.inputType?.component.sName)){
        return {...prev, [data?.inputType?.component.sName]: data?.inputType?.component.sConversionName}
      }
      return prev;
    })
    const  extractValues = (data, Arraykey)=> {
      // Remove curly braces and split the string by commas to get the keys
      let keys = Arraykey.replace(/{|}/g, '').split(',').map(key => key.trim());
      
      // Map the keys to their corresponding values in the data object
      return keys.map(key => data[key]);
    }
    return (
      <>
        <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
          <div style={{ display: "flex" }}>
            <PriceComponent
              // isbyPass={textValue.sByPass}
              // update={update}
              // setPrice={setPrice}
              api={setTaxFirstOption}
              editable={editable}
              data={data}
              // error={''}
              item={item}
              feildName={feildName}
              isbyPass={"isbyPass"}
              from={"qty"}
              setPrice={setPrice}
              name={data?.sColumnID || data.sSummaryID}
              value={value}
              error={error}
              params={params}
              takeInput={takeInput}
              id={id}
              quantityTypeMapping={quantityTypeMapping}
              setQuantityTypeMapping={setQuantityTypeMapping}
              htmlId={data?.sSummaryID ? `${data?.sSummaryID}-value` : `${data?.inputType?.component?.sName}-${id}`}
              setIsPriceSelectClicked={setIsPriceSelectClicked}
              isPriceSelectClicked={isPriceSelectClicked}
              csvFile={csvFile}
            />
            <QuantitySelectComponent
              allFeildForDoucmentSelect={allFeildForDoucmentSelect}
              data2={data2}
              data={data}
              priceSelect={priceSelect}
              value={qtySelectValue}
              setselectedQuentity={setselectedQuentity}
              qtyHandleSelect={qtyHandleSelect}
              rowData={rowData}
              error={error}
              id={id}
              textValue={textValue}
              defaultTableEditData={defaultTableEditData}
              resetQuantityTypeDefault={resetQuantityTypeDefault}
              setResetQuantityTypeDefault={setResetQuantityTypeDefault}
              setEditDataQtyType={setEditDataQtyType}
              setBulkDataLoaded={setBulkDataLoaded}
              bulkDataLoaded={bulkDataLoaded}
              rowClone={rowClone}
              setRowClone={setRowClone}
              documentSelectTableData={documentSelectTableData}
              csvFile={csvFile}
              quantityTypeMapping={quantityTypeMapping}
              loadQtyCodesCSVData={loadQtyCodesCSVData}
            />
          </div>
          {/* {JSON.stringify(item?.inputType?.data?.sHelperField)}
                  {JSON.stringify(item?.inputType?.data?.sHelperFormat)} */}
          {/* <Typography style={{ fontSize: '13px', color: 'red', position: 'absolssute', }}>
  {'error'}
</Typography> */}

          {/* {JSON.stringify( )} */}
          <FormHelperText sx={{ color: error && error && "red" }} id={`${data?.inputType?.component?.sName}-${params?.row?.id}-helper-text`}>
            {error
              ? error
              : data?.inputType?.component?.sHelper == ""
              ? data?.inputType?.component?.sHelper
              : Object?.keys(selectedQuentity)?.length >0 ? vsprintf( item?.inputType?.data?.sHelperFormat,extractValues(selectedQuentity,item?.inputType?.data?.sHelperField)):<br/>}
          </FormHelperText>
        </div>
      </>
    );
  }
  if (data?.inputType?.component.sType === "AUTOCOMPLETE") {
    //  console.log(col_item,'col_item6677');
    // alert(feildName)
    // useEffect(() => {
    //   if (selectedOBJ) {

    //     selectedOBJ(selectedAUTOCOMPLETE)
    //   }
    // },[selectedAUTOCOMPLETE])

    return (
      <>
        {/* {JSON.stringify(selectedAUTOCOMPLETE)} */}
        {/* {feildName} */}
        <AutocompleteComponentDefault
          isSubmited={isSubmited}
          formAction={formAction}
          error={error}
          handleClickOpen2={handleClickOpen2}
          value={value}
          setkitMappingArray={setkitMappingArray}
          mapping={mapping}
          selectedAUTOCOMPLETE={selectedAUTOCOMPLETE}
          setselectedAUTOCOMPLETE={setselectedAUTOCOMPLETEFunction}
          data={data}
          setallAccountData={setallAccountData}
          col_item={col_item}
          feildName={feildName}
          takeInput={takeInput}
          id={id}
          params={params}
          summary={summary}
          mainData={mainData}
          setQuantityTypeMapping={setQuantityTypeMapping}
          priceSelect={priceSelect}
          setResetQuantityTypeDefault={setResetQuantityTypeDefault}
          quantityTypeMapping={quantityTypeMapping}
          setTaxDefaultValueCode={setTaxDefaultValueCode}
          setTaxFirstOption={setTaxFirstOption}
          baseURL={baseURL}
          priceSelectFetchApi={priceSelectFetchApi}
          setUpdateImage={setUpdateImage}
          formData={formData}
          setEditDataQtyType={setEditDataQtyType}
        />
      </>
    );
  }

  if (
    data?.inputType?.component.sType === "NUMBER" ||
    data?.inputType?.component.sType === "DISCOUNT"
  ) {
    return (
      <>
        <PriceComponent
          // isbyPass={textValue.sByPass}
          // update={update}
          // setPrice={setPrice}
          api={setTaxFirstOption}
          editable={editable}
          data={data}
          error={error}
          item={item}
          feildName={feildName}
          isbyPass={"isbyPass"}
          setPrice={setPrice}
          priceSelect={priceSelect}
          name={data?.sColumnID || data.sSummaryID}
          value={value}
          takeInput={takeInput}
          id={id}
          htmlId={data?.sSummaryID ? `${mainData}-${data?.sSummaryID}-value` : `${data?.inputType?.component?.sName}-${id}`}
          sWithholdCode={sWithholdCode}
          params={params}
          quantityTypeMapping={quantityTypeMapping}
          setQuantityTypeMapping={setQuantityTypeMapping}
          priceSelectFetchApi={priceSelectFetchApi}
          formData={formData}
          setIsPriceSelectClicked={setIsPriceSelectClicked}
          isPriceSelectClicked={isPriceSelectClicked}
        />
      </>
    );
  }

  // if (data?.inputType?.component.sType === "DISCOUNT") {
  //   return (
  //     <TextField
  //       size="small"
  //       onChange={e => takeInput(e, id, "CURRENCY")}
  //       name={data?.sColumnID}
  //       value={value}
  //       {...data?.inputType?.component.sProps}
  //     ></TextField>
  //   );
  // }

  if (data?.inputType?.component.sType === "VARDATETIME") {
    return <VarDateTime data={data} value={value} id={`${data?.inputType?.component?.sName}-${params.id}`} />;
  }
  if (data?.inputType?.component.sType === "TAX") {
    return (
      <>
        <SelectComponent
          setTaxFirstOption={setTaxFirstOption}
          api={data?.inputType?.data?.sDataSource}
          name={data?.sColumnID || data.sSummaryID}
          value={value}
          callingFrom={callingFrom}
          setcolTaxOptions={setcolTaxOptions}
          valueStaxCode={valueStaxCode}
          isFromSummary={isFromSummary}
          // error={error}
          setcolTaxOption={setcolTaxOption}
          data={data}
          rowData={rowData}
          item={item}
          setSummaryTaxSelect={setSummaryTaxSelect}
          takeInput={takeInput}
          id={id}
          setTaxDefaultValueCode={setTaxDefaultValueCode}
          taxDefaultValueCode={taxDefaultValueCode}
          taxDefaultValue={taxDefaultValueCode?.applied ? value : taxDefaultValueCode[id - 1]?.sTaxName}
          taxDefaultCode={taxDefaultValueCode?.applied ? valueStaxCode : taxDefaultValueCode[id - 1]?.sTaxCode}
        />
      </>
    );
    // <TextField
    // onChange={(e)=>takeInput(e,id)}
    //     //value={value}
    //     value={value}
    //     {...data?.inputType.component.sProps}
    //   ></TextField>
  }

  if (data?.inputType?.component.sType === "VARTEXT") {
    const styleFormatData = format?.data?.records?.find(
      item1 => item1?.sFieldName == data.inputType.component.sName
    );
    const Icons = MUIICon[styleFormatData?.sStatusIcon];
    const parsedData = styleFormatData ? JSON.parse(styleFormatData?.sFieldFormat) : {};

    // const Icons = MUIICon[styleFormatData?.sStatusIcon];
    const formatedData = sprintf(data?.inputType?.component?.sDisplayFormat || "", value || "");
    return (
      <>
        {/* {JSON.stringify(formatedData.includes('NaN'))} */}
        {/* {JSON.stringify(data?.inputType?.component?.sDisplayFormat)} */}
        {/* {JSON.stringify(value)} */}
        {/* {data.inputType.component.sName} */}
        <Typography {...parsedData} id={`${data?.inputType?.component?.sName}-${params.id}`}>
          {styleFormatData?.sStatusIcon && <Icons />}
          <span
            dangerouslySetInnerHTML={{ __html: formatedData.includes("NaN") ? "" : formatedData }}
          />
        </Typography>
      </>
    );
  }
  if (data?.inputType?.component.sType === "TEXTFIELD") {
    return (
      <>
        {/* {data?.inputType?.component?.sProps?.disabled} */}
        <TextField
          onChange={e => takeInput(e, id)}
          name={data.inputType.inputtable.sColumnID}
          value={value}
          size="small"
          placeholder={data?.inputType?.component?.sPlaceHolder}
          helperText={error ? error : data?.inputType?.component?.sHelper}
          disabled={data?.inputType?.component?.sProps?.disabled}
          label={data?.inputType?.component?.sLabel}
          error={error}
          id={`${data?.inputType?.component?.sName}-${id}`}
          onKeyDown={event => {
            event.stopPropagation();
          }}
          InputProps={
            data?.inputType?.component?.sAdornPosition?.toLowerCase() === "start"
              ? {
                  startAdornment: (
                    <>
                      {data?.inputType?.component?.sAdornPosition &&
                        data?.inputType?.component?.sAdornType.toLowerCase() === "icon" && (
                          <InputAdornment position={data?.inputType?.component?.sAdornPosition}>
                            <Icon iconName={data?.inputType?.component?.sIcon} />
                          </InputAdornment>
                        )}
                      {data?.inputType?.component?.sAdornPosition &&
                        data?.inputType?.component?.sAdornType.toLowerCase() === "text" && (
                          <InputAdornment position={data?.inputType?.component?.sAdornPosition}>
                            {data?.inputType?.component?.sIcon}
                          </InputAdornment>
                        )}
                    </>
                  )
                }
              : {
                  endAdornment: (
                    <>
                      {data?.inputType?.component?.sAdornPosition &&
                        data?.inputType?.component?.sAdornType.toLowerCase() === "icon" && (
                          <InputAdornment position={data?.inputType?.component?.sAdornPosition}>
                            <Icon iconName={data?.inputType?.component?.sIcon} />
                          </InputAdornment>
                        )}
                      {data?.inputType?.component?.sAdornPosition &&
                        data?.inputType?.component?.sAdornType.toLowerCase() === "text" && (
                          <InputAdornment position={data?.inputType?.component?.sAdornPosition}>
                            {data?.inputType?.component?.sIcon}
                          </InputAdornment>
                        )}
                    </>
                  )
                }
          }
          {...data?.inputType?.component.sProps}
          //    value={value}
          //    onChange={e => takeInput(e, id)}
        ></TextField>
      </>
    );
  }
}

const AutocompleteComponentDefault = ({
  isSubmited,
  formAction,
  data,
  takeInput,
  id,
  mapping,
  value,
  setkitMappingArray,
  handleClickOpen2,
  setselectedAUTOCOMPLETE,
  feildName,
  selectedAUTOCOMPLETE,
  setallAccountData,
  col_item,
  error,
  params,
  summary,
  mainData,
  setQuantityTypeMapping,
  priceSelect,
  setResetQuantityTypeDefault,
  quantityTypeMapping,
  setTaxDefaultValueCode,
  baseURL,
  priceSelectFetchApi,
  setUpdateImage,
  formData,
  setEditDataQtyType
}) => {
  const [options, setOptions] = useState([]);
  const [valueName, setValueName] = useState();
  const [display, setDisplay] = useState({});
  const [autoValue, setAutoValue] = useState({});

  const [kitMappingAllArray, setkitMappingAllArray] = useState([]);
  function handleInventoryName(sInventoryID, feild, retnfeild) {
    const inventory = options?.find(item => item[feild] === sInventoryID);
    return inventory ? inventory[retnfeild] : "";
  }

  const handleChange = (value, id, type, name) => {
    setAutoValue({
      [display.display2]: value[display.display2],
      [valueName]: value[valueName]
    });

    const e = {
      target: {
        name: name,
        value: value[valueName]
      }
    };

    // data.takeInput(e, id, "Autocomplete");

    // console.log(e, "value663");
  };

  const { token, defaultTableSelectedSupplier } = Global_Data();

  function getKeyForValue(mapping = {}, targetValue) {
    for (const [key, value] of Object.entries(mapping)) {
        if (value === targetValue) {
            return key;
        }
    }
    return null;
  }

  function fetchTaxCode(itemObj, mapping, targetValue) {
      const key = getKeyForValue(mapping, targetValue);
      if (key && itemObj && typeof itemObj === 'object') {
          return key in itemObj ? itemObj[key] : null;
      }
      return null;
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
  
  const handleChangeAuto = async (val, data, itemObj) => {
    setEditDataQtyType((prev) => prev.filter((item) => item.id !== id))
    let defaultPricing = "0.00";
    let supplierPricing = "0.00";
    try {
      if(!(baseURL + generateDynamicAPI(priceSelectFetchApi, itemObj)).includes("{") && 
      !(baseURL + generateDynamicAPI(priceSelectFetchApi, itemObj)).includes("}")){
        const response = await axios.get(baseURL + generateDynamicAPI(priceSelectFetchApi, itemObj), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        defaultPricing = response?.data?.data?.records?.[0]?.[formData?.pricingOptions?.sPriceOption1?.sPriceField.replaceAll("{", "").replaceAll("}", "")];
        supplierPricing = response?.data?.data?.records?.[0]?.[formData?.pricingOptions?.sPriceOption2?.sPriceField.replaceAll("{", "").replaceAll("}", "")];
        if(!defaultPricing) defaultPricing = "0.00";
        if(!supplierPricing) supplierPricing = "0.00";
        setQuantityTypeMapping((prev) => {
          const existingItemIndex = prev.findIndex((item) => item.id === id);
          if (existingItemIndex !== -1) {
            return prev.map((item, index) =>
              index === existingItemIndex
                ? { ...item, sPriceOption1: defaultPricing, sPriceOption2: supplierPricing, sInventoryCode: itemObj["sInventoryCode"], sAccountTo: defaultTableSelectedSupplier} 
                : item
            );
          }
          return [...prev, { id, sPriceOption1: defaultPricing, sPriceOption2: supplierPricing, sInventoryCode: itemObj["sInventoryCode"], sAccountTo: defaultTableSelectedSupplier, initialState: true }];
        });
      }
    } catch (error) {
      console.log(error);
    }
    const e = {
      target: {
        name: feildName,
        value: val
      }
    };

    const e2 = {
      target: {
        name: "col_account",
        value: data["sAccountCode"]
      }
    };

    const e3 = {
      target: {
        name: "col_img",
        value: data["sImageIDs"]
      }
    };

    let mapfeild = {};

    if (mapping && Object.keys(mapping).length > 0) {
      const keys = Object.keys(mapping);
      const values = Object.values(mapping);


      for (let i = 0; i < keys.length; i++) {

        const obj = {
          ["name" + [i + 1]]:  values[i],
          ["value" + [i + 1]]: itemObj[keys[i]]
        };
        mapfeild = { ...mapfeild, ...obj };
      }
    }
    
    const customEvent = {
      target: {
        ...e.target,
        ...mapfeild
      }
    };
    const existingItemInd = quantityTypeMapping.findIndex((item) => item.id === id);
    if(existingItemInd !== -1){
      setResetQuantityTypeDefault((prev) => ([...prev, id]))
    }
    setTaxDefaultValueCode((prev) => {
      const existingItemIndex = prev.findIndex((item) => item.id === id);
    
      if (existingItemIndex == -1) {
        return [...prev, {id: id, sTaxCode: fetchTaxCode(itemObj, mapping, "col_tax"), sTaxName: itemObj["sTaxName"], applied: false}]
      }
    
      return prev.map((item, index) =>
        index === existingItemIndex
          ? { ...item, sTaxCode: fetchTaxCode(itemObj, mapping, "col_tax"),
            sTaxName: itemObj.sTaxName,
            applied: false } 
          : item
      );;
    });
    setUpdateImage(true);
    takeInput(customEvent, id);

    if (data) {
      // takeInput(e3, id);
    }
  };

  function autoSelectObj(itemObj) {
    // alert(JSON.stringify(item))
    let mapfeild = {};

    if (mapping && Object.keys(mapping).length > 0) {
      const keys = Object.keys(mapping);
      const values = Object.values(mapping);

      for (let i = 0; i < keys.length; i++) {
        const obj = {
          ["name" + [i + 1]]: values[i] =="col_tax"? 'sTaxCode':values[i],
          ["value" + [i + 1]]: itemObj[keys[i]] || ""
        };
        mapfeild = { ...mapfeild, ...obj, id: Object.keys(obj).length > 0 && id };
      }
    }
    const customEvent = {
      target: {
        // ...e.target,
        ...mapfeild
      }
    };

    // setkitMappingAllArray(mapfeild)
    // console.log('kkk');
    if (setkitMappingArray) {
      setkitMappingAllArray(items => {
        const array = [...items, mapfeild];
        const uniqueArray = array.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
        return filterObjectsWithEmptyValues(Object.values(uniqueArray));
      });
    }
    // takeInput(customEvent, id);
  }

  // kitMappingAllArray, setkitMappingAllArray,setkitMappingArray
  const lastDataRef = useRef(kitMappingAllArray);
  const timerRef = useRef(null);
  function filterObjectsWithEmptyValues(array) {
    return array.filter(item => {
      // Get all keys that start with "value"
      const valueKeys = Object.keys(item).filter(key => key.startsWith("value"));

      // Check if all value fields are empty
      const allValuesEmpty = valueKeys.every(key => item[key] === "");

      // Include the item if not all value fields are empty
      return !allValuesEmpty;
    });
  }

  useEffect(() => {
    if (kitMappingAllArray !== lastDataRef.current) {
      lastDataRef.current = kitMappingAllArray;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        // setkitMappingArray(kitMappingAllArray);
        setkitMappingArray(items => {
          if (items) {
            const array = [...items, ...kitMappingAllArray];
            const uniqueArray = array.reduce((acc, item) => {
              acc[item.id] = item;
              return acc;
            }, {});
            return filterObjectsWithEmptyValues(Object.values(uniqueArray));
          }
        });
      }, 1000); // 2000 ms (2 seconds) delay
    }
  }, [kitMappingAllArray]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* {JSON.stringify(handleClickOpen2)} */}
      {/* {mainData?.component?.sName} */}
      <AutoComplete
        formcallback={(e, data, itemObj) => handleChangeAuto(e, data, itemObj)}
        data={data.inputType}
        params={params}
        textValue1={{ [data.inputType.component.sName]: value }}
        placeholder={data.inputType?.component?.sPlaceHolder}
        Automod={data.inputType?.component?.options?.mode}
        formaction={"ADD"}
        id={id}
        errors={error}
        handleClickOpen={handleClickOpen2}
        setallAccountData={setallAccountData}
        // isDisabledTable={editable}
        setselectedAUTOCOMPLETE={setselectedAUTOCOMPLETE}
        isSubmited={isSubmited}
        autoSelectObj={autoSelectObj}
        {...data.inputType?.component?.sProps}
        summary={summary}
        mainData={mainData}
      />
    </>
  );
};

const SelectComponent = ({
  setSummaryTaxSelect,
  data,
  item,
  setTaxFirstOption,
  api,
  name,
  error,
  value,
  callingFrom,
  takeInput,valueStaxCode,
  setcolTaxOptions,
  isFromSummary,
  rowData,
  setcolTaxOption,
  id,
  setTaxDefaultValueCode,
  taxDefaultValueCode,
  taxDefaultValue,
  taxDefaultCode,
}) => {
  const { token } = Global_Data();
  const [taxOption, setTaxOption] = useState([]);
  const [displayOptions, setDisplayOptions] = useState({});
  const [defaultSelect, setDefaultSelect] = useState({});

  function getErrorDetails(data, Id) {
    const rtnData = data.filter(elm => elm.id == Id);
    if (rtnData.length > 0) {
      return rtnData[0];
    } else {
      return false;
    }
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

  useEffect(() => {
    setDisplayOptions(extractKeysFromFormat(data?.inputType?.data?.sDisplayFormat));
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseURL}${api}`, {
        headers: {
          Authorization: `Bearer ${token}`
          // Other headers if needed
        }
      });
      if (response?.data?.data.records.length == 1) {
        
        const e = {
          target: {
            name: callingFrom == "summary" ? "summ_tax" : data.inputType.data.sValueField,
            value: response?.data?.data.records[0][data.inputType.data.sValueField] + ""
          }
        };

        takeInput(e, id, "Tax");
        setDefaultSelect(response?.data?.data.records[0]);
        if (setSummaryTaxSelect) {
          setSummaryTaxSelect(prevState =>
            prevState?.map(item =>
              item.sSummaryID === "summ_tax"
                ? {
                    ...item,
                    ["sInputValue"]:
                      response?.data?.data.records[0][data.inputType.data.sValueField]
                  }
                : item
            )
          );
        }
      }
      if (isFromSummary) {
        // alert('kk')
        setcolTaxOptions(response?.data?.data.records);
      }
      if (setTaxOption) {
        setTaxOption(response?.data?.data.records);
      }
      if (setTaxOption) {
        setcolTaxOption(response?.data?.data.records);
      }
      if (setTaxOption) {
        setTaxFirstOption(response?.data?.data.records);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [api, data]);

  function getVATPercentage(vatString) {
    // Use regular expressions to extract the percentage value from the string

    const matches = vatString && vatString?.match(/\((\d+(\.\d+)?)%\)/);

    if (matches && matches[1]) {
      // Parse the matched value as a floating-point number
      return parseFloat(matches[1]);
    }

    // Return a default value or handle errors as needed
    return "";
  }

  let valueNum;
  if (typeof value == "string") {
    valueNum = getVATPercentage(value);
  } else {
    valueNum = value;
  }

  // console.log(value === undefined || value === '' ? (taxOption.length > 0 ? taxOption[0].value : "") : value,'taxOption');

  useEffect(() => {
    // if (!defaultSelect?.no) {
    // alert(value)
    taxOption.map((item, ind) => {
      const value = (!taxDefaultValueCode[id - 1]?.applied && taxDefaultCode) ? taxDefaultCode
        : (defaultSelect?.[data.inputType.data.sValueField] ?? data.inputType.component.sDefaultValue);
      if (
        item[data.inputType.data.sValueField] === value
      ) {
        // alert(defaultSelect[data.inputType.data.sValueField])
        if (setSummaryTaxSelect) {
          // setSummaryTaxSelect(item);
          setSummaryTaxSelect(prevState =>
            prevState?.map(item =>
              item.sSummaryID === "summ_tax"
                ? { ...item, ["sInputValue"]: item[data.inputType.data.sValueField] }
                : item
            )
          );
        }

        const e = {
          target: {
            name: name,
            value: item[data.inputType.data.sComputeField] + "",
            taxType: item["sTaxName"]
          }
        };
        const e2 = {
          target: {
            name: data.inputType.data.sValueField,
            value: item[data.inputType.data.sValueField] + "" || value,
            taxType: item["sTaxName"]
          }
        };
        // alert(JSON.stringify(item))

        // alert(JSON.stringify(e2))
        setDefaultSelect(item);

        handletakeInput(e, id, "Tax", e2);
        // setTimeout(() => {
        //   handletakeInput(e, id, "Tax", e2);
        // }, 1000);
      }
    });
    // }
  }, [taxOption, defaultSelect, taxDefaultCode]);

  function handletakeInput(e, id, type) {
    const { value, name, taxType } = e.target;

    const selectedObj = taxOption.filter((item, ind) => {
      if (item[data?.inputType?.data?.sComputeField] == value) {
        return item;
      }
    });
    const selectedObj1 = taxOption.filter((item, ind) => {
      if (item["sTaxName"] == taxType) {
        return item;
      }
    });

    const er = {
      target: {
        name: callingFrom == "summary" ? "summ_tax" : data?.inputType?.data?.sValueField,
        value: selectedObj1[0]?.[data?.inputType?.data?.sValueField] + "" || 0,
        taxType
      }
    };

    takeInput(er, id, type);
    // setDefaultSelect(selectedObj1[0]);

    // alert(JSON.stringify(selectedObj1))

    if (value == "") {
      // const er = {
      //   target: {
      //     name: callingFrom == "summary" ? "summ_tax" : data.inputType.data.sValueField,
      //     value: 0,
      //     taxType
      //   }
      // };
      // takeInput(er, id, type);
      // setDefaultSelect(selectedObj1[0]);
    } else {
      // const e2 = {
      //   target: {
      //     name: callingFrom == "summary" ? "summ_tax" : data.inputType.data.sValueField,
      //     value: selectedObj[0][data.inputType.data.sValueField] + "",
      //     taxType
      //   }
      // };

      // takeInput(e2, id, type);
      // setDefaultSelect(selectedObj[0]);
      // alert(data.inputType.data.sValueField)
      if (setSummaryTaxSelect) {
        setSummaryTaxSelect(prevState =>
          prevState?.map(item =>
            item.sSummaryID === "summ_tax"
              ? { ...item, ["sInputValue"]: selectedObj[0][data.inputType.data.sValueField] }
              : item
          )
        );
      }
    }
    // console.log(selectedObj,data.inputType.data.sComputeField,'modifiedRows3',value);
  }

  function findObjectByValue(data, searchValue) {
    return data.find(item => Object.values(item).some(value => value === searchValue));
  }

  function handleTaxChange(e, id, type) {
    const event = {
      target: {
        name: e.target.name,
        value: findObjectByValue(taxOption, e.target.value)[data.inputType.data.sComputeField],
        taxType: findObjectByValue(taxOption, e.target.value)[displayOptions.display1 || "sTaxName"]
      }
    };
    //  alert(JSON.stringify(event))
    // /data.inputType.data.sComputeField
    // alert()
    handletakeInput(event, id, "Tax");
  }

useEffect(() => {
  setDefaultSelect(findObjectByValue(taxOption, valueStaxCode))
},[valueStaxCode]);

  return (
    <>
      {/* <Box> */}
      {/* {value} */}
  
  {/* {valueStaxCode}
{JSON.stringify(defaultSelect?.["sTaxCode"])} */}
      {/* {data.component.inputType.data.sValueField} */}
      {/* {JSON.stringify(defaultSelect)} */}
      {/* {data.inputType.component.sDefaultValue} */}
      {/* {displayOptions.display1} */}
      {/* {data.inputType.data.sValueField} */}
      {/* {defaultSelect} */}
      {/* {defaultSelect?.['sTaxCode']} */}
      {/* { defaultSelect?.[data.inputType.data.sValueField] ? defaultSelect?.["sTaxCode"] : ""} */}
      <FormControl {...data?.inputType?.component?.options?.textFieldProps} fullWidth>
        <Select
          size="small"
          name={name}
          id={`${data?.inputType?.component?.sName}-${id}`}
          error={error}
          value={
            (!taxDefaultValueCode[id - 1]?.applied && taxDefaultCode) ? taxDefaultCode :
            defaultSelect?.[data.inputType.data.sValueField] ? defaultSelect?.["sTaxCode"] : ""
          }
          onChange={e => {
            setTaxDefaultValueCode((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, applied: true } : item
              )
            );
            handleTaxChange(e, id, "Tax");
          }}
          {...data?.inputType?.component?.sProps}
          {...data?.inputType?.component?.options?.others1}
        >
         
          {/* <MenuItem value="">
            <em>{data?.component?.sPlaceHolder}</em>
          </MenuItem> */}
          {taxOption?.map((item, ind) => (
            <MenuItem key={item.dPercentage} value={item["sTaxCode"]}>
              {" "}
              {item[displayOptions.display1]}{" "}
            </MenuItem>
          ))}
        </Select>

        <FormHelperText sx={{ color: error && error && "red" }}>
          {(error && error) || "  "}
          {""}
        </FormHelperText>

        {/* {!error && <br />} */}
      </FormControl>

      {/* </Box> */}
    </>
  );
};

const QuantitySelectComponent = ({
  error,
  textValue,
  data,
  data2,setselectedQuentity,
  rowData,value,
  priceSelect,
  qtyHandleSelect,
  defaultTableEditData,
  allFeildForDoucmentSelect,
  id,
  resetQuantityTypeDefault,
  setResetQuantityTypeDefault,
  setEditDataQtyType,
  setBulkDataLoaded,
  bulkDataLoaded,
  rowClone,
  setRowClone,
  documentSelectTableData,
  csvFile,
  quantityTypeMapping,
  loadQtyCodesCSVData
}) => {
  const { token, defaultTableCSVFile } = Global_Data();
  function replacePlaceholders2(uri, data) {
    const regex = /{([^}]+)}/g;
    const replacedUri = uri.replace(regex, (match, key) => {
      return key in data ? data[key] : match;
    });
    return replacedUri;
  }
  function getKeyByValue(obj, value) {
    for (let key in obj) {
      if (obj[key] === value) {
        return key;
      }
    }
    return null; // return null or undefined if no matching key is found
  }

  const conversionName = data?.inputType?.component?.sName === "dQuantity" ? "sConversion" : "sExpectedConversion";

  function replaceSInventoryCode(uri, obj1, obj2) {
    // Extract the value to replace from obj2
    let match = uri.match(/{(.*?)}/);
    let placeholder = match[1];
    let changedkey = getKeyByValue(obj2, placeholder);
    let changedData = obj1?.[changedkey];
    let newUri = uri?.replace(`{${placeholder}}`, changedData);
    return newUri;
    // return newUri;
  }
  const [qtyType, setQtyType] = useState();
  const [quantitySelectOptions, setquantitySelectOptions] = useState([]);
  const [loadFromFileRate, setLoadFromFileRate] = useState();
  const idx = defaultTableEditData?.[0]?.tabledetails?.[rowData?.id - 1]?.sUnitConversion?.indexOf(":");
  const unitUsed = defaultTableEditData?.[0]?.tabledetails?.[rowData?.id - 1]?.sUnitConversion.slice(0, idx);
  const [selectedValue, setselectedValue] = useState(unitUsed ? unitUsed : "");
  useEffect(() => {
    // Define an async function to fetch data
    if(!csvFile){
    const fetchData = async () => {
      let uri =
        serverAddress +
        replaceSInventoryCode(
          data?.inputType?.data?.sDataSource,
          rowData,
          allFeildForDoucmentSelect
        );

      try {
        const inventoryCodeMatch = uri.match(/inventorycode=([^&]*)/);
        const inventoryCode = inventoryCodeMatch ? decodeURIComponent(inventoryCodeMatch[1]).replace(/'/g, '') : null;
        if(inventoryCode){
          const response = await axios.get(uri, {
            headers: {
              Authorization: `Bearer ${token}`
              // Other headers if needed
            }
          });
          // Set the data from the response
          setquantitySelectOptions(response.data.data.records);
        }
      } catch (error) {
        // Set error if the API call fails
        // setError(error);
      } finally {
        // Set loading to false once the request is complete
        // setLoading(false);
      }
    };

    // Call the async function
    fetchData();
  }
  }, [
    rowData?.[
      getKeyByValue(
        allFeildForDoucmentSelect,
        data?.inputType?.data?.sDataAware.replace(/[{}]/g, "")
      )
    ]
  ]);
  useEffect(() => {
    if(csvFile && loadQtyCodesCSVData && loadQtyCodesCSVData.length > 0){
      const qtyCodesIndex = loadQtyCodesCSVData.findIndex((item) => item.id == id);
      const qtyCodesData = loadQtyCodesCSVData[qtyCodesIndex]?.qtyCodes;
      setquantitySelectOptions(qtyCodesData);
      const csvRowItem = csvFile.filter((item) => item.matchId == id)[0];
      if(csvRowItem && qtyCodesData){
        const csvRowUnit = csvRowItem.Unit;
        const filteredQtyCode = qtyCodesData?.filter((code) => code.sUnitAbbrev == csvRowUnit)?.[0];

        if(filteredQtyCode){
          const itemQtyCode = filteredQtyCode?.sRelativeUnitCode;
          if(itemQtyCode){
            setselectedValue(itemQtyCode);
            let newData = {
              name1: conversionName,
              value1: filteredQtyCode?.["sConversion"]
            };
            qtyHandleSelect(itemQtyCode, newData);
            if(priceSelect == "sPriceOption1"){
              setLoadFromFileRate(quantityTypeMapping.filter((item) => item.id === rowData.id)[0].sPriceOption1 * filteredQtyCode?.["sConversion"])
            }
          }
        }
      }
    }
  }, [rowData?.["id"], loadQtyCodesCSVData]);

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
  // console.log("jwkhfkjewbkjfew", loadQtyCodesCSVData);
  // useEffect(() => {
  //   if(csvFile && csvFile?.length > 0 && priceSelect == "sPriceOption1" && loadFromFileRate){
  //     const qtyCodesIndex = loadQtyCodesCSVData.findIndex((item) => item.id == id);
  //     const qtyCodesData = loadQtyCodesCSVData[qtyCodesIndex]?.qtyCodes;
  //     const csvRowItem = csvFile.filter((item) => item.matchId == id)[0];
  //     if(csvRowItem){
  //       const csvRowUnit = csvRowItem.Unit;
  //       const filteredQtyCode = qtyCodesData?.filter((code) => code.sUnitAbbrev == csvRowUnit)?.[0];
  //       if(filteredQtyCode){
  //         const itemQtyCode = filteredQtyCode?.sRelativeUnitCode;
  //         if(itemQtyCode){
  //           setselectedValue(itemQtyCode);
  //           let newData = {
  //             name1: conversionName,
  //             value1: filteredQtyCode?.["sConversion"]
  //           };
  //           qtyHandleSelect(itemQtyCode, newData);
  //         }
  //       }
  //     }
  //   }
  // })

  useEffect(() => {
    if(rowClone && rowClone.id == id){
      setselectedValue(rowClone.qtySelect);
    }
  }, [rowClone]);

  function findObjectByValue(data, searchValue) {

    return data?.find(item => Object?.values(item)?.some(value => value === searchValue));
  }

  useEffect(() => {
    setselectedValue(quantitySelectOptions?.[0]?.[data?.inputType?.data.sValueField]);
    updateCalculation(selectedValue);
  }, [priceSelect])
  useEffect(() => {
    if(bulkDataLoaded){
      // setselectedValue(quantitySelectOptions?.[0]?.[data?.inputType?.data.sValueField]);
      updateCalculation(selectedValue);
      setBulkDataLoaded(false);
    }
  }, [bulkDataLoaded])
  
  useEffect(() => {
    if(resetQuantityTypeDefault.includes(id)){
      const result = findObjectByValue(quantitySelectOptions, quantitySelectOptions?.[0]?.[data?.inputType?.data.sValueField]);
      let newData = {
        name1: conversionName,
        value1: result?.["sConversion"]
      };
      setselectedValue(quantitySelectOptions?.[0]?.[data?.inputType?.data.sValueField])
      qtyHandleSelect(quantitySelectOptions?.[0]?.[data?.inputType?.data.sValueField], newData);
      setResetQuantityTypeDefault((prev) => prev.filter((item) => item !== id));
    }
  }, [resetQuantityTypeDefault])
  const updateCalculation = e => {
    if(quantitySelectOptions && quantitySelectOptions.length > 0){
      const result = findObjectByValue(quantitySelectOptions, selectedValue);
      // alert(JSON.stringify(result))
      
      let newData = {
        name1: conversionName,
        value1: result?.["sConversion"]
      };
      
      qtyHandleSelect(selectedValue, newData);
    }
  };

  const handleChange = e => {
    const result = findObjectByValue(quantitySelectOptions, e.target.value);
    // alert(JSON.stringify(result))
    if(rowClone && rowClone.id == id){
      setRowClone();
    }

    let newData = {
      name1: conversionName,
      value1: result["sConversion"]
    };
    setEditDataQtyType((prev) => prev.filter((item) => item.id != id));
    setselectedValue(e.target.value);
    qtyHandleSelect(e.target.value, newData);
  };

  useEffect(() => {
    if(!selectedValue && quantitySelectOptions && quantitySelectOptions.length > 0){
      const result = findObjectByValue(quantitySelectOptions, quantitySelectOptions?.[0]?.[data?.inputType?.data.sValueField]);
      let newData = {
        name1: conversionName,
        value1: result?.["sConversion"]
      };
      if(rowClone && rowClone.id == id){
        setselectedValue(rowClone.qtySelect);
        qtyHandleSelect(rowClone.qtySelect, newData);
      } else {
        setselectedValue(unitUsed ? unitUsed : quantitySelectOptions?.[0]?.[data?.inputType?.data.sValueField])
        qtyHandleSelect(quantitySelectOptions?.[0]?.[data?.inputType?.data.sValueField], newData);
      }
    }
    if(selectedValue){
      const result = findObjectByValue(quantitySelectOptions, selectedValue);
      let newData = {
        name1: conversionName,
        value1: result?.["sConversion"]
      };
      if(newData.value1){
        qtyHandleSelect(selectedValue, newData);
      }
    }
  }, [selectedValue, quantitySelectOptions]) 

  useEffect(() => {
    const result = findObjectByValue(quantitySelectOptions, value);
    // alert(JSON.stringify(quantitySelectOptions));
    setselectedQuentity(result||{})
  },[value,quantitySelectOptions]);

  useEffect(() => {
    if(defaultTableCSVFile && defaultTableCSVFile.length > 0){
      const currIndex = defaultTableCSVFile.findIndex((item) => item.matchId === id);
      if(currIndex !== -1){
        const selectedQtyCode = quantitySelectOptions?.filter((codes) => codes.sUnitAbbrev === defaultTableCSVFile[currIndex].Unit);
        if(selectedQtyCode && selectedQtyCode.length > 0){
          setselectedValue(selectedQtyCode[0]?.sRelativeUnitCode);
        }
      }
    }
  }, [defaultTableCSVFile, quantitySelectOptions])

  useEffect(() => {
    if(documentSelectTableData && documentSelectTableData.length > 0){
      const idIndex = documentSelectTableData[0]?.tabledetails?.findIndex((item) => item.id == id);
      if(idIndex != -1){
        const val = documentSelectTableData[0]?.tabledetails[idIndex].sUnitConversion?.split(":")[0];
        setselectedValue(val);
        let newData = {
          name1: conversionName,
          value1: val
        };
        
        qtyHandleSelect(val, newData);
      }
    }
  }, [documentSelectTableData])
  return (
    <>
      {/* {data?.inputType?.data?data?.inputType?.data?.sDataAware .replace(/[{}]/g, "")} */}
      {/* {JSON.stringify(data?.inputType?.data)} */}
      {/* {replacePlaceholders2(data?.inputType?.data?.sDataSource,rowData)}   */}
      {/* {data?.inputType?.data?.sDataSource} */}
      <FormControl
        {...data?.inputType?.component?.sProps}
        {...data?.inputType?.component?.options?.others1}
      >
      
        <Select
          // labelId="select-label"
          // id="select"
          id={`${data?.inputType?.component?.sName}-type-${id}`}
          value={selectedValue}
          onChange={handleChange}
          // label="Select an Option"
          {...data?.inputType?.component?.sProps}
          {...data?.inputType?.component?.options?.others1}
        >
          {quantitySelectOptions?.map(item => {
            return (
              <MenuItem value={item[data?.inputType?.data.sValueField]}>
                <div
                  component="span"
                  style={{ width: "100%" }}
                  dangerouslySetInnerHTML={{
                    __html:
                      item && item != "" && Object.keys(item).length !== 0
                        ? vsprintf(
                            data?.inputType?.data.sDisplayFormat,
                            replacePlaceholders(data?.inputType?.data.sDisplayField, item)
                              .replace(/[{}]/g, "")
                              .split(",")
                          )
                        : ""
                  }}
                />
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText sx={{ color: error && error && "red" }}>{""}</FormHelperText>
        {/* {!error && <br />} */}
      </FormControl>
    </>
  );
};

const PriceComponent = ({
  update,
  data,
  setPrice,
  api,
  name,
  isbyPass,
  value,
  takeInput,
  id,
  editable,
  error,
  item,
  sWithholdCode,
  feildName,
  from,
  htmlId,
  mainData,
  priceSelect,
  params,
  formData,
  quantityTypeMapping,
  setQuantityTypeMapping,
  setIsPriceSelectClicked,
  isPriceSelectClicked,
  csvFile
}) => {
  const { token, defaultTableSelectedSupplier } = Global_Data();

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

  useEffect(() => {
    if(isPriceSelectClicked){
      let defaultPricing = quantityTypeMapping?.[id - 1]?.["sPriceOption1"];
      let supplierPricing = quantityTypeMapping?.[id - 1]?.["sPriceOption2"];
      let csvFileRowStatus = false;
      if(csvFile && csvFile.length > 0){
        const idx = csvFile.findIndex((item) => item.matchId == id);
        if(idx == -1){
          csvFileRowStatus = true;
        }        
      }
      if(priceSelect && formData && quantityTypeMapping && quantityTypeMapping.length > 0 && csvFileRowStatus){
        if(
          !(baseURL + generateDynamicAPI(formData?.pricingOptions?.[priceSelect]?.sDataSource, quantityTypeMapping[id - 1])).includes("{") && 
          !(baseURL + generateDynamicAPI(formData?.pricingOptions?.[priceSelect]?.sDataSource, quantityTypeMapping[id - 1])).includes("}")){
            axios.get(baseURL + generateDynamicAPI(formData?.pricingOptions?.[priceSelect]?.sDataSource, quantityTypeMapping[id - 1]), {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }).then((response) => {
              if(priceSelect === "sPriceOption1"){
                defaultPricing = response?.data?.data?.records?.[0]?.[formData?.pricingOptions?.sPriceOption1?.sPriceField.replaceAll("{", "").replaceAll("}", "")];
              }
              if(priceSelect === "sPriceOption2"){
                supplierPricing = response?.data?.data?.records?.[0]?.[formData?.pricingOptions?.sPriceOption2?.sPriceField.replaceAll("{", "").replaceAll("}", "")];;
              }
              if(!defaultPricing) quantityTypeMapping?.[id - 1]?.["sPriceOption1"];
              if(!supplierPricing) quantityTypeMapping?.[id - 1]?.["sPriceOption2"];
              if(response?.data?.data?.records && response?.data?.data?.records?.length > 0){
                setQuantityTypeMapping((prev) => {
                  const existingItemIndex = prev.findIndex((item) => item.id === id);
                  if (existingItemIndex !== -1) {
                    return prev.map((item, index) =>
                      index === existingItemIndex
                        ? { ...item, sPriceOption1: defaultPricing, sPriceOption2: supplierPricing} 
                        : item
                    );
                  }
                  return [...prev, { id, sPriceOption1: defaultPricing, sPriceOption2: supplierPricing, sInventoryCode: quantityTypeMapping["sInventoryCode"], preferedVendor: defaultTableSelectedSupplier, initialState: true }];
                });
                const e = {
                  target: {
                    updated_price: "updated_price",
                    updated_value: priceSelect === "sPriceOption1" ? defaultPricing : priceSelect === "sPriceOption2" ? supplierPricing : "0.00"
                  }
                };
                takeInput(e, id);
              }
            }).catch((error) => {
              console.log(error);
            })
        }
      }
    }
  }, [priceSelect])

  const fetchData = async () => {
    // alert(api)
    try {
      const vendorCodeMatch = api.match(/vendorcode=([^&]*)/);
      const itemCodeMatch = api.match(/itemcode=([^&]*)/);
      const vendorCode = vendorCodeMatch ? decodeURIComponent(vendorCodeMatch[1]).replace(/'/g, '') : null;
      const itemCode = itemCodeMatch ? decodeURIComponent(itemCodeMatch[1]).replace(/'/g, '') : null;
      if(vendorCode && itemCode){
        const response = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // alert(JSON.stringify(response.data.data.records[0].dUnitPrice))
  
        if (response?.data?.data?.records[0]?.dUnitPrice) {
          const e = {
            target: {
              name: feildName,
              value: parseFloat(response.data.data.records[0].dUnitPrice).toFixed(
                data?.inputType?.component.iDecimalPlaces
              )
            }
          };
          takeInput(e, id, "CURRENCY", data?.inputType?.component.iDecimalPlaces, "priceApi");
          //  setTimeout(() => {
          //   takeInput(e, id, "CURRENCY", data?.inputType?.component.iDecimalPlaces);
          //  }, 1000);
          setPrice(response.data.data.records[0].dUnitPrice);
        } else {
          const e = {
            target: {
              name: feildName,
              value: parseFloat(0).toFixed(data?.inputType?.component.iDecimalPlaces)
            }
          };
          // takeInput(e, id, "CURRENCY", data?.inputType?.component.iDecimalPlaces, "priceApi");
        }
        // takeInput(response.data.data[0].price, id, "setPrice");
      }
    } catch (error) {
      const e = {
        target: {
          name: feildName,
          value: parseFloat(0).toFixed(data?.inputType?.component.iDecimalPlaces)
        }
      };
      // takeInput(e, id, "CURRENCY", data?.inputType?.component.iDecimalPlaces);
    }
  };

  useEffect(() => {
    // update(fetchData);
    // setTimeout(() => {
    fetchData();
    // }, 1000);
  }, [api]);
  // const handleFocus = event => {
  //   const { target } = event;
  //   const { value } = target;
  //   // Move cursor to the end
  //   target.setSelectionRange(value.length, value.length);
  // };

  const [isTextSelected, setIsTextSelected] = useState(false);
  const handleSelectionChange = event => {
    const { selectionStart, selectionEnd } = event.target;
    setIsTextSelected(selectionStart !== selectionEnd);
  };
  const handleSelectionBlur = event => {
    setIsTextSelected(false);
  };
  const handleFocus = event => {
    const { target, key } = event;
    const { value } = target;
    // Move cursor to the end
    if (!isTextSelected) {
      target.setSelectionRange(value.length, value.length);
    }
  };

  // const val = useMemo(() => {
  //   if (value && value !== "") {
  //     const e = {
  //       target: {
  //         name: feildName,
  //         value: value
  //       }
  //     };
  //     return takeInput(e, id, "CURRENCY", data?.inputType?.component.iDecimalPlaces);
  //   }
  // }, [value]);

  const handleNumerChange = e => {
    if (isTextSelected) {
      e.target.value =
        data?.inputType?.component.iDecimalPlaces == 2 ? "00." + e.target.value : e.target.value;
    }
    takeInput(e, id, "CURRENCY", data?.inputType?.component.iDecimalPlaces);
  };

  // /==============================
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
  };

  const fetchWithHoldingTax = async () => {
    let api = sWithholdCode
      ? data.inputType.data.sDataSource?.replace(/\{[^}]*\}/, sWithholdCode?.[0]?.sAccountCode)
      : "";
    // alert(`${api} -- ${sWithholdCode?.[0]?.sAccountCode}`)
    // alert(api)
    if (sWithholdCode?.[0]?.sAccountCode) {
      axios
        .get(serverAddress + api, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          let e = {
            target: {
              name: feildName,
              value: response.data.data.records?.[0]?.[data?.inputType?.data?.sValueField] + ""
            }
          };

          handleNumerChange(e);
        })
        .catch(err => console.log(err));
    }
  };

  useEffect(() => {
    if (data?.inputType?.data.sAction == "CASCADE") {
      fetchWithHoldingTax();
    }
  }, [sWithholdCode?.[0]?.sAccountCode]);

  // useEffect(() => {
  //   if(sWithholdCode && sWithholdCode.length == 0){
  //     let e = {
  //       target: {
  //         name: feildName,
  //         value: ""
  //       }
  //     };

  //     handleNumerChange(e);
  //   }
  // }, [sWithholdCode])

  return (
    <>
      {/* {api} */}
      {/* {sWithholdCode?.[0]?.sAccountCode} */}
      {/* {api} */}
      {/* {JSON.stringify(sWithholdCode?.[0]?.sAccountCode)} */}
      {/* {handlePointChange(value+'',data?.inputType?.component.iDecimalPlaces)} */}

      <div>
        {
          <TextField
            placeholder={data?.inputType?.component?.sPlaceHolder}
            name={feildName}
            id={htmlId}
            inputProps={{ style: { textAlign: data?.inputType?.component?.sJustify } }}
            onChange={e => {
              handleNumerChange(e);
            }}
            disabled={editable}
            style={{height: "53px"}}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "100%",
              },
            }}
            // value={handlePointChange(value + "", data?.inputType?.component.iDecimalPlaces)}
            value={value ? Number(value?.toString().replaceAll(",", "")).toLocaleString(undefined, { minimumFractionDigits: data?.inputType?.component.iDecimalPlaces, maximumFractionDigits: data?.inputType?.component.iDecimalPlaces }) : 0}
            size="small"
            {...data?.inputType?.component?.sProps}
            {...data?.inputType?.component?.options?.others1}
            onKeyDown={handleFocus}
            onFocus={handleFocus}
            onBlur={handleSelectionBlur}
            onSelect={handleSelectionChange}
            helperText={data?.component?.sHelper}
            label={data?.component?.sLabel}
            InputProps={
              {...(data?.component?.sAdornPosition?.toLowerCase() === "start"
                ? {
                    startAdornment: (
                      <>
                        {data?.component?.sAdornPosition &&
                          data?.component?.sAdornType.toLowerCase() === "icon" && (
                            <InputAdornment position={data?.component?.sAdornPosition}>
                              <Icon iconName={data?.component?.sIcon} />
                            </InputAdornment>
                          )}
                        {data?.component?.sAdornPosition &&
                          data?.component?.sAdornType.toLowerCase() === "text" && (
                            <InputAdornment position={data?.component?.sAdornPosition}>
                              {data?.component?.sIcon}
                            </InputAdornment>
                          )}
                      </>
                    )
                  }
                : {
                    endAdornment: (
                      <>
                        {data?.component?.sAdornPosition &&
                          data?.component?.sAdornType.toLowerCase() === "icon" && (
                            <InputAdornment position={data?.component?.sAdornPosition}>
                              <Icon iconName={data?.component?.sIcon} />
                            </InputAdornment>
                          )}
                        {data?.component?.sAdornPosition &&
                          data?.component?.sAdornType.toLowerCase() === "text" && (
                            <InputAdornment position={data?.component?.sAdornPosition}>
                              {data?.component?.sIcon}
                            </InputAdornment>
                          )}
                      </>
                    )
                  })}
            }
          />
        }
        {from != "qty" && (
          <FormHelperText sx={{ color: error && error && "red" }} id={`${data?.inputType?.component?.sName}-${params?.row?.id}-helper-text`}>
            {(error && error) || data?.inputType?.component?.sHelper}
          </FormHelperText>
        )}
      </div>
    </>
    // <TextField
    //   size="small"
    //   name={name}
    //   disabled={editable}
    //   value={value}
    //   {...data?.inputType?.component.sProps}
    //   onChange={e => takeInput(e, id, "CURRENCY", data?.inputType?.component.iDecimalPlaces)}
    // ></TextField>
  );
};
export default InputTableDefaultAllComponent;
