import { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const [newsRes, bookmarksRes, reactionsRes] = await Promise.all([
        axios.get("http://localhost:5000/news"),
        axios.get("http://localhost:5000/bookmarks"),
        axios.get("http://localhost:5000/reactions").catch(() => ({ data: [] }))
      ]);
      setNews(newsRes.data);
      setBookmarks(bookmarksRes.data);
      setReactions(reactionsRes.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch news.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const toggleBookmark = async (userId, newsId) => {
    const existing = bookmarks.find(b => b.userId === userId && b.newsId === newsId);

    try {
      if (existing) {
        await axios.delete(`http://localhost:5000/bookmarks/${existing.id}`);
        setBookmarks(prev => prev.filter(b => b.id !== existing.id));
        toast.success("Removed from bookmarks");
      } else {
        const res = await axios.post("http://localhost:5000/bookmarks", { userId, newsId });
        setBookmarks(prev => [...prev, res.data]);
        toast.success("Added to bookmarks");
      }
    } catch (err) {
      toast.error("Failed to update bookmarks");
    }
  };

  const isBookmarked = (userId, newsId) => {
    return bookmarks.some(b => b.userId === userId && b.newsId === newsId);
  };

  const addNews = async (newsItem) => {
    try {
      const response = await axios.post("http://localhost:5000/news", {
        ...newsItem,
        likes: 0,
        dislikes: 0,
        date: new Date().toLocaleDateString(),
      });
      setNews((prev) => [response.data, ...prev]);
      toast.success("News shared successfully!");
      return true;
    } catch (err) {
      toast.error("Failed to share news.");
      return false;
    }
  };

  const updateReaction = async (userId, newsId, type) => {
    const item = news.find(n => String(n.id) === String(newsId));
    if (!item) return;

    const existing = reactions.find(r => r.userId === userId && String(r.newsId) === String(newsId));
    
    let newLikes = item.likes || 0;
    let newDislikes = item.dislikes || 0;
    let reactionPromise = null;

    try {
      if (existing) {
        if (existing.type === type) {
          // Toggle OFF
          if (type === 'like') newLikes--; else newDislikes--;
          reactionPromise = axios.delete(`http://localhost:5000/reactions/${existing.id}`);
          setReactions(prev => prev.filter(r => r.id !== existing.id));
        } else {
          // Switch type
          if (type === 'like') { newLikes++; newDislikes--; } else { newLikes--; newDislikes++; }
          reactionPromise = axios.patch(`http://localhost:5000/reactions/${existing.id}`, { type });
          setReactions(prev => prev.map(r => r.id === existing.id ? { ...r, type } : r));
        }
      } else {
        // New reaction
        if (type === 'like') newLikes++; else newDislikes++;
        reactionPromise = axios.post("http://localhost:5000/reactions", { userId, newsId, type });
        const res = await reactionPromise;
        setReactions(prev => [...prev, res.data]);
        reactionPromise = Promise.resolve(); // already done
      }

      // Optimistic update for news counts
      setNews(prev => prev.map(n => String(n.id) === String(newsId) ? { ...n, likes: newLikes, dislikes: newDislikes } : n));

      await Promise.all([
        reactionPromise,
        axios.patch(`http://localhost:5000/news/${newsId}`, { likes: newLikes, dislikes: newDislikes })
      ]);
    } catch (err) {
      toast.error("Reaction failed to save");
      fetchNews(); // Rollback
    }
  };

  const getUserReaction = (userId, newsId) => {
    const reaction = reactions.find(r => r.userId === userId && String(r.newsId) === String(newsId));
    return reaction ? reaction.type : null;
  };

  const deleteNews = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/news/${id}`);
      setNews((prev) => prev.filter((n) => n.id !== id));
      toast.success("News deleted.");
    } catch (err) {
      toast.error("Failed to delete news.");
    }
  };

  return (
    <NewsContext.Provider
      value={{
        news,
        bookmarks,
        reactions,
        loading,
        error,
        fetchNews,
        addNews,
        updateReaction,
        getUserReaction,
        toggleBookmark,
        isBookmarked,
        deleteNews,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context;
};
