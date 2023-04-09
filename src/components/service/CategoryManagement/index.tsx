import { useState } from "react";
import { Box } from "@mui/material";
import { SubmitHandler } from "react-hook-form";
import { CategoryType } from "@/types";
import {
  createCategory,
  deleteCategory,
  searchCategory,
  updateCategory,
} from "@/utils/api/api";
import { convertToSlug, notification } from "@/utils/helper";
import SettingCategory from "./SettingCategory";
import ListCategory from "./ListCategory";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import DeleteCategory from "./DeleteCategory";

const CategoryManagement = () => {
  const [isOpenDialogAdd, setIsOpenDialogAdd] = useState<boolean>(false);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] =
    useState<boolean>(false);
  const [isOpenDialogEdit, setIsOpenDialogEdit] = useState<boolean>(false);
  const [editCategory, setEditCategory] = useState<CategoryType>({});
  const [listCategory, setListCategory] = useState<CategoryType[]>([]);

  const [listIdDelete, setListIdDelete] = useState<Array<string>>([]);

  //ADD CATEGORY
  const handleAddCategory: SubmitHandler<CategoryType> = async data => {
    try {
      const payloads = {
        ...data,
        slug: convertToSlug(data.name as string),
        display: data.display,
      } as CategoryType;

      const res = await createCategory(payloads);
      const newCategory = res.data.data;
      setListCategory([
        {
          id: newCategory._id,
          ...newCategory,
        },
        ...listCategory,
      ]);
      notification("success", res.data.message);
    } catch (error) {
      notification("system");
    }
  };

  // UPDATE CATEGORY
  const handleOpenDialogEdit = (id: string) => {
    setIsOpenDialogEdit(true);
    const editCategory = listCategory.find(category => category.id === id);
    if (editCategory) {
      setEditCategory(editCategory);
    }
  };

  const handleEditCategory: SubmitHandler<CategoryType> = async (
    data,
    listService
  ) => {
    try {
      const res = await updateCategory(
        data.id as string,
        {
          ...data,
          slug: convertToSlug(data.name as string),
          listService,
        } as CategoryType
      );
      const newCategory = res.data.data;
      const newListCategory = listCategory.map(category => {
        if (category.id === newCategory._id) {
          return {
            id: newCategory._id,
            ...newCategory,
          };
        } else {
          return category;
        }
      });
      setListCategory(newListCategory);
      notification("success", res.data.message);
    } catch (error) {
      notification("system");
    }
  };

  // SEARCH CATEGORY
  const handleSearch: SubmitHandler<{
    search: string;
  }> = async query => {
    try {
      const data = await searchCategory(query.search);
      const categoryList = data?.data?.map((category: CategoryType) => ({
        id: category?._id,
        ...category,
      }));
      setListCategory(categoryList);
    } catch (error) {
      notification("system");
    }
  };

  // DELETE CATEGORY
  const handleOpenConfimDelete = (id: string, type: string): void => {
    setIsOpenConfirmDelete(true);
    if (type !== "multi") {
      setListIdDelete([id]);
    }
  };

  const hanldeDeleteCategory = async (event: Event): Promise<any> => {
    event?.preventDefault();
    const newListCategory = listCategory.filter(
      category => !listIdDelete.includes(category.id as string)
    );
    try {
      const res = (await deleteCategory({ listId: listIdDelete })) as {
        data: {
          message: string;
        };
      };
      setIsOpenConfirmDelete(false);
      setListCategory(newListCategory);
      notification("success", res.data.message);
    } catch (error) {
      notification("system");
    }
  };

  return (
    <>
      <Box sx={{ height: "50vh", width: "100%" }}>
        {/* SETTING CATEGORY */}
        <SettingCategory
          setListCategory={setListCategory}
          handleSearch={handleSearch}
          setIsOpenDialogAdd={setIsOpenDialogAdd}
        />
        {/* DISPLAY LIST */}
        <ListCategory
          listCategory={listCategory}
          listIdDelete={listIdDelete}
          setListIdDelete={setListIdDelete}
          handleOpenConfimDelete={handleOpenConfimDelete}
          handleOpenDialogEdit={handleOpenDialogEdit}
        />
      </Box>

      {/* DIALOG ADD */}
      <AddCategory
        isOpenAdd={isOpenDialogAdd}
        setIsOpenAdd={setIsOpenDialogAdd}
        handleAddCategory={handleAddCategory}
      />

      {/* DIALOG EDIT */}
      <EditCategory
        isOpenEdit={isOpenDialogEdit}
        setIsOpenEdit={setIsOpenDialogEdit}
        handleEditCategory={handleEditCategory}
        editCategory={editCategory}
      />

      {/* DIALOG CONFIRM DELETE */}
      <DeleteCategory
        isOpen={isOpenConfirmDelete}
        setIsOpen={setIsOpenConfirmDelete}
        hanldeDeleteCategory={hanldeDeleteCategory}
      />
    </>
  );
};

export default CategoryManagement;
