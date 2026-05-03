import "../../styles/Card.css";
import brainImage from "../../assets/brain_scans.png";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";

const Card = ({
  id,
  title,
  subtitle,
  description,
  imageUrl,
  author,
  date,
  category,
  likes,
  dislikes,
  userAction,
  onLike,
  onDislike,
}) => {
  return (
    <div className="card">
      <div className="card-content">
        <div className="card-meta">
          <span className="card-category">{category}</span>
          <span className="card-dot">•</span>
          <span className="card-date">{date}</span>
        </div>
        <h2 className="card-title">{title}</h2>
        <p className="card-subtitle">{subtitle}</p>
        {description && <p className="card-description">{description}</p>}
        <div className="card-author">By {author}</div>
        <div className="card-actions">
          <LikeButton
            count={likes}
            onClick={() => onLike(id)}
            isActive={userAction === "like"}
          />
          <DislikeButton
            count={dislikes}
            onClick={() => onDislike(id)}
            isActive={userAction === "dislike"}
          />
        </div>
      </div>
      <div className="card-image-container">
        <img
          src={imageUrl || brainImage}
          alt={title || "Article visual"}
          className="card-image"
        />
      </div>
    </div>
  );
};

export default Card;

