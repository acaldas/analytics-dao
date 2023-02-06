import { comfortaa } from "app/fonts";
import Image from "next/image";
import React from "react";

const Logo: React.FC<{ size: number; title?: boolean }> = ({ size, title }) => {
  return (
    <div className="flex items-center">
      <Image
        src="/logo.svg"
        alt="logo"
        width={size}
        height={size}
        className="drop-shadow-lg"
        priority
      />
      {title && (
        <h1
          className={`ml-4 text-[42px] drop-shadow-lg ${comfortaa.className}`}
        >
          LytDAO
        </h1>
      )}
    </div>
  );
};

export default Logo;
