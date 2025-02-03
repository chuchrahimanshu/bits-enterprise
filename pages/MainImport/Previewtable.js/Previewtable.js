import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

// Sample data for the table

function Previewtable({ fromFeilds, formData, csvContent }) {
  // Pagination state
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // // Event handlers for pagination
  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  return (
    <TableContainer className="p-3" sx={{ maxHeight: "50vh" }} component={Paper}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {fromFeilds?.map(elm => (
              <TableCell sx={{ minWidth: 150, top: "-12px" }} key={elm.sCaption}>
                {elm.sCaption}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => ( */}
          {csvContent?.map(row => (
            <TableRow key={row.id}>
              {Object.keys(formData).map(key => (
                <TableCell key={key}>{row[formData[key]]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {
      /* <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */
      }
    </TableContainer>
  );
}

export default Previewtable;
