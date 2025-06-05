import { toast } from "react-toastify";

import { useAuthStore } from "@/store/authStore";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const apiUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

const notifyLoginRequired = (() => {
  let shown = false;

  return () => {
    if (!shown) {
      toast.error("Bạn cần đăng nhập để tiếp tục");
      shown = true;
      // window.location.href = "/login";
      setTimeout(() => (shown = false), 3000);
    }
  };
})();

const refreshToken = async (): Promise<string> => {
  try {
    const response = await api.get(`/auth/refresh`);
    const newToken = response.data.access_token;

    Cookies.set("access_token", newToken);

    return newToken;
  } catch (error) {
    throw error;
  }
};

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<any>) => {
    const originalRequest: any = error.config;

    // Kiểm tra nếu lỗi không phải 401 hoặc request đã retry thì bỏ qua
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error?.response?.data || error);
    }

    originalRequest._retry = true;

    // Nếu đang refresh thì thêm vào hàng đợi
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshSubscribers.push((token) => {
          if (!token) {
            return reject(error);
          }
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshToken();

      onRefreshed(newToken);

      // Cập nhật token và thử lại request gốc
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      onRefreshed(null);

      // Xử lý khi refresh thất bại
      const authStore = useAuthStore.getState();

      authStore.logout();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
