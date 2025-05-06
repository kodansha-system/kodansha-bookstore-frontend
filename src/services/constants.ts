export const CARRIERS = {
  VTPOST: "vtp",
  VNPOST: "vnp",
  GHN: "ghn",
  GHTK: "ghtk",
  NJV: "njv",
  HBB: "hbb",
  KERRY: "kerry",
  SPL: "spl",
  AHAMOVE: "ahm",
  DPPOST: "dppost",
  ONGVANG: "ov",
  SUPERSHIP: "supership",
  GHNV3: "ghnv3",
  SHIP60: "ship60",
};

export const MappingCarrierName = {
  [CARRIERS.VTPOST]: "Vietnam Post",
  [CARRIERS.VNPOST]: "Vietnam National Post",
  [CARRIERS.GHN]: "Giao Hàng Nhanh",
  [CARRIERS.GHTK]: "Giao Hàng Tiết Kiệm",
  [CARRIERS.NJV]: "Nhật Vận",
  [CARRIERS.HBB]: "Hòa Bình",
  [CARRIERS.KERRY]: "Kerry Express Vietnam",
  [CARRIERS.SPL]: "SuperShip",
  [CARRIERS.AHAMOVE]: "Ahamove",
  [CARRIERS.DPPOST]: "Delivery Post",
  [CARRIERS.ONGVANG]: "On-GV (On Global Vietnam)",
  [CARRIERS.SUPERSHIP]: "SuperShip (Giao hàng siêu tốc)",
  [CARRIERS.GHNV3]: "Giao Hàng Nhanh",
  [CARRIERS.SHIP60]: "Ship60",
};

export enum PAY_METHODS {
  ONLINE = "online",
  OFFLINE = "offline",
}

export const PaymentMethodText: Record<PAY_METHODS, string> = {
  [PAY_METHODS.OFFLINE]: "Thanh toán khi nhận hàng",
  [PAY_METHODS.ONLINE]: "Thanh toán online",
};

export enum PaymentStatus {
  PENDING = "pending",
  SUCCESS = "paid",
  FAILED = "failed",
}

export const PaymentStatusText: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Chờ thanh toán",
  [PaymentStatus.SUCCESS]: "Đã thanh toán",
  [PaymentStatus.FAILED]: "Chưa thanh toán / Thanh toán lỗi",
};

export const DATE_FORMAT = {
  DAY_AND_TIME: "DD/MM/YYYY HH:mm:ss",
};

export enum OrderStatus {
  New = 1,
  Verified = 900,
  WaitingPickup = 901,
  PickingUp = 902,
  PickedUp = 903,
  Delivering = 904,
  Delivered = 905,
  DeliveryFailed = 906,
  Returning = 907,
  Returned = 908,
  Reconciled = 909,
  CustomerReconciled = 910,
  CodTransferred = 911,
  WaitingCodPayment = 912,
  Completed = 913,
  Cancelled = 914,
  Delay = 915,
  PartiallyDelivered = 916,
  Error = 1000,
}

export const OrderStatusText: Record<OrderStatus, string> = {
  [OrderStatus.New]: "Đơn mới",
  [OrderStatus.Verified]: "Đã xác minh",
  [OrderStatus.WaitingPickup]: "Chờ lấy hàng",
  [OrderStatus.PickingUp]: "Lấy hàng",
  [OrderStatus.PickedUp]: "Đã lấy hàng",
  [OrderStatus.Delivering]: "Giao hàng",
  [OrderStatus.Delivered]: "Giao thành công",
  [OrderStatus.DeliveryFailed]: "Giao thất bại",
  [OrderStatus.Returning]: "Đang chuyển hoàn",
  [OrderStatus.Returned]: "Chuyển hoàn",
  [OrderStatus.Reconciled]: "Đã đối soát",
  [OrderStatus.CustomerReconciled]: "Đã đối soát khách",
  [OrderStatus.CodTransferred]: "Đã trả COD cho khách",
  [OrderStatus.WaitingCodPayment]: "Chờ thanh toán COD",
  [OrderStatus.Completed]: "Hoàn thành",
  [OrderStatus.Cancelled]: "Đơn hủy",
  [OrderStatus.Delay]: "Chậm lấy/giao",
  [OrderStatus.PartiallyDelivered]: "Giao hàng một phần",
  [OrderStatus.Error]: "Đơn lỗi",
};

export enum DeliveryMethod {
  STORE_PICKUP = "store_pickup",
  HOME_DELIVERY = "home_delivery",
}

export const estimateParcelDimensions = (books_order: any) => {
  const cartonPadding = 2;
  const cartonWeight = 100;

  let totalWeight = 0;
  let totalLength = 0;
  let maxWidth = 0;
  let maxHeight = 0;

  for (const book of books_order) {
    totalWeight += book.weight * book.quantity;
    totalLength += book.length * book.quantity;
    maxWidth = Math.max(maxWidth, book.width);
    maxHeight = Math.max(maxHeight, book.height);
  }

  return {
    width: (maxWidth + 2 * cartonPadding).toString(),
    height: (maxHeight + 2 * cartonPadding).toString(),
    length: (totalLength + 2 * cartonPadding).toString(),
    weight: (totalWeight + cartonWeight).toString(),
  };
};
