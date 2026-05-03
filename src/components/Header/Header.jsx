import { useState, useEffect } from "react";
import "../../styles/Header.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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
        <a href="/" className="logo">
          TECH<span>NEWS</span>
        </a>

        <nav className="nav">
          <a href="#" className="nav-link">
            Latest
          </a>
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
          <button className="btn btn-primary">Subscribe</button>
        </div>
      </div>
    </header>
  );
};

export default Header;

