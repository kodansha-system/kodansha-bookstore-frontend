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

import CancelOrderDialog from "./components/CancelOrderButton";
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
  { value: TabEnum.IN_PROGRESS, label: "Chờ xác nhận" },
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
        return [OrderStatus.New];
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
      <div className="mx-5 mb-5 text-[18px] font-medium lg:mx-[100px]">
        Đơn hàng của tôi
      </div>

      <div className="mx-5 rounded-md bg-white p-5 lg:mx-[100px]">
        <Tabs
          className="w-full overflow-auto"
          defaultValue="all"
          onValueChange={setActiveTab}
        >
          <TabsList className="flex w-full space-x-2 overflow-x-auto">
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

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {listOrder &&
                listOrder?.length > 0 &&
                listOrder?.map((item: any, index) => {
                  return (
                    <div
                      className="mt-5 rounded-md border-2 p-5 px-3 md:px-6"
                      key={index}
                    >
                      <div
                        className="mb-3 flex flex-wrap justify-between text-sm font-medium lg:text-[16px]"
                        onClick={() => handleViewDetailOrder(item?.id)}
                      >
                        <div className="pb-3">
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

                      <div className="flex flex-wrap gap-5 lg:grid lg:grid-cols-2">
                        {item?.books.map((item: any, index: number) => (
                          <ProductCard item={item} key={index} />
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-sm">
                        <div>
                          Tổng đơn:&nbsp;
                          <span className="text-base font-medium text-red-500">
                            {item?.total_to_pay.toLocaleString()}đ
                          </span>
                        </div>

                        {item?.order_status === OrderStatus.New && (
                          <CancelOrderDialog
                            orderId={item?.id}
                            refetch={handleGetListOrder}
                          />
                        )}
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
