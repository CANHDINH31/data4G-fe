import {
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import RegisterImg from "@/assets/image/register.png";
import { ColorType, RootStateType } from "@/types";
import { useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { notification } from "@/utils/helper";
import { updateInfoUser } from "@/utils/api";
import { BiShow, BiHide } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/redux/userSlice";
import { NOT_NULL } from "@/utils/configs";

const UpdateInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootStateType) => state.user);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowRePassword, setIsShowRePassword] = useState<boolean>(false);
  const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm();

  const password = watch("password", "");

  const validateRePassword = (value: string) => {
    if (value !== password) {
      return "Mật khẩu nhập lại không khớp";
    }
  };

  const handleUpdateInfo = async (data: FieldValues) => {
    const payload = {
      name: data.name,
      ...(data.phone && { phone: data.phone }),
      ...(data.password && { password: data.password }),
    };
    try {
      const res = await updateInfoUser(getValues("id"), payload);
      if (res.data.status === 200) {
        dispatch(loginSuccess(res.data));
        notification("success", res.data.message);
        setValue("password", "");
        setValue("rePassword", "");
      } else {
        notification("error", res.data.message);
      }
    } catch (error) {
      notification("system");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const getInfoUser = () => {
      if (currentUser) {
        setValue("email", currentUser?.email);
        setValue("name", currentUser?.name);
        setValue("phone", currentUser?.phone);
        setValue("id", currentUser?._id);
      } else {
        navigate("/");
      }
    };
    getInfoUser();
  }, [currentUser]);

  return (
    <Container>
      <Box display="flex" gap={20}>
        {isAboveMediumScreens && <img src={RegisterImg} alt="register-img" />}
        <Box flex="1" mt={4} px={4}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            CẬP NHẬT TÀI KHOẢN
          </Typography>
          <form onSubmit={handleSubmit(handleUpdateInfo)}>
            <Box display="flex" flexDirection="column" gap={4} mt={4}>
              <Box>
                <TextField
                  placeholder="Họ tên *"
                  size="small"
                  variant="standard"
                  fullWidth
                  {...register("name", {
                    required: NOT_NULL,
                  })}
                />
                {errors.name && (
                  <Box mt={1}>
                    <Typography variant="subtitle2" color={ColorType.PRIMARY}>
                      {errors.name.message?.toString()}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box>
                <TextField
                  placeholder="Email *"
                  size="small"
                  variant="standard"
                  fullWidth
                  {...register("email", {
                    required: NOT_NULL,
                  })}
                  disabled
                />
                {errors.email && (
                  <Box mt={1}>
                    <Typography variant="subtitle2" color={ColorType.PRIMARY}>
                      {errors.email.message?.toString()}
                    </Typography>
                  </Box>
                )}
              </Box>
              {!currentUser?.fromGoogle && (
                <>
                  <Box>
                    <TextField
                      placeholder="Mật khẩu mới *"
                      size="small"
                      variant="standard"
                      fullWidth
                      {...register("password")}
                      type={!isShowPassword ? "password" : "text"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{ cursor: "pointer" }}
                            onClick={() => setIsShowPassword(!isShowPassword)}
                          >
                            {!isShowPassword ? (
                              <BiHide fontSize={24} />
                            ) : (
                              <BiShow fontSize={24} />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                    {errors.password && (
                      <Box mt={1}>
                        <Typography
                          variant="subtitle2"
                          color={ColorType.PRIMARY}
                        >
                          {errors.password.message?.toString()}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box>
                    <TextField
                      placeholder="Nhập lại mật khẩu *"
                      size="small"
                      variant="standard"
                      fullWidth
                      {...register("rePassword", {
                        validate: validateRePassword,
                      })}
                      type={!isShowRePassword ? "password" : "text"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{ cursor: "pointer" }}
                            onClick={() =>
                              setIsShowRePassword(!isShowRePassword)
                            }
                          >
                            {!isShowRePassword ? (
                              <BiHide fontSize={24} />
                            ) : (
                              <BiShow fontSize={24} />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                    {errors.rePassword && (
                      <Box mt={1}>
                        <Typography
                          variant="subtitle2"
                          color={ColorType.PRIMARY}
                        >
                          {errors.rePassword.message?.toString()}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </>
              )}

              <Box>
                <TextField
                  placeholder="Số điện thoại"
                  size="small"
                  variant="standard"
                  fullWidth
                  {...register("phone", {
                    pattern: {
                      value: /^0[35789]\d{8}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  })}
                />
                {errors.phone && (
                  <Box mt={1}>
                    <Typography variant="subtitle2" color={ColorType.PRIMARY}>
                      {errors.phone.message?.toString()}
                    </Typography>
                  </Box>
                )}
              </Box>
              {currentUser?.fromGoogle && (
                <Box>
                  <Typography color="red" fontSize={11}>
                    Lưu ý: tài khoản này đăng kí qua Google, nên không cập nhật
                    được mật khẩu
                  </Typography>
                </Box>
              )}
            </Box>
            <Box mt={4}>
              <Button variant="contained" fullWidth size="small" type="submit">
                Cập nhật
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default UpdateInfo;
