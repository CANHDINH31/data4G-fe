import { useState } from "react";
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
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import {
  AiOutlineSearch,
  AiOutlineFolderAdd,
  AiOutlineDelete,
  AiOutlineFileText,
  AiOutlineClose,
} from "react-icons/ai";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { ColorType, UserType } from "@/types";
import {
  deleteUser,
  registerAccount,
  searchUser,
  updateInfoUser,
} from "@/utils/api";
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

const UserManagement = () => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "Chỉ mục", width: 100 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "name", headerName: "Họ tên", width: 200 },
    { field: "phone", headerName: "Số điện thoại", width: 150 },
    {
      field: "",
      headerName: "Loại tài khoản",
      width: 150,
      renderCell: params => (
        <Typography
          variant="subtitle2"
          color={params.row.fromGoogle ? "red" : ""}
        >
          {params.row.fromGoogle ? "Google" : "Thường"}
        </Typography>
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
    control,
    getValues,
  } = useForm<{
    id?: string;
    email: string;
    password: string;
    name: string;
    phone?: string;
    isAdmin?: boolean;
    fromGoogle?: boolean;
  }>();

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
  const [listUser, setListUser] = useState<UserType[]>([]);
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
  const handleCloseEditUser = (): void => {
    setIsOpenDialogEdit(false);
    resetEdit();
  };

  const handleOpenDialogEdit = (id: string) => {
    setIsOpenDialogEdit(true);
    const editUser = listUser.find(user => user && user.id === id);
    if (editUser) {
      setValue("id", editUser.id);
      setValue("email", editUser.email as string);
      setValue("name", editUser.name as string);
      setValue("phone", editUser.phone as string);
      setValue("password", editUser.password as string);
      setValue("fromGoogle", editUser.fromGoogle);
      setValue("isAdmin", editUser.isAdmin);
    }
  };

  const handleEditUser: SubmitHandler<{
    email?: string;
    name?: string;
    password?: string;
    phone?: string;
    fromGoogle?: boolean | string;
    isAdmin?: boolean | string;
  }> = async data => {
    const isAdmin =
      data.isAdmin === true || data.isAdmin === "true" ? true : false;
    const newData = {
      ...data,
      isAdmin,
    };
    const res = await updateInfoUser(getValues("id") as string, newData);
    if (res.data.status === 200) {
      notification("success", res.data.message);
      handleCloseEditUser();
      resetEdit();
      setListUser([]);
    } else {
      notification("error", res.data.message);
    }
    try {
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
      const newListUser = data.data?.map((user: UserType) => ({
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
                      sx={{ color: `${ColorType.PRIMARY}` }}
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
                  sx={{ color: `${ColorType.PRIMARY}` }}
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
                  sx={{ color: `${ColorType.PRIMARY}` }}
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
                  sx={{ color: `${ColorType.PRIMARY}` }}
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
                  sx={{ color: `${ColorType.PRIMARY}` }}
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
        onClose={handleCloseEditUser}
        aria-labelledby="customized-dialog-title"
        open={isOpenDialogEdit}
      >
        <form onSubmit={handleSubmitEdit(handleEditUser)}>
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleCloseEditUser}
          >
            Cập nhật người dùng
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Box mt={2}>
              <TextField
                label="Họ tên"
                sx={{ width: "25vw" }}
                size="small"
                {...registerEdit("name", {
                  required: "Trường không này không được để trống",
                })}
              />
              {editErrors.name && (
                <Typography
                  mt={2}
                  variant="subtitle2"
                  sx={{ color: `${ColorType.PRIMARY}` }}
                >
                  {editErrors.name.message}
                </Typography>
              )}
            </Box>
            <Box mt={2}>
              <TextField
                disabled
                label="Gmail"
                sx={{ width: "25vw" }}
                size="small"
                {...registerEdit("email", {
                  required: "Trường không này không được để trống",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                })}
              />
              {editErrors.email && (
                <Typography
                  mt={2}
                  variant="subtitle2"
                  sx={{ color: `${ColorType.PRIMARY}` }}
                >
                  {editErrors.email.message}
                </Typography>
              )}
            </Box>
            <Box mt={2}>
              <TextField
                label="Số điện thoại"
                sx={{ width: "25vw" }}
                size="small"
                {...registerEdit("phone", {
                  pattern: {
                    value: /^0[35789]\d{8}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                })}
              />
              {editErrors.phone && (
                <Typography
                  mt={2}
                  variant="subtitle2"
                  sx={{ color: `${ColorType.PRIMARY}` }}
                >
                  {editErrors.phone.message}
                </Typography>
              )}
            </Box>
            {!getValues("fromGoogle") && (
              <Box mt={2}>
                <TextField
                  label="Mật khẩu mới"
                  sx={{ width: "25vw" }}
                  size="small"
                  {...registerEdit("password")}
                />
                {addErrors.password && (
                  <Typography
                    mt={2}
                    variant="subtitle2"
                    sx={{ color: `${ColorType.PRIMARY}` }}
                  >
                    {addErrors.password.message}
                  </Typography>
                )}
              </Box>
            )}

            <Box mt={2}>
              <FormLabel>Phân quyền: </FormLabel>
              <Controller
                name="isAdmin"
                control={control}
                defaultValue={getValues("isAdmin")}
                render={({ field }) => (
                  <RadioGroup
                    row
                    value={field.value?.toString()}
                    onChange={e => field.onChange(e.target.value)}
                  >
                    <FormControlLabel
                      value={"true"}
                      control={<Radio />}
                      label="Admin"
                    />
                    <FormControlLabel
                      value={"false"}
                      control={<Radio />}
                      label="User"
                    />
                  </RadioGroup>
                )}
              />
            </Box>
            {getValues("fromGoogle") && (
              <Box mt={2}>
                <Typography color="red" fontSize={11}>
                  Lưu ý: tài khoản này đăng kí qua Google, nên không cập nhật
                  được mật khẩu
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleCloseEditUser}
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
