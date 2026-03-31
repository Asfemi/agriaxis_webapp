import { getOrgId, userToken } from "@/lib/utils";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.agriaxis.org/api/v1",
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
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("auth_token");
      // window.location.href = "/signin";
    }
    const serverMessage =
      error.response?.data?.error?.message ||
      "An unexpected error occurred";
    const customError = new Error(serverMessage);
    (customError as any).status = error.response?.status;

    return Promise.reject(customError);
  },
);

export default apiClient;
