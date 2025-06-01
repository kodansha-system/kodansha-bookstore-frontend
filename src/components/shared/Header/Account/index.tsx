"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

import { usePathname, useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import { loginAction } from "@/app/actions/auth";
import { api } from "@/services/axios";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { CircleUser } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Account = () => {
  const [open, setOpen] = useState(false);
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    const res: any = await loginAction({ username, password });

    if (res && res.statusCode === 201) {
      toast.success("Đăng nhập thành công");
      Cookies.set("access_token", res?.data?.access_token);
      const resDetailUser = await api.get(`/auth/profile`);

      setUser({ ...resDetailUser.data, id: resDetailUser.data._id });

      setOpen(false);
    } else {
      toast.error("Email/mật khẩu không khớp");
    }
  };

  const { data, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/auth/profile");

      return res.data;
    },
    retry: false,
    enabled: !pathname?.includes("/login"),
  });

  const t = useTranslations("Home");

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Đăng nhập</DialogTitle>
        </DialogHeader>

        <form className="grid gap-4 py-4" onSubmit={handleLogin}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="username">
              Email
            </Label>

            <Input className="col-span-3" id="username" name="username" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="password">
              Mật khẩu
            </Label>

            <Input
              className="col-span-3"
              id="password"
              name="password"
              type="password"
            />
          </div>

          <DialogFooter>
            <Button type="submit">Xác nhận</Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {user ? (
        <DropdownMenu>
          <div className="flex items-center gap-x-2">
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full" size="icon" variant="secondary">
                <CircleUser className="size-5" />
              </Button>
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("Account.myAcc")}</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.push("/user")}>
              {t("Account.setting")}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => logout()}>
              {t("Account.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DialogTrigger asChild>
          <Button onClick={() => router.push("/login")}>Đăng nhập</Button>
        </DialogTrigger>
      )}
    </Dialog>
  );
};

export default Account;
