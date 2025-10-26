import axios from "axios";

export const axiosRequest = axios.create({
  baseURL: "https://harixom-desarrollo.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});