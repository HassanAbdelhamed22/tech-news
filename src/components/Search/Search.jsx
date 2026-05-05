import { useTranslation } from "react-i18next";
import "../../styles/Search.css";

const Search = ({ searchQuery, setSearchQuery }) => {
  const { t } = useTranslation();

  return (
    <div className="search-container">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder={t("search.placeholder")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default Search;
