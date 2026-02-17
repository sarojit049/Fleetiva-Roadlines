import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Helmet>
        <title>Fleetiva Roadlines — India's Trusted Logistics & Transport Partner</title>
        <meta name="description" content="Fleetiva Roadlines connects truck owners, shippers, and fleet operators. Post loads, find trucks, generate bilty, and manage your transport business." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Background */}
      <div className="bg-gradient-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-nav-brand">
            <span className="landing-nav-logo">🚛</span>
            <span className="landing-nav-name">Fleetiva Roadlines</span>
          </div>
          <div className="landing-nav-actions">
            <Link to="/login" className="btn btn-glass">Sign In</Link>
            <Link to="/register" className="btn btn-cta">Get Started →</Link>
          </div>
        </div>
      </nav>

      <div className="page-content">
        {/* Hero */}
        <section className="hero">
          <div className="hero-content">
            <span className="pill animate-fade-in-up">🚚 India's #1 Transport Platform</span>
            <h1 className="hero-title animate-fade-in-up delay-1">
              Move freight faster.<br />
              <span className="hero-highlight">Manage your fleet smarter.</span>
            </h1>
            <p className="hero-subtitle animate-fade-in-up delay-2">
              Whether you're a truck owner, transporter, or shipper — post loads,
              find trucks, generate bilty & invoices, and grow your transport business.
            </p>
            <div className="hero-actions animate-fade-in-up delay-3">
              <Link to="/register" className="btn btn-cta btn-glow">
                <span>Start Free →</span>
              </Link>
              <Link to="/login" className="btn btn-glass">
                Sign In
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="hero-trust animate-fade-in-up delay-4">
              <div className="trust-item">
                <span className="trust-number">500+</span>
                <span className="trust-label">Trucks Registered</span>
              </div>
              <div className="trust-divider" />
              <div className="trust-item">
                <span className="trust-number">1,200+</span>
                <span className="trust-label">Loads Delivered</span>
              </div>
              <div className="trust-divider" />
              <div className="trust-item">
                <span className="trust-number">50+</span>
                <span className="trust-label">Cities Covered</span>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="hero-grid">
            <div className="card hero-card feature-card animate-fade-in-up delay-2">
              <div className="feature-icon icon-amber">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
              </div>
              <h3 className="section-title">Truck Booking</h3>
              <p className="text-muted">
                Find matching trucks for your loads instantly. Full & part load options available.
              </p>
            </div>
            <div className="card hero-card feature-card animate-fade-in-up delay-3">
              <div className="feature-icon icon-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
              </div>
              <h3 className="section-title">Bilty & Invoice</h3>
              <p className="text-muted">
                Generate professional bilty (LR) and invoices with one click. Download PDF anytime.
              </p>
            </div>
            <div className="card hero-card feature-card animate-fade-in-up delay-4">
              <div className="feature-icon icon-green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <h3 className="section-title">Secure Payments</h3>
              <p className="text-muted">
                Track freight charges, advance paid, and balance amounts with full payment history.
              </p>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="landing-roles animate-fade-in-up delay-5">
          <h2 className="landing-section-title">Built for Transport Professionals</h2>
          <div className="roles-grid">
            <div className="role-card role-owner">
              <span className="role-icon">🚛</span>
              <h3 className="role-title">Truck Owners</h3>
              <p className="role-desc">
                Register your trucks, find loads, accept bookings, and track earnings from one place.
              </p>
            </div>
            <div className="role-card role-shipper">
              <span className="role-icon">📦</span>
              <h3 className="role-title">Shippers / Customers</h3>
              <p className="role-desc">
                Post loads, get matched with trucks, and monitor deliveries with live status updates.
              </p>
            </div>
            <div className="role-card role-admin">
              <span className="role-icon">🏢</span>
              <h3 className="role-title">Transport Companies</h3>
              <p className="role-desc">
                Manage your entire fleet — drivers, bookings, bilties, and payments in one dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="landing-steps animate-fade-in-up delay-6">
          <h2 className="landing-section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Register</h3>
              <p className="step-desc">Sign up as a truck owner, shipper, or admin in under a minute.</p>
            </div>
            <div className="step-connector">→</div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Post</h3>
              <p className="step-desc">Post your load or truck availability with route and material details.</p>
            </div>
            <div className="step-connector">→</div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Match & Move</h3>
              <p className="step-desc">Get matched, create bookings, generate bilty, and start delivery.</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
