import React from "react";

import Image from "next/image";

import { api } from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

import AddQuestion from "./AddQuestion";

const fetchQuestions = async (productId: string) => {
  const res = await api.get("/questions", {
    params: {
      book_id: productId,
      is_verified: true,
    },
  });

  return res.data.questions;
};

const Questions = ({ productId }: { productId: string }) => {
  const {
    data: listQuestion = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["questions", productId],
    queryFn: () => fetchQuestions(productId),
    enabled: !!productId, // chỉ fetch khi productId tồn tại
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-base font-medium">Phần hỏi đáp</div>

        <AddQuestion productId={productId} />
      </div>

      <div className="mt-3 flex flex-col gap-3 text-sm">
        {isLoading ? (
          <div>Đang tải câu hỏi...</div>
        ) : isError ? (
          <div className="text-red-500">Không thể tải dữ liệu.</div>
        ) : (
          listQuestion.map((item: any) => (
            <div
              className="rounded-md border border-gray-200 p-3"
              key={item.id}
            >
              <div>
                <div className="flex items-center gap-x-2">
                  <Image
                    alt=""
                    className="object-fit size-[30px] rounded-full"
                    height={30}
                    src={item?.created_by?.image}
                    width={30}
                  />

                  {item?.created_by?.name}
                </div>

                <div className="mt-3">{item.content}</div>

                <div className="mt-3 text-xs italic text-gray-400">
                  Đã gửi vào:&nbsp;
                  {new Date(item.created_at).toLocaleDateString("vi-VN")}
                </div>

                {item.reply && (
                  <div className="mt-4 rounded-md bg-gray-100 p-3">
                    <div className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <span className="text-blue-600">
                        Phản hồi từ Kodansha - {item?.reply?.staff_id?.name}
                      </span>
                    </div>

                    <div className="text-sm text-gray-800">
                      {item?.reply?.content}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Questions;
