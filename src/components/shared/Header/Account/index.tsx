import React from "react";

import { useTranslations } from "next-intl";

import { CircleUser } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Account = () => {
  const t = useTranslations("Home");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full" size="icon" variant="secondary">
          <CircleUser className="size-5" />

          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("Account.myAcc")}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>{t("Account.setting")}</DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>{t("Account.logout")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Account;
