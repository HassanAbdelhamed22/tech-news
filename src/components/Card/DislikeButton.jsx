const DislikeButton = ({ count, onClick, isActive }) => {
  return (
    <button 
      className={`reaction-btn dislike-btn ${isActive ? "active" : ""}`} 
      onClick={onClick}
    >
      <span className="icon">👎</span>
      <span className="count">{count}</span>
    </button>
  );
};

export default DislikeButton;

