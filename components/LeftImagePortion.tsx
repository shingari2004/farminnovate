import React from "react";
import Image from "next/image";

const LeftImagePortion: React.FC = () => {
  return (
    <div className="relative flex h-screen ">
      {/* Background Image */}
      <div className="relative">
        <div className="absolute top-3 left-3 flex items-center space-x-3 z-50">
          <div>
            <Image
              src="/icons/logo1.png"
              alt="background"
              width={40}
              height={40}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">FARMTECH</h1>
            <p className="text-sm text-gray-300">Innovators</p>
          </div>
        </div>
        <Image
          src="/icons/pexels-quang-nguyen-vinh-222549-2131663.jpg"
          alt="background"
          width={850}
          height={1000}
          className="relative h-full w-270"
        />
      </div>

      {/* Overlay SVG */}
      <svg
        className="relative scale-x-[-1] z-10 -translate-x-88"
        viewBox="0 0 783 1536"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M236.705 1356.18C200.542 1483.72 64.5004 1528.54 1 1535V1H770.538C793.858 63.1213 797.23 196.197 624.165 231.531C407.833 275.698 274.374 331.715 450.884 568.709C627.393 805.704 510.079 815.399 347.561 939.282C185.043 1063.17 281.908 1196.74 236.705 1356.18Z" />
      </svg>
      {/* <svg
        className="relative z-10 -translate-x-88"
        viewBox="0 0 345 877"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="dashed-wave"
          d="M0.5 876C25.6667 836.167 73.2 739.8 62 673C48 589.5 35.5 499.5 125.5 462C215.5 424.5 150 365 87 333.5C24 302 44 237.5 125.5 213.5C207 189.5 307 138.5 246 8<7C185 35.5 297 1 344.5 1"
        />
      </svg> */}
    </div>
  );
};

export default LeftImagePortion;
