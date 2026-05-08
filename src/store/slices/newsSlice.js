import { createSlice, createSelector } from "@reduxjs/toolkit";
import {
  fetchNews,
  addNews,
  deleteNews,
  toggleBookmark,
  updateReaction,
} from "./newsThunks";

const newsSlice = createSlice({
  name: "news",
  initialState: {
    news: [],
    bookmarks: [],
    reactions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchNews
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload.news;
        state.bookmarks = action.payload.bookmarks;
        state.reactions = action.payload.reactions;
      })
      .addCase(fetchNews.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch news.";
      });

    // addNews
    builder
      .addCase(addNews.fulfilled, (state, action) => {
        state.news.unshift(action.payload);
      })
      .addCase(addNews.rejected, (state) => {
        state.error = "Failed to share news.";
      });

    // deleteNews
    builder.addCase(deleteNews.fulfilled, (state, action) => {
      state.news = state.news.filter((n) => n.id !== action.payload);
    });

    // toggleBookmark
    builder.addCase(toggleBookmark.fulfilled, (state, action) => {
      const { action: act } = action.payload;
      if (act === "removed") {
        state.bookmarks = state.bookmarks.filter(
          (b) => b.id !== action.payload.id,
        );
      } else {
        state.bookmarks.push(action.payload.bookmark);
      }
    });

    // updateReaction
    builder.addCase(updateReaction.fulfilled, (state, action) => {
      const { newsId, newLikes, newDislikes, reactionChange } = action.payload;

      // Update news counts
      state.news = state.news.map((n) =>
        String(n.id) === String(newsId)
          ? { ...n, likes: newLikes, dislikes: newDislikes }
          : n,
      );

      // Update reactions list
      if (reactionChange.action === "removed") {
        state.reactions = state.reactions.filter(
          (r) => r.id !== reactionChange.id,
        );
      } else if (reactionChange.action === "updated") {
        state.reactions = state.reactions.map((r) =>
          r.id === reactionChange.reaction.id ? reactionChange.reaction : r,
        );
      } else if (reactionChange.action === "added") {
        state.reactions.push(reactionChange.reaction);
      }
    });
  },
});

export default newsSlice.reducer;

const selectReactions = (state) => state.news.reactions;
const selectBookmarks = (state) => state.news.bookmarks;

export const selectUserReaction = (userId, newsId) =>
  createSelector(selectReactions, (reactions) => {
    const r = reactions.find(
      (r) => r.userId === userId && String(r.newsId) === String(newsId),
    );
    return r ? r.type : null;
  });

export const selectIsBookmarked = (userId, newsId) =>
  createSelector(selectBookmarks, (bookmarks) =>
    bookmarks.some((b) => b.userId === userId && b.newsId === newsId),
  );

 