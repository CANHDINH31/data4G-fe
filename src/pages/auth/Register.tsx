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
import { Color } from "@/types";
import { useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { notification } from "@/utils/helper";
import { registerAccount } from "@/utils/api/api";
import { BiShow, BiHide } from "react-icons/bi";
import { useEffect, useState } from "react";

const Register = () => {
  const navigate = useNavigate();
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

  const handleRegister = async (data: FieldValues) => {
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
        reset();
        navigate("/login");
      } else {
        notification("error", res.data.message);
      }
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
            ĐĂNG KÍ TÀI KHOẢN
          </Typography>
          <form onSubmit={handleSubmit(handleRegister)}>
            <Box display="flex" flexDirection="column" gap={4} mt={4}>
              <Box>
                <TextField
                  placeholder="Họ tên *"
                  size="small"
                  variant="standard"
                  fullWidth
                  {...register("name", {
                    required: "Trường không này không được để trống",
                  })}
                />
                {errors.name && (
                  <Box mt={1}>
                    <Typography variant="subtitle2" color={Color.PRIMARY}>
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
              <Box>
                <TextField
                  placeholder="Nhập lại mật khẩu *"
                  size="small"
                  variant="standard"
                  fullWidth
                  {...register("rePassword", {
                    required: "Trường không này không được để trống",
                    validate: validateRePassword,
                  })}
                  type={!isShowRePassword ? "password" : "text"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ cursor: "pointer" }}
                        onClick={() => setIsShowRePassword(!isShowRePassword)}
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
                    <Typography variant="subtitle2" color={Color.PRIMARY}>
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
                    <Typography variant="subtitle2" color={Color.PRIMARY}>
                      {errors.phone.message?.toString()}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <Box mt={4}>
              <Button
                variant="contained"
                fullWidth
                color="error"
                size="small"
                type="submit"
              >
                Đăng kí tài khoản
              </Button>
            </Box>
          </form>

          <Typography
            variant="subtitle2"
            mt={4}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Đã có tài khoản ? Quý khách muốn{" "}
            <span style={{ color: Color.PRIMARY }}>Đăng nhập</span>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
