import { getMessages } from "next-intl/server";

export function getHeaderItems() {
  return [
    { label: "Trang chủ", href: "/dashboard" },
    { label: "Giỏ hàng", href: "/cart" },
    { label: "Bài viết", href: "/articles" },
  ];
}
