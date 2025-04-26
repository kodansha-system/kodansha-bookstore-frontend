"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { api } from "@/services/axios";
import {
  DATE_FORMAT,
  OrderStatus,
  OrderStatusText,
} from "@/services/constants";
import dayjs from "dayjs";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProductCard from "./components/ProductCard";

enum TabEnum {
  ALL = "all",
  IN_PROGRESS = "in_progress",
  SHIPPING = "shipping",
  DELIVERED = "delivered",
  CANCELED = "canceled",
}
const tabs = [
  { value: TabEnum.ALL, label: "Tất cả đơn" },
  { value: TabEnum.IN_PROGRESS, label: "Đang xử lý" },
  { value: TabEnum.SHIPPING, label: "Đang vận chuyển" },
  { value: TabEnum.DELIVERED, label: "Đã giao" },
  { value: TabEnum.CANCELED, label: "Đã huỷ" },
];

const Page = () => {
  const [activeTab, setActiveTab] = useState("all");

  const [listOrder, setListOrder] = useState([]);
  const router = useRouter();

  const handleGetOrderStatus = () => {
    switch (activeTab) {
      case TabEnum.ALL:
        return [];
      case TabEnum.IN_PROGRESS:
        return [OrderStatus.New, OrderStatus.WaitingPickup];
      case TabEnum.SHIPPING:
        return [
          OrderStatus.PickingUp,
          OrderStatus.PickedUp,
          OrderStatus.Delivering,
          OrderStatus.DeliveryFailed,
          OrderStatus.Returning,
          OrderStatus.Returned,
          OrderStatus.Reconciled,
          OrderStatus.CustomerReconciled,
          OrderStatus.CodTransferred,
          OrderStatus.WaitingCodPayment,
          OrderStatus.Delay,
          OrderStatus.PartiallyDelivered,
          OrderStatus.Error,
        ];
      case TabEnum.DELIVERED:
        return [OrderStatus.Completed];
      case TabEnum.CANCELED:
        return [OrderStatus.Cancelled];
    }
  };

  const handleGetListOrder = async () => {
    const res = await api.get("/orders/my-order", {
      params: {
        order_status: handleGetOrderStatus(),
      },
    });

    setListOrder(res?.data);
  };

  const handleViewDetailOrder = (id: string) => {
    router.push(`/my-order/${id}`);
  };

  useEffect(() => {
    handleGetListOrder();
  }, [activeTab]);

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
          <TabsList className="grid w-full grid-cols-5">
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

          {/* <form className="mt-2">
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
          </form> */}

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {listOrder &&
                listOrder?.length > 0 &&
                listOrder?.map((item: any, index) => {
                  return (
                    <div
                      className="mt-5 rounded-md border-2 p-5 px-6"
                      key={index}
                      onClick={() => handleViewDetailOrder(item?.id)}
                    >
                      <div className="flex justify-between font-medium">
                        <div className="pb-3 text-[16px]">
                          Ngày đặt hàng:&nbsp;
                          <span>
                            {dayjs(item?.created_at).format(
                              DATE_FORMAT.DAY_AND_TIME,
                            )}
                          </span>
                        </div>

                        <div>
                          Trạng thái:&nbsp;
                          <span className="text-blue-500">
                            {OrderStatusText[item?.order_status as OrderStatus]}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        {item?.books.map((item: any, index: number) => (
                          <ProductCard item={item} key={index} />
                        ))}
                      </div>

                      <div className="mt-4 flex justify-end border-t pt-3 text-sm">
                        <div>
                          Tổng đơn:&nbsp;
                          <span className="text-base font-medium text-red-500">
                            {item?.total_to_pay.toLocaleString()}đ
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
