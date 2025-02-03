import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { baseURL } from '../../api';
import ListItemComponent from './ListItem'

const TransferList =({data})=>{

  const [formTransferListData, setTransferListData] = useState();
  // let urlCapture= window.location.pathname + window.location.search

  // useEffect(() => {
  //   axios
  //     .get(`${baseURL}${urlCapture}`)
  //     .then((result) => {
  //       setTransferListData(result?.data?.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);
  // console.log("Form Data",formTransferListData)

 
  return (
    <>
    {/* {formTransferListData?.details?.map((item)=>( */}

      <ListItemComponent url={data?.data?.sDataSource} data={data}/>
    {/* ))} */}
    </>
  
  )
}
export default TransferList;