import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import CardWrapper from "../components/Card/CardWrapper";
import { Bookmark, Inbox } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleBookmark, updateReaction } from "../store/slices/newsThunks";

const MyNews = () => {
  const dispatch = useDispatch();
  const { news, bookmarks, loading, error } = useSelector(
    (s) => s.news,
  );
  const user = useSelector((state) => state.auth.user);
  const { t } = useTranslation();

  const myBookmarks = useMemo(() => {
    if (!user) return [];
    const userBookmarkIds = bookmarks
      .filter((b) => b.userId === user.id)
      .map((b) => b.newsId);

    return news.filter((n) => userBookmarkIds.includes(n.id));
  }, [news, bookmarks, user]);

  const handleLike = (id) =>
    dispatch(updateReaction({ userId: user.id, newsId: id, type: "like" }));
  const handleDislike = (id) =>
    dispatch(updateReaction({ userId: user.id, newsId: id, type: "dislike" }));
  const handleBookmark = (id) =>
    dispatch(toggleBookmark({ userId: user.id, newsId: id }));


  return (
    <div className="bookmarks-page container section">
      <div className="section-header-flex">
        <div>
          <h2 className="section-title">{t("myNews.title")}</h2>
          <p className="section-subtitle">{t("myNews.subtitle")}</p>
        </div>
        <div className="stats-badge">
          <Bookmark size={16} />
          <span>
            {myBookmarks.length} {t("myNews.articles")}
          </span>
        </div>
      </div>

      <div className="news-grid">
        {loading && (
          <div className="loading-spinner-container">
            <div className="spinner"></div>
            <p>{t("myNews.loading")}</p>
          </div>
        )}

        {!loading &&
          myBookmarks.map((item) => (
            <CardWrapper
              key={item.id}
              item={item}
              userId={user?.id}
              onLike={handleLike}
              onDislike={handleDislike}
              onBookmark={handleBookmark}
            />
          ))}

        {!loading && myBookmarks.length === 0 && (
          <div className="no-results" style={{ padding: "6rem 2rem" }}>
            <div
              className="empty-state-icon"
              style={{ marginBottom: "1.5rem", opacity: 0.2 }}
            >
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
