"use client";

import React, { useState } from "react";

import Image from "next/image";

import { SearchIcon, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { value: "all", label: "Tất cả đơn" },
  { value: "pending", label: "Chờ thanh toán" },
  { value: "processing", label: "Đang xử lý" },
  { value: "shipping", label: "Đang vận chuyển" },
  { value: "delivered", label: "Đã giao" },
  { value: "canceled", label: "Đã huỷ" },
];

const Page = () => {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div>
      <div className="mx-[100px] mb-5 text-[18px] font-medium">
        Đơn hàng của tôi
      </div>

      <div className="mx-[100px] rounded-md bg-white p-5">
        <Tabs
          className="w-full"
          defaultValue="all"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-6">
            {tabs.map((tab) => (
              <TabsTrigger
                className="text-sm"
                key={tab.value}
                value={tab.value}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <form className="mt-2">
            <div className="mx-auto mt-4 flex items-center justify-center gap-3">
              Tìm kiếm:
              <Input
                className="h-[40px] w-[300px]"
                placeholder="06/03/2024, Nguyễn Nhật Ánh, ..."
              />
              <Button className="bg-blue-500 hover:bg-blue-400">
                Xác nhận
              </Button>
            </div>
          </form>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="mx-auto mt-5 max-w-screen-lg rounded-md border p-5 px-6">
                <div className="pb-3 text-[16px] font-medium">
                  Ngày đặt hàng:{" "}
                  <span className="text-blue-500">06/03/2024</span>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  {[1, 2, 3].map((item, index) => (
                    <div
                      className="flex items-center gap-3 rounded-md border border-gray-200 p-3 shadow-sm"
                      key={index}
                    >
                      <Image
                        alt=""
                        className="h-[120px] w-[100px] rounded-md border object-cover p-1"
                        height={200}
                        src="https://danviet.mediacdn.vn/296231569849192448/2023/8/26/sach-nna-ban-tieng-anh-16930541445461508724279.jpg"
                        width={100}
                      />

                      {/* Nội dung đơn hàng */}
                      <div className="flex flex-col gap-y-2 text-base">
                        <div className="line-clamp-2 font-medium text-gray-900">
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
                  ))}
                </div>

                <div className="mt-4 flex justify-between border-t pt-3 text-sm">
                  <div>
                    Tổng đơn:{" "}
                    <span className="text-base font-medium text-red-500">
                      300.000đ
                    </span>
                  </div>

                  <div>Trạng thái: Chờ xác nhận</div>
                </div>
              </div>

              <div className="mx-auto mt-5 max-w-screen-lg rounded-md border p-5 px-6">
                <div className="pb-3 text-[16px] font-medium">
                  Ngày đặt hàng:{" "}
                  <span className="text-blue-500">06/03/2024</span>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  {[1, 2, 3].map((item, index) => (
                    <div
                      className="flex items-center gap-3 rounded-md border border-gray-200 p-3 shadow-sm"
                      key={index}
                    >
                      <Image
                        alt=""
                        className="h-[120px] w-[100px] rounded-md border object-cover p-1"
                        height={200}
                        src="https://danviet.mediacdn.vn/296231569849192448/2023/8/26/sach-nna-ban-tieng-anh-16930541445461508724279.jpg"
                        width={100}
                      />

                      {/* Nội dung đơn hàng */}
                      <div className="flex flex-col gap-y-2 text-base">
                        <div className="line-clamp-2 font-medium text-gray-900">
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
                  ))}
                </div>

                <div className="mt-4 flex justify-between border-t pt-3 text-sm">
                  <div>
                    Tổng đơn:{" "}
                    <span className="text-base font-medium text-red-500">
                      300.000đ
                    </span>
                  </div>

                  <div>Trạng thái: Chờ xác nhận</div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
