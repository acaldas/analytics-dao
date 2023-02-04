import Logo from "./logo";

export default function Header() {
  return (
    <div className="bg-dark p-4 shadow-md rounded-b-lg overflow-hidden">
      <Logo title size={40} />
    </div>
  );
}
