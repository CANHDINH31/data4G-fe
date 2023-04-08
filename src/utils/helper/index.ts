import { getStructre } from "@/utils/api/api";
import { toast } from "react-toastify";
import { toggleFavourite } from "../api/api";
import React from "react";

export const registerSMS = (title: string, tel: string): string => {
  return `sms:9123&body=${title.toLocaleUpperCase()} ${tel}`;
};

export const findId = (title: string): string => {
  let id = "";
  switch (title.toLocaleLowerCase()) {
    case "gói 6 tháng + 12 tháng":
      id = "year";
      break;
    case "gói theo tháng hot":
      id = "month";
      break;
    case "gói theo tháng mimax":
      id = "mimax";
      break;
    case "gói combo data + thoại":
      id = "combo";
      break;
    case "gói theo ngày":
      id = "day";
      break;
    case "gói combo miễn phí nội mạng + ngoại mạng":
      id = "phone";
      break;
    case "gói cho sim d-com":
      id = "d-com";
      break;

    default:
      break;
  }
  return id;
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
  setTakeCareGuest?: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    const res = (await getStructre()) as {
      data: {
        data: {
          registerSms: string;
          registerLink: string;
          offerCheck: string;
          takeCareGuest: string;
        };
      };
    };
    setRegisterSms && setRegisterSms(res.data.data.registerSms);
    setRegisterLink && setRegisterLink(res.data.data.registerLink);
    setOfferCheck && setOfferCheck(res.data.data.offerCheck);
    setTakeCareGuest && setTakeCareGuest(res.data.data.takeCareGuest);
  } catch (error) {
    notification("system");
  }
};
