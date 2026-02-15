import { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { AppContext } from "../context/appContextStore";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { safeStorage } from "../utils/storage";
import { auth, googleProvider, hasFirebaseConfig } from "../firebase";

export default function Login() {
  const navigate = useNavigate();
  const { loading, setLoading, setUser } = useContext(AppContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const exchangeFirebaseToken = async (idToken) => {
    const response = await api.post("/auth/firebase/login", { idToken });
    safeStorage.set("accessToken", response.data.accessToken);
    safeStorage.set("role", response.data.user.role);
    setUser(response.data.user);
    return response.data.user.role;
  };

  const formatFirebaseError = (err) => {
    if (err?.code === "auth/unauthorized-domain") {
      return "Firebase blocked this domain. Add your Vercel/production URL to Firebase Auth → Authorized domains.";
    }
    if (err?.code === "auth/popup-closed-by-user") {
      return "Login popup was closed. Please try again.";
    }
    return err?.message || "Login failed";
  };

  const validateLoginForm = ({ email, password }) => {
    if (!email || !password) {
      return "Email and password are required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validationError = validateLoginForm(formData);
    if (validationError) {
      toast.error(validationError);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      let role;
      if (hasFirebaseConfig) {
        if (!auth) {
          throw new Error("Firebase auth is unavailable.");
        }
        const credential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password,
        );
        const idToken = await credential.user.getIdToken();
        role = await exchangeFirebaseToken(idToken);
      } else {
        const response = await api.post("/auth/login", formData);
        safeStorage.set("accessToken", response.data.accessToken);
        safeStorage.set("role", response.data.user.role);
        setUser(response.data.user);
        role = response.data.user.role;
      }

      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "driver") navigate("/driver", { replace: true });
      else navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.response) {
        toast.error(
          err.response.data?.message ||
          "Login service is currently unavailable. Please try again later.",
        );
      } else {
        toast.error(formatFirebaseError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    if (!hasFirebaseConfig || !auth || !googleProvider) {
      toast.error("Google login is not configured in this environment.");
      return;
    }

    setLoading(true);

    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const idToken = await credential.user.getIdToken();
      const role = await exchangeFirebaseToken(idToken);
      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "driver") navigate("/driver", { replace: true });
      else navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || formatFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <Helmet>
        <title>Login - Fleetiva Roadlines</title>
        <meta
          name="description"
          content="Login to your Fleetiva account to manage shipments and fleets."
        />
      </Helmet>
      <div className="auth-card">
        {/* Animated Truck Scene */}
        <div className="truck-scene">
          {/* Road */}
          <div className="truck-road">
            <div className="road-line"></div>
          </div>

          {/* Truck */}
          <div className="truck-wrapper">
            <svg className="truck-svg" viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Cargo body */}
              <rect x="2" y="8" width="60" height="28" rx="3" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
              <rect x="6" y="12" width="52" height="20" rx="2" fill="#fbbf24" opacity="0.6" />
              <text x="32" y="26" textAnchor="middle" fill="#92400e" fontSize="7" fontWeight="700" fontFamily="sans-serif">FLEETIVA</text>
              {/* Cabin */}
              <path d="M62 14 L62 36 L90 36 L90 22 L78 14 Z" fill="#1e3a5f" stroke="#0f172a" strokeWidth="1.5" />
              {/* Window */}
              <path d="M65 17 L75 17 L82 23 L65 23 Z" fill="#7dd3fc" opacity="0.9" />
              <path d="M65 17 L75 17 L82 23 L65 23 Z" fill="url(#windowShine)" opacity="0.4" />
              {/* Bumper */}
              <rect x="88" y="28" width="8" height="8" rx="2" fill="#94a3b8" />
              {/* Headlight */}
              <rect x="90" y="24" width="4" height="4" rx="1" fill="#fde68a" />
              <circle cx="92" cy="26" r="3" fill="#fef3c7" opacity="0.4" />
              {/* Exhaust pipe */}
              <rect x="0" y="30" width="4" height="3" rx="1" fill="#64748b" />
              {/* Wheels */}
              <circle cx="22" cy="38" r="7" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
              <circle cx="22" cy="38" r="3" fill="#64748b" className="truck-wheel" />
              <circle cx="80" cy="38" r="7" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
              <circle cx="80" cy="38" r="3" fill="#64748b" className="truck-wheel" />
              {/* Wheel spokes */}
              <g className="truck-wheel-spin">
                <line x1="22" y1="32" x2="22" y2="44" stroke="#475569" strokeWidth="1" />
                <line x1="16" y1="38" x2="28" y2="38" stroke="#475569" strokeWidth="1" />
              </g>
              <g className="truck-wheel-spin" style={{ transformOrigin: '80px 38px' }}>
                <line x1="80" y1="32" x2="80" y2="44" stroke="#475569" strokeWidth="1" />
                <line x1="74" y1="38" x2="86" y2="38" stroke="#475569" strokeWidth="1" />
              </g>
              <defs>
                <linearGradient id="windowShine" x1="65" y1="17" x2="82" y2="23">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Exhaust puffs */}
            <div className="exhaust-puff puff-1"></div>
            <div className="exhaust-puff puff-2"></div>
            <div className="exhaust-puff puff-3"></div>
          </div>

          {/* Dust particles behind truck */}
          <div className="dust dust-1"></div>
          <div className="dust dust-2"></div>
          <div className="dust dust-3"></div>
        </div>

        <h2 className="page-title" style={{ textAlign: "center" }}>
          Welcome back
        </h2>
        <p className="page-subtitle" style={{ textAlign: "center" }}>
          Sign in to manage your loads and bookings.
        </p>

        <form onSubmit={handleLogin} className="form" style={{ marginTop: 24 }}>
          <input
            type="email"
            placeholder="Email"
            className="input"
            aria-label="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            aria-label="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Signing in..." : "Login"}
          </button>
          {hasFirebaseConfig && (
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="btn btn-secondary"
            >
              Continue with Google
            </button>
          )}
        </form>

        <p
          className="text-muted"
          style={{ textAlign: "center", marginTop: 20 }}
        >
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
        <p className="text-muted" style={{ textAlign: "center", marginTop: 8 }}>
          <Link to="/forgot-password">Forgot password?</Link>
        </p>

        <div className="card" style={{ marginTop: 24 }}>
          <h3 className="section-title" style={{ marginBottom: 8 }}>
            Need help logging in?
          </h3>
          <p className="text-muted" style={{ marginBottom: 12 }}>
            Contact the Fleetiva support team and we will help you regain access.
          </p>
          <div className="toolbar" style={{ flexWrap: "wrap", gap: 8 }}>
            <span className="tag info">Phone: +91 98765 43210</span>
            <span className="tag">Email: support@fleetiva.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
