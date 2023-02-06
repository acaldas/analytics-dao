import React from "react";

const Main: React.FC<
  { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
> = (props) => (
  <main
    {...props}
    className={`max-w-screen-2xl h-full flex-1 rounded px-12 py-6 ${props.className}`}
  />
);

export default Main;
