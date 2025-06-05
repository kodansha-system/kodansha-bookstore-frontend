import { toast } from "react-toastify";

import { type ClassValue, clsx } from "clsx";
import Cookies from "js-cookie";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (num: number): string | number => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k+`;
  }

  return num?.toString() || num;
};

export const checkIsLogin = () => {
  if (!Cookies.get("access_token")) {
    toast.error("Vui lòng đăng nhập để thực hiện chức năng này!");

    return false;
  }

  return true;
};
