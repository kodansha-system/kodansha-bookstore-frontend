"use client";

import React from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  keyword: z.string(),
});

const SearchForm = () => {
  const t = useTranslations("Home");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      keyword: "",
    },
  });
  const router = useRouter();

  const onSubmit = (values: any) => {
    router.push(`/search?keyword=${values.keyword}`);
  };

  return (
    <Form {...form}>
      <form
        className="ml-auto flex-1 sm:flex-initial"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="relative">
          <Search
            className="absolute left-2.5 top-2.5 size-4 text-muted-foreground"
            onClick={form.handleSubmit(onSubmit)}
          />

          <FormField
            control={form.control}
            name="keyword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="w-[300px] pl-8 lg:w-[400px]"
                    placeholder={`${t("findProduct")}...`}
                    type="search"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default SearchForm;
