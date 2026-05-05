import { useTranslation } from "react-i18next";
import "../../styles/Footer.css";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="/" className="footer-logo">
              TECHNEWS
            </a>
            <p className="footer-desc">
              {t("footer.desc")}
            </p>
          </div>

          <div>
            <h4 className="footer-title">{t("footer.sectionsTitle")}</h4>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">{t("footer.latestNews")}</a>
              </li>
              <li>
                <a href="#" className="footer-link">{t("footer.reviews")}</a>
              </li>
              <li>
                <a href="#" className="footer-link">{t("footer.aiMl")}</a>
              </li>
              <li>
                <a href="#" className="footer-link">{t("footer.gadgets")}</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">{t("footer.companyTitle")}</h4>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">{t("footer.about")}</a>
              </li>
              <li>
                <a href="#" className="footer-link">{t("footer.contact")}</a>
              </li>
              <li>
                <a href="#" className="footer-link">{t("footer.privacy")}</a>
              </li>
              <li>
                <a href="#" className="footer-link">{t("footer.terms")}</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">{t("footer.followTitle")}</h4>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">Twitter</a>
              </li>
              <li>
                <a href="#" className="footer-link">LinkedIn</a>
              </li>
              <li>
                <a href="#" className="footer-link">Instagram</a>
              </li>
              <li>
                <a href="#" className="footer-link">GitHub</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
