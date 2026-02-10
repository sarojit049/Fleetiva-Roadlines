import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("request");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (success && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (success && countdown === 0) {
      navigate("/login");
    }
    return () => clearInterval(timer);
  }, [success, countdown, navigate]);

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { phone });
      setStep("reset");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { phone, otp, newPassword });
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 className="page-title">Reset Password</h2>
          <p className="page-subtitle">Recover access to your account.</p>
        </div>

        {success ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
            <h2 className="page-title">Password Reset!</h2>
            <p className="page-subtitle">
              Redirecting to login in <strong>{countdown}</strong> seconds...
            </p>
          </div>
        ) : step === "request" ? (
          <form onSubmit={handleRequest} className="form">
            <label className="label">Phone Number</label>
            <input
              placeholder="Enter registered phone"
              type="tel"
              required
              className="input"
              onChange={(e) => setPhone(e.target.value)}
            />
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? <div className="spinner"></div> : "Send Reset OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="form">
            <label className="label">OTP sent to {phone}</label>
            <input
              placeholder="6-digit code"
              required
              className="input"
              onChange={(e) => setOtp(e.target.value)}
            />
            <label className="label">New Password</label>
            <input
              placeholder="Enter new password"
              type="password"
              required
              className="input"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? <div className="spinner"></div> : "Update Password"}
            </button>
            <button
              type="button"
              onClick={() => setStep("request")}
              className="btn btn-secondary"
            >
              Back
            </button>
          </form>
        )}

        <p className="text-muted" style={{ textAlign: "center", marginTop: 20 }}>
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
