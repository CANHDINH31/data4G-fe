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
      listService: typeService[];
      fromGoogle?: boolean;
    };
  };
}

export type typeService = {
  _id: string;
  title: string;
  price: string;
  content: string;
};

export type typeCategory = {
  _id: string;
  title: string;
  listService: typeService[];
};

export type typeUser = {
  _id: string;
  id?: string;
  email: string;
  name: string;
  isAdmin: boolean;
  image: string;
  listService: typeService[];
} | null;

export interface SignInResponse {
  message: string;
}
