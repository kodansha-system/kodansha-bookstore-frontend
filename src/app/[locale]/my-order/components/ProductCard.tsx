"use client";

import React, { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

const ProductCard = ({ item, key }: any) => {
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleViewDetailBook = async () => {
    router.push(`/books/${item?.book_id?._id}`);
  };

  useEffect(() => {
    // handleGetOrderStatus();
  }, []);

  return (
    <div
      className="flex items-center gap-3 rounded-md border border-gray-200 p-3 shadow-sm"
      onClick={handleViewDetailBook}
    >
      <Image
        alt=""
        className="h-[120px] w-[100px] rounded-md border object-cover p-1"
        height={200}
        src={item?.book_id?.images[0]}
        width={100}
      />

      {status}

      <div className="flex flex-col gap-y-2 text-base">
        <div className="line-clamp-2 font-medium text-gray-900">
          {item?.book_id?.name}
        </div>

        <div className="font-medium text-red-500">
          {item?.price?.toLocaleString()}đ
        </div>

        <div className="text-sm text-gray-500">Số lượng: {item?.quantity}</div>
      </div>
    </div>
  );
};

export default ProductCard;
