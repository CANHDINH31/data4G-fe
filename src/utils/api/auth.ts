import { GoogleAuthPayloadType } from "@/types";
import { API } from "./core";

// AUTH API
const signInWithGoogle = async (payload: GoogleAuthPayloadType) => {
  try {
    const res = await API.post("/auth/google", payload);
    return res;
  } catch (error) {
    return error;
  }
};

const registerAccount = async (payload: {
  name?: string;
  password?: string;
  email?: string;
  phone?: string;
}) => {
  try {
    const res = await API.post("/auth/register", payload);
    return res;
  } catch (error) {
    return error;
  }
};

const loginAccount = async (payload: { passwor?: string; email?: string }) => {
  try {
    const res = await API.post("/auth/login", payload);
    return res;
  } catch (error) {
    return error;
  }
};

export { signInWithGoogle, registerAccount, loginAccount };
