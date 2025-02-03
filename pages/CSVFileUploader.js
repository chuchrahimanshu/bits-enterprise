import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "age", headerName: "Age", type: "number", width: 70 }
];

const initialRows = [
  { id: 1, name: "John Doe", age: 25 },
  { id: 2, name: "Jane Doe", age: 30 },
  { id: 3, name: "Bob Smith", age: 22 }
];


export default function DragAndDropGrid() {
  const [rows, setRows] = React.useState(initialRows);
  
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  const handleDragEnd = result => {
    if (!result.destination) {
      return;
    }

    const updatedRows = reorder(rows, result.source.index, result.destination.index);

    setRows(updatedRows);
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable" direction="vertical">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {rows?.map((row, index) => (
                <Draggable key={row.id} draggableId={row.id.toString()} index={index}>
                  {provided => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {index === 0 ? (
                        <DataGrid
                          rows={[row]}
                          columns={columns}
                          pageSize={1}
                          pagination={false}
                          disableColumnMenu={true}
                          hideFooter={true}
                          checkboxSelection={false}
                          disableSelectionOnClick
                          onSelectionModelChange={newSelection => {
                            // Handle selection changes here
                          }}
                        />
                      ) : (
                        <DataGrid
                          rows={[row]}
                          columns={columns}
                          pageSize={1}
                          slots={{
                            columnHeaders: ee => index !== 0 && null
                          }}
                          pagination={false}
                          disableColumnMenu={true}
                          hideFooter={true}
                          checkboxSelection={false}
                          disableSelectionOnClick
                          onSelectionModelChange={newSelection => {
                            // Handle selection changes here
                          }}
                        />
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
