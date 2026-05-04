import { RouterProvider } from "react-router";
import router from "./router/router";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./index.css";

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
};

export default App;
