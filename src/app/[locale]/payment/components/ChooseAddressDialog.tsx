"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
  ward: z.string().min(1, "Vui lòng chọn phường/xã"),
  detail: z.string().min(1, "Vui lòng nhập địa chỉ cụ thể"),
  isDefault: z.boolean().optional(),
});

type AddressFormType = z.infer<typeof addressSchema>;

export const ChooseAddressDialog = ({ open, setOpen, setAddress }: any) => {
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
      isDefault: false,
    },
  });

  useEffect(() => {
    if (open) {
      apiShipping.get(`/cities`).then((res: any) => {
        setProvinces(res.data);
      });

      setAddresses([]);
    }
  }, [open]);

  useEffect(() => {
    const provinceCode = form.watch("province");

    if (provinceCode) {
      apiShipping.get(`/cities/${provinceCode}/districts`).then((res) => {
        setDistricts(res.data);
        setWards([]);
        form.setValue("district", "");
        form.setValue("ward", "");
      });
    }
  }, [form.watch("province")]);

  useEffect(() => {
    const districtCode = form.watch("district");

    if (districtCode) {
      apiShipping.get(`/districts/${districtCode}/wards`).then((res) => {
        setWards(res.data);
        form.setValue("ward", "");
      });
    }
  }, [form.watch("district")]);

  const onSubmit = (data: AddressFormType) => {
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

    setOpen(false);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chọn địa chỉ giao hàng</DialogTitle>
        </DialogHeader>

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

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={form.watch("isDefault")}
                onCheckedChange={(checked) =>
                  form.setValue("isDefault", !!checked)
                }
              />

              <Label>Đặt làm địa chỉ mặc định</Label>
            </div>

            <DialogFooter>
              <Button onClick={form.handleSubmit(onSubmit)}>Lưu địa chỉ</Button>
            </DialogFooter>
          </div>
        ) : (
          <div>Hiển thị danh sách địa chỉ nếu có (id cũ)</div>
        )}
      </DialogContent>
    </Dialog>
  );
};
