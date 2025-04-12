"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { api } from "@/services/axios";
import {
  DATE_FORMAT,
  OrderStatus,
  OrderStatusText,
} from "@/services/constants";
import { useAuthStore } from "@/store/authStore";
import dayjs from "dayjs";

import BookTable from "../../payment/components/BookTable";
import OrderHistory from "../components/OrderHistory";

interface IOrder {
  user_id: {
    name: string;
  };
  address: {
    name: string;
    phone: string;
    detail: string;
  };
  total_price: number;
  discount: number;
  total_to_pay: number;
  carrier: {
    id: string;
    name: string;
    fee: number;
    order_code: OrderStatus;
  };
  tracking_order: { status: number; time: Date }[];
  books: {
    book_id: {
      name: string;
      price: number;
      images: string[];
      rating_average: number;
      id: string;
    };
    quantity: number;
    price: number;
    id: string;
    is_deleted: boolean;
    deleted_at: any;
  }[];
  order_status: number;
  vouchers: string[];
  paymethod: string;
  created_by: any;
  id: string;
  is_deleted: boolean;
  deleted_at: any;
  created_at: string;
  updated_at: string;
}

interface DetailOrderPageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: DetailOrderPageProps) => {
  const [dataOrder, setDataOrder] = useState<IOrder>();
  const { user } = useAuthStore();
  const router = useRouter();

  const handleGetDetailOrder = async () => {
    const res = await api.get(`/orders/${params?.id}`);

    setDataOrder(res?.data);
  };

  useEffect(() => {
    handleGetDetailOrder();
  }, []);

  return (
    <>
      <div className="mx-[100px] pb-3 text-center text-[20px] font-medium">
        Chi tiết đơn hàng
      </div>

      <div>
        <div className="rounded-md px-[100px]">
          <div className="flex justify-between">
            <div className="flex w-full flex-col gap-3 rounded-md py-5 pb-[30px] text-[15px]">
              <div>Tên người nhận: {dataOrder?.address?.name}</div>

              <div>Số điện thoại: {dataOrder?.address?.phone}</div>

              <div>Địa chỉ: {dataOrder?.address?.detail}</div>

              <div>Phương thức thanh toán: {dataOrder?.paymethod}</div>
            </div>

            <div className="flex w-full flex-col gap-3 rounded-md p-5 pb-[30px] text-[15px]">
              <div>Vận chuyển bởi: {dataOrder?.carrier?.name}</div>

              <div>
                Tổng tiền:{" "}
                <span className="font-bold text-red-500">
                  {dataOrder?.total_price?.toLocaleString()}
                </span>
              </div>

              <div>
                Trạng thái:{" "}
                {OrderStatusText[dataOrder?.order_status as OrderStatus]}
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-x-5">
            <div className="flex w-full justify-center rounded-md border bg-white p-5 pb-[30px] text-[15px]">
              <BookTable books={dataOrder?.books as any} />
            </div>

            <div className="flex min-w-[400px] justify-center rounded-md pb-[30px] text-[15px]">
              <OrderHistory
                events={dataOrder?.tracking_order?.map((item: any) => {
                  return {
                    date: dayjs(item?.time).format(DATE_FORMAT.DAY_AND_TIME),
                    description: OrderStatusText[item?.status as OrderStatus],
                    status: "completed",
                  };
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
