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
      className="relative w-full h-screen py-28"
      style={{ backgroundImage: "url('/icons/pattern.png')" }}
    >
      <div className="relative mx-50">
        <div
          className={`relative top-12 opacity-0 transition-all duration-800 ease-in-out ${
            active ? " opacity-100 -translate-y-15" : "translate-y-0"
          }`}
        >
          <h2 className="flex justify-center text-5xl font-extrabold text-emerald-800 ">
            <div className={myFont.className}>News Section</div>
          </h2>
          <h2 className="flex justify-center text-3xl">
            <span className="pb-4 mb-10">
              Agricultural news from all over the world
            </span>
          </h2>
        </div>
        <NewsSlider />
      </div>
    </div>
  );
}
