"use client";
import React, { useState, useEffect } from 'react';

interface SlideContent {
  id: string;
  image: string;
  title: string;
}
interface ContentSliderProps {
  slides: SlideContent[];
}

const ContentSlider: React.FC<ContentSliderProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [slides.length]);

  return (
    <div className="relative flex h-screen slider-bg overflow-hidden ">
      <div
        className="relative flex h-full w-full  transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="w-full flex-shrink-0 flex items-center justify-between p-24 shadow rounded"
          >
            {/* Left content */}
            <div className="flex h-full w-1/2 p-4">
              <div>
                <div className=" relative flex items-center justify-center top-4 w-54 h-8 button-bg2  mb-10 uppercase font-extrabold">100% organic product</div>
                <h1 className="text-[75px] font-extrabold mb-2">{slide.title}</h1>
                <div className=" relative flex items-center justify-center w-36 h-15 button-bg  mb-10 text-white text-2xl font-black">BUY NOW&gt;</div>
              </div>
            </div>

            {/* Right image */}
            <div className="flex h-full w-1/2 pr-4">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full object-fill rounded m-4"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 px-2 py-1 rounded"
      >
        ‹
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 px-2 py-1 rounded"
      >
        ›
      </button>
    </div>
  );
};

export default ContentSlider;
