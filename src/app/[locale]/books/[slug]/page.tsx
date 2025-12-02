"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { api } from "@/services/axios";
import { useCartStore } from "@/store/cartStore";
import { useQueryClient } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { Star } from "lucide-react";
import styled from "styled-components";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import Chatbot from "@/components/Chatbot";
import MinusIcon from "@/components/icons/MinusIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useDetailBook } from "@/hooks/useBooks";

import { checkIsLogin, formatNumber } from "@/lib/utils";

import Description from "../components/Description";
import { FindShopsHaveBook } from "../components/FindShopsHaveBook";
import ProductSlider from "../components/ProductImages";
import Questions from "../components/Questions";

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
  @media (max-width: 1100px) {
    padding: 0px 10px;
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
  const { listBookRecommended, detailBook } = useDetailBook(params.slug);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const queryClient = useQueryClient();

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
      if (!checkIsLogin()) {
        return;
      }

      await api.post("/carts", {
        books: [
          {
            book_id: detailBook?.id,
            quantity: Number(data.quantity),
          },
        ],
      });

      queryClient.invalidateQueries({ queryKey: ["recommended-books"] });
      queryClient.invalidateQueries({ queryKey: ["detail-cart"] });

      toast.success("Thêm vào giỏ hàng thành công!");
    } catch (err: any) {
      console.log(err);
      toast.error(err?.message || "Có lỗi khi thêm vào giỏ hàng!");
      console.log(err);
    }
  };

  const handleBuyBook = async () => {
    try {
      if (!checkIsLogin()) {
        return;
      }

      const numberOfBookWantBuy = form.getValues("quantity");
      const resCheckQuantity = await api.post("/carts/check-quantity", {
        book_id: detailBook?.id,
        quantity: numberOfBookWantBuy,
        is_flash_sale: detailBook?.in_flash_sale,
        flash_sale_id: detailBook?.flash_sale?.flash_sale_id,
      });

      if (resCheckQuantity) {
        if (detailBook?.in_flash_sale === true) {
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
              is_flash_sale: true,
              weight: detailBook?.weight,
              height: detailBook?.height,
              length: detailBook?.length,
              width: detailBook?.width,
            },
          ]);
        } else {
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
        }

        router.push("/payment");
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err?.message || "Hiện chưa thể mua ngay");
    }
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
        `/reviews?book_id=${bookId}&current=${currentPage}&pageSize=10&is_verified=true`,
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

  if (!detailBook) return null;

  return (
    <ProductContainer>
      <Chatbot />

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
              <div className="line-clamp-2 text-[22px] font-medium leading-[32px]">
                {detailBook?.name}
              </div>

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
                  {formatNumber(detailBook?.total_sold)}
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
                    <span className="ml-2 text-base text-gray-300 line-through">
                      {detailBook?.origin_price?.toLocaleString()}đ
                    </span>
                    {/* Tính discount theo giá flash sale */}
                    <span className="ml-2 rounded-sm bg-gray-200 px-2 py-1 text-xs text-black">
                      -
                      {detailBook?.flash_sale?.price
                        ? (
                            (1 -
                              detailBook?.flash_sale?.price /
                                detailBook?.origin_price) *
                            100
                          ).toFixed(0)
                        : 0}
                      %
                    </span>
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
                      <span className="ml-2 text-base font-medium text-gray-300 line-through">
                        {detailBook?.origin_price?.toLocaleString()}đ
                      </span>
                    </div>

                    <div className="ml-2 rounded-sm bg-gray-200 px-2 py-1 text-xs font-medium text-black">
                      -
                      {detailBook?.price
                        ? (
                            (1 - detailBook?.price / detailBook?.origin_price) *
                            100
                          ).toFixed(0)
                        : 0}
                      %
                    </div>
                  </>
                )}
              </div>

              {detailBook?.in_flash_sale && (
                <div className="my-3 flex items-center gap-2">
                  <span>Giá sẽ cập nhật sau:</span>

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
              )}

              {!(
                detailBook?.quantity === 0 || detailBook?.is_deleted === true
              ) ? (
                <div className="my-2 flex items-center gap-2">
                  Số lượng:
                  <div className="flex items-center gap-1">
                    <div
                      className="cursor-pointer rounded-md border border-gray-400 p-1"
                      onClick={() =>
                        form.setValue(
                          "quantity",
                          // Math.max(1, Number(form.watch("quantity")) - 1),
                          Number(form.watch("quantity")) - 1,
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
                      // {...form.register("quantity", {
                      //   min: 1,
                      //   max: 10,
                      // })}
                      {...form.register("quantity")}
                    />

                    <div
                      className="cursor-pointer rounded-md border border-gray-400 p-1"
                      onClick={() =>
                        form.setValue(
                          "quantity",
                          Number(form.watch("quantity")) + 1,
                          // Math.min(10, Number(form.watch("quantity")) + 1),
                        )
                      }
                    >
                      <PlusIcon />
                    </div>
                  </div>
                  {/* {Number(form.watch("quantity")) < 1 ||
                  Number(form.watch("quantity") > 10) ? (
                    <div className="text-red-400">Số lượng không hợp lệ</div>
                  ) : (
                    ""
                  )} */}
                </div>
              ) : (
                <div className="text-[18px]">Sản phẩm tạm hết hàng</div>
              )}

              <div className="my-5 flex gap-2">
                <Button
                  className="select-none bg-blue-500 hover:bg-blue-400"
                  disabled={
                    detailBook?.quantity === 0 ||
                    detailBook?.is_deleted === true
                  }
                  onClick={form.handleSubmit(handleAddToCart)}
                >
                  Thêm vào giỏ hàng
                </Button>

                <Button
                  className="select-none"
                  disabled={
                    detailBook?.quantity === 0 ||
                    detailBook?.is_deleted === true
                  }
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

            <Description html={DOMPurify.sanitize(detailBook?.description)} />
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
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-x-2">
                      <Image
                        alt=""
                        className="object-fit size-[30px] rounded-full"
                        height={30}
                        src={item?.created_by?.image}
                        width={30}
                      />

                      {item?.created_by?.name}
                    </div>

                    {/* Rating */}
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

                    {/* Review Image */}
                    {item?.image && (
                      <Image
                        alt=""
                        className="mt-2 object-contain"
                        height={200}
                        src={item?.image}
                        width={200}
                      />
                    )}

                    {/* Review Content */}
                    <div className="mt-3">{item.content}</div>

                    {/* Review Created Date */}
                    <div className="mt-3 text-xs italic text-gray-400">
                      Đã đánh giá vào:&nbsp;
                      {new Date(item.created_at).toLocaleDateString("vi-VN")}
                    </div>

                    {/* Reply section */}
                    {item.reply && (
                      <div className="mt-4 rounded-md bg-gray-100 p-3">
                        <div className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                          <span className="text-blue-600">
                            Phản hồi từ Kodansha - {item?.reply?.staff_id?.name}
                          </span>
                        </div>

                        <div className="text-sm text-gray-800">
                          {item?.reply?.content}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-5">
            <Questions productId={params?.slug} />
          </div>
        </ProductContent>

        <div className="sticky top-[80px] max-h-[700px] min-h-[200px] w-full rounded-lg bg-white p-4 lg:w-[300px]">
          <div className="mb-3 font-medium">Thường được mua kèm</div>

          <div className="flex flex-wrap justify-center gap-2">
            {listBookRecommended
              ?.slice(0, 6)
              ?.map((item: any, index: number) => {
                return (
                  <div
                    className="flex w-[45%] max-w-[130px] flex-col gap-2 rounded-md border border-gray-200 p-2"
                    key={index}
                    onClick={() => router.push("/books/" + item?._id)}
                  >
                    <Image
                      alt=""
                      className="mx-auto h-[110px] rounded-md border object-cover p-1"
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
                            color={
                              i < Math.floor(item?.rating ?? 0)
                                ? "#FFD700"
                                : "#C0C0C0"
                            }
                            fill={
                              i < Math.floor(item?.rating ?? 0)
                                ? "#FFD700"
                                : "#C0C0C0"
                            }
                            key={i}
                            size={10}
                          />
                        ))}
                      </div>

                      <div className="font-medium text-gray-800">
                        {new Intl.NumberFormat("vi-VN").format(item?.price)}đ
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
