import "../../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
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
          <button className="btn-primary">Subscribe</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
