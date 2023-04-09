import { ServiceType } from "./service";

export type CategoryType = {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  slug?: string;
  position?: number;
  display?: boolean;
  listService?: ServiceType[];
};
