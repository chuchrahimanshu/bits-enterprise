import React, { useEffect, useState } from "react";
import { Stepper, Step, StepLabel, Button, Grid, Box, Typography, Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload/FileUpload";
import Previewtable from "./Previewtable.js/Previewtable";
import CustomMapping from "./CustomMapping/CustomMapping";
import Results from "./Results/Results";
import axios from "axios";
import { baseURL } from "../../api";
import { Global_Data } from "../../globalData/GlobalData";
import CircularProgress from "@mui/material/CircularProgress";
import Spinner from "../../component/spinner/Spinner";
const steps = ["Upload File", "Custom Mapping", "Preview", "Results"];

function MainImport() {
  const navigate = useNavigate();
  const formname = useLocation();
  const urlParams = new URLSearchParams(formname.search);
  const titleParam = urlParams.get("title");
  const tableParam = urlParams.get("table");
  const returnParam = urlParams.get("return");
  const { token, isPageLoading } = Global_Data();
  const [activeStep, setActiveStep] = useState(0);
  const [base64File, setBase64File] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [csvContent, setCsvContent] = useState(null);
  const [fromFeilds, setFromFeilds] = useState([]);
  const [record, setRecord] = useState("Overwrite");
  const [fileName, setFileName] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState({ error: false });
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Replace 'yourApiEndpoint' with the actual API endpoint URL
    const config = {
      headers: {
        Authorization: `Bearer ${token}` // Replace with your actual token
      }
    };

    axios
      .get(`${baseURL}/import/fields/${tableParam}`, config)
      .then(response => {
        const apiData = response.data.data.fields?.sort((a, b) => a.iImportOrder - b.iImportOrder);
        // Combine the sFieldName values into an object for initial values
        const initialFormValues = {};
        apiData?.forEach(item => {
          initialFormValues[item.sFieldName] = ""; // You can set a default value here if needed
        });

        // Set the initial form values
        setFormData(initialFormValues);
        setFromFeilds(apiData);
      })
      .catch(error => {
        console.error("Error fetching API data:", error);
      });
  }, []);

  const requiredFeilds = fromFeilds
    .filter(elm => elm.bRequired === "Yes")
    ?.map(elm => elm.sFieldName);

  const handleNext = () => {
    if (activeStep == 1) {
      const isValid = validateFormData(formData, requiredFeilds);
      if (isValid) {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
      } else {
        return;
      }
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleCancelBtn = () => {
    navigate(`/form/get/${returnParam}`);
  };

  const customStylesBtn = {
    backgroundColor: "#e3e6e4",
    color: "black"
  };

  // const payload = {
  //   metadata: {
  //     sFileName: fileName,
  //     sFile: base64File,
  //     sOption: record
  //   },
  //   data: [
  //     {
  //       mapping: Object.keys(formData)?.map(key => ({
  //         sFieldName: key,
  //         sMapping: formData[key]
  //       }))
  //     }
  //   ]
  // };

  // const initialValues = {};

  // fromFeilds.forEach((label) => {
  //   const fieldName = label.sFieldName;

  //   if (!(fieldName in formData)) {
  //     initialValues[fieldName] = ""; // Set to an empty string.
  //   }
  // });

  // // Add the default value mapping to payload
  // payload.data[0].mapping.push({
  //   sFieldName: Object.keys(initialValues).join(', '), // You can adjust this as needed
  //   sMapping: Object.values(initialValues).join(', ') // You can adjust this as needed
  // });

  const payload = {
    metadata: {
      sTableName: tableParam,
      sFileName: fileName,
      sFile: base64File,
      sOption: record
    },
    data: {
      mapping: Object.keys(formData)?.map(key => ({
        sFieldName: key,
        sMapping: formData[key].trim()
      }))
    }
  };

  const initialValues = {};

  fromFeilds.forEach(label => {
    const fieldName = label.sFieldName;

    if (!(fieldName in formData)) {
      initialValues[fieldName] = ""; // Set to an empty string.
    }
  });

  // // Add the default value mapping to payload
  // payload.data.mapping.push({
  //   sFieldName: Object.keys(initialValues).join(', '), // You can adjust this as needed
  //   sMapping: Object.values(initialValues).join(', ') // You can adjust this as needed
  // });

  // Now payload.data is an object with a mapping property
  // You can access it like this: payload.data.mapping

  function handlePostData() {
    setIsLoading(true);
    axios
      .post(`${baseURL}/import/record`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        setIsLoading(false);
        handleNext();
        setResultData(response.data.data);
      })
      .catch(error => setIsLoading(false));
  }

  const downloadTxtFile = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const formattedDate = `${year}/${month}/${day}-${hours}:${minutes}`;
    const fileName = `${titleParam}-${formattedDate}.txt`;

    const dataAsString = JSON.stringify(resultData.unprocessed, null, 2);
    const blob = new Blob([dataAsString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    // window.open(`file:///C:/Users/devel/Downloads/${fileName}`, '_blank')
    // URL.revokeObjectURL(url);
  };

  // fromFeilds.map((label, index) => )

  // console.log(initialValues,122);
  function validateFormData(formData, reqData) {
    let hasError = false;
    let errorFields = [];

    for (const key of reqData) {
      if (!(key in formData) || formData[key] === "None" || formData[key] === "") {
        hasError = true;
        errorFields.push(key);
      }
    }

    if (hasError) {
      setError({ error: true, errorFields });
      // clearErrorTime();
      return false;
    }

    setError({ error: false });
    return true;
  }

  // console.log(error);
  // console.log(formData);
  // return !isPageLoading ? (
  //   <>
  //     <div style={{ height: "100vh" }}>
  //       <div style={{ position: "relative" }}>
  //         {/* {JSON.stringify(payload)} */}
  //         <Box className="border shadow p-3 " style={{ position: "fixded", top: "90px" }}>
  //           <Typography className="text-center " variant="h4" component="h4">
  //             <Typography className="text-center pb-4" variant="h4" component="h4">
  //               Import - {titleParam}
  //             </Typography>
  //             <Container>
  //               <Stepper activeStep={activeStep} alternativeLabel>
  //                 {steps.map((label, index) => (
  //                   <Step key={label}>
  //                     <StepLabel>{label}</StepLabel>
  //                   </Step>
  //                 ))}
  //               </Stepper>
  //               {/* 
  //               <div>CG
  //               {activeStep === steps.length ? (
  //                   <div>
  //                   <Typography>All steps completed - you're finished</Typography>
  //                 </div>
  //               ) : (
  //                   <div>
  //                   <Typography>{getStepContent(activeStep)}</Typography>
  //                   <div>
  //                     <Button disabled={activeStep === 0} onClick={handleBack}>
  //                       Back
  //                     </Button>
  //                     <Button variant="contained" color="primary" onClick={handleNext}>
  //                       {activeStep === steps.length - 1 ? "Finish" : "Next"}
  //                     </Button>
  //                   </div>
  //                 </div>
  //               )}
  //             </div> */}
  //             </Container>
  //           </Typography>
  //         </Box>
  //         <div style={{ height: "53vh", overflow: "scroll" }}>
  //           {activeStep === 0 && (
  //             <FileUpload
  //               titleParam={titleParam}
  //               record={record}
  //               fileName={fileName}
  //               setFileName={setFileName}
  //               setRecord={setRecord}
  //               base64File={base64File}
  //               setBase64File={setBase64File}
  //               setCsvContent={setCsvContent}
  //               csvContent={csvContent}
  //             />
  //           )}
  //           {activeStep === 1 && (
  //             <CustomMapping
  //               formData={formData}
  //               error={error}
  //               setFormData={setFormData}
  //               csvContent={csvContent}
  //               fromFeilds={fromFeilds}
  //             />
  //           )}
  //           {activeStep === 2 && (
  //             <Previewtable fromFeilds={fromFeilds} formData={formData} csvContent={csvContent} />
  //           )}
  //           {activeStep === 3 && (
  //             <Results downloadTxtFile={downloadTxtFile} resultData={resultData.stats} />
  //           )}
  //         </div>
  //         <Box
  //           className="border shadow p-3"
  //           style={{
  //             position: "sticky",
  //             position: " -webkit-sticky",
  //             width: "100%",

  //             backgroundColor: "white",
  //             paddingTop: "8px",
  //             zIndex: 998
  //           }}
  //         >
  //           <Grid container justifyContent="space-between">
  //             <Grid item>
  //               {activeStep < 3 && (
  //                 <>
  //                   {activeStep > 0 && (
  //                     <Button
  //                       variant="contained"
  //                       sx={{ marginRight: "10px" }}
  //                       onClick={handleBack}
  //                       color="primary"
  //                     >
  //                       {"<"} PREVIOUS
  //                     </Button>
  //                   )}
  //                   {activeStep === 2 ? (
  //                     <Button variant="contained" onClick={handlePostData} color="primary">
  //                       Import
  //                     </Button>
  //                   ) : (
  //                     <Button
  //                       variant="contained"
  //                       onClick={handleNext}
  //                       disabled={!csvContent}
  //                       color="primary"
  //                     >
  //                       Next {activeStep > 0 && ">"}
  //                     </Button>
  //                   )}
  //                 </>
  //               )}
  //             </Grid>
  //             <Grid item>
  //               {activeStep === 3 ? (
  //                 <Button variant="contained" onClick={handleCancelBtn} color="primary">
  //                   OK
  //                 </Button>
  //               ) : (
  //                 <Button onClick={handleCancelBtn} style={customStylesBtn}>
  //                   Cancel
  //                 </Button>
  //               )}
  //             </Grid>
  //           </Grid>
  //         </Box>
  //       </div>
  //       {isLoading && (
  //         <Box
  //           sx={{
  //             position: "absolute",
  //             top: "0%",
  //             left: "0",
  //             backgroundColor: "rgba(236, 235, 226, .5)",
  //             height: "100vh",
  //             width: "100vw",
  //             zIndex: "999999999999999",
  //             display: "flex",
  //             justifyContent: "center",
  //             alignItems: "center",
  //             flexDirection: "column"
  //           }}
  //         >
  //           <CircularProgress />
  //           <Typography>Importing Records</Typography>
  //         </Box>
  //       )}
  //     </div>
  //   </>
  // ) : (
  //   <div
  //     style={{
  //       height: "75vh",
  //       width: "80vw",
  //       display: "flex",
  //       justifyContent: "center",
  //       alignItems: "center"
  //     }}
  //   >
  //     <div>
  //       <Spinner />
  //     </div>
  //   </div>
  // );
  return(
    <>
     <div style={{ height: "100vh" }}>
        <div style={{ position: "relative" }}>
          {/* {JSON.stringify(payload)} */}
          <Box className="border shadow p-3 " style={{ position: "fixded", top: "90px" }}>
            <Typography className="text-center " variant="h4" component="h4">
              <Typography className="text-center pb-4" variant="h4" component="h4">
                Import - {titleParam}
              </Typography>
              <Container>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                {/* 
                <div>CG
                {activeStep === steps.length ? (
                    <div>
                    <Typography>All steps completed - you're finished</Typography>
                  </div>
                ) : (
                    <div>
                    <Typography>{getStepContent(activeStep)}</Typography>
                    <div>
                      <Button disabled={activeStep === 0} onClick={handleBack}>
                        Back
                      </Button>
                      <Button variant="contained" color="primary" onClick={handleNext}>
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    </div>
                  </div>
                )}
              </div> */}
              </Container>
            </Typography>
          </Box>
          {/* {JSON.stringify(csvContent)} */}
          <div style={{ height: "53vh", overflow: "scroll" }}>
            {activeStep === 0 && (
              <FileUpload
                titleParam={titleParam}
                record={record}
                fileName={fileName}
                setFileName={setFileName}
                setRecord={setRecord}
                base64File={base64File}
                setBase64File={setBase64File}
                setCsvContent={setCsvContent}
                csvContent={csvContent}
              />
            )}
            {activeStep === 1 && (
              <CustomMapping
                formData={formData}
                error={error}
                setFormData={setFormData}
                csvContent={csvContent}
                fromFeilds={fromFeilds}
              />
            )}
            {activeStep === 2 && (
              <Previewtable fromFeilds={fromFeilds} formData={formData} csvContent={csvContent} />
            )}
            {activeStep === 3 && (
              <Results downloadTxtFile={downloadTxtFile} resultData={resultData.stats} />
            )}
          </div>
          <Box
            className="border shadow p-3"
            style={{
              position: "sticky",
              position: " -webkit-sticky",
              width: "100%",

              backgroundColor: "white",
              paddingTop: "8px",
              zIndex: 998
            }}
          >
            <Grid container justifyContent="space-between">
              <Grid item>
                {activeStep < 3 && (
                  <>
                    {activeStep > 0 && (
                      <Button
                        variant="contained"
                        sx={{ marginRight: "10px" }}
                        onClick={handleBack}
                        color="primary"
                      >
                        {"<"} PREVIOUS
                      </Button>
                    )}
                    {activeStep === 2 ? (
                      <Button variant="contained" onClick={handlePostData} color="primary">
                        Import
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!csvContent}
                        color="primary"
                      >
                        Next {activeStep > 0 && ">"}
                      </Button>
                    )}
                  </>
                )}
              </Grid>
              <Grid item>
                {activeStep === 3 ? (
                  <Button variant="contained" onClick={handleCancelBtn} color="primary">
                    OK
                  </Button>
                ) : (
                  <Button onClick={handleCancelBtn} style={customStylesBtn}>
                    Cancel
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
        </div>
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              top: "0%",
              left: "0",
              backgroundColor: "rgba(236, 235, 226, .5)",
              height: "100vh",
              width: "100vw",
              zIndex: "999999999999999",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <CircularProgress />
            <Typography>Importing Records</Typography>
          </Box>
        )}
      </div>
    </>
  )
}

export default MainImport;
