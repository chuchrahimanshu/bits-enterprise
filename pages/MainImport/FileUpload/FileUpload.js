import React, { useState } from "react";
import { Box, Typography, Button, Paper, Divider } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { Radio, RadioGroup, FormControlLabel, FormControl, Grid } from "@mui/material";
import { assetsURL, baseURL } from "../../../api";
import { Link, useLocation } from "react-router-dom";
import { Global_Data } from "../../../globalData/GlobalData";
import axios from "axios";

const FileUpload = ({
  record,
  setRecord,
  fileName,
  setFileName,
  base64File,
  setBase64File,
  csvContent,
  setCsvContent
}) => {
  const [fileInputKey] = useState(Date.now());
  const formname = useLocation();
  const urlParams = new URLSearchParams(formname.search);
  const titleParam = urlParams.get("title");
  const tableParam = urlParams.get("table");
  const returnParam = urlParams.get("return");
  const { token } = Global_Data();
  const handleRecordChange = event => {
    setRecord(event.target.value);
  };



  // const downloadURI = `${baseURL}/import/sample/acc_coa.csv`;
  const downloadCsV = async () => {
    try {
      // alert('dd')
      const response = await axios.get(`${baseURL}/import/sample/${tableParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const csvContent = textToCsv(response.data);
  
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${tableParam}.csv`;
      link.click();
    } catch (error) {
      console.error(error);
    }
  };
  
  const textToCsv = (inputText) => {
    const lines = inputText.split('\n');
    const header = lines[0].split(',').map(item => item.trim()); // Fix here
    const data = lines.slice(1).map(line => line.split(',').map(item => item.trim())); // Fix here
    const csvContent = [header.join(',')].concat(data.map(row => row.join(','))).join('\n');
    return csvContent;
  };
  
  // Example usage:
  // downloadCsv();
  
  function splitCSVIgnoringCommasInQuotes(input) {
    // // const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
    // // let match;
    // //     do {
    //   //     match = regex.exec(input);
    //   //     if (match) {
    //     //         result.push(match[1].replace(/"/g, ""));  
    //     //     }
    //     //     else 
    //     //       result.push(input)
    //     // } while (match);
    // const result = [];
    // const match = input.split(",");
    // for (let j = 0; j < match.length; j++) {
    //   result.push(match[j].replace(/"/g, "")); 
    // }
    // console.log("kkklfjklajfllwejlwf", result)
    // return result;
    if(!input){
      return "";
    } 
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    if (current) {
        result.push(current);
    }
    return result.map(field => field.trim().replace(/^"|"$/g, ''));
}


  function parseCSV(csv) {
  
    const lines = csv.split("\n");
    const headers = splitCSVIgnoringCommasInQuotes(lines[0]);
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const line = splitCSVIgnoringCommasInQuotes(lines[i]);
      // if (line.length === headers.length) {
      if(line){
        const row = {};
        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = String(line[j]).trim();
        }
        data.push(row);
      }
      // }
    }
    setCsvContent(data);
  }

  // const handleFileChange = event => {
  //   const file = event.target.files[0] ;
  //   if (file.size <= 5 * 1024 * 1024) {
  //     handleFileUpload(file);
  //     if (file) {
  //       setFileName(file.name);
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         const base64 = reader.result;
  //         setBase64File(base64);
  //       };
  //       reader.readAsDataURL(file);
  //     } else {
  //       console.log("File size exceeds 5MB. Please select a smaller file.");
  //       event.target.value = null;
  //     }
  //   }
  // };

  // const handleDrop = event => {
  //   console.log(event.dataTransfer.files);
  //   // const file = event.target.files[0];
  //   const file = Array.from(event.dataTransfer.files);
  //   if (file.size <= 5 * 1024 * 1024) {
  //     handleFileUpload(event);
  //     if (file) {
  //       setFileName(file.name);
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         const base64 = reader.result;
  //         setBase64File(base64);
  //       };
  //       reader.readAsDataURL(file);
  //     } else {
  //       console.log("File size exceeds 5MB. Please select a smaller file.");
  //       event.target.value = null;
  //     }
  //   }
  // };

  const handleFileChange = event => {
    const file = event.target.files[0];

    if (!file) {
      // No file selected
      return;
    }

    const allowedExtensions = ["csv"];

    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      event.target.value = null;
      return;
    }

    if (file.size <= 5 * 1024 * 1024) {
      handleFileUpload(file);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        setBase64File(base64);
      };
      reader.readAsDataURL(file);
    } else {
      event.target.value = null;
    }
  };

  const handleDrop = event => {
    event.preventDefault();
    // setIsDragActive(false);

    const dt = event.dataTransfer;
    if (dt.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < dt.items.length; i++) {
        if (dt.items[i].kind === "file") {
          const file = dt.items[i].getAsFile();
          if (file.size <= 5 * 1024 * 1024) {
            if (!file) {
              // No file selected
              return;
            }

            const allowedExtensions = ["csv"];

            const fileExtension = file.name.split(".").pop().toLowerCase();

            if (!allowedExtensions.includes(fileExtension)) {
           
              event.target.value = null;
              return;
            }
            handleDroppedFile(file);
            handleFileUpload(file);
          
            // parseCSV(file);
          } 
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < dt.files.length; i++) {
        const file = dt.files[i];

        if (!file) {
          // No file selected
          return;
        }

        const allowedExtensions = ["csv"];

        const fileExtension = file.name.split(".").pop().toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          
          event.target.value = null;
          return;
        }
        if (file.size <= 5 * 1024 * 1024) {
          handleDroppedFile(file);
          handleFileUpload(file);
        } 
      }
    }
  };

  const handleDroppedFile = file => {
    // Handle the dropped file, similar to the logic in handleFileChange
    
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = e => {
      // parseCSV(contents);
      const base64 = reader.result;
     
      setBase64File(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  const clearFile = () => {
    setBase64File(null);
    setCsvContent(null);
  };

  function handleFileUpload(file) {
    // const file = event.target.files[0];
   
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const contents = e.target.result;

       
        parseCSV(contents);
      };
      reader.readAsText(file);
    }
  }

  return (
    <Box marginTop={"20px"}>
      <Box display="flex" flexDirection="column" alignItems="center">
        {base64File ? (
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="body1" gutterBottom>
                File Selected: {fileName}
              </Typography>

              <Button variant="contained" onClick={clearFile} color="primary">
                Clear
              </Button>
            </Box>
            <Divider />
          </Paper>
        ) : (
          <Paper
            elevation={3}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{ cursor: "pointer" }}
          >
            <label htmlFor="fileInput">
              <Box width={500} height={140}>
                <Box p={2} display="flex" flexDirection="column" alignItems="center">
                  <CloudUploadIcon fontSize="large" />
                  <Typography variant="body1" gutterBottom>
                    Click or drag to file
                  </Typography>
                  <input
                    type="file"
                    id="fileInput"
                    key={fileInputKey}
                    accept=".csv"
                    maxLength={"5mb"}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <Typography variant="body2" color="primary" component="span">
                    Select a file
                  </Typography>
                  <Typography variant="body2" className="pt-3" component="span">
                    (CSV file, max file size of 5MB)
                  </Typography>
                </Box>
              </Box>
            </label>
          </Paper>
        )}
      </Box>

      <Box sx={{ mt: "40px",display:'flex',justifyContent:"center" }} className=" text-center text-primary m-4">
        <Typography component={'p'} onClick={()=>downloadCsV()} className=" text-center cursor-poniter text-primary ">
          Download sample file
        </Typography>
      </Box>

      <Grid container justifyContent="center" gap={5}>
        <Grid item>
          <Typography sx={{ marginTop: "5px" }} variant="p" component={"p"}>
            Record Handling:
          </Typography>
        </Grid>
        <Grid item>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="Overwrite"
              name="Overwrite"
              value={record}
              onChange={handleRecordChange}
            >
              <FormControlLabel
                value="Overwrite"
                control={<Radio />}
                label=" Overwrite existing records"
              />
              <Typography sx={{ marginLeft: "30px" }} variant="p" component={"p"}>
                Existing records with same ID or control number will be overwritten
              </Typography>
              <FormControlLabel value="Skip" control={<Radio />} label="Skip Duplicates" />
              <Typography sx={{ marginLeft: "30px" }} variant="p" component={"p"}>
                Duplicate records will be skipped and their values will be retained
              </Typography>
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FileUpload;
