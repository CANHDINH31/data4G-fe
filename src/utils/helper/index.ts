import { getStructre } from "@/utils/api";
import { toast } from "react-toastify";
import { toggleFavourite } from "../api";
import React from "react";
import { StructreType } from "@/types";

export const registerSMS = (title: string, tel: string): string => {
  return `sms:9123&body=${title.toLocaleUpperCase()} ${tel}`;
};

export const notification = (type: string, content?: string) => {
  switch (type) {
    case "success":
      toast.success(content);
      break;
    case "error":
      toast.error(content);
      break;
    case "info":
      toast.info(content);
      break;
    case "warn":
      toast.warn(content);
      break;
    case "system":
      toast.error("Lỗi hệ thống");
      break;
    default:
      break;
  }
};

export const handleToggleFavourite = async (
  id: string,
  currentUser: any,
  listFavourite: string[],
  setListFavourite: React.Dispatch<React.SetStateAction<string[]>>
) => {
  if (!currentUser?.name)
    return notification("warn", "Đăng nhập để sử dụng tính năng");
  try {
    await toggleFavourite({
      idUser: currentUser._id,
      idService: id,
    });
    const isExist = listFavourite.includes(id);
    if (isExist) {
      const newListFavourite = listFavourite.filter(element => element !== id);
      setListFavourite(newListFavourite);
      notification("success", "Đã xóa khỏi danh mục yêu thích");
    } else {
      setListFavourite([id, ...listFavourite]);
      notification("success", "Đã thêm vào danh mục yêu thích");
    }
  } catch (error) {
    notification("system");
  }
};

export const getInfoStruct = async (
  setRegisterSms?: React.Dispatch<React.SetStateAction<string>>,
  setRegisterLink?: React.Dispatch<React.SetStateAction<string>>,
  setOfferCheck?: React.Dispatch<React.SetStateAction<string>>,
  setTakeCareGuest?: React.Dispatch<React.SetStateAction<string>>,
  setZaloLink?: React.Dispatch<React.SetStateAction<string>>,
  setFacebookLink?: React.Dispatch<React.SetStateAction<string>>,
  setId?: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    const res = (await getStructre()) as {
      data: {
        data: StructreType;
      };
    };
    setRegisterSms && setRegisterSms(res.data.data.registerSms as string);
    setRegisterLink && setRegisterLink(res.data.data.registerLink as string);
    setOfferCheck && setOfferCheck(res.data.data.offerCheck as string);
    setTakeCareGuest && setTakeCareGuest(res.data.data.takeCareGuest as string);
    setZaloLink && setZaloLink(res.data.data.zaloLink as string);
    setFacebookLink && setFacebookLink(res.data.data.facebookLink as string);
    setId && setId(res.data.data._id as string);
  } catch (error) {
    notification("system");
  }
};

const removeDiacritics = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const convertToSlug = (text: string) => {
  const diacriticlessText = removeDiacritics(text);
  const slug = diacriticlessText.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  return slug;
};
