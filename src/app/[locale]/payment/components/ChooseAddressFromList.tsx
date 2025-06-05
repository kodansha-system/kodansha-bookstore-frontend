"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { api } from "@/services/axios";
import { useAuthStore } from "@/store/authStore";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const addressSchema = z.object({
  province: z.string().min(1, "Vui lòng chọn tỉnh/thành"),
  district: z.string().min(1, "Vui lòng chọn quận/huyện"),
  ward: z.any(),
  detail: z.string().min(1, "Vui lòng nhập địa chỉ cụ thể"),
  phone_number: z
    .string()
    .min(1, "Vui lòng nhập số điện thoại người nhận")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số")
    .min(10, "Số điện thoại phải có ít nhất 10 chữ số")
    .max(11, "Số điện thoại không quá 11 chữ số"),
  customer_name: z.string().min(1, "Vui lòng nhập tên người nhận"),
  is_default: z.boolean().optional(),
});

type AddressFormType = z.infer<typeof addressSchema>;

export const ChooseAddressFromList = ({
  address,
  setAddress,
  open,
  setOpen,
}: any) => {
  const { user: profile } = useAuthStore();
  const [listAddress, setListAddress] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>();
  const router = useRouter();

  const handleGetListAddress = async () => {
    if (profile) {
      const res: any = await api.get(`/users/${profile?.id}/addresses`);

      setListAddress(res?.data?.addresses);

      setSelectedAddress(address);
    }
  };

  const handleSelectAddress = (item: any) => {
    setSelectedAddress(item);

    setAddress(item);
  };

  useEffect(() => {
    if (profile) {
      handleGetListAddress();
    }
  }, [profile, open]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chọn địa chỉ giao hàng</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[400px] flex-col items-center overflow-auto">
          {listAddress?.map((item, index) => {
            return (
              <div
                className={`mb-5 flex max-w-[400px] flex-col gap-y-2 rounded-md p-4 shadow-md ${item?.id === selectedAddress?.id ? "bg-blue-100" : ""}`}
                key={index}
                onClick={() => handleSelectAddress(item)}
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
                </div>
              </div>
            );
          })}

          <Button
            className="mt-5"
            onClick={() => {
              router.push("/user");
            }}
          >
            Thêm địa chỉ khác
          </Button>
        </div>

        {listAddress?.length === 0 && (
          <div>
            <div>Bạn chưa thêm địa chỉ nhận hàng</div>

            <Button
              className="mt-5"
              onClick={() => {
                router.push("/user");
              }}
            >
              Thêm địa chỉ khác
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
