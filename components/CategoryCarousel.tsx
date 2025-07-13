"use client";

import { useQuery} from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react"; // adjust path if needed
import {
  Carrot,
  Milk,
  Coffee,
  CupSoda,
  Drumstick,
  Bone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import FullScreenLoader from "./FullScreenLoader";


// Mapping string to Lucide icon components
const iconMap: Record<string, React.ElementType> = {
  Vegetables: Carrot,
  "Milk & Dairy": Milk,
  "Coffee & Tea": Coffee,
  Fruits: CupSoda,
  Cereal: Drumstick,
  Meat: Bone,
};

const VISIBLE_COUNT = 5;
const CARD_WIDTH = 240 + 50; // 240px card + 24px gap

export default function CategoryCarousel() {
  const categories = useQuery(api.addCategory.getCategories);
  const [index, setIndex] = useState(0);

  if (!categories || categories.length === 0) return <FullScreenLoader/>;

  const total = categories.length;

  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < Math.min(VISIBLE_COUNT, total); i++) {
      const item = categories[(index + i) % total];
      items.push(item);
    }
    return items;
  };

  const scroll = (dir: "left" | "right") => {
    setIndex((prev) =>
      dir === "right"
        ? (prev + 1) % total
        : (prev - 1 + total) % total
    );
  };

  return (
    <div className="relative w-full overflow-hidden max-w-[1080px] mx-auto">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border  bg-white green-text hover:bg-green-50"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <div className="overflow-hidden px-20">
        <div
          className="flex gap-6 p-24 transition-transform duration-500 ease-in-out"
          style={{
            width: `${VISIBLE_COUNT * CARD_WIDTH}px`,
            transform: `translateX(-150px)`, // stays at 0, because we shift data, not DOM
          }}
        >
          {getVisibleItems().map(({ _id, name , productCount }, i) => {
            const Icon = iconMap[name] ?? Carrot;
            return (
              <div
                key={`${_id}-${i}`}
                className="w-60 h-60 shrink-0 flex flex-col items-center justify-center gap-4  border border-gray-200 bg-white p-8 transition-shadow hover:shadow-lg"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-green-text">
                  <Icon className="h-12 w-12 green-text" />
                </div>
                <h3 className=" text-lg font-semibold">{name}</h3>
                <p className="font-bold">{productCount} Items</p>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-green-text bg-white green-text hover:bg-green-50"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
