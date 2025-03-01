"use client";

import Image from "next/image";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const images = [
  "https://assets-prd.ignimgs.com/2024/10/23/harry-potter-books-in-order-1-1729712610076.jpg",
  "https://danviet.mediacdn.vn/296231569849192448/2023/8/26/sach-nna-ban-tieng-anh-16930541445461508724279.jpg",
  "https://danviet.mediacdn.vn/296231569849192448/2023/8/26/sach-nna-ban-tieng-anh-16930541445461508724279.jpg",
  "https://danviet.mediacdn.vn/296231569849192448/2023/8/26/sach-nna-ban-tieng-anh-16930541445461508724279.jpg",
  "https://danviet.mediacdn.vn/296231569849192448/2023/8/26/sach-nna-ban-tieng-anh-16930541445461508724279.jpg",
];

const BannerSlider = () => {
  return (
    <div className="relative mx-auto w-[90%] py-10">
      <Swiper
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        centeredSlides={true}
        centerInsufficientSlides={true}
        className="swiper_container"
        coverflowEffect={{
          rotate: 20,
          stretch: 50,
          depth: 300,
          modifier: 1,
          slideShadows: true,
        }}
        effect={"coverflow"}
        grabCursor={true}
        loop={true}
        modules={[EffectCoverflow, Navigation, Autoplay]}
        navigation={true}
        pagination={{ clickable: true }}
        slidesPerView={2}
        spaceBetween={-30}
        speed={1000}
      >
        {images.map((src, index) => (
          <SwiperSlide className="flex items-center justify-center" key={index}>
            <Image
              alt={`Slide ${index + 1}`}
              className="h-[400px] w-full rounded-xl object-cover shadow-lg"
              height={400}
              src={src}
              width={800}
            />

            <div className="absolute bottom-0 left-0 flex h-1/2 w-full items-end rounded-b-xl bg-gradient-to-t from-black to-transparent p-4">
              <p className="line-clamp-2 px-3 text-sm leading-relaxed text-white drop-shadow-md">
                Đây là mô tả cho ảnh số {index + 1}. Nội dung có thể dài khoảng
                100 chữ, giúp người dùng hiểu rõ hơn về nội dung của bức ảnh
                trong trình chiếu.
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
