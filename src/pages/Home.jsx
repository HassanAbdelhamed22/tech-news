import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useNews } from "../context/NewsContext";
import Slider from "../components/Slider/Slider";
import Card from "../components/Card/Card";
import Form from "../components/Form/Form";
import AddNewsForm from "../components/Form/AddNewsForm";
import Modal from "../components/Modal/Modal";

const Home = () => {
  const { news, loading, error, updateReaction, toggleBookmark, isBookmarked, getUserReaction } = useNews();
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
    updateReaction(user.id, id, "like");
  };

  const handleDislike = (id) => {
    if (!user) {
      toast.error("Please login to react");
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
              <h2 className="section-title">Trending Now</h2>
              <p className="section-subtitle">Most discussed and liked stories this week</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/add-news')}>
              + Share News
            </button>
          </div>

          <div className="news-grid">
            {loading && (
              <div className="loading-spinner-container">
                <div className="spinner"></div>
                <p>Curating the best stories...</p>
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
              View Full News Feed
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
