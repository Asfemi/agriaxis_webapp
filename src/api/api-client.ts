import { getOrgId, userToken } from "@/lib/utils";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.agriaxis.org/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-CSRF-TOKEN": "",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = userToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const orgId = getOrgId();
  if (orgId) {
    config.headers["X-ORG-ID"] = orgId;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("auth_token");

      // window.location.href = "/signin";
    }

    return Promise.reject(error);
  },
);

export default apiClient;
