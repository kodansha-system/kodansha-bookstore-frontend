"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import { api } from "@/services/axios";

import MapComponent from "../components/Map";

const DetailShop = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const [detailShop, setDetailShop] = useState<any>();

  const handleGetDetailShop = async () => {
    const res = await api.get(`/shops/${slug}`);

    setDetailShop(res?.data);
  };

  useEffect(() => {
    handleGetDetailShop();
  }, []);

  return (
    <div className="m-auto w-[90%] rounded-md border bg-white p-5">
      <div>
        <iframe
          height="450"
          loading="lazy"
          src={detailShop?.google_map_url}
          width={"100%"}
        ></iframe>
      </div>

      <div className="mt-3">{detailShop?.address}</div>

      <div className="mt-3">Giờ hoạt động: {detailShop?.working_time}</div>
    </div>
  );
};

export default DetailShop;
