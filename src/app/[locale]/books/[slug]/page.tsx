"use client";

import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";

// shadcn/ui Badge
import {
  BookOpen,
  Headphones,
  MapPin,
  MinusCircleIcon,
  MinusIcon,
  MinusSquare,
  PlusCircleIcon,
  PlusSquare,
  PlusSquareIcon,
  ShoppingCart,
  Star,
} from "lucide-react";
import styled from "styled-components";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// shadcn/ui Card
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// shadcn/ui Input
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// shadcn/ui Button
import { Input } from "@/components/ui/input";

// Styled Components
const ProductContainer = styled.div`
  padding: 40px;
  background-color: #f9f9f9;
  .swiper-container {
    width: 100%;
    max-width: 100%;
    max-height: 100vh;
    // CSS Grid/Flexbox bug size workaround
    // @see https://github.com/kenwheeler/slick/issues/982
    // @see https://github.com/nolimits4web/swiper/issues/3599
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

const ProductInfo = styled.div`
  background-color: #fff;
  padding: 20px 30px;
  border-radius: 20px;
`;

const ProductTitle = styled.h1`
  font-size: 21px;
  margin: 10px 0;
  line-height: 32px;
`;

const ProductPrice = styled.div`
  font-weight: bold;
  font-size: 30px;
  margin: 10px 0;
`;

const ProductDescription = styled.div`
  line-height: 30px;
`;

const ProductReview = styled.div`
  background-color: #fff;
  margin: 20px 0;
  padding: 20px;
  border-radius: 20px;
`;

const ProductReviewTitle = styled.div`
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 20px;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const ThumbnailSlider = styled(Swiper)`
  margin-top: 20px;
  .swiper-slide {
    opacity: 0.6;
    cursor: pointer;
    border-radius: 10px;
    overflow: hidden;
  }
  .swiper-slide-thumb-active {
    opacity: 1;
  }
  .swiper-slide {
    width: 60px !important;
  }
`;

const ThumbnailImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
`;

const productInfo = {
  brand: { id: 1, name: "Apple" },
  name: "iPhone 13 Pro Max",
  averageRating: 4.5,
  feedbacksCount: 120,
  totalSold: 500,
  currentPrice: 25000000,
  article: "<p>Chiếc điện thoại cao cấp với camera siêu đỉnh.</p>",
};

const feedback = [
  { id: 1, content: "Sản phẩm tuyệt vời!", rating: 5 },
  { id: 2, content: "Rất hài lòng với chất lượng.", rating: 4 },
];
const arrImg = [
  "https://danviet.mediacdn.vn/296231569849192448/2023/8/26/sach-nna-ban-tieng-anh-16930541445461508724279.jpg",
  "https://danviet.mediacdn.vn/296231569849192448/2023/8/26/sach-nna-ban-tieng-anh-16930541445461508724279.jpg",
  "https://danviet.mediacdn.vn/296231569849192448/2023/8/26/sach-nna-ban-tieng-anh-16930541445461508724279.jpg",
  "https://danviet.mediacdn.vn/296231569849192448/2023/8/26/sach-nna-ban-tieng-anh-16930541445461508724279.jpg",
  "https://danviet.mediacdn.vn/296231569849192448/2023/8/26/sach-nna-ban-tieng-anh-16930541445461508724279.jpg",
];

const ProductDetailPage = () => {
  const handleAddToCart = () => alert("Thêm vào giỏ hàng");
  const onChangeQuantityAddToCart = (e: React.ChangeEvent<HTMLInputElement>) =>
    console.log("Số lượng:", e.target.value);
  const handleAddToCompareList = () => alert("Thêm vào danh sách so sánh");
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [isSwiperReady, setIsSwiperReady] = useState(false);

  return (
    <ProductContainer>
      <ProductTop>
        <ProductImage>
          {arrImg?.length > 1 && (
            <Swiper
              className="main-swiper"
              modules={[Navigation, Thumbs]}
              navigation
              observeParents={true}
              observer={true}
              onInit={() => setIsSwiperReady(true)}
              style={{ visibility: isSwiperReady ? "visible" : "hidden" }}
              thumbs={{ swiper: thumbsSwiper }}
            >
              {arrImg.map((img, index) => (
                <SwiperSlide key={index}>
                  <MainImage alt={`Product Image ${index + 1}`} src={img} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <ThumbnailSlider
            className="thumbnail-swiper"
            freeMode={true}
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            slidesPerView={4}
            spaceBetween={10}
            watchSlidesProgress={true}
          >
            {arrImg.map((img, index) => (
              <SwiperSlide key={index}>
                <ThumbnailImage alt={`Thumbnail ${index + 1}`} src={img} />
              </SwiperSlide>
            ))}
          </ThumbnailSlider>
        </ProductImage>

        <ProductContent>
          <div className="rounded-lg bg-white p-5 text-sm">
            <div>
              Tác giả: &nbsp;
              <Link className="text-blue-500" href="#">
                Nguyễn Nhật Ánh
              </Link>
            </div>

            <div className="my-2">
              <div className="text-[22px] font-medium">
                Tôi Thấy Hoa Vàng Trên Cỏ Xanh
              </div>

              <div className="mt-2 flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    color={
                      i < Math.floor(productInfo.averageRating)
                        ? "#FFD700"
                        : "#C0C0C0"
                    }
                    fill={
                      i < Math.floor(productInfo.averageRating)
                        ? "#FFD700"
                        : "#C0C0C0"
                    }
                    key={i}
                    size={12}
                  />
                ))}

                <span className="text-sm text-gray-500">
                  ({productInfo.feedbacksCount}) | Đã bán:{" "}
                  {productInfo.totalSold}
                </span>
              </div>

              <div className="my-3 flex items-center">
                <div className="text-[28px] font-semibold text-red-500">
                  {new Intl.NumberFormat("vi-VN").format(
                    productInfo.currentPrice,
                  )}
                  đ
                </div>

                <div className="ml-2 rounded-sm bg-gray-200 px-2 py-1 text-xs text-black">
                  -30%
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

                <div className="">Thái Hà</div>
              </div>

              <div className="my-2 flex items-center gap-2 border-b border-gray-200 pb-2">
                <div className="w-3/5">Kích thước:</div>

                <div className="">17.2 x 20 cm</div>
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

                <div className="">322</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-5">
            <div className="mb-2 text-base font-medium">Mô tả sản phẩm</div>

            <div className="text-sm text-gray-900">
              Những câu chuyện nhỏ xảy ra ở một ngôi làng nhỏ: chuyện người,
              chuyện cóc, chuyện ma, chuyện công chúa và hoàng tử , rồi chuyện
              đói ăn, cháy nhà, lụt lội, Bối cảnh là trường học, nhà trong xóm,
              bãi tha ma. Dẫn chuyện là cậu bé 15 tuổi tên Thiều. Thiều có chú
              ruột là chú Đàn, có bạn thân là cô bé Mận. Nhưng nhân vật đáng yêu
              nhất lại là Tường, em trai Thiều, một cậu bé học không giỏi.
              Thiều, Tường và những đứa trẻ sống trong cùng một làng, học cùng
              một trường, có biết bao chuyện chung. Chúng nô đùa, cãi cọ rồi yêu
              thương nhau, cùng lớn lên theo năm tháng, trải qua bao sự kiện
              biến cố của cuộc đời. Tác giả vẫn giữ cách kể chuyện bằng chính
              giọng trong sáng hồn nhiên của trẻ con. 81 chương ngắn là 81 câu
              chuyện hấp dẫn với nhiều chi tiết thú vị, cảm động, có những tình
              tiết bất ngờ, từ đó lộ rõ tính cách người. Cuốn sách, vì thế, có
              sức ám ảnh...
            </div>
          </div>

          <div className="rounded-lg bg-white p-5">
            <div className="mb-3 text-base font-medium">Đánh giá sản phẩm</div>

            <div className="text-[25px] font-bold">
              <div className="flex items-center gap-x-2">
                5.0
                <Star className="text-yellow-400" fill="#FFD700" size={20} />
                <Star className="text-yellow-400" fill="#FFD700" size={20} />
                <Star className="text-yellow-400" fill="#FFD700" size={20} />
                <Star className="text-yellow-400" fill="#FFD700" size={20} />
                <Star className="text-yellow-400" fill="#FFD700" size={20} />
              </div>

              <div className="text-base font-[400] text-gray-400">
                (1 đánh giá)
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
            {[1, 2, 3, 4, 7, 8]?.map((item, index) => {
              return (
                <div
                  className="flex w-[45%] flex-col gap-2 rounded-md border border-gray-200 p-2"
                  key={index}
                >
                  <Image
                    alt=""
                    className="h-[110px] rounded-md border object-cover p-1"
                    height={150}
                    src="https://danviet.mediacdn.vn/296231569849192448/2023/8/26/sach-nna-ban-tieng-anh-16930541445461508724279.jpg"
                    width={100}
                  />

                  <div className="text-sm">
                    <div className="line-clamp-2 max-w-[300px] text-xs">
                      Tôi thấy hoa vàng trên cỏ xanh
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

                    <div className="font-medium text-gray-800">250.000đ</div>
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
