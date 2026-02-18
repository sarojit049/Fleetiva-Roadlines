import { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { downloadFile } from "../utils/download";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import WelcomeHeader from "../components/WelcomeHeader";
import StatCard from "../components/StatCard";
import Skeleton from "../components/Skeleton";
import { AppContext } from "../context/AppContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/booking/customer/bookings")
      .then((res) => setBookings(res.data))
      .catch((error) => console.error("Fetch error:", error))
      .finally(() => setLoading(false));
  }, []);

  const downloadBilty = async (id) => {
    try {
      await downloadFile(`/booking/${id}/bilty`, `bilty-${id}.pdf`);
      toast.success("Bilty downloaded successfully");
    } catch {
      toast.error("Failed to download Bilty");
    }
  };

  const downloadInvoice = async (id) => {
    try {
      await downloadFile(`/booking/${id}/invoice`, `invoice-${id}.pdf`);
      toast.success("Invoice downloaded successfully");
    } catch {
      toast.error("Failed to download Invoice");
    }
  };

  const active = bookings.filter((b) => b.status !== "delivered").length;
  const delivered = bookings.filter((b) => b.status === "delivered").length;
  const inTransit = bookings.filter((b) => b.status === "in-transit").length;

  return (
    <DashboardLayout>
      <Helmet>
        <title>Dashboard - Fleetiva Roadlines</title>
        <meta name="description" content="Track your active shipments and post new loads." />
      </Helmet>

      <WelcomeHeader
        name={user?.name}
        subtitle="Track your shipments and manage your loads from here."
      >
        <button className="btn btn-primary" onClick={() => navigate("/post-load")}>
          + Post New Load
        </button>
      </WelcomeHeader>

      {/* Stats */}
      <div className="stat-grid">
        <StatCard icon="📦" label="Total Bookings" value={bookings.length} accent="#6366f1" />
        <StatCard icon="🚚" label="In Transit" value={inTransit} accent="#3b82f6" />
        <StatCard icon="✅" label="Delivered" value={delivered} accent="#22c55e" />
        <StatCard icon="⏳" label="Active" value={active} accent="#f59e0b" />
      </div>

      {/* Bookings Section */}
      <div className="dash-section" style={{ marginTop: 20 }}>
        <div className="dash-section-header">
          <h3 className="dash-section-title">Your Bookings</h3>
        </div>

        {loading ? (
          <div className="dash-card-list">
            {[1, 2, 3].map((n) => (
              <div key={n} className="dash-booking-card">
                <Skeleton width="60%" height="22px" />
                <Skeleton width="80px" height="28px" borderRadius="999px" />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="dash-empty">
            <span className="dash-empty-icon">📦</span>
            <p className="dash-empty-title">No bookings yet</p>
            <p className="dash-empty-desc">Post your first load to start receiving matches.</p>
            <button className="btn btn-primary" onClick={() => navigate("/post-load")}>
              Post a Load
            </button>
          </div>
        ) : (
          <div className="dash-card-list">
            {bookings.map((b) => (
              <div key={b._id} className="dash-booking-card">
                <div>
                  <div className="dash-booking-route">
                    <span>{b.from}</span>
                    <span className="dash-route-arrow">→</span>
                    <span>{b.to}</span>
                  </div>
                  <span className="dash-booking-info">
                    {b.load?.material || "Load"} • {new Date(b.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="dash-booking-meta">
                  <span className={`tag ${b.status === "delivered" ? "success"
                    : b.status === "in-transit" ? "info"
                      : "warning"
                    }`}>
                    {b.status}
                  </span>
                  <button className="btn btn-secondary btn-sm" onClick={() => downloadBilty(b._id)}>
                    Bilty
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => downloadInvoice(b._id)}>
                    Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
