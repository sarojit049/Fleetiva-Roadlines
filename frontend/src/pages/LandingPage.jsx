import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Animated background elements */}
      <div className="bg-gradient-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="page-content">
        <section className="hero">
          <div className="hero-content">
            <span className="pill animate-fade-in-up">Fleetiva Roadlines</span>
            <h1 className="hero-title animate-fade-in-up delay-1">
              Smart freight matching for every shipper, driver, and admin team.
            </h1>
            <p className="hero-subtitle animate-fade-in-up delay-2">
              Post loads, match trucks, and keep shipments moving with real-time
              dashboards built for logistics teams.
            </p>
            <div className="hero-actions animate-fade-in-up delay-3">
              <Link to="/register" className="btn btn-primary btn-glow">
                <span>Get Started</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link to="/login" className="btn btn-glass">
                Sign In
              </Link>
            </div>
          </div>
          <div className="hero-grid">
            <div className="card hero-card feature-card animate-fade-in-up delay-2">
              <div className="feature-icon icon-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <h3 className="section-title">Live Load Matching</h3>
              <p className="text-muted">
                Instantly pair posted loads with available trucks and dispatch
                within minutes.
              </p>
            </div>
            <div className="card hero-card feature-card animate-fade-in-up delay-3">
              <div className="feature-icon icon-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 className="section-title">Role-Based Dashboards</h3>
              <p className="text-muted">
                Tailored experiences for customers, drivers, admins, and super
                admins.
              </p>
            </div>
            <div className="card hero-card feature-card animate-fade-in-up delay-4">
              <div className="feature-icon icon-teal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <h3 className="section-title">Operational Visibility</h3>
              <p className="text-muted">
                Track bookings, payments, and system activity with clear, clean
                reporting.
              </p>
            </div>
          </div>
        </section>

        <section className="card-grid cols-2">
          <div className="card info-card info-card-shipper animate-fade-in-up delay-5">
            <div className="info-card-accent"></div>
            <h3 className="section-title">For Shippers</h3>
            <p className="text-muted">
              Create loads, receive matches, and monitor delivery milestones in
              one place.
            </p>
          </div>
          <div className="card info-card info-card-driver animate-fade-in-up delay-6">
            <div className="info-card-accent"></div>
            <h3 className="section-title">For Drivers</h3>
            <p className="text-muted">
              Post truck availability, manage assignments, and keep your fleet
              utilized.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
