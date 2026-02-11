import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../api/axios";
import { getApiBaseUrl } from "../api/baseUrl";
import { safeStorage } from "../utils/storage";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () =>
    Promise.allSettled([
      api.get("/booking/driver/bookings"),
      api.get("/truck/my-trucks"),
    ])
      .then(([bookingsRes, trucksRes]) => {
        if (bookingsRes.status === "fulfilled") {
          setBookings(bookingsRes.value.data);
        } else {
          console.error("Bookings fetch error:", bookingsRes.reason);
        }
        if (trucksRes.status === "fulfilled") {
          setTrucks(trucksRes.value.data);
        } else {
          console.error("Trucks fetch error:", trucksRes.reason);
        }
      })
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

  const API_BASE = getApiBaseUrl();

  const downloadBilty = (id) =>
    window.open(
      `${API_BASE}/booking/${id}/bilty?token=${safeStorage.get("accessToken")}`,
      "_blank"
    );

  const downloadInvoice = (id) =>
    window.open(
      `${API_BASE}/booking/${id}/invoice?token=${safeStorage.get("accessToken")}`,
      "_blank"
    );

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
          <button className="btn btn-primary" onClick={() => navigate('/post-truck')}>
            Post Truck Availability
          </button>
        </div>

        <section className="stack">
          <h3 className="section-title">Your Posted Trucks</h3>
          {loading ? (
            <p className="text-muted">Loading trucks...</p>
          ) : trucks.length === 0 ? (
            <div className="card">
              <p style={{ margin: 0, fontWeight: 600 }}>No trucks posted</p>
              <p className="text-muted" style={{ margin: "6px 0 0" }}>
                Post a truck to get assignments.
              </p>
            </div>
          ) : (
            trucks.map((t) => (
              <div key={t._id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px" }}>{t.vehicleNumber}</h4>
                    <p className="text-muted" style={{ margin: 0 }}>
                      {t.vehicleType} • {t.currentLocation}
                    </p>
                    <p className="text-muted" style={{ fontSize: "0.9rem", marginTop: 4 }}>
                      Capacity: {t.capacity} Tons
                    </p>
                  </div>
                  <span className={`tag ${t.isAvailable ? "success" : "warning"}`}>
                    {t.isAvailable ? "Available" : "Busy"}
                  </span>
                </div>
              </div>
            ))
          )}
        </section>

        <section className="stack" style={{ marginTop: 32 }}>
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
