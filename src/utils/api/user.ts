import { API } from "./core";

const getUserInfo = async (id: string): Promise<any> => {
  try {
    const res = await API.get("/users/find/" + id);
    return res;
  } catch (error) {
    return error;
  }
};

const updateInfoUser = async (
  id: string,
  payloads: {
    email?: string;
    name?: string;
    password?: string;
    phone?: string;
    fromGoogle?: boolean | string;
    isAdmin?: boolean | string;
  }
): Promise<any> => {
  try {
    const res = await API.put("/users/update-info/" + id, payloads);
    return res;
  } catch (error) {
    return error;
  }
};

const searchUser = async (query: string): Promise<any> => {
  try {
    const res = await API.get("/users/search-user?query=" + query);
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

const deleteUser = async (payload: { listId: Array<string> }) => {
  try {
    const res = await API.post("/users/delete-user", payload);
    return res;
  } catch (error) {
    return error;
  }
};

export { getUserInfo, searchUser, deleteUser, updateInfoUser, toggleFavourite };
