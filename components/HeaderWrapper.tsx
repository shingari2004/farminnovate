"use client";

import { usePathname } from "next/navigation";
import StickyHeader from "./StickyHeader";

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Paths where header should be hidden
  const noHeaderPaths = ["/sign-in", "/sign-up"];

  const hideHeader = noHeaderPaths.some(path => pathname.startsWith(path));

  if (hideHeader) return null;

  return <StickyHeader />;
}
