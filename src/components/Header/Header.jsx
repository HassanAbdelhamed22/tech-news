import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Header.css";

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
            Latest
          </Link>
          <a href="#" className="nav-link">
            Reviews
          </a>
          <a href="#" className="nav-link">
            AI
          </a>
          <a href="#" className="nav-link">
            Gadgets
          </a>
        </nav>

        <div className="header-actions">
          {user ? (
            <div className="user-profile">
              <span className="user-name">Hi, {user.fullName?.split(' ')[0] || user.email.split('@')[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

