import Home from "./pages/Home";
import "./index.css";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <div className="App">
        <Home />
      </div>
    </>
  );
};

export default App;

