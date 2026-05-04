import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header/Header";
import Slider from "../components/Slider/Slider";
import Footer from "../components/Footer/Footer";
import Card from "../components/Card/Card";
import Form from "../components/Form/Form";
import AddNewsForm from "../components/Form/AddNewsForm";
import Modal from "../components/Modal/Modal";
import Search from "../components/Search/Search";

const Home = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/news");
      const newsData = response.data.map((item) => ({
        ...item,
        likes: item.likes || 0,
        dislikes: item.dislikes || 0,
        userAction: item.userAction || null,
      }));

      setNewsItems(newsData);
      setSlides(newsData.slice(0, 3));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load content.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleModal = () => {
    if (!user) {
      toast.error("Please login to share news");
      navigate("/login");
      return;
    }
    setIsModalOpen((prev) => !prev);
  };

  const handleLike = (id) => {
    if (!user) {
      toast.error("Please login to react to news");
      navigate("/login");
      return;
    }
    setNewsItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;

        // if user already liked the item
        if (item.userAction === "like") {
          return {
            ...item,
            likes: item.likes - 1,
            userAction: null,
          };
        }

        // if user already disliked the item
        return {
          ...item,
          likes: item.likes + 1,
          dislikes:
            item.userAction === "dislike" ? item.dislikes - 1 : item.dislikes,
          userAction: "like",
        };
      }),
    );
  };

  const handleDislike = (id) => {
    if (!user) {
      toast.error("Please login to react to news");
      navigate("/login");
      return;
    }
    setNewsItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;

        if (item.userAction === "dislike") {
          return {
            ...item,
            dislikes: item.dislikes - 1,
            userAction: null,
          };
        }

        return {
          ...item,
          dislikes: item.dislikes + 1,
          likes: item.userAction === "like" ? item.likes - 1 : item.likes,
          userAction: "dislike",
        };
      }),
    );
  };

  const filteredNews = useMemo(() => {
    return newsItems.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [newsItems, searchQuery]);

  return (
    <div className="home-page">
      <Header />

      {!loading && !error && <Slider slides={slides} />}

      <main className="container" style={{ paddingTop: "6rem" }}>
        <section className="latest-news">
          <div className="section-header-flex">
            <h2 className="section-title">Latest Technology</h2>
            <button className="btn btn-primary" onClick={toggleModal}>
              + Share News
            </button>
          </div>

          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <div className="news-grid">
            {loading && <p>Loading news...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading &&
              !error &&
              filteredNews.map((item) => (
                <Card
                  key={item.id}
                  {...item}
                  onLike={handleLike}
                  onDislike={handleDislike}
                />
              ))}
            {!loading && !error && filteredNews.length === 0 && (
              <p className="no-results">
                No articles found matching "{searchQuery}"
              </p>
            )}
          </div>
        </section>

        <section className="newsletter-section">
          <Form />
        </section>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={toggleModal}
        title="Share Your Tech Story"
      >
        <AddNewsForm
          user={user}
          refreshNews={() => {
            fetchData();
            toggleModal();
          }}
        />
      </Modal>

      <Footer />
    </div>
  );
};

export default Home;
