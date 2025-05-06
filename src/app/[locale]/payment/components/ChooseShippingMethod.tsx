"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { api } from "@/services/axios";
import { estimateParcelDimensions } from "@/services/constants";
import { apiShipping } from "@/services/shippingApi";
import { useCartStore } from "@/store/cartStore";

export const ChooseShippingMethod = ({
  form,
  setSelectedMethod,
  address,
  total,
  shippingOptions,
  setShippingOptions,
  books,
  setSelectedShopId,
  selectedShopId,
  setSelectedFreeshipVoucher,
}: any) => {
  const [isPickup, setIsPickup] = useState(false);
  const [shopsHaveBooks, setShopsHaveBooks] = useState<any>([]);
  const router = useRouter();
  const { books_order } = useCartStore();

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
          width: estimateParcelDimensions(books_order).width,
          height: estimateParcelDimensions(books_order).height,
          length: estimateParcelDimensions(books_order).length,
          weight: estimateParcelDimensions(books_order).weight,
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

  const handleGetShopsHaveBook = async () => {
    const res = await api.get("/shop-books/book", {
      params: {
        book_ids: books?.map((item: any) => item.id),
      },
    });

    setShopsHaveBooks(res?.data);
  };

  useEffect(() => {
    handleGetListCarriers();
  }, [address]);

  useEffect(() => {
    handleGetShopsHaveBook();
  }, [books]);

  useEffect(() => {
    if (shippingOptions.length > 0) {
      form.setValue("shippingMethod", shippingOptions[0].id);
      setSelectedMethod(shippingOptions[0]);
    }
  }, [shippingOptions]);

  return (
    <>
      <div className="my-4 text-base font-semibold text-gray-800">
        Chọn phương thức vận chuyển
      </div>

      <div className="my-4 flex gap-4">
        <label className="flex items-center gap-2">
          <input
            checked={isPickup}
            {...form.register("deliveryMethod")}
            onChange={() => {
              setIsPickup(true);
              setSelectedShopId(shopsHaveBooks?.[0]?.shop_id);
              setSelectedFreeshipVoucher(null);
              form.setValue("freeshipVoucher", null);
            }}
            type="radio"
            value="store_pickup"
          />
          Nhận tại cửa hàng
        </label>

        <label className="flex items-center gap-2">
          <input
            checked={!isPickup}
            {...form.register("deliveryMethod")}
            onChange={() => {
              setIsPickup(false);
              setSelectedShopId(null);
            }}
            type="radio"
            value="home_delivery"
          />
          Giao tại nhà
        </label>
      </div>

      {!isPickup && (
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
                <div className="text-[15px] text-gray-800">
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
      )}

      {isPickup && (
        <div>
          <div className="my-2 italic text-red-500">
            (Lưu ý: Bạn có 3 ngày để đến cửa hàng lấy sách, sau thời gian trên
            đơn hàng sẽ tự động hủy)
          </div>

          <div className="flex flex-wrap gap-3">
            {shopsHaveBooks?.map((data: any) => {
              const isSelected = selectedShopId === data.shop_id?.toString();

              return (
                <div
                  className={`w-[400px] cursor-pointer rounded-xl border bg-white p-2 px-4 ${
                    isSelected ? "border-green-500 !bg-green-50" : ""
                  }`}
                  key={data._id}
                  onClick={() => setSelectedShopId(data?.shop_id)}
                >
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {data?.shop?.address}
                  </div>

                  <div className="mt-1 text-sm text-gray-500">
                    Giờ hoạt động: {data?.shop?.working_time}
                  </div>

                  <div className="mt-1 text-sm text-gray-500">
                    Số điện thoại: {data?.shop?.phone}
                  </div>

                  <div
                    className="mt-1 cursor-pointer text-sm italic text-blue-500"
                    onClick={() => router.push(`/shops/${data?.shop_id}`)}
                  >
                    Chỉ đường
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
