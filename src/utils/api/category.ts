import { CategoryType } from "@/types";
import { API } from "./core";

const getListMenu = async (): Promise<any> => {
  try {
    const res = await API.get("/category/listmenu");
    return res;
  } catch (error) {
    return error;
  }
};
const getCategoryBySlug = async (slug: string): Promise<any> => {
  try {
    slug = slug || "goi-thang";
    const res = await API.get("/category/get-by-slug?slug=" + slug);
    return res;
  } catch (error) {
    return error;
  }
};

const searchCategory = async (title: string | undefined): Promise<any> => {
  try {
    const res = await API.get("/category/search?title=" + title);
    return res;
  } catch (error) {
    return error;
  }
};

const getListCategory = async (): Promise<any> => {
  try {
    const res = await API.get("/category");
    return res;
  } catch (error) {
    return error;
  }
};

const createCategory = async (payload: CategoryType): Promise<any> => {
  try {
    const res = await API.post("/category", payload);
    return res;
  } catch (error) {
    return error;
  }
};

const updateCategory = async (
  id: string,
  payload: CategoryType
): Promise<any> => {
  try {
    const res = await API.put("/category/" + id, payload);
    return res;
  } catch (error) {
    return error;
  }
};

const deleteCategory = async (payload: { listId: Array<string> }) => {
  try {
    const res = await API.post("/category/delete-category", payload);
    return res;
  } catch (error) {
    return error;
  }
};

export {
  getListMenu,
  createCategory,
  getListCategory,
  getCategoryBySlug,
  searchCategory,
  updateCategory,
  deleteCategory,
};
