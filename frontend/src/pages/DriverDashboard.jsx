import { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { downloadFile } from "../utils/download";
import DashboardLayout from "../components/DashboardLayout";
import WelcomeHeader from "../components/WelcomeHeader";
import StatCard from "../components/StatCard";
import Skeleton from "../components/Skeleton";
import { AppContext } from "../context/AppContext";

export default function DriverDashboard() {
  const { user } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () =>
    api
      .get("/booking/driver/bookings")
      .then((res) => setBookings(res.data))
      .catch((error) => console.error("Fetch error:", error))
      .finally(() => setLoading(false));

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setLoading(true);
      await api.patch(`/booking/${id}/status`, { status });
      toast.success(`Status updated to ${status}`);
      fetchBookings();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

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

  const active = bookings.filter((b) => b.status === "assigned").length;
  const inTransit = bookings.filter((b) => b.status === "in-transit").length;
  const delivered = bookings.filter((b) => b.status === "delivered").length;

  return (
    <DashboardLayout>
      <Helmet>
        <title>Driver Dashboard - Fleetiva Roadlines</title>
        <meta name="description" content="View assigned trips and update delivery status." />
      </Helmet>

      <WelcomeHeader
        name={user?.name}
        subtitle="Manage your trips and update delivery statuses."
      />

      {/* Stats */}
      <div className="stat-grid">
        <StatCard icon="📋" label="Assigned" value={active} accent="#f59e0b" />
        <StatCard icon="🚚" label="In Transit" value={inTransit} accent="#3b82f6" />
        <StatCard icon="✅" label="Delivered" value={delivered} accent="#22c55e" />
        <StatCard icon="📊" label="Total Trips" value={bookings.length} accent="#6366f1" />
      </div>

      {/* Trip List */}
      <div className="dash-section" style={{ marginTop: 20 }}>
        <div className="dash-section-header">
          <h3 className="dash-section-title">Your Trips</h3>
        </div>

        {loading ? (
          <div className="dash-card-list">
            {[1, 2, 3].map((n) => (
              <div key={n} className="dash-booking-card">
                <Skeleton width="50%" height="22px" />
                <div className="toolbar">
                  <Skeleton width="100px" height="34px" borderRadius="10px" />
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length > 0 ? (
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
                    Status: {b.status} • {new Date(b.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="dash-booking-meta">
                  <span className={`tag ${b.status === "delivered" ? "success"
                      : b.status === "in-transit" ? "info"
                        : "warning"
                    }`}>
                    {b.status}
                  </span>
                  {b.status === "assigned" && (
                    <button className="btn btn-primary btn-sm" onClick={() => updateStatus(b._id, "in-transit")}>
                      Start Trip
                    </button>
                  )}
                  {b.status === "in-transit" && (
                    <button className="btn btn-success btn-sm" onClick={() => updateStatus(b._id, "delivered")}>
                      Mark Delivered
                    </button>
                  )}
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
        ) : (
          <div className="dash-empty">
            <span className="dash-empty-icon">🚛</span>
            <p className="dash-empty-title">No active trips</p>
            <p className="dash-empty-desc">Check back soon for new assignments.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
