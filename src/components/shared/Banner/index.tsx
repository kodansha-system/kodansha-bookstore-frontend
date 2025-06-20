"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { api } from "@/services/axios";
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
  const [isSwiperReady, setIsSwiperReady] = useState(false);
  const [listArticle, setListArticle] = useState([]);
  const router = useRouter();

  const handleGetListArticle = async () => {
    try {
      const res = await api.get("/articles", {
        params: {
          get_all: true,
        },
      });

      setListArticle(res?.data?.articles);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "Có lỗi khi lấy danh sách bài viết");
    }
  };

  useEffect(() => {
    handleGetListArticle();
  }, []);

  useEffect(() => {
    if (listArticle?.length > 0) {
      setIsSwiperReady(true);
    }
  }, [listArticle]);

  const [slidesPerView, setSlidesPerView] = useState(2);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setSlidesPerView(1);
      } else {
        setSlidesPerView(2);
      }
    }

    handleResize(); // gọi lần đầu

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative mx-auto w-[90%] py-10">
      {isSwiperReady && (
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
          onInit={() => setIsSwiperReady(true)}
          pagination={{ clickable: true }}
          slidesPerView={slidesPerView}
          spaceBetween={-30}
          speed={1000}
          style={{ visibility: isSwiperReady ? "visible" : "hidden" }}
        >
          {listArticle &&
            listArticle?.map((article: any, index: number) => (
              <SwiperSlide
                className="flex items-center justify-center"
                key={index}
                onClick={() => router.push(`/articles/${article?.id}`)}
              >
                <Image
                  alt={`Slide ${index + 1}`}
                  className="h-[300px] w-full rounded-xl object-cover shadow-lg md:h-[400px]"
                  height={400}
                  src={article?.image}
                  width={800}
                />

                <div className="absolute bottom-0 left-0 flex h-1/2 w-full items-end rounded-b-xl bg-gradient-to-t from-black to-transparent p-4">
                  <p className="line-clamp-2 px-3 text-sm leading-relaxed text-white drop-shadow-md">
                    {article?.title}
                  </p>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      )}
    </div>
  );
};

export default BannerSlider;
