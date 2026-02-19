import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const GhostIcon = () => (
  <svg
    viewBox="0 0 120 120"
    className="notfound-ghost"
    role="img"
    aria-label="Ghost icon"
  >
    <path
      d="M60 10c-24.3 0-44 19.7-44 44v42c0 5.2 6 8.1 10 4.9l8-6.4 8 6.4c2.4 1.9 5.7 1.9 8 0l10-8 10 8c2.3 1.9 5.6 1.9 8 0l8-6.4 8 6.4c4 3.2 10-.3 10-5V54c0-24.3-19.7-44-44-44Z"
      fill="url(#ghostFill)"
    />
    <circle cx="46" cy="54" r="5" fill="#0f172a" />
    <circle cx="74" cy="54" r="5" fill="#0f172a" />
    <path
      d="M44 74c4.3 5.8 10 8.7 16 8.7s11.7-2.9 16-8.7"
      stroke="#334155"
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
    />
    <defs>
      <linearGradient id="ghostFill" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
    </defs>
  </svg>
);

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <Helmet>
        <title>404 — Page Not Found | Fleetiva Roadlines</title>
        <meta
          name="description"
          content="The page you are looking for does not exist on Fleetiva Roadlines."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="notfound-main">
        <div className="notfound-bg" aria-hidden>
          <div className="notfound-orb orb-left" />
          <div className="notfound-orb orb-right" />
        </div>

        <section className="notfound-content">
          <div className="notfound-ghost-wrap">
            <GhostIcon />
            <div className="notfound-shadow" />
          </div>

          <p className="notfound-badge">Error</p>
          <h1 className="notfound-code">404</h1>
          <h2 className="notfound-title">Page Not Found</h2>
          <p className="notfound-text">
            Oops! You have reached an unknown route. The page may have been
            removed, renamed, or never existed.
          </p>

          <div className="notfound-actions">
            <button
              type="button"
              className="btn btn-secondary notfound-btn"
              onClick={() => navigate(-1)}
            >
              ← Go Back
            </button>
            <button
              type="button"
              className="btn btn-cta notfound-btn"
              onClick={() => navigate("/")}
            >
              🏠 Return Home
            </button>
          </div>
        </section>
      </main>
        </div>
  );
}
