"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import { api } from "@/services/axios";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { checkIsLogin } from "@/lib/utils";

interface AddQuestionProps {
  productId: string;
}

const AddQuestion = ({ productId }: AddQuestionProps) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.warning("Vui lòng nhập nội dung câu hỏi.");

      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("book_id", productId);
      formData.append("content", content);

      const res = await api.post("/questions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res?.data) {
        toast.success("Gửi câu hỏi thành công!");
        setContent("");
        setOpen(false);
        queryClient.refetchQueries({ queryKey: ["questions"] });
      }
    } catch (err: any) {
      toast.error(err?.message || "Có lỗi xảy ra khi gửi câu hỏi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button mở form */}
      <Button
        className="bg-blue-500 hover:bg-blue-500"
        onClick={() => {
          if (!checkIsLogin()) {
            return;
          }

          setOpen(true);
        }}
      >
        Gửi câu hỏi
      </Button>

      {/* Form câu hỏi */}
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Gửi câu hỏi về sản phẩm</DialogTitle>
          </DialogHeader>

          <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="content">Nội dung câu hỏi</Label>

              <textarea
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                id="content"
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung câu hỏi của bạn..."
                rows={4}
                value={content}
              />
            </div>

            <DialogFooter>
              <Button disabled={loading} type="submit">
                {loading ? "Đang gửi..." : "Gửi câu hỏi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddQuestion;
