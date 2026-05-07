import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import {
  LogOut,
  Home,
  Rss,
  User,
  PlusSquare,
  Settings,
  Bookmark,
  Languages,
} from "lucide-react";
import "../../styles/Header.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  const toggleLanguage = () => {
    i18n.changeLanguage(isArabic ? "en" : "ar");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header glass ${isScrolled ? "scrolled" : ""}`}>
      <div className="container header-container">
        <Link to="/" className="logo">
          TECH<span>NEWS</span>
        </Link>

        <nav className="nav">
          <NavLink to="/" className="nav-link">
            <Home size={18} />
            <span>{t("header.home")}</span>
          </NavLink>
          <NavLink to="/feed" className="nav-link">
            <Rss size={18} />
            <span>{t("header.feed")}</span>
          </NavLink>

          {user && (
            <>
              <NavLink to="/my-news" className="nav-link">
                <Bookmark size={18} />
                <span>{t("header.bookmarks")}</span>
              </NavLink>
              <NavLink to="/add-news" className="nav-link">
                <PlusSquare size={18} />
                <span>{t("header.addNews")}</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="header-actions">
          {/* Language Toggle */}
          <button
            className="lang-toggle-btn"
            onClick={toggleLanguage}
            title={isArabic ? "Switch to English" : "التبديل إلى العربية"}
          >
            <Languages size={16} />
            <span>{isArabic ? "EN" : "AR"}</span>
          </button>

          {user ? (
            <div className="user-profile">
              <span className="user-name">
                {t("header.hi")}, {user.fullName?.split(" ")[0]}
              </span>
              <button
                className="logout-btn"
                onClick={() => dispatch(logout())}
                title={t("header.logout")}
              >
                <LogOut size={18} />
                <span>{t("header.logout")}</span>
              </button>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="nav-link">
                {t("header.login")}
              </Link>
              <Link to="/register" className="btn btn-primary">
                {t("header.signUp")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
