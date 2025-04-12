import { getMessages } from "next-intl/server";

export async function getHeaderItems() {
  const messages = await getMessages();

  return [
    { label: messages["dashboard"], href: "/dashboard" },
    { label: messages["orders"], href: "/cart" },
  ];
}
