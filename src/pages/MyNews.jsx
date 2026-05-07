import { useMemo } from "react";
import { useNews } from "../context/NewsContext";
import { useTranslation } from "react-i18next";
import Card from "../components/Card/Card";
import { Bookmark, Inbox } from "lucide-react";
import { useSelector } from "react-redux";

const MyNews = () => {
  const { news, bookmarks, loading, error, updateReaction, toggleBookmark, isBookmarked } = useNews();
  const user = useSelector((state) => state.auth.user);
  const { t } = useTranslation();

  const myBookmarks = useMemo(() => {
    if (!user) return [];
    const userBookmarkIds = bookmarks
      .filter((b) => b.userId === user.id)
      .map((b) => b.newsId);
    
    return news.filter((n) => userBookmarkIds.includes(n.id));
  }, [news, bookmarks, user]);

  const handleLike = (id) => updateReaction(id, "like");
  const handleDislike = (id) => updateReaction(id, "dislike");
  const handleBookmark = (id) => toggleBookmark(user.id, id);

  return (
    <div className="bookmarks-page container section">
      <div className="section-header-flex">
        <div>
          <h2 className="section-title">{t("myNews.title")}</h2>
          <p className="section-subtitle">{t("myNews.subtitle")}</p>
        </div>
        <div className="stats-badge">
          <Bookmark size={16} />
          <span>{myBookmarks.length} {t("myNews.articles")}</span>
        </div>
      </div>

      <div className="news-grid">
        {loading && (
          <div className="loading-spinner-container">
            <div className="spinner"></div>
            <p>{t("myNews.loading")}</p>
          </div>
        )}

        {!loading && myBookmarks.map((item) => (
          <Card
            key={item.id}
            {...item}
            onLike={handleLike}
            onDislike={handleDislike}
            onBookmark={handleBookmark}
            isBookmarked={true}
          />
        ))}

        {!loading && myBookmarks.length === 0 && (
          <div className="no-results" style={{ padding: '6rem 2rem' }}>
            <div className="empty-state-icon" style={{ marginBottom: '1.5rem', opacity: 0.2 }}>
              <Inbox size={80} />
            </div>
            <h3>{t("myNews.emptyTitle")}</h3>
            <p>{t("myNews.emptyMessage")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNews;
