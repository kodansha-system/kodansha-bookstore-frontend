import { useState } from "react";
import { toast } from "react-toastify";

import { api } from "@/services/axios";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CancelOrderDialog = ({
  orderId,
  refetch,
}: {
  orderId: string;
  refetch: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    try {
      setLoading(true);
      await api.post("/orders/cancel-order", { orderId });
      toast.success("Đã hủy đơn hàng");
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error("Hủy đơn hàng thất bại");
    } finally {
      setLoading(false);
      refetch();
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="destructive">Hủy đơn hàng</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn có chắc muốn hủy đơn?</DialogTitle>
        </DialogHeader>

        <div className="py-2 text-sm text-gray-600">
          Đơn hàng sẽ bị hủy và không thể khôi phục. Bạn có chắc không?
        </div>

        <DialogFooter>
          <Button
            disabled={loading}
            onClick={() => setOpen(false)}
            variant="outline"
          >
            Đóng
          </Button>

          <Button
            disabled={loading}
            onClick={handleCancel}
            variant="destructive"
          >
            {loading ? "Đang hủy..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelOrderDialog;
