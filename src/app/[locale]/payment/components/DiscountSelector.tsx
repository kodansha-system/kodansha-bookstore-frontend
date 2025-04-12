"use client";

import { useEffect, useState } from "react";

import { api } from "@/services/axios";

const DiscountSelector = ({
  form,
  total,
  sortedFreeshipVouchers,
  setSortedFreeshipVouchers,
  sortedProductVouchers,
  setSortedProductVouchers,
  setSelectedFreeshipVoucher,
  setSelectedProductVoucher,
}: any) => {
  const { watch, setValue } = form;

  const selectedFreeship = watch("freeshipVoucher");
  const selectedProductVoucher = watch("productVoucher");

  const [showMoreFreeship, setShowMoreFreeship] = useState(false);
  const [showMoreVoucher, setShowMoreVoucher] = useState(false);

  function moveSelectedToTop<T extends { id: string }>(
    items: T[],
    selectedId: string | undefined,
  ): T[] {
    const updated = [...items];

    if (selectedId) {
      const index = updated.findIndex((v) => v.id === selectedId);

      if (index > -1) {
        const [selected] = updated.splice(index, 1);

        updated.unshift(selected);
      }
    }

    return updated;
  }

  const handleShowMoreFreeship = () => {
    setShowMoreFreeship(!showMoreFreeship);
    const updated = moveSelectedToTop(sortedFreeshipVouchers, selectedFreeship);

    setSortedFreeshipVouchers(updated);
  };

  const handleShowMoreVoucher = () => {
    setShowMoreVoucher(!showMoreVoucher);
    const updated = moveSelectedToTop(
      sortedProductVouchers,
      selectedProductVoucher,
    );

    setSortedProductVouchers(updated);
  };

  const handleGetListVoucher = async () => {
    const res = await api.post("/vouchers/get-list-voucher-for-order", {
      price: total.price - total.discount,
    });

    const freeshipVouchers = res?.data?.filter(
      (item: any) => item.type === "free_ship",
    );
    const productVouchers = res?.data?.filter(
      (item: any) => item.type === "discount",
    );

    setSortedFreeshipVouchers(freeshipVouchers);
    setSortedProductVouchers(productVouchers);

    if (freeshipVouchers?.[0]) {
      setValue("freeshipVoucher", freeshipVouchers[0].id);
      setSelectedFreeshipVoucher(freeshipVouchers[0]);
    }

    if (productVouchers?.[0]) {
      setValue("productVoucher", productVouchers[0].id);
      setSelectedProductVoucher(productVouchers[0]);
    }
  };

  useEffect(() => {
    handleGetListVoucher();
  }, [total.price]);

  // Khi user chọn lại freeship voucher
  useEffect(() => {
    const selected = sortedFreeshipVouchers.find(
      (v: any) => v.id === selectedFreeship,
    );

    if (selected) {
      setSelectedFreeshipVoucher(selected);
    }
  }, [selectedFreeship, sortedFreeshipVouchers]);

  useEffect(() => {
    const selected = sortedProductVouchers.find(
      (v: any) => v.id === selectedProductVoucher,
    );

    if (selected) {
      setSelectedProductVoucher(selected);
    }
  }, [selectedProductVoucher, sortedProductVouchers]);

  return (
    <div className="my-3 rounded-md border bg-white p-4 text-sm text-gray-500">
      <div>Mã giảm giá</div>

      {sortedFreeshipVouchers &&
        sortedProductVouchers &&
        sortedFreeshipVouchers?.length > 0 && (
          <div className="my-3 rounded-md bg-white text-sm text-gray-700">
            <div className="mb-4">
              <div className="mb-2 text-sm font-medium text-blue-600">
                Freeship
              </div>

              <div className="space-y-3">
                {(showMoreFreeship
                  ? sortedFreeshipVouchers
                  : sortedFreeshipVouchers.slice(0, 1)
                ).map((voucher: any) => (
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-all hover:shadow-sm ${
                      selectedFreeship === voucher.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                    key={voucher.id}
                  >
                    <input
                      type="radio"
                      value={voucher.id}
                      {...form.register("freeshipVoucher")}
                      className="mt-1 bg-white accent-[green]"
                    />

                    <div>
                      <p className="font-medium">{voucher?.description}</p>

                      <p className="text-sm text-gray-500">
                        Đơn tối thiểu:&nbsp;
                        {voucher?.min_order_total_price?.toLocaleString()}đ
                      </p>

                      <p className="text-sm text-gray-400">
                        Thời gian:&nbsp;
                        {new Date(voucher?.start_time)?.toLocaleDateString(
                          "vi-VN",
                        )}
                        &nbsp;đến&nbsp;
                        {new Date(voucher?.end_time)?.toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {sortedFreeshipVouchers.length > 1 && (
                <button
                  className="mt-2 text-sm font-medium text-blue-600 hover:underline"
                  onClick={handleShowMoreFreeship}
                  type="button"
                >
                  {showMoreFreeship ? "Ẩn bớt" : "Xem thêm"}
                </button>
              )}
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-pink-600">
                Mã giảm giá sản phẩm
              </div>

              <div className="space-y-3">
                {(showMoreVoucher
                  ? sortedProductVouchers
                  : sortedProductVouchers.slice(0, 1)
                ).map((voucher: any) => (
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-all hover:shadow-sm ${
                      selectedProductVoucher === voucher.id
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200"
                    }`}
                    key={voucher.id}
                  >
                    <input
                      type="radio"
                      value={voucher.id}
                      {...form.register("productVoucher")}
                      className="mt-1 bg-white accent-pink-500"
                    />

                    <div>
                      <p className="font-medium">{voucher?.description}</p>

                      <p className="text-sm text-gray-500">
                        Đơn tối thiểu:&nbsp;
                        {voucher?.min_order_total_price?.toLocaleString()}đ
                      </p>

                      <p className="text-sm text-gray-400">
                        Thời gian:&nbsp;
                        {new Date(voucher?.start_time)?.toLocaleDateString(
                          "vi-VN",
                        )}
                        &nbsp;đến&nbsp;
                        {new Date(voucher?.end_time)?.toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {sortedProductVouchers.length > 1 && (
                <button
                  className="mt-2 text-sm font-medium text-blue-600 hover:underline"
                  onClick={handleShowMoreVoucher}
                  type="button"
                >
                  {showMoreVoucher ? "Ẩn bớt" : "Xem thêm"}
                </button>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default DiscountSelector;
