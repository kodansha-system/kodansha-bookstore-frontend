"use client";

import React from "react";

import { useSearchParams } from "next/navigation";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  return (
    <div className="flex h-screen items-center justify-center text-[30px]">
      {status === "success" ? "Thanh toán thành công" : "Thanh toán thất bại"}
    </div>
  );
};

export default PaymentSuccess;
