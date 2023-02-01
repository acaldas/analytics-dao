import React from "react";

const Main: React.FC<
  { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
> = (props) => (
  <main
    {...props}
    className={`max-w-screen-xl flex-1 rounded bg-background shadow-xl px-12 py-6 overflow-auto ${props.className}`}
  />
);

export default Main;
