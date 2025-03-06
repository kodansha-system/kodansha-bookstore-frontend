"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  title: z.string().min(5, "Tên khóa học phải ít nhất 5 ký tự"),
  image: z.string().optional(),
});

function CourseAddNew({ user }: { user: any }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const imageWatcher = form.watch("image");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = {
        title: values?.title,
        author: user?._id,
      };

      console.log(data);

      toast.success("Tạo khóa học thành công");

      return;
    } catch (error) {
      console.log(error, "error");
    }
  }

  return (
    <>
      <div className="mx-[100px] mb-5 text-[18px] font-medium">
        Thông tin cá nhân
      </div>

      <div className="mx-[100px] flex gap-x-3">
        <div className="w-1/2 bg-white p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-8 flex flex-col gap-8 gap-y-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>

                      <FormControl>
                        <Input placeholder="Họ và tên" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>

                      <FormControl>
                        <Input placeholder="Số điện thoại" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>

                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày sinh</FormLabel>

                      <FormControl>
                        <Input placeholder="Ngày sinh" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ảnh đại diện</FormLabel>

                      <FormControl>
                        <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-gray-200 bg-white"></div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button className="bg-blue-500 hover:bg-blue-400" type="submit">
                Cập nhật
              </Button>
            </form>
          </Form>
        </div>

        <div className="w-1/2 bg-white p-5">
          <div className="mb-3 text-center">
            <Button className="bg-blue-500 hover:bg-blue-400" type="submit">
              Thêm địa chỉ
            </Button>
          </div>

          <div className="mb-5 flex flex-col gap-y-2 rounded-md p-4 shadow-md">
            <div className="flex justify-between">
              <div>
                LƯƠNG MINH ANH&nbsp;
                <span className="text-xs text-green-300">Địa chỉ mặc định</span>
              </div>

              <div className="cursor-pointer text-sm text-blue-500">
                Chỉnh sửa
              </div>
            </div>

            <div className="text-sm text-gray-400">
              Địa chỉ: &nbsp;
              <span className="text-black">
                Ký túc xá Trường ĐH Công Nghiệp Hà Nội, Phường Minh Khai, Quận
                Bắc Từ Liêm, Hà Nội
              </span>
            </div>

            <div className="text-sm text-gray-400">
              Điện thoại:&nbsp;
              <span className="text-black">0123456789</span>
            </div>
          </div>

          <div className="flex flex-col gap-y-2 rounded-md p-4 shadow-md">
            <div>LƯƠNG MINH ANH </div>

            <div className="text-sm text-gray-400">
              Địa chỉ: &nbsp;
              <span className="text-black">
                Ký túc xá Trường ĐH Công Nghiệp Hà Nội, Phường Minh Khai, Quận
                Bắc Từ Liêm, Hà Nội
              </span>
            </div>

            <div className="text-sm text-gray-400">
              Điện thoại:&nbsp;
              <span className="text-black">0123456789</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseAddNew;
