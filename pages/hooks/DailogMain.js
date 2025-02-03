import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton
} from "@mui/material";
import React, { memo, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";

import { Global_Data } from "../../globalData/GlobalData";

function DailogMain({ data, open,handleClose, renderComponent }) {
  const { setOpenModalChildData, setopenModalDataActive } = Global_Data();

  useEffect(() => {
    if (open) {
      setopenModalDataActive(data.component);
      // setopenModalDataActive(data.component);
      setOpenModalChildData(data?.child);
    } else {
      setOpenModalChildData([]);
      setopenModalDataActive({});
    }
  }, [open]);

  return (
    <>
      <Grid container>
        <Dialog
          open={open}
          aria-labelledby={`${data?.component?.sName}-alert-dialog-title`}
          style={{ zIndex: "1201" }}
          aria-describedby={`${data?.component?.sName}-alert-dialog-description`}
          {...data?.props}
          {...data?.component?.sProps}
        >
          <IconButton
            onClick={()=>{
              handleClose(false)
            }}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <DialogTitle id={`${data?.component?.sType}-alert-dialog-title`}>
            {data?.component?.sLabel}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id={data?.component?.sName}>
              {data?.component?.sDefaultValue}
            </DialogContentText>
            <Grid item>
              <Grid container>{renderComponent(data?.child)}</Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Grid>
    </>
  );
}

export default memo(DailogMain);
