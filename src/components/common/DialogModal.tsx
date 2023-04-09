import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
} from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";

interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <AiOutlineClose />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

type Props = {
  handleClose: () => void;
  isOpen: boolean;
  actionSubmit?: () => void;
  children: React.ReactNode;
  type: string;
};

const DialogModal = ({
  handleClose,
  isOpen,
  actionSubmit,
  children,
  type,
}: Props) => {
  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
    >
      <form onSubmit={actionSubmit}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          {type}
        </BootstrapDialogTitle>
        <DialogContent dividers>{children}</DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            size="small"
            variant="contained"
            color="error"
          >
            Hủy
          </Button>
          <Button size="small" variant="contained" type="submit">
            {type}
          </Button>
        </DialogActions>
      </form>
    </BootstrapDialog>
  );
};

export default DialogModal;
