import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BookTable = ({
  books,
  onReviewProduct,
  isOrderCompleted = false,
  reviewedBookIds,
}: {
  books: any[];
  onReviewProduct?: any;
  isOrderCompleted?: boolean;
  reviewedBookIds?: any;
}) => {
  const router = useRouter();

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

            {isOrderCompleted && <TableHead>Đánh giá</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {books?.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Image
                  alt=""
                  className="h-[100px] min-w-[80px] rounded-md border object-cover p-1"
                  height={100}
                  src={item?.image || item?.book_id?.images?.[0]}
                  width={80}
                />
              </TableCell>

              <TableCell className="min-w-[200px] max-w-[400px] break-words">
                <div
                  className="line-clamp-2 text-gray-900"
                  onClick={() =>
                    router.push(`/books/${item?.book_id?.id || item?.id}`)
                  }
                >
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

              {reviewedBookIds && isOrderCompleted && (
                <TableCell className="font-medium text-red-500">
                  {!reviewedBookIds.includes(item?.book_id?.id) ? (
                    <Button onClick={() => onReviewProduct(item?.book_id?.id)}>
                      Đánh giá
                    </Button>
                  ) : (
                    <span className="text-sm text-gray-500">Đã đánh giá</span>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookTable;
