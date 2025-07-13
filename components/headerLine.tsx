"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import {
  Home,
  Cloud,
  Eye,
  Users,
  ShoppingCart,
  Heart,
  ShoppingBag,
} from "lucide-react";
import Language from "../components/Language";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
const HeaderLine = () => {
  const underlineRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const { user } = useUser();
  const clerkId = user?.id;
  const convexUser = useQuery(
    api.users.getUserById,
    clerkId ? { clerkId } : "skip"
  );
  const userId = convexUser?._id;
  const cart = useQuery(
    api.cartProperties.getCart,
    userId ? { userId } : "skip"
  );
  const wishlist = useQuery(
    api.wishlistProperties.getWishlist,
    userId ? { userId } : "skip"
  );
  const totalCartItems =
    cart?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const totalWishlistItems = wishlist?.length ?? 0;

  useEffect(() => {
    const navLinks = navRef.current?.querySelectorAll("ul li");
    const underline = underlineRef.current;

    if (!navLinks || !underline) return;

    const updateUnderlinePosition = (link: Element) => {
      const linkRect = link.getBoundingClientRect();
      const navRect = navRef.current!.getBoundingClientRect();

      underline.style.width = `${linkRect.width}px`;
      underline.style.left = `${linkRect.left - navRect.left + 5}px`;
    };

    updateUnderlinePosition(navLinks[0]);

    navLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => updateUnderlinePosition(link));
    });

    return () => {
      navLinks.forEach((link) => {
        link.removeEventListener("mouseenter", () =>
          updateUnderlinePosition(link)
        );
      });
    };
  }, []);

  return (
    <nav className="relative flex items-center  header-color">
      <ul ref={navRef} className="flex items-center justify-center space-x-8">
        <li>
          <a
            href="/home"
            className="flex items-center space-x-2 focus:text-yellow-400 hover:text-yellow-400 transition-colors"
          >
            <Home size={18} />
            <span className="font-medium">HOME</span>
          </a>
        </li>

        <li>
          <a
            href="/weatherPage"
            className="flex items-center space-x-2  focus:text-yellow-400 hover:text-yellow-400 transition-colors"
          >
            <Cloud size={18} />
            <span className="font-medium">WEATHER</span>
          </a>
        </li>

        <li>
          <a
            href="/diseasePrediction"
            className="flex items-center space-x-2   focus:text-yellow-400 hover:text-yellow-400 transition-colors"
          >
            <Eye size={18} />
            <span className="font-medium">DISEASE DETECTION</span>
          </a>
        </li>

        <li>
          <a
            href="/community"
            className="flex items-center space-x-2  focus:text-yellow-400 hover:text-yellow-400 transition-colors"
          >
            <Users size={18} />
            <span className="font-medium">COMMUNITY</span>
          </a>
        </li>

        <li>
          <Link
            href="/marketPlace"
            className="flex items-center space-x-2  focus:text-yellow-400 hover:text-yellow-400 transition-colors"
          >
            <ShoppingCart size={18} />
            <span className="font-medium">MARKETPLACE</span>
          </Link>
        </li>
        <div className="flex items-center">
          <Language />
        </div>
        <li>
          <Link href="/wishlist" className="relative top-2.5">
            <Heart />
            <div className="relative -top-7.5 -right-4 w-5 h-5 button-bg text-white flex items-center justify-center rounded-xl">
              {totalWishlistItems}
            </div>
          </Link>
        </li>
        <li>
          <Link href="/cart" className="relative top-2.5 " >
            <ShoppingBag />
            <div className="relative -top-7.5 -right-4 w-5 h-5 button-bg text-white flex items-center justify-center rounded-xl">
              {totalCartItems}
            </div>
          </Link>
        </li>
      </ul>

      <div
        ref={underlineRef}
        className="absolute top-14 h-1 bg-amber-400 transition-all duration-300"
      />
    </nav>
  );
};

export default HeaderLine;
