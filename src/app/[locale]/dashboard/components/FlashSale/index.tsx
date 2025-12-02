import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { api } from "@/services/axios";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";

import RatingStars from "@/components/shared/RatingStar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { checkIsLogin, formatNumber } from "@/lib/utils";

export default function FlashSaleSection() {
  const [flashSale, setFlashSale] = useState<any>(null);
  const [countdown, setCountdown] = useState<any>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const getActiveFlashSale = async () => {
    try {
      const response = await api.get("/flashsales/active");

      return response;
    } catch (error) {
      console.error("Lỗi khi gọi flash sale:", error);

      return null;
    }
  };

  useEffect(() => {
    const fetchAndStartCountdown = async () => {
      const res = await getActiveFlashSale();

      if (!res?.data) return;

      setFlashSale(res.data);

      const endTime = res.data.end_time;

      if (endTime && !isNaN(new Date(endTime).getTime())) {
        startCountdown(endTime);
      } else {
        console.warn("⚠️ end_time không hợp lệ:", endTime);
      }
    };

    fetchAndStartCountdown();
  }, []);

  const startCountdown = (endTimeStr: string) => {
    const endTime = new Date(endTimeStr).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        setCountdown("Đã kết thúc");
        clearInterval(interval);

        return;
      }

      const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(
        2,
        "0",
      );
      const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(
        2,
        "0",
      );
      const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(
        2,
        "0",
      );
      const days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(
        2,
        "0",
      );

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
      });
    }, 1000);
  };

  if (!flashSale) return null;

  const handleAddToCart = async (bookId: number) => {
    if (!checkIsLogin()) {
      return;
    }

    try {
      const response = await api.post("/carts", {
        books: [
          {
            book_id: bookId,
            quantity: 1,
          },
        ],
      });

      queryClient.invalidateQueries({ queryKey: ["recommended-books"] });
      queryClient.invalidateQueries({ queryKey: ["detail-cart"] });
      toast.success("Thêm vào giỏ hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Đã xảy ra lỗi khi thêm vào giỏ hàng!");
    }
  };

  if (!flashSale) return null;

  return (
    <div className="mx-2 mb-6 mt-3 rounded-lg bg-white p-5 lg:mx-[60px]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="text-xl font-bold">🔥 Flash Sale</div>

        <div className="flex gap-x-2">
          {countdown?.days !== "00" && (
            <>
              <div className="rounded-md bg-red-500 p-1 px-2 text-center font-bold text-white">
                {countdown?.days} ngày
              </div>

              <div className="text-xl font-bold text-gray-400">:</div>
            </>
          )}

          <div className="rounded-md bg-red-500 p-1 px-2 text-center font-bold text-white">
            {countdown?.hours}
          </div>

          <div className="text-xl font-bold text-gray-400">:</div>

          <div className="rounded-md bg-red-500 p-1 px-2 text-center font-bold text-white">
            {countdown?.minutes}
          </div>

          <div className="text-xl font-bold text-gray-400">:</div>

          <div className="rounded-md bg-red-500 p-1 px-2 text-center font-bold text-white">
            {countdown?.seconds}
          </div>
        </div>
      </div>

      <div className="flex grow flex-wrap justify-center gap-2 lg:gap-4">
        {flashSale &&
          flashSale?.books?.map((item: any, index: number) => {
            return (
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
                      onClick={() => router.push(`/books/${item?.book_id?.id}`)}
                      src={item?.book_id?.images[0]}
                    />
                  </div>

                  <div className="mt-3 flex flex-col gap-2">
                    <div className="flex items-center gap-x-2 text-sm font-[500] text-red-500 lg:text-[20px]">
                      <div>
                        {new Intl.NumberFormat("vi-VN").format(item?.price)}đ
                      </div>

                      <div className="flex items-center justify-center rounded-sm bg-gray-100 p-1 text-xs font-[400] text-black">
                        -
                        {(
                          (1 - item?.price / item?.book_id?.origin_price) *
                          100
                        ).toFixed(0)}
                        %
                      </div>
                    </div>

                    <div className="mt-1 flex flex-col gap-y-1 text-sm">
                      <div className="relative w-full">
                        <Progress
                          className="h-5 bg-red-200 [&>div]:bg-red-500"
                          value={
                            (item?.sold / (item?.quantity + item.sold)) * 100
                          }
                        />

                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          Đã bán {item?.sold} / {item?.quantity + item.sold}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      {item?.book_id?.authors[0]?.name}
                    </div>

                    <div
                      className="line-clamp-2 max-w-[180px] text-sm font-medium text-gray-900 lg:text-base"
                      onClick={() => router.push(`/books/${item?.book_id?.id}`)}
                    >
                      {item?.book_id?.name}
                    </div>

                    <div className="mt-1 flex max-w-[calc((100vw-20px)/2)] flex-wrap items-center justify-between text-sm text-gray-500 md:max-w-full">
                      <div className="flex flex-col gap-2 text-xs">
                        <RatingStars
                          rating={item?.book_id?.rating?.average}
                          size={10}
                        />

                        <div>
                          Đã bán&nbsp;{formatNumber(item?.book_id?.total_sold)}
                        </div>
                      </div>

                      <ShoppingCart
                        className="cursor-pointer hover:scale-150 hover:text-blue-500"
                        onClick={() => handleAddToCart(item.book_id?.id)}
                        size={16}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
