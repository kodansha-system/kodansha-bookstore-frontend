"use client";

import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { api } from "@/services/axios";
import DOMPurify from "dompurify";
// shadcn/ui Badge
import {
  BookOpen,
  Headphones,
  MapPin,
  MinusCircleIcon,
  PlusCircleIcon,
  ShoppingCart,
  Star,
} from "lucide-react";
import styled from "styled-components";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useDetailBook } from "@/hooks/useBooks";

import ProductSlider from "../components/ProductImages";

const ProductContainer = styled.div`
  padding: 40px;
  background-color: #f9f9f9;
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

  @media (max-width: 1100px) {
    width: 100%;
    position: relative;
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
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    const response = await api.post("/carts", {
      books: [
        {
          book_id: detailBook?.id,
          quantity,
        },
      ],
    });

    console.log(response);
  };

  const onChangeQuantityAddToCart = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuantity(Number(e.target.value));
  };
  const { listBookSameCategory, detailBook } = useDetailBook(params.slug);

  return (
    <ProductContainer>
      <ProductTop>
        <ProductImage>
          <ProductSlider data={detailBook} />
        </ProductImage>

        <ProductContent>
          <div className="rounded-lg bg-white p-5 text-sm">
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
                      i < Math.floor(detailBook?.rating_average)
                        ? "#FFD700"
                        : "#C0C0C0"
                    }
                    fill={
                      i < Math.floor(detailBook?.rating_average)
                        ? "#FFD700"
                        : "#C0C0C0"
                    }
                    key={i}
                    size={12}
                  />
                ))}

                <span className="text-sm text-gray-500">
                  ({detailBook?.rating_count}) | Đã bán:&nbsp;
                  {detailBook?.total_sold}
                </span>
              </div>

              <div className="my-3 flex items-center">
                <div className="text-[28px] font-semibold text-red-500">
                  {new Intl.NumberFormat("vi-VN").format(detailBook?.price)}đ
                </div>

                <div className="ml-2 rounded-sm bg-gray-200 px-2 py-1 text-xs text-black">
                  -
                  {(
                    (detailBook?.discount /
                      (detailBook?.price + detailBook?.discount)) *
                    100
                  )?.toFixed(0)}
                  %
                </div>
              </div>

              <div className="my-2 flex items-center gap-2">
                Số lượng:
                <div className="flex items-center gap-1">
                  <MinusCircleIcon
                    className="hover:cursor-pointer"
                    color="gray"
                    size={25}
                  />

                  <Input
                    className="h-[30px] w-[60px] border-2 border-gray-400 text-center text-sm"
                    defaultValue="1"
                    max="10"
                    min="1"
                    onChange={onChangeQuantityAddToCart}
                  />

                  <PlusCircleIcon
                    className="hover:cursor-pointer"
                    color="gray"
                    size={25}
                  />
                </div>
              </div>

              <div className="my-5 flex gap-2">
                <Button
                  className="bg-blue-500 hover:bg-blue-400"
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ hàng
                </Button>

                <Button variant="destructive">Mua Ngay</Button>
              </div>

              <div className="flex gap-2">
                {/* Đọc thử */}
                <button className="flex w-[160px] items-center gap-2 rounded-md border bg-blue-100 px-4 py-2 text-blue-800 transition hover:bg-blue-400 hover:text-white">
                  <BookOpen className="text-blue-700" size={20} />
                  Đọc thử
                </button>

                {/* Mua ebook */}
                <button className="flex w-[160px] items-center gap-2 rounded-md border bg-green-100 px-4 py-2 text-green-800 transition hover:bg-green-400 hover:text-white">
                  <ShoppingCart className="text-green-700" size={20} />
                  Mua ebook
                </button>

                {/* Nghe sách nói */}
                <button className="flex w-[160px] items-center gap-2 rounded-md border bg-orange-100 px-4 py-2 text-orange-800 transition hover:bg-orange-400 hover:text-white">
                  <Headphones className="text-orange-700" size={20} />
                  Nghe sách nói
                </button>
              </div>
            </div>

            <div className="text-medium mt-5 flex cursor-pointer items-end text-gray-800">
              <MapPin className="text-red-600" size={20} />
              Tìm cửa hàng đang có sách
            </div>
          </div>

          <div className="rounded-lg bg-white p-5">
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

          <div className="rounded-lg bg-white p-5">
            <div className="mb-2 text-base font-medium">Mô tả sản phẩm</div>

            <div
              className="text-sm text-gray-900"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(detailBook?.description),
              }}
            ></div>
          </div>

          <div className="rounded-lg bg-white p-5">
            <div className="mb-3 text-base font-medium">Đánh giá sản phẩm</div>

            <div className="text-[25px] font-bold">
              <div className="flex items-center gap-x-2">
                {detailBook?.rating_average?.toFixed(1)}

                {[...Array(5)].map((_, i) => (
                  <Star
                    color={
                      i < Math.floor(detailBook?.rating_average)
                        ? "#FFD700"
                        : "#C0C0C0"
                    }
                    fill={
                      i < Math.floor(detailBook?.rating_average)
                        ? "#FFD700"
                        : "#C0C0C0"
                    }
                    key={i}
                    size={20}
                  />
                ))}
              </div>

              <div className="text-base font-[400] text-gray-400">
                ({detailBook?.rating_count} đánh giá)
              </div>
            </div>

            {/* Tổng hợp */}
            <div>
              {[5, 4, 3, 2, 1].map((star) => (
                <div
                  className="flex cursor-pointer items-center gap-x-3 py-1"
                  key={star}
                  // onClick={() => onFilter(star)}
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
                      className="size-full bg-blue-400"
                      style={{
                        width: `${(5 / 10) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <div className="ml-3 text-sm text-gray-600">{1} lượt</div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex flex-col gap-3">
              {feedback.map((item) => (
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
                        src="https://danviet.mediacdn.vn/296231569849192448/2023/8/26/sach-nna-ban-tieng-anh-16930541445461508724279.jpg"
                        width={30}
                      />
                      Nguyễn Văn A
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

                    <div>{item.content}</div>
                  </div>
                </div>
              ))}
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
