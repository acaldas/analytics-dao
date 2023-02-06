import { Disclosure } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import React from "react";

export const Accordion: React.FC<React.HTMLProps<HTMLDivElement>> = ({
  as,
  ...props
}) => <Disclosure {...props} as="div" />;

export const AccordionButton = React.forwardRef<
  HTMLButtonElement,
  React.HTMLProps<HTMLButtonElement> & { noChevron?: boolean }
>(({ as, children, noChevron, ...props }, ref) => (
  <Disclosure.Button
    ref={ref}
    {...props}
    className={`border-b border-stone-300 w-full px-2 py-4 bg-background hover:bg-lighter ui-open:bg-[rgba(255,255,255,0.7)] transition-colors ${props.className}`}
  >
    <div className="flex justify-between items-center">
      {children}
      {!noChevron && (
        <ChevronRightIcon
          width={25}
          height={25}
          className="ui-open:rotate-90 ui-open:transform"
        />
      )}
    </div>
  </Disclosure.Button>
));

export const AccordionPanel: React.FC<React.HTMLProps<HTMLDivElement>> = ({
  as,
  ...props
}) => (
  <Disclosure.Panel
    {...props}
    className={`border-b border-stone-300 ${props.className}`}
  />
);
