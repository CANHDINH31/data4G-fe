import DialogModal from "@/components/common/DialogModal";
import NotNull from "@/components/common/NotNull";
import { ServiceType } from "@/types";
import { UPDATE_SERVICE } from "@/utils/configs";
import { Box, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { TextAreaCustom } from "./comon/TextAreaCustom";
import { useEffect } from "react";

type Props = {
  isOpenEdit: any;
  setIsOpenEdit: any;
  handleEditService: any;
  editService: any;
};

const EditService = ({
  isOpenEdit,
  setIsOpenEdit,
  handleEditService,
  editService,
}: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ServiceType>();

  const handleEditServiceWithService = (data: ServiceType) => {
    handleEditService(data);
    setIsOpenEdit(false);
  };

  useEffect(() => {
    setValue("id", editService.id);
    setValue("title", editService.title);
    setValue("price", editService.price);
    setValue("content", editService.content);
  }, [editService]);

  return (
    <DialogModal
      type={UPDATE_SERVICE}
      isOpen={isOpenEdit}
      handleClose={() => setIsOpenEdit(false)}
      actionSubmit={handleSubmit(handleEditServiceWithService)}
    >
      <Box mt={2}>
        <TextField
          label="Tên dịch vụ"
          sx={{ width: "25vw" }}
          size="small"
          {...register("title", { required: true })}
        />
        {errors.title && <NotNull />}
      </Box>
      <Box mt={2}>
        <TextField
          type="text"
          label="Giá dịch vụ"
          sx={{ width: "25vw" }}
          size="small"
          {...register("price", { required: true })}
        />
        {errors.price && <NotNull />}
      </Box>
      <Box mt={2}>
        <TextAreaCustom
          placeholder="Nhập nội dung dịch vụ"
          minRows={7}
          {...register("content", { required: true })}
        />
        {errors.content && <NotNull />}
      </Box>
    </DialogModal>
  );
};

export default EditService;
