import { useParams, useNavigate } from "react-router";
import { useNews } from "../context/NewsContext";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Clock, User, Share2, ThumbsUp, ThumbsDown, Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import "../styles/NewsDetails.css";
import brainImage from "../assets/brain_scans.png";

const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { news, updateReaction, toggleBookmark, isBookmarked, loading } = useNews();
  const { user } = useAuth();

  const article = news.find((n) => String(n.id) === String(id));

  if (loading) return (
    <div className="loading-state container">
      <div className="spinner"></div>
      <p>Loading article...</p>
    </div>
  );

  if (!article) return (
    <div className="error-state container">
      <h2>Article Not Found</h2>
      <button className="btn btn-primary" onClick={() => navigate("/feed")}>
        Back to Feed
      </button>
    </div>
  );

  const handleLike = () => {
    if (!user) return toast.error("Please login to react");
    updateReaction(id, "like");
  };

  const handleDislike = () => {
    if (!user) return toast.error("Please login to react");
    updateReaction(id, "dislike");
  };

  const handleBookmark = () => {
    if (!user) return toast.error("Please login to bookmark");
    toggleBookmark(user.id, id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="details-page">
      <div className="details-container container">
        {/* Navigation */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>

        <article className="full-article">
          {/* Header */}
          <header className="article-header">
            <span className="article-category">{article.category}</span>
            <h1 className="article-title">{article.title}</h1>
            <p className="article-subtitle">{article.subtitle}</p>

            <div className="article-meta-row">
              <div className="author-info">
                <div className="author-avatar">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <span className="author-name">{article.author}</span>
                  <div className="publish-date">
                    <Clock size={12} />
                    {article.date}
                  </div>
                </div>
              </div>

              <div className="article-actions-top">
                <button onClick={handleShare} title="Share">
                  <Share2 size={18} />
                </button>
                <button 
                  onClick={handleBookmark} 
                  className={isBookmarked(user?.id, id) ? "active" : ""}
                  title="Bookmark"
                >
                  <Bookmark size={18} fill={isBookmarked(user?.id, id) ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="featured-image-container">
            <img 
              src={article.imageUrl || brainImage} 
              alt={article.title} 
              className="featured-image"
            />
          </div>

          {/* Content */}
          <div className="article-body">
            {article.description.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Footer Reactions */}
          <footer className="article-footer">
            <div className="reaction-summary">
              <h3>What do you think?</h3>
              <div className="reaction-buttons">
                <button 
                  className={`reaction-btn like ${article.userAction === 'like' ? 'active' : ''}`}
                  onClick={handleLike}
                >
                  <ThumbsUp size={20} />
                  <span>{article.likes}</span>
                </button>
                <button 
                  className={`reaction-btn dislike ${article.userAction === 'dislike' ? 'active' : ''}`}
                  onClick={handleDislike}
                >
                  <ThumbsDown size={20} />
                  <span>{article.dislikes}</span>
                </button>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default NewsDetails;
