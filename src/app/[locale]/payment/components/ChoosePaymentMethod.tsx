import { useEffect, useState } from "react";

import Image from "next/image";

import { api } from "@/services/axios";

export const ChoosePaymentMethod = ({ form }: any) => {
  const [payMethods, setPayMethods] = useState([]);

  const handleGetListPayMethods = async () => {
    const res = await api.get("/paymethods");

    setPayMethods(res.data.payMethods);
  };

  useEffect(() => {
    handleGetListPayMethods();
  }, []);

  return (
    <>
      <div className="mb-4 mt-6 text-base font-semibold text-gray-800">
        Chọn hình thức thanh toán
      </div>

      <div className="grid w-full grid-cols-1 gap-4 pl-2 md:grid-cols-2 xl:grid-cols-3">
        {payMethods.map((option: any) => (
          <label
            className={`relative flex cursor-pointer items-center gap-x-2 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md`}
            key={option.id}
          >
            <input
              type="radio"
              value={option.code}
              {...form.register("paymentMethod")}
              className="mt-1 size-4"
            />

            {option.image && (
              <Image
                alt={`image ${option.id}`}
                className="size-10 rounded-md object-contain"
                height={40}
                src={option.image}
                width={40}
              />
            )}

            <div className="flex items-center gap-2">
              <div className="text-[15px] text-gray-800">{option.name}</div>
            </div>
          </label>
        ))}
      </div>
    </>
  );
};
