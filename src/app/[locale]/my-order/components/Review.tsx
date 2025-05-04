import { useState } from "react";
import { toast } from "react-toastify";

import Image from "next/image";

import { api } from "@/services/axios";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

export const ReviewProductDialog = ({
  productId,
  open,
  setOpen,
  orderId,
  handleGetDetailOrder,
}: any) => {
  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<any>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      setSubmitting(true);
      e.preventDefault();
      const formData = new FormData();

      formData.append("book_id", productId);

      if (image) {
        formData.append("image", image);
      }

      formData.append("order_id", orderId);
      formData.append("content", content);
      formData.append("rating", String(rating));

      if (productId && rating > 0 && content.trim()) {
        const res = await api.post("/reviews", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res?.data) {
          setSubmitting(false);
          setOpen(false);
          setRating(0);
          setContent("");
          setImage(null);
          handleGetDetailOrder();
          toast.success("Gửi đánh giá thành công!");
        }
      }
    } catch (error: any) {
      setSubmitting(false);
      toast.error(error?.message || "Có lỗi khi gửi đánh giá");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files) {
      setImage(files[0]);
    }
  };

  if (!productId) return null;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Đánh giá sản phẩm</DialogTitle>
        </DialogHeader>

        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                className={cn(
                  "cursor-pointer transition-all",
                  i <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300",
                )}
                key={i}
                onClick={() => setRating(i)}
              />
            ))}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Nội dung đánh giá</Label>

            <textarea
              className="mt-2 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
              id="content"
              onChange={(e) => setContent(e.target.value)}
              placeholder="Viết cảm nhận của bạn về sản phẩm..."
              value={content}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="images">Hình ảnh</Label>

            <Input
              accept="image/*"
              id="image"
              onChange={handleFileChange}
              type="file"
            />

            {image && (
              <div className="flex flex-wrap gap-2">
                <Image
                  alt="preview"
                  className="rounded border object-cover"
                  height={200}
                  src={URL.createObjectURL(image)}
                  width={200}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">Gửi đánh giá</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
