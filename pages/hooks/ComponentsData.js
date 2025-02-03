import {
  Grid,
  IconButton,
  Typography,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  FormHelperText
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Icon } from "../../utils/MuiIcons/Icon";
import AutoComplete from "../AutoComplete/AutoComplete";
import RadioGroupComponent from "../RadioGroupComponent/RadioGroupComponent";
import CheckBoxComponent from "../CheckBox/CheckBoxComponent";
import TransferList from "../TransferList/TransferList";
import SelectMainComponent from "../SelectComponent/SelectMainComponent";
import ImageUpload from "../../component/ImageUpload/ImageUpload";
import DateComponent from "../DateComponent/DateComponent";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import AvatarComponent from "../../component/AvatarComponent/AvatarComponent";
import { serverAddress } from "../../config";
import axios from "axios";

import { Global_Data } from "../../globalData/GlobalData";
import DailogMain from "./DailogMain";
import Vartext from "../../component/VARTEXT/Vartext";
import { vsprintf } from "sprintf-js";
import NestedDialog from "./NestedDialog";
import TransferListMain from "../../component/TransferListMain/TransferListMain";
// Render of component start
// render typography

export const renderTypography = data => (
  <Grid item  {...data?.grid_props} >
    <Typography id={data?.component?.sName} {...data?.component?.sProps}>
      {data?.component?.sLabel}
    </Typography>
  </Grid>
);

