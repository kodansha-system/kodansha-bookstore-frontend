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

import Chatbot from "@/components/Chatbot";
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

      <Chatbot />

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
    </div>
  );
}

export default DashboardPage;
