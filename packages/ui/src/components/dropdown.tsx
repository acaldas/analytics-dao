import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

const Dropdown: React.FC<{
  value: string;
  options: string[];
  defaultValue?: string | undefined;
  onChange?(value: string): void;
  disabled?: boolean | undefined;
  horizontal?: boolean | undefined;
  name?: string | undefined;
  multiple?: boolean | undefined;
  className?: string;
}> = ({ options, className, ...props }) => (
  <Listbox {...props}>
    <div className="relative">
      <Listbox.Button
        className={`relative w-full cursor-default rounded bg-white py-2 pl-3 pr-10 text-left shadow focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm ${
          props.disabled ? "opacity-50 cursor-not-allowed" : "opacity-1"
        } ${className}`}
      >
        <span className="block truncate">{props.value || "-"}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </Listbox.Button>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {options.map((option) => (
            <Listbox.Option
              key={option}
              className={({ active }) =>
                `relative cursor-default select-none py-1 px-2 ${
                  active ? "bg-dark" : "text-gray-900"
                }`
              }
              value={option}
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? "font-medium" : "font-normal"
                    }`}
                  >
                    {option}
                  </span>
                  {selected ? (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-1 text-amber-600">
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </div>
  </Listbox>
);

export default Dropdown;