// render textfield
export const renderTextfield = (data, ind, index, error, textValue, handleTextValue, varValue) => {
  let sProps = {
    variant: "outlined"
  }
 
  return(
  <>
    <Grid item {...data?.grid_props}>
   
     <TextField
       
       id={data?.component?.sName}
       label={data?.component?.sLabel}
       helperText={error?.[data?.component?.sName]||data?.component?.sHelper}
       placeholder={data?.component?.sPlaceHolder}
       type={data?.component?.sAdornType}
      //  value={
      //   textValue[data?.component?.sName] && textValue[data?.component?.sName]?.length > 0
      //   ? textValue[data?.component?.sName]
      //   : "" || data?.validation?.sType === "COUNTER" || data?.validation?.sType === "FIXVALUE"
      //   ? data?.component?.sDefaultValue
      //   : varValue[data?.component?.sName]
      //   ? varValue[data?.component?.sName] 
      //   : ""
      //  }
      value={
        textValue[data?.component?.sName] && textValue[data?.component?.sName]?.length > 0
          ? textValue[data?.component?.sName]
          : "" || data?.validation?.sType === "COUNTER" || data?.validation?.sType === "FIXVALUE"
          ? data?.component?.sDefaultValue
          : ""
       }
       name={data?.component?.sName}
       onChange={e => handleTextValue(e, ind, data?.validation)}
       error={error && error[data?.component?.sName]  || error && error[data?.component?.sName] == ''}
       InputProps={
         data?.component?.sAdornPosition?.toLowerCase() === "start"
           ? {
               startAdornment: (
                 <>
                   {data?.component?.sAdornPosition &&
                     data?.component?.sAdornType.toLowerCase() === "icon" && (
                       <InputAdornment position={data?.component?.sAdornPosition}>
                         <Icon  sProps={data?.component?.sIconProps} iconName={data?.component?.sIcon} />
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
                         <Icon sProps={data?.component?.sIconProps} iconName={data?.component?.sIcon} />
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
       }
   
       {...data?.component?.sProps}
       
     />
     {/* {JSON.stringify(error)} */}
    {/* - {error?.[data?.component?.sName]||data?.component?.sHelper}- */}
 {/* {error ? error?.[data?.component?.sName]? error[data?.component?.sName] :data?.component?.sHelpe:data?.component?.sHelper} */}
     {/* {error && <p style={{ color: "red" }}>{error && error[data?.component?.sName]}</p>} */}
   </Grid>
  </>
  )
};

// render password text field
export const renderpasswordTextfield = (data, ind, textValue, handleTextValue, index, error) => (
  <Grid item {...data?.grid_props}>
 
    <TextField
      id={data?.component?.sName}
      label={data?.component?.sLabel}
      placeholder={data?.component?.sPlaceHolder}
      defaultValue={data?.component?.sDefaultValue || ""}
      variant="outlined"
      helperText={ error ? error[data?.component?.sName] : data?.component?.sHelper}
      type={data?.component?.sProps?.variant}
      value={textValue[data?.component?.sName] || ""}
      name={data?.component?.sName}
      onChange={e => handleTextValue(e, ind, data?.validation)}

      error={error && error[data?.component?.sName]}
      InputProps={
        data?.component?.sAdornPosition?.toLowerCase().includes('start')
          ? {
              startAdornment: (
                <>
                  {data?.component?.sAdornPosition && data?.component?.sAdornType && (
                    <InputAdornment style={{marginLeft:'20px'}} position={data?.component?.sAdornPosition}>
                      {/* <IconButton> */}
                        <Icon sProps={data?.component?.sIconProps} iconName={data?.component?.sIcon} />
                      {/* </IconButton> */}
                    </InputAdornment>
                  )}
                </>
              )
            }
          : {
              endAdornment: (
                <>
                  {data?.component?.sAdornPosition && data?.component?.sAdornType && (
                    <InputAdornment position={data?.component?.sAdornPosition}>
                      {/* <IconButton> */}
                        <Icon sProps={data?.component?.sIconProps} iconName={data?.component?.sIcon} />
                      {/* </IconButton> */}
                    </InputAdornment>
                  )}
                </>
              )
            }
      }
      // {...data?.component?.sProps}
    />

    {/* {error && <p style={{ color: "red" }}>{error && error[data?.component?.sName]}</p>} */}
  </Grid>
);
// render link component
export const renderlinkfield = (data, handleLinkOpenModal, openStaticDialog) => {
  if (data?.data?.sAction === "DIALOG") {
    return (
      <Grid item {...data?.grid_props}>
        <Link onClick={() => handleLinkOpenModal(data)} replace {...data?.component?.sProps}>
          {data?.component?.sLabel}
        </Link>
      </Grid>
    );
  }
  if (data?.data?.sAction === "STATICDIALOG") {
    return (
      <Grid item {...data?.grid_props}>
        <Link onClick={() => openStaticDialog(true)} replace {...data?.component?.sProps}>
          {data?.component?.sLabel}
        </Link>
      </Grid>
    );
  }
  return (
    <Grid item {...data?.grid_props}>
      <Link to={data?.data?.sDataSource} replace {...data?.component?.sProps}>
        {data?.component?.sLabel}
      </Link>
    </Grid>
  );
};
// render autocomplete component
export const renderAutoComplete = (
  data,
  error,
  autoCompleteOnchange,
  handleclickdata,
  textValue,formIsSubmited,selectAndAutocompleteSname
) => (
  <Grid item {...data?.grid_props}>
    <AutoComplete
      formcallback={e => autoCompleteOnchange(e, data?.component?.sName)}
      data={data}
      formIsSubmited={formIsSubmited}
      errors={error && error[data?.component?.sName]}
      textValue1={textValue}
      handleClickOpen={handleclickdata}
      selectAndAutocompleteSname={selectAndAutocompleteSname}
      // {...data?.component?.sProps}
    />
    {/* {error && <p style={{ color: "red" }}>{}</p>} */}
  </Grid>
);
// render Fixedvalue component
export const renderFixedvalue = (data, error, autoCompleteOnchange) => {
  return (
    <Grid item {...data?.grid_props}>
      <TextField
        id={data?.component?.sName}
        label={data?.component?.sLabel}
        placeholder={data?.component?.sPlaceHolder}
        helperText={data?.component?.sHelper}
        defaultValue={data?.component?.sDefaultValue || ""}
        disabled={true}
        variant={data?.component?.sProps?.variant}
        type={data?.component?.sProps?.variant}
        //  value={textValue[data?.component?.sName] || ""}
        name={data?.component?.sName}
      />
      {error && <p style={{ color: "red" }}>{error && error[data?.component?.sName]}</p>}
    </Grid>
  );
};
// render Currency component
export const renderCurrency = (
  data,
  error,
  company,
  ind,
  textValue,
  handleTextValue,
  handleTextValue1,
  autoCompleteOnchange
) => (
  <Grid item {...data?.grid_props}>
    <TextField
      type="tel"
      id={data?.component?.sName}
      label={data?.component?.sLabel || ""}
      placeholder={data?.component?.sPlaceHolder || ""}
      // defaultValue={data?.component?.sDefaultValue || ""}
      disabled={data?.component?.sProps?.disabled}
      variant={data?.component?.sProps?.variant}
      onChange={e => handleTextValue(e, ind, data?.validation)}
      onBlur={e => handleTextValue1(e, ind, data?.validation)}
      value={textValue[data?.component?.sName] || data?.component?.sDefaultValue}
      name={data?.component?.sName}
      InputProps={
        data?.component?.sAdornPosition === "start"
          ? {
              startAdornment: (
                <>
                  {data?.component?.sAdornPosition && data?.component?.sAdornType === "icon" && (
                    <InputAdornment position={data?.component?.sAdornPosition}>
                      <Icon iconName={data?.component?.sIcon?.slice(0, -4)} />
                    </InputAdornment>
                  )}
                  {data?.component?.sAdornPosition && data?.component?.sAdornType === "text" && (
                    <InputAdornment position={data?.component?.sAdornPosition}>
                      {data?.component?.sIcon}
                      {company.data?.sBaseCurrency}
                    </InputAdornment>
                  )}
                </>
              )
            }
          : {
              endAdornment: (
                <>
                  {data?.component?.sAdornPosition && data?.component?.sAdornType === "icon" && (
                    <InputAdornment position={data?.component?.sAdornPosition}>
                      <Icon iconName={data?.component?.sIcon.slice(0, -4)} />
                    </InputAdornment>
                  )}
                  {data?.component?.sAdornPosition && data?.component?.sAdornType === "text" && (
                    <InputAdornment position={data?.component?.sAdornPosition}>
                      {company?.data?.sBaseCurrency}
                    </InputAdornment>
                  )}
                </>
              )
            }
      }
    />
    {error && <p style={{ color: "red" }}>{error && error[data?.component?.sName]}</p>}
  </Grid>
);

// render COUNTER component
export const renderCounter = (data, error, autoCompleteOnchange, textValue) => {
  // console.log(data.component.sProps.disabled, "renderCounter data");
  return (
    <Grid item {...data?.grid_props}>
      <TextField
        id={data?.component?.sName}
        label={data?.component?.sLabel}
        placeholder={data?.component?.sPlaceHolder}
        defaultValue={data?.component?.sDefaultValue || ""}
        type={data?.component?.sProps?.variant}
        //  value={textValue[data?.component?.sName] || ""}
        name={data?.component?.sName}
        disabled={data?.component?.sProps?.disabled}
        variant={data?.component?.sProps?.variant}
      />
      {error && <p style={{ color: "red" }}>{error && error[data?.component?.sName]}</p>}
    </Grid>
  );
};
// render checkbox component
export const rendercheckbox = (data, handleCheckboxOnchange, textValue) => (
  <Grid item {...data?.grid_props}>
    <CheckBoxComponent
      handleCheckbox={e => handleCheckboxOnchange(e, data?.component?.sName)}
      data={data}
      textValue1={textValue}
      datacheckvalue={textValue[data?.component?.sName]}
      {...data?.component?.sProps}
    />
  </Grid>
);
// render trasferlist component
export const renderTransferList = data => (
  <Grid item {...data?.grid_props}>
    {/* <TransferList data={data} {...data?.component?.sProps} /> */}
  <TransferListMain data={data}/>
  </Grid>
);
// render radio group component
export const renderRadioGroup = (data, handleradiovalue,textValue, freeFormTabbleEditArrays, freeFormTabbleEditMainrecord, formAction) => (
  <Grid item {...data?.grid_props}>
    <RadioGroupComponent
      data={data}
      textValue={textValue}
      radiochange={e => handleradiovalue(e, data?.component?.sName)}
      {...data?.component?.sProps}
      freeFormTabbleEditArrays={freeFormTabbleEditArrays}
      freeFormTabbleEditMainrecord={freeFormTabbleEditMainrecord}
      formAction={formAction}
    />
  </Grid>
);

// render select component

export const renderSelect = (data, error, handleselectOnchange, textValue,handleclickdata,formIsSubmited,setSelectAndAutocompleteSname,setdTermDays, formAction) => {
  return (
    <Grid item {...data?.grid_props}>
      {/* {JSON.stringify(data?.grid_props)} */}
      {/* { console.log(...data,'...data?.grid_props')} */}
      {/* {  console.log(handleselectOnchange,'handleselectOnchange called in hooks')} */}
      <SelectMainComponent
        data={data}
        setSelectAndAutocompleteSname={setSelectAndAutocompleteSname}
        formIsSubmited={formIsSubmited}
        handleClickOpen={handleclickdata}
        textValue={textValue}
        sColumnID={data?.component?.sName}
        errors={error && error[data?.component?.sName]}
        {...data?.component?.sProps}
        // summaryId={"summ_tax"}
        setdTermDays={setdTermDays}
        handledatasend={e => handleselectOnchange(e, data?.component?.sName)}
        formaction={formAction}
        // UPDATED - BITS Enterprise.js
        // handledatasend={(e, obj) => handleselectOnchange(e, data?.component?.sName, obj)}
        // taxUrl={item.sRoute}
      />
      
      {/* {error && <p style={{ color: "red" }}>{error && }</p>} */}
    </Grid>
  );
};
// render image component

export const renderImage = (data, getfilename, bodycontent, formaction) => (
  <Grid item {...data?.grid_props}>
    <ImageUpload
      data={data}
      {...data?.component?.sProps}
      getfilename={getfilename}
      apidata={bodycontent}
      formaction={formaction}
    />
  </Grid>
);
// render date component
export const renderDatecomponent = (data, handledatechange, textValue, formData,setTextValue) => (
  <Grid item {...data?.grid_props}>
    <DateComponent
      data={data}
      setTextValue={setTextValue}
      handledatechange={e => handledatechange(e, data?.component.sName)}
      datavalue={textValue[data?.component?.sName]}
      datemod=""
      datatextvalue={textValue[data?.component?.sName]}
      formaction={formData && formData?.form && formData?.form?.sFormAction}
      {...data?.component?.sProps}
    />
  </Grid>
);

// render button component
export const renderButtonComponent = (data, handleclickdata,sFormName) => (
  <Grid item {...data?.grid_props}>
    
    {/* {sFormName} */}
    <ButtonComponent
      data={data}
      formName={sFormName}
      onClickvalue={e => handleclickdata(e, data?.component, data.data, data)}
    />
  </Grid>
);

// render cards
export const renderCardComponent = (data, handleclickdata) => (
  <Grid item {...data.grid_props}>
    <Card {...data?.component?.sProps}>
      {data?.child?.map(item1 => {
        return (
          <>
            <CardActionArea>
              {item1?.component?.sType === "IMG" && (
                <CardMedia
                  {...item1?.component?.sProps}
                  image={`${serverAddress}${item1?.component?.sProps?.image}`}
                />
              )}
              {item1?.component?.sType === "TYPOGRAPHY" && (
                <CardContent>{renderTypography(item1)}</CardContent>
              )}
            </CardActionArea>
            <CardActions>
              {item1?.component?.sType === "BUTTON" ? (
                <ButtonComponent
                  data={item1}
                  onClickvalue={e => handleclickdata(e, item1?.component, item1.data)}
                />
              ) : null}
            </CardActions>
          </>
        );
      })}
    </Card>
  </Grid>
);

// render avatar component

export const avatarcomponent = data => <AvatarComponent data={data} />;

export const renderchipcomponent = data => <createChipComponent data={data} />;

export const rendervartextcomponent = (data, varValue, format,setVarValue) => {
  // const styleFormatData = format?.data?.records?.find(item => item?.sFieldName);
  // const styleFormat = format?.data?.records?.find(item1 => item1?.sFieldFormat);
  // const parsedData = styleFormat ? JSON.parse(styleFormat?.sFieldFormat) : {};
  return (
<>
<Vartext data={data} varValue={varValue} format={format} setVarValue={setVarValue} />
</>    
  );
};

export const renderglobaltextcomponent = (data, globalvariables, format) => {
  
  // const styleFormatData = format?.data?.find(item => item?.sFieldName);
  const styleFormat = format?.data ? format?.data?.records?.find(item1 => item1?.sFieldFormat) : null
  const parsedData = styleFormat ? JSON.parse(styleFormat?.sFieldFormat) : {};
  function extractUserData(dataString) {
    // Assuming the data string is in JSON-like format
    // Remove the curly braces and whitespace
    const userData = dataString.replace("{", "").replace("}", "").trim();
    
    // Return the user data
    return userData;
  }

  const globalData = JSON.parse(localStorage.getItem('globalvariables'))
  
  // alert(JSON.stringify(globalData[data.component.sDisplayField.replace(/[{}]/g, '')]))
const data3 = vsprintf(data?.component?.sDisplayFormat||"",globalData?.[data?.component?.sDisplayField.replace("{", "").replace("}", "").replace(',', '')] || ' &nbsp ')
  return (

    <Grid item {...data?.grid_props}>
      <Typography
        {...data?.component?.sProps}
        // {...(styleFormatData?.sFieldValue === getFieldValue(data?.component?.sName) && parsedData)}
      >
        {/* {data.component.sDisplayField.replace("{", "").replace("}", "")}---- */}

{/* {JSON.stringify(globalData)} */}
{/* {data.component.sDisplayField.replace("{", "").replace("}", "").replace(',', '')} */}
        {/* {JSON.stringify(globalData[data.component.sDisplayField.replace("{", "").replace("}", "").replace(',', '')])} */}
       
      {/* {data.component.sDisplayField}
      \\\\\\\\\\\\\\\\\
        {data.component.sDisplayField.replace("{", "").replace("}", "")}
        {globalvariables[data.component.sDisplayField.replace("{", "").replace("}", "")]}
        {JSON.stringify(globalData['ZipCode'])} */}
        {/* {data3} */}
          {/* {data.component.sDisplayFormat} */}
        <span dangerouslySetInnerHTML={{__html:data3}} />
        {/* {JSON.stringify(globalvariables)} */}
        {/* {JSON.stringify(globalData[data.component.sDisplayField.replace(/[{}]/g, '')])} */}
        {/* {globalvariables[extractUserData(data?.component?.sName)]} */}
      </Typography>
    </Grid>
  );
};

export const renderNestedDialog = (data,nestedDialog,dialogMode,handleClose, renderComponent) => {
  const { openModalData, setOpenModalData, setModalPrimaryKry, token,openModalChildData,setopenModalDataActive, setOpenModalChildData } = Global_Data();

  setModalPrimaryKry(data.component.sPrimaryKey);

  if (dialogMode?.options?.nested) {

    if (data?.component?.sName === dialogMode?.options?.dialog) {
      setOpenModalData(data?.component);
      
    return <NestedDialog data= {data}open={nestedDialog} renderComponent={renderComponent}  />
      
    }
  }
}

export const  renderdialogboxcomponent = (data, open, handleClose, dialogMode, renderComponent,nestedDialog,nestedDialogMode) => {
  
  const { openModalData, setOpenModalData, setModalPrimaryKry, token,openModalChildData,setopenModalDataActive, setOpenModalChildData } = Global_Data();
  // alert(data?.component?.sName)
  setModalPrimaryKry(data.component.sPrimaryKey);

  // alert(JSON.stringify(dialogMode));
  if (nestedDialogMode?.options?.nested) {

    if (data?.component?.sName === nestedDialogMode?.options?.dialog) {
      setOpenModalData(data?.component);
      
      return (renderNestedDialog(data,nestedDialog,nestedDialogMode,handleClose, renderComponent))
      
    // return <NestedDialog data= {data}open={nestedDialog} renderComponent={renderComponent}  />
      
    }
  }

  if (data?.component?.sName === dialogMode?.options?.dialog) {
    setOpenModalData(data?.component);

    return (
      <>
      <DailogMain data= {data} open={open} handleClose={handleClose} renderComponent={renderComponent} />
      
      
      
      </>
    );
  }
  

  if (data?.component?.sName === dialogMode?.sAdd?.sAddForm) {
    setOpenModalData(data?.component);
    return (
      <Grid container>
        <Dialog
          open={open}
          aria-labelledby={`${data?.component?.sName}-alert-dialog-title`}
          style={{ zIndex: "1201" }}
          aria-describedby={`${data?.component?.sName}-alert-dialog-description`}
        >
          <DialogTitle id={`${data?.component?.sType}-alert-dialog-title`}>
            {data?.component?.sLabel}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id={data?.component?.sName}>
              {data?.component?.sDefaultValue}
            </DialogContentText>
            <Grid item {...data?.grid_props}>
              <Grid container>{renderComponent(data?.child)}</Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Grid>
    );
  }
};
