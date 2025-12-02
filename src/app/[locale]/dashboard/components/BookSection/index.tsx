import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { api } from "@/services/axios";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";

import RatingStars from "@/components/shared/RatingStar";

import { checkIsLogin, formatNumber } from "@/lib/utils";

interface BookSectionProps {
  categoryId: string;
  title: string;
}

const BookSection = ({ categoryId, title }: BookSectionProps) => {
  const [books, setBooks] = useState([]);
  const router = useRouter();
  const queryClient = useQueryClient();

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

      queryClient.invalidateQueries({ queryKey: ["recommended-books"] });
      queryClient.invalidateQueries({ queryKey: ["detail-cart"] });

      toast.success("Thêm vào giỏ hàng thành công!");
    } catch (err) {
      toast.error("Có lỗi khi thêm vào giỏ hàng!");
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await api.get("/books", {
        params: {
          categoryId: categoryId,
          limit: 6,
          random: true,
        },
      });

      setBooks(res.data.books || []);
    };

    fetchBooks();
  }, [categoryId]);

  return (
    <div className="mx-2 mb-10 rounded-lg bg-white p-5 lg:mx-[60px]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>

        <button
          className="text-blue-600 hover:underline"
          onClick={() => router.push(`/search?category_id=${categoryId}`)}
        >
          Xem thêm
        </button>
      </div>

      <div className="flex flex-wrap gap-2 lg:justify-center lg:gap-4">
        {books.map((item: any, index: number) => (
          <div className="block w-[calc(50vw-35px)] md:w-[180px]" key={index}>
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
                    -{((1 - item?.price / item?.origin_price) * 100).toFixed(0)}
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
                    <RatingStars rating={item?.rating?.average} size={10} />

                    <div>Đã bán&nbsp;{formatNumber(item?.total_sold)}</div>
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
    </div>
  );
};

export default BookSection;
