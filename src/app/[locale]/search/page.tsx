"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { api } from "@/services/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon, ShoppingCart } from "lucide-react";
import { z } from "zod";

import Loading from "@/components/shared/Loading";
import RatingStars from "@/components/shared/RatingStar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { useBooks } from "@/hooks/useBooks";

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

const SearchPage = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      is_cheap: false,
      is_freeship_extra: false,
      is_from_four_star: false,
      sort_by: undefined,
      author: "",
      category: "",
    },
  });

  const [listCategories, setListCategories] = useState([]);
  const [listAuthors, setListAuthors] = useState([]);
  const [filter, setFilter] = useState<any>({
    page: 1,
    limit: 20,
    keyword: keyword || undefined,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLastPage,
  } = useBooks(filter);

  const allBooks = data?.pages.flatMap((page) => page.books) || [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const router = useRouter();

  const onSubmit = (values: any) => {
    try {
      const rawFilter = {
        ...filter,
        authorId: values?.author && values?.author?.join(","),
        categoryId: values?.category && values?.category?.join(","),
        sortPrice: values?.sort_by,
        ratingGte: values?.is_from_four_star ? 4 : undefined,
      };

      const cleanedFilter = Object.fromEntries(
        Object.entries(rawFilter).filter(
          ([_, value]) => value !== undefined && value !== null && value !== "",
        ),
      );

      setFilter(cleanedFilter);
    } catch (e) {
      console.log(e);
    }
  };

  const handleGetListCategories = async () => {
    const res = await api.get("/categories");
    const res2 = await api.get("/authors", {
      params: {
        get_all: true,
      },
    });

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

  const handleSearchByKeyword = () => {
    const keywordFromUrl = searchParams.get("keyword");

    if (keywordFromUrl) {
      setFilter((prev: any) => ({
        ...prev,
        keyword: keywordFromUrl,
        page: 1,
      }));
    } else {
      setFilter((prev: any) => {
        delete prev.keyword;

        return {
          ...prev,
          keyword: null,
          page: 1,
        };
      });
    }
  };

  useEffect(() => {
    handleGetListCategories();
  }, []);

  useEffect(() => {
    handleSearchByKeyword();
  }, [searchParams]);

  return (
    <div className="px-5 lg:px-[100px]">
      <div className="mx-auto rounded-md bg-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-wrap gap-x-5">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-x-2 rounded-md pl-4 pt-4 md:flex-row md:items-center">
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
                            minWidth: 280,
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
                  <FormItem className="flex flex-col gap-x-2 rounded-md pl-4 pt-4 md:flex-row md:items-center">
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
                            minWidth: 280,
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
                  <FormItem className="flex flex-col gap-x-2 rounded-md pl-4 pt-4 md:flex-row md:items-center">
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
                            minWidth: 280,
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
                        Sản phẩm được đánh giá cao
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

      <div className="">
        {isFetching && (
          <div className="flex justify-center p-6">
            <Loading />
          </div>
        )}

        <div className="mt-5 flex grow flex-wrap justify-center gap-3 md:gap-5">
          {data &&
            allBooks?.map((item: any, index: number) => (
              <div
                className="block w-[calc(50vw-35px)] md:w-[180px]"
                key={index}
              >
                <div className="min-h-full rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-transform duration-1000 hover:shadow-lg">
                  <div className="relative mx-auto flex aspect-[1/1] w-full justify-center">
                    <Image
                      alt="Sản phẩm"
                      className="size-[180px] rounded-md object-cover"
                      fill
                      onClick={() => router.push(`/books/${item?.id}`)}
                      src={item?.images[0]}
                    />
                  </div>

                  <div className="mt-3 flex flex-col gap-2">
                    <div className="flex items-center gap-x-2 text-sm font-[500] text-red-500 lg:text-[20px]">
                      <div>
                        {new Intl.NumberFormat("vi-VN").format(item?.price)}đ
                      </div>

                      <div className="flex items-center justify-center rounded-sm bg-gray-100 p-1 text-xs font-[400] text-black">
                        -
                        {((1 - item?.price / item?.origin_price) * 100).toFixed(
                          0,
                        )}
                        %
                      </div>
                    </div>

                    {item?.authors[0]?.name && (
                      <div
                        className="text-sm text-gray-500"
                        onClick={() => router.push(`/books/${item?.id}`)}
                      >
                        {item?.authors[0]?.name}
                      </div>
                    )}

                    <div className="line-clamp-2 max-w-[calc((100vw-20px)/2)] text-sm font-medium text-gray-900 md:max-w-[180px] lg:max-w-[180px] lg:text-base">
                      {item?.name}
                    </div>

                    <div className="mt-1 flex max-w-[calc((100vw-20px)/2)] flex-wrap items-center justify-between text-sm text-gray-500 md:max-w-full">
                      <div className="flex flex-col gap-2 text-xs">
                        <RatingStars rating={5} size={10} />

                        <div>Đã bán&nbsp;{item?.total_sold}</div>
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

        {isFetchingNextPage && (
          <div className="flex justify-center p-6">
            <Loading />
          </div>
        )}

        <div className="mt-5 text-center">
          {!isLastPage && (
            <Button
              className="mx-auto mt-2 block w-[200px] rounded-md border border-blue-500 bg-white p-2 text-center font-medium text-blue-500 transition-[1000] hover:bg-blue-100"
              onClick={loadMore}
            >
              Xem thêm
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
