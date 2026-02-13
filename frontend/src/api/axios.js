import axios from "axios";
import { getApiBaseUrl } from "./baseUrl";
import { safeStorage } from "../utils/storage";

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = safeStorage.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.metadata = {
    retryCount: config.metadata?.retryCount ?? 0,
  };
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) {
      return Promise.reject(error);
    }

    const shouldRetry =
      (!error.response || error.response.status >= 500) &&
      (config.method === "get" || config.method === "head");

    if (shouldRetry && config.metadata.retryCount < 2) {
      config.metadata.retryCount += 1;
      const backoff = 250 * 2 ** (config.metadata.retryCount - 1);
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;
