import DialogModal from "@/components/common/DialogModal";
import { CategoryType, Color, ServiceType } from "@/types";
import { NOT_NULL, UPDATE_CATEGORY } from "@/utils/configs";
import {
  Box,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineDelete } from "react-icons/ai";

type Props = {
  isOpenEdit: any;
  setIsOpenEdit: any;
  handleEditCategory: any;
  editCategory: any;
};

const EditCategory = ({
  isOpenEdit,
  setIsOpenEdit,
  handleEditCategory,
  editCategory,
}: Props) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CategoryType>();

  const [listService, setListServie] = useState<ServiceType[]>([]);

  const handleRemoveService = (id: string): void => {
    const newService = listService.filter(service => service.id !== id);
    setListServie(newService);
  };

  const columnsEdit: GridColDef[] = [
    { field: "title", headerName: "Tên dịch vụ", width: 350 },
    {
      field: "setting",
      headerName: "",
      width: 50,
      renderCell: params => (
        <Box display="flex" gap="20px">
          <AiOutlineDelete
            style={{
              fontSize: "20px",
              cursor: "pointer",
              color: `${Color.PRIMARY}`,
            }}
            onClick={() => handleRemoveService(params.row.id)}
          />
        </Box>
      ),
    },
  ];

  const handleEditCategoryWithService = (data: CategoryType) => {
    handleEditCategory(data, listService as ServiceType[]);
    setIsOpenEdit(false);
  };

  useEffect(() => {
    const newListService = editCategory?.listService?.map(
      (service: ServiceType) => ({
        id: service._id,
        content: service.content,
        title: service.title,
        price: service.price,
      })
    );
    setValue("id", editCategory.id);
    setValue("title", editCategory.title);
    setValue("name", editCategory.name);
    setValue("position", editCategory.position);
    setValue("slug", editCategory.slug);
    setValue("display", editCategory.display);
    if (newListService) setListServie(newListService);
  }, [editCategory]);

  return (
    <DialogModal
      type={UPDATE_CATEGORY}
      isOpen={isOpenEdit}
      handleClose={() => setIsOpenEdit(false)}
      actionSubmit={handleSubmit(handleEditCategoryWithService)}
    >
      <Box>
        <TextField
          label="Tên danh mục"
          size="small"
          sx={{ minWidth: "25vw" }}
          {...register("title", { required: true })}
        />
        {errors.title && (
          <Typography
            mt={2}
            variant="subtitle2"
            sx={{ color: `${Color.PRIMARY}` }}
          >
            {NOT_NULL}
          </Typography>
        )}
      </Box>
      <Box mt={2}>
        <TextField
          label="Tên trên Menu"
          sx={{ minWidth: "25vw" }}
          size="small"
          {...register("name", { required: true })}
        />
        {errors.name && (
          <Typography
            mt={2}
            variant="subtitle2"
            sx={{ color: `${Color.PRIMARY}` }}
          >
            {NOT_NULL}
          </Typography>
        )}
      </Box>
      <Box mt={2}>
        <TextField
          label="Vị trí hiển thị (Số thứ tự)"
          type="number"
          sx={{ minWidth: "25vw" }}
          size="small"
          {...register("position", { required: true })}
        />

        {errors.position && (
          <Typography
            mt={2}
            variant="subtitle2"
            sx={{ color: `${Color.PRIMARY}` }}
          >
            {NOT_NULL}
          </Typography>
        )}
      </Box>

      <Box mt={2}>
        <FormLabel>Hiển thị trên Menu: </FormLabel>
        <Controller
          name="display"
          control={control}
          defaultValue={getValues("display")}
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
      <Box mt={2} sx={{ height: "50vh", width: "30vw" }}>
        <DataGrid
          rows={listService}
          columns={columnsEdit}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
        />
      </Box>
    </DialogModal>
  );
};

export default EditCategory;
