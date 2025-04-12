import { useState } from "react";

import { ChooseAddressDialog } from "./ChooseAddressDialog";

export const ChooseAddress = ({ setAddress }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-[350px] rounded-md border bg-white p-4">
      <div className="mb-1 flex items-center justify-between">
        <div className="text-gray-500">Giao tới</div>

        <div className="text-base text-blue-500" onClick={() => setOpen(true)}>
          Thay đổi
        </div>

        <ChooseAddressDialog
          open={open}
          setAddress={setAddress}
          setOpen={setOpen}
        />
      </div>

      <div className="text-base font-medium text-black">
        Lương Minh Anh | 0357227195
      </div>

      <div className="mt-1 overflow-hidden whitespace-normal break-words text-sm text-gray-400">
        Ký túc xá Trường ĐH Công Nghiệp Hà Nội, Phường Minh Khai, Quận Bắc Từ
        Liêm, Hà Nội
      </div>
    </div>
  );
};
