"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import { api } from "@/services/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon, ShoppingCart } from "lucide-react";
import { z } from "zod";

import BannerSlider from "@/components/shared/Banner";
import RatingStars from "@/components/shared/RatingStar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { useBooks } from "@/hooks/useBooks";

import BookSection from "./components/BookSection";
import FlashSaleSection from "./components/FlashSale";

interface FilterState {
  limit: number;
  authorId?: string;
  categoryId?: string;
  sortPrice?: string;
  ratingGte?: number;
}

const FormSchema = z.object({
  is_cheap: z.boolean().default(false).optional(),
  is_freeship_extra: z.boolean().default(false).optional(),
  is_from_four_star: z.boolean().default(false).optional(),
  sort_by: z.string().default("price").optional(),
  author: z.any(),
  category: z.any(),
});

const NoOptionsMessage = () => {
  return (
    <div className="flex h-[30px] items-center justify-center">
      <span className="text-center text-sm text-gray-500">Chưa có dữ liệu</span>
    </div>
  );
};

function DashboardPage() {
  const [filter, setFilter] = useState<FilterState>({ limit: 10 });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useBooks(filter);
  const [listCategories, setListCategories] = useState([]);
  const [listAuthors, setListAuthors] = useState([]);
  const router = useRouter();
  const [listCategoriesShowOnDashboard, setListCategoriesShowOnDashboard] =
    useState<any>([]);

  const t = useTranslations("Home");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      is_cheap: false,
      is_freeship_extra: false,
      is_from_four_star: false,
      sort_by: "price",
      author: "",
      category: "",
    },
  });

  const allBooks = data?.pages.flatMap((page) => page.books) || [];

  function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      setFilter({
        ...filter,
        authorId: values?.author && values?.author?.join(","),
        categoryId: values?.category && values?.category?.join(","),
        sortPrice: values?.sort_by,
        ratingGte: values?.is_from_four_star ? 4 : undefined,
      });
    } catch (e) {
      console.log(e);
    }
  }

  const handleGetListCategories = async () => {
    const res = await api.get("/categories");
    const res2 = await api.get("/authors");
    const res3 = await api.get("/categories/show-on-dashboard");

    setListCategories(
      res?.data?.categories?.map((item: any) => {
        return { value: item.id, label: item.name };
      }),
    );

    setListAuthors(
      res2?.data?.authors?.map((item: any) => {
        return { value: item.id, label: item.name };
      }),
    );

    setListCategoriesShowOnDashboard(res3?.data);
  };

  const handleAddToCart = async (id: string) => {
    try {
      await api.post("/carts", {
        books: [
          {
            book_id: id,
            quantity: 1,
          },
        ],
      });

      toast.success("Thêm vào giỏ hàng thành công!");
    } catch (err) {
      toast.error("Có lỗi khi thêm vào giỏ hàng!");
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetListCategories();
  }, []);

  return (
    <div className="flex w-full flex-col bg-gray-50 pb-5">
      <BannerSlider />

      <FlashSaleSection />

      {listCategoriesShowOnDashboard &&
        listCategoriesShowOnDashboard?.map((item: any) => {
          return (
            <BookSection
              categoryId={item?.id}
              key={item?.id}
              title={item?.name}
            />
          );
        })}

      <div className="mx-[60px] mt-3 rounded-lg bg-white p-5 pb-2">
        <div className="text-[18px] font-[500]">Tất cả sản phẩm</div>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-wrap gap-x-5">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-x-2 rounded-md pl-4 pt-4">
                      <div className="text-sm text-gray-600">Danh mục:</div>

                      <FormControl>
                        <Select
                          components={{ NoOptionsMessage }}
                          isMulti
                          onChange={(selected) => {
                            field.onChange(
                              selected.map((option: any) => option.value),
                            );
                          }}
                          options={listCategories}
                          placeholder="Chọn danh mục"
                          styles={{
                            noOptionsMessage: (base) => ({
                              ...base,
                            }),
                            container: (provided) => ({
                              ...provided,
                              minWidth: 300,
                              maxWidth: 350,
                              fontSize: "14px",
                            }),
                          }}
                          value={listCategories.filter((option: any) =>
                            Array.isArray(field.value)
                              ? field.value.includes(option.value)
                              : false,
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-x-2 rounded-md pl-4 pt-4">
                      <div className="text-sm text-gray-600">Tác giả:</div>

                      <FormControl>
                        <Select
                          components={{ NoOptionsMessage }}
                          isMulti
                          onChange={(selected) =>
                            field.onChange(
                              selected.map((option: any) => option.value),
                            )
                          }
                          options={listAuthors}
                          placeholder="Chọn tác giả"
                          styles={{
                            noOptionsMessage: (base) => ({
                              ...base,
                            }),
                            container: (provided) => ({
                              ...provided,
                              minWidth: 300,
                              maxWidth: 350,
                              fontSize: "14px",
                            }),
                          }}
                          value={listAuthors.filter((option: any) =>
                            Array.isArray(field.value)
                              ? field.value.includes(option.value)
                              : false,
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sort_by"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-x-2 rounded-md pl-4 pt-4">
                      <div className="text-sm text-gray-600">Sắp xếp theo</div>

                      <FormControl>
                        <Select
                          components={{ NoOptionsMessage }}
                          isClearable={true}
                          onChange={(option) => field.onChange(option?.value)}
                          options={[
                            {
                              value: "asc",
                              label: "Giá tăng dần",
                            },
                            {
                              value: "desc",
                              label: "Giá giảm dần",
                            },
                          ]}
                          placeholder="Sắp xếp theo"
                          styles={{
                            noOptionsMessage: (base) => ({
                              ...base,
                            }),
                            container: (provided) => ({
                              ...provided,
                              minWidth: 300,
                              maxWidth: 350,
                              fontSize: "14px",
                            }),
                          }}
                          value={
                            field.value
                              ? [
                                  {
                                    value: field.value,
                                    label:
                                      field.value === "asc"
                                        ? "Giá tăng dần"
                                        : "Giá giảm dần",
                                  },
                                ]
                              : undefined
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-0 flex flex-wrap justify-between">
                <div className="flex flex-wrap">
                  <FormField
                    control={form.control}
                    name="is_cheap"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>

                        <div className="flex items-center gap-x-2 space-y-1 text-sm leading-none text-gray-600">
                          <Image
                            alt=""
                            className="h-[16px]"
                            height={50}
                            src="https://salt.tikicdn.com/ts/upload/b5/aa/48/2305c5e08e536cfb840043df12818146.png"
                            width={80}
                          />
                          Siêu rẻ
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_from_four_star"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>

                        <div className="space-y-1 text-sm leading-none text-gray-600">
                          Từ 4 sao
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>

            <div className="flex justify-center pb-5">
              <Button
                className="bg-blue-400 text-white hover:bg-blue-400"
                onClick={form.handleSubmit(onSubmit)}
                type="submit"
              >
                <SearchIcon /> Tìm kiếm
              </Button>
            </div>
          </Form>
        </div>
      </div>

      <div className="mx-[60px]">
        <div className="mt-5 flex grow flex-wrap justify-center gap-5">
          {data &&
            allBooks?.map((item: any, index: number) => (
              <div className="block" key={index}>
                <div className="min-h-full rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-transform duration-1000 hover:shadow-lg">
                  <div className="relative size-[180px]">
                    <Image
                      alt="Sản phẩm"
                      className="rounded-md object-cover"
                      fill
                      onClick={() => router.push(`/books/${item?.id}`)}
                      src={item?.images[0]}
                    />
                  </div>

                  <div className="mt-3 flex flex-col gap-2">
                    {/* giá */}
                    <div className="flex items-center gap-x-2 text-[20px] font-[500] text-red-500">
                      <div>
                        {new Intl.NumberFormat("vi-VN").format(item?.price)}đ
                      </div>

                      <div className="flex items-center justify-center rounded-sm bg-gray-100 p-1 text-xs font-[400] text-black">
                        -
                        {(
                          (item?.discount / (item?.price + item?.discount)) *
                          100
                        ).toFixed(0)}
                        %
                      </div>
                    </div>

                    <div
                      className="text-sm text-gray-500"
                      onClick={() => router.push(`/books/${item?.id}`)}
                    >
                      {item?.authors[0]?.name}
                    </div>

                    <div className="line-clamp-2 max-w-[180px] text-base font-medium text-gray-900">
                      {item?.name}
                    </div>

                    <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-x-2 text-xs">
                        <RatingStars rating={5} size={10} /> Đã bán&nbsp;
                        {item?.total_sold}
                      </div>

                      <ShoppingCart
                        className="cursor-pointer hover:scale-150 hover:text-blue-500"
                        onClick={() => handleAddToCart(item.id)}
                        size={16}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="mt-5 text-center">
          <Button
            className="mx-auto mt-2 block w-[200px] rounded-md border border-blue-500 bg-white p-2 text-center text-base font-medium text-blue-500 transition-[1000] hover:bg-blue-100"
            onClick={() => router.push("/search")}
          >
            Xem thêm
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
