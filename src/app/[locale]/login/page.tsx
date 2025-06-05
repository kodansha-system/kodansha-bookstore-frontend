"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useRouter, useSearchParams } from "next/navigation";

import { api } from "@/services/axios";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  username: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu!"),
});

type FormValues = z.infer<typeof schema>;

const LoginPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const { user, setUser, logout } = useAuthStore();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await api.post("/auth/login", values);

      Cookies.set("access_token", res?.data?.access_token);

      const resDetailUser = await api.get(`/auth/profile`);

      setUser({ ...resDetailUser.data, id: resDetailUser.data._id });

      toast.success("Đăng nhập thành công!");

      router.push("/dashboard");
    } catch (error) {
      toast.error("Đăng nhập thất bại!");
    }
  };

  useEffect(() => {
    if (reason === "unauthorized") {
      toast.warning("Vui lòng đăng nhập để tiếp tục");
      const url = new URL(window.location.href);

      url.searchParams.delete("reason");
      window.history.replaceState({}, "", url.toString());
    }
  }, [reason]);

  return (
    <div className="relative size-full h-screen">
      <div className="relative z-10 h-screen">
        <div className="flex h-full items-center bg-gray-50 dark:bg-gray-900">
          <div className="m-auto flex flex-col items-center justify-center px-6 py-8 md:h-[calc(100vh-200px)] lg:py-0">
            <a
              className="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
              href="#"
            >
              <img
                alt="logo"
                className="mr-2 size-8 rounded-full"
                src="/kodansha.png"
              />
              Kodansha
            </a>

            <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
              <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                  Đăng nhập
                </h1>

                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Email
                    </label>

                    <Input
                      {...register("username")}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                      placeholder="name@company.com"
                      type="email"
                    />

                    {errors.username && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Mật khẩu
                    </label>

                    <Input
                      type="password"
                      {...register("password")}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                      placeholder="••••••••"
                    />

                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <Button className="bg-blue-400 text-white hover:bg-blue-500 hover:text-white">
                      Đăng nhập
                    </Button>
                  </div>

                  <div className="flex gap-x-2 text-sm font-light text-gray-500 dark:text-gray-400">
                    Quên mật khẩu?
                    <div className="cursor-pointer text-blue-400 underline">
                      Nhận mật khẩu mới qua email
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
