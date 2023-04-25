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
import { ColorType, ErrorType } from "@/types";
import { useLocation, useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { notification } from "@/utils/helper";
import { loginAccount, registerAccount } from "@/utils/api";
import { BiShow, BiHide } from "react-icons/bi";
import { useEffect, useState } from "react";
import { NOT_NULL } from "@/utils/configs";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { loginSuccess } from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import { auth, provider } from "@/utils/firebase";
import { signInWithGoogle } from "@/utils/api";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();

  const isRegister = location.pathname === "/register";

  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowRePassword, setIsShowRePassword] = useState<boolean>(false);
  const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const password = watch("password", "");

  const validateRePassword = (value: string) => {
    if (value !== password) {
      if (value !== password) {
        return "Mật khẩu nhập lại không khớp";
      }
    }
  };

  const handleAuth = async (data: FieldValues) => {
    try {
      // const res = (
      //   isRegister ? await registerAccount(data) : await loginAccount(data)
      // ) as {
      //   data: {
      //     status: number;
      //     message: string;
      //   };
      // };
      // if (res.data.status === 200) {
      //   notification("success", res.data.message);
      //   reset();
      //   isRegister ? navigate("/login") : navigate("/");
      //   !isRegister && dispatch(loginSuccess(res.data));
      // } else {
      //   notification("error", res.data.message);
      // }
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = res.user;
      const token = await user.getIdToken();
    } catch (error: any) {
      notification("error", error.message);
    }
  };

  const handleLoginWithGoogle = async (): Promise<void> => {
    try {
      const infoEmail = await signInWithPopup(auth, provider);
      const data = (await signInWithGoogle({
        name: infoEmail.user.displayName as string,
        email: infoEmail.user.email as string,
        image: infoEmail.user.photoURL as string,
      })) as { data: { message: string } };
      dispatch(loginSuccess(data.data));
      notification("success", data.data?.message);
      navigate("/");
    } catch (error) {
      notification("system");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container>
      <Box display="flex" gap={20}>
        {isAboveMediumScreens && <img src={RegisterImg} alt="register-img" />}
        <Box flex="1" mt={4} px={4}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {isRegister ? "ĐĂNG KÍ TÀI KHOẢN" : "ĐĂNG NHẬP TÀI KHOẢN"}
          </Typography>
          <form onSubmit={handleSubmit(handleAuth)}>
            <Box display="flex" flexDirection="column" gap={4} mt={4}>
              {isRegister && (
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
              )}
              <Box>
                <TextField
                  placeholder="Email *"
                  size="small"
                  variant="standard"
                  fullWidth
                  {...register("email", {
                    required: NOT_NULL,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ",
                    },
                  })}
                />
                {errors.email && (
                  <Box mt={1}>
                    <Typography variant="subtitle2" color={ColorType.PRIMARY}>
                      {errors.email.message?.toString()}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box>
                <TextField
                  placeholder="Mật khẩu *"
                  size="small"
                  variant="standard"
                  fullWidth
                  {...register("password", {
                    required: NOT_NULL,
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 kí tự",
                    },
                  })}
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
                    <Typography variant="subtitle2" color={ColorType.PRIMARY}>
                      {errors.password.message?.toString()}
                    </Typography>
                  </Box>
                )}
              </Box>
              {isRegister && (
                <>
                  <Box>
                    <TextField
                      placeholder="Nhập lại mật khẩu *"
                      size="small"
                      variant="standard"
                      fullWidth
                      {...register("rePassword", {
                        required: NOT_NULL,
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
                        <Typography
                          variant="subtitle2"
                          color={ColorType.PRIMARY}
                        >
                          {errors.phone.message?.toString()}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Box>
            <Box mt={4} display="flex" flexDirection="column" gap={4}>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                size="small"
                type="submit"
              >
                {isRegister ? "Đăng kí" : "Đăng nhập"} tài khoản
              </Button>
              {!isRegister && (
                <Button
                  variant="contained"
                  fullWidth
                  color="error"
                  size="small"
                  onClick={handleLoginWithGoogle}
                >
                  Đăng nhập Google
                </Button>
              )}
            </Box>
          </form>

          <Typography
            variant="subtitle2"
            mt={4}
            sx={{ cursor: "pointer" }}
            onClick={() => {
              isRegister ? navigate("/login") : navigate("/register");
            }}
          >
            {isRegister ? "Đã" : "Chưa"} có tài khoản ? Quý khách muốn{" "}
            <span style={{ color: ColorType.PRIMARY }}>
              {isRegister ? "Đăng nhập" : "Đăng kí"}
            </span>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
