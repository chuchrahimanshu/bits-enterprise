import React, { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Grid, TextField } from "@mui/material";
import {
  DateCalendar,
  DateTimePicker,
  StaticDatePicker,
  StaticDateTimePicker,
  StaticTimePicker,
  TimeClock,
  TimePicker
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect } from "react";

export default function DateComponent({
  data,
  handledatechange,
  datavalue,
  datemod,
  datatextvalue,
  formaction,
  setTextValue
}) {
  const dateformat = (date, sourceFormat = "YYYY-MM-DD", returnFormat) => {
    if (date) {
      const parseDate = (date, format) => {
        const parts = String(date)?.split("-");
        const formatParts = format?.toLowerCase()?.split("-");
        const dateObj = {};

        formatParts?.forEach((part, index) => {
          dateObj[part] = parseInt(parts[index], 10);
        });

        return new Date(dateObj.yyyy, dateObj.mm - 1, dateObj.dd);
      };

      const formatDate = (dateObj, format) => {
        const dd = String(dateObj.getDate()).padStart(2, "0");
        const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
        const yyyy = dateObj.getFullYear();

        switch (format) {
          case "dd-mm-yyyy":
            return `${dd}-${mm}-${yyyy}`;
          case "yyyy-dd-mm":
            return `${yyyy}-${dd}-${mm}`;
          case "yyyy-mm-dd":
            return `${yyyy}-${mm}-${dd}`;
          case "mm-dd-yyyy":
            return `${mm}-${dd}-${yyyy}`;
          default:
            return "Invalid date format pattern";
        }
      };

      // Convert sourceFormat and returnFormat to lowercase
      const parsedDate = parseDate(date, sourceFormat?.toLowerCase());

      if (isNaN(parsedDate)) {
        return "Invalid date";
      }

      return formatDate(parsedDate, returnFormat?.toLowerCase());
    } else {
      return "";
    }
  };

  const handleDate = event => {
    if (!event) return;
    const item_date = `${event.$D}-${event.$M + 1}-${event.$y}`;
    const formatedDate = dateformat(item_date, "DD-MM-YYYY", data?.component?.sSendFormat);
    handledatechange(formatedDate);
  };
  const [dateValue, setDatevalue] = useState(
    dayjs(datavalue ? datavalue : data?.component?.sDefaultValue)
  );

  useEffect(() => {
    if (!datavalue || datavalue === "NaN-NaN-NaN") {
      setTextValue(pre => ({
        ...pre,
        [data?.component?.sName]: dateformat(
          data?.component?.sDefaultValue,
          data?.component?.sSourceFormat,
          data?.component?.sSendFormat
        )
      }));
    }
  })

  useEffect(() => {
    setDatevalue(
      datavalue && datavalue !== undefined
        ? dayjs(
            dateformat(
              datavalue,
              data?.component?.sSourceFormat ,
              data?.component?.options?.others1?.format
            )
          )
        : dayjs(
            dateformat(
              data?.component?.sDefaultValue,
              data?.component?.sSourceFormat,
              data?.component?.options?.others1?.format
            )
          )
    );

    if (!datavalue || datavalue === "NaN-NaN-NaN") {
      setTextValue(pre => ({
        ...pre,
        [data?.component?.sName]: dateformat(
          data?.component?.sDefaultValue,
          data?.component?.sSourceFormat,
          data?.component?.sSendFormat
        )
      }));
    }
    
  }, [datavalue, data]);
  // console.log(data?.component?.sSendFormat =='YYYY-MM-DD','sSendFormat');

  // useEffect(() => {
  //   // console.log('clogDate',data?.component?.sName);

  //   // let elmData1 = document.querySelector('.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input')
  //   // // alert(JSON.stringify(data))
  //   // elmData1.id = data?.component?.sName
  //   // let elmData2 = document.querySelector('.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input')
  //   // // alert(JSON.stringify(data))
  //   // elmData2.id = data?.component?.sName

  // },[data?.component?.sName])
  // function formatDateForInputChange(inputDate, format) {
  //   const date = new Date(inputDate);

  //   if (isNaN(date)) {
  //     return "Invalid date";
  //   }

  //   const options = {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit"
  //   };

  //   const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  //   const [month, day, year] = formattedDate.split("/");

  //   // Make format case-insensitive
  //   const formatLower = format.toLowerCase();

  //   switch (formatLower) {
  //     case "mm-dd-yyyy":
  //       return `${month}-${day}-${year}`;
  //     case "dd-mm-yyyy":
  //       return `${day}-${month}-${year}`;
  //     case "yyyy/mm/dd":
  //       return `${year}/${month}/${day}`;
  //     case "yyyy-mm-dd":
  //       return `${year}-${month}-${day}`;
  //     case "mm/dd/yyyy":
  //       return `${month}/${day}/${year}`;
  //     case "dd/mm/yyyy":
  //       return `${day}/${month}/${year}`;

  //     case "yyyy-dd-mm":
  //       return `${year}-${day}-${month}`;

  //     case "month dd, yyyy":
  //       return new Intl.DateTimeFormat("en-US", {
  //         year: "numeric",
  //         month: "long",
  //         day: "numeric"
  //       }).format(date);
  //     case "dd month yyyy":
  //       return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" })
  //         .format(date)
  //         .replace(",", "")
  //         .split(" ")
  //         .reverse()
  //         .join(" ");
  //     case "short":
  //       return new Intl.DateTimeFormat("en-US").format(date); // Short date format
  //     case "long":
  //       return new Intl.DateTimeFormat("en-US", {
  //         weekday: "long",
  //         year: "numeric",
  //         month: "long",
  //         day: "numeric"
  //       }).format(date);
  //     default:
  //       return "Format not supported";
  //   }
  // }

  return (
    // <Grid container spacing={2}>
    <Grid item position={"relative"}>
        {/* {dateformat(
          data?.component?.sDefaultValue,
          data?.component?.sSourceFormat,
          data?.component?.sSendFormat
        )} */}
        {/* {data?.component?.sDefaultValue} */}
      {/* {data?.component?.sSourceFormat} */}
     {/* {data?.component?.options?.others1?.format} */}
      {/* {data?.component?.sSourceFormat} */}
      {/* <br /> */}

      {/* {JSON.stringify( dateformat(datavalue ,'YYYY-DD-MM', data?.component?.options?.others1?.format))} */}

      <div style={{ overflow: "hidden" }}>
        {/* {datavalue}--
        {dateformat(datavalue , data?.component?.options?.others1?.format)}
        { JSON.stringify(data?.component?.options?.others1?.format)} */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {
            <DemoContainer
              components={[
                "DatePicker",
                "TimePicker",
                "StaticDatePicker",
                "DateCalendar",
                "DateCalendar",
                "StaticTimePicker",
                "TimeClock",
                "DateTimePicker",
                "StaticDateTimePicker"
              ]}
            >
              {data?.component?.options?.mode === "DATE" &&
              data?.component?.options?.submode === "DatePicker" ? (
                <>
                  {/* { data?.component?.sHelper} */}
                  {formaction == undefined || formaction != "EDIT" ? (
                    <>
                      {/* {data?.component?.sName} */}
                      <DatePicker
                        id={data?.component?.sName}
                        // value={datavalue}
                        name={data?.component?.sName}
                        {...data?.component?.options?.others1}
                        {...data?.component?.options?.others2}
                        {...data?.component?.options?.others3}
                        slotProps={{
                          textField: {
                            helperText: data?.component?.sHelper,
                            id: data?.component?.sName
                          }
                        }}
                        label={data?.component?.sLabel}
                        // defaultValue={pselectDate}
                        value={dayjs(dateValue)}
                        onChange={e => handleDate(e)}
                        //  format={data?.component?.sSendFormat}
                        {...data?.component?.options?.others1}
                        {...data?.component?.options?.others2}
                        {...data?.component?.options?.others3}
                        {...data?.component?.sProps}
                        // slots={{
                        //   textField: params => {

                        //     return (
                        //       <>
                        //           <TextField {...params} id={data?.component?.sName} />
                        //       </>
                        //     );
                        //   }
                        // }}
                      />
                    </>
                  ) : null}

                  {formaction === "EDIT" &&
                  datavalue &&
                  datemod === "FREEFORM" &&
                  datavalue !== undefined ? (
                    <>
                      <DatePicker
                        id={data?.component?.sName}
                        label={data?.component?.sLabel}
                        defaultValue={dayjs(datavalue)}
                        onChange={e => handleDate(e)}
                        slotProps={{
                          textField: {
                            helperText: data?.component?.sHelper,
                            id: data?.component?.sName
                          }
                        }}
                        slots={{
                          textField: params => <TextField {...params} id={data?.component?.sName} />
                        }}
                        {...data?.component?.options?.others1}
                        {...data?.component?.options?.others2}
                        {...data?.component?.options?.others3}
                        {...data?.component?.sProps}
                      />
                    </>
                  ) : formaction === "EDIT" &&
                    datavalue &&
                    datemod === "DEFAULT" &&
                    datavalue !== undefined ? (
                    <>
                      <DatePicker
                        id={data?.component?.sName}
                        label={data?.component?.sLabel}
                        defaultValue={dayjs(datavalue)}
                        onChange={e => handleDate(e)}
                        slotProps={{
                          textField: {
                            helperText: data?.component?.sHelper,
                            id: data?.component?.sName
                          }
                        }}
                        slots={{
                          textField: params => <TextField {...params} id={data?.component?.sName} />
                        }}
                        {...data?.component?.options?.others1}
                        {...data?.component?.options?.others2}
                        {...data?.component?.options?.others3}
                        {...data?.component?.sProps}
                      />
                    </>
                  ) : (
                    formaction === "EDIT" && (
                      // datatextvalue &&
                      // datatextvalue !== "checked" &&
                      <>
                        <DatePicker
                          id={data?.component?.sName}
                          name={data?.component?.sName}
                          {...data?.component?.options?.others1}
                          {...data?.component?.options?.others2}
                          {...data?.component?.options?.others3}
                          slotProps={{
                            textField: {
                              helperText: data?.component?.sHelper,
                              id: data?.component?.sName
                            }
                          }}
                          label={data?.component?.sLabel}
                          value={dayjs(dateValue)}
                          onChange={e => handleDate(e)}
                          // defaultValue={dayjs(datatextvalue)}
                          
                          // slots={{
                          //   textField: params => (
                          //     <TextField {...params} id={data?.component?.sName} />
                          //   )
                          // }}
                          {...data?.component?.options?.others1}
                          {...data?.component?.options?.others2}
                          {...data?.component?.options?.others3}
                          {...data?.component?.sProps}
                        />
                      </>
                    )
                  )}
                </>
              ) : data?.component?.options?.mode === "DATE" &&
                data?.component?.options?.submode === "StaticDatePicker" ? (
                <StaticDatePicker
                  id={data?.component?.sName}
                  label={data?.component?.sLabel}
                  defaultValue={data?.component?.sDefaultValue}
                  onChange={e => handleDate(e)}
                  slotProps={{
                    textField: {
                      helperText: data?.component?.sHelper,
                      id: data?.component?.sName
                    }
                  }}
                  {...data?.component?.options?.others1}
                  {...data?.component?.options?.others3}
                  {...data?.component?.options?.others2}
                  {...data?.component?.sProps}
                />
              ) : data?.component?.options?.mode === "DATE" &&
                data?.component?.options?.submode === "DateCalendar" ? (
                <DateCalendar
                  label={data?.component?.sLabel}
                  //   defaultValue={data?.component?.sDefaultValue}
                  slotProps={{
                    textField: {
                      helperText: data?.component?.sHelper
                    }
                  }}
                  onChange={e => handleDate(e)}
                  {...data?.component?.options?.others1}
                  {...data?.component?.options?.others3}
                  {...data?.component?.options?.others2}
                  {...data?.component?.sProps}
                />
              ) : data?.component?.options?.mode === "TIME" &&
                data?.component?.options?.submode === "TimePicker" ? (
                <TimePicker
                  label={data?.component?.sLabel}
                  //   defaultValue={dayjs(data?.component?.sDefaultValue)}
                  slotProps={{
                    textField: {
                      helperText: data?.component?.sHelper
                    }
                  }}
                  onChange={e => handleDate(e)}
                  {...data?.component?.options?.others2}
                  {...data?.component?.options?.others1}
                  {...data?.component?.options?.others3}
                  {...data?.component?.sProps}
                />
              ) : data?.component?.options?.mode === "TIME" &&
                data?.component?.options?.submode === "StaticTimePicker" ? (
                <StaticTimePicker
                  label={data?.component?.sLabel}
                  //   defaultValue={dayjs(data?.component?.sDefaultValue)}
                  slotProps={{
                    textField: {
                      helperText: data?.component?.sHelper
                    }
                  }}
                  onChange={e => handleDate(e)}
                  {...data?.component?.options?.others1}
                  {...data?.component?.options?.others3}
                  {...data?.component?.options?.others2}
                  {...data?.component?.sProps}
                />
              ) : data?.component?.options?.mode === "TIME" &&
                data?.component?.options?.submode === "TimeClock" ? (
                <TimeClock
                  label={data?.component?.sLabel}
                  {...data?.component?.options?.others1}
                  {...data?.component?.options?.others3}
                  {...data?.component?.options?.others2}
                  defaultValue={dayjs(data?.component?.sDefaultValue)}
                  onChange={e => handleDate(e)}
                  slotProps={{
                    textField: {
                      helperText: data?.component?.sHelper
                    }
                  }}
                  {...data?.component?.sProps}
                />
              ) : data?.component?.options?.mode === "DATETIME" &&
                data?.component?.options?.submode === "DateTimePicker" ? (
                <DateTimePicker
                  label={data?.component?.sLabel}
                  id={data?.component?.sName}
                  //   defaultValue={dayjs(data?.component?.sDefaultValue)}
                  slotProps={{
                    textField: {
                      helperText: data?.component?.sHelper
                    }
                  }}
                  onChange={e => handleDate(e)}
                  {...data?.component?.options?.others1}
                  {...data?.component?.options?.others3}
                  {...data?.component?.options?.others2}
                  {...data?.component?.sProps}
                />
              ) : data?.component?.options?.mode === "DATETIME" &&
                data?.component?.options?.submode === "StaticDateTimePicker" ? (
                <StaticDateTimePicker
                  label={data?.component?.sLabel}
                  defaultValue={dayjs(data?.component?.sDefaultValue)}
                  slotProps={{
                    textField: {
                      helperText: data?.component?.sHelper
                    }
                  }}
                  onChange={e => handleDate(e)}
                  {...data?.component?.options?.others1}
                  {...data?.component?.options?.others3}
                  {...data?.component?.options?.others2}
                  {...data?.component?.sProps}
                />
              ) : null}
            </DemoContainer>
          }
        </LocalizationProvider>
        {/* // </Grid> */}
      </div>
    </Grid>
  );
}
