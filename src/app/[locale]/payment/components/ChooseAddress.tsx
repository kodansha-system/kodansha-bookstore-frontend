import { useEffect, useState } from "react";

import { api } from "@/services/axios";
import { useAuthStore } from "@/store/authStore";

import { ChooseAddressFromList } from "./ChooseAddressFromList";

export const ChooseAddress = ({ setAddress, address }: any) => {
  const [open, setOpen] = useState(false);
  const { user: profile } = useAuthStore();

  const handleGetDefaultAddress = async () => {
    const res = await api.get(`/users/${profile?.id}/addresses`, {
      params: { is_default: true },
    });

    if (res?.data) {
      setAddress(res?.data);
    }
  };

  useEffect(() => {
    if (profile) {
      handleGetDefaultAddress();
    }
  }, [profile]);

  return (
    <div className="w-[350px] rounded-md border bg-white p-4">
      <div className="mb-1 flex items-center justify-between">
        <div className="text-gray-500">Giao tới</div>

        <div className="text-base text-blue-500" onClick={() => setOpen(true)}>
          Thay đổi
        </div>

        <ChooseAddressFromList
          open={open}
          setAddress={setAddress}
          setOpen={setOpen}
        />
      </div>

      <div className="text-base font-medium text-black">
        {address?.customer_name} | {address?.phone_number}
      </div>

      <div className="mt-1 overflow-hidden whitespace-normal break-words text-sm text-gray-400">
        {address?.full_address || address?.fullAddress}
      </div>
    </div>
  );
};
