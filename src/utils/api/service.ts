import { ServiceType } from "@/types";
import { API } from "./core";

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

const createService = async (payload: ServiceType): Promise<any> => {
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

const updateService = async (id: string, payload: ServiceType) => {
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

export {
  createService,
  getListService,
  searchService,
  deleteService,
  updateService,
  addServiceToCategory,
};
