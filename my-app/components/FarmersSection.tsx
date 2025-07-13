"use client";
import { useEffect, useRef, useState } from "react";
import localFont from 'next/font/local'
 
const myFont = localFont({
  src: '../public/fonts/Montserrat-VariableFont_wght.ttf',
})

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
    const sabcd = sectionRef.current
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
      className="relative w-full h-fit py-28 bg-no-repeat bg-right" style={{ backgroundImage: "url('/icons/farmerSectionBackground.png')" }}
    >
      <div className="relative mx-50">
        <div
          className={`relative top-12 opacity-0 transition-all duration-800 ease-in-out ${
            active ? "opacity-100 -translate-y-15" : "translate-y-0"
          }`}
        >
          <h2 className="flex justify-center text-5xl font-extrabold text-emerald-800 ">
            <div className={myFont.className}>2000+ farmers</div>
          </h2>
          <h2 className="flex justify-center text-3xl">
            <span className="pb-4 mb-10">People working with us</span>
          </h2>
        </div>
        <div className="relative w-full h-80 flex justify-center items-center">
          {/* Box 1 */}
          <div
            className={`absolute w-68.5 h-full px-6 py-8 flex items-center justify-center bg-white hover:shadow-2xl text-white rounded-sm transition-all duration-800 ease-in-out ${
              active ? "-translate-x-105.5" : "translate-x-0"
            }`}
            style={{ top: 0 }}
          >
            {/* Content */}
          </div>

          {/* Box 2 */}
          <div
            className={`absolute w-68.5 h-full px-6 py-8 flex items-center justify-center rounded-sm hover:shadow-2xl bg-white transition-all duration-800 ease-in-out ${
              active ? "-translate-x-35.25" : "translate-x-0"
            }`}
            style={{ top: 0 }}
          >
            <div>
              <h2>solar system</h2>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste
                quas fugiat error modi quia voluptate volu
              </p>
            </div>
          </div>

          {/* Box 3 (center) */}
          <div
            className={`absolute w-68.5 h-full px-6 py-8 flex items-center justify-center bg-white rounded-sm hover:shadow-2xl text-white transition-all duration-800 ease-in-out hover:shadow- ${
              active ? "translate-x-35.25" : "translate-x-0"
            }`}
            style={{ top: 0 }}
          >
            <div>garv</div>
          </div>

          {/* Box 4 */}
          <div
            className={`absolute w-68.5 h-full px-6 py-8 flex items-center justify-center bg-white hover:shadow-2xl text-white rounded-sm transition-all duration-800 ease-in-out ${
              active ? "translate-x-105.5" : "translate-x-0"
            }`}
            style={{ top: 0 }}
          >
            {/* Empty content */}
          </div>
        </div>
      </div>
    </div>
  );
}
