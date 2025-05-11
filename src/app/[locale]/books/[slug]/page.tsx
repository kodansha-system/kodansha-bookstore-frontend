"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { api } from "@/services/axios";
import { useCartStore } from "@/store/cartStore";
import DOMPurify from "dompurify";
import { Star } from "lucide-react";
import styled from "styled-components";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import MinusIcon from "@/components/icons/MinusIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useDetailBook } from "@/hooks/useBooks";

import { FindShopsHaveBook } from "../components/FindShopsHaveBook";
import ProductSlider from "../components/ProductImages";

const ProductContainer = styled.div`
  padding: 20px 40px;
  background-color: #f9f9f9;
  user-select: none;
  .swiper-container {
    width: 100%;
    max-width: 100%;
    max-height: 100vh;
    min-height: 0;
    min-width: 0;
  }
`;

const ProductTop = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;

  @media (max-width: 1100px) {
    flex-direction: column;
    padding: 20px 10px;
  }
`;

const ProductImage = styled.div`
  width: 30%;
  max-height: 500px;
  height: 100%;
  background-color: #fff;
  border-radius: 20px;
  position: sticky;
  top: 80px;
  padding: 20px;
  border: 1px solid #e5e7eb;

  @media (max-width: 1100px) {
    width: 100%;
    position: relative;
    top: 0;
  }

  @media (max-width: 768px) {
    height: 400px;
  }
`;

const ProductContent = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 1100px) {
    width: 100%;
  }
`;

const feedback = [
  { id: 1, content: "Sản phẩm tuyệt vời!", rating: 5 },
  { id: 2, content: "Rất hài lòng với chất lượng.", rating: 4 },
];

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

