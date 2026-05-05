import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Home, Rss, User, PlusSquare, Settings, Bookmark } from "lucide-react";
import "../../styles/Header.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header glass ${isScrolled ? "scrolled" : ""}`}>
      <div className="container header-container">
        <Link to="/" className="logo">
          TECH<span>NEWS</span>
        </Link>

        <nav className="nav">
          <NavLink to="/" className="nav-link">
            <Home size={18} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/feed" className="nav-link">
            <Rss size={18} />
            <span>Feed</span>
          </NavLink>
          
          {user && (
            <>
              <NavLink to="/my-news" className="nav-link">
                <Bookmark size={18} />
                <span>Bookmarks</span>
              </NavLink>
              <NavLink to="/add-news" className="nav-link">
                <PlusSquare size={18} />
                <span>Add News</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="header-actions">
          {user ? (
            <div className="user-profile">
              <span className="user-name">
                Hi, {user.fullName?.split(" ")[0]}
              </span>
              <button className="logout-btn" onClick={logout} title="Logout">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
