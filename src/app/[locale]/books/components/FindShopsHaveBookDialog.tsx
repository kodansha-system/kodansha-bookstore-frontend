"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { api } from "@/services/axios";
import { apiShipping } from "@/services/shippingApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export const FindShopsHaveBookDialog = ({
  open,
  setOpen,
  book_id,
  setAddress,
}: any) => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [shopsHaveBook, setShopsHaveBook] = useState([]);
  const router = useRouter();

  const form = useForm<AddressFormType>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      province: "",
      district: "",
    },
  });

  const handleGetListCity = async () => {
    if (open) {
      apiShipping.get(`/cities`).then((res: any) => {
        setProvinces(res.data);
      });

      setAddresses([]);
    }
  };

  const handleGetListDistrict = async () => {
    const provinceCode = form.watch("province");

    if (provinceCode) {
      apiShipping.get(`/cities/${provinceCode}/districts`).then((res) => {
        setDistricts(res.data);
        form.setValue("district", "");
        form.setValue("ward", "");
      });
    }
  };

  const handleGetShopsHaveBook = async () => {
    const res = await api.get("/shop-books/book", {
      params: {
        book_ids: [book_id],
        province_id: form.getValues("province"),
        district_id: form.getValues("district"),
      },
    });

    setShopsHaveBook(res?.data);
  };

  useEffect(() => {
    handleGetListCity();
    handleGetShopsHaveBook();
  }, [open]);

  useEffect(() => {
    handleGetListDistrict();
    handleGetShopsHaveBook();
  }, [form.watch("province")]);

  useEffect(() => {
    handleGetShopsHaveBook();
  }, [form.watch("district")]);

  const onSubmit = (data: AddressFormType) => {
    const province = provinces.find(
      (p) => p.id.toString() === data.province,
    )?.name;
    const district = districts.find(
      (d) => d.id.toString() === data.district,
    )?.name;

    const fullAddress = `${data.detail},  ${district}, ${province}`;

    setAddress({
      ...data,
      fullAddress,
    });

    setOpen(false);
  };

  const handleCloseDialog = (status: boolean) => {
    setOpen(status);
    setDistricts([]);
    form.reset();
  };

  return (
    <Dialog onOpenChange={handleCloseDialog} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tìm cửa hàng có sách</DialogTitle>
        </DialogHeader>

        <div className="text-blue-500">Tôi thấy hoa vàng trên cỏ xanh</div>

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

            <div className="flex max-h-[300px] flex-col gap-3 overflow-y-auto pr-2">
              {shopsHaveBook &&
                shopsHaveBook?.map((data: any) => (
                  <div
                    className="cursor-pointer rounded-xl border border-gray-200 p-2 px-4"
                    key={data._id}
                    onClick={() => router.push("/shops/" + data.shop_id)}
                  >
                    <div className="font-medium text-black">
                      {data?.shop?.name}
                    </div>

                    <div className="mt-1 text-sm text-gray-900">
                      {data?.shop?.address}
                    </div>

                    <div className="mt-1 text-sm text-gray-500">
                      Giờ hoạt động: {data?.shop?.working_time}
                    </div>

                    <div className="mt-1 text-sm text-gray-500">
                      Số điện thoại: {data?.shop?.phone}
                    </div>

                    <div className="mt-1 cursor-pointer text-sm italic text-blue-500">
                      Chỉ đường
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div>Hiển thị danh sách địa chỉ nếu có (id cũ)</div>
        )}
      </DialogContent>
    </Dialog>
  );
};
