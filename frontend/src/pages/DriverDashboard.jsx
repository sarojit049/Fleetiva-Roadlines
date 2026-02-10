import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import api from "../api/axios";

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
      fetchBookings();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
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
            <p className="text-muted">Loading bookings...</p>
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
