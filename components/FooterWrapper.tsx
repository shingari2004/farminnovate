"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  // Paths where header should be hidden
  const noFooterPaths = ["/sign-in", "/sign-up"];

  const hideFooter = noFooterPaths.some(path => pathname.startsWith(path));

  if (hideFooter) return null;

  return <Footer />;
}
