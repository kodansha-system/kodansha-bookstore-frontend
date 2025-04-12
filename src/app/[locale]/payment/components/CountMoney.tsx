import { useMemo } from "react";

import { Button } from "@/components/ui/button";

export const CountMoney = ({
  total,
  onSubmit,
  form,
  selectedFreeshipVoucher,
  selectedProductVoucher,
}: any) => {
  const discountFreeship = useMemo(() => {
    const maxDiscountFreeship = selectedFreeshipVoucher?.max_discount;
    const discountPercentFreeship =
      total.price * selectedFreeshipVoucher?.discount_percent;

    if (maxDiscountFreeship > discountPercentFreeship) {
      return discountPercentFreeship;
    }

    return maxDiscountFreeship;
  }, [selectedFreeshipVoucher]);

  const discountProduct = useMemo(() => {
    const maxDiscountProduct = selectedProductVoucher?.max_discount;
    const discountPercentProduct =
      total.price * selectedProductVoucher?.discount_percent;

    if (maxDiscountProduct > discountPercentProduct) {
      return discountPercentProduct;
    }

    return maxDiscountProduct;
  }, [selectedProductVoucher]);

  return (
    <div className="mt-3 flex w-[350px] flex-col gap-y-2 rounded-md border bg-white p-4">
      <div className="flex justify-between">
        <div>Tổng tiền hàng: </div>

        <div className="text-black">{total.price.toLocaleString()}đ</div>
      </div>

      <div className="flex justify-between">
        <div>Giảm giá trực tiếp: </div>

        <div className="text-green-300">
          {total.discount > 0 ? `-${total.discount.toLocaleString()}` : 0}đ
        </div>
      </div>

      <div className="flex justify-between">
        <div>Phí vận chuyển: </div>

        <div className="text-black">
          {total?.shippingPrice > 0
            ? `${total?.shippingPrice.toLocaleString()}`
            : 0}
          đ
        </div>
      </div>

      <div className="flex justify-between">
        <div>Giảm giá phí vận chuyển: </div>

        <div className="text-green-300">
          -
          {selectedFreeshipVoucher?.max_discount > 0
            ? `${selectedFreeshipVoucher?.max_discount.toLocaleString()}`
            : 0}
          đ
        </div>
      </div>

      <div className="flex justify-between">
        <div>Mã giảm giá từ Kodansha: </div>

        <div className="text-green-300">
          -{discountProduct > 0 ? `${discountProduct.toLocaleString()}` : 0}đ
        </div>
      </div>

      <div className="size-px w-[320px] border border-gray-200"></div>

      <div className="flex justify-between">
        <div>Tổng tiền: </div>

        <div className="text-[20px] font-bold text-red-500">
          {(
            total.price -
            total.discount +
            total?.shippingPrice -
            discountFreeship -
            discountProduct
          ).toLocaleString() || 0}
          đ
        </div>
      </div>

      <Button
        className="mt-5 w-full bg-red-500 hover:bg-red-400"
        onClick={form.handleSubmit(onSubmit)}
        type="submit"
      >
        Đặt hàng
      </Button>
    </div>
  );
};
