"use client";

import React, { useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import { Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Home");

  const changeLanguage = (locale: string) => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length > 0 && ["en", "vi"].includes(segments[0])) {
      segments[0] = locale;
    } else {
      segments.unshift(locale);
    }

    router.push("/" + segments.join("/"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full" size="icon" variant="secondary">
          <Globe className="size-5" />

          <span className="sr-only">{t("Language.changeLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("Language.changeLanguage")}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => changeLanguage("en")}>
          {t("Language.english")}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => changeLanguage("vi")}>
          {t("Language.vietnamese")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
