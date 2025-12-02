"use client";

import { useEffect, useState } from "react";

import { api } from "@/services/axios";

import Chatbot from "@/components/Chatbot";
import BannerSlider from "@/components/shared/Banner";

import BookSection from "./dashboard/components/BookSection";
import FlashSaleSection from "./dashboard/components/FlashSale";

function DashboardPage() {
  const [listCategoriesShowOnDashboard, setListCategoriesShowOnDashboard] =
    useState<any>([]);

  const handleGetListCategories = async () => {
    const res3 = await api.get("/categories/show-on-dashboard");

    setListCategoriesShowOnDashboard(res3?.data);
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
