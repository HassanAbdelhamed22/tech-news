import {
  createContext,
  useContext,
  useState,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import i18n from "../i18n/index.js";

const NewsContext = createContext();

// Reactions Reducer to manage complex reaction state transitions
const reactionsReducer = (state, action) => {
  switch (action.type) {
    case "SET_REACTIONS":
      return action.payload;
    case "ADD_REACTION":
      return [...state, action.payload];
    case "REMOVE_REACTION":
      return state.filter((r) => r.id !== action.payload);
    case "UPDATE_REACTION":
      return state.map((r) =>
        r.id === action.payload.id ? { ...r, type: action.payload.type } : r,
      );
    default:
      return state;
  }
};

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reactions, dispatchReactions] = useReducer(reactionsReducer, []);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);

      const [newsRes, bookmarksRes, reactionsRes] = await Promise.all([
        API.get("/news"),
        API.get("/bookmarks"),
        API.get("/reactions").catch(() => ({ data: [] })),
      ]);

      setNews(newsRes.data);
      setBookmarks(bookmarksRes.data);
      dispatchReactions({ type: "SET_REACTIONS", payload: reactionsRes.data });
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

  const toggleBookmark = useCallback(
    async (userId, newsId) => {
      // find() returns the actual bookmark object (with .id), not just a boolean
      const existing = bookmarks.find(
        (b) => b.userId === userId && String(b.newsId) === String(newsId)
      );

      try {
        if (existing) {
          await API.delete(`/bookmarks/${existing.id}`);
          setBookmarks((prev) => prev.filter((b) => b.id !== existing.id));
          toast.success(i18n.t("toast.bookmarkRemoved"));
        } else {
          const res = await API.post("/bookmarks", { userId, newsId });
          setBookmarks((prev) => [...prev, res.data]);
          toast.success(i18n.t("toast.bookmarkAdded"));
        }
      } catch (err) {
        toast.error(i18n.t("toast.bookmarkFailed"));
      }
    },
    [bookmarks],
  );

  const isBookmarked = useCallback(
    (userId, newsId) => {
      return bookmarks.some((b) => b.userId === userId && b.newsId === newsId);
    },
    [bookmarks],
  );

  const addNews = useCallback(async (newsItem) => {
    try {
      const response = await API.post("/news", {
        ...newsItem,
        likes: 0,
        dislikes: 0,
        date: new Date().toLocaleDateString(),
      });
      setNews((prev) => [response.data, ...prev]);
      toast.success(i18n.t("toast.newsShared"));
      return true;
    } catch (err) {
      toast.error(i18n.t("toast.newsShareFailed"));
      return false;
    }
  }, []);

  const updateReaction = useCallback(
    async (userId, newsId, type) => {
      // find the news item
      const item = news.find((n) => String(n.id) === String(newsId));
      if (!item) return;

      // find the reaction 
      const existing = reactions.find(
        (r) => r.userId === userId && String(r.newsId) === String(newsId),
      );

      let newLikes = item.likes || 0;
      let newDislikes = item.dislikes || 0;
      let reactionPromise = null;

      try {
        if (existing) {
          // if the user clicked the same reaction
          if (existing.type === type) {
            if (type === "like") newLikes--;
            else newDislikes--;
            reactionPromise = API.delete(`/reactions/${existing.id}`);
            dispatchReactions({
              type: "REMOVE_REACTION",
              payload: existing.id,
            });
          } else {
            // if the user clicked a different reaction
            if (type === "like") {
              newLikes++;
              newDislikes--;
            } else {
              newLikes--;
              newDislikes++;
            }
            reactionPromise = API.patch(`/reactions/${existing.id}`, { type });
            dispatchReactions({
              type: "UPDATE_REACTION",
              payload: { id: existing.id, type },
            });
          }
        } else {
          // New reaction
          if (type === "like") newLikes++;
          else newDislikes++;
          const res = await API.post("/reactions", { userId, newsId, type });
          dispatchReactions({ type: "ADD_REACTION", payload: res.data });
          reactionPromise = Promise.resolve();
        }

        // Optimistic update for news counts
        setNews((prev) =>
          prev.map((n) =>
            String(n.id) === String(newsId)
              ? { ...n, likes: newLikes, dislikes: newDislikes }
              : n,
          ),
        );

        // Update news counts in the database
        await Promise.all([
          reactionPromise,
          API.patch(`/news/${newsId}`, {
            likes: newLikes,
            dislikes: newDislikes,
          }),
        ]);
      } catch (err) {
        toast.error(i18n.t("toast.reactionFailed"));
        fetchNews();
      }
    },
    [news, reactions, fetchNews],
  );

  const getUserReaction = useCallback(
    (userId, newsId) => {
      const reaction = reactions.find(
        (r) => r.userId === userId && String(r.newsId) === String(newsId),
      );
      return reaction ? reaction.type : null;
    },
    [reactions],
  );

  const deleteNews = useCallback(async (id) => {
    try {
      await API.delete(`/news/${id}`);
      setNews((prev) => prev.filter((n) => n.id !== id));
      toast.success(i18n.t("toast.newsDeleted"));
    } catch (err) {
      toast.error(i18n.t("toast.newsDeleteFailed"));
    }
  }, []);

  const value = useMemo(
    () => ({
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
    }),
    [
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
    ],
  );

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context;
};
