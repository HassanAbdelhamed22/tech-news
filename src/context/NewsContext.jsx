import { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/news");
      setNews(response.data);
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
        loading,
        error,
        fetchNews,
        addNews,
        updateReaction,
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
