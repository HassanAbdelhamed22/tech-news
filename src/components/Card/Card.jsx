import "../../styles/Card.css";
import brainImage from "../../assets/brain_scans.png";

const Card = ({ title, subtitle }) => {
  return (
    <article className="card">
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-subtitle">{subtitle}</p>
      </div>
      <div className="card-image-container">
        <img src={brainImage} alt="Article visual" className="card-image" />
      </div>
    </article>
  );
};

export default Card;
