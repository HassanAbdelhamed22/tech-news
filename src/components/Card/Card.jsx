import "../../styles/Card.css";
import brainImage from "../../assets/brain_scans.png";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";
import { Bookmark } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import getLocalizedField from "../../utils/getLocalizedField";

const Card = ({
  id,
  title,
  subtitle,
  description,
  imageUrl,
  author,
  date,
  category,
  likes,
  dislikes,
  userAction,
  onLike,
  onDislike,
  onBookmark,
  isBookmarked,
  ...rest  // captures title_ar, subtitle_ar, description_ar, etc.
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // Pass the full article object (including _ar fields from rest) to getLocalizedField
  const item = { title, subtitle, ...rest };
  const localizedTitle = getLocalizedField(item, "title", lang);
  const localizedSubtitle = getLocalizedField(item, "subtitle", lang);

  return (
    <div className="card">
      <div className="card-content">
        <div className="card-meta">
          <span className="card-category">{category}</span>
          <span className="card-dot">•</span>
          <span className="card-date">{date}</span>
        </div>
        <Link to={`/news/${id}`} className="card-title-link">
          <h2 className="card-title">{localizedTitle}</h2>
        </Link>
        <p className="card-subtitle">{localizedSubtitle}</p>
        
        <div className="card-author">{t("card.by")} {author}</div>
        <div className="card-actions">
          <LikeButton
            count={likes}
            onClick={() => onLike(id)}
            isActive={userAction === "like"}
          />
          <DislikeButton
            count={dislikes}
            onClick={() => onDislike(id)}
            isActive={userAction === "dislike"}
          />
          <button 
            className={`reaction-btn bookmark-btn ${isBookmarked ? 'active' : ''}`}
            onClick={() => onBookmark(id)}
            title={isBookmarked ? t("card.removeBookmark") : t("card.addBookmark")}
          >
            <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
      <Link to={`/news/${id}`} className="card-image-container">
        <img
          src={imageUrl || brainImage}
          alt={localizedTitle || "Article visual"}
          className="card-image"
        />
      </Link>
    </div>
  );
};

export default Card;
