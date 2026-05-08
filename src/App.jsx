import { useEffect } from "react";
import { RouterProvider } from "react-router";
import router from "./router/router";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews } from "./store/slices/newsThunks";

const App = () => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.theme.mode);

  // Fetch all news, bookmarks, and reactions once on app load
  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  // Apply theme to <html data-theme="dark|light">
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <>
      <Toaster position="top-right" />
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </>
  );
};

export default App;
