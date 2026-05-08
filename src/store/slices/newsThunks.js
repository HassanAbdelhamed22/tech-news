import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";
import toast from "react-hot-toast";
import i18n from "../../i18n/index.js";

// Fetch all news, bookmarks, reactions
export const fetchNews = createAsyncThunk("news/fetchNews", async () => {
  const [newsRes, bookmarksRes, reactionsRes] = await Promise.all([
    API.get("/news"),
    API.get("/bookmarks"),
    API.get("/reactions").catch(() => ({ data: [] })),
  ]);

  return {
    news: newsRes.data,
    bookmarks: bookmarksRes.data,
    reactions: reactionsRes.data,
  };
});

// Add a new article
export const addNews = createAsyncThunk("news/addNews", async (newsItem) => {
  const response = await API.post("/news", {
    ...newsItem,
    likes: 0,
    dislikes: 0,
    date: new Date().toLocaleDateString(),
  });
  toast.success(i18n.t("toast.newsShared"));
  return response.data;
});

// Delete an article 
export const deleteNews = createAsyncThunk("news/deleteNews", async (id) => {
  await API.delete(`/news/${id}`);
  toast.success(i18n.t("toast.newsDeleted"));
  return id; // returned so the reducer can filter it out
});

// Toggle bookmark
// Returns { action: "added"|"removed", bookmark }
export const toggleBookmark = createAsyncThunk(
  "news/toggleBookmark",
  async ({ userId, newsId }, thunkAPI) => {
    const { bookmarks } = thunkAPI.getState().news;

    const existing = bookmarks.find(
      (b) => b.userId === userId && String(b.newsId) === String(newsId)
    );

    if (existing) {
      await API.delete(`/bookmarks/${existing.id}`);
      toast.success(i18n.t("toast.bookmarkRemoved"));
      return { action: "removed", id: existing.id };
    } else {
      const res = await API.post("/bookmarks", { userId, newsId });
      toast.success(i18n.t("toast.bookmarkAdded"));
      return { action: "added", bookmark: res.data };
    }
  }
);

// Update reaction (like / dislike / toggle off)
// Returns { newsId, newLikes, newDislikes, reactionChange }
// reactionChange: { action: "added"|"removed"|"updated", reaction?, id? }
export const updateReaction = createAsyncThunk(
  "news/updateReaction",
  async ({ userId, newsId, type }, thunkAPI) => {
    const { news, reactions } = thunkAPI.getState().news;

    const item = news.find((n) => String(n.id) === String(newsId));
    if (!item) return thunkAPI.rejectWithValue("News item not found");

    const existing = reactions.find(
      (r) => r.userId === userId && String(r.newsId) === String(newsId)
    );

    let newLikes = item.likes || 0;
    let newDislikes = item.dislikes || 0;
    let reactionChange;

    if (existing) {
      if (existing.type === type) {
        // Same reaction → toggle off (remove)
        if (type === "like") newLikes--;
        else newDislikes--;

        await API.delete(`/reactions/${existing.id}`);
        reactionChange = { action: "removed", id: existing.id };
      } else {
        // Switched reaction
        if (type === "like") {
          newLikes++;
          newDislikes--;
        } else {
          newLikes--;
          newDislikes++;
        }

        const res = await API.patch(`/reactions/${existing.id}`, { type });
        reactionChange = { action: "updated", reaction: res.data };
      }
    } else {
      // Brand new reaction
      if (type === "like") newLikes++;
      else newDislikes++;

      const res = await API.post("/reactions", { userId, newsId, type });
      reactionChange = { action: "added", reaction: res.data };
    }

    // Persist updated counts on the news item
    await API.patch(`/news/${newsId}`, { likes: newLikes, dislikes: newDislikes });

    return { newsId, newLikes, newDislikes, reactionChange };
  }
);
