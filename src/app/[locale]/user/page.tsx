"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Image from "next/image";

import { api } from "@/services/axios";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon } from "lucide-react";
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

import { ChooseAddressDialog } from "../payment/components/ChooseAddressDialog";

const formSchema = z.object({
  name: z.string().min(5, "Tên khóa học phải ít nhất 5 ký tự"),
  image: z.any().optional(),
  phone_number: z.string().optional(),
  date_of_birth: z.any().optional(),
});

function CourseAddNew({ user }: { user: any }) {
  const { user: profile } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState<any>();
  const [listAddress, setListAddress] = useState<any[]>([]);
  const [isAddAddress, setIsAddAddress] = useState<boolean>(false);
  const [isUpdateAddress, setIsUpdateAddress] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.name || "",
      image: null,
      phone_number: "",
      date_of_birth: null,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = new FormData();

      data.append("name", values.name);
      data.append("phone_number", values.phone_number || "");

      if (values.image && typeof values.image !== "string") {
        data.append("image", values.image);
      }

      await api.patch(`/users/${profile?.id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { data: updatedUser } = await api.get(`/auth/profile`);

      useAuthStore
        .getState()
        .setUser({ ...updatedUser?._doc, id: updatedUser?._doc?._id });

      toast.success("Cập nhật thông tin thành công");

      return;
    } catch (error) {
      console.log(error, "error");
    }
  }

  const handleAddAddress = async () => {
    setIsAddAddress(true);
    setAddress({});
    setOpen(true);
  };

  const handleGetListAddress = async () => {
    if (profile) {
      const res: any = await api.get(`/users/${profile?.id}/addresses`);

      setListAddress(res?.data?.addresses);
    }
  };

  const handleUpdateAddress = async (id: string) => {
    setIsUpdateAddress(true);

    setIsAddAddress(false);

    const choseAddress = listAddress?.find((item) => item?.id === id);

    setAddress(choseAddress);

    setOpen(true);
  };

  const handleAddDataAddress = async () => {
    setIsUpdateAddress(true);

    const res: any = await api.post(`/users/${profile?.id}/addresses`, {
      data: address,
    });

    await handleGetListAddress();
  };

  const handleDeleteAddress = async (id: string) => {
    const res: any = await api.delete(`/users/${profile?.id}/addresses/${id}`);

    await handleGetListAddress();
  };

  useEffect(() => {
    if (profile) {
      form.setValue("name", profile.name || "");
      form.setValue("phone_number", profile.phone_number || "");
      form.setValue("image", profile.image || null);
    }
  }, [profile, form]);

  useEffect(() => {
    handleGetListAddress();
  }, [profile]);

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
                  name="name"
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
                  name="phone_number"
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
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ảnh đại diện</FormLabel>

                      <FormControl>
                        <div className="flex flex-col items-center justify-center gap-4">
                          <input
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];

                              if (file) {
                                field.onChange(file);
                              }
                            }}
                            type="file"
                          />

                          {field.value && (
                            <Image
                              alt="Preview"
                              className="h-[200px] w-auto rounded-md object-cover"
                              height={200}
                              src={
                                typeof field.value === "string"
                                  ? field.value
                                  : URL.createObjectURL(field.value)
                              }
                              width={200}
                            />
                          )}
                        </div>
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
            <Button
              className="bg-blue-500 hover:bg-blue-400"
              onClick={() => handleAddAddress()}
            >
              Thêm địa chỉ
            </Button>
          </div>

          <ChooseAddressDialog
            defaultAddress={address}
            handleAddAddress={handleAddAddress}
            handleAddDataAddress={handleAddDataAddress}
            handleGetListAddress={handleGetListAddress}
            idProfile={profile?.id}
            isAddAddress={isAddAddress}
            isUpdateAddress={isUpdateAddress}
            open={open}
            setAddress={setAddress}
            setIsAddAddress={setIsAddAddress}
            setIsUpdateAddress={setIsUpdateAddress}
            setOpen={setOpen}
          />

          {listAddress?.map((item, index) => {
            return (
              <div
                className="mb-5 flex flex-col gap-y-2 rounded-md p-4 shadow-md"
                key={index}
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-x-1">
                    <div className="max-w-[200px] break-words">
                      {item?.customer_name}&nbsp;
                    </div>

                    <div>
                      {item?.is_default && (
                        <span className="text-xs text-green-300">
                          Địa chỉ mặc định
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className="cursor-pointer text-sm text-blue-500"
                    onClick={() => handleUpdateAddress(item?.id)}
                  >
                    Chỉnh sửa
                  </div>
                </div>

                <div className="text-sm text-gray-400">
                  Địa chỉ: &nbsp;
                  <span className="break-words text-black">
                    {item?.full_address}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-400">
                  <div>
                    Điện thoại:&nbsp;
                    <span className="text-black">{item?.phone_number}</span>
                  </div>

                  <div>
                    <Trash2Icon
                      className="cursor-pointer text-red-500"
                      onClick={() => handleDeleteAddress(item.id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default CourseAddNew;
