"use client";

import React from "react";

import { useTranslations } from "next-intl";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

const SearchForm = () => {
  const t = useTranslations("Home");

  return (
    <form className="ml-auto flex-1 sm:flex-initial">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />

        <Input
          className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[400px]"
          placeholder={`${t("findProduct")}...`}
          type="search"
        />
      </div>
    </form>
  );
};

export default SearchForm;
