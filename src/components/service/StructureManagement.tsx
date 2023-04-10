import { ColorType } from "@/types";
import { getStructre, updateStructure } from "@/utils/api";
import { notification } from "@/utils/helper";
import { Box, Paper, TextField, Typography, Button, Grid } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

type StructreRespone = {
  offerCheck: SetStateAction<string>;
  registerSms: SetStateAction<string>;
  registerLink: SetStateAction<string>;
  zaloLink: SetStateAction<string>;
  facebookLink: SetStateAction<string>;
  takeCareGuest: SetStateAction<string>;
  _id: string;
};

const StructureManagement = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const [offerCheck, setOfferCheck] = useState<string>("");
  const [registerSms, setRegisterSms] = useState<string>("");
  const [registerLink, setRegisterLink] = useState<string>("");
  const [zaloLink, setZaloLink] = useState<string>("");
  const [facebookLink, setFacebookLink] = useState<string>("");
  const [takeCareGuest, setTakeCareGuest] = useState<string>("");

  const handleUpdate = async (data: FieldValues) => {
    try {
      const res = await updateStructure(
        getValues("id"),
        data as { phone: string }
      );
      handleUpdateField(res.data.data);
      notification("success", res.data.message);
    } catch (error) {
      notification("system");
    }
  };

  const handleUpdateField = (data: StructreRespone) => {
    setOfferCheck(data.offerCheck);
    setRegisterSms(data.registerSms);
    setRegisterLink(data.registerLink);
    setZaloLink(data.zaloLink);
    setFacebookLink(data.facebookLink);
    setTakeCareGuest(data.takeCareGuest);
    setValue("offerCheck", data.offerCheck);
    setValue("registerSms", data.registerSms);
    setValue("registerLink", data.registerLink);
    setValue("zaloLink", data.zaloLink);
    setValue("facebookLink", data.facebookLink);
    setValue("takeCareGuest", data.takeCareGuest);
    setValue("id", data._id);
  };

  useEffect(() => {
    const getInfoStructre = async () => {
      try {
        const res = (await getStructre()) as {
          data: {
            data: StructreRespone;
          };
        };
        handleUpdateField(res.data.data);
      } catch (error) {
        notification("system");
      }
    };
    getInfoStructre();
  }, []);

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Paper sx={{ padding: 4, width: "80%" }} elevation={3}>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <TextField
                label="Kiểm tra ưu đãi"
                variant="outlined"
                size="small"
                sx={{ width: "80%" }}
                {...register("offerCheck", {
                  required: "Trường này không được để trống",
                })}
                value={offerCheck}
                onChange={e => setOfferCheck(e.target.value)}
              />
              {errors.offerCheck && (
                <Box mt={1}>
                  <Typography variant="subtitle2" color={ColorType.PRIMARY}>
                    {errors.offerCheck?.message?.toString()}
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Đăng kí qua SMS"
                variant="outlined"
                size="small"
                sx={{ width: "80%" }}
                {...register("registerSms", {
                  required: "Trường này không được để trống",
                  pattern: {
                    value: /^0[35789]\d{8}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                })}
                value={registerSms}
                onChange={e => setRegisterSms(e.target.value)}
              />
              {errors.registerSms && (
                <Box mt={1}>
                  <Typography variant="subtitle2" color={ColorType.PRIMARY}>
                    {errors.registerSms?.message?.toString()}
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Đăng kí qua Link"
                variant="outlined"
                size="small"
                sx={{ width: "80%" }}
                {...register("registerLink", {
                  required: "Trường này không được để trống",
                })}
                value={registerLink}
                onChange={e => setRegisterLink(e.target.value)}
              />
              {errors.registerLink && (
                <Box mt={1}>
                  <Typography variant="subtitle2" color={ColorType.PRIMARY}>
                    {errors.registerLink?.message?.toString()}
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Liên hệ Zalo"
                variant="outlined"
                size="small"
                sx={{ width: "80%" }}
                {...register("zaloLink", {
                  required: "Trường này không được để trống",
                })}
                value={zaloLink}
                onChange={e => setZaloLink(e.target.value)}
              />
              {errors.zaloLink && (
                <Box mt={1}>
                  <Typography variant="subtitle2" color={ColorType.PRIMARY}>
                    {errors.zaloLink?.message?.toString()}
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Liên hệ Facebook"
                variant="outlined"
                size="small"
                sx={{ width: "80%" }}
                {...register("facebookLink", {
                  required: "Trường này không được để trống",
                })}
                value={facebookLink}
                onChange={e => setFacebookLink(e.target.value)}
              />
              {errors.facebookLink && (
                <Box mt={1}>
                  <Typography variant="subtitle2" color={ColorType.PRIMARY}>
                    {errors.facebookLink?.message?.toString()}
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Chăm sóc khách hàng"
                variant="outlined"
                size="small"
                sx={{ width: "80%" }}
                {...register("takeCareGuest", {
                  required: "Trường này không được để trống",
                  pattern: {
                    value: /^0[35789]\d{8}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                })}
                value={takeCareGuest}
                onChange={e => setTakeCareGuest(e.target.value)}
              />
              {errors.takeCareGuest && (
                <Box mt={1}>
                  <Typography variant="subtitle2" color={ColorType.PRIMARY}>
                    {errors.takeCareGuest?.message?.toString()}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="center" mt={4}>
            <Button variant="contained" size="small" type="submit">
              Cập nhật
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default StructureManagement;
