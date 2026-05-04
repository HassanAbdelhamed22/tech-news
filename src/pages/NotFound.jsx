import { Link } from "react-router";
import { Home, Compass } from "lucide-react";
import "../styles/ErrorPage.css";

const NotFound = () => {
  return (
    <div className="error-page-container">
      <div className="error-content">
        <div className="error-icon">
          <Compass size={60} strokeWidth={1.5} />
        </div>
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">
          Oops! The page you're looking for doesn't exist or has been moved to a new destination in the tech universe.
        </p>
        <div className="error-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            Back to Home
          </Link>
          <button 
            className="btn btn-secondary" 
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
