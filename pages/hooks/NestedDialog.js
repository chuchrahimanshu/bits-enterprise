import { Dialog, DialogContent, DialogContentText, DialogTitle, Grid } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import { Global_Data } from "../../globalData/GlobalData";


function NestedDialog({ data, open, renderComponent }) {
const [oldComponetData ,setOldComponentData] = useState({})
const [oldModalEditData ,setOldModalEditData] = useState({})
const [oldComponetChildData ,setOldComponentChildData] = useState([])
  const { setOpenModalChildData, setopenModalDataActive ,setModalEditData,isOpenModalChildData, setIsOpenModalChildData} = Global_Data();


  useEffect(() => {
    if (open) {
      setopenModalDataActive((predata)=>{
        setOldComponentData(predata);
        return data.component
      });
      
      setModalEditData((predata)=>{
        setOldModalEditData(predata);
        return {}
      });
      
      // setopenModalDataActive(data.component);
      setOpenModalChildData((predata)=>{
        setOldComponentChildData(predata)
        return data?.child
      });
      setIsOpenModalChildData(true)
    } else {
      setModalEditData(oldModalEditData)
      setOpenModalChildData(oldComponetChildData);
      setopenModalDataActive(oldComponetData);
      setIsOpenModalChildData(false)
    }
  }, [open]);


  return (
    <>
      <Grid container>
        <Dialog
          open={open}
          aria-labelledby={`${data?.component?.sName}-alert-dialog-title`}
          style={{ zIndex: "1202", right: "-30%" }}
          aria-describedby={`${data?.component?.sName}-alert-dialog-description`}
          {...data?.props}
        >
          <DialogTitle id={`${data?.component?.sType}-alert-dialog-title`}>
            {data?.component?.sLabel}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id={data?.component?.sName}>
              {data?.component?.sDefaultValue}
            </DialogContentText>
            <Grid item>
              {/* ppp */}
              <Grid container>{renderComponent(data?.child)}</Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Grid>
    </>
  );
}

export default memo(NestedDialog);
