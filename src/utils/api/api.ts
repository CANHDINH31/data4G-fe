import { GoogleAuthPayload } from "@/types";
import { API } from "./core";

// AUTH API
const signInWithGoogle = async (payload: GoogleAuthPayload) => {
  try {
    const res = await API.post("/auth/google", payload);
    return res;
  } catch (error) {
    return error;
  }
};

const registerAccount = async (payload: {
  name: string;
  password: string;
  email: string;
  phone?: string;
}) => {
  try {
    const res = await API.post("/auth/register", payload);
    return res;
  } catch (error) {
    return error;
  }
};

const loginAccount = async (payload: { password: string; email: string }) => {
  try {
    const res = await API.post("/auth/login", payload);
    return res;
  } catch (error) {
    return error;
  }
};
// USER API
const getUserInfo = async (id: string): Promise<any> => {
  try {
    const res = await API.get("/users/find/" + id);
    return res;
  } catch (error) {
    return error;
  }
};

const toggleFavourite = async (payload: {
  idUser: string;
  idService: string;
}): Promise<any> => {
  try {
    const res = await API.post("/users/toggle-favourite", payload);
    return res;
  } catch (error) {
    return error;
  }
};

// CATEGORY API
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

const createCategory = async (payload: { title: string }): Promise<any> => {
  try {
    const res = await API.post("/category", payload);
    return res;
  } catch (error) {
    return error;
  }
};

const updateCategory = async (
  id: string,
  payload: {
    title: string;
    listService: Array<string> | null;
  }
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

// SERVICE API
const addServiceToCategory = async (payload: {
  idCategory: string;
  idService: Array<string>;
}): Promise<any> => {
  try {
    const res = await API.post("/service/add-to-category", payload);
    return res;
  } catch (error) {
    return error;
  }
};

const searchService = async (title: string): Promise<any> => {
  try {
    const res = await API.get("/service/search?title=" + title);
    return res;
  } catch (error) {
    return error;
  }
};

const createService = async (payload: {
  title: string;
  price: string;
  content: string;
}): Promise<any> => {
  try {
    const res = await API.post("/service", payload);
    return res;
  } catch (error) {
    return error;
  }
};

const getListService = async (): Promise<any> => {
  try {
    const res = await API.get("/service");
    return res;
  } catch (error) {
    return error;
  }
};

const updateService = async (
  id: string,
  payload: { title: string; price: string; content: string }
) => {
  try {
    const res = await API.put("/service/" + id, payload);
    return res;
  } catch (error) {
    return error;
  }
};

const deleteService = async (payload: { listId: Array<string> }) => {
  try {
    const res = await API.post("/service/delete-service", payload);
    return res;
  } catch (error) {
    return error;
  }
};

// STRUCTRE

const getStructre = async () => {
  try {
    const res = await API.get("/structre");
    return res;
  } catch (error) {
    return error;
  }
};

const updateStructure = async (
  id: string,
  payload: {
    phone: string;
  }
): Promise<any> => {
  try {
    const res = await API.put("/structre/" + id, payload);
    return res;
  } catch (error) {
    return error;
  }
};

export {
  signInWithGoogle,
  registerAccount,
  loginAccount,
  getUserInfo,
  toggleFavourite,
  createCategory,
  getListCategory,
  searchCategory,
  updateCategory,
  deleteCategory,
  createService,
  getListService,
  searchService,
  deleteService,
  updateService,
  addServiceToCategory,
  getStructre,
  updateStructure,
};
