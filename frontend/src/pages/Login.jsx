import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { AppContext } from "../context/appContextStore";
import Toast from "../components/Toast";
import { auth, googleProvider } from "../firebase";

export default function Login() {
  const navigate = useNavigate();
  const { loading, setLoading } = useContext(AppContext);
  const authUnavailable = !auth || !googleProvider;

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (authUnavailable) {
      setError("Authentication is not configured. Please set Firebase env values.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    if (authUnavailable) {
      setError("Authentication is not configured. Please set Firebase env values.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Google login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h2 className="page-title" style={{ textAlign: "center" }}>
          Welcome back
        </h2>
        <p className="page-subtitle" style={{ textAlign: "center" }}>
          Sign in to manage your loads and bookings.
        </p>

        {error && <Toast message={error} />}
        {authUnavailable && (
          <p className="text-muted" style={{ textAlign: "center", marginTop: 12 }}>
            Firebase authentication is not configured for this environment.
          </p>
        )}

        <form onSubmit={handleLogin} className="form" style={{ marginTop: 24 }}>
          <input
            type="email"
            placeholder="Email"
            required
            className="input"
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
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <button
            type="submit"
            disabled={loading || authUnavailable}
            className="btn btn-primary"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || authUnavailable}
            className="btn btn-secondary"
          >
            Continue with Google
          </button>
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
