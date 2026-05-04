import { RouterProvider } from "react-router";
import router from "./router/router";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./index.css";

import { NewsProvider } from "./context/NewsContext";

const App = () => {
  return (
    <AuthProvider>
      <NewsProvider>
        <Toaster position="top-right" />
        <div className="App">
          <RouterProvider router={router} />
        </div>
      </NewsProvider>
    </AuthProvider>
  );
};

export default App;
