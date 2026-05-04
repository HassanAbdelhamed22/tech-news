import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNews } from "../context/NewsContext";
import Card from "../components/Card/Card";
import { Bookmark, Inbox } from "lucide-react";

const MyNews = () => {
  const { news, bookmarks, loading, error, updateReaction, toggleBookmark, isBookmarked } = useNews();
  const { user } = useAuth();

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
          <h2 className="section-title">My Bookmarks</h2>
          <p className="section-subtitle">Your curated list of must-read tech stories</p>
        </div>
        <div className="stats-badge">
          <Bookmark size={16} />
          <span>{myBookmarks.length} Articles</span>
        </div>
      </div>

      <div className="news-grid">
        {loading && (
          <div className="loading-spinner-container">
            <div className="spinner"></div>
            <p>Fetching your saved stories...</p>
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
            <h3>Your library is empty</h3>
            <p>Articles you bookmark will appear here for quick access.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNews;
