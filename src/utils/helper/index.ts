import { toast } from "react-toastify";
import { getStructre } from "../api/api";

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
