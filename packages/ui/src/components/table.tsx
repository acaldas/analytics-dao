import React, { forwardRef } from "react";

export const Table: React.FC<React.HTMLProps<HTMLTableElement>> = (props) => (
  <table {...props} className={`overflow-hidden ${props.className}`} />
);

export const TableHead: React.FC<React.HTMLProps<HTMLTableSectionElement>> = ({
  children,
  ...props
}) => (
  <thead {...props} className={`table table-fixed w-full ${props.className}`}>
    <tr>{children}</tr>
  </thead>
);

export const TableHeadCell: React.FC<React.HTMLProps<HTMLTableCellElement>> = (
  props
) => (
  <th
    align="left"
    {...props}
    className={`text-xl px-4 pb-2 ${props.className}`}
  />
);

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  React.HTMLProps<HTMLTableSectionElement>
>((props, ref) => (
  <tbody
    ref={ref}
    {...props}
    className={`divide-y overflow-auto block shadow rounded-lg ${props.className}`}
  />
));

export const TableRow: React.FC<
  React.HTMLProps<HTMLTableRowElement> & { i: number }
> = ({ i, ...props }) => (
  <tr
    {...props}
    className={`table table-fixed w-full border-secondary  ${
      i % 2 ? "bg-lighter" : "bg-light"
    } ${props.className}`}
  />
);

export const TableCell: React.FC<React.HTMLProps<HTMLTableCellElement>> = (
  props
) => <td align="left" {...props} className={`p-4 ${props.className}`} />;
