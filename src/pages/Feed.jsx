import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNews } from "../context/NewsContext";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Card from "../components/Card/Card";
import Search from "../components/Search/Search";

const Feed = () => {
  const { news, loading, error, updateReaction, toggleBookmark, isBookmarked, getUserReaction } = useNews();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBookmark = (id) => {
    if (!user) {
      toast.error(t("toast.loginToBookmark"));
      navigate("/login");
      return;
    }
    toggleBookmark(user.id, id);
  };

  const handleLike = (id) => {
    if (!user) {
      toast.error(t("toast.loginToReact"));
      navigate("/login");
      return;
    }
    updateReaction(user.id, id, "like");
  };

  const handleDislike = (id) => {
    if (!user) {
      toast.error(t("toast.loginToReact"));
      navigate("/login");
      return;
    }
    updateReaction(user.id, id, "dislike");
  };

  const filteredNews = useMemo(() => {
    return news
      .filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        
        {!loading && !error && filteredNews.map((item) => (
          <Card
            key={item.id}
            {...item}
            userAction={getUserReaction(user?.id, item.id)}
            onLike={handleLike}
            onDislike={handleDislike}
            onBookmark={handleBookmark}
            isBookmarked={isBookmarked(user?.id, item.id)}
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
