"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";

import { api } from "@/services/axios";
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
  shippingMethod: z.string().min(1, "Vui lòng chọn đơn vị vận chuyển"),
  paymentMethod: z.string().min(1, "Vui lòng chọn đơn vị vận chuyển"),
  address: z.any().optional(),
  freeshipVoucher: z.string().optional(),
  productVoucher: z.string().optional(),
});

const Page = () => {
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<any>({
    price: 0,
  });
  const [address, setAddress] = useState<any>(null);
  const { books } = useCartStore();
  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      shippingMethod: "",
      paymentMethod: "",
      freeshipVoucher: "",
      productVoucher: "",
    },
  });
  const [shippingOptions, setShippingOptions] = useState([]);
  const [sortedFreeshipVouchers, setSortedFreeshipVouchers] = useState([]);
  const [sortedProductVouchers, setSortedProductVouchers] = useState([]);
  const [selectedFreeshipVoucher, setSelectedFreeshipVoucher] = useState<any>();
  const [selectedProductVoucher, setSelectedProductVoucher] = useState<any>();
  const { user } = useAuthStore();
  const router = useRouter();

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
          name: user.name || "Minh Anh",
          phone: user.phone || "095959595",
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

  const onSubmit = async (data: {
    freeshipVoucher?: string;
    productVoucher?: string;
    shippingMethod: string;
    paymentMethod: string;
  }) => {
    try {
      const resCreateShipment: any = await handleCreateShipment(data);

      if (resCreateShipment) {
        const dataOrder = {
          books: books?.map((item: any) => {
            return {
              book_id: item.id,
              price: item.price,
              quantity: item.quantity,
            };
          }),
          total_to_pay: 1770667,
          total_price: 2214000,
          discount: 510600,
          carrier: {
            id: selectedShippingMethod.id,
            name: selectedShippingMethod.name,
            fee: selectedShippingMethod.price,
            order_code: resCreateShipment?.id,
          },
          paymethod: data.paymentMethod,
          vouchers: [data.productVoucher, data.freeshipVoucher],
          address: {
            name: user?.name,
            phone: user?.phone || "09999999",
          },
        };

        await api.post("/orders", dataOrder);

        toast.success("Tạo đơn hàng thành công!");

        router.push("/my-order");
      }
    } catch (error) {
      toast.error("Tạo đơn hàng không thành công!");
      console.log(error);
    }
  };

  const total = useMemo(() => {
    const price =
      books?.reduce(
        (sum: number, item: any) =>
          sum + Number(item.price + item.discount) * item.quantity,
        0,
      ) || 0;

    const discount =
      books?.reduce(
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
  }, [books, selectedShippingMethod]);

  return (
    <>
      <div className="mx-[100px] pb-3 text-center text-[20px] font-medium">
        Thanh toán
      </div>

      <form
        className="mx-0 flex justify-center gap-x-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="rounded-md">
          <div className="w-full rounded-md border bg-white p-5 pb-[30px] text-[15px]">
            <BookTable books={books} />
          </div>

          <ChooseShippingMethod
            address={address}
            form={form}
            setSelectedMethod={setSelectedShippingMethod}
            setShippingOptions={setShippingOptions}
            shippingOptions={shippingOptions}
            total={total}
          />

          <ChoosePaymentMethod form={form} />
        </div>

        <div className="text-sm text-gray-500">
          <ChooseAddress setAddress={setAddress} />

          <DiscountSelector
            form={form}
            setSelectedFreeshipVoucher={setSelectedFreeshipVoucher}
            setSelectedProductVoucher={setSelectedProductVoucher}
            setSortedFreeshipVouchers={setSortedFreeshipVouchers}
            setSortedProductVouchers={setSortedProductVouchers}
            sortedFreeshipVouchers={sortedFreeshipVouchers}
            sortedProductVouchers={sortedProductVouchers}
            total={total}
          />

          <CountMoney
            form={form}
            onSubmit={onSubmit}
            selectedFreeshipVoucher={selectedFreeshipVoucher}
            selectedProductVoucher={selectedProductVoucher}
            total={total}
          />
        </div>
      </form>
    </>
  );
};

export default Page;
