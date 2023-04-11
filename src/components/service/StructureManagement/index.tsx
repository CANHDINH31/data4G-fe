import { ColorType, StructreType } from "@/types";
import { updateStructure } from "@/utils/api";
import { NOT_NULL } from "@/utils/configs";
import { getInfoStruct, notification } from "@/utils/helper";
import { Box, Paper, TextField, Typography, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const StructureManagement = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [offerCheck, setOfferCheck] = useState<string>("");
  const [registerSms, setRegisterSms] = useState<string>("");
  const [registerLink, setRegisterLink] = useState<string>("");
  const [zaloLink, setZaloLink] = useState<string>("");
  const [facebookLink, setFacebookLink] = useState<string>("");
  const [takeCareGuest, setTakeCareGuest] = useState<string>("");
  const [id, setId] = useState<string>("");

  const handleUpdate = async (data: StructreType) => {
    try {
      const res = await updateStructure(id, data);
      notification("success", res.data.message);
    } catch (error) {
      notification("system");
    }
  };

  const handleUpdateField = () => {
    setValue("offerCheck", offerCheck);
    setValue("registerSms", registerSms);
    setValue("registerLink", registerLink);
    setValue("zaloLink", zaloLink);
    setValue("facebookLink", facebookLink);
    setValue("takeCareGuest", takeCareGuest);
    setValue("id", id);
  };

  const fetchDataStruct = async () => {
    try {
      await getInfoStruct(
        setRegisterSms,
        setRegisterLink,
        setOfferCheck,
        setTakeCareGuest,
        setZaloLink,
        setFacebookLink,
        setId
      );
    } catch (error) {
      notification("system");
    }
  };

  useEffect(() => {
    fetchDataStruct();
  }, []);

  useEffect(() => {
    handleUpdateField();
  }, [fetchDataStruct]);

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
                  required: NOT_NULL,
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
                  required: NOT_NULL,
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
                  required: NOT_NULL,
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
                  required: NOT_NULL,
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
                  required: NOT_NULL,
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
                  required: NOT_NULL,
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
