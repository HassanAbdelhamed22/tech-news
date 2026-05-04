import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNews } from "../context/NewsContext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Card from "../components/Card/Card";
import Search from "../components/Search/Search";

const Feed = () => {
  const { news, loading, error, updateReaction, toggleBookmark, isBookmarked } = useNews();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookmark = (id) => {
    if (!user) {
      toast.error("Please login to bookmark");
      navigate("/login");
      return;
    }
    toggleBookmark(user.id, id);
  };

  const handleLike = (id) => {
    if (!user) {
      toast.error("Please login to react");
      navigate("/login");
      return;
    }
    updateReaction(id, "like");
  };

  const handleDislike = (id) => {
    if (!user) {
      toast.error("Please login to react");
      navigate("/login");
      return;
    }
    updateReaction(id, "dislike");
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
        <h2 className="section-title">The Tech Feed</h2>
        <p className="section-subtitle">Stay updated with the latest in technology</p>
      </div>

      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="news-grid">
        {loading && (
          <div className="loading-spinner-container">
            <div className="spinner"></div>
            <p>Gathering the latest tech stories...</p>
          </div>
        )}
        
        {error && <div className="error-msg">{error}</div>}
        
        {!loading && !error && filteredNews.map((item) => (
          <Card
            key={item.id}
            {...item}
            onLike={handleLike}
            onDislike={handleDislike}
            onBookmark={handleBookmark}
            isBookmarked={isBookmarked(user?.id, item.id)}
          />
        ))}

        {!loading && !error && filteredNews.length === 0 && (
          <div className="no-results">No tech news matches your search.</div>
        )}
      </div>
    </div>
  );
};

export default Feed;
