import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import getLocalizedField from "../utils/getLocalizedField";
import {
  ArrowLeft,
  Clock,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
} from "lucide-react";
import toast from "react-hot-toast";
import "../styles/NewsDetails.css";
import brainImage from "../assets/brain_scans.png";
import { useDispatch, useSelector } from "react-redux";
import { toggleBookmark, updateReaction } from "../store/slices/newsThunks";
import {
  selectUserReaction,
  selectIsBookmarked,
} from "../store/slices/newsSlice";

const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { news, loading } = useSelector((s) => s.news);
  const { user } = useSelector((state) => state.auth);
  const userAction = useSelector(selectUserReaction(user?.id, id));
  const bookmarked = useSelector(selectIsBookmarked(user?.id, id));

  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const article = news.find((n) => String(n.id) === String(id));

  if (loading)
    return (
      <div className="loading-state container">
        <div className="spinner"></div>
        <p>{t("newsDetails.loading")}</p>
      </div>
    );

  if (!article)
    return (
      <div className="error-state container">
        <h2>{t("newsDetails.notFound")}</h2>
        <button className="btn btn-primary" onClick={() => navigate("/feed")}>
          {t("newsDetails.backToFeed")}
        </button>
      </div>
    );

  const handleLike = () => {
    if (!user) return toast.error(t("toast.loginToReact"));
    dispatch(updateReaction({ userId: user.id, newsId: id, type: "like" }));
  };

  const handleDislike = () => {
    if (!user) return toast.error(t("toast.loginToReact"));
    dispatch(updateReaction({ userId: user.id, newsId: id, type: "dislike" }));
  };

  const handleBookmark = () => {
    if (!user) return toast.error(t("toast.loginToBookmark"));
    dispatch(toggleBookmark({ userId: user.id, newsId: id }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(t("newsDetails.linkCopied"));
  };

  // Localized content with fallback to English
  const title = getLocalizedField(article, "title", lang);
  const subtitle = getLocalizedField(article, "subtitle", lang);
  const description = getLocalizedField(article, "description", lang);

  return (
    <div className="details-page">
      <div className="details-container container">
        {/* Navigation */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          {t("newsDetails.back")}
        </button>

        <article className="full-article">
          {/* Header */}
          <header className="article-header">
            <span className="article-category">{article.category}</span>
            <h1 className="article-title">{title}</h1>
            <p className="article-subtitle">{subtitle}</p>

            <div className="article-meta-row">
              <div className="author-info">
                <div className="author-avatar">{article.author.charAt(0)}</div>
                <div>
                  <span className="author-name">{article.author}</span>
                  <div className="publish-date">
                    <Clock size={12} />
                    {article.date}
                  </div>
                </div>
              </div>

              <div className="article-actions-top">
                <button onClick={handleShare} title="Share">
                  <Share2 size={18} />
                </button>
                <button
                  onClick={handleBookmark}
                  className={bookmarked ? "active" : ""}
                  title="Bookmark"
                >
                  <Bookmark
                    size={18}
                    fill={bookmarked ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="featured-image-container">
            <img
              src={article.imageUrl || brainImage}
              alt={title}
              className="featured-image"
            />
          </div>

          {/* Content */}
          <div className="article-body">
            {description.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Footer Reactions */}
          <footer className="article-footer">
            <div className="reaction-summary">
              <h3>{t("newsDetails.whatDoYouThink")}</h3>
              <div className="reaction-buttons">
                <button
                  className={`reaction-btn like ${userAction === "like" ? "active" : ""}`}
                  onClick={handleLike}
                >
                  <ThumbsUp size={20} />
                  <span>{article.likes}</span>
                </button>
                <button
                  className={`reaction-btn dislike ${userAction === "dislike" ? "active" : ""}`}
                  onClick={handleDislike}
                >
                  <ThumbsDown size={20} />
                  <span>{article.dislikes}</span>
                </button>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default NewsDetails;
