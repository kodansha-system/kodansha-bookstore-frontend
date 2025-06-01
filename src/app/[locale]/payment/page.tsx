"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";

import { api } from "@/services/axios";
import { DeliveryMethod, estimateParcelDimensions } from "@/services/constants";
import { apiShipping } from "@/services/shippingApi";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import BookTable from "./components/BookTable";
import { ChooseAddress } from "./components/ChooseAddress";
import { ChoosePaymentMethod } from "./components/ChoosePaymentMethod";
import { ChooseShippingMethod } from "./components/ChooseShippingMethod";
import { CountMoney } from "./components/CountMoney";
import DiscountSelector from "./components/DiscountSelector";

const shippingSchema = z.object({
  shippingMethod: z.any().optional(),
  paymentMethod: z.string().min(1, "Vui lòng chọn đơn vị vận chuyển"),
  address: z.any().optional(),
  freeshipVoucher: z.any().optional(),
  productVoucher: z.string().optional(),
  deliveryMethod: z.any().optional(),
});

const Page = () => {
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<any>({
    price: 0,
  });
  const [address, setAddress] = useState<any>(null);
  const { books_order } = useCartStore();
  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      shippingMethod: "",
      paymentMethod: "",
      freeshipVoucher: "",
      productVoucher: "",
      deliveryMethod: "",
    },
  });
  const [shippingOptions, setShippingOptions] = useState([]);
  const [sortedFreeshipVouchers, setSortedFreeshipVouchers] = useState([]);
  const [sortedProductVouchers, setSortedProductVouchers] = useState([]);
  const [selectedFreeshipVoucher, setSelectedFreeshipVoucher] = useState<any>();
  const [selectedProductVoucher, setSelectedProductVoucher] = useState<any>();
  const { user } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [totalToPay, setTotalToPay] = useState("0");

  const handleCreateShipment = async (data: any) => {
    const res = await apiShipping.post("/shipments", {
      shipment: {
        rate: data.shippingMethod,
        address_from: {
          city: "700000",
          district: "700100",
          ward: 8955,
          street: "Đường from",
          name: "Người gửi",
          phone: "09342391",
        },
        address_to: {
          city: address?.province,
          district: address?.district,
          ward: address?.ward,
          street: address?.detail,
          full_address: address?.full_address || address?.fullAddress,
          name: address?.customer_name || user.name,
          phone: address?.phone_number || user.phone,
        },
        parcel: {
          cod: total.price - total.discount,
          amount: total.price - total.discount,
          width: 20,
          height: 20,
          length: 20,
          weight: 1000,
          metadata: "Hàng dễ vỡ, vui lòng nhẹ tay",
        },
      },
    });

    return res;
  };

  const onSubmit = async (data: any) => {
    const flashSaleItemIndex = books_order?.findIndex(
      (item: any) => item?.is_flash_sale,
    );

    const flashSaleId =
      flashSaleItemIndex !== -1
        ? books_order?.[flashSaleItemIndex]?.flash_sale_id
        : undefined;

    try {
      setSubmitting(true);
      let dataOrder: any = {
        flash_sale_id: flashSaleId,
        delivery_method: data.deliveryMethod,
        shop_id: selectedShopId,
        total_to_pay: totalToPay,
        total_price: total.price,
        discount: total.discount,
        books: books_order?.map((item: any) => {
          return {
            book_id: item.id,
            price: item.price,
            quantity: Number(item.quantity),
            is_flash_sale: item.is_flash_sale || false,
            width: item.width,
            height: item.height,
            length: item.length,
            weight: item.weight,
          };
        }),
        payment_method: data.paymentMethod,
        vouchers: data.productVoucher ? [data.productVoucher] : null,
      };

      if (data?.deliveryMethod === DeliveryMethod.HOME_DELIVERY) {
        dataOrder = {
          ...dataOrder,
          delivery_address: {
            phone_number: address?.phone_number || user.phone,
            customer_name: address?.customer_name || user.name,
            city: address?.province,
            district: address?.district,
            ward: address?.ward,
            street: address?.detail,
            full_address: address?.full_address || address?.fullAddress,
          },
          parcel: {
            cod: totalToPay,
            amount: totalToPay,
            width: estimateParcelDimensions(books_order).width,
            height: estimateParcelDimensions(books_order).height,
            length: estimateParcelDimensions(books_order).length,
            weight: estimateParcelDimensions(books_order).weight,
          },
          carrier: {
            id: data.shippingMethod,
            name: selectedShippingMethod.name,
            fee: selectedShippingMethod.price,
          },
        };
      }

      const res = await api.post("/orders", dataOrder);

      toast.success("Tạo đơn hàng thành công!");

      if (res?.data?.order?.payment_link) {
        router.push(res?.data?.order?.payment_link);
      } else {
        router.push("/my-order");
      }

      setSubmitting(false);
    } catch (error: any) {
      setSubmitting(false);
      toast.error(error?.message || "Tạo đơn hàng không thành công!");
      console.log(error);
    }
  };

  const total = useMemo(() => {
    const price =
      books_order?.reduce(
        (sum: number, item: any) =>
          sum + Number(item.price + item.discount) * item.quantity,
        0,
      ) || 0;

    const discount =
      books_order?.reduce(
        (sum: number, item: any) => sum + Number(item.discount) * item.quantity,
        0,
      ) || 0;

    const selectedShippingMethod1: any = shippingOptions?.find(
      (item: any) => item?.id === selectedShippingMethod?.id,
    );

    const discountShippingFee =
      selectedFreeshipVoucher?.discount_percent *
      selectedShippingMethod1?.price;

    const maxDiscountShippingFee = selectedFreeshipVoucher?.max_discount;

    let shippingFee = 0;

    if (maxDiscountShippingFee < discountShippingFee) {
      shippingFee = maxDiscountShippingFee;
    } else {
      shippingFee = discountShippingFee;
    }

    const shippingPrice = selectedShippingMethod1?.price || 0;

    return {
      price,
      discount,
      shippingPrice,
      shippingDiscount: shippingFee,
      shippingFeeAfterVoucher: shippingFee,
    };
  }, [books_order, selectedShippingMethod]);

  return (
    <>
      <div className="mx-[100px] pb-3 text-center text-[20px] font-medium">
        Thanh toán
      </div>

      <form
        className="mx-5 flex flex-wrap justify-center gap-3 px-[20px] lg:px-[40px]"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="max-w-full rounded-md px-[20px] lg:px-[40px]">
          <div className="mx-auto w-[90%] max-w-[100vw] overflow-scroll rounded-md border bg-white p-5 pb-[30px] text-[15px] lg:w-full">
            <BookTable books={books_order} />
          </div>

          <ChooseShippingMethod
            address={address}
            books={books_order}
            form={form}
            selectedShopId={selectedShopId}
            setSelectedFreeshipVoucher={setSelectedFreeshipVoucher}
            setSelectedMethod={setSelectedShippingMethod}
            setSelectedShopId={setSelectedShopId}
            setShippingOptions={setShippingOptions}
            shippingOptions={shippingOptions}
            total={total}
          />

          <ChoosePaymentMethod form={form} />
        </div>

        <div className="w-full text-sm text-gray-500 md:w-[350px]">
          <ChooseAddress address={address} setAddress={setAddress} />

          <DiscountSelector
            form={form}
            selectedShopId={selectedShopId}
            setSelectedFreeshipVoucher={setSelectedFreeshipVoucher}
            setSelectedProductVoucher={setSelectedProductVoucher}
            setSortedFreeshipVouchers={setSortedFreeshipVouchers}
            setSortedProductVouchers={setSortedProductVouchers}
            shippingOptions={shippingOptions}
            sortedFreeshipVouchers={sortedFreeshipVouchers}
            sortedProductVouchers={sortedProductVouchers}
            total={total}
          />

          <CountMoney
            form={form}
            onSubmit={onSubmit}
            selectedFreeshipVoucher={selectedFreeshipVoucher}
            selectedProductVoucher={selectedProductVoucher}
            selectedShopId={selectedShopId}
            setTotalToPay={setTotalToPay}
            submitting={submitting}
            total={total}
          />
        </div>
      </form>
    </>
  );
};

export default Page;
