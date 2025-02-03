import React, { useEffect, useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Grid } from "@mui/material";
import {
  DateCalendar,
  DateTimePicker,
  StaticDatePicker,
  StaticDateTimePicker,
  StaticTimePicker,
  TimeClock,
  TimePicker,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";

export default function DateComponent({
  data,
  handledatechange,
  datavalue,
  datemod,
  datatextvalue,
  formaction,
}) 
{
  const handleDate = (event) => {
    const item_date = `${event.$D}-${event.$M+1}-${event.$y}`;
    handledatechange(item_date);
    

  };
  
  return (
    <Grid container spacing={2}>
      <Grid item>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {
          (
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
                  "StaticDateTimePicker",
                ]}
              >
                {data?.component?.options?.mode === "DATE" &&
                data?.component?.options?.submode === "DatePicker" ? (
                  <>
                    {formaction == undefined ||formaction == "" || formaction == "ADD" ? (
                      <DatePicker
                        label={data?.component?.sLabel}
                        defaultValue={dayjs(data?.component?.sDefaultValue)}
                        format="DD-MM-YYYY"
                        onChange={(e) => handleDate(e)}
                        slotProps={{
                          textField: {
                            helperText: data?.component?.sHelper,
                            size: 'small' // rfg 24 apr 23*
                          },
                        }}
                        {...data?.component?.options?.others1}
                        //{...data?.component?.sProps}
                      />
                    ) : null}
                    {formaction === "EDIT" &&
                    datavalue &&
                    datemod === "FREEFORM" &&
                    datavalue !== undefined ? (
                      <DatePicker
                        label={data?.component?.sLabel}
                        defaultValue={dayjs(datavalue)}
                        format="DD-MM-YYYY"
                        onChange={(e) => handleDate(e)}
                        slotProps={{
                          textField: {
                            helperText: data?.component?.sHelper,
                          },
                        }}
                        {...data?.component?.options?.others1}
                        {...data?.component?.sProps}
                      />
                    ) : formaction === "EDIT" &&
                      datavalue &&
                      datemod === "DEFAULT" &&
                      datavalue !== undefined ? (
                      <DatePicker
                        label={data?.component?.sLabel}
                        defaultValue={dayjs(datavalue)}
                        format="DD-MM-YYYY"
                        onChange={(e) => handleDate(e)}
                        slotProps={{
                          textField: {
                            helperText: data?.component?.sHelper,
                          },
                        }}
                        {...data?.component?.options?.others1}
                        {...data?.component?.sProps}
                      />
                    ) : (
                      formaction === "EDIT" &&
                      datatextvalue &&
                      datatextvalue !== undefined && (
                        <DatePicker
                          label={data?.component?.sLabel}
                          defaultValue={dayjs(datatextvalue)}
                          format="DD-MM-YYYY"
                          onChange={(e) => handleDate(e)}
                          slotProps={{
                            textField: {
                              helperText: data?.component?.sHelper,
                            },
                          }}
                          {...data?.component?.options?.others1}
                          {...data?.component?.sProps}
                        />
                      )
                    )}
                  </>
                ) : data?.component?.options?.mode === "DATE" &&
                  data?.component?.options?.submode === "StaticDatePicker" ? (
                  <StaticDatePicker
                    label={data?.component?.sLabel}
                    defaultValue={data?.component?.sDefaultValue}
                    slotProps={{
                      textField: {
                        helperText: data?.component?.sHelper,
                      },
                    }}
                    {...data?.component?.options?.others1}
                    // open={data?.component?.options?.others3}
                    //   value={data?.component?.options?.others2}
                    {...data?.component?.sProps}
                  />
                ) : data?.component?.options?.mode === "DATE" &&
                  data?.component?.options?.submode === "DateCalendar" ? (
                  <DateCalendar
                    label={data?.component?.sLabel}
                    //   defaultValue={data?.component?.sDefaultValue}
                    slotProps={{
                      textField: {
                        helperText: data?.component?.sHelper,
                      },
                    }}
                    {...data?.component?.options?.others1}
                    // open={data?.component?.options?.others3}
                    //   value={data?.component?.options?.others2}
                    {...data?.component?.sProps}
                  />
                ) : data?.component?.options?.mode === "TIME" &&
                  data?.component?.options?.submode === "TimePicker" ? (
                  <TimePicker
                    label={data?.component?.sLabel}
                    //   defaultValue={dayjs(data?.component?.sDefaultValue)}
                    slotProps={{
                      textField: {
                        helperText: data?.component?.sHelper,
                      },
                    }}
                    //   views={[data?.component?.options?.others2]}
                    {...data?.component?.options?.others1}
                    // open={data?.component?.options?.others3}
                    // value={data?.component?.options?.others2}
                    {...data?.component?.sProps}
                  />
                ) : data?.component?.options?.mode === "TIME" &&
                  data?.component?.options?.submode === "StaticTimePicker" ? (
                  <StaticTimePicker
                    label={data?.component?.sLabel}
                    //   defaultValue={dayjs(data?.component?.sDefaultValue)}
                    slotProps={{
                      textField: {
                        helperText: data?.component?.sHelper,
                      },
                    }}
                    //   views={[data?.component?.options?.others2]}
                    {...data?.component?.options?.others1}
                    // open={data?.component?.options?.others3}
                    // value={data?.component?.options?.others2}
                    {...data?.component?.sProps}
                  />
                ) : data?.component?.options?.mode === "TIME" &&
                  data?.component?.options?.submode === "TimeClock" ? (
                  <TimeClock
                    label={data?.component?.sLabel}
                    {...data?.component?.options?.others1}
                    //   open={data?.component?.options?.others3}
                    //     value={data?.component?.options?.others2}
                    defaultValue={dayjs(data?.component?.sDefaultValue)}
                    slotProps={{
                      textField: {
                        helperText: data?.component?.sHelper,
                      },
                    }}
                    {...data?.component?.sProps}
                  />
                ) : data?.component?.options?.mode === "DATETIME" &&
                  data?.component?.options?.submode === "DateTimePicker" ? (
                  <DateTimePicker
                    label={data?.component?.sLabel}
                    //   defaultValue={dayjs(data?.component?.sDefaultValue)}
                    slotProps={{
                      textField: {
                        helperText: data?.component?.sHelper,
                      },
                    }}
                    //   views={[data?.component?.options?.others2]}
                    {...data?.component?.options?.others1}
                    // open={data?.component?.options?.others3}
                    // value={data?.component?.options?.others2}
                    {...data?.component?.sProps}
                  />
                ) : data?.component?.options?.mode === "DATETIME" &&
                  data?.component?.options?.submode ===
                    "StaticDateTimePicker" ? (
                  <StaticDateTimePicker
                    label={data?.component?.sLabel}
                    defaultValue={dayjs(data?.component?.sDefaultValue)}
                    slotProps={{
                      textField: {
                        helperText: data?.component?.sHelper,
                      },
                    }}
                    //   views={[data?.component?.options?.others2]}
                    {...data?.component?.options?.others1}
                    // open={data?.component?.options?.others3}
                    // value={data?.component?.options?.others2}
                    {...data?.component?.sProps}
                  />
                ) : null}
              </DemoContainer>
            )}
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
}
