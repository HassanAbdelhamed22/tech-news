import { useRouteError, Link } from "react-router";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import "../styles/ErrorPage.css";

const ErrorPage = () => {
  const error = useRouteError();
  const { t } = useTranslation();
  console.error(error);

  return (
    <div className="error-page-container">
      <div className="error-content">
        <div className="error-icon" style={{ background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)" }}>
          <AlertTriangle size={60} strokeWidth={1.5} />
        </div>
        <h1 className="error-title">{t("errorPage.title")}</h1>
        <p className="error-message">
          {t("errorPage.message")}
          {error?.statusText || error?.message ? (
            <span style={{ display: 'block', marginTop: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>
              {t("errorPage.errorDetails")} {error.statusText || error.message}
            </span>
          ) : null}
        </p>
        <div className="error-actions">
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={18} />
            {t("errorPage.tryAgain")}
          </button>
          <Link to="/" className="btn btn-secondary">
            <Home size={18} />
            {t("errorPage.goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
