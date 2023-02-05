import { Switch } from "@headlessui/react";

const Toggle: React.FC<
  Omit<React.HTMLProps<HTMLButtonElement>, "onChange"> & {
    checked?: boolean | undefined;
    defaultChecked?: boolean | undefined;
    onChange?(checked: boolean): void;
    name?: string | undefined;
    value?: string | undefined;
    srMsg?: string | undefined;
  }
> = ({ checked, onChange, as, type, srMsg, ...props }) => (
  <Switch
    {...props}
    checked={checked}
    onChange={onChange}
    className={`${
      checked ? "bg-primary" : "bg-gray-200"
    } relative inline-flex h-6 w-11 items-center rounded-full ${
      props.className
    }`}
  >
    <span className="sr-only">{srMsg}</span>
    <span
      className={`${
        checked ? "translate-x-6" : "translate-x-1"
      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
    />
  </Switch>
);

export default Toggle;
