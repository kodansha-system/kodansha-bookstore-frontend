import { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { api } from "@/services/axios";
import { ShoppingCart } from "lucide-react";

import RatingStars from "@/components/shared/RatingStar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function FlashSaleSection() {
  const [flashSale, setFlashSale] = useState<any>(null);
  const [countdown, setCountdown] = useState<any>();
  const router = useRouter();

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

      setCountdown({
        hours,
        minutes,
        seconds,
      });
    }, 1000);
  };

  if (!flashSale) return null;

  const handleAddToCart = async (bookId: number) => {
    try {
      const response = await api.post("/carts", {
        book_id: bookId,
        quantity: 1,
      });

      if (response.status === 200) {
        alert("Thêm vào giỏ hàng thành công!");
      } else {
        alert("Thêm vào giỏ hàng thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Đã xảy ra lỗi khi thêm vào giỏ hàng!");
    }
  };

  if (!flashSale) return null;

  return (
    <div className="mx-[60px] mt-3 rounded-lg bg-white p-5">
      <div className="mb-3 flex items-center gap-x-2">
        <div className="text-xl font-bold">🔥 Flash Sale</div>

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

      <div className="flex grow flex-wrap justify-center gap-5">
        {flashSale &&
          flashSale?.books?.map((item: any, index: number) => (
            <div className="block" key={index}>
              <div className="min-h-full rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-transform duration-1000 hover:shadow-lg">
                <div className="relative size-[180px]">
                  <Image
                    alt="Sản phẩm"
                    className="rounded-md object-cover"
                    fill
                    onClick={() => router.push(`/books/${item?.book_id?.id}`)}
                    src={item?.book_id?.images[0]}
                  />
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  {/* giá */}
                  <div className="flex items-center gap-x-2 text-[20px] font-[500] text-red-500">
                    <div>
                      {new Intl.NumberFormat("vi-VN").format(item?.price)}đ
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
                    className="line-clamp-2 max-w-[180px] text-base font-medium text-gray-900"
                    onClick={() => router.push(`/books/${item?.book_id?.id}`)}
                  >
                    {item?.book_id?.name}
                  </div>

                  <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-x-2 text-xs">
                      <RatingStars rating={5} size={10} /> Đã bán&nbsp;
                      {item?.book_id?.total_sold}
                    </div>

                    <ShoppingCart
                      className="cursor-pointer hover:scale-150 hover:text-blue-500"
                      onClick={() => handleAddToCart(item?.book_id?.id)}
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
          className="mx-auto mt-2 block w-[200px] rounded-md border border-red-500 bg-white p-2 text-center text-base font-medium text-red-500 transition-[1000] hover:bg-red-100"
          onClick={() => router.push("/search")}
        >
          Xem thêm
        </Button>
      </div>
    </div>
  );
}
