import { useTranslation } from "react-i18next";
import AddNewsForm from "../components/Form/AddNewsForm";

export default function AddNews() {
  const { t } = useTranslation();

  return (
    <div className="add-news-page container section">
      <div className="section-header-flex">
        <div>
          <h2 className="section-title">{t("addNews.pageTitle")}</h2>
          <p className="section-subtitle">{t("addNews.pageSubtitle")}</p>
        </div>
      </div>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <AddNewsForm />
      </div>
    </div>
  );
}
