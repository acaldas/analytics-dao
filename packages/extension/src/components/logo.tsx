import React from "react";

const Logo: React.FC<{ size: number; title?: boolean }> = ({ size, title }) => {
  return (
    <div className="flex items-center">
      <img
        src="/logo.svg"
        alt="logo"
        width={size}
        height={size}
        className="drop-shadow-lg"
      />
      {title && <h1 className={`ml-4 text-[32px] font-[comfortaa]`}>LytDAO</h1>}
    </div>
  );
};

export default Logo;
