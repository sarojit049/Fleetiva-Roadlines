import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-glow" />
            <div className="footer-inner">
                {/* Brand */}
                <div className="footer-col footer-brand-col">
                    <div className="footer-brand">
                        <span className="footer-logo" aria-hidden>🚚</span>
                        <span className="footer-brand-name">Fleetiva Roadlines</span>
                    </div>
                    <p className="footer-tagline">
                        India's trusted logistics partner — connecting shippers and carriers for seamless freight movement.
                    </p>
                    <div className="footer-social">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="footer-social-link">𝕏</a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer-social-link">in</a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-link">📷</a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-col">
                    <h4 className="footer-heading">Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/post-load">Post a Load</Link></li>
                    </ul>
                </div>

                {/* Help & Support */}
                <div className="footer-col">
                    <h4 className="footer-heading">Help & Support</h4>
                    <ul className="footer-links">
                        <li><a href="mailto:support@fleetiva.com">support@fleetiva.com</a></li>
                        <li><a href="tel:+919876543210">+91 98765 43210</a></li>
                        <li><Link to="/forgot-password">Reset Password</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div className="footer-col">
                    <h4 className="footer-heading">Legal</h4>
                    <ul className="footer-links">
                        <li><Link to="/terms">Terms & Conditions</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/refund">Refund Policy</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Fleetiva Roadlines. All rights reserved.</p>
                <p className="footer-credit">Built with ❤️ in India</p>
            </div>
        </footer>
    );
}
