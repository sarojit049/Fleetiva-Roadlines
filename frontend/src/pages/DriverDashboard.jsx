import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { downloadFile } from "../utils/download";
import Skeleton from "../components/Skeleton";

export default function DriverDashboard() {
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

  return (
    <div className="page">
      <Helmet>
        <title>Driver Dashboard - Fleetiva Roadlines</title>
        <meta name="description" content="View assigned trips and update delivery status." />
      </Helmet>
      <div className="page-content">
        <div className="page-header">
          <div>
            <h2 className="page-title">Driver Dashboard</h2>
            <p className="page-subtitle">
              Manage assigned trips and update delivery statuses quickly.
            </p>
          </div>
        </div>
        <section className="stack">
          {loading ? (
            [1, 2, 3].map((n) => (
              <div key={n} className="card">
                <Skeleton width="50%" height="24px" />
                <div style={{ marginTop: "12px" }}>
                  <Skeleton width="30%" height="16px" />
                </div>
                <div className="toolbar" style={{ marginTop: "16px" }}>
                  <Skeleton width="100px" height="36px" borderRadius="10px" />
                  <Skeleton width="100px" height="36px" borderRadius="10px" />
                </div>
              </div>
            ))
          ) : bookings.length > 0 ? (
            bookings.map((b) => (
              <div key={b._id} className="card">
                <p style={{ margin: 0, fontWeight: 600 }}>
                  {b.from} → {b.to}
                </p>
                <p className="text-muted" style={{ margin: "6px 0 12px" }}>
                  Status: {b.status}
                </p>
                <div className="toolbar">
                  {b.status === "assigned" && (
                    <button
                      className="btn btn-primary"
                      onClick={() => updateStatus(b._id, "in-transit")}
                    >
                      Start Trip
                    </button>
                  )}
                  {b.status === "in-transit" && (
                    <button
                      className="btn btn-success"
                      onClick={() => updateStatus(b._id, "delivered")}
                    >
                      Mark Delivered
                    </button>
                  )}
                  <button
                    className="btn btn-secondary"
                    onClick={() => downloadBilty(b._id)}
                  >
                    Bilty PDF
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => downloadInvoice(b._id)}
                  >
                    Invoice PDF
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="card">
              <p style={{ margin: 0, fontWeight: 600 }}>No active bookings found.</p>
              <p className="text-muted" style={{ margin: "6px 0 0" }}>
                Check back soon for new assignments.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
