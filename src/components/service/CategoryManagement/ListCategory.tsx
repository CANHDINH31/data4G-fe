import { CategoryType } from "@/types";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { AiOutlineDelete, AiOutlineFileText } from "react-icons/ai";

type Props = {
  listCategory: CategoryType[];
  listIdDelete: string[];
  setListIdDelete: React.Dispatch<React.SetStateAction<string[]>>;
  handleOpenConfimDelete: (id: string, type: string) => void;
  handleOpenDialogEdit: (id: string) => void;
};

const ListCategory = ({
  listCategory,
  listIdDelete,
  setListIdDelete,
  handleOpenConfimDelete,
  handleOpenDialogEdit,
}: Props) => {
  const columns: GridColDef[] = [
    { field: "title", headerName: "Tên danh mục", width: 200 },
    { field: "name", headerName: "Tên trên Menu", width: 150 },
    { field: "position", headerName: "Vị trí hiển thị", width: 150 },
    {
      field: "listService",
      headerName: "Số lượng dịch vụ",
      width: 150,
      renderCell: params => (
        <Typography>{params.row.listService?.length}</Typography>
      ),
    },
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
        rows={listCategory}
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
      {listIdDelete?.length > 1 && (
        <Box mt={2} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<AiOutlineDelete />}
            onClick={() => handleOpenConfimDelete("", "multi")}
          >
            Xóa các dòng đã chọn
          </Button>
        </Box>
      )}
    </>
  );
};

export default ListCategory;
