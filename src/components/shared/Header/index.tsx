import Link from "next/link";

import { getHeaderItems } from "@/routes/protectedRoutes";

import { ThemeToggle } from "../ThemeToggle";
import Account from "./Account";
import { HeaderItem } from "./HeaderItem";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchForm from "./Search";
import Sidebar from "./Sidebar";

async function Header() {
  const HEADER_ITEMS = await getHeaderItems();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-10">
      <Sidebar headerItems={HEADER_ITEMS} />

      <Link
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
        href="/dashboard"
      >
        <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-2xl font-bold text-transparent">
          Kodansha
        </span>
      </Link>

      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        {HEADER_ITEMS.map((item: any) => (
          <HeaderItem href={item.href} key={item.label} label={item.label} />
        ))}
      </nav>

      <div className="hidden w-full items-center justify-end gap-4 md:ml-auto md:flex md:gap-2 lg:gap-4">
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
