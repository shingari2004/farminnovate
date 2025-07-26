"use client";
import { useEffect, useRef, useState } from "react";
import localFont from "next/font/local";
import NewsSlider from "./NewsSlider";

const myFont = localFont({
  src: "../public/fonts/Montserrat-VariableFont_wght.ttf",
});

export default function NewsSection() {
  const section1Ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
        } else {
          setActive(false);
        }
      },
      { threshold: 0.1 } // Adjust to when animation triggers
    );
    const abcd = section1Ref.current;
    if (abcd) {
      observer.observe(abcd);
    }

    return () => {
      if (abcd) {
        observer.unobserve(abcd);
      }
    };
  }, []);

  return (
    <div
      ref={section1Ref}
      className="relative w-full min-h-screen py-16 sm:py-20 md:py-24 lg:py-28 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/icons/pattern.png')" }}
    >
      {/* Container with responsive padding and max-width */}
      <div className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto">
        {/* Header Section */}
        <div
          className={`relative opacity-0 transition-all duration-800 ease-in-out mb-12  ${
            active ? "opacity-100 -translate-y-4 sm:-translate-y-6 md:-translate-y-8 lg:-translate-y-15" : "translate-y-0"
          }`}
        >
          {/* Main Title */}
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-emerald-800">
            <div className={myFont.className}>News Section</div>
          </h2>
          
          {/* Subtitle */}
          <h2 className="text-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-700 px-4 sm:px-6 md:px-8">
            <span className="block">
              Agricultural news from all over the world
            </span>
          </h2>
        </div>

        {/* News Slider Container */}
        <div className="relative w-full">
          <div className="overflow-hidden">
            <NewsSlider />
          </div>
        </div>
      </div>

      {/* Mobile-specific background overlay for better readability */}
      <div className="absolute inset-0 bg-white/5 sm:bg-transparent pointer-events-none" />
    </div>
  );
}