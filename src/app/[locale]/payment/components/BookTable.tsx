import Image from "next/image";

import { Star } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BookTable = ({ books }: { books: any[] }) => {
  return (
    <div className="mt-5 flex w-full justify-center">
      <Table className="flex-col">
        <TableHeader>
          <TableRow>
            <TableHead>Ảnh</TableHead>

            <TableHead>Tên sách</TableHead>

            <TableHead>Giá</TableHead>

            <TableHead>Số lượng</TableHead>

            <TableHead>Thành tiền</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {books?.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Image
                  alt=""
                  className="h-[100px] w-[80px] rounded-md border object-cover p-1"
                  height={100}
                  src={item?.image || item?.book_id?.images?.[0]}
                  width={80}
                />
              </TableCell>

              <TableCell className="max-w-[200px] break-words">
                <div className="line-clamp-2 text-gray-900">
                  {item.name || item?.book_id?.name}
                </div>
              </TableCell>

              <TableCell className="font-medium text-red-500">
                {item.price.toLocaleString()}đ
              </TableCell>

              <TableCell className="text-[15px] text-gray-900">
                {item.quantity}
              </TableCell>

              <TableCell className="font-medium text-red-500">
                {(item.quantity * item.price).toLocaleString()}đ
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookTable;
