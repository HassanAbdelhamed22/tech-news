import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Header.css";
import { LogOut } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`header glass ${isScrolled ? "scrolled" : ""}`}>
      <div className="container header-container">
        <Link to="/" className="logo">
          TECH<span>NEWS</span>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/feed" className="nav-link">
            Feed
          </Link>
          <Link to="/my-news" className="nav-link">
            My News
          </Link>
          <Link to="/add-news" className="nav-link">
            Add News
          </Link>
          {/* <Link to="/profile" className="nav-link">
            Profile
          </Link> */}
        </nav>

        <div className="header-actions">
          {user ? (
            <div className="user-profile">
              <span className="user-name">
                Hi, {user.fullName?.split(" ")[0] || user.email.split("@")[0]}
              </span>
              <button className="btn btn-outline btn-sm logout-btn" onClick={logout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
