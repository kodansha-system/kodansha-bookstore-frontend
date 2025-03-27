"use client";

import { useForm } from "react-hook-form";
import Select from "react-select";
import { ReactTyped } from "react-typed";

import Image from "next/image";
import Link from "next/link";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, ShoppingCart } from "lucide-react";
import { z } from "zod";

import BannerSlider from "@/components/shared/Banner";
import RatingStars from "@/components/shared/RatingStar";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadcnSelect,
} from "@/components/ui/select";

import { useBooks } from "@/hooks/useBooks";

const FormSchema = z.object({
  is_cheap: z.boolean().default(false).optional(),
  is_freeship_extra: z.boolean().default(false).optional(),
  is_from_four_star: z.boolean().default(false).optional(),
  sort_by: z.string().default("price").optional(),
});

const NoOptionsMessage = () => {
  return (
    <div className="flex h-[30px] items-center justify-center">
      <span className="text-center text-sm text-gray-500">Chưa có dữ liệu</span>
    </div>
  );
};

function DashboardPage() {
  const { data, isLoading, error } = useBooks({});

  const t = useTranslations("Home");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      is_cheap: false,
      is_freeship_extra: false,
      is_from_four_star: false,
      sort_by: "price",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  const sortOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  return (
    <div className="flex w-full flex-col bg-gray-50 pb-5">
      {/* <div className="absolute right-0 top-[50px] flex justify-end p-5">
        <div className="flex w-[300px] rounded-md p-2 text-center text-sm text-gray-500">
          <MapPin size={20} />
          Giao đến:&nbsp;
          <span className="text-black underline">Bắc Từ Liêm, Hà Nội</span>
          &nbsp;?
        </div>
      </div> */}

      {/* banner */}
      <BannerSlider />

      {/* câu chào + danh mục nhanh
      <div className="mx-[80px] rounded-lg bg-white p-5">
        <div className="flex flex-wrap justify-center gap-x-[50px]">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div
              className="flex flex-col items-center justify-center gap-1 text-[14px] text-gray-600"
              key={index}
            >
              <Image
                alt="Avatar"
                className="size-[50px] rounded-lg object-cover"
                height={60}
                src="https://danviet.mediacdn.vn/296231569849192448/2023/8/26/sach-nna-ban-tieng-anh-16930541445461508724279.jpg"
                width={50}
              />
              Flash sales
            </div>
          ))}
        </div>

        <div className="mt-3 text-center font-roboto text-[16px] text-blue-500 drop-shadow-md dark:text-green-400">
          <ReactTyped
            backSpeed={50}
            loop={true}
            onBegin={function noRefCheck() {}}
            onComplete={function noRefCheck() {}}
            onDestroy={function noRefCheck() {}}
            onLastStringBackspaced={function noRefCheck() {}}
            onReset={function noRefCheck() {}}
            onStart={function noRefCheck() {}}
            onStop={function noRefCheck() {}}
            onStringTyped={function noRefCheck() {}}
            onTypingPaused={function noRefCheck() {}}
            onTypingResumed={function noRefCheck() {}}
            strings={[
              "Chào mừng bạn đến với Shelfly! Ở đây chúng mình có sách và podcast. ",
              "Chúc bạn một ngày tốt lành! 😍",
            ]}
            typedRef={function noRefCheck() {}}
            typeSpeed={50}
          />
        </div>
      </div> */}

      {/* flash sales */}
      <div className="mx-[60px] mt-3 rounded-lg bg-white p-5">
        <div className="text-[18px] font-medium">Flash sales</div>

        <div className="mt-5 flex flex-wrap items-stretch justify-center gap-1 lg:gap-3">
          {data &&
            data?.books?.map((item: any, index: number) => (
              <div className="flex max-w-[228px] flex-1" key={index}>
                <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-transform duration-1000 hover:shadow-lg">
                  <div className="relative size-[180px]">
                    <Image
                      alt="Sản phẩm"
                      className="rounded-md object-cover"
                      fill
                      src={item?.images[0]}
                    />
                  </div>

                  <div className="mt-3 flex flex-1 flex-col justify-between gap-2">
                    <div className="flex flex-col gap-2">
                      <div
                        className={`flex items-center gap-x-2 text-[20px] font-[500] ${item?.discount === 0 ? "text-black" : "text-red-500"}`}
                      >
                        <div>
                          {new Intl.NumberFormat("vi-VN").format(item?.price)}đ
                        </div>

                        {item?.discount !== 0 && (
                          <div className="flex items-center justify-center rounded-sm bg-gray-100 p-1 text-xs font-[400] text-black">
                            -
                            {(
                              (item?.discount /
                                (item?.price + item?.discount)) *
                              100
                            ).toFixed(0)}
                            %
                          </div>
                        )}
                      </div>

                      <div className="text-sm text-gray-500">
                        {item?.authors[0]?.name}
                      </div>

                      <div className="line-clamp-2 max-w-[180px] text-base font-medium text-gray-900">
                        {item?.name}
                      </div>
                    </div>

                    <div className="mt-1 flex flex-col gap-y-1 text-sm">
                      <div className="relative w-full">
                        <Progress
                          className="h-5 bg-red-200 [&>div]:bg-red-500"
                          value={50}
                        />

                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          Đã bán {100} / {500}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="mt-5 text-center">
          <Link className="inline-block w-[200px]" href="#" passHref>
            <div className="text-blue- mx-auto mt-2 block w-[200px] rounded-md border border-red-500 p-2 text-center font-medium text-red-500 transition-[1000] hover:bg-red-100">
              Xem thêm
            </div>
          </Link>
        </div>
      </div>

      {/* bộ lọc danh sách sản phẩm  */}
      <div className="mx-[60px] mt-3 rounded-lg bg-white p-5 pb-2">
        <div className="text-[18px] font-[500]">Tất cả sản phẩm</div>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-wrap gap-x-5">
                <FormField
                  control={form.control}
                  name="is_from_four_star"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-x-2 rounded-md pl-4 pt-4">
                      <div className="text-sm text-gray-600">Danh mục:</div>

                      <FormControl>
                        <Select
                          components={{ NoOptionsMessage }}
                          isMulti
                          onChange={(selected) =>
                            field.onChange(
                              selected.map((option) => option.value),
                            )
                          }
                          options={sortOptions}
                          placeholder="Chọn danh mục"
                          styles={{
                            noOptionsMessage: (base) => ({
                              ...base,
                            }),
                            container: (provided) => ({
                              ...provided,
                              minWidth: 200,
                              maxWidth: "50%",
                              fontSize: "14px",
                            }),
                          }}
                          value={sortOptions.filter((option) =>
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
                  name="is_from_four_star"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-x-2 rounded-md pl-4 pt-4">
                      <div className="text-sm text-gray-600">Tác giả:</div>

                      <FormControl>
                        <Select
                          components={{ NoOptionsMessage }}
                          isMulti
                          onChange={(selected) =>
                            field.onChange(
                              selected.map((option) => option.value),
                            )
                          }
                          options={sortOptions}
                          placeholder="Chọn tác giả"
                          styles={{
                            noOptionsMessage: (base) => ({
                              ...base,
                            }),
                            container: (provided) => ({
                              ...provided,
                              minWidth: 200,
                              maxWidth: "50%",
                              fontSize: "14px",
                            }),
                          }}
                          value={sortOptions.filter((option) =>
                            Array.isArray(field.value)
                              ? field.value.includes(option.value)
                              : false,
                          )}
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
                    name="is_freeship_extra"
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
                            src="https://salt.tikicdn.com/ts/upload/2f/20/77/0f96cfafdf7855d5e7fe076dd4f34ce0.png"
                            width={80}
                          />
                          Freeship extra
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
                          Đặt trước
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="sort_by"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md p-4">
                        <div className="space-y-1 text-sm leading-none text-gray-600">
                          Sắp xếp theo
                        </div>

                        <FormControl>
                          <ShadcnSelect
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Chọn cách sắp xếp" />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="asc">Tăng dần</SelectItem>

                              <SelectItem value="desc">Giảm dần</SelectItem>
                            </SelectContent>
                          </ShadcnSelect>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <div className="mx-[60px]">
        <div className="mt-5 flex grow flex-wrap justify-center gap-5">
          {data &&
            data?.books?.map((item: any, index: number) => (
              <Link className="block" href={`/books/${item?.id}`} key={index}>
                <div className="min-h-full rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-transform duration-1000 hover:shadow-lg">
                  <div className="relative size-[180px]">
                    <Image
                      alt="Sản phẩm"
                      className="rounded-md object-cover"
                      fill
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

                    <div className="text-sm text-gray-500">
                      {item?.authors[0]?.name}
                    </div>

                    <div className="line-clamp-2 max-w-[180px] text-base font-medium text-gray-900">
                      {item?.name}
                    </div>

                    <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-x-2 text-xs">
                        <RatingStars rating={5} size={10} /> Đã bán
                        {item?.total_sold}
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
        </div>

        <div className="mt-5 text-center">
          <Link className="inline-block w-[200px]" href="#" passHref>
            <div className="text-blue- mx-auto mt-2 block w-[200px] rounded-md border border-blue-500 p-2 text-center font-medium text-blue-500 transition-[1000] hover:bg-blue-100">
              Xem thêm
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
