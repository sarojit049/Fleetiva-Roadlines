import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { downloadFile } from "../utils/download";
import toast from "react-hot-toast";
import Skeleton from "../components/Skeleton";

export default function Dashboard() {
  const navigate = useNavigate();
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

  return (
    <div className="page dashboard-page">
      <div className="page-content">
        <div className="page-header dashboard-header">
          <div className="dashboard-header-text">
            <h2 className="page-title">Customer Dashboard</h2>
            <p className="page-subtitle">
              Track your active shipments and post new loads in seconds.
            </p>
          </div>
          <button
            className="btn btn-primary dashboard-cta"
            onClick={() => navigate("/post-load")}
          >
            Post New Load
          </button>
        </div>

        <section className="stack dashboard-section">
          <h3 className="section-title">Your Bookings</h3>
          {loading ? (
            <div className="dashboard-booking-list">
              {[1, 2, 3].map((n) => (
                <div key={n} className="dashboard-card" style={{ padding: "20px" }}>
                  <Skeleton width="60%" height="24px" />
                  <div style={{ marginTop: "8px" }}>
                    <Skeleton width="40%" height="16px" />
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="dashboard-card dashboard-card-empty">
              <span className="dashboard-empty-icon" aria-hidden="true">
                📦
              </span>
              <p className="dashboard-empty-title">No bookings yet</p>
              <p className="dashboard-empty-desc">
                Post your first load to start receiving matches.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/post-load")}
              >
                Post a load
              </button>
            </div>
          ) : (
            <div className="dashboard-booking-list">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="dashboard-card dashboard-booking-card"
                >
                  <div className="dashboard-booking-main">
                    <p className="dashboard-booking-title">
                      {b.load?.material || "Load"}
                    </p>
                    <p className="dashboard-booking-route text-muted">
                      {b.from} → {b.to}
                    </p>
                  </div>
                  <span
                    className={`tag ${b.status === "delivered"
                      ? "success"
                      : b.status === "in-transit"
                        ? "info"
                        : "warning"
                      }`}
                  >
                    {b.status}
                  </span>
                  <div className="toolbar" style={{ marginTop: 16 }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => downloadBilty(b._id)}
                    >
                      Download Bilty
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => downloadInvoice(b._id)}
                    >
                      Download Invoice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
