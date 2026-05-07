import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import CardWrapper from "../components/Card/CardWrapper";
import Search from "../components/Search/Search";
import { useDispatch, useSelector } from "react-redux";
import { toggleBookmark, updateReaction } from "../store/slices/newsThunks";

const Feed = () => {
  const dispatch = useDispatch();
  const { news, bookmarks, reactions, loading, error } = useSelector(
    (s) => s.news,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBookmark = (id) => {
    if (!user) {
      toast.error(t("toast.loginToBookmark"));
      navigate("/login");
      return;
    }
    dispatch(toggleBookmark({ userId: user.id, newsId: id }));
  };

  const handleLike = (id) => {
    if (!user) {
      toast.error(t("toast.loginToReact"));
      navigate("/login");
      return;
    }
    dispatch(updateReaction({ userId: user.id, newsId: id, type: "like" }));
  };

  const handleDislike = (id) => {
    if (!user) {
      toast.error(t("toast.loginToReact"));
      navigate("/login");
      return;
    }
    dispatch(updateReaction({ userId: user.id, newsId: id, type: "dislike" }));
  };

  const filteredNews = useMemo(() => {
    return news
      .filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [news, searchQuery]);

  return (
    <div className="feed-page container section">
      <div className="section-header-flex">
        <h2 className="section-title">{t("feed.title")}</h2>
        <p className="section-subtitle">{t("feed.subtitle")}</p>
      </div>

      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="news-grid">
        {loading && (
          <div className="loading-spinner-container">
            <div className="spinner"></div>
            <p>{t("feed.loading")}</p>
          </div>
        )}

        {error && <div className="error-msg">{error}</div>}

        {!loading &&
          !error &&
          filteredNews.map((item) => (
            <CardWrapper
              key={item.id}
              item={item}
              userId={user?.id}
              onLike={handleLike}
              onDislike={handleDislike}
              onBookmark={handleBookmark}
            />
          ))}

        {!loading && !error && filteredNews.length === 0 && (
          <div className="no-results">{t("feed.noResults")}</div>
        )}
      </div>
    </div>
  );
};

export default Feed;
