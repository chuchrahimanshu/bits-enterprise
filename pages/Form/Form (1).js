import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { baseURL } from "../../api";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Icon } from "../../utils/MuiIcons/Icon";
import { Link as MuiLink } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { validateTextField } from "../../utils/validations/Validation";
import FolderIcon from "@mui/icons-material/Folder";
import AutoComplete from "../AutoComplete/AutoComplete";
import RadioGroupComponent from "../RadioGroupComponent/RadioGroupComponent";
import CheckBoxComponent from "../CheckBox/CheckBoxComponent";
import TransferList from "../TransferList/TransferList";
import SelectMainComponent from "../SelectComponent/SelectMainComponent";
import ImageUpload from "../../component/ImageUpload/ImageUpload";
import DateComponent from "../DateComponent/DateComponent";
import TableComponent from "../TableComponent/TableComponent";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import DataGridComponent from "../DataGridComponent/DataGridComponent";
import DeleteIcon from "@mui/icons-material/Delete";
import BasicTabs from "../TabComponent/TabComponent";
import FormBar from "./formmenu";

const Form = ({ route, caption }, componentData) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState();
  const [textValue, setTextValue] = useState({});
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(-1);
  const [tablesampledata, SetTabledata] = useState();
  const [handledata, setHandledata] = useState({});
  const [summaryfields, setsummaryfields] = useState();
  const [freeformdata, setFreeformfield] = useState();
  let urlCapture = window.location.pathname + window.location.search;


  // dialog
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // global
  const [user, setUser] = useState({});
  const [company, setCompany] = useState({});
  const [format, setFormat] = useState({});
  const [record, setRecord] = useState({});
  //
  useEffect(() => {
    // Fetch company data
    axios
      .get(`${baseURL}0/getCompanyDetail`) //rfg 24 apr 23
      .then((response) => {
        setCompany(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Fetch user data
    axios
      .get(`${baseURL}/getUserDetail`) //rfg 24 apr 23
      .then((response) => {
        setUser(response?.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Fetch format data
    axios
      .get(`${baseURL}/getFormatDetail`) //rfg 24 apr 23
      .then((response) => {
        setFormat(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getFieldValue = (sName) => {
    const [orgKey, fieldName] = sName?.split(".") ?? [];
    return company?.data?.[fieldName];
  };

  useEffect(() => {
    axios
      .get(
        (`${baseURL}${route}` && route === undefined) || route !== urlCapture
          ? `${baseURL}${urlCapture}`
          : `${baseURL}${route}`
      )
      .then((result) => {
        setFormData(result?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [route, urlCapture]);

  //  working
  useEffect(() => {
    const taxtvaluecols = {};
    formData?.details?.forEach((data) => {
      switch (data?.component?.sType) {
        case "TEXTFIELD":
        case "AUTOCOMPLETE":
        case "CHECKBOX":
        case "TRANSFERLIST":
        case "RADIOGROUP":
        case "SELECT":
        case "IMAGE":
        case "DATETIME":
        case "INPUTTABLE":
        case "DATAGRID":
          taxtvaluecols[data.component?.sName] = "";
          break;
        default:
          break;
      }
    });

    setTextValue(taxtvaluecols);
  }, [formData, urlCapture]);

  // edit table form.sFormSource
  const url = formData?.form?.sFormSource;
  useEffect(() => {
    if (url !== undefined && formData?.form?.sFormAction === "EDIT") {
      axios
        .get(`${baseURL}${url}`)
        .then((response) => {
          const data = response.data.data[0].mainrecord;
          const initialValues = {};
          for (const key in data) {
            initialValues[key] = data[key];
          }
          setTextValue(initialValues);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setTextValue({});
    }
  }, [url]);

  const [summerydata, setSummerydata] = useState();

  useEffect(() => {
    const summaryObj = summaryfields || "";

    const summaryArr = Object.entries(summaryObj).map(([key, value]) => ({
      sSummaryID: key,
      sInputValue: value,
      sValue: "",
    }));
    let value = [];
    summaryArr.map((item) => {
      value.push(item);
    });
    setSummerydata(value);
  }, [summaryfields]);

  const handleCancel = (destination, nextaction) => {
    navigate(destination);
  };
  const handleNext = (destination, nextaction) => {
    navigate(nextaction);
  };
  const [defaultTableMode, setDefaultTableMode] = useState("");
  const [defaultTableName, setDefaultTableName] = useState("");
  const [freeformTableMode, setFreeformTableMode] = useState("");
  const [freeformTableName, setFreeformTableName] = useState("");

  useEffect(() => {
    [formData].map((item) => {
      item &&
        item.details.forEach((data, ind) => {
          switch (data?.component?.sType) {
            case "TEXTFIELD":
              // Do something for TEXTFIELD
              break;
            case "AUTOCOMPLETE":
              // Do something for AUTOCOMPLETE
              break;
            case "CHECKBOX":
              // Do something for CHECKBOX
              break;
            case "RADIOGROUP":
              // Do something for RADIOGROUP
              break;
            case "SELECT":
              // Do something for SELECT
              break;
            case "DATETIME":
              // Do something for DATETIME
              break;
            case "INPUTTABLE":
              if (data?.component?.options.mode === "DEFAULT") {
                setDefaultTableMode(data?.component?.options.mode);
                setDefaultTableName(data.component.sName);
              } else if (data?.component?.options.mode === "FREEFORM") {
                setFreeformTableMode(data?.component?.options.mode);
                setFreeformTableName(data.component.sName);
              }
              break;
            default:
              // Do something for unknown sType values
              break;
          }
        });
    });
  }, [formData]);

  const [filterDefault, setfilterDefault] = useState();
  const [filterFreeform, setfilterfreeForm] = useState();
  useEffect(() => {
    if (tablesampledata) {
      const tabledata = tablesampledata;
      const filterDefaultData = tabledata.map(({ id, ...rest }) => rest);
      setfilterDefault(filterDefaultData);
    }
    if (freeformdata) {
      const tablefreeform = freeformdata;
      const filterFreeformData = tablefreeform.map(({ id, ...rest }) => rest);
      setfilterfreeForm(filterFreeformData);
    }
  }, [tablesampledata, freeformdata]);

  const [isSubmited, setIssubmited] = useState(false);

  useEffect(() => {
    if (isSubmited) {
      setTextValue({});
    }
  }, [isSubmited]);

  const handleSubmit = (destination, nextaction) => {
    const metadata =
      formData && formData.form
        ? {
            sFormname: formData.form.id,
            sFormAction: formData.form.sFormAction,
            sPrimarykey: formData.form.sPrimaryKey,
            id: formData.form.id,
            sPrimaryTable: formData.form.sPrimaryTable,
            sFormType: formData.form.sFormType,
            sPrimaryKeyValue: document.getElementById(formData.form.sPrimaryKey)
              ?.value,
          }
        : {};
    let data = {
      metadata: metadata,
      data: [
        {
          mainrecord: textValue,
        },
        {
          tablerecords: [],
        },
      ],
    };
    if (defaultTableMode && !freeformTableMode) {
      data?.data[1].tablerecords.push({
        sInputTableName: defaultTableName,
        sInputTableMode: defaultTableMode,

        tablesummary: summerydata,
        tabledetails: filterDefault,
      });
    } else if (freeformTableMode && !defaultTableMode) {
      data?.data[1].tablerecords.push({
        sInputTableName: freeformTableName,
        sInputTableMode: freeformTableMode,
        tabledetails: filterFreeform,
      });
    } else if (defaultTableMode && freeformTableMode) {
      data?.data[1].tablerecords.push(
        {
          sInputTableName: defaultTableName,
          sInputTableMode: defaultTableMode,

          tablesummary: summerydata,
          tabledetails: filterDefault,
        },
        {
          sInputTableName: freeformTableName,
          sInputTableMode: freeformTableMode,
          tabledetails: filterFreeform,
        }
      );
    }

    const uri = baseURL + destination;
    console.log("submit", data)
    axios
      .post(uri, data)
      .then((result) => {
        if (result.data) {
          if (result.data.metadata.status == "OK") {
            setIssubmited(true);
            // alert("Success");
            navigate(nextaction);
          } else {
            // alert(result.data.metadata.msg);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleclickdata = (e, mode, uri) => {
    // console.log('mode',mode.options.others2)
    if (mode.options.others2 === "handleCancel") {
      handleCancel(uri.sAction);
      console.log("trigger cancel button");
    } else if (mode.options.others2 === "handleSubmit") {
      console.log("trigger save button");
      handleSubmit(uri.sDataSource, uri.sAction);
    } else if (mode.options.others2 === "handleNext") {
      console.log("handle Next");
      handleNext(uri.sDataSource, uri.sAction);
    }
    else if (mode.options.others2 === "handleDialog") {
      console.log("handle Dialog");
      handleClickOpen(); 
    }
    else if(mode.options.submode==="cancel"){
      handleClose();
    }
    else if (mode.options.submode==="submit"){
      handleSubmit(uri.sDataSource, uri.sAction);
    }
    else if (mode.options.submode !== 'cancel' && mode.options.submode !== 'submit'){
      handleNext(uri.sDataSource, uri.sAction);
    }
  };
  // clocse
  const handleTextValue = (event, ind, validation) => {
    const { name, value } = event.target;
    setIndex(ind);
    setTextValue({ ...textValue, [name]: value });
    setHandledata((prevState) => ({ ...prevState, [name]: value }));
    let isError;
    switch (validation?.sType) {
      case "ALPHA":
        isError = validateTextField(
          value,
          validation?.sRegex,
          validation?.iMinLen,
          validation?.iMaxLen
        );

      case "ALPHANUMERIC":
        isError = validateTextField(
          value,
          validation?.sRegex,
          validation?.iMinLen,
          validation?.iMaxLen
        );
      //   break;
      case "NUMBER":
        isError = validateTextField(
          value,
          validation?.sRegex,
          validation?.iMinValue,
          validation?.iMaxValue,
          true
        );
      //   break;
      case "DECIMAL":
        isError = validateTextField(
          value,
          validation?.sRegex,
          validation?.iMinValue,
          validation?.iMaxValue,
          true
        );

        break;
      default:
        break;
    }

    if (isError) {
      setError(isError);
      return;
    } else {
      setError(null);
      setTextValue({
        ...textValue,
        [name]: value,
      });
    }
  };

  const handletabledata = (e) => {
    SetTabledata(e);
  };
  const tablesummaryfields = (e) => {
    setsummaryfields(e);
  };
  const tablefreeformfield = (e) => {
    setFreeformfield(e);
  };

  const handledatechange = (e, name) => {
    setTextValue({ ...textValue, [name]: e });
  };

  const autoCompleteOnchange = (e, name) => {
    let { display = "", value = "" } = e || "";
    setTextValue({ ...textValue, [name]: value });
  };
  const handleCheckboxOnchange = (e, name) => {
    setTextValue({ ...textValue, [name]: e });
  };
  const handleselectOnchange = (e, name) => {
    setTextValue({ ...textValue, [name]: e });
  };
  const handleradiovalue = (e, name) => {
    setTextValue({ ...textValue, [name]: e });
  };
  const handleTransfervalue = (e, name) => {
    setTextValue({ ...textValue, [name]: e });
  };
  //List 1

  function DefaultComponent({ dataDefault, data }) {
    const [listItems, setListItems] = useState([]);

    useEffect(() => {
      axios
        .get(`${baseURL}${dataDefault}`)
        .then((result) => {
          setListItems(result.data);
        })
        .catch((error) => {
          console.log("errrrrrrrrr", error);
        });
    }, [dataDefault]);

    console.log("default", dataDefault);
    return (
      <Grid item {...data?.component?.grid_props}>
        <List>
          {listItems.map((item) => (
            <ListItem key={item.fieldname}>
              <ListItemText primary={item.primary} secondary={item.secondary} />
            </ListItem>
          ))}
        </List>
      </Grid>
    );
  }
  //
  // List2
  function ListAvatar({ dataDefault, data }) {
    const [listAvatarItem, setListAvatarItem] = useState([]);

    useEffect(() => {
      axios
        .get(`${baseURL}${dataDefault}`)
        .then((result) => {
          setListAvatarItem(result.data);
        })
        .catch((error) => {
          console.log("errrrrrrrrr", error);
        });
    }, [dataDefault]);
    return (
      <Grid item {...data?.component?.grid_props}>
        <List>
          {listAvatarItem.map((item) => (
            <ListItem key={item.fieldname}>
              <ListItemAvatar>
                <Avatar src={item?.source}></Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.primary} secondary={item.secondary} />
            </ListItem>
          ))}
        </List>
      </Grid>
    );
  }
  // List 3
  function ListIcon({ dataDefault, data }) {
    const [listIconItem, setListIconItem] = useState([]);
    const icon = data?.fieldIcon?.replace("Icon", "");
    useEffect(() => {
      axios
        .get(`${baseURL}${dataDefault}`)
        .then((result) => {
          setListIconItem(result.data);
        })
        .catch((error) => {
          console.log("errrrrrrrrr", error);
        });
    }, [dataDefault]);

    return (
      <Grid item {...data?.component?.grid_props}>
        <List>
          {listIconItem.map((item) => (
            <ListItem>
              <ListItemIcon>
                <Icon iconName={icon} />
                {/* field icon is not present in the API */}
              </ListItemIcon>
              <ListItemText primary={item.primary} secondary={item.secondary} />
            </ListItem>
          ))}
        </List>
      </Grid>
    );
  }
  //List 4
  function ListAvatarIconItem({ dataDefault, data }) {
    const [listAvatarIcon, setListAvatarIcon] = useState([]);

    useEffect(() => {
      axios
        .get(`${baseURL}${dataDefault}`)
        .then((result) => {
          setListAvatarIcon(result.data);
        })
        .catch((error) => {
          console.log("errrrrrrrrr", error);
        });
    }, [dataDefault]);

    return (
      <Grid item {...data?.component?.grid_props}>
        <List>
          {listAvatarIcon.map((item) => (
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                  {/* src for avatar is not available in the API */}
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                  {/* src for avatar is not available in the API */}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.primary} secondary={item.secondary} />
            </ListItem>
          ))}
        </List>
      </Grid>
    );
  }
  return (
    <>
      {[formData].map((item) => {
        return (
          <Grid
            container
            {...formData?.form?.sGridProps}
            key={formData?.form?.id}
          >
            <Grid item md={12}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">
                  {item?.form?.sBreadCrumbs}
                </Link>
              </Breadcrumbs>
            </Grid>
            <Grid item md={12} py={1}>
              <Typography {...item?.form?.sProps}>
                {item?.form?.sTitle}{" "}
              </Typography>
            </Grid>
            <Grid container>
              <FormBar toggle={0} menu={item?.form?.sMenu} />  {/* rfg 23 apr 23 */}
            </Grid>

            {item?.details.map((data, ind) => {
              // setDefaultValue((prev) => ({
              //   ...prev,
              //   [data?.component?.sType]: data?.component?.sDefaultValue,
              // }));
              switch (data?.component?.sType) {
                case "TYPOGRAPHY":
                  return (
                    <Grid item {...data?.grid_props}>
                      <Typography
                        id={data?.component?.sName}
                        {...data?.component?.sProps}
                      >
                        {data?.component?.sLabel}
                      </Typography>
                    </Grid>
                  );
                case "TEXTFIELD":
                  return (
                    <Grid item {...data?.grid_props}>
                      <TextField
                        id={data?.component?.sName}
                        label={data?.component?.sLabel}
                        placeholder={data?.component?.sPlaceHolder}
                        defaultValue={
                          textValue[data?.component?.sName] &&
                          textValue[data?.component?.sName].length > 0
                            ? ""
                            : data?.component?.sDefaultValue || ""
                        }
                        variant={data?.component?.sProps?.variant}
                        type={data?.component?.sAdornType}
                        value={
                          textValue[data?.component?.sName] &&
                          textValue[data?.component?.sName].length > 0
                            ? textValue[data?.component?.sName]
                            : null
                        }
                        name={data?.component?.sName}
                        onChange={(e) =>
                          handleTextValue(e, ind, data?.validation)
                        }
                        // helperText={data?.component?.sHelper}
                        error={index == ind && error}
                        InputProps={
                          data?.component?.sAdornPosition === "start"
                            ? {
                                startAdornment: (
                                  <>
                                    {data?.component?.sAdornPosition &&
                                      data?.component?.sAdornType && (
                                        <InputAdornment
                                          position={
                                            data?.component?.sAdornPosition
                                          }
                                        >
                                         <IconButton>
                                            <Icon
                                              name={data?.component?.sIcon}
                                            />
                                        </IconButton> 
                                        </InputAdornment>
                                      )}
                                  </>
                                ),
                              }
                            : {
                                endAdornment: (
                                  <>
                                    {data?.component?.sAdornPosition &&
                                      data?.component?.sAdornType && (
                                        <InputAdornment
                                          position={
                                            data?.component?.sAdornPosition
                                          }
                                        >
                                          <IconButton>
                                            <Icon
                                              iconName={data?.component?.sIcon}
                                            />
                                          </IconButton>
                                        </InputAdornment>
                                      )}
                                  </>
                                ),
                              }
                        }
                         {...data?.component?.sProps}
                      />

                      {error && index == ind && (
                        <p style={{ color: "red" }}>
                          {data?.component?.sHelper}
                        </p>
                      )}
                    </Grid>
                  );
                case "LINK":
                  return (
                    <Grid item {...data?.grid_props}>
                      <Link
                        to={data?.data?.sDataSource}
                        replace
                        {...data?.component?.sProps}
                      >
                        {data?.component?.sLabel}
                      </Link>
                    </Grid>
                  );
                case "AUTOCOMPLETE":
                  return (
                    <Grid item {...data?.grid_props}>
                      <AutoComplete
                        formcallback={(e) =>
                          autoCompleteOnchange(e, data?.component?.sName)
                        }
                        data={data}
                        {...data?.component?.sProps}
                      />
                    </Grid>
                  );
                case "CHECKBOX":
                  return (
                    <Grid item {...data?.grid_props}>
                      <CheckBoxComponent
                        handleCheckbox={(e) =>
                          handleCheckboxOnchange(e, data?.component?.sName)
                        }
                        data={data}
                        {...data?.component?.sProps}
                      />
                    </Grid>
                  );
                case "TRANSFERLIST":
                  return (
                    <Grid item {...data?.grid_props}>
                      <TransferList data={data} {...data?.component?.sProps} />
                    </Grid>
                  );
                case "RADIOGROUP":
                  return (
                    <Grid item {...data?.grid_props}>
                      <RadioGroupComponent
                        data={data}
                        radiochange={(e) =>
                          handleradiovalue(e, data?.component?.sName)
                        }
                        {...data?.component?.sProps}
                      />
                    </Grid>
                  );
                case "SELECT":
                  return (
                    <Grid item {...data?.grid_props}>
                      <SelectMainComponent
                        data={data}
                        {...data?.component?.sProps}
                        // summaryId={"summ_tax"}
                        handledatasend={(e) =>
                          handleselectOnchange(e, data.component?.sName)
                        }
                        taxUrl={item.sRoute}
                      />
                    </Grid>
                  );
                case "IMAGE":
                  return (
                    <Grid item {...data?.grid_props}>
                      <ImageUpload data={data} {...data?.component?.sProps} />
                    </Grid>
                  );
                case "DATETIME":
                  return (
                    <Grid item {...data?.grid_props}>
                      <DateComponent
                        data={data}
                        handledatechange={(e) =>
                          handledatechange(e, data.component.sName)
                        }
                        datavalue=""
                        datemod=""
                        datatextvalue={
                          textValue &&
                          textValue[data.component.sName] !== undefined &&
                          textValue[data.component.sName]
                        }
                        formaction={
                          formData &&
                          formData?.form &&
                          formData?.form?.sFormAction
                        }
                        {...data?.component?.sProps}
                      />
                    </Grid>
                  );
                case "INPUTTABLE":
                  return (
                    <TableComponent
                      data={data}
                      isSubmited={isSubmited}
                      tabledata={handletabledata}
                      tablesummaryfields={tablesummaryfields}
                      tablefreeformfield={tablefreeformfield}
                      formAction={formData?.form?.sFormAction}
                      formdata={formData}
                    />
                  );
                case "BUTTON":
                  return (
                    <Grid item {...data?.grid_props} >
                      <ButtonComponent
                        data={data}
                        onClickvalue={(e) =>
                          handleclickdata(e, data.component, data.data)
                        }
                        // onClickvalue={(e) => handleclickdata(e, data,formData)}
                      />
                    </Grid>
                  );
                case "DATAGRID":
                  return (
                    <Grid item {...data?.grid_props}>
                      <DataGridComponent
                        formdata={data}
                        formDetails={formData?.form}
                        {...data?.component?.sProps}
                      />
                    </Grid>
                  );
                case "BOX": {
                  return (
                    <Grid item {...data?.grid_props}>
                      <Box {...data?.component?.sProps}>
                        <Grid container {...data?.component?.options?.others1}>
                          {data?.child?.map((item1) => {
                            switch (item1?.component?.sType) {
                              case "TYPOGRAPHY":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <Typography
                                      id={item1?.component?.sName}
                                      {...item1?.component?.sProps}
                                    >
                                      {item1?.component?.sLabel}
                                    </Typography>
                                  </Grid>
                                );
                              case "BOX":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <Box {...item1?.component?.sProps}>
                                      {/* pasting here */}
                                      <Grid
                                        container
                                        {...item1?.component?.options?.others1}
                                      >
                                        {item1?.child?.map((item2) => {
                                          switch (item2?.component?.sType) {
                                            case "TYPOGRAPHY":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <Typography
                                                    id={item2?.component?.sName}
                                                    {...item2?.component
                                                      ?.sProps}
                                                  >
                                                    {item2?.component?.sLabel}
                                                  </Typography>
                                                </Grid>
                                              );
                                            case "TEXTFIELD":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <TextField
                                                    id={item2?.component?.sName}
                                                    label={
                                                      item2?.component?.sLabel
                                                    }
                                                    placeholder={
                                                      item2?.component
                                                        ?.sPlaceHolder
                                                    }
                                                    defaultValue={
                                                      item2?.component
                                                        ?.sDefaultValue
                                                    }
                                                    variant={
                                                      item2?.component?.sprops
                                                    }
                                                    type={
                                                      item2?.component
                                                        ?.sAdornType
                                                    }
                                                    value={
                                                      textValue[
                                                        item2?.component?.sName
                                                      ] || ""
                                                    }
                                                    name={
                                                      item2?.component?.sName
                                                    }
                                                    onChange={(e) =>
                                                      handleTextValue(
                                                        e,
                                                        ind,
                                                        item2?.validation
                                                      )
                                                    }
                                                    helperText={
                                                      item2?.component?.sHelper
                                                    }
                                                    error={error}
                                                    InputProps={
                                                      item2?.component
                                                        ?.sAdornPosition ===
                                                      "start"
                                                        ? {
                                                            startAdornment: (
                                                              <>
                                                                {item2
                                                                  ?.component
                                                                  ?.sAdornPosition &&
                                                                  item2
                                                                    ?.component
                                                                    ?.sAdornType && (
                                                                    <InputAdornment
                                                                      position={
                                                                        item2
                                                                          ?.component
                                                                          ?.sAdornPosition
                                                                      }
                                                                    >
                                                                      <IconButton>
                                                                        <Icon
                                                                          iconName={
                                                                            item2
                                                                              ?.component
                                                                              ?.sIcon
                                                                          }
                                                                        />
                                                                      </IconButton>
                                                                    </InputAdornment>
                                                                  )}
                                                              </>
                                                            ),
                                                          }
                                                        : {
                                                            endAdornment: (
                                                              <>
                                                                {item2
                                                                  ?.component
                                                                  ?.sAdornPosition &&
                                                                  item2
                                                                    ?.component
                                                                    ?.sAdornType && (
                                                                    <InputAdornment
                                                                      position={
                                                                        item2
                                                                          ?.component
                                                                          ?.sAdornPosition
                                                                      }
                                                                    >
                                                                      <IconButton>
                                                                        <Icon
                                                                          iconName={
                                                                            item2
                                                                              ?.component
                                                                              ?.sIcon
                                                                          }
                                                                        />
                                                                      </IconButton>
                                                                    </InputAdornment>
                                                                  )}
                                                              </>
                                                            ),
                                                          }
                                                    }
                                                    {...item2?.component
                                                      ?.sProps}
                                                  />

                                                  {error && index == ind && (
                                                    <p style={{ color: "red" }}>
                                                      {error}
                                                    </p>
                                                  )}
                                                </Grid>
                                              );
                                            case "LINK":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <Link
                                                    to={
                                                      item2?.data?.sDataSource
                                                    }
                                                    replace
                                                    {...item2?.component
                                                      ?.sProps}
                                                  >
                                                    {item2?.component?.sLabel}
                                                  </Link>
                                                </Grid>
                                              );
                                            case "AUTOCOMPLETE":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <AutoComplete
                                                    formcallback={(e) =>
                                                      autoCompleteOnchange(
                                                        e,
                                                        item2?.component?.sName
                                                      )
                                                    }
                                                    data={data}
                                                    {...item2?.component
                                                      ?.sProps}
                                                  />
                                                </Grid>
                                              );
                                            case "CHECKBOX":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <CheckBoxComponent
                                                    handleCheckbox={(e) =>
                                                      handleCheckboxOnchange(
                                                        e,
                                                        item2?.component?.sName
                                                      )
                                                    }
                                                    data={data}
                                                    {...item2?.component
                                                      ?.sProps}
                                                  />
                                                </Grid>
                                              );
                                            case "TRANSFERLIST":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <TransferList
                                                    data={data}
                                                    {...item2?.component
                                                      ?.sProps}
                                                  />
                                                </Grid>
                                              );
                                            case "RADIOGROUP":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <RadioGroupComponent
                                                    data={data}
                                                    radiochange={(e) =>
                                                      handleradiovalue(
                                                        e,
                                                        item2?.component?.sName
                                                      )
                                                    }
                                                    {...item2?.component
                                                      ?.sProps}
                                                  />
                                                </Grid>
                                              );
                                            case "SELECT":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <SelectMainComponent
                                                    data={data}
                                                    {...item2?.component
                                                      ?.sProps}
                                                    // summaryId={"summ_tax"}
                                                    handledatasend={(e) =>
                                                      handleselectOnchange(
                                                        e,
                                                        item2.component?.sName
                                                      )
                                                    }
                                                    taxUrl={item.sRoute}
                                                  />
                                                </Grid>
                                              );
                                            case "IMAGE":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <ImageUpload
                                                    data={data}
                                                    {...item2?.component
                                                      ?.sProps}
                                                  />
                                                </Grid>
                                              );
                                            case "DATETIME":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <DateComponent
                                                    data={data}
                                                    handledatechange={(e) =>
                                                      handledatechange(
                                                        e,
                                                        item2.component.sName
                                                      )
                                                    }
                                                    datavalue=""
                                                    datemod=""
                                                    datatextvalue={
                                                      textValue &&
                                                      textValue[
                                                        item2.component.sName
                                                      ] !== undefined &&
                                                      textValue[
                                                        item2.component.sName
                                                      ]
                                                    }
                                                    formaction={
                                                      formData &&
                                                      formData?.form &&
                                                      formData?.form
                                                        ?.sFormAction
                                                    }
                                                    {...item2?.component
                                                      ?.sProps}
                                                  />
                                                </Grid>
                                              );
                                            default:
                                              return null;
                                          }
                                        })}
                                      </Grid>
                                    </Box>
                                  </Grid>
                                );
                              case "TEXTFIELD":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <TextField
                                      id={item1?.component?.sName}
                                      label={item1?.component?.sLabel}
                                      placeholder={
                                        item1?.component?.sPlaceHolder
                                      }
                                      defaultValue={
                                        item1?.component?.sDefaultValue
                                      }
                                      variant={item1?.component?.sprops}
                                      type={item1?.component?.sAdornType}
                                      value={
                                        textValue[item1?.component?.sName] || ""
                                      }
                                      name={item1?.component?.sName}
                                      onChange={(e) =>
                                        handleTextValue(
                                          e,
                                          ind,
                                          item1?.validation
                                        )
                                      }
                                      helperText={item1?.component?.sHelper}
                                      error={error}
                                      InputProps={
                                        item1?.component?.sAdornPosition ===
                                        "start"
                                          ? {
                                              startAdornment: (
                                                <>
                                                  {item1?.component
                                                    ?.sAdornPosition &&
                                                    item1?.component
                                                      ?.sAdornType && (
                                                      <InputAdornment
                                                        position={
                                                          item1?.component
                                                            ?.sAdornPosition
                                                        }
                                                      >
                                                        <IconButton>
                                                          <Icon
                                                            iconName={
                                                              item1?.component
                                                                ?.sIcon
                                                            }
                                                          />
                                                        </IconButton>
                                                      </InputAdornment>
                                                    )}
                                                </>
                                              ),
                                            }
                                          : {
                                              endAdornment: (
                                                <>
                                                  {item1?.component
                                                    ?.sAdornPosition &&
                                                    item1?.component
                                                      ?.sAdornType && (
                                                      <InputAdornment
                                                        position={
                                                          item1?.component
                                                            ?.sAdornPosition
                                                        }
                                                      >
                                                        <IconButton>
                                                          <Icon
                                                            iconName={
                                                              item1?.component
                                                                ?.sIcon
                                                            }
                                                          />
                                                        </IconButton>
                                                      </InputAdornment>
                                                    )}
                                                </>
                                              ),
                                            }
                                      }
                                      {...item1?.component?.sProps}
                                    />

                                    {error && index == ind && (
                                      <p style={{ color: "red" }}>{error}</p>
                                    )}
                                  </Grid>
                                );
                              case "LINK":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <Link
                                      to={item1?.data?.sDataSource}
                                      replace
                                      {...item1?.component?.sProps}
                                    >
                                      {item1?.component?.sLabel}
                                    </Link>
                                  </Grid>
                                );
                              case "AUTOCOMPLETE":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <AutoComplete
                                      formcallback={(e) =>
                                        autoCompleteOnchange(
                                          e,
                                          item1?.component?.sName
                                        )
                                      }
                                      data={data}
                                      {...item1?.component?.sProps}
                                    />
                                  </Grid>
                                );
                              case "CHECKBOX":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <CheckBoxComponent
                                      handleCheckbox={(e) =>
                                        handleCheckboxOnchange(
                                          e,
                                          item1?.component?.sName
                                        )
                                      }
                                      data={data}
                                      {...item1?.component?.sProps}
                                    />
                                  </Grid>
                                );
                              case "TRANSFERLIST":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <TransferList
                                      data={data}
                                      {...item1?.component?.sProps}
                                    />
                                  </Grid>
                                );
                              case "RADIOGROUP":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <RadioGroupComponent
                                      data={data}
                                      radiochange={(e) =>
                                        handleradiovalue(
                                          e,
                                          item1?.component?.sName
                                        )
                                      }
                                      {...item1?.component?.sProps}
                                    />
                                  </Grid>
                                );
                              case "SELECT":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <SelectMainComponent
                                      data={data}
                                      {...item1?.component?.sProps}
                                      // summaryId={"summ_tax"}
                                      handledatasend={(e) =>
                                        handleselectOnchange(
                                          e,
                                          item1.component?.sName
                                        )
                                      }
                                      taxUrl={item.sRoute}
                                    />
                                  </Grid>
                                );
                              case "IMAGE":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <ImageUpload
                                      data={data}
                                      {...item1?.component?.sProps}
                                    />
                                  </Grid>
                                );
                              case "DATETIME":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <DateComponent
                                      data={data}
                                      handledatechange={(e) =>
                                        handledatechange(
                                          e,
                                          item1.component.sName
                                        )
                                      }
                                      datavalue=""
                                      datemod=""
                                      datatextvalue={
                                        textValue &&
                                        textValue[item1.component.sName] !==
                                          undefined &&
                                        textValue[item1.component.sName]
                                      }
                                      formaction={
                                        formData &&
                                        formData?.form &&
                                        formData?.form?.sFormAction
                                      }
                                      {...item1?.component?.sProps}
                                    />
                                  </Grid>
                                );
                              case "BUTTON":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <ButtonComponent
                                      data={data}
                                      onClickvalue={(e) =>
                                        handleclickdata(
                                          e,
                                          item1.component,
                                          item1.data
                                        )
                                      }
                                      // onClickvalue={(e) => handleclickdata(e, data,formData)}
                                    />
                                  </Grid>
                                );
                              default:
                                return null;
                            }
                          })}
                        </Grid>
                      </Box>
                    </Grid>
                  );
                }
                case "PAPER": {
                  return (
                    <Grid item {...data.grid_props}>
                      <Paper {...data?.component?.sProps}>
                        <Grid container {...data?.component?.options?.others1}>
                          {data?.child?.map((item1) => {
                            switch (item1?.component?.sType) {
                              case "TYPOGRAPHY":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <Typography
                                      id={item1?.component?.sName}
                                      {...item1?.component?.sProps}
                                    >
                                      {item1?.component?.sLabel}
                                    </Typography>
                                  </Grid>
                                );
                              case "BOX":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <Box {...item1?.component?.sProps}>
                                      {/* pasting here */}
                                      <Grid
                                        container
                                        {...item1?.component?.options?.others1}
                                      >
                                        {item1?.child?.map((item2) => {
                                          switch (item2?.component?.sType) {
                                            case "TYPOGRAPHY":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <Typography
                                                    id={item2?.component?.sName}
                                                    {...item2?.component
                                                      ?.sProps}
                                                  >
                                                    {item2?.component?.sLabel}
                                                  </Typography>
                                                </Grid>
                                              );

                                            case "TEXTFIELD":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <TextField
                                                    id={item2?.component?.sName}
                                                    label={
                                                      item2?.component?.sLabel
                                                    }
                                                    placeholder={
                                                      item2?.component
                                                        ?.sPlaceHolder
                                                    }
                                                    defaultValue={
                                                      item2?.component
                                                        ?.sDefaultValue
                                                    }
                                                    variant={
                                                      item2?.component?.sprops
                                                    }
                                                    type={
                                                      item2?.component
                                                        ?.sAdornType
                                                    }
                                                    value={
                                                      textValue[
                                                        item2?.component?.sName
                                                      ] || ""
                                                    }
                                                    name={
                                                      item2?.component?.sName
                                                    }
                                                    onChange={(e) =>
                                                      handleTextValue(
                                                        e,
                                                        ind,
                                                        item2?.validation
                                                      )
                                                    }
                                                    helperText={
                                                      item2?.component?.sHelper
                                                    }
                                                    error={error}
                                                    InputProps={
                                                      item2?.component
                                                        ?.sAdornPosition ===
                                                      "start"
                                                        ? {
                                                            startAdornment: (
                                                              <>
                                                                {item2
                                                                  ?.component
                                                                  ?.sAdornPosition &&
                                                                  item2
                                                                    ?.component
                                                                    ?.sAdornType && (
                                                                    <InputAdornment
                                                                      position={
                                                                        item2
                                                                          ?.component
                                                                          ?.sAdornPosition
                                                                      }
                                                                    >
                                                                      <IconButton>
                                                                        <Icon
                                                                          iconName={
                                                                            item2
                                                                              ?.component
                                                                              ?.sIcon
                                                                          }
                                                                        />
                                                                      </IconButton>
                                                                    </InputAdornment>
                                                                  )}
                                                              </>
                                                            ),
                                                          }
                                                        : {
                                                            endAdornment: (
                                                              <>
                                                                {item2
                                                                  ?.component
                                                                  ?.sAdornPosition &&
                                                                  item2
                                                                    ?.component
                                                                    ?.sAdornType && (
                                                                    <InputAdornment
                                                                      position={
                                                                        item2
                                                                          ?.component
                                                                          ?.sAdornPosition
                                                                      }
                                                                    >
                                                                      <IconButton>
                                                                        <Icon
                                                                          iconName={
                                                                            item2
                                                                              ?.component
                                                                              ?.sIcon
                                                                          }
                                                                        />
                                                                      </IconButton>
                                                                    </InputAdornment>
                                                                  )}
                                                              </>
                                                            ),
                                                          }
                                                    }
                                                    {...item2?.component
                                                      ?.sProps}
                                                  />

                                                  {error && index == ind && (
                                                    <p style={{ color: "red" }}>
                                                      {error}
                                                    </p>
                                                  )}
                                                </Grid>
                                              );
                                            case "LINK":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <Link
                                                    to={
                                                      item2?.data?.sDataSource
                                                    }
                                                    replace
                                                    {...item2?.component
                                                      ?.sProps}
                                                  >
                                                    {item2?.component?.sLabel}
                                                  </Link>
                                                </Grid>
                                              );
                                            case "AUTOCOMPLETE":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <AutoComplete
                                                    formcallback={(e) =>
                                                      autoCompleteOnchange(
                                                        e,
                                                        item2?.component?.sName
                                                      )
                                                    }
                                                    data={data}
                                                    {...item2?.component
                                                      ?.sProps}
                                                  />
                                                </Grid>
                                              );
                                            case "CHECKBOX":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <CheckBoxComponent
                                                    handleCheckbox={(e) =>
                                                      handleCheckboxOnchange(
                                                        e,
                                                        item2?.component?.sName
                                                      )
                                                    }
                                                    data={data}
                                                    {...item2?.component
                                                      ?.sProps}
                                                  />
                                                </Grid>
                                              );
                                            case "TRANSFERLIST":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <TransferList
                                                    data={data}
                                                    {...item2?.component
                                                      ?.sProps}
                                                  />
                                                </Grid>
                                              );
                                            case "RADIOGROUP":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <RadioGroupComponent
                                                    data={data}
                                                    radiochange={(e) =>
                                                      handleradiovalue(
                                                        e,
                                                        item2?.component?.sName
                                                      )
                                                    }
                                                    {...item2?.component
                                                      ?.sProps}
                                                  />
                                                </Grid>
                                              );
                                            case "SELECT":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <SelectMainComponent
                                                    data={data}
                                                    {...item2?.component
                                                      ?.sProps}
                                                    // summaryId={"summ_tax"}
                                                    handledatasend={(e) =>
                                                      handleselectOnchange(
                                                        e,
                                                        item2.component?.sName
                                                      )
                                                    }
                                                    taxUrl={item.sRoute}
                                                  />
                                                </Grid>
                                              );
                                            case "IMAGE":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <ImageUpload
                                                    data={data}
                                                    {...item2?.component
                                                      ?.sProps}
                                                  />
                                                </Grid>
                                              );
                                            case "DATETIME":
                                              return (
                                                <Grid
                                                  item
                                                  {...item2?.grid_props}
                                                >
                                                  <DateComponent
                                                    data={data}
                                                    handledatechange={(e) =>
                                                      handledatechange(
                                                        e,
                                                        item2.component.sName
                                                      )
                                                    }
                                                    datavalue=""
                                                    datemod=""
                                                    datatextvalue={
                                                      textValue &&
                                                      textValue[
                                                        item2.component.sName
                                                      ] !== undefined &&
                                                      textValue[
                                                        item2.component.sName
                                                      ]
                                                    }
                                                    formaction={
                                                      formData &&
                                                      formData?.form &&
                                                      formData?.form
                                                        ?.sFormAction
                                                    }
                                                    {...item2?.component
                                                      ?.sProps}
                                                  />
                                                </Grid>
                                              );
                                            default:
                                              return null;
                                          }
                                        })}
                                      </Grid>
                                    </Box>
                                  </Grid>
                                );
                              case "TEXTFIELD":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <TextField
                                      id={item1?.component?.sName}
                                      label={item1?.component?.sLabel}
                                      placeholder={
                                        item1?.component?.sPlaceHolder
                                      }
                                      defaultValue={
                                        item1?.component?.sDefaultValue
                                      }
                                      variant={item1?.component?.sprops}
                                      type={item1?.component?.sAdornType}
                                      value={
                                        textValue[item1?.component?.sName] || ""
                                      }
                                      name={item1?.component?.sName}
                                      onChange={(e) =>
                                        handleTextValue(
                                          e,
                                          ind,
                                          item1?.validation
                                        )
                                      }
                                      helperText={item1?.component?.sHelper}
                                      error={error}
                                      InputProps={
                                        item1?.component?.sAdornPosition ===
                                        "start"
                                          ? {
                                              startAdornment: (
                                                <>
                                                  {item1?.component
                                                    ?.sAdornPosition &&
                                                    item1?.component
                                                      ?.sAdornType && (
                                                      <InputAdornment
                                                        position={
                                                          item1?.component
                                                            ?.sAdornPosition
                                                        }
                                                      >
                                                        <IconButton>
                                                          <Icon
                                                            iconName={
                                                              item1?.component
                                                                ?.sIcon
                                                            }
                                                          />
                                                        </IconButton>
                                                      </InputAdornment>
                                                    )}
                                                </>
                                              ),
                                            }
                                          : {
                                              endAdornment: (
                                                <>
                                                  {item1?.component
                                                    ?.sAdornPosition &&
                                                    item1?.component
                                                      ?.sAdornType && (
                                                      <InputAdornment
                                                        position={
                                                          item1?.component
                                                            ?.sAdornPosition
                                                        }
                                                      >
                                                        <IconButton>
                                                          <Icon
                                                            iconName={
                                                              item1?.component
                                                                ?.sIcon
                                                            }
                                                          />
                                                        </IconButton>
                                                      </InputAdornment>
                                                    )}
                                                </>
                                              ),
                                            }
                                      }
                                      {...item1?.component?.sProps}
                                    />

                                    {error && index == ind && (
                                      <p style={{ color: "red" }}>{error}</p>
                                    )}
                                  </Grid>
                                );
                              case "LINK":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <Link
                                      to={item1?.data?.sDataSource}
                                      replace
                                      {...item1?.component?.sProps}
                                    >
                                      {item1?.component?.sLabel}
                                    </Link>
                                  </Grid>
                                );
                              case "AUTOCOMPLETE":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <AutoComplete
                                      formcallback={(e) =>
                                        autoCompleteOnchange(
                                          e,
                                          item1?.component?.sName
                                        )
                                      }
                                      data={data}
                                      {...item1?.component?.sProps}
                                    />
                                  </Grid>
                                );
                              case "CHECKBOX":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <CheckBoxComponent
                                      handleCheckbox={(e) =>
                                        handleCheckboxOnchange(
                                          e,
                                          item1?.component?.sName
                                        )
                                      }
                                      data={data}
                                      {...item1?.component?.sProps}
                                    />
                                  </Grid>
                                );
                              case "TRANSFERLIST":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <TransferList
                                      data={data}
                                      {...item1?.component?.sProps}
                                    />
                                  </Grid>
                                );
                              case "RADIOGROUP":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <RadioGroupComponent
                                      data={data}
                                      radiochange={(e) =>
                                        handleradiovalue(
                                          e,
                                          item1?.component?.sName
                                        )
                                      }
                                      {...item1?.component?.sProps}
                                    />
                                  </Grid>
                                );
                              case "SELECT":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <SelectMainComponent
                                      data={data}
                                      {...item1?.component?.sProps}
                                      // summaryId={"summ_tax"}
                                      handledatasend={(e) =>
                                        handleselectOnchange(
                                          e,
                                          item1.component?.sName
                                        )
                                      }
                                      taxUrl={item.sRoute}
                                    />
                                  </Grid>
                                );
                              case "IMAGE":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <ImageUpload
                                      data={data}
                                      {...item1?.component?.sProps}
                                    />
                                  </Grid>
                                );
                              case "DATETIME":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <DateComponent
                                      data={data}
                                      handledatechange={(e) =>
                                        handledatechange(
                                          e,
                                          item1.component.sName
                                        )
                                      }
                                      datavalue=""
                                      datemod=""
                                      datatextvalue={
                                        textValue &&
                                        textValue[item1.component.sName] !==
                                          undefined &&
                                        textValue[item1.component.sName]
                                      }
                                      formaction={
                                        formData &&
                                        formData?.form &&
                                        formData?.form?.sFormAction
                                      }
                                      {...item1?.component?.sProps}
                                    />
                                  </Grid>
                                );
                              case "BUTTON":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <ButtonComponent
                                      data={data}
                                      onClickvalue={(e) =>
                                        handleclickdata(
                                          e,
                                          item1.component,
                                          data.data
                                        )
                                      }
                                      // onClickvalue={(e) => handleclickdata(e, data,formData)}
                                    />
                                  </Grid>
                                );
                              default:
                                return null;
                            }
                          })}
                        </Grid>
                      </Paper>
                    </Grid>
                  );
                }
                case "CARD": {
                  return (
                    <Grid item {...data.grid_props}>
                      <Card {...data?.component?.sProps}>
                        {data?.child?.map((item1) => {
                          return (
                            <>
                              <CardActionArea>
                                {item1?.component?.sType === "IMG" && (
                                  <CardMedia {...item1?.component?.sProps} />
                                )}
                                {item1?.component?.sType === "TYPOGRAPHY" && (
                                  <CardContent>
                                    <Grid item {...item1?.grid_props}>
                                      <Typography
                                        id={item1?.component?.sName}
                                        {...item1?.component?.sProps}
                                      >
                                        {item1?.component?.sLabel}
                                      </Typography>
                                    </Grid>
                                  </CardContent>
                                )}
                              </CardActionArea>
                              <CardActions>
                                {item1?.component?.sType === "BUTTON" ? (
                                  <ButtonComponent
                                    data={item1}
                                    onClickvalue={(e) =>
                                      handleclickdata(
                                        e,
                                        item1.component,
                                        item1.data
                                      )
                                    }
                                  />
                                ) : null}
                              </CardActions>
                            </>
                          );
                        })}
                      </Card>
                    </Grid>
                  );
                }

                case "DIVIDER": {
                  return (
                    <Grid item {...data.grid_props}>
                      <Divider {...data?.component?.sProps}>
                        {data?.child?.map((item1) => {
                          switch (item1?.component?.sType) {
                            case "TYPOGRAPHY":
                              return (
                                <Grid item {...item1?.grid_props}>
                                  <Typography
                                    id={item1?.component?.sName}
                                    {...item1?.component?.sProps}
                                  >
                                    {item1?.component?.sLabel}
                                  </Typography>
                                </Grid>
                              );
                            case "BOX":
                              return (
                                <Grid item {...item1?.grid_props}>
                                  <Box {...item1?.component?.sProps}>
                                    {/* pasting here */}
                                    <Grid
                                      container
                                      {...item1?.component?.options?.others1}
                                    >
                                      {item1?.child?.map((item2) => {
                                        switch (item2?.component?.sType) {
                                          case "TYPOGRAPHY":
                                            return (
                                              <Grid item {...item2?.grid_props}>
                                                <Typography
                                                  id={item2?.component?.sName}
                                                  {...item2?.component?.sProps}
                                                >
                                                  {item2?.component?.sLabel}
                                                </Typography>
                                              </Grid>
                                            );
                                          case "TEXTFIELD":
                                            return (
                                              <Grid item {...item2?.grid_props}>
                                                <TextField
                                                  id={item2?.component?.sName}
                                                  label={
                                                    item2?.component?.sLabel
                                                  }
                                                  placeholder={
                                                    item2?.component
                                                      ?.sPlaceHolder
                                                  }
                                                  defaultValue={
                                                    item2?.component
                                                      ?.sDefaultValue
                                                  }
                                                  variant={
                                                    item2?.component?.sprops
                                                  }
                                                  type={
                                                    item2?.component?.sAdornType
                                                  }
                                                  value={
                                                    textValue[
                                                      item2?.component?.sName
                                                    ] || ""
                                                  }
                                                  name={item2?.component?.sName}
                                                  onChange={(e) =>
                                                    handleTextValue(
                                                      e,
                                                      ind,
                                                      item2?.validation
                                                    )
                                                  }
                                                  helperText={
                                                    item2?.component?.sHelper
                                                  }
                                                  error={error}
                                                  InputProps={
                                                    item2?.component
                                                      ?.sAdornPosition ===
                                                    "start"
                                                      ? {
                                                          startAdornment: (
                                                            <>
                                                              {item2?.component
                                                                ?.sAdornPosition &&
                                                                item2?.component
                                                                  ?.sAdornType && (
                                                                  <InputAdornment
                                                                    position={
                                                                      item2
                                                                        ?.component
                                                                        ?.sAdornPosition
                                                                    }
                                                                  >
                                                                    <IconButton>
                                                                      <Icon
                                                                        iconName={
                                                                          item2
                                                                            ?.component
                                                                            ?.sIcon
                                                                        }
                                                                      />
                                                                    </IconButton>
                                                                  </InputAdornment>
                                                                )}
                                                            </>
                                                          ),
                                                        }
                                                      : {
                                                          endAdornment: (
                                                            <>
                                                              {item2?.component
                                                                ?.sAdornPosition &&
                                                                item2?.component
                                                                  ?.sAdornType && (
                                                                  <InputAdornment
                                                                    position={
                                                                      item2
                                                                        ?.component
                                                                        ?.sAdornPosition
                                                                    }
                                                                  >
                                                                    <IconButton>
                                                                      <Icon
                                                                        iconName={
                                                                          item2
                                                                            ?.component
                                                                            ?.sIcon
                                                                        }
                                                                      />
                                                                    </IconButton>
                                                                  </InputAdornment>
                                                                )}
                                                            </>
                                                          ),
                                                        }
                                                  }
                                                  {...item2?.component?.sProps}
                                                />

                                                {error && index == ind && (
                                                  <p style={{ color: "red" }}>
                                                    {error}
                                                  </p>
                                                )}
                                              </Grid>
                                            );
                                          case "LINK":
                                            return (
                                              <Grid item {...item2?.grid_props}>
                                                <Link
                                                  to={item2?.data?.sDataSource}
                                                  replace
                                                  {...item2?.component?.sProps}
                                                >
                                                  {item2?.component?.sLabel}
                                                </Link>
                                              </Grid>
                                            );
                                          case "AUTOCOMPLETE":
                                            return (
                                              <Grid item {...item2?.grid_props}>
                                                <AutoComplete
                                                  formcallback={(e) =>
                                                    autoCompleteOnchange(
                                                      e,
                                                      item2?.component?.sName
                                                    )
                                                  }
                                                  data={data}
                                                  {...item2?.component?.sProps}
                                                />
                                              </Grid>
                                            );
                                          case "CHECKBOX":
                                            return (
                                              <Grid item {...item2?.grid_props}>
                                                <CheckBoxComponent
                                                  handleCheckbox={(e) =>
                                                    handleCheckboxOnchange(
                                                      e,
                                                      item2?.component?.sName
                                                    )
                                                  }
                                                  data={data}
                                                  {...item2?.component?.sProps}
                                                />
                                              </Grid>
                                            );
                                          case "TRANSFERLIST":
                                            return (
                                              <Grid item {...item2?.grid_props}>
                                                <TransferList
                                                  data={data}
                                                  {...item2?.component?.sProps}
                                                />
                                              </Grid>
                                            );
                                          case "RADIOGROUP":
                                            return (
                                              <Grid item {...item2?.grid_props}>
                                                <RadioGroupComponent
                                                  data={data}
                                                  radiochange={(e) =>
                                                    handleradiovalue(
                                                      e,
                                                      item2?.component?.sName
                                                    )
                                                  }
                                                  {...item2?.component?.sProps}
                                                />
                                              </Grid>
                                            );
                                          case "SELECT":
                                            return (
                                              <Grid item {...item2?.grid_props}>
                                                <SelectMainComponent
                                                  data={data}
                                                  {...item2?.component?.sProps}
                                                  // summaryId={"summ_tax"}
                                                  handledatasend={(e) =>
                                                    handleselectOnchange(
                                                      e,
                                                      item2.component?.sName
                                                    )
                                                  }
                                                  taxUrl={item.sRoute}
                                                />
                                              </Grid>
                                            );
                                          case "IMAGE":
                                            return (
                                              <Grid item {...item2?.grid_props}>
                                                <ImageUpload
                                                  data={data}
                                                  {...item2?.component?.sProps}
                                                />
                                              </Grid>
                                            );
                                          case "DATETIME":
                                            return (
                                              <Grid item {...item2?.grid_props}>
                                                <DateComponent
                                                  data={data}
                                                  handledatechange={(e) =>
                                                    handledatechange(
                                                      e,
                                                      item2.component.sName
                                                    )
                                                  }
                                                  datavalue=""
                                                  datemod=""
                                                  datatextvalue={
                                                    textValue &&
                                                    textValue[
                                                      item2.component.sName
                                                    ] !== undefined &&
                                                    textValue[
                                                      item2.component.sName
                                                    ]
                                                  }
                                                  formaction={
                                                    formData &&
                                                    formData?.form &&
                                                    formData?.form?.sFormAction
                                                  }
                                                  {...item2?.component?.sProps}
                                                />
                                              </Grid>
                                            );
                                          default:
                                            return null;
                                        }
                                      })}
                                    </Grid>
                                  </Box>
                                </Grid>
                              );
                            case "TEXTFIELD":
                              return (
                                <Grid item {...item1?.grid_props}>
                                  <TextField
                                    id={item1?.component?.sName}
                                    label={item1?.component?.sLabel}
                                    placeholder={item1?.component?.sPlaceHolder}
                                    defaultValue={
                                      item1?.component?.sDefaultValue
                                    }
                                    variant={item1?.component?.sprops}
                                    type={item1?.component?.sAdornType}
                                    value={
                                      textValue[item1?.component?.sName] || ""
                                    }
                                    name={item1?.component?.sName}
                                    onChange={(e) =>
                                      handleTextValue(e, ind, item1?.validation)
                                    }
                                    helperText={item1?.component?.sHelper}
                                    error={error}
                                    InputProps={
                                      item1?.component?.sAdornPosition ===
                                      "start"
                                        ? {
                                            startAdornment: (
                                              <>
                                                {item1?.component
                                                  ?.sAdornPosition &&
                                                  item1?.component
                                                    ?.sAdornType && (
                                                    <InputAdornment
                                                      position={
                                                        item1?.component
                                                          ?.sAdornPosition
                                                      }
                                                    >
                                                      <IconButton>
                                                        <Icon
                                                          iconName={
                                                            item1?.component
                                                              ?.sIcon
                                                          }
                                                        />
                                                      </IconButton>
                                                    </InputAdornment>
                                                  )}
                                              </>
                                            ),
                                          }
                                        : {
                                            endAdornment: (
                                              <>
                                                {item1?.component
                                                  ?.sAdornPosition &&
                                                  item1?.component
                                                    ?.sAdornType && (
                                                    <InputAdornment
                                                      position={
                                                        item1?.component
                                                          ?.sAdornPosition
                                                      }
                                                    >
                                                      <IconButton>
                                                        <Icon
                                                          iconName={
                                                            item1?.component
                                                              ?.sIcon
                                                          }
                                                        />
                                                      </IconButton>
                                                    </InputAdornment>
                                                  )}
                                              </>
                                            ),
                                          }
                                    }
                                    {...item1?.component?.sProps}
                                  />

                                  {error && index == ind && (
                                    <p style={{ color: "red" }}>{error}</p>
                                  )}
                                </Grid>
                              );
                            case "LINK":
                              return (
                                <Grid item {...item1?.grid_props}>
                                  <Link
                                    to={item1?.data?.sDataSource}
                                    replace
                                    {...item1?.component?.sProps}
                                  >
                                    {item1?.component?.sLabel}
                                  </Link>
                                </Grid>
                              );
                            case "AUTOCOMPLETE":
                              return (
                                <Grid item {...item1?.grid_props}>
                                  <AutoComplete
                                    formcallback={(e) =>
                                      autoCompleteOnchange(
                                        e,
                                        item1?.component?.sName
                                      )
                                    }
                                    data={data}
                                    {...item1?.component?.sProps}
                                  />
                                </Grid>
                              );
                            case "CHECKBOX":
                              return (
                                <Grid item {...item1?.grid_props}>
                                  <CheckBoxComponent
                                    handleCheckbox={(e) =>
                                      handleCheckboxOnchange(
                                        e,
                                        item1?.component?.sName
                                      )
                                    }
                                    data={data}
                                    {...item1?.component?.sProps}
                                  />
                                </Grid>
                              );
                            case "TRANSFERLIST":
                              return (
                                <Grid item {...item1?.grid_props}>
                                  <TransferList
                                    data={data}
                                    {...item1?.component?.sProps}
                                  />
                                </Grid>
                              );
                            case "RADIOGROUP":
                              return (
                                <Grid item {...item1?.grid_props}>
                                  <RadioGroupComponent
                                    data={data}
                                    radiochange={(e) =>
                                      handleradiovalue(
                                        e,
                                        item1?.component?.sName
                                      )
                                    }
                                    {...item1?.component?.sProps}
                                  />
                                </Grid>
                              );
                            case "SELECT":
                              return (
                                <Grid item {...item1?.grid_props}>
                                  <SelectMainComponent
                                    data={data}
                                    {...item1?.component?.sProps}
                                    // summaryId={"summ_tax"}
                                    handledatasend={(e) =>
                                      handleselectOnchange(
                                        e,
                                        item1.component?.sName
                                      )
                                    }
                                    taxUrl={item.sRoute}
                                  />
                                </Grid>
                              );
                            case "IMAGE":
                              return (
                                <Grid item {...item1?.grid_props}>
                                  <ImageUpload
                                    data={data}
                                    {...item1?.component?.sProps}
                                  />
                                </Grid>
                              );
                            case "DATETIME":
                              return (
                                <Grid item {...item1?.grid_props}>
                                  <DateComponent
                                    data={data}
                                    handledatechange={(e) =>
                                      handledatechange(e, item1.component.sName)
                                    }
                                    datavalue=""
                                    datemod=""
                                    datatextvalue={
                                      textValue &&
                                      textValue[item1.component.sName] !==
                                        undefined &&
                                      textValue[item1.component.sName]
                                    }
                                    formaction={
                                      formData &&
                                      formData?.form &&
                                      formData?.form?.sFormAction
                                    }
                                    {...item1?.component?.sProps}
                                  />
                                </Grid>
                              );
                            case "BUTTON":
                              return (
                                <Grid item {...item1?.grid_props}>
                                  <ButtonComponent
                                    data={data}
                                    onClickvalue={(e) =>
                                      handleclickdata(
                                        e,
                                        item1.component,
                                        item1.data
                                      )
                                    }
                                    // onClickvalue={(e) => handleclickdata(e, data,formData)}
                                  />
                                </Grid>
                              );
                            default:
                              return null;
                          }
                        })}
                      </Divider>
                    </Grid>
                  );
                }
                case "STACK":
                  return (
                    <Grid item {...data?.grid_props}>
                      <Stack {...data?.component?.sProps}>
                        <Grid container {...data?.component?.options?.others1}>
                          {data?.child?.map((item1) => {
                            switch (item1?.component?.sType) {
                              case "TYPOGRAPHY":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <item>
                                      <Typography
                                        id={item1?.component?.sName}
                                        {...item1?.component?.sProps}
                                      >
                                        {item1?.component?.sLabel}
                                      </Typography>
                                    </item>
                                  </Grid>
                                );
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
                      <Icon
                        id={data?.component?.sName}
                        {...data?.component?.sProps}
                        iconName={icon}
                      />
                    </Grid>
                  );
                }
                case "AVATAR": {
                  return data?.component?.sAdornType === "IMG" ? (
                    <Grid item {...data.grid_props}>
                      <Avatar
                        alt={data?.data?.sAction}
                        src={data?.data?.sDataSource}
                        {...data?.component?.sProps}
                      ></Avatar>
                    </Grid>
                  ) : data?.component?.sAdornType === "TEXT" ? (
                    <Grid item {...data.grid_props}>
                      <Avatar {...data?.component?.sProps}>
                        {data?.component?.sDefaultValue}
                      </Avatar>
                    </Grid>
                  ) : data?.component?.sAdornType === "ICON" ? (
                    <Grid item {...data.grid_props}>
                      <Avatar {...data?.component?.sProps}>
                        {data?.component?.sIcon}
                      </Avatar>
                    </Grid>
                  ) : (
                    <></>
                  );
                }
                case "IMG": {
                  let srcImg = `${baseURL}${data?.data?.sDataSource}`;
                  const sProps = {
                    ...data?.component?.sProps,
                  };

                  const { sx } = sProps;
                  const mappedSx = {
                    width: parseInt(sx.width),
                    height: parseInt(sx.height),
                  };
                  return (
                    <Grid item {...data?.grid_props}>
                      <Box
                        component="img"
                        src={srcImg}
                        alt={data?.component?.sDefaultValue}
                        sx={mappedSx}
                      />
                    </Grid>
                  );
                }
                case "AVATARGROUP": {
                  return (
                    <Grid item {...data.grid_props}>
                      <AvatarGroup {...data?.component?.sProps}>
                        {data?.child?.map((item1, key) => {
                          if (item1?.component?.sType === "AVATAR") {
                            return item1?.component?.sAdornType === "IMG" ? (
                              <Grid item {...item1.grid_props}>
                                <Avatar
                                  alt={item1?.data?.sAction}
                                  src={item1?.data?.sDataSource}
                                  {...item1?.component?.sProps}
                                ></Avatar>
                              </Grid>
                            ) : item1?.component?.sAdornType === "TEXT" ? (
                              <Grid item {...item1.grid_props}>
                                <Avatar {...item1?.component?.sProps}>
                                  {item1?.component?.sDefaultValue}
                                </Avatar>
                              </Grid>
                            ) : item1?.component?.sAdornType === "ICON" ? (
                              <Grid item {...item1.grid_props}>
                                <Avatar {...item1?.component?.sProps}>
                                  {item1?.component?.sIcon}
                                </Avatar>
                              </Grid>
                            ) : (
                              <></>
                            );
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
                case "TAB": {
                  return (
                    <BasicTabs
                      data={data}
                      handledatechange={handledatechange}
                      textValue={textValue}
                      handleTextValue={handleTextValue}
                      error={error}
                    />
                  );
                }
                case "BUTTONGROUP": {
                  console.log(data, "daaat");
                  return (
                    <Grid item {...data.grid_props}>
                      <ButtonGroup
                        id={data?.component?.sName}
                        {...data?.component?.sProps}
                      >
                        {data?.child?.map((item1) => {
                          switch (item1?.component?.sType) {
                            case "BUTTON": {
                              console.log(item1, "iiiiiii");
                              return (
                                <ButtonComponent
                                  data={item1}
                                  onClickvalue={(e) =>
                                    handleclickdata(
                                      e,
                                      item1.component,
                                      item1.data
                                    )
                                  }
                                />
                              );
                            }
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
                        <Icon
                          {...data?.component?.options?.others1}
                          iconName={icon}
                        />
                      </Badge>
                    </Grid>
                  ) : null;
                }
                case "GLOBALTEXT": {
                  return (
                    <Grid item {...data?.grid_props}>
                      <Typography {...data?.component?.sProps}>
                        {getFieldValue(data?.component?.sName)}
                      </Typography>
                    </Grid>
                  );
                }
                case "VARTEXT": {
                  return (
                    <Grid item {...data?.grid_props}>
                      <Typography {...data?.component?.sProps}>
                        {data?.component?.sName}
                      </Typography>
                    </Grid>
                  );
                }
                 

                case "CHIP": {
                  return (
                    <Grid item {...data.grid_props}>
                      {(() => {
                        switch (data?.component?.sAdornType) {
                          case "NONE":
                            return (
                              <Grid item {...data?.component?.grid_props }>
                                <Chip
                                  label={data?.component?.sName}
                                  {...data?.component?.sProps} //rfg 24 apr 23                                  
                                />
                              </Grid>
                            );
                          case "IMG":
                            return (
                              <Grid item {...data?.component?.grid_props}>
                                <Chip
                                  avatar={
                                    <Avatar
                                      alt={data?.data?.sAction}
                                      src={data?.data?.sDataSource}
                                      {...data?.component?.sProps}
                                    />
                                  }
                                  label={data?.component?.sName}
                                />
                              </Grid>
                            );
                          case "ICON":
                            const icon = data?.component?.sIcon?.replace(
                              "Icon",
                              ""
                            );
                            return (
                              <Grid item {...data?.component?.grid_props}>
                                <Chip
                                  icon={<Icon iconName={icon} />}
                                  label={data?.component?.sName}
                                  {...data?.component?.sProps}
                                />
                              </Grid>
                            );
                          case "LINK":
                            const handleClick = (path) => {
                              navigate(path);
                            };
                            return (
                              <Grid item {...data?.component?.grid_props}>
                                <Chip
                                  label={data?.component?.sName}
                                  onClick={() =>
                                    handleClick(
                                      data?.component?.options?.others2
                                    )
                                  }
                                />
                              </Grid>
                            );
                          default:
                            return null;
                        }
                      })()}
                    </Grid>
                  );
                }
                case "LISTITEMS": {
                  return (
                    <Grid item {...data.grid_props}>
                      {(() => {
                        switch (data?.component?.options?.mode) {
                          case "DEFAULT":
                            const dataDefault = data?.data?.sDataSource;
                            return (
                              <DefaultComponent
                                dataDefault={dataDefault}
                                data={data}
                              />
                            );
                          case "AVATAR":
                            const dataAvatar = data?.data?.sDataSource;
                            return (
                              <ListAvatar
                                dataDefault={dataAvatar}
                                data={data}
                              />
                            );
                          case "ICON":
                            // const icon = data?.component?.sIcon?.replace(
                            //   "Icon",
                            //   ""
                            // );
                            const dataIcon = data?.data?.sDataSource;
                            return (
                              <ListIcon dataDefault={dataIcon} data={data} />
                            );
                          case "LISTAVATARICON":
                            const dataIconAvatar = data?.data?.sDataSource;
                            return (
                              <ListAvatarIconItem
                                dataDefault={dataIconAvatar}
                                data={data}
                              />
                            );
                          default:
                            return null;
                        }
                      })()}
                    </Grid>
                  );
                }
                case "DIALOG": {
                  console.log('opt',data)

                  return (
                    <Grid item {...data.grid_props}>
                      {/* <Button variant="outlined" onClick={handleClickOpen}>
                        Open alert dialog
                      </Button> */}
                      <Grid item {...data?.grid_props}>
                      {/* <ButtonComponent
                        data={data}
                        onClickvalue={(e) =>
                          handleclickdata(e, data.component, data.data)
                        }
                       
                      /> */}
                    </Grid>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby={`${data?.component?.sName}-alert-dialog-title`}
                        // aria-labelledby={data?.component?.sName}

                        aria-describedby={`${data?.component?.sName}-alert-dialog-description`}
                        // aria-describedby={data?.component?.sName}
                      >
                        <DialogTitle id={`${data?.component?.sName}-alert-dialog-title`}>
                        {/* <DialogTitle id={data?.component?.sName}> */}

                          {data?.component?.sLabel}
                        </DialogTitle>
                        <DialogContent>
                          {/* <DialogContentText id={`${data?.component?.sName}-alert-dialog-description`}> */}
                          <DialogContentText id={data?.component?.sName}>
                            {data?.component?.sDefaultValue}
                          </DialogContentText>
                          <Grid container rowSpacing={2}> {/* rfg 24 apr 23 */}
                          {data?.child?.map((item1) => {
                            switch (item1?.component?.sType) {
                              case "BUTTON": {
                                return (
                                  <Grid item {...item1?.grid_props}> {/* rfg 24 apr 23 */}
                                  <ButtonComponent
                                    data={item1}
                                    onClickvalue={(e) =>
                                      handleclickdata(
                                        e,
                                        item1.component,
                                        item1.data
                                      )
                                    }
                                  />
                                  </Grid> 
                                );
                              }
                              case "SELECT": //rfg 24 apr 23
                                return (
                                  <Grid
                                    item  {...item1?.grid_props}
                                  >
                                    <SelectMainComponent
                                      data={item1}
                                      {...item1?.component?.sProps}
                                      // summaryId={"summ_tax"}
                                      handledatasend={(e) =>
                                        handleselectOnchange(
                                          e, item1.component?.sName
                                        )
                                      }
                                      taxUrl={item.sRoute}
                                    />
                                  </Grid>
                                );
                              case "TYPOGRAPHY":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <Typography
                                      id={item1?.component?.sName}
                                      {...item1?.component?.sProps}
                                    >
                                      {item1?.component?.sLabel}
                                    </Typography>
                                  </Grid>
                                );
                              case "TEXTFIELD":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <TextField
                                      id={item1?.component?.sName}
                                      label={item1?.component?.sLabel}
                                      placeholder={
                                        item1?.component?.sPlaceHolder
                                      }
                                      defaultValue={
                                        item1?.component?.sDefaultValue
                                      }
                                      variant={item1?.component?.sprops}
                                      type={item1?.component?.sAdornType}
                                      value={
                                        textValue[item1?.component?.sName] || ""
                                      }
                                      name={item1?.component?.sName}
                                      onChange={(e) =>
                                        handleTextValue(
                                          e,
                                          ind,
                                          item1?.validation
                                        )
                                      }
                                      helperText={item1?.component?.sHelper}
                                      error={error}
                                      InputProps={
                                        item1?.component?.sAdornPosition ===
                                        "start"
                                          ? {
                                              startAdornment: (
                                                <>
                                                  {item1?.component
                                                    ?.sAdornPosition &&
                                                    item1?.component
                                                      ?.sAdornType && (
                                                      <InputAdornment
                                                        position={
                                                          item1?.component
                                                            ?.sAdornPosition
                                                        }
                                                      >
                                                        {/*<IconButton>
                                                          <Icon
                                                            iconName={
                                                              item1?.component
                                                                ?.sIcon
                                                            }
                                                          />
                                                          </IconButton>*/}
                                                          <Icon
                                                            iconName={
                                                              item1?.component
                                                                ?.sIcon
                                                            } />
                                                      </InputAdornment>
                                                    )}
                                                </>
                                              ),
                                            }
                                          : {
                                              endAdornment: (
                                                <>
                                                  {item1?.component
                                                    ?.sAdornPosition &&
                                                    item1?.component
                                                      ?.sAdornType && (
                                                      <InputAdornment
                                                        position={
                                                          item1?.component
                                                            ?.sAdornPosition
                                                        }
                                                      >
                                                        <IconButton>
                                                          <Icon
                                                            iconName={
                                                              item1?.component
                                                                ?.sIcon
                                                            }
                                                          />
                                                        </IconButton>
                                                      </InputAdornment>
                                                    )}
                                                </>
                                              ),
                                            }
                                      }
                                      {...item1?.component?.sProps}
                                    />

                                    {error && index == ind && (
                                      <p style={{ color: "red" }}>{error}</p>
                                    )}
                                  </Grid>
                                );

                              case "DATETIME":
                                return (
                                  <Grid item {...item1?.grid_props}>
                                    <DateComponent
                                      data={data}
                                      handledatechange={(e) =>
                                        handledatechange(
                                          e,
                                          item1.component.sName
                                        )
                                      }
                                      datavalue=""
                                      datemod=""
                                      datatextvalue={
                                        textValue &&
                                        textValue[item1.component.sName] !==
                                          undefined &&
                                        textValue[item1.component.sName]
                                      }
                                      formaction={
                                        formData &&
                                        formData?.form &&
                                        formData?.form?.sFormAction
                                      }
                                      {...item1?.component?.sProps}
                                    />
                                  </Grid>
                                );
                              default:
                                return null;
                            }
                          })}
                          </Grid> {/* rfg 24 apr 23 */}
                        </DialogContent>
                      </Dialog>
                    </Grid>
                  );
                }

                default:
                  return null;
              }
            })}
          </Grid>
        );
      })}
    </>
  );
};

export default Form;
