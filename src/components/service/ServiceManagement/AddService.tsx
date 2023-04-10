import DialogModal from "@/components/common/DialogModal";
import { ColorType, ServiceType } from "@/types";
import { ADD_SERVICE } from "@/utils/configs";
import { Box, TextField, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { TextAreaCustom } from "./comon/TextAreaCustom";

type Props = {
  isOpenAdd: boolean;
  setIsOpenAdd: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddService: SubmitHandler<ServiceType>;
};

const AddService = ({ isOpenAdd, setIsOpenAdd, handleAddService }: Props) => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceType>();

  const handleAddServiceWithReset = (data: ServiceType) => {
    handleAddService(data);
    handeCloseAdd();
  };

  const handeCloseAdd = () => {
    setIsOpenAdd(false);
    reset();
  };
  return (
    <DialogModal
      type={ADD_SERVICE}
      isOpen={isOpenAdd}
      handleClose={handeCloseAdd}
      actionSubmit={handleSubmit(handleAddServiceWithReset)}
    >
      <Box mt={2}>
        <TextField
          label="Tên dịch vụ"
          sx={{ width: "25vw" }}
          size="small"
          {...register("title", { required: true })}
        />
        {errors.title && (
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
          {...register("price", { required: true })}
        />
        {errors.price && (
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
          {...register("content", { required: true })}
        />
        {errors.content && (
          <Typography
            mt={2}
            variant="subtitle2"
            sx={{ color: `${ColorType.PRIMARY}` }}
          >
            Nhập nội dung để tạo danh mục
          </Typography>
        )}
      </Box>
    </DialogModal>
  );
};

export default AddService;
