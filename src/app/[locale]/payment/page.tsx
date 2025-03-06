"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";

const shippingSchema = z.object({
  shippingMethod: z.string().min(1, "Vui lòng chọn đơn vị vận chuyển"),
});

const shippingOptions = [
  {
    id: "GHN",
    name: "Giao Hàng Nhanh",
    logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Orange.png",
    estimatedTime: "2-3 ngày",
    price: 30000,
  },
  {
    id: "GHTK",
    name: "Giao Hàng Tiết Kiệm",
    logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Orange.png",

    estimatedTime: "3-5 ngày",
    price: 25000,
  },
  {
    id: "VNPost",
    name: "VNPost",
    logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Orange.png",

    estimatedTime: "4-6 ngày",
    price: 20000,
  },
];

const Page = () => {
  const [selectedMethod, setSelectedMethod] = useState<any>(null);

  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      shippingMethod: "GHN",
    },
  });

  const onSubmit = (data: { shippingMethod: string }) => {
    console.log("Đơn vị vận chuyển đã chọn:", data.shippingMethod);
  };

  return (
    <>
      <div className="mx-[100px] pb-3 text-center text-[20px] font-medium">
        Thanh toán
      </div>

      <form
        className="mx-[100px] flex justify-center gap-x-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="w-3/5 rounded-md">
          <div className="mb-3 rounded-md border bg-white p-4">
            <div className="mb-3">Chọn đơn vị vận chuyển</div>

            <div className="pl-5">
              {shippingOptions.map((option) => (
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-md p-2 text-[15px] transition-all duration-500 ${
                    selectedMethod === option.id ? "bg-blue-50" : ""
                  }`}
                  key={option.id}
                >
                  <input
                    style={{ width: "18px", height: "18px" }}
                    type="radio"
                    value={option.id}
                    {...form.register("shippingMethod")}
                    onChange={() => setSelectedMethod(option.id)}
                  />

                  {option.logo && (
                    <Image
                      alt={`logo ${option.id}`}
                      className="rounded-md"
                      height={30}
                      src={option.logo}
                      width={30}
                    />
                  )}

                  <div>
                    <p className="font-medium">{option.name}</p>

                    <p className="text-sm text-gray-500">
                      Thời gian giao dự kiến: {option.estimatedTime}
                    </p>

                    <p className="text-sm text-gray-500">
                      Phí vận chuyển:{" "}
                      <span className="font-medium text-green-500">
                        {option.price.toLocaleString()}đ
                      </span>
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="w-full rounded-md border bg-white p-5 pb-[30px]">
            <div className="my-3 text-center text-[20px] font-medium text-blue-500">
              Xác nhận các sản phẩm bạn muốn đặt
            </div>

            <div className="mt-5 flex w-full flex-col flex-wrap items-center justify-center gap-5">
              {[1, 2, 3]?.map((item, index) => {
                return (
                  <div
                    className="flex w-[550px] items-center gap-3 rounded-md border border-gray-200 p-2 shadow-md"
                    key={index}
                  >
                    <Image
                      alt=""
                      className="h-[120px] rounded-md border object-cover p-1"
                      height={200}
                      src="https://danviet.mediacdn.vn/296231569849192448/2023/8/26/sach-nna-ban-tieng-anh-16930541445461508724279.jpg"
                      width={100}
                    />

                    <div className="flex flex-col gap-y-2 text-base">
                      <div className="line-clamp-2 text-gray-900">
                        Tôi thấy hoa vàng trên cỏ xanh
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            color={i < 5 ? "#FFD700" : "#C0C0C0"}
                            fill={i < 5 ? "#FFD700" : "#C0C0C0"}
                            key={i}
                            size={14}
                          />
                        ))}{" "}
                        | Đã bán 2000
                      </div>

                      <div className="font-medium text-red-500">250.000đ</div>

                      <div className="text-sm text-gray-500">Số lượng: 2</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <div className="w-[350px] rounded-md border bg-white p-4">
            <div className="mb-1 flex items-center justify-between">
              <div className="text-gray-500">Giao tới</div>

              <div className="text-base text-blue-500">Thay đổi</div>
            </div>

            <div className="text-base font-medium text-black">
              Lương Minh Anh | 0357227195
            </div>

            <div className="mt-1 overflow-hidden whitespace-normal break-words text-sm text-gray-400">
              Ký túc xá Trường ĐH Công Nghiệp Hà Nội, Phường Minh Khai, Quận Bắc
              Từ Liêm, Hà Nội
            </div>
          </div>

          <div className="mt-3 flex w-[350px] flex-col gap-y-2 rounded-md border bg-white p-4">
            <div className="flex justify-between">
              <div>Tổng tiền hàng: </div>

              <div className="text-black">300.000đ</div>
            </div>

            <div className="flex justify-between">
              <div>Giảm giá trực tiếp: </div>

              <div className="text-green-300">-100.000đ</div>
            </div>

            <div className="flex justify-between">
              <div>Mã giảm giá từ Shelfly: </div>

              <div className="text-green-300">-30.000đ</div>
            </div>

            <div className="size-px w-[320px] border border-gray-200"></div>

            <div className="flex justify-between">
              <div>Tổng tiền hàng: </div>

              <div className="text-[20px] font-bold text-red-500">170.000đ</div>
            </div>

            <Button
              className="mt-5 w-full bg-red-500 hover:bg-red-400"
              type="submit"
            >
              Mua hàng
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Page;
