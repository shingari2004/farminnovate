"use client";
import { useEffect, useRef, useState } from "react";
import localFont from "next/font/local";

const myFont = localFont({
  src: "../public/fonts/Montserrat-VariableFont_wght.ttf",
});

export default function BoxesSection() {
  const sectionRef = useRef(null);
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
      { threshold: 0.3 } // Adjust to when animation triggers
    );
    const sabcd = sectionRef.current;
    if (sabcd) {
      observer.observe(sabcd);
    }

    return () => {
      if (sabcd) {
        observer.unobserve(sabcd);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-fit py-16 sm:py-20 md:py-28 bg-no-repeat bg-cover sm:bg-contain"
      style={{ backgroundImage: "url('/icons/farmerSectionBackground.png')" }}
    >
      <div className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto">
        {/* Header Section */}
        <div
          className={`relative opacity-0 transition-all duration-800 ease-in-out mb-8 sm:mb-12 md:mb-16 ${
            active ? "opacity-100 -translate-y-4" : "translate-y-0"
          }`}
        >
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-emerald-800 ">
            <div className={myFont.className}>2000+ farmers</div>
          </h2>
          <h2 className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700">
            <span className="pb-2 sm:pb-4">People working with us</span>
          </h2>
        </div>

        {/* Desktop Layout (lg and up) */}
        <div className=" hidden lg:block relative w-full h-80 -right-110 justify-center items-center">
          {/* Box 1 */}
          <div
            className={`absolute w-68.5 h-full px-6 py-8 flex items-center justify-center bg-white hover:shadow-2xl text-gray-800 rounded-sm transition-all duration-800 ease-in-out ${
              active ? "-translate-x-105.5" : "translate-x-0"
            }`}
            style={{ top: 0 }}
          >
            <div>
              <h3 className="text-xl font-semibold mb-4">Feature 1</h3>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste
                quas fugiat error.
              </p>
            </div>
          </div>

          {/* Box 2 */}
          <div
            className={`absolute w-68.5 h-full px-6 py-8 flex items-center justify-center rounded-sm hover:shadow-2xl bg-white transition-all duration-800 ease-in-out ${
              active ? "-translate-x-35.25" : "translate-x-0"
            }`}
            style={{ top: 0 }}
          >
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Solar System
              </h3>
              <p className="text-gray-600">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste
                quas fugiat error modi quia voluptate volu
              </p>
            </div>
          </div>

          {/* Box 3 (center) */}
          <div
            className={`absolute w-68.5 h-full px-6 py-8 flex items-center justify-center bg-white rounded-sm hover:shadow-2xl transition-all duration-800 ease-in-out ${
              active ? "translate-x-35.25" : "translate-x-0"
            }`}
            style={{ top: 0 }}
          >
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Innovation
              </h3>
              <p className="text-gray-600">
                Advanced farming solutions for modern agriculture.
              </p>
            </div>
          </div>

          {/* Box 4 */}
          <div
            className={`absolute w-68.5 h-full px-6 py-8 flex items-center justify-center bg-white hover:shadow-2xl rounded-sm transition-all duration-800 ease-in-out ${
              active ? "translate-x-105.5" : "translate-x-0"
            }`}
            style={{ top: 0 }}
          >
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Support
              </h3>
              <p className="text-gray-600">
                24/7 support and guidance for all your farming needs.
              </p>
            </div>
          </div>
        </div>

        {/* Tablet Layout (md to lg) */}
        <div className="hidden md:block lg:hidden">
          <div className="grid grid-cols-2 gap-6">
            {[
              {
                title: "Feature 1",
                content:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
              },
              {
                title: "Solar System",
                content:
                  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste quas fugiat error modi quia voluptate volu",
              },
              {
                title: "Innovation",
                content: "Advanced farming solutions for modern agriculture.",
              },
              {
                title: "Support",
                content:
                  "24/7 support and guidance for all your farming needs.",
              },
            ].map((box, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out transform ${
                  active
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  {box.title}
                </h3>
                <p className="text-gray-600 text-sm">{box.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout (sm and below) */}
        <div className="block md:hidden">
          <div className="space-y-4 sm:space-y-6">
            {[
              {
                title: "Feature 1",
                content:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
              },
              {
                title: "Solar System",
                content:
                  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste quas fugiat error modi quia voluptate volu",
              },
              {
                title: "Innovation",
                content: "Advanced farming solutions for modern agriculture.",
              },
              {
                title: "Support",
                content:
                  "24/7 support and guidance for all your farming needs.",
              },
            ].map((box, index) => (
              <div
                key={index}
                className={`bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform ${
                  active
                    ? "translate-x-0 opacity-100"
                    : "translate-x-8 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800">
                  {box.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {box.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
