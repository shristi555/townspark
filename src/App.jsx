import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

import "./App.css";
import HomePage from "./pages/homepage";
import AddPage from "./pages/addpage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <HomePage></HomePage> */}
      <AddPage></AddPage>
    </>
  );
}

export default App;
