import { useEffect, useState } from "react";

import Image from "next/image";

export const ChoosePaymentMethod = ({ form }: any) => {
  const payMethods = [
    {
      value: "offline",
      label: "Thanh toán khi nhận hàng",
      image: "giaohang.png",
    },
    {
      value: "online",
      label: "Thanh toán online",
      image:
        "http://res.cloudinary.com/dqlmmngec/image/upload/v1743950859/yz38tyq2in9vpfvpdp4f.png",
    },
  ];

  // Trạng thái để theo dõi phương thức thanh toán được chọn
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("offline");

  useEffect(() => {
    // Cập nhật form khi phương thức thanh toán thay đổi
    form.setValue("paymentMethod", selectedPaymentMethod);
  }, [selectedPaymentMethod, form]);

  return (
    <>
      <div className="mb-4 mt-6 text-base font-semibold text-gray-800">
        Chọn hình thức thanh toán
      </div>

      <div className="grid w-full grid-cols-1 gap-4 pl-2 md:grid-cols-2 xl:grid-cols-3">
        {payMethods.map((option: any) => (
          <label
            className={`relative flex cursor-pointer items-center gap-x-2 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md`}
            key={option.value}
          >
            <input
              type="radio"
              value={option.value}
              {...form.register("paymentMethod")}
              checked={selectedPaymentMethod === option.value} // Đảm bảo ô radio được chọn nếu khớp với giá trị
              className="mt-1 size-4"
              onChange={() => setSelectedPaymentMethod(option.value)} // Cập nhật khi người dùng chọn
            />

            {option.image && (
              <Image
                alt={`image ${option.value}`}
                className="size-10 rounded-md object-contain"
                height={40}
                src={option.image}
                width={40}
              />
            )}

            <div className="flex items-center gap-2">
              <div className="text-[15px] text-gray-800">{option.label}</div>
            </div>
          </label>
        ))}
      </div>
    </>
  );
};
