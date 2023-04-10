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
  TextareaAutosize,
  Select,
  MenuItem,
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
import { ColorType } from "@/types";
import {
  addServiceToCategory,
  createService,
  deleteService,
  getListCategory,
  getListService,
  searchService,
  updateService,
} from "@/utils/api";
import { notification } from "@/utils/helper";
import { NOT_NULL } from "@/utils/configs";

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

const TextAreaCustom = styled(TextareaAutosize)`
  width: 25vw;
  border: none;
  resize: none;
  border-bottom: 1px solid green;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.4375em;
  letter-spacing: 0.00938em;
  color: rgba(0, 0, 0, 0.87);
  box-sizing: border-box;
  padding: 0 14px;
  &:focus {
    border-bottom: 1px solid #1976d2;
  }
`;

const CategoryManagement = () => {
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

  const {
    reset: resetAdd,
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    formState: { errors: addErrors },
  } = useForm<{ title: string; price: string; content: string }>();

  const {
    reset: resetEdit,
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: editErrors },
    setValue,
  } = useForm<{ id: string; title: string; price: string; content: string }>();

  const {
    reset: resetSearch,
    register: registerSearch,
    handleSubmit: handleSubmitSearch,
    formState: { errors: searchErrors },
  } = useForm<{ search: string }>();

  const [isOpenDialogAdd, setIsOpenDialogAdd] = useState<boolean>(false);
  const [isOpenDialogEdit, setIsOpenDialogEdit] = useState<boolean>(false);
  const [isOpenDialogAddToCategory, setIsOpenDialogAddToCategory] =
    useState<boolean>(false);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] =
    useState<boolean>(false);
  const [listService, setListService] = useState<
    Array<{
      id: string;
      title: string;
      price: string;
      content: string;
    }>
  >([]);
  const [listIdDelete, setListIdDelete] = useState<Array<string>>([]);

  const [idSelectedCategory, setIdSelectedCategory] = useState<string>();
  const [listCategory, setListCategory] = useState<
    Array<{ id: string; title: string }>
  >([]);

  //ADD SERVICE
  const handleAddService: SubmitHandler<{
    title: string;
    price: string;
    content: string;
  }> = async data => {
    try {
      const res = await createService(data);
      const newService = res.data.data;
      setListService([
        {
          id: newService._id,
          title: newService.title,
          price: newService.price,
          content: newService.content,
        },
        ...listService,
      ]);
      resetAdd();
      setIsOpenDialogAdd(false);
      notification("success", res.data.message);
    } catch (error) {
      notification("system");
    }
  };

  const handleCloseService = (): void => {
    setIsOpenDialogAdd(false);
    resetAdd();
  };

  // ADD SERVICE TO CATEGORY
  const handleOpenDialogAddToCategory = (): void => {
    setIsOpenDialogAddToCategory(true);
  };

  // EDIT SERVICE
  const handleCloseEditService = (): void => {
    setIsOpenDialogEdit(false);
    resetEdit();
  };

  const handleOpenDialogEdit = (id: string) => {
    setIsOpenDialogEdit(true);
    const editService = listService.find(
      (service: {
        id: string;
        title: string;
        price: string;
        content: string;
      }) => service.id === id
    );
    if (editService) {
      setValue("id", editService.id);
      setValue("title", editService.title);
      setValue("price", editService.price);
      setValue("content", editService.content);
    }
  };

  const handleEditService: SubmitHandler<{
    id: string;
    title: string;
    price: string;
    content: string;
  }> = async data => {
    try {
      const res = (await updateService(data.id, {
        title: data.title,
        price: data.price,
        content: data.content,
      })) as {
        data: {
          message: string;
        };
      };
      const newListService = listService.map(service => {
        if (service.id === data.id) {
          return data;
        }
        return service;
      });
      setListService(newListService);
      handleCloseEditService();
      notification("success", res.data.message);
    } catch (error) {
      notification("system");
    }
  };

  // SEARCH SERVICE
  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmitSearch(handleSearch);
    }
  };

  const handleSearch: SubmitHandler<{
    search: string;
  }> = async query => {
    try {
      const data = await searchService(query.search);
      const serviceList = data?.data?.map(
        (service: {
          _id: string;
          title: string;
          price: string;
          content: string;
        }) => ({
          id: service._id,
          title: service.title,
          price: service.price,
          content: service.content,
        })
      );
      setListService(serviceList);
      resetSearch();
    } catch (error) {
      notification("system");
    }
  };

  // GET LIST SERVICE
  const fetchListService = async (): Promise<any> => {
    try {
      const data = await getListService();
      const serviceList = data?.data?.map(
        (service: {
          _id: string;
          title: string;
          price: string;
          content: string;
        }) => ({
          id: service._id,
          title: service.title,
          price: service.price,
          content: service.content,
        })
      );
      setListService(serviceList);
    } catch (error) {
      notification("system");
    }
  };

  // DELETE SERVICE

  const handleOpenConfimDelete = (id: string, type: string): void => {
    setIsOpenConfirmDelete(true);
    if (type !== "multi") {
      setListIdDelete([id]);
    }
  };

  const hanldeDeleteService = async (): Promise<any> => {
    const newListService = listService.filter(
      service => !listIdDelete.includes(service.id)
    );
    try {
      const res = (await deleteService({ listId: listIdDelete })) as {
        data: { message: string };
      };
      setIsOpenConfirmDelete(false);
      setListService(newListService);
      notification("success", res.data.message);
    } catch (error) {
      notification("system");
    }
  };

  // ADD SERVICE TO CATEGORY
  const handleAddToCategory = async (): Promise<any> => {
    try {
      if (idSelectedCategory) {
        await addServiceToCategory({
          idCategory: idSelectedCategory,
          idService: listIdDelete,
        });
      }
      setIsOpenDialogAddToCategory(false);
      notification("success", "Thêm vào danh mục thành công");
    } catch (error) {
      notification("system");
    }
  };

  // GET LIST CATEGORY
  const fetchListCategory = async (): Promise<any> => {
    try {
      const data = await getListCategory();
      const categoryList = data?.data?.map(
        (category: { _id: string; title: string }) => ({
          id: category._id,
          title: category.title,
        })
      );
      setIdSelectedCategory(categoryList[0].id);
      setListCategory(categoryList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchListService();
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
                  Thêm dịch vụ
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  startIcon={<AiOutlineUnorderedList />}
                  onClick={fetchListService}
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
                    placeholder="Tìm kiếm dịch vụ ..."
                    onKeyPress={handleEnterPress}
                    {...registerSearch("search", { required: true })}
                  />
                  {searchErrors.search && (
                    <Typography
                      mt={2}
                      variant="subtitle2"
                      sx={{ color: `${ColorType.PRIMARY}` }}
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
      </Box>

      {/* DIALOG ADD */}
      <BootstrapDialog
        onClose={handleCloseService}
        aria-labelledby="customized-dialog-title"
        open={isOpenDialogAdd}
      >
        <form onSubmit={handleSubmitAdd(handleAddService)}>
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleCloseService}
          >
            Thêm dịch vụ
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Box mt={2}>
              <TextField
                label="Tên dịch vụ"
                sx={{ width: "25vw" }}
                size="small"
                {...registerAdd("title", { required: true })}
              />
              {addErrors.title && (
                <Typography
                  mt={2}
                  variant="subtitle2"
                  sx={{ color: `${ColorType.PRIMARY}` }}
                >
                  Nhập tên để tạo dịch vụ
                </Typography>
              )}
            </Box>
            <Box mt={2}>
              <TextField
                type="text"
                label="Giá dịch vụ"
                sx={{ width: "25vw" }}
                size="small"
                {...registerAdd("price", { required: true })}
              />
              {addErrors.price && (
                <Typography
                  mt={2}
                  variant="subtitle2"
                  sx={{ color: `${ColorType.PRIMARY}` }}
                >
                  Nhập giá để tạo dịch vụ
                </Typography>
              )}
            </Box>
            <Box mt={2}>
              <TextAreaCustom
                placeholder="Nhập nội dung dịch vụ"
                minRows={7}
                {...registerAdd("content", { required: true })}
              />
              {addErrors.content && (
                <Typography
                  mt={2}
                  variant="subtitle2"
                  sx={{ color: `${ColorType.PRIMARY}` }}
                >
                  Nhập nội dung để tạo danh mục
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleCloseService}
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

      {/* DIALOG ADD TO CATEGORY*/}
      <BootstrapDialog
        onClose={() => setIsOpenDialogAddToCategory(false)}
        aria-labelledby="customized-dialog-title"
        open={isOpenDialogAddToCategory}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => setIsOpenDialogAddToCategory(false)}
        >
          Thêm dịch vụ vào danh mục
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Select
            sx={{ width: "25vw" }}
            value={idSelectedCategory}
            label="Danh mục"
            onChange={e => setIdSelectedCategory(e.target.value)}
          >
            {listCategory?.map((category: { id: string; title: string }) => (
              <MenuItem value={category.id} key={category.id}>
                {category.title}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => setIsOpenDialogAddToCategory(false)}
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
            onClick={handleAddToCategory}
          >
            Thêm vào danh mục
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {/* DIALOG EDIT */}
      <BootstrapDialog
        onClose={handleCloseEditService}
        aria-labelledby="customized-dialog-title"
        open={isOpenDialogEdit}
      >
        <form onSubmit={handleSubmitEdit(handleEditService)}>
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleCloseEditService}
          >
            Cập nhật dịch vụ
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Box mt={2}>
              <TextField
                label="Tên dịch vụ"
                sx={{ width: "25vw" }}
                size="small"
                {...registerEdit("title", { required: true })}
              />
              {editErrors.title && (
                <Typography
                  mt={2}
                  variant="subtitle2"
                  sx={{ color: `${ColorType.PRIMARY}` }}
                >
                  {NOT_NULL}
                </Typography>
              )}
            </Box>
            <Box mt={2}>
              <TextField
                type="text"
                label="Giá dịch vụ"
                sx={{ width: "25vw" }}
                size="small"
                {...registerEdit("price", { required: true })}
              />
              {editErrors.price && (
                <Typography
                  mt={2}
                  variant="subtitle2"
                  sx={{ color: `${ColorType.PRIMARY}` }}
                >
                  {NOT_NULL}
                </Typography>
              )}
            </Box>
            <Box mt={2}>
              <TextAreaCustom
                placeholder="Nhập nội dung dịch vụ"
                minRows={7}
                {...registerEdit("content", { required: true })}
              />
              {editErrors.content && (
                <Typography
                  mt={2}
                  variant="subtitle2"
                  sx={{ color: `${ColorType.PRIMARY}` }}
                >
                  {NOT_NULL}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleCloseEditService}
              size="small"
              variant="contained"
              color="error"
            >
              Hủy
            </Button>
            <Button size="small" variant="contained" type="submit">
              Cập nhật
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
          Xóa dịch vụ
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: "25vw" }}>
            <Typography variant="subtitle2">
              Bạn có chắc chắn xóa danh mục này ? Nếu xóa thì các sản phẩm trong
              danh mục cũng bị xóa và các dịch vụ này sẽ không khôi phục được
              !!!
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
            onClick={hanldeDeleteService}
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
