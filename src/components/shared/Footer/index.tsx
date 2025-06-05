"use client";

import React from "react";

import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  const hiddenPaths = ["/vi/login", "/vi/register"];

  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  return <div className="p-3 text-center text-sm">Made by Lương Minh Anh</div>;
};

export default Footer;
