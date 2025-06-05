"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { api } from "@/services/axios";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteIcon, ShoppingCart, Trash2Icon } from "lucide-react";
import { z } from "zod";

import MinusIcon from "@/components/icons/MinusIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import RatingStars from "@/components/shared/RatingStar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useRecommendedBook } from "@/hooks/useBooks";
import { useDetailCart } from "@/hooks/useCarts";

import { checkIsLogin, formatNumber } from "@/lib/utils";

const formSchema = z.object({
  totalPrice: z.any(),
  cartItems: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      image: z.string(),
      discount: z.any(),
      price: z.any(),
      origin_price: z.any(),
      total: z.any(),
      quantity: z.preprocess(
        (val) => Number(val),
        z
          .number({ required_error: "Bắt buộc nhập số lượng" })
          .min(1, "Tối thiểu 1")
          .max(10, "Tối đa 10"),
      ),
      checked: z.boolean(),
    }),
  ),
});
const CartPage = () => {
  const {
    data: dataCart,
    flash_sale_id,
    refetch: refetchCart,
  } = useDetailCart() || [];
  const { setBookToBuy } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      totalPrice: 0,
      cartItems: [],
    },
  });
  const { setValue, getValues, watch, control, trigger } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "cartItems",
  });
  const queryClient = useQueryClient();

  const cartItems = watch("cartItems");

  const memoizedDataCart = useMemo(() => dataCart, [JSON.stringify(dataCart)]);

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        setIsSubmitting(true);
        const currentData = values.cartItems?.map((item) => ({
          book_id: item.id,
          quantity: Number(item.quantity),
        }));

        await api.patch("/carts", { books: currentData });
        refetchCart();
        toast.success("Cập nhật giỏ hàng thành công");
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || "Cập nhật không thành công");
      } finally {
        setIsSubmitting(false);
      }
    },
    [refetchCart],
  );

  const handleCheckedChange = useCallback(
    (index: number, checked: boolean) => {
      setValue(
        "cartItems",
        getValues("cartItems").map((item, i) =>
          i === index ? { ...item, checked } : item,
        ),
      );
    },
    [setValue, getValues],
  );

  const handleChooseAllBooks = useCallback(() => {
    const current = getValues("cartItems");
    const isAllChecked = current.every((item) => item.checked);
    const updated = current.map((item) => ({
      ...item,
      checked: !isAllChecked,
    }));

    setValue("cartItems", updated);
  }, [setValue, getValues]);

  const handleBuyBooks = () => {
    try {
      const checkedBooks = getValues("cartItems")?.filter(
        (item) => item.checked,
      );

      if (checkedBooks.length > 0) {
        setBookToBuy(checkedBooks);
        router.push("/payment");
      }
    } catch (error) {
      console.log(error, "error buy books");
    }
  };

  const handleQuantityBlur = (index: number) => {
    const current = cartItems?.[index];

    if (!current) return;
    const quantity = Number(current.quantity || 0);
    const price = Number(current.price || 0);
    const newTotal = quantity * price;

    setValue(`cartItems.${index}.total`, Number(newTotal));
  };

  const total = useMemo(() => {
    const price =
      cartItems?.reduce((sum, item) => {
        return item.checked
          ? sum + Number(item.origin_price) * item.quantity
          : sum;
      }, 0) || 0;

    const discount =
      cartItems?.reduce(
        (sum, item) =>
          item.checked
            ? sum +
              (Number(item.origin_price) - Number(item.price)) * item.quantity
            : sum,
        0,
      ) || 0;

    return {
      price,
      discount,
    };
  }, [cartItems]);

  const handleViewDetailBook = (id: string) => {
    router.push(`/books/${id}`);
  };
  const { user } = useAuthStore();

  const dataRecommendedBooks = useRecommendedBook(user?._id || "");

  const handleAddToCart = async (id: string) => {
    if (!checkIsLogin()) {
      return;
    }

    try {
      await api.post("/carts", {
        books: [
          {
            book_id: id,
            quantity: 1,
          },
        ],
      });

      queryClient.invalidateQueries({ queryKey: ["detail-cart"] });

      toast.success("Thêm vào giỏ hàng thành công!");
    } catch (err) {
      toast.error("Có lỗi khi thêm vào giỏ hàng!");
      console.log(err);
    }
  };

  useEffect(() => {
    if (memoizedDataCart.length > 0) {
      const currentChecked = getValues("cartItems") || [];
      const updated = memoizedDataCart.map((item: any, index: number) => ({
        ...item,
        checked: currentChecked[index]?.checked || false,
        ...(item?.is_flash_sale && {
          flash_sale_id,
        }),
      }));

      setValue("cartItems", updated);
    }
  }, [memoizedDataCart]);

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  return (
    <>
      <div className="px-5 pb-[20px] text-[20px] font-medium md:px-[60px]">
        Giỏ hàng
      </div>

      {memoizedDataCart?.length <= 0 && (
        <div className="flex flex-col items-center justify-center px-5 py-20 text-center text-gray-500">
          <Image alt="cart" height={200} src="/empty-cart.png" width={200} />

          <p className="text-lg font-medium text-blue-500">
            Giỏ hàng của bạn đang trống
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Hãy thêm sản phẩm để tiếp tục mua sắm nhé!
          </p>
        </div>
      )}

      {memoizedDataCart?.length > 0 && (
        <div className="mx-5 mb-3 flex gap-3 md:mx-[60px]">
          <div
            className="flex w-[140px] cursor-pointer items-center justify-center rounded-md border border-red-500 bg-white text-sm font-medium text-red-500 hover:bg-red-500 hover:text-white"
            onClick={handleChooseAllBooks}
          >
            Chọn mua tất cả
          </div>

          <Button
            className="w-[150px] border border-blue-500 bg-blue-500 text-white hover:bg-blue-500"
            onClick={form.handleSubmit(onSubmit)}
          >
            Cập nhật giỏ hàng
          </Button>
        </div>
      )}

      {memoizedDataCart?.length > 0 && (
        <div className="mx-5 flex select-none flex-wrap gap-3 bg-gray-50 py-5 pt-0 md:mx-[60px]">
          <div className="flex w-[1000px] gap-x-3 overflow-x-auto bg-gray-50 py-5 pt-0">
            <div className="min-w-[1000px] rounded-md">
              <Form {...form}>
                <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="overflow-hidden text-base">
                    <div className="mb-3 grid grid-cols-[80px_100px_1fr_100px_150px_150px_50px] gap-3 rounded-md border bg-white p-3 text-left font-medium">
                      <div>Chọn</div>

                      <div>Ảnh</div>

                      <div>Tên</div>

                      <div>Đơn giá</div>

                      <div>Số lượng</div>

                      <div>Thành tiền</div>

                      <div>Xóa</div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {fields.map((field, index) => {
                        const watchedItem = cartItems?.[index];

                        return (
                          <div
                            className="grid grid-cols-[80px_100px_1fr_100px_150px_150px_50px] items-center gap-3 rounded-md border bg-white p-3"
                            key={field.id}
                          >
                            <Checkbox
                              checked={watchedItem.checked}
                              className="data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
                              color="blue"
                              onCheckedChange={(checked) =>
                                handleCheckedChange(index, checked as boolean)
                              }
                            />

                            <div
                              onClick={() =>
                                handleViewDetailBook(watchedItem.id)
                              }
                            >
                              <Image
                                alt=""
                                className="h-[100px] cursor-pointer rounded-md object-cover"
                                height={40}
                                src={field.image}
                                width={80}
                              />
                            </div>

                            <div
                              className="cursor-pointer overflow-hidden whitespace-normal break-words"
                              onClick={() =>
                                handleViewDetailBook(watchedItem.id)
                              }
                            >
                              {field.name}
                            </div>

                            <div className="font-medium text-blue-500">
                              {field.price.toLocaleString()}
                            </div>

                            <div>
                              <FormField
                                control={control}
                                name={`cartItems.${index}.quantity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="flex items-center gap-1">
                                        <div
                                          className="cursor-pointer select-none rounded-md border border-gray-400 p-1"
                                          onClick={() => {
                                            form.setValue(
                                              `cartItems.${index}.quantity`,
                                              Math.max(
                                                1,
                                                Number(
                                                  form.watch(
                                                    `cartItems.${index}.quantity`,
                                                  ),
                                                ) - 1,
                                              ),
                                            );
                                            handleQuantityBlur(index);
                                          }}
                                        >
                                          <MinusIcon />
                                        </div>

                                        <Input
                                          {...field}
                                          className="h-[33px] w-[60px] select-none border-gray-400 text-center text-[15px]"
                                          max={10}
                                          min={1}
                                          onBlur={() =>
                                            handleQuantityBlur(index)
                                          }
                                          onChange={(e) => {
                                            const value = Number(
                                              e.target.value,
                                            );

                                            if (value <= 10) {
                                              field.onChange(e);
                                            }
                                          }}
                                          type="number"
                                        />

                                        <div
                                          className="cursor-pointer rounded-md border border-gray-400 p-1"
                                          onClick={() => {
                                            form.setValue(
                                              `cartItems.${index}.quantity`,
                                              Math.min(
                                                10,
                                                Number(
                                                  form.watch(
                                                    `cartItems.${index}.quantity`,
                                                  ),
                                                ) + 1,
                                              ),
                                            );
                                            handleQuantityBlur(index);
                                          }}
                                        >
                                          <PlusIcon />
                                        </div>
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="select-none font-medium text-blue-500">
                              {(watchedItem?.total || 0).toLocaleString()}
                            </div>

                            <div>
                              <Trash2Icon
                                className="cursor-pointer text-gray-400"
                                onClick={() => remove(index)}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <div className="flex w-[350px] flex-col gap-y-2 rounded-md border bg-white p-4">
              <div className="flex justify-between">
                <div>Tổng tiền hàng: </div>

                <div className="text-black">
                  {total?.price.toLocaleString()}đ
                </div>
              </div>

              <div className="flex justify-between">
                <div>Giảm giá trực tiếp: </div>

                <div className="text-green-300">
                  {total.discount > 0
                    ? `-${total.discount.toLocaleString()}`
                    : 0}
                  đ
                </div>
              </div>

              <div className="flex justify-between">
                <div>Mã giảm giá từ Kodansha: </div>

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
                disabled={
                  isSubmitting ||
                  getValues("cartItems")?.filter((item) => item.checked)
                    ?.length === 0
                }
                onClick={handleBuyBooks}
              >
                Mua hàng
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-5 mb-5 rounded-md bg-white px-3 py-5 md:mx-[60px]">
        <div className="ml-[10px] text-[18px] font-medium">Gợi ý cho bạn</div>

        <div className="mt-5 flex grow flex-wrap justify-center gap-3">
          {dataRecommendedBooks &&
            dataRecommendedBooks?.data?.data?.length > 0 &&
            dataRecommendedBooks?.data?.data?.map(
              (item: any, index: number) => (
                <Link
                  className="block"
                  href={`/books/${item?._id}`}
                  key={index}
                >
                  <div className="min-h-[340px] rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-transform duration-1000 hover:shadow-lg">
                    <div className="relative size-[180px]">
                      <Image
                        alt="Sản phẩm"
                        className="rounded-md object-cover"
                        fill
                        src={item?.images?.[0]}
                      />
                    </div>

                    <div className="mt-3 flex flex-col gap-2">
                      <div className="flex items-center gap-x-2 text-[20px] font-[500] text-red-500">
                        <div>
                          {new Intl.NumberFormat("vi-VN").format(item?.price)}đ
                        </div>

                        <div className="flex items-center justify-center rounded-sm bg-gray-100 p-1 text-xs font-[400] text-black">
                          -
                          {(
                            (1 - item?.price / item?.origin_price) *
                            100
                          ).toFixed(0)}
                          %
                        </div>
                      </div>

                      <div className="line-clamp-2 max-w-[180px] text-base font-medium text-gray-900">
                        {item?.name}
                      </div>

                      <div className="mt-1 flex items-center justify-between text-base text-gray-500">
                        <div className="flex items-center gap-x-2 text-xs">
                          <RatingStars
                            rating={item?.rating_average}
                            size={10}
                          />{" "}
                          Đã bán&nbsp;
                          {formatNumber(item?.total_sold)}
                        </div>

                        <ShoppingCart
                          className="hover:scale-150 hover:text-blue-500"
                          onClick={() => handleAddToCart(item?._id)}
                          size={16}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ),
            )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
