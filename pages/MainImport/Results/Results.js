import React from "react";
import { Grid, Box, Typography,} from "@mui/material";

function Results({resultData, downloadTxtFile}) {
  return (
    <Box className="p-9">
      <Typography variant="p" component="p">
        Total Records Processed: {resultData.totalprocessed}
      </Typography>
      <Typography variant="p" component="p">
        Imported Successfully: {resultData.imported}
      </Typography>
      <Typography variant="p" component="p">
        Skipped: {resultData.skipped}
      </Typography>

      <Grid container gap={15}>
        <Grid item>
          {" "}
          <Typography variant="p" component="p">
            {" "}
            Unprocessed: {resultData.unprocessed}
          </Typography>
        </Grid>
        <Grid item>
          {" "}
          <Typography className="text-primary cursor-pointer" onClick={downloadTxtFile} variant="p" component="p">
            Preview unprocessed records
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Results;
