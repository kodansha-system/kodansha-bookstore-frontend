import Link from "next/link";

import { getMessages } from "next-intl/server";

import { Menu, Package2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { getHeaderItems } from "@/routes/protectedRoutes";

import { ThemeToggle } from "../ThemeToggle";
import Account from "./Account";
import { HeaderItem, HeaderItemMobile } from "./HeaderItem";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchForm from "./Search";

async function Header() {
  const message = await getMessages();
  const HEADER_ITEMS = await getHeaderItems();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-10">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
          href="#"
        >
          <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-2xl font-bold text-transparent">
            Kodansha
          </span>
        </Link>

        {HEADER_ITEMS.map((item: any) => (
          <HeaderItem href={item.href} key={item.label} label={item.label} />
        ))}
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <Button className="shrink-0 md:hidden" size="icon" variant="outline">
            <Menu className="size-5" />

            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              className="flex items-center gap-2 text-lg font-semibold"
              href="#"
            >
              <Package2 className="size-6" />

              <span className="sr-only">Acme Inc</span>
            </Link>

            {HEADER_ITEMS.map((item: any) => (
              <HeaderItemMobile
                href={item.href}
                key={item.label}
                label={item.label}
              />
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="hidden w-full items-center gap-4 md:ml-auto md:flex md:gap-2 lg:gap-4">
        <div>
          <SearchForm />
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Account />

          <ThemeToggle />

          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
export default Header;
