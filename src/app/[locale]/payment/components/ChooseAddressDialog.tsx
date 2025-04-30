"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { api } from "@/services/axios";
import { apiShipping } from "@/services/shippingApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export const ChooseAddressDialog = ({
  open,
  setOpen,
  setAddress,
  isAddAddress,
  isUpdateAddress,
  setIsAddAddress,
  setIsUpdateAddress,
  handleGetListAddress,
  handleAddAddress,
  handleAddDataAddress,
  defaultAddress,
  idProfile,
}: any) => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const form = useForm<AddressFormType>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      province: "",
      district: "",
      ward: "",
      detail: "",
      phone_number: "",
      customer_name: "",
      is_default: false,
    },
  });

  const provinceCode = form.watch("province");
  const districtCode = form.watch("district");

  useEffect(() => {
    if (open) {
      (async () => {
        const resProvinces = await apiShipping.get(`/cities`);

        setProvinces(resProvinces.data);
        setAddresses([]);

        if (defaultAddress) {
          form.reset({
            province: defaultAddress.province || "",
            district: "",
            ward: "",
            detail: defaultAddress.street || "",
            phone_number: defaultAddress.phone_number || "",
            customer_name: defaultAddress.customer_name || "",
            is_default: defaultAddress.is_default || false,
          });

          if (defaultAddress.province) {
            const resDistricts = await apiShipping.get(
              `/cities/${defaultAddress.province}/districts`,
            );

            setDistricts(resDistricts.data);

            form.setValue("district", defaultAddress.district || "");

            if (defaultAddress.district) {
              const resWards = await apiShipping.get(
                `/districts/${defaultAddress.district}/wards`,
              );

              setWards(resWards.data);

              form.setValue("ward", defaultAddress.ward || "");
            }
          }
        } else {
          form.reset();
        }
      })();
    }
  }, [open]);

  useEffect(() => {
    if (provinceCode) {
      apiShipping.get(`/cities/${provinceCode}/districts`).then((res) => {
        setDistricts(res.data);
        setWards([]);

        if (!defaultAddress) {
          form.setValue("district", "");
          form.setValue("ward", "");
        }
      });
    }
  }, [provinceCode]);

  useEffect(() => {
    if (districtCode) {
      apiShipping.get(`/districts/${districtCode}/wards`).then((res) => {
        setWards(res.data);

        if (!defaultAddress) {
          form.setValue("ward", "");
        }
      });
    }
  }, [districtCode]);

  useEffect(() => {
    if (defaultAddress) {
      form.reset({
        province: defaultAddress.province || "",
        district: defaultAddress.district || "",
        ward: defaultAddress.ward || "",
        detail: defaultAddress.street || "",
        phone_number: defaultAddress.phone_number || "",
        customer_name: defaultAddress.customer_name || "",
        is_default: defaultAddress.is_default || false,
      });
    } else {
      form.reset();
    }
  }, [defaultAddress, form, open]);

  const onSubmit = async (data: AddressFormType) => {
    const province = provinces.find(
      (p) => p.id.toString() === data.province,
    )?.name;
    const district = districts.find(
      (d) => d.id.toString() === data.district,
    )?.name;
    const ward = wards.find((w) => w.id.toString() === data.ward)?.name;

    const fullAddress = `${data.detail}, ${ward}, ${district}, ${province}`;

    setAddress({
      ...data,
      fullAddress,
    });

    if (isAddAddress) {
      const res: any = await api.post(`/users/${idProfile}/addresses`, {
        ...data,
        street: data?.detail,
        full_address: fullAddress,
      });

      setIsAddAddress(false);

      handleGetListAddress();
      setOpen(false);

      return;
    }

    if (isUpdateAddress) {
      const res: any = await api.put(
        `/users/${idProfile}/addresses/${defaultAddress.id}`,
        {
          ...data,
          street: data?.detail,
          full_address: fullAddress,
        },
      );

      setIsUpdateAddress(false);

      handleGetListAddress();
      setOpen(false);

      return;
    }

    setOpen(false);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chọn địa chỉ giao hàng</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          {addresses.length === 0 ? (
            <div className="space-y-4">
              <div>
                <Label>Tỉnh / Thành phố</Label>

                <Select
                  onValueChange={(val) => form.setValue("province", val)}
                  value={form.watch("province")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tỉnh / thành phố" />
                  </SelectTrigger>

                  <SelectContent>
                    {provinces.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Quận / Huyện</Label>

                <Select
                  onValueChange={(val) => form.setValue("district", val)}
                  value={form.watch("district")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quận / huyện" />
                  </SelectTrigger>

                  <SelectContent>
                    {districts.map((d) => (
                      <SelectItem key={d.id} value={d.id.toString()}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Phường / Xã</Label>

                <Select
                  onValueChange={(val) => form.setValue("ward", val)}
                  value={form.watch("ward")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phường / xã" />
                  </SelectTrigger>

                  <SelectContent>
                    {wards.map((w) => (
                      <SelectItem key={w.id} value={w.id.toString()}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Địa chỉ cụ thể</Label>

                <Input
                  {...form.register("detail")}
                  placeholder="Nhập địa chỉ cụ thể"
                />
              </div>

              <div>
                <Label>Tên người nhận</Label>

                <Input
                  {...form.register("customer_name")}
                  placeholder="Nhập tên người nhận"
                />
              </div>

              <div>
                <Label>Số điện thoại người nhận</Label>

                <Input
                  {...form.register("phone_number")}
                  placeholder="Nhập số điện thoại người nhận"
                />

                <FormMessage />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={form.watch("is_default")}
                  disabled={defaultAddress?.is_default}
                  onCheckedChange={(checked) =>
                    form.setValue("is_default", !!checked)
                  }
                />

                <Label>Đặt làm địa chỉ mặc định</Label>
              </div>

              <DialogFooter>
                <Button
                  onClick={form.handleSubmit(onSubmit, (errors) => {
                    console.log("Form có lỗi:", errors);
                  })}
                >
                  Lưu địa chỉ
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div>Hiển thị danh sách địa chỉ nếu có (id cũ)</div>
          )}
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
