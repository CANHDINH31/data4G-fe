import { ServiceType } from "@/types";
import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import React from "react";
import {
  AiOutlineDelete,
  AiOutlineFileText,
  AiOutlineFolderAdd,
} from "react-icons/ai";

type Props = {
  listService: ServiceType[];
  listIdDelete: string[];
  setListIdDelete: React.Dispatch<React.SetStateAction<string[]>>;
  handleOpenConfimDelete: (id: string, type: string) => void;
  handleOpenDialogEdit: (id: string) => void;
  handleOpenDialogAddToCategory: () => void;
};

const ListService = ({
  listService,
  listIdDelete,
  setListIdDelete,
  handleOpenConfimDelete,
  handleOpenDialogEdit,
  handleOpenDialogAddToCategory,
}: Props) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "Chỉ mục", width: 200 },
    { field: "title", headerName: "Tên", width: 100 },
    { field: "price", headerName: "Giá", width: 100 },
    { field: "content", headerName: "Nội dung", width: 400 },
    {
      field: "setting",
      headerName: "Chức năng",
      width: 200,
      renderCell: params => (
        <Box display="flex" gap="20px">
          <Button
            variant="contained"
            size="small"
            color="error"
            startIcon={<AiOutlineDelete />}
            onClick={() => handleOpenConfimDelete(params.row.id, "")}
          >
            Xóa
          </Button>
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<AiOutlineFileText />}
            onClick={() => handleOpenDialogEdit(params.row.id)}
          >
            Chi tiết
          </Button>
        </Box>
      ),
    },
  ];
  return (
    <>
      <DataGrid
        rows={listService}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(
          newRowSelectionModel: GridRowSelectionModel
        ) => {
          const newListIdDelete = newRowSelectionModel.map(selectedRow =>
            selectedRow.toString()
          );
          setListIdDelete(newListIdDelete);
        }}
        rowSelectionModel={listIdDelete}
      />
      <Box mt={2} display="flex" justifyContent="center" gap="10px">
        {listIdDelete?.length > 1 && (
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<AiOutlineDelete />}
            onClick={() => handleOpenConfimDelete("", "multi")}
          >
            Xóa các dòng đã chọn
          </Button>
        )}
        {listIdDelete?.length > 0 && (
          <Button
            variant="contained"
            size="small"
            startIcon={<AiOutlineFolderAdd />}
            onClick={handleOpenDialogAddToCategory}
          >
            Thêm vào danh mục
          </Button>
        )}
      </Box>
    </>
  );
};

export default ListService;
