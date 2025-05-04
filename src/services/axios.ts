import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const apiUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
const refreshToken = async () => {
  try {
    const response = await api.get(`/auth/refresh`);
    const newAccessToken = response.data.access_token;

    Cookies.set("access_token", newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Refresh token failed:", error);
    throw error;
  }
};

api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("access_token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },

  async (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: AxiosError<any>) => {
    const originalRequest: any = error.config;

    if (!error.status && error.message === "Network Error") {
      // window.location.reload();

      return;
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();

        isRefreshing = false;

        refreshSubscribers.forEach((callback) => callback(newToken));
        refreshSubscribers = [];

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        Cookies.remove("access_token");

        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 404) {
      return Promise.reject("404: Not found");
    }

    return Promise.reject(error?.response?.data);
  },
);
