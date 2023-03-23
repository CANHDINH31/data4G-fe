import axios from "axios";

let baseURL;
if (process.env.NODE_ENV === "production") {
  baseURL = "https://expensive-boa-yoke.cyclic.app/api/v1";
} else {
  baseURL = "http://localhost:8800/api/v1";
}

export const API = axios.create({
  baseURL: baseURL,
});
