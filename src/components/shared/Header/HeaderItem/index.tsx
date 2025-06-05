"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { checkIsLogin } from "@/lib/utils";

export function HeaderItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);
  const handleClick = (e: React.MouseEvent) => {
    if (href !== "/cart") {
      return;
    }

    if (!checkIsLogin() && href === "/cart") {
      e.preventDefault();
    }
  };

  return (
    <Link
      className="min-w-[70px] text-center text-muted-foreground transition-colors hover:text-foreground data-[active=true]:text-foreground"
      data-active={isActive}
      href={href}
      onClick={handleClick}
    >
      {label}
    </Link>
  );
}

export function HeaderItemMobile({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      className="text-sm hover:text-foreground data-[active=false]:text-muted-foreground"
      data-active={isActive}
      href={href}
    >
      {label}
    </Link>
  );
}
