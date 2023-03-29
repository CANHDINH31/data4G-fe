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
import { Color, typeUser } from "@/types";
import {
  deleteService,
  deleteUser,
  registerAccount,
  searchUser,
  updateService,
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

const UserManagement = () => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "Chỉ mục", width: 100 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "name", headerName: "Họ tên", width: 250 },
    { field: "phone", headerName: "Số điện thoại", width: 200 },
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
  } = useForm<{
    email: string;
    password: string;
    name: string;
    phone?: string;
  }>();

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
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] =
    useState<boolean>(false);
  const [listUser, setListUser] = useState<typeUser[]>([]);
  const [listService, setListService] = useState<
    Array<{
      id: string;
      title: string;
      price: string;
      content: string;
    }>
  >([]);
  const [listIdDelete, setListIdDelete] = useState<Array<string>>([]);

  //ADD USER
  const handleAddUser: SubmitHandler<{
    name: string;
    email: string;
    password: string;
    phone?: string;
  }> = async data => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data?.phone,
      };
      const res = (await registerAccount(payload)) as {
        data: {
          status: number;
          message: string;
        };
      };
      if (res.data.status === 200) {
        notification("success", res.data.message);
        resetAdd();
        handleCloseAddUser();
      } else {
        notification("error", res.data.message);
      }
    } catch (error) {
      notification("system");
    }
  };

  const handleCloseAddUser = (): void => {
    setIsOpenDialogAdd(false);
    resetAdd();
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
      const data = await searchUser(query.search);
      const newListUser = data.data?.map((user: typeUser) => ({
        id: user?._id,
        ...user,
      }));
      setListUser(newListUser);
      resetSearch();
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

  const hanldeDeleteUser = async (): Promise<any> => {
    const newListUser = listUser.filter(
      user => !listIdDelete.includes(user?.id as string)
    );
    try {
      const res = (await deleteUser({ listId: listIdDelete })) as {
        data: { message: string };
      };
      setIsOpenConfirmDelete(false);
      setListUser(newListUser);
      notification("success", res.data.message);
    } catch (error) {
      notification("system");
    }
  };

  return (
    <>
      {/* DISPLAY LIST */}
      <Box sx={{ height: "50vh", width: "100%" }}>
        <Grid container mb={2}>
          <Grid item xs={4}>
            <form onSubmit={handleSubmitSearch(handleSearch)}>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <TextField
                    variant="standard"
                    sx={{ width: "100%" }}
                    size="small"
                    placeholder="Nhập email, tên, số điện thoại ..."
                    onKeyPress={handleEnterPress}
                    {...registerSearch("search", {
                      required: "Không được để trống",
                    })}
                  />
                  {searchErrors.search && (
                    <Typography
                      mt={2}
                      variant="subtitle2"
                      sx={{ color: `${Color.PRIMARY}` }}
                    >
                      {searchErrors.search.message}
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
          <Grid item xs={6} />
          <Grid item xs={2}>
            <Button
              variant="contained"
              size="small"
              color="success"
              startIcon={<AiOutlineFolderAdd />}
              onClick={() => setIsOpenDialogAdd(true)}
            >
              Thêm người dùng
            </Button>
          </Grid>
        </Grid>
        {listUser?.length > 0 && (
          <>
            <DataGrid
              rows={listUser}
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
            </Box>
          </>
        )}
      </Box>

      {/* DIALOG ADD */}
      <BootstrapDialog
        onClose={handleCloseAddUser}
        aria-labelledby="customized-dialog-title"
        open={isOpenDialogAdd}
      >
        <form onSubmit={handleSubmitAdd(handleAddUser)}>
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleCloseAddUser}
          >
            Thêm người dùng
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Box mt={2}>
              <TextField
                label="Họ tên"
                sx={{ width: "25vw" }}
                size="small"
                {...registerAdd("name", {
                  required: "Trường không này không được để trống",
                })}
              />
              {addErrors.name && (
                <Typography
                  mt={2}
                  variant="subtitle2"
                  sx={{ color: `${Color.PRIMARY}` }}
                >
                  {addErrors.name.message}
                </Typography>
              )}
            </Box>
            <Box mt={2}>
              <TextField
                label="Gmail"
                sx={{ width: "25vw" }}
                size="small"
                {...registerAdd("email", {
                  required: "Trường không này không được để trống",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                })}
              />
              {addErrors.email && (
                <Typography
                  mt={2}
                  variant="subtitle2"
                  sx={{ color: `${Color.PRIMARY}` }}
                >
                  {addErrors.email.message}
                </Typography>
              )}
            </Box>
            <Box mt={2}>
              <TextField
                label="Số điện thoại"
                sx={{ width: "25vw" }}
                size="small"
                {...registerAdd("phone", {
                  pattern: {
                    value: /^0[35789]\d{8}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                })}
              />
              {addErrors.phone && (
                <Typography
                  mt={2}
                  variant="subtitle2"
                  sx={{ color: `${Color.PRIMARY}` }}
                >
                  {addErrors.phone.message}
                </Typography>
              )}
            </Box>
            <Box mt={2}>
              <TextField
                label="Mật khẩu"
                sx={{ width: "25vw" }}
                size="small"
                {...registerAdd("password", {
                  required: "Trường không này không được để trống",
                })}
              />
              {addErrors.password && (
                <Typography
                  mt={2}
                  variant="subtitle2"
                  sx={{ color: `${Color.PRIMARY}` }}
                >
                  {addErrors.password.message}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleCloseAddUser}
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
        onClose={handleCloseEditService}
        aria-labelledby="customized-dialog-title"
        open={isOpenDialogEdit}
      >
        <form onSubmit={handleSubmitEdit(handleEditService)}>
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleCloseEditService}
          >
            Cập nhật người dùng
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
                  sx={{ color: `${Color.PRIMARY}` }}
                >
                  Không được để trống
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
                  sx={{ color: `${Color.PRIMARY}` }}
                >
                  Không được để trống
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
                  sx={{ color: `${Color.PRIMARY}` }}
                >
                  Không được để trống
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
          Xóa người dùng
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: "25vw" }}>
            <Typography variant="subtitle2">
              Bạn có chắc chắn xóa không ? Nếu xóa thì sẽ không khôi phục được
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
            onClick={hanldeDeleteUser}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default UserManagement;

interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}
