import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Home, Compass } from "lucide-react";
import "../styles/ErrorPage.css";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="error-page-container">
      <div className="error-content">
        <div className="error-icon">
          <Compass size={60} strokeWidth={1.5} />
        </div>
        <h1 className="error-code">404</h1>
        <h2 className="error-title">{t("notFound.title")}</h2>
        <p className="error-message">
          {t("notFound.message")}
        </p>
        <div className="error-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            {t("notFound.backHome")}
          </Link>
          <button
            className="btn btn-secondary"
            onClick={() => window.history.back()}
          >
            {t("notFound.goBack")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
