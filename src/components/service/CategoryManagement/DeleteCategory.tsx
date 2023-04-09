import DialogModal from "@/components/common/DialogModal";
import { DELETE_CATEGORY } from "@/utils/configs";
import { Box, Typography } from "@mui/material";
import { SubmitHandler } from "react-hook-form";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hanldeDeleteCategory: any;
};

const DeleteCategory = ({ isOpen, setIsOpen, hanldeDeleteCategory }: Props) => {
  return (
    <DialogModal
      type={DELETE_CATEGORY}
      isOpen={isOpen}
      handleClose={() => setIsOpen(false)}
      actionSubmit={hanldeDeleteCategory}
    >
      <Box sx={{ width: "25vw" }}>
        <Typography variant="subtitle2">
          Bạn có chắc chắn xóa danh mục này ? khi xóa bạn sẽ không thể phục hồi
          !!!
        </Typography>
      </Box>
    </DialogModal>
  );
};

export default DeleteCategory;
