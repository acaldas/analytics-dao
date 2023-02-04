import { Button } from "@analytics/ui";
import Header from "./components/header";
import Record from "./components/record";
import Menu from "./components/menu";

function App() {
  return (
    <div className="w-full">
      <Header />
      <div className="flex justify-center mt-4 mb-4">
        <Record />
      </div>
      <div className="flex flex-col justify-center items-center">
        <Button className="px-0 py-0">
          <a
            className="px-4 py-2"
            href="http://localhost:3000/"
            target="_blank"
          >
            Upload analytics
          </a>
        </Button>
      </div>
      <Menu />
    </div>
  );
}

export default App;
