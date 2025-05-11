"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastProvider = () => {
  return <ToastContainer autoClose={3000} limit={1} position="top-right" />;
};

export default ToastProvider;
