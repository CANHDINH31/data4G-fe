import { ColorType, ServiceType } from "@/types";
import { getListService } from "@/utils/api";
import { notification } from "@/utils/helper";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  AiOutlineFolderAdd,
  AiOutlineSearch,
  AiOutlineUnorderedList,
} from "react-icons/ai";

type Props = {
  setIsOpenDialogAdd: React.Dispatch<React.SetStateAction<boolean>>;
  handleSearch: SubmitHandler<{
    search: string;
  }>;
  setListService: React.Dispatch<React.SetStateAction<ServiceType[]>>;
};

const SettingService = ({
  setIsOpenDialogAdd,
  handleSearch,
  setListService,
}: Props) => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ search: string }>();

  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit(handleSearch);
    }
  };

  const fetchListService = async (): Promise<any> => {
    try {
      const data = await getListService();
      const serviceList = data?.data?.map((service: ServiceType) => ({
        id: service._id,
        title: service.title,
        price: service.price,
        content: service.content,
      }));
      setListService(serviceList);
    } catch (error) {
      notification("system");
    }
  };

  const handleSearchWithReset = (data: { search: string }) => {
    handleSearch(data);
    reset();
  };

  useEffect(() => {
    fetchListService();
  }, []);

  return (
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
        <form onSubmit={handleSubmit(handleSearchWithReset)}>
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <TextField
                variant="standard"
                sx={{ width: "100%" }}
                size="small"
                placeholder="Tìm kiếm theo tên dịch vụ ..."
                onKeyPress={handleEnterPress}
                {...register("search", { required: true })}
              />
              {errors.search && (
                <Typography
                  mt={2}
                  variant="subtitle2"
                  sx={{ color: `${ColorType.PRIMARY}` }}
                >
                  Nhập tên dịch vụ để tìm kiếm
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
  );
};
export default SettingService;
