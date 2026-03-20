import axios from "axios";
import { getApiBaseUrl } from "./baseUrl";
import { safeStorage } from "../utils/storage";

const ACCESS_TOKEN_KEY = "accessToken";
const LOGIN_ROUTE = "/login";

let authRedirectHandler = null;

export const setAuthRedirectHandler = (handler) => {
  authRedirectHandler = typeof handler === "function" ? handler : null;
};

const clearAuthToken = () => {
  safeStorage.remove(ACCESS_TOKEN_KEY);
};

const redirectToLogin = () => {
  if (typeof authRedirectHandler === "function") {
    authRedirectHandler(LOGIN_ROUTE);
    return;
  }

  if (typeof window !== "undefined" && window.location.pathname !== LOGIN_ROUTE) {
    window.location.replace(LOGIN_ROUTE);
  }
};

const notifyGlobalServerError = (error) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("api:server-error", {
      detail: {
        status: error.response?.status,
        message: error.response?.data?.message || "Server error",
      },
    })
  );
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = safeStorage.get(ACCESS_TOKEN_KEY);
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
    const status = error.response?.status;

    if (status === 401) {
      clearAuthToken();
      redirectToLogin();
      return Promise.reject(error);
    }

    if (!config) {
      return Promise.reject(error);
    }

    const shouldRetry =
      (!error.response || status >= 500) &&
      (config.method === "get" || config.method === "head");

    if (shouldRetry && config.metadata.retryCount < 2) {
      config.metadata.retryCount += 1;
      const backoff = 250 * 2 ** (config.metadata.retryCount - 1);
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return api(config);
    }

    if (status >= 500) {
      notifyGlobalServerError(error);
    }

    return Promise.reject(error);
  }
);

export default api;
