import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { SubmitHandler } from "react-hook-form";
import { MenuType, ServiceType } from "@/types";
import {
  addServiceToCategory,
  createService,
  deleteService,
  getListCategory,
  searchService,
  updateService,
} from "@/utils/api";
import { notification } from "@/utils/helper";
import SettingService from "./SettingService";
import ListService from "./ListService";
import AddService from "./AddService";
import DeleteModal from "@/components/common/DeleteModal";
import { DELETE_SERVICE } from "@/utils/configs";
import EditService from "./EditService";
import AddToCategory from "./AddToCategory";

const CategoryManagement = () => {
  const [editService, setEditService] = useState<ServiceType>({});

  const [isOpenDialogAdd, setIsOpenDialogAdd] = useState<boolean>(false);
  const [isOpenDialogEdit, setIsOpenDialogEdit] = useState<boolean>(false);
  const [isOpenDialogAddToCategory, setIsOpenDialogAddToCategory] =
    useState<boolean>(false);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] =
    useState<boolean>(false);
  const [listService, setListService] = useState<ServiceType[]>([]);
  const [listIdDelete, setListIdDelete] = useState<Array<string>>([]);

  const [idSelectedCategory, setIdSelectedCategory] = useState<string>();
  const [listCategory, setListCategory] = useState<MenuType[]>([]);

  //ADD SERVICE
  const handleAddService: SubmitHandler<ServiceType> = async data => {
    try {
      const res = await createService(data);
      const newService = res.data.data;
      setListService([
        {
          id: newService._id,
          title: newService.title,
          price: newService.price,
          content: newService.content,
        },
        ...listService,
      ]);
      notification("success", res.data.message);
    } catch (error) {
      notification("system");
    }
  };

  // ADD SERVICE TO CATEGORY
  const handleOpenDialogAddToCategory = (): void => {
    setIsOpenDialogAddToCategory(true);
  };

  // EDIT SERVICE
  const handleOpenDialogEdit = (id: string) => {
    setIsOpenDialogEdit(true);
    const editService = listService.find(service => service.id === id);
    editService && setEditService(editService);
  };

  const handleEditService: SubmitHandler<ServiceType> = async data => {
    try {
      const res = (await updateService(data.id as string, {
        title: data.title,
        price: data.price,
        content: data.content,
      })) as {
        data: {
          message: string;
        };
      };
      const newListService = listService.map(service => {
        if (service.id === data.id) {
          return data;
        }
        return service;
      });
      setListService(newListService);
      notification("success", res.data.message);
    } catch (error) {
      notification("system");
    }
  };
  // SEARCH SERVICE
  const handleSearch: SubmitHandler<{
    search: string;
  }> = async query => {
    try {
      const data = await searchService(query.search);
      const serviceList = data?.data?.map((service: ServiceType) => ({
        id: service._id,
        title: service.title,
        price: service.price,
        content: service.content,
      }));
      setListService(serviceList);
    } catch (error) {
      notification("system");
    }
  };

  // DELETE SERVICE
  const handleOpenConfimDelete = (id: string, type: string): void => {
    setIsOpenConfirmDelete(true);
    if (type !== "multi") {
      setListIdDelete([id]);
    }
  };

  const hanldeDeleteService = async (event: Event): Promise<any> => {
    event?.preventDefault();
    const newListService = listService.filter(
      service => !listIdDelete.includes(service.id as string)
    );
    try {
      const res = (await deleteService({ listId: listIdDelete })) as {
        data: { message: string };
      };
      setIsOpenConfirmDelete(false);
      setListService(newListService);
      notification("success", res.data.message);
    } catch (error) {
      notification("system");
    }
  };

  // ADD SERVICE TO CATEGORY
  const handleAddToCategory = async (event: Event): Promise<any> => {
    event.preventDefault();
    try {
      if (idSelectedCategory) {
        await addServiceToCategory({
          idCategory: idSelectedCategory,
          idService: listIdDelete,
        });
      }
      setIsOpenDialogAddToCategory(false);
      notification("success", "Thêm vào danh mục thành công");
    } catch (error) {
      notification("system");
    }
  };

  // GET LIST CATEGORY
  const fetchListCategory = async (): Promise<any> => {
    try {
      const data = await getListCategory();
      const categoryList = data?.data?.map(
        (category: { _id: string; title: string }) => ({
          id: category._id,
          title: category.title,
        })
      );
      setIdSelectedCategory(categoryList[0].id);
      setListCategory(categoryList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchListCategory();
  }, []);

  return (
    <>
      <Box sx={{ height: "50vh", width: "100%" }}>
        {/* SETTING SERVICE */}
        <SettingService
          setIsOpenDialogAdd={setIsOpenDialogAdd}
          handleSearch={handleSearch}
          setListService={setListService}
        />
        {/* LIST SERVICE */}
        <ListService
          listService={listService}
          listIdDelete={listIdDelete}
          setListIdDelete={setListIdDelete}
          handleOpenConfimDelete={handleOpenConfimDelete}
          handleOpenDialogEdit={handleOpenDialogEdit}
          handleOpenDialogAddToCategory={handleOpenDialogAddToCategory}
        />
      </Box>

      {/* ADD SERVICE */}
      <AddService
        isOpenAdd={isOpenDialogAdd}
        setIsOpenAdd={setIsOpenDialogAdd}
        handleAddService={handleAddService}
      />

      {/* DIALOG ADD TO CATEGORY*/}
      <AddToCategory
        isOpenAddTo={isOpenDialogAddToCategory}
        setIsOpenAddTo={setIsOpenDialogAddToCategory}
        idSelected={idSelectedCategory as string}
        setIdSelected={
          setIdSelectedCategory as React.Dispatch<React.SetStateAction<string>>
        }
        listMenu={listCategory}
        handleAddTo={handleAddToCategory}
      />

      {/* EDIT SERVICE */}
      <EditService
        isOpenEdit={isOpenDialogEdit}
        setIsOpenEdit={setIsOpenDialogEdit}
        handleEditService={handleEditService}
        editService={editService}
      />

      {/* DELETE SERVICE */}
      <DeleteModal
        type={DELETE_SERVICE}
        isOpen={isOpenConfirmDelete}
        setIsOpen={setIsOpenConfirmDelete}
        hanldeDeleteCategory={hanldeDeleteService}
      />
    </>
  );
};

export default CategoryManagement;
