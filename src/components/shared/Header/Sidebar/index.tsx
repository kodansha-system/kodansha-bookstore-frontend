"use client";

import React from "react";

import Link from "next/link";

import { useAuthStore } from "@/store/authStore";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { HeaderItemMobile } from "../HeaderItem";

const Sidebar = ({ headerItems }: any) => {
  const { user } = useAuthStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="shrink-0 lg:hidden" size="icon" variant="outline">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent className="max-h-screen overflow-y-auto" side="left">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            className="flex items-center gap-2 text-lg font-semibold"
            href="/dashboard"
          >
            Kodansha
          </Link>

          {headerItems.map((item: any) => (
            <HeaderItemMobile
              href={item.href}
              key={item.label}
              label={item.label}
            />
          ))}

          <div className="flex flex-col gap-y-5 text-sm text-gray-700">
            <div>Chọn ngôn ngữ</div>

            <div className="ml-3 flex flex-col gap-y-4 text-gray-500">
              <div>Tiếng Việt</div>

              <div>Tiếng Nhật</div>
            </div>

            <div>Tài khoản</div>

            <div className="ml-3 flex flex-col gap-y-4 text-gray-500">
              <div>Đăng nhập</div>

              <div>Cài đặt</div>

              <div>Đăng xuất</div>
            </div>

            <div>Hiển thị</div>

            <div className="ml-3 flex flex-col gap-y-4 text-gray-500">
              <div>Sáng</div>

              <div>Tối</div>

              <div>Mặc định</div>
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
