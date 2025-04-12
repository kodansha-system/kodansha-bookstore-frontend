import axios, { AxiosError } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_SHIPPING_BASE_URL;

export const apiShipping = axios.create({
  baseURL: "/api/v2/",
  withCredentials: true,
});

apiShipping.interceptors.request.use(
  (config) => {
    const accessToken = process.env.NEXT_PUBLIC_SHIPPING_TOKEN;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },

  async (error) => Promise.reject(error),
);

apiShipping.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: AxiosError<any>) => {
    // if (!error.status && error.message === "Network Error") {
    //   window.location.reload();

    //   return;
    // }

    if (error.response?.status === 404) {
      return Promise.reject("404: Not found");
    }

    return Promise.reject(
      error?.response?.data?.error || error?.response?.data?.errors,
    );
  },
);
