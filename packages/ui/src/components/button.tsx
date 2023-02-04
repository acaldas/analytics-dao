const Button: React.FC<React.HTMLProps<HTMLButtonElement>> = (props) => (
  <button
    {...props}
    type="button"
    className={`inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-stone-800 hover:bg-stone-600 transition ease-in-out duration-150 ${props.className}`}
  />
);

export default Button;
