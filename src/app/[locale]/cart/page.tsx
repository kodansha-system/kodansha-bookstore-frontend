"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import Image from "next/image";
import Link from "next/link";

import { api } from "@/services/axios";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, ShoppingCart, Trash2Icon } from "lucide-react";
import { z } from "zod";

import RatingStars from "@/components/shared/RatingStar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useDetailCart } from "@/hooks/useCarts";

const formSchema = z.object({
  info: z.object({
    totalPrice: z.any(),
    benefits: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string(),
        discount: z.any(),
        price: z.any(),
        total: z.any(),
        quantity: z.any(),
        checked: z.boolean(),
      }),
    ),
  }),
});

const CartPage = () => {
  const { data: dataCart, refetch: refetchCart } = useDetailCart() || [];
  const { setBookToBuy } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      info: {
        totalPrice: 0,
        benefits: [],
      },
    },
  });

  const { setValue, getValues, watch, control, handleSubmit } = form;

  const memoizedDataCart = useMemo(() => dataCart, [JSON.stringify(dataCart)]);

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        setIsSubmitting(true);
        const currentData = values.info.benefits?.map((item) => ({
          book_id: item.id,
          quantity: Number(item.quantity),
        }));

        await api.patch("/carts", { books: currentData });
        refetchCart();
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [refetchCart],
  );

  const handleCheckedChange = useCallback(
    (index: number, checked: boolean) => {
      setValue(
        "info.benefits",
        getValues("info.benefits").map((item, i) =>
          i === index ? { ...item, checked } : item,
        ),
      );
    },
    [setValue, getValues],
  );

  const handleChooseAllBooks = useCallback(() => {
    setValue(
      "info.benefits",
      getValues("info.benefits").map((item, i) => {
        return { ...item, checked: true };
      }),
    );
  }, [setValue, getValues]);

  const handleBuyBooks = () => {
    try {
      const checkedBooks = getValues("info.benefits")?.filter(
        (item) => item.checked,
      );

      setBookToBuy(checkedBooks);
    } catch (error) {
      console.log(error, "error buy books");
    }
  };

  const benefits = watch("info.benefits");
  const total = useMemo(() => {
    const price =
      benefits?.reduce(
        (sum, item) =>
          item.checked
            ? sum + Number(item.price + item.discount) * item.quantity
            : sum,
        0,
      ) || 0;

    const discount =
      benefits?.reduce(
        (sum, item) => (item.checked ? sum + Number(item.discount) : sum),
        0,
      ) || 0;

    return {
      price,
      discount,
    };
  }, [benefits]);

  useEffect(() => {
    if (memoizedDataCart.length > 0) {
      setValue("info.benefits", memoizedDataCart);
    }
  }, [memoizedDataCart, setValue]);

  return (
    <>
      <div className="px-[60px] pb-[20px] text-[20px] font-medium">
        Giỏ hàng
      </div>

      <div className="mx-[60px] flex flex-wrap gap-3 bg-gray-50 py-5 pt-0">
        <div className="flex w-[1000px] gap-x-3 overflow-x-auto bg-gray-50 py-5 pt-0">
          <div className="min-w-[1000px] rounded-md">
            <Form {...form}>
              <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-3 flex gap-3">
                  <Button
                    className="w-[140px] border border-red-500 bg-white text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={handleChooseAllBooks}
                  >
                    Chọn mua tất cả
                  </Button>

                  <Button
                    className="w-[150px] border border-blue-500 bg-blue-500 text-white hover:bg-blue-500"
                    type="submit"
                  >
                    Cập nhật giỏ hàng
                  </Button>
                </div>

                <div className="overflow-hidden text-base">
                  {/* Header */}
                  <div className="mb-3 grid grid-cols-[80px_100px_1fr_150px_100px_150px_50px] gap-3 rounded-md border bg-white p-3 text-left font-medium">
                    <div>Chọn</div>

                    <div>Ảnh</div>

                    <div>Tên</div>

                    <div>Đơn giá</div>

                    <div>Số lượng</div>

                    <div>Thành tiền</div>

                    <div>Xóa</div>
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="info.benefits"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <>
                              {getValues("info.benefits")?.map((b, index) => (
                                <div
                                  className="grid grid-cols-[80px_100px_1fr_150px_100px_150px_50px] items-center gap-3 rounded-md border bg-white p-3"
                                  key={index}
                                >
                                  <Checkbox
                                    checked={b.checked}
                                    className="data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
                                    color="blue"
                                    onCheckedChange={(checked) =>
                                      handleCheckedChange(
                                        index,
                                        checked as boolean,
                                      )
                                    }
                                  />

                                  <div>
                                    <Image
                                      alt=""
                                      className="h-[100px] rounded-md object-cover"
                                      height={40}
                                      src={b.image}
                                      width={80}
                                    />
                                  </div>

                                  <div className="overflow-hidden whitespace-normal break-words">
                                    {b.name}
                                  </div>

                                  <div className="font-medium text-blue-500">
                                    {b.price.toLocaleString()}
                                  </div>

                                  <Input
                                    className="h-[30px] w-[60px] text-center"
                                    onChange={(e) => {
                                      const newBenefits = [
                                        ...getValues("info.benefits"),
                                      ];

                                      newBenefits[index].quantity =
                                        e.target.value;
                                      setValue("info.benefits", newBenefits);
                                    }}
                                    type="number"
                                    value={b.quantity}
                                  />

                                  <div className="font-medium text-blue-500">
                                    {b.total.toLocaleString()}
                                  </div>

                                  <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => {
                                      const newBenefits = getValues(
                                        "info.benefits",
                                      ).filter((_, i) => i !== index);

                                      setValue("info.benefits", newBenefits);
                                    }}
                                    type="button"
                                  >
                                    <Trash2Icon
                                      className="text-gray-400"
                                      size={20}
                                    />
                                  </button>
                                </div>
                              ))}
                            </>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </Form>
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

              <div className="text-black">{total?.price.toLocaleString()}đ</div>
            </div>

            <div className="flex justify-between">
              <div>Giảm giá trực tiếp: </div>

              <div className="text-green-300">
                {total.discount > 0 ? `-${total.discount.toLocaleString()}` : 0}
                đ
              </div>
            </div>

            <div className="flex justify-between">
              <div>Mã giảm giá từ Shelfly: </div>

              <div className="text-green-300">0đ</div>
            </div>

            <div className="size-px w-[320px] border border-gray-200"></div>

            <div className="flex justify-between">
              <div>Tổng tiền hàng: </div>

              <div className="text-[20px] font-bold text-red-500">
                {(total.price - total.discount).toLocaleString()}đ
              </div>
            </div>

            <Button
              className="mt-5 w-full bg-red-500 hover:bg-red-400"
              disabled={isSubmitting}
              onClick={handleBuyBooks}
            >
              Mua hàng
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-[60px] mb-5 rounded-md bg-white px-3 py-5">
        <div className="ml-[10px] text-[18px] font-medium">Gợi ý cho bạn</div>

        {/* <div className="mt-5 flex grow flex-wrap justify-center gap-3">
          {[1, 2, 3, 4, 5, 6, 8, 1, 1, 1, 1, 1, 1, 1, 1].map((_, index) => (
            <Link className="block" href="#" key={index}>
              <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-transform duration-1000 hover:shadow-lg">
                <div className="relative size-[180px]">
                  <Image
                    alt="Sản phẩm"
                    className="rounded-md object-cover"
                    fill
                    src="https://danviet.mediacdn.vn/296231569849192448/2023/8/26/sach-nna-ban-tieng-anh-16930541445461508724279.jpg"
                  />
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex items-center gap-x-2 text-[20px] font-[500] text-red-500">
                    <div>{new Intl.NumberFormat("vi-VN").format(100000)}đ</div>

                    <div className="flex items-center justify-center rounded-sm bg-gray-100 p-1 text-xs font-[400] text-black">
                      -30%
                    </div>
                  </div>

                  <div className="text-base text-gray-500">Nguyễn Nhật Ánh</div>

                  <div className="line-clamp-2 max-w-[180px] text-base font-medium text-gray-900">
                    Tôi thấy hoa vàng trên cỏ xanh
                  </div>

                  <div className="mt-1 flex items-center justify-between text-base text-gray-500">
                    <div className="flex items-center gap-x-2 text-xs">
                      <RatingStars rating={5} size={10} /> Đã bán 2000
                    </div>

                    <ShoppingCart
                      className="hover:scale-150 hover:text-blue-500"
                      size={16}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div> */}

        <div className="mt-5 text-center">
          <Link className="inline-block w-[200px]" href="#" passHref>
            <div className="text-blue- mx-auto mt-2 block w-[200px] rounded-md border border-blue-500 p-2 text-center font-medium text-blue-500 transition-[1000] hover:bg-blue-100">
              Xem thêm
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CartPage;
