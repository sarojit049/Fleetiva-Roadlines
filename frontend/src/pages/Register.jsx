import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContextStore";
import Toast from "../components/Toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Register() {
  const navigate = useNavigate();
  const { loading, setLoading } = useContext(AppContext);
  const authUnavailable = !auth;

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (authUnavailable) {
      setError("Authentication is not configured. Please set Firebase env values.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h2 className="page-title" style={{ textAlign: "center" }}>
          Create account
        </h2>
        <p className="page-subtitle" style={{ textAlign: "center" }}>
          Join Fleetiva Roadlines to manage shipments effortlessly.
        </p>

        {error && <Toast message={error} />}
        {authUnavailable && (
          <p className="text-muted" style={{ textAlign: "center", marginTop: 12 }}>
            Firebase authentication is not configured for this environment.
          </p>
        )}

        <form onSubmit={handleSubmit} className="form" style={{ marginTop: 24 }}>
          <input
            placeholder="Company Name"
            className="input"
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
          />

          <input
            placeholder="Full Name"
            required
            className="input"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            required
            className="input"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            placeholder="Phone Number"
            required
            className="input"
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="input"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <select
            value={formData.role}
            className="select"
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="customer">Customer</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading || authUnavailable}
            className="btn btn-primary"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-muted" style={{ textAlign: "center", marginTop: 20 }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
