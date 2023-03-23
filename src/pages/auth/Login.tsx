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
import { Color, SignInResponse } from "@/types";
import { signInWithPopup } from "firebase/auth";
import { loginAccount, signInWithGoogle } from "@/utils/api/api";
import { loginSuccess } from "@/redux/userSlice";
import { notification } from "@/utils/helper";
import { useDispatch } from "react-redux";
import { auth, provider } from "@/utils/firebase";
import { useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { BiHide, BiShow } from "react-icons/bi";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleLoginWithGoogle = async (): Promise<void> => {
    try {
      const infoEmail = await signInWithPopup(auth, provider);
      const data = (await signInWithGoogle({
        name: infoEmail.user.displayName,
        email: infoEmail.user.email,
        image: infoEmail.user.photoURL,
      })) as { data: SignInResponse };
      dispatch(loginSuccess(data.data));
      notification("success", data.data?.message);
      navigate("/");
    } catch (error) {
      notification("system");
    }
  };

  const handleLogin = async (data: FieldValues) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
      };
      const res = (await loginAccount(payload)) as {
        data: {
          status: number;
          message: string;
        };
      };
      if (res.data.status === 200) {
        dispatch(loginSuccess(res.data));
        notification("success", res.data.message);
        navigate("/");
      } else {
        notification("error", res.data.message);
      }
      reset();
    } catch (error) {
      notification("system");
    }
  };
  return (
    <Container>
      <Box display="flex" gap={20}>
        {isAboveMediumScreens && <img src={RegisterImg} alt="register-img" />}
        <Box flex="1" mt={4} px={4}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            ĐĂNG NHẬP TÀI KHOẢN
          </Typography>
          <form onSubmit={handleSubmit(handleLogin)}>
            <Box display="flex" flexDirection="column" gap={4} mt={4}>
              <Box>
                <TextField
                  placeholder="Email *"
                  size="small"
                  variant="standard"
                  fullWidth
                  {...register("email", {
                    required: "Trường không này không được để trống",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ",
                    },
                  })}
                />
                {errors.email && (
                  <Box mt={1}>
                    <Typography variant="subtitle2" color={Color.PRIMARY}>
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
                    required: "Trường không này không được để trống",
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
                    <Typography variant="subtitle2" color={Color.PRIMARY}>
                      {errors.password.message?.toString()}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <Box mt={4} display="flex" flexDirection="column" gap={4}>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                size="small"
                type="submit"
              >
                Đăng nhập
              </Button>
              <Button
                variant="contained"
                fullWidth
                color="error"
                size="small"
                onClick={handleLoginWithGoogle}
              >
                Đăng nhập Google
              </Button>
            </Box>
          </form>
          <Typography
            variant="subtitle2"
            mt={4}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Chưa có tài khoản ? Quý khách muốn{" "}
            <span style={{ color: Color.PRIMARY }}>Đăng kí</span>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
