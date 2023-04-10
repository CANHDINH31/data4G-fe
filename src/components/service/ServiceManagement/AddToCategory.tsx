import DialogModal from "@/components/common/DialogModal";
import { MenuType } from "@/types";
import { ADD_SERVICE_TO_CATEGORY } from "@/utils/configs";
import { MenuItem, Select } from "@mui/material";

type Props = {
  isOpenAddTo: boolean;
  setIsOpenAddTo: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddTo: any;
  idSelected: string;
  setIdSelected: React.Dispatch<React.SetStateAction<string>>;
  listMenu: MenuType[];
};

const AddToCategory = ({
  isOpenAddTo,
  setIsOpenAddTo,
  handleAddTo,
  idSelected,
  setIdSelected,
  listMenu,
}: Props) => {
  return (
    <DialogModal
      type={ADD_SERVICE_TO_CATEGORY}
      isOpen={isOpenAddTo}
      handleClose={() => setIsOpenAddTo(false)}
      actionSubmit={handleAddTo}
    >
      <Select
        sx={{ width: "25vw" }}
        value={idSelected}
        label="Danh mục"
        onChange={e => setIdSelected(e.target.value)}
      >
        {listMenu?.map((menu: MenuType) => (
          <MenuItem value={menu.id} key={menu.id}>
            {menu.title}
          </MenuItem>
        ))}
      </Select>
    </DialogModal>
  );
};

export default AddToCategory;
