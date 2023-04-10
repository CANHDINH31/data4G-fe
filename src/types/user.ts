import { ServiceType } from "./service";

export type RootStateType = {
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
};

export type UserType = {
  _id?: string;
  id?: string;
  email?: string;
  name?: string;
  isAdmin?: boolean;
  image?: string;
  password?: string;
  fromGoogle?: boolean;
  phone?: string;
  listService?: ServiceType[];
};

export type GoogleAuthPayloadType = {
  email?: string;
  name?: string;
  image?: string;
};
