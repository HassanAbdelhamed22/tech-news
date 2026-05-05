import { useEffect } from "react";
import { RouterProvider } from "react-router";
import router from "./router/router";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { NewsProvider } from "./context/NewsContext";
import { useTranslation } from "react-i18next";

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

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
