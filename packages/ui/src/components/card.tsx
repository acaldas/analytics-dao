import React from "react";

const Card: React.FC<React.HTMLProps<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className={`shadow-md p-4 bg-dark rounded mb-8 ${props.className}`}
  />
);

export default Card;
