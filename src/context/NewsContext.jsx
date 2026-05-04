import { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch news (mandatory)
      const newsRes = await axios.get("http://localhost:5000/news");
      setNews(newsRes.data);

      // Fetch bookmarks (optional/resilient)
      try {
        const bookmarksRes = await axios.get("http://localhost:5000/bookmarks");
        setBookmarks(bookmarksRes.data);
      } catch (err) {
        console.warn("Bookmarks resource not found or inaccessible, defaulting to empty.", err);
        setBookmarks([]);
      }

      setError(null);
    } catch (err) {
      setError("Failed to fetch news.");
      console.error(err);
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

  const updateReaction = async (id, type, userAction) => {
    const item = news.find((n) => n.id === id);
    if (!item) return;

    let newLikes = item.likes || 0;
    let newDislikes = item.dislikes || 0;
    let newAction = userAction;

    if (type === "like") {
      if (item.userAction === "like") {
        newLikes--;
        newAction = null;
      } else {
        newLikes++;
        if (item.userAction === "dislike") newDislikes--;
        newAction = "like";
      }
    } else {
      if (item.userAction === "dislike") {
        newDislikes--;
        newAction = null;
      } else {
        newDislikes++;
        if (item.userAction === "like") newLikes--;
        newAction = "dislike";
      }
    }

    try {
      // Optimistic Update
      const oldNews = [...news];
      setNews((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, likes: newLikes, dislikes: newDislikes, userAction: newAction }
            : n
        )
      );

      await axios.patch(`http://localhost:5000/news/${id}`, {
        likes: newLikes,
        dislikes: newDislikes,
      });
    } catch (err) {
      toast.error("Failed to update reaction.");
    }
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
        loading,
        error,
        fetchNews,
        addNews,
        updateReaction,
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
