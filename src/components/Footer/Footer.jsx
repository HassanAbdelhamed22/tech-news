import "../../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="/" className="footer-logo">
              TECHNEWS
            </a>
            <p className="footer-desc">
              Stay ahead with the latest in technology, AI, and digital culture.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Sections</h4>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  Latest News
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Reviews
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  AI & ML
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Gadgets
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Company</h4>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Follow Us</h4>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">© 2026 TechNews. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

