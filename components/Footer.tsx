import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="relative w-full h-auto">
      <div>
        <Image
          src="/icons/footer-shape.png"
          alt="footer"
          width={1920}
          height={100}
        />
      </div>
    </div>
  );
};

export default Footer;
