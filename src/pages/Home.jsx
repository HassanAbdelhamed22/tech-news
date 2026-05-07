import { useMemo } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useNews } from "../context/NewsContext";
import Slider from "../components/Slider/Slider";
import Card from "../components/Card/Card";
import Form from "../components/Form/Form";
import { useSelector } from "react-redux";

const Home = () => {
  const { news, loading, error, updateReaction, toggleBookmark, isBookmarked, getUserReaction } = useNews();
  const user = useSelector((state) => state.auth.user);
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
            <button className="btn btn-primary" onClick={() => navigate('/add-news')}>
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
            
            {!loading && trendingNews.map((item) => (
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
          </div>
          
          <div className="cta-container" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/feed')}>
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
