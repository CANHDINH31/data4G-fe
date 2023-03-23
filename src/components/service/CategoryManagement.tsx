import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  styled,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import {
  AiOutlineUnorderedList,
  AiOutlineSearch,
  AiOutlineFolderAdd,
  AiOutlineDelete,
  AiOutlineFileText,
  AiOutlineClose,
} from "react-icons/ai";

import { useForm, SubmitHandler } from "react-hook-form";
import { Color } from "@/types";
import {
  createCategory,
  deleteCategory,
  getListCategory,
  searchCategory,
  updateCategory,
} from "@/utils/api/api";
import { notification } from "@/utils/helper";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <AiOutlineClose />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const CategoryManagement = () => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "Chỉ mục", width: 250 },
    { field: "title", headerName: "Tên danh mục", width: 200 },
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

  const columnsEdit: GridColDef[] = [
    { field: "title", headerName: "Tên dịch vụ", width: 350 },
    {
      field: "setting",
      headerName: "",
      width: 50,
      renderCell: params => (
        <Box display="flex" gap="20px">
          <AiOutlineDelete
            style={{
              fontSize: "20px",
              cursor: "pointer",
              color: `${Color.PRIMARY}`,
            }}
            onClick={() => handleRemoveService(params.row.id)}
          />
        </Box>
      ),
    },
  ];

  const {
    reset: resetAdd,
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    formState: { errors: addErrors },
  } = useForm<{ title: string }>();

  const {
    reset: resetSearch,
    register: registerSearch,
    handleSubmit: handleSubmitSearch,
    formState: { errors: searchErrors },
  } = useForm<{ search: string }>();

  const {
    reset: resetEdit,
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: EditErrors },
    setValue,
    getValues,
  } = useForm<{
    id: string;
    title: string;
  }>();

  const [isOpenDialogAdd, setIsOpenDialogAdd] = useState<boolean>(false);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] =
    useState<boolean>(false);
  const [isOpenDialogEdit, setIsOpenDialogEdit] = useState<boolean>(false);
  const [listCategory, setListCategory] = useState<
    Array<{
      id: string;
      title: string;
      listService: Array<{
        _id: string;
        title: string;
        price: string;
        content: string;
      }>;
    }>
  >([]);
  const [listService, setListServie] = useState<
    { id: string; content: string; price: string; title: string }[]
  >([]);
  const [listIdDelete, setListIdDelete] = useState<Array<string>>([]);

  //ADD CATEGORY
  const handleAddCategory: SubmitHandler<{
    title: string;
  }> = async data => {
    try {
      const res = await createCategory(data);
      const newCategory = res.data.data;
      setListCategory([
        {
          id: newCategory._id,
          title: newCategory.title,
          listService: [],
        },
        ...listCategory,
      ]);
      setIsOpenDialogAdd(false);
      notification("success", res.data.message);
      resetAdd();
    } catch (error) {
      notification("system");
    }
  };

  const handleCloseCategory = (): void => {
    setIsOpenDialogAdd(false);
    resetAdd();
  };

  // UPDATE CATEGORY
  const handleOpenDialogEdit = (id: string) => {
    setIsOpenDialogEdit(true);
    const editCategory = listCategory.find(category => category.id === id);
    if (editCategory) {
      setValue("id", editCategory.id);
      setValue("title", editCategory.title);
    }
    const newListService = editCategory?.listService?.map(service => ({
      id: service._id,
      content: service.content,
      title: service.title,
      price: service.price,
    }));
    if (newListService) setListServie(newListService);
  };

  const handleCloseDialogEdit = (): void => {
    setIsOpenDialogEdit(false);
  };

  const handleEditCategory = async () => {
    try {
      const res = await updateCategory(getValues("id"), {
        title: getValues("title"),
        listService: listService.map(service => service.id),
      });
      const newCategory = res.data.data;
      const newListCategory = listCategory.map(category => {
        if (category.id === newCategory._id) {
          return {
            id: newCategory._id,
            title: newCategory.title,
            listService: newCategory.listService,
          };
        } else {
          return category;
        }
      });
      setListCategory(newListCategory);
      handleCloseDialogEdit();
      notification("success", res.data.message);
    } catch (error) {
      notification("system");
    }
  };

  // SEARCH CATEGORY
  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmitSearch(handleSearch);
    }
  };

  const handleSearch: SubmitHandler<{
    search: string;
  }> = async query => {
    try {
      const data = await searchCategory(query.search);
      const categoryList = data?.data?.map(
        (category: {
          _id: string;
          title: string;
          listService: Array<{
            _id: string;
            title: string;
            price: string;
            content: string;
          }>;
        }) => ({
          id: category?._id,
          title: category?.title,
          listService: category?.listService,
        })
      );
      setListCategory(categoryList);
      resetSearch();
    } catch (error) {
      console.log(error);
    }
  };

  // GET LIST CATEGORY
  const fetchListCategory = async (): Promise<any> => {
    try {
      const data = await getListCategory();
      const categoryList = data?.data?.map(
        (category: {
          _id: string;
          title: string;
          listService: Array<{
            id: string;
            title: string;
            price: string;
            content: string;
          }>;
        }) => ({
          id: category._id,
          title: category.title,
          listService: category?.listService,
        })
      );
      setListCategory(categoryList);
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE CATEGIRY

  const handleOpenConfimDelete = (id: string, type: string): void => {
    setIsOpenConfirmDelete(true);
    if (type !== "multi") {
      setListIdDelete([id]);
    }
  };

  const hanldeDeleteCategory = async (): Promise<any> => {
    const newListCategory = listCategory.filter(
      category => !listIdDelete.includes(category.id)
    );
    try {
      const res = (await deleteCategory({ listId: listIdDelete })) as {
        data: {
          message: string;
        };
      };
      setIsOpenConfirmDelete(false);
      setListCategory(newListCategory);
      notification("success", res.data.message);
    } catch (error) {
      notification("system");
    }
  };

  // DELETE SERVICE
  const handleRemoveService = (id: string): void => {
    const newService = listService.filter(service => service.id !== id);
    setListServie(newService);
  };

  useEffect(() => {
    fetchListCategory();
  }, []);

  return (
    <>
      {/* DISPLAY LIST */}
      <Box sx={{ height: "50vh", width: "100%" }}>
        <Grid container mb={2}>
          <Grid item xs={4}>
            <Grid container>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  startIcon={<AiOutlineFolderAdd />}
                  onClick={() => setIsOpenDialogAdd(true)}
                >
                  Thêm danh mục
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  startIcon={<AiOutlineUnorderedList />}
                  onClick={fetchListCategory}
                >
                  Hiển thị tất cả
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4} />
          <Grid item xs={4}>
            <form onSubmit={handleSubmitSearch(handleSearch)}>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <TextField
                    variant="standard"
                    sx={{ width: "100%" }}
                    size="small"
                    placeholder="Tìm kiếm danh mục ..."
                    onKeyPress={handleEnterPress}
                    {...registerSearch("search", { required: true })}
                  />
                  {searchErrors.search && (
                    <Typography
                      mt={2}
                      variant="subtitle2"
                      sx={{ color: `${Color.PRIMARY}` }}
                    >
                      Nhập tên danh mục để tìm kiếm
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AiOutlineSearch />}
                    type="submit"
                  >
                    Tìm kiếm
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
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
      </Box>

      {/* DIALOG ADD */}
      <BootstrapDialog
        onClose={handleCloseCategory}
        aria-labelledby="customized-dialog-title"
        open={isOpenDialogAdd}
      >
        <form onSubmit={handleSubmitAdd(handleAddCategory)}>
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleCloseCategory}
          >
            Thêm danh mục
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <TextField
              label="Tên danh mục"
              sx={{ width: "25vw" }}
              size="small"
              {...registerAdd("title", { required: true })}
            />
            {addErrors.title && (
              <Typography
                mt={2}
                variant="subtitle2"
                sx={{ color: `${Color.PRIMARY}` }}
              >
                Nhập tên danh mục để tạo danh mục
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleCloseCategory}
              size="small"
              variant="contained"
              color="error"
            >
              Hủy
            </Button>
            <Button size="small" variant="contained" type="submit">
              Thêm
            </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>

      {/* DIALOG EDIT */}
      <BootstrapDialog
        onClose={handleCloseDialogEdit}
        aria-labelledby="customized-dialog-title"
        open={isOpenDialogEdit}
      >
        <form onSubmit={handleSubmitEdit(handleEditCategory)}>
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleCloseDialogEdit}
          >
            Cập nhật danh mục
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <TextField
              label="Tên danh mục"
              sx={{ width: "30vw" }}
              size="small"
              {...registerEdit("title", { required: true })}
            />
            {EditErrors.title && (
              <Typography
                mt={2}
                variant="subtitle2"
                sx={{ color: `${Color.PRIMARY}` }}
              >
                Không được để trống
              </Typography>
            )}
            <Box mt={2} sx={{ height: "50vh", width: "30vw" }}>
              <DataGrid
                rows={listService}
                columns={columnsEdit}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[10]}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleCloseDialogEdit}
              size="small"
              variant="contained"
              color="error"
            >
              Hủy
            </Button>
            <Button size="small" variant="contained" type="submit">
              Cập nhật danh mục
            </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>

      {/* DIALOG CONFIRM DELETE */}
      <BootstrapDialog
        onClose={() => setIsOpenConfirmDelete(false)}
        aria-labelledby="customized-dialog-title"
        open={isOpenConfirmDelete}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => setIsOpenConfirmDelete(false)}
        >
          Xóa danh mục
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: "25vw" }}>
            <Typography variant="subtitle2">
              Bạn có chắc chắn xóa danh mục này ? khi xóa bạn sẽ không thể phục
              hồi !!!
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => setIsOpenConfirmDelete(false)}
            size="small"
            variant="contained"
            color="error"
          >
            Hủy
          </Button>
          <Button
            size="small"
            variant="contained"
            type="submit"
            onClick={hanldeDeleteCategory}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default CategoryManagement;

interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}
