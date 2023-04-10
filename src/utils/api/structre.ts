import { API } from "./core";

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

export { getStructre, updateStructure };
