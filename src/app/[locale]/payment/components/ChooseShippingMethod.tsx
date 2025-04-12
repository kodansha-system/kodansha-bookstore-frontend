"use client";

import { useEffect, useState } from "react";

import { apiShipping } from "@/services/shippingApi";

export const ChooseShippingMethod = ({
  form,
  setSelectedMethod,
  address,
  total,
  shippingOptions,
  setShippingOptions,
}: any) => {
  const handleGetListCarriers = async () => {
    const res = await apiShipping.post("/rates", {
      shipment: {
        address_from: {
          city: process.env.NEXT_PUBLIC_PROVINCE,
          district: process.env.NEXT_PUBLIC_DISTRICT,
        },
        address_to: {
          city: address?.province,
          district: address?.district,
        },
        parcel: {
          cod: total.price - total.discount,
          amount: total.price - total.discount,
          width: 20,
          height: 20,
          length: 20,
          weight: 3000,
        },
      },
    });

    setShippingOptions(
      res.data.map((item: any) => {
        return {
          id: item.id,
          name: item.carrier_name,
          price: item.total_fee,
          estimatedTime: item.expected,
          service: item.service,
        };
      }),
    );
  };

  useEffect(() => {
    handleGetListCarriers();
  }, [address]);

  return (
    <>
      <div className="my-4 text-base font-semibold text-gray-800">
        Chọn phương thức vận chuyển
      </div>

      <div className="grid w-full grid-cols-1 gap-4 pl-2 md:grid-cols-2 xl:grid-cols-3">
        {shippingOptions.map((option: any) => (
          <label
            className={`relative flex cursor-pointer items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md`}
            key={option.id}
          >
            <input
              type="radio"
              value={option.id}
              {...form.register("shippingMethod")}
              className="mt-1 size-4 accent-blue-500"
              onChange={() => {
                setSelectedMethod(option);
              }}
            />

            <div className="flex flex-col">
              <div className="text-base text-gray-800">
                {option.name}

                <div className="text-sm">({option.service})</div>
              </div>

              <p className="text-sm text-gray-400">
                Thời gian:&nbsp;
                <span className="text-green-500">{option.estimatedTime}</span>
              </p>

              <p className="text-sm text-gray-400">
                Phí vận chuyển:&nbsp;
                <span className="font-semibold text-green-600">
                  {option.price.toLocaleString()}đ
                </span>
              </p>
            </div>
          </label>
        ))}
      </div>
    </>
  );
};
