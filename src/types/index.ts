import { ServiceType } from "./service";

export enum Color {
  PRIMARY = "#EE0033",
  TEXT_COLOR = "#000000",
  TEXT_COLOR_SECONDARY = "#576C8A",
  BG_SECONDARY = "#eee",
  BG_WHITE = "#fff",
}

export type GoogleAuthPayload = {
  email: string | null;
  name: string | null;
  image: string | null;
};

export interface RootState {
  user: {
    currentUser: {
      _id: string;
      email: string;
      name: string;
      isAdmin: boolean;
      image: string;
      phone?: string;
      listService: ServiceType[];
      fromGoogle?: boolean;
    };
  };
}

export type typeUser = {
  _id: string;
  id?: string;
  email: string;
  name: string;
  isAdmin: boolean;
  image: string;
  password?: string;
  fromGoogle?: boolean;
  phone?: string;
  listService: ServiceType[];
} | null;

export interface SignInResponse {
  message: string;
}

export * from "./category";
export * from "./service";
