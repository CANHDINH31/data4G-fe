import DialogModal from "@/components/common/DialogModal";
import { Box, Typography } from "@mui/material";

type Props = {
  type: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hanldeDeleteCategory: any;
};

const DeleteModal = ({
  type,
  isOpen,
  setIsOpen,
  hanldeDeleteCategory,
}: Props) => {
  return (
    <DialogModal
      type={type}
      isOpen={isOpen}
      handleClose={() => setIsOpen(false)}
      actionSubmit={hanldeDeleteCategory}
    >
      <Box sx={{ width: "25vw" }}>
        <Typography variant="subtitle2">
          Bạn có chắc chắn {type.toLowerCase()} này ? khi xóa bạn sẽ không thể
          phục hồi !!!
        </Typography>
      </Box>
    </DialogModal>
  );
};

export default DeleteModal;
