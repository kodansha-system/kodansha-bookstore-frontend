"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { api } from "@/services/axios";
import {
  DATE_FORMAT,
  OrderStatus,
  OrderStatusText,
  PAY_METHODS,
  PaymentMethodText,
  PaymentStatus,
} from "@/services/constants";
import { useAuthStore } from "@/store/authStore";
import dayjs from "dayjs";

import BookTable from "../../payment/components/BookTable";
import OrderHistory from "../components/OrderHistory";
import { ReviewProductDialog } from "../components/Review";

interface IOrder {
  user_id: {
    name: string;
  };
  shop_id: {
    address: string;
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
  payment_method: string;
  payment_status: PaymentStatus;
  note: string;
  delivery_address: any;
  created_by: any;
  id: string;
  is_deleted: boolean;
  deleted_at: any;
  created_at: string;
  updated_at: string;
  shop_pickup_expire_at: string;
  payment_expire_at: string;
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
  const [timeLeft, setTimeLeft] = useState<any>();
  const [paymentTimeLeft, setPaymentTimeLeft] = useState<any>();
  const handleGetDetailOrder = async () => {
    const res = await api.get(`/orders/${params?.id}`);

    setDataOrder(res?.data);
  };

  function getTimeLeft(deadline: string) {
    const targetTime = new Date(deadline).getTime();
    const now = new Date().getTime();
    const diff = targetTime - now;

    if (diff <= 0) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
        isExpired: true,
      };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
      isExpired: false,
    };
  }

  useEffect(() => {
    handleGetDetailOrder();
  }, []);

  useEffect(() => {
    if (
      dataOrder &&
      dataOrder.order_status !== OrderStatus.Cancelled &&
      dataOrder.shop_pickup_expire_at
    ) {
      const interval = setInterval(() => {
        const updatedTime = getTimeLeft(dataOrder.shop_pickup_expire_at);

        setTimeLeft(updatedTime);

        if (updatedTime.isExpired) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dataOrder]);

  useEffect(() => {
    if (
      dataOrder &&
      dataOrder.order_status !== OrderStatus.Cancelled &&
      dataOrder.payment_expire_at
    ) {
      const interval = setInterval(() => {
        const updatedTime = getTimeLeft(dataOrder.payment_expire_at);

        setPaymentTimeLeft(updatedTime);

        if (updatedTime.isExpired) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dataOrder]);

  const [productId, setProductId] = useState<string>();
  const [openReviewDialog, setOpenReviewDialog] = useState<boolean>(false);

  const handleReviewProduct = (id: string) => {
    setProductId(id);
    setOpenReviewDialog(true);
  };

  const [reviewedBookIds, setReviewedBookIds] = useState<string[]>([]);

  const fetchReviews = async () => {
    if (!dataOrder?.order_status || !dataOrder?.id) return;

    const res = await api.get(`/reviews?order_id=${dataOrder?.id}`);

    if (res?.data) {
      const ids = res.data.reviews?.map((r: any) => r.book_id);

      setReviewedBookIds(ids);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [dataOrder]);

  return (
    <>
      <div className="mx-[100px] pb-3 text-center text-[20px] font-medium">
        Chi tiết đơn hàng
      </div>

      <ReviewProductDialog
        handleGetDetailOrder={handleGetDetailOrder}
        open={openReviewDialog}
        orderId={params.id}
        productId={productId}
        setOpen={setOpenReviewDialog}
      />

      <div>
        <div className="rounded-md px-[50px] md:px-[100px]">
          <div className="flex justify-between">
            <div className="flex w-full flex-col gap-3 rounded-md py-5 pb-[30px] text-[15px]">
              <div>
                Tên người nhận: {dataOrder?.delivery_address?.customer_name}
              </div>

              <div>
                Số điện thoại: {dataOrder?.delivery_address?.phone_number}
              </div>

              <div>Địa chỉ: {dataOrder?.delivery_address?.full_address}</div>

              <div>
                Phương thức thanh toán:&nbsp;
                {PaymentMethodText[dataOrder?.payment_method as PAY_METHODS]}
              </div>

              {dataOrder?.note && (
                <div>
                  Ghi chú:&nbsp;
                  {dataOrder?.note}
                </div>
              )}

              {dataOrder?.payment_status === PaymentStatus.PENDING &&
                dataOrder?.order_status === OrderStatus.New &&
                paymentTimeLeft && (
                  <div>
                    Thời gian còn lại để thanh toán:&nbsp;
                    <span className="italic text-red-500">{`${paymentTimeLeft?.minutes} phút ${paymentTimeLeft?.seconds} giây`}</span>
                  </div>
                )}
            </div>

            <div className="flex w-full flex-col gap-3 rounded-md p-5 pb-[30px] text-[15px]">
              {dataOrder?.carrier?.name && (
                <div>Vận chuyển bởi: {dataOrder?.carrier?.name}</div>
              )}

              <div>
                Tổng tiền:&nbsp;
                <span className="font-bold text-red-500">
                  {dataOrder?.total_to_pay?.toLocaleString()}
                </span>
              </div>

              <div>
                Trạng thái:&nbsp;
                {OrderStatusText[dataOrder?.order_status as OrderStatus]}
              </div>

              {dataOrder?.order_status !== OrderStatus.Completed &&
                dataOrder?.order_status !== OrderStatus.Cancelled &&
                timeLeft && (
                  <div className="">
                    Thời gian còn lại để đến cửa hàng lấy sách:&nbsp;
                    <span className="italic text-red-500">{`${timeLeft?.days} ngày ${timeLeft?.hours} giờ ${timeLeft?.minutes} phút ${timeLeft?.seconds} giây`}</span>
                  </div>
                )}

              {dataOrder?.shop_id && (
                <div>
                  <div>
                    Địa chỉ nhận hàng:&nbsp; {dataOrder?.shop_id?.address}&nbsp;
                    <span className="cursor-pointer text-blue-500 underline">
                      (Chỉ đường)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:justify-between">
            <div className="flex w-full justify-center overflow-auto rounded-md border bg-white p-5 pb-[30px] text-[15px] md:w-[900px]">
              <BookTable
                books={dataOrder?.books as any}
                isOrderCompleted={
                  dataOrder?.order_status === OrderStatus.Completed
                }
                onReviewProduct={handleReviewProduct}
                reviewedBookIds={reviewedBookIds}
              />
            </div>

            <div className="flex w-full justify-center rounded-md pb-[30px] text-[15px] md:min-w-[400px] md:max-w-[400px]">
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
