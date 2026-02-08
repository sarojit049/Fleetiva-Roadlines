import { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { AppContext } from "../context/appContextStore";
import Toast from "../components/Toast";
import api from "../api/axios";
import { safeStorage } from "../utils/storage";
import { auth, hasFirebaseConfig } from "../firebase";

export default function Register() {
  const navigate = useNavigate();
  const { loading, setLoading, setUser } = useContext(AppContext);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });

  const registerWithApi = async () => {
    const response = await api.post("/auth/register", formData);
    safeStorage.set("accessToken", response.data.accessToken);
    safeStorage.set("role", response.data.user.role);
    setUser(response.data.user);
    return response.data.user.role;
  };

  const registerWithFirebase = async () => {
    if (!auth) {
      throw new Error("Firebase auth is unavailable.");
    }
    const credential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    const idToken = await credential.user.getIdToken();
    const response = await api.post("/auth/firebase/register", {
      idToken,
      name: formData.name,
      phone: formData.phone,
      role: formData.role,
      companyName: formData.companyName,
    });
    safeStorage.set("accessToken", response.data.accessToken);
    safeStorage.set("role", response.data.user.role);
    setUser(response.data.user);
    return response.data.user.role;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const role = hasFirebaseConfig
        ? await registerWithFirebase()
        : await registerWithApi();
      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "driver") navigate("/driver", { replace: true });
      else navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <Helmet>
        <title>Register - Fleetiva Roadlines</title>
        <meta name="description" content="Create a Fleetiva account to start shipping or hauling." />
      </Helmet>
      <div className="auth-card">
        <h2 className="page-title" style={{ textAlign: "center" }}>
          Create account
        </h2>
        <p className="page-subtitle" style={{ textAlign: "center" }}>
          Join Fleetiva Roadlines to manage shipments effortlessly.
        </p>

        {error && <Toast message={error} />}

        <form onSubmit={handleSubmit} className="form" style={{ marginTop: 24 }}>
          <input
            placeholder="Company Name"
            className="input"
            aria-label="Company Name"
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
          />

          <input
            placeholder="Full Name"
            required
            className="input"
            aria-label="Full Name"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            required
            className="input"
            aria-label="Email Address"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            placeholder="Phone Number"
            required
            className="input"
            aria-label="Phone Number"
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="input"
            aria-label="Password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <select
            value={formData.role}
            className="select"
            aria-label="Select Role"
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="customer">Customer</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" disabled={loading} className="btn btn-primary">
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
