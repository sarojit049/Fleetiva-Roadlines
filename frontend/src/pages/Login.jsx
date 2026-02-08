import { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { AppContext } from "../context/appContextStore";
import Toast from "../components/Toast";
import api from "../api/axios";
import { safeStorage } from "../utils/storage";
import { auth, googleProvider, hasFirebaseConfig } from "../firebase";

export default function Login() {
  const navigate = useNavigate();
  const { loading, setLoading, setUser } = useContext(AppContext);

  const [error, setError] = useState("");
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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
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
          formData.password
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
      setError(err.response?.data?.message || formatFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    if (!hasFirebaseConfig || !auth || !googleProvider) {
      setError("Google login is not configured in this environment.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const idToken = await credential.user.getIdToken();
      const role = await exchangeFirebaseToken(idToken);
      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "driver") navigate("/driver", { replace: true });
      else navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || formatFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <Helmet>
        <title>Login - Fleetiva Roadlines</title>
        <meta name="description" content="Login to your Fleetiva account to manage shipments and fleets." />
      </Helmet>
      <div className="auth-card">
        <h2 className="page-title" style={{ textAlign: "center" }}>
          Welcome back
        </h2>
        <p className="page-subtitle" style={{ textAlign: "center" }}>
          Sign in to manage your loads and bookings.
        </p>

        {error && <Toast message={error} />}

        <form onSubmit={handleLogin} className="form" style={{ marginTop: 24 }}>
          <input
            type="email"
            placeholder="Email"
            required
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
            required
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

        <p className="text-muted" style={{ textAlign: "center", marginTop: 20 }}>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
        <p className="text-muted" style={{ textAlign: "center", marginTop: 8 }}>
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
      </div>
    </div>
  );
}
