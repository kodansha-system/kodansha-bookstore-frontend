import React, { useState } from "react";

import { MapPin } from "lucide-react";

import { FindShopsHaveBookDialog } from "./FindShopsHaveBookDialog";

export const FindShopsHaveBook = ({ book_id }: any) => {
  const [open, setOpen] = useState(false);

  const handleFindShopsHaveBook = async () => {
    setOpen(true);
  };

  return (
    <>
      <div
        className="mt-5 flex cursor-pointer items-end font-medium text-gray-800"
        onClick={handleFindShopsHaveBook}
      >
        <MapPin className="text-red-600" size={20} />
        Tìm cửa hàng đang có sách
      </div>

      <FindShopsHaveBookDialog
        book_id={book_id}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};
