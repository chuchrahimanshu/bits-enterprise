import * as React from 'react';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import SecurityIcon from '@mui/icons-material/Security';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { baseURL } from '../../api';
import axios from 'axios';



export default function ColumnTypesGrid({ formdata, formDetails}) {
  const [rows, setRows] = React.useState("");
  const [isLoaded,setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
    .get(baseURL+formdata.data.sDataSource)
    .then((response) => {
    setRows(true);
    // console.log(response.data);
    response?.data?.map((row, index) => row["id"] = row[formDetails.sPrimaryKey] );
    setRows(response.data);
    });
    }, [rows.id]);


  const deleteItem = React.useCallback(
    (id) => () => {
      /*setTimeout(() => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      }); */
      var data = {};
      var datasection = [];
      var key, value;
      var mainrecord = {};



      let metadata = {
        sPrimaryKey: formDetails.sPrimaryKey,
        id: formDetails.id,
        sPrimaryTable: formDetails.sPrimaryTable,
        sFormType: formDetails.sFormType, 
        sPrimaryKeyValue : id
      }
      let headers = {
          "Content-type" : "application/json"
      }

      // console.log('formDetails',  formDetails);


      datasection.push({'mainrecord' : {mainrecord}});
      data['metadata'] = metadata;
      data['data'] = datasection;


     
      const uri = baseURL+ formdata.data.sAction.actionDelete;

     
      axios
       .delete(uri, {headers, data})
       .then((result) => {
       
         if (result.data) {

           if (result.data.metadata.status == 'OK') {
            //  alert('Success');     
             setTimeout(() => {
              setRows((prevRows) => prevRows.filter((row) => row.id !== id));
            });       
           }
           else {
              //  alert(result.data.metadata.msg);
           }
         }
       })
       .catch((error) => {
         console.log(error);
       });

    },
    [], 

  );

  const editItem = React.useCallback(
    (id) => () => {
      /*setTimeout(() => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      }); */
      
      navigate(formdata.data.sAction.actionEdit+"&id="+id);
    },
    [], 

  ); 

  const viewItem = React.useCallback(
    (id) => () => {
      /*setTimeout(() => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      }); */
      
      navigate(formdata.data.sAction.actionView+"&id="+id);
    },
    [], 

  ); 

  const toggleAdmin = React.useCallback(
    (id) => () => {
      setRows((prevRows) =>
        prevRows?.map((row) =>
          row.id === id ? { ...row, isAdmin: !row.isAdmin } : row,
        ),
      );
    },
    [],
  );

  const duplicateUser = React.useCallback(
    (id) => () => {
      setRows((prevRows) => {
        const rowToDuplicate = prevRows.find((row) => row.id === id);
        return [...prevRows, { ...rowToDuplicate, id: Date.now() }];
      });
    },
    [],
  );

  
  const columns = [];
  formdata?.fixcolumns?.forEach((item, index) => {

      columns.push({
        field: item.sColumnID,
        headerName: item.sHeader,
        width: item.iWidth,
        editable: item.bEditable,
        type: item.sType,
        sortable: item.bSortable
        })
      });

    columns.push({

        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 150,
        getActions: (params) => [
          <GridActionsCellItem
          icon={<EditOutlinedIcon />}
          label="Edit"
          onClick={editItem(params.id, )}
        />,
          <GridActionsCellItem
          icon={<RemoveRedEyeOutlinedIcon />}
          label="View"
          onClick={viewItem(params.id)}
        />,

        ]

    });

  return (
    <div {...formdata?.component?.options?.others1}>
      <DataGrid columns={columns} rows={rows} 

      slots={{ toolbar: GridToolbar }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        }
      }}
        />
    </div>
  );
}