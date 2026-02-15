import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setStep("reset");
      toast.success("OTP sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter a valid 6-digit OTP.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 className="page-title">Reset Password</h2>
          <p className="page-subtitle">Recover access to your account via Email.</p>
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
            <label className="label">Email Address</label>
            <input
              placeholder="Enter registered email"
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? <div className="spinner"></div> : "Send Reset OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="form">
            <label className="label">OTP sent to {email}</label>
            <input
              placeholder="6-digit code"
              required
              className="input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <label className="label">New Password</label>
            <input
              placeholder="Enter new password"
              type="password"
              required
              className="input"
              value={newPassword}
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
