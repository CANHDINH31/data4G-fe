import { ColorType } from "@/types";
import { NOT_NULL } from "@/utils/configs";
import { Typography } from "@mui/material";

const NotNull = () => {
  return (
    <Typography
      mt={2}
      variant="subtitle2"
      sx={{ color: `${ColorType.PRIMARY}` }}
    >
      {NOT_NULL}
    </Typography>
  );
};

export default NotNull;
