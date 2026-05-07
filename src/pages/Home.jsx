import { useMemo } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Slider from "../components/Slider/Slider";
import CardWrapper from "../components/Card/CardWrapper";
import Form from "../components/Form/Form";
import { useDispatch, useSelector } from "react-redux";
import { toggleBookmark, updateReaction } from "../store/slices/newsThunks";

const Home = () => {
  const dispatch = useDispatch();
  const { news, bookmarks, reactions, loading, error } = useSelector((s) => s.news);
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

  const slides = useMemo(() => news.slice(0, 3), [news]);

  const trendingNews = useMemo(() => {
    return [...news]
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 4);
  }, [news]);

  return (
    <div className="home-page">
      {!loading && !error && <Slider slides={slides} />}

      <main className="container">
        <section className="section trending-section">
          <div className="section-header-flex">
            <div>
              <h2 className="section-title">{t("home.trending")}</h2>
              <p className="section-subtitle">{t("home.trendingSubtitle")}</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/add-news")}
            >
              {t("home.shareNews")}
            </button>
          </div>

          <div className="news-grid">
            {loading && (
              <div className="loading-spinner-container">
                <div className="spinner"></div>
                <p>{t("home.loading")}</p>
              </div>
            )}

            {!loading &&
              trendingNews.map((item) => (
                <CardWrapper
                  key={item.id}
                  item={item}
                  userId={user?.id}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onBookmark={handleBookmark}
                />
              ))}
          </div>

          <div
            className="cta-container"
            style={{ textAlign: "center", marginTop: "4rem" }}
          >
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/feed")}
            >
              {t("home.viewFeed")}
            </button>
          </div>
        </section>

        <section className="section newsletter-section">
          <Form />
        </section>
      </main>
    </div>
  );
};

export default Home;
