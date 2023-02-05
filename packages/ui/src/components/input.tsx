const Input: React.FC<React.HTMLProps<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`appearance-none outline-none border-none shadow rounded py-2 px-3 text-gray-500 focus:text-gray-900 leading-tight ring-0 ${
      props.disabled ? "opacity-50 cursor-not-allowed" : "opacity-1"
    } ${props.className}`}
  />
);

export default Input;
