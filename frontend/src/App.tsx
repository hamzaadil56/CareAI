import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex flex-col h-screen items-center justify-center">
        <h1 className="text-2xl font-bold underline">Care AI</h1>
      </div>
    </>
  );
}

export default App;
