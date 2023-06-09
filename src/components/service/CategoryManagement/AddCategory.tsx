import DialogModal from "@/components/common/DialogModal";
import NotNull from "@/components/common/NotNull";
import { CategoryType } from "@/types";
import { ADD_CATEGORY } from "@/utils/configs";
import {
  Box,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type Props = {
  isOpenAdd: boolean;
  setIsOpenAdd: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddCategory: SubmitHandler<CategoryType>;
};

const AddCategory = ({ isOpenAdd, setIsOpenAdd, handleAddCategory }: Props) => {
  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryType>();

  const handleAddCategoryWithReset = (data: CategoryType) => {
    handleAddCategory(data);
    handeCloseAdd();
  };

  const handeCloseAdd = () => {
    setIsOpenAdd(false);
    reset();
  };

  return (
    <DialogModal
      type={ADD_CATEGORY}
      isOpen={isOpenAdd}
      handleClose={handeCloseAdd}
      actionSubmit={handleSubmit(handleAddCategoryWithReset)}
    >
      <Box>
        <TextField
          label="Tên danh mục"
          size="small"
          sx={{ minWidth: "25vw" }}
          {...register("title", { required: true })}
        />
        {errors.title && <NotNull />}
      </Box>
      <Box mt={2}>
        <TextField
          label="Tên trên Menu"
          sx={{ minWidth: "25vw" }}
          size="small"
          {...register("name", { required: true })}
        />
        {errors.name && <NotNull />}
      </Box>
      <Box mt={2}>
        <TextField
          label="Vị trí hiển thị (Số thứ tự)"
          type="number"
          sx={{ minWidth: "25vw" }}
          size="small"
          {...register("position", { required: true })}
        />

        {errors.position && <NotNull />}
      </Box>

      <Box mt={2}>
        <FormLabel>Hiển thị trên Menu: </FormLabel>
        <Controller
          name="display"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <RadioGroup
              row
              value={field.value?.toString()}
              onChange={e => field.onChange(e.target.value)}
            >
              <FormControlLabel value={true} control={<Radio />} label="Có" />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Không"
              />
            </RadioGroup>
          )}
        />
      </Box>
    </DialogModal>
  );
};

export default AddCategory;