const ProductDetailPage = ({ params }: ProductDetailPageProps) => {
  const form = useForm<{ quantity: number }>({
    defaultValues: {
      quantity: 1,
    },
  });
  const { setBookToBuy } = useCartStore();
  const router = useRouter();
  const [countdown, setCountdown] = useState<any>();
  const [listReview, setListReview] = useState<any[]>([]);
  const { listBookSameCategory, detailBook } = useDetailBook(params.slug);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const rating = useMemo(() => {
    return {
      total_count:
        detailBook?.rating?.count?.oneStar +
        detailBook?.rating?.count?.twoStar +
        detailBook?.rating?.count?.threeStar +
        detailBook?.rating?.count?.fourStar +
        detailBook?.rating?.count?.fiveStar,
    };
  }, [detailBook]);

  const handleAddToCart = async (data: any) => {
    try {
      await api.post("/carts", {
        books: [
          {
            book_id: detailBook?.id,
            quantity: Number(data.quantity),
          },
        ],
      });

      toast.success("Thêm vào giỏ hàng thành công!");
    } catch (err) {
      toast.error("Có lỗi khi thêm vào giỏ hàng!");
      console.log(err);
    }
  };

  const handleBuyBook = () => {
    const numberOfBookWantBuy = form.getValues("quantity");

    if (detailBook?.in_flash_sale) {
      setBookToBuy([
        {
          discount: detailBook?.origin_price - detailBook?.price,
          id: detailBook?.id,
          image: detailBook?.images[0],
          name: detailBook?.name,
          price:
            detailBook?.in_flash_sale && countdown
              ? detailBook?.flash_sale?.price
              : detailBook?.price,
          quantity: 1,
          total: detailBook?.price,
          flash_sale_id: detailBook?.flash_sale?.flash_sale_id,
          weight: detailBook?.weight,
          height: detailBook?.height,
          length: detailBook?.length,
          width: detailBook?.width,
        },
      ]);
    }
    setBookToBuy([
      {
        discount: detailBook?.origin_price - detailBook?.price,
        id: detailBook?.id,
        image: detailBook?.images[0],
        name: detailBook?.name,
        price:
          detailBook?.in_flash_sale && countdown
            ? detailBook?.flash_sale?.price
            : detailBook?.price,
        quantity: numberOfBookWantBuy,
        total: detailBook?.price,
        weight: detailBook?.weight,
        height: detailBook?.height,
        length: detailBook?.length,
        width: detailBook?.width,
      },
    ]);
    router.push("/payment");
  };

  const getActiveFlashSale = async () => {
    try {
      const response = await api.get("/flashsales/active");

      return response;
    } catch (error) {
      console.error("Lỗi khi gọi flash sale:", error);

      return null;
    }
  };

  const handleGetListReview = async (bookId: string, currentPage: number) => {
    try {
      const res: any = await api.get(
        `/reviews?book_id=${bookId}&current=${currentPage}&pageSize=10`,
      );
      const newReviews = res?.data?.reviews || [];

      setListReview((prev) => [...prev, ...newReviews]);

      const meta = res?.data?.meta;

      console.log(meta);

      if (meta.currentPage >= meta.totalPages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Lỗi khi tải đánh giá", error);
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchAndStartCountdown = async () => {
      const res = await getActiveFlashSale();

      if (!res?.data) return;

      const endTime = res.data.end_time;

      if (endTime && !isNaN(new Date(endTime).getTime())) {
        startCountdown(endTime);
      } else {
        console.warn("⚠️ end_time không hợp lệ:", endTime);
      }
    };

    fetchAndStartCountdown();

    if (params?.slug) {
      handleGetListReview(params?.slug, page);
    }
  }, [params?.slug]);

  const handleLoadMore = () => {
    const nextPage = page + 1;

    setPage(nextPage);

    handleGetListReview(detailBook?.id, nextPage);
  };

  const startCountdown = (endTimeStr: string) => {
    const endTime = new Date(endTimeStr).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        toast.info("Flash sale đã kết thúc");
        clearInterval(interval);
        window.location.reload();

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

  if (!detailBook) return null;

  return (
    <ProductContainer>
      <ProductTop>
        <ProductImage>
          <ProductSlider data={detailBook} />
        </ProductImage>

        <ProductContent>
          <div className="rounded-lg border border-gray-200 bg-white p-5 text-sm">
            <div>
              Tác giả: &nbsp;
              <Link className="text-blue-500" href="#">
                {detailBook?.authors?.[0]?.name}
              </Link>
            </div>

            <div className="my-2">
              <div className="text-[22px] font-medium">{detailBook?.name}</div>

              <div className="mt-2 flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    color={
                      i < Math.floor(detailBook?.rating?.average)
                        ? "#FFD700"
                        : "#C0C0C0"
                    }
                    fill={
                      i < Math.floor(detailBook?.rating?.average)
                        ? "#FFD700"
                        : "#C0C0C0"
                    }
                    key={i}
                    size={12}
                  />
                ))}

                <span className="text-sm text-gray-500">
                  ({rating?.total_count || 0}
                  &nbsp;lượt đánh giá ) | Đã bán:&nbsp;
                  {detailBook?.total_sold}
                </span>
              </div>

              <div className="my-3 flex items-center">
                {detailBook?.in_flash_sale ? (
                  <div className="text-[28px] font-semibold text-red-500">
                    {detailBook?.flash_sale?.price
                      ? new Intl.NumberFormat("vi-VN").format(
                          detailBook?.flash_sale?.price,
                        )
                      : 0}
                    đ
                  </div>
                ) : (
                  <>
                    <div className="text-[28px] font-semibold text-red-500">
                      {detailBook?.price
                        ? new Intl.NumberFormat("vi-VN").format(
                            detailBook?.price,
                          )
                        : 0}
                      đ
                    </div>

                    <div className="ml-2 rounded-sm bg-gray-200 px-2 py-1 text-xs text-black">
                      -
                      {(detailBook?.price
                        ? (1 - detailBook?.price / detailBook?.origin_price) *
                          100
                        : 0
                      ).toFixed(0)}
                      %
                    </div>
                  </>
                )}
              </div>

              {detailBook?.in_flash_sale && (
                <div className="my-3 flex items-center gap-2">
                  <span>Giá sẽ cập nhật sau:</span>

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
              )}

              <div className="my-2 flex items-center gap-2">
                Số lượng:
                <div className="flex items-center gap-1">
                  <div
                    className="cursor-pointer rounded-md border border-gray-400 p-1"
                    onClick={() =>
                      form.setValue(
                        "quantity",
                        Math.max(1, Number(form.watch("quantity")) - 1),
                      )
                    }
                  >
                    <MinusIcon />
                  </div>

                  <Input
                    className="h-[33px] w-[60px] select-none border-gray-400 text-center text-[15px]"
                    max={10}
                    min={1}
                    type="number"
                    {...form.register("quantity", {
                      min: 1,
                      max: 10,
                    })}
                  />

                  <div
                    className="cursor-pointer rounded-md border border-gray-400 p-1"
                    onClick={() =>
                      form.setValue(
                        "quantity",
                        Math.min(10, Number(form.watch("quantity")) + 1),
                      )
                    }
                  >
                    <PlusIcon />
                  </div>
                </div>
                {Number(form.watch("quantity")) < 1 ||
                Number(form.watch("quantity") > 10) ? (
                  <div className="text-red-400">Số lượng không hợp lệ</div>
                ) : (
                  ""
                )}
              </div>

              <div className="my-5 flex gap-2">
                <Button
                  className="select-none bg-blue-500 hover:bg-blue-400"
                  onClick={form.handleSubmit(handleAddToCart)}
                >
                  Thêm vào giỏ hàng
                </Button>

                <Button
                  className="select-none"
                  onClick={handleBuyBook}
                  variant="destructive"
                >
                  Mua Ngay
                </Button>
              </div>

              {/* <div className="flex gap-2">
                <button className="flex w-[160px] items-center gap-2 rounded-md border bg-blue-100 px-4 py-2 text-blue-800 transition hover:bg-blue-400 hover:text-white">
                  <BookOpen className="text-blue-700" size={20} />
                  Đọc thử
                </button>

                <button className="flex w-[160px] items-center gap-2 rounded-md border bg-green-100 px-4 py-2 text-green-800 transition hover:bg-green-400 hover:text-white">
                  <ShoppingCart className="text-green-700" size={20} />
                  Mua ebook
                </button>

                <button className="flex w-[160px] items-center gap-2 rounded-md border bg-orange-100 px-4 py-2 text-orange-800 transition hover:bg-orange-400 hover:text-white">
                  <Headphones className="text-orange-700" size={20} />
                  Nghe sách nói
                </button>
              </div> */}
            </div>

            <FindShopsHaveBook book_id={detailBook?.id} />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="font-medium">Thông tin chi tiết</div>

            <div className="text-sm text-gray-500">
              <div className="my-2 flex items-center gap-2 border-b border-gray-200 pb-2">
                <div className="w-3/5">Công ty phát hành:</div>

                <div className="">{detailBook?.company_publish}</div>
              </div>

              <div className="my-2 flex items-center gap-2 border-b border-gray-200 pb-2">
                <div className="w-3/5">Kích thước:</div>

                <div className="">{detailBook?.dimensions}</div>
              </div>

              <div className="my-2 flex items-center gap-2 border-b border-gray-200 pb-2">
                <div className="w-3/5">Loại bìa:</div>

                <div className="">Bìa mềm</div>
              </div>

              <div className="my-2 flex items-center gap-2 border-b border-gray-200 pb-2">
                <div className="w-3/5">Nhà xuất bản:</div>

                <div className="">NXB Trẻ</div>
              </div>

              <div className="my-2 flex items-center gap-2 border-b border-gray-200 pb-2">
                <div className="w-3/5">Số trang:</div>

                <div className="">{detailBook?.total_pages}</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="mb-2 text-base font-medium">Mô tả sản phẩm</div>

            <div
              className="text-sm text-gray-900"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(detailBook?.description),
              }}
            ></div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="text-[25px] font-bold">
              <div className="flex items-center gap-x-2">
                {detailBook?.rating?.average?.toFixed(1) || 0}

                {[...Array(5)].map((_, i) => (
                  <Star
                    color={
                      i < Math.floor(detailBook?.rating?.average || 0)
                        ? "#FFD700"
                        : "#C0C0C0"
                    }
                    fill={
                      i < Math.floor(detailBook?.rating?.average || 0)
                        ? "#FFD700"
                        : "#C0C0C0"
                    }
                    key={i}
                    size={20}
                  />
                ))}
              </div>

              <div className="text-base font-[400] text-gray-400">
                ({rating?.total_count || 0} đánh giá)
              </div>
            </div>

            {/* Tổng hợp */}
            <div>
              {[5, 4, 3, 2, 1].map((star) => {
                const starCountMap = {
                  1: detailBook?.rating?.count?.oneStar || 0,
                  2: detailBook?.rating?.count?.twoStar || 0,
                  3: detailBook?.rating?.count?.threeStar || 0,
                  4: detailBook?.rating?.count?.fourStar || 0,
                  5: detailBook?.rating?.count?.fiveStar || 0,
                };

                const starCount = starCountMap[star as 1 | 2 | 3 | 4 | 5];

                const percentage =
                  rating?.total_count > 0
                    ? (starCount / rating.total_count) * 100
                    : 0;

                return (
                  <div
                    className="flex cursor-pointer items-center gap-x-3 py-1"
                    key={star}
                  >
                    <div className="flex w-[120px] items-center gap-1">
                      {[...Array(star)].map((_, i) => (
                        <Star
                          className="text-yellow-400"
                          fill="#FFD700"
                          key={i}
                          size={16}
                        />
                      ))}
                    </div>

                    <div className="h-2 max-w-[100px] flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-blue-400"
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>

                    <div className="ml-3 text-sm text-gray-600">
                      {starCount} lượt
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex flex-col gap-3 text-sm">
              {listReview.map((item) => (
                <div
                  className="rounded-md border border-gray-200 p-3"
                  key={item.id}
                >
                  <div>
                    <div className="flex items-center gap-x-2">
                      <Image
                        alt=""
                        className="object-fit h-[30px] rounded-full"
                        height={20}
                        src={item?.created_by?.image}
                        width={30}
                      />

                      {item?.created_by?.name}
                    </div>

                    <div className="my-2 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          color={i < item.rating ? "#FFD700" : "#C0C0C0"}
                          fill={i < item.rating ? "#FFD700" : "#C0C0C0"}
                          key={i}
                          size={14}
                        />
                      ))}
                    </div>

                    {item?.image && (
                      <Image
                        alt=""
                        className="object-contain"
                        height={200}
                        src={item?.image}
                        width={200}
                      />
                    )}

                    <div className="mt-3">{item.content}</div>

                    <div className="mt-3 italic text-gray-400">
                      Đã đánh giá vào:&nbsp;
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}

              {hasMore && (
                <div className="text-center">
                  <Button
                    className="w-[200px] bg-blue-500 hover:bg-blue-500"
                    onClick={handleLoadMore}
                  >
                    Xem thêm
                  </Button>
                </div>
              )}
            </div>
          </div>
        </ProductContent>

        <div className="sticky top-[80px] h-[700px] w-[300px] rounded-lg bg-white p-4">
          <div className="mb-3 font-medium">Sản phẩm cùng danh mục</div>

          <div className="flex flex-wrap gap-2">
            {listBookSameCategory
              ?.slice(0, 6)
              ?.map((item: any, index: number) => {
                return (
                  <div
                    className="flex w-[45%] flex-col gap-2 rounded-md border border-gray-200 p-2"
                    key={index}
                    onClick={() => router.push("/books/" + item?.id)}
                  >
                    <Image
                      alt=""
                      className="h-[110px] rounded-md border object-cover p-1"
                      height={150}
                      src={item?.images?.[0]}
                      width={100}
                    />

                    <div className="text-sm">
                      <div className="line-clamp-2 max-w-[300px] text-xs">
                        {item?.name}
                      </div>

                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            color={i < 5 ? "#FFD700" : "#C0C0C0"}
                            fill={i < 5 ? "#FFD700" : "#C0C0C0"}
                            key={i}
                            size={10}
                          />
                        ))}
                      </div>

                      <div className="font-medium text-gray-800">
                        {new Intl.NumberFormat("vi-VN").format(
                          detailBook?.price,
                        )}
                        đ
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </ProductTop>
    </ProductContainer>
  );
};

export default ProductDetailPage;
