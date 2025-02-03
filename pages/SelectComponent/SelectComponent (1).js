import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { baseURL } from "../../api";
import { FormHelperText } from "@mui/material";

export default function BasicSelect({
  url,
  dataComponent,
  summaryId,
  taxUrl,
  onChildSelect,
  selectTax,
  handledatachange,
  taxUrlFree,
  sColumnID,
  valueTax,
  selectEdit,
  datemod,
  formaction,
}) {
  const [age, setSelect] = React.useState([]);
  const [multiSelectValue, setMultiSelectValue] = React.useState([]);
  const [dataCollection, setDataCollection] = React.useState([]);
  const [taxCollection, setTaxCollection] = React.useState([]);
  const [taxFree, setFree] = React.useState([]);
  const [taxValue, setTaxValue] = React.useState();

  useEffect(() => {
    setTaxValue(valueTax ?? "");
  }, [valueTax]);

  const [selectedOption, setSelectedOption] = useState("");
  const formActionchecked = formaction;

  useEffect(() => {
    setSelectedOption(selectEdit ?? "");
  }, [selectEdit]);

  useEffect(() => {
    if (summaryId === "summ_tax") {
      axios
        .get(`${baseURL}${taxUrl}`)
        .then((result) => {
          setTaxCollection(result?.data?.data);
        })
        .catch((error) => {
          console.log("errrr", error);
        });
    } else if (sColumnID === "col_taxdescription") {
      axios
        .get(`${baseURL}${taxUrlFree}`)
        .then((result) => {
          setFree(result?.data?.data);
        })
        .catch((error) => {
          console.log("errrr", error);
        });
    } else {
      axios
        .get(`${baseURL}${url}`)
        .then((result) => {
          setDataCollection(result?.data?.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  const handleChange = (event) => {
    setSelect(event.target.value);
    handledatachange(event.target.value);
  };
  const handleTax = (event) => {
    onChildSelect(event.target.value);
    setSelectedOption(event.target.value);
  };

  const handleMultiSelect = (event) => {
    const {
      target: { value },
    } = event;

    setMultiSelectValue(typeof value === "string" ? value.split(",") : value);
  };
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl {...dataComponent?.options?.others1}>
        <InputLabel id="demo-simple-select-label">
          {formActionchecked === "EDIT"
            ? datemod === "FREEFORM"
              ? selectedOption
              : dataComponent?.sLabel
            : dataComponent?.sLabel}
        </InputLabel>
        <Select
          multiple={
            dataComponent?.options?.mode === "MULTISELECT" ? true : false
          }
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label={dataComponent?.sLabel}
          value={
            dataComponent?.options?.mode === "MULTISELECT"
              ? multiSelectValue
              : summaryId === "summ_tax"
              ? selectTax
              : age
          }
          defaultValue={dataComponent?.sDefaultValue}
          onChange={
            dataComponent?.options?.mode === "MULTISELECT"
              ? handleMultiSelect
              : summaryId === "summ_tax"
              ? handleTax
              : (e) => handleChange(e)
          }
        >
          <FormHelperText>{dataComponent?.sHelper}</FormHelperText>
          {dataCollection?.map((item) => (
            <MenuItem value={item?.value}>{item?.display}</MenuItem>
          ))}
          {taxCollection?.map((item) => (
            <MenuItem value={item?.value}>{item?.display}</MenuItem>
          ))}
          {taxFree?.map((item) => (
            <MenuItem value={item?.value}>{item?.display}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
