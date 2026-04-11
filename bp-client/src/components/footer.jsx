import { Link } from "react-router-dom";
import "./footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
            <h3 className="footer-logo">Najdi rostlinu</h3>
            <p className="footer-text">
                Propojujeme pěstitele s odbornými radami a místními zahradnictvími.
            </p>
            <div className="footer-cta">
                <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSdhagxL0vmmIN1IGzCdRssDre2UvyvBu5Fv8Yn2qTRGhd7D8A/viewform?usp=publish-editor" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="highlight-link"
                >
                Ohodnotit aplikaci
                </a>
            </div>
            </div>
        <div className="footer-section">
          <h4>Navigace</h4>
          <ul>
            <li><Link to="/">Domů</Link></li>
            <li><Link to="/rady">Pěstitelské rady</Link></li>
            <li><Link to="/podniky">Seznam podniků</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Podpora</h4>
          <ul>
            <li><Link to="/ochrana-soukromi">Ochrana soukromí</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Bakalářská práce</p>
      </div>
    </footer>
  );
};