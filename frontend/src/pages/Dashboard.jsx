import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getApiBaseUrl } from "../api/baseUrl";
import { safeStorage } from "../utils/storage";

export default function Dashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/booking/customer/bookings"),
      api.get("/load/my-loads"),
    ])
      .then(([bookingsRes, loadsRes]) => {
        setBookings(bookingsRes.data);
        setLoads(loadsRes.data);
      })
      .catch((error) => console.error("Fetch error:", error))
      .finally(() => setLoading(false));
  }, []);

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
        <title>Dashboard - Fleetiva Roadlines</title>
        <meta name="description" content="Manage your shipments, track loads, and book trucks." />
      </Helmet>
      <div className="page-content">
        <div className="page-header">
          <div>
            <h2 className="page-title">Customer Dashboard</h2>
            <p className="page-subtitle">
              Track your active shipments and post new loads in seconds.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/post-load")}>
            Post New Load
          </button>
        </div>

        <section className="stack">
          <h3 className="section-title">Your Posted Loads</h3>
          {loading ? (
            <p className="text-muted">Loading loads...</p>
          ) : loads.length === 0 ? (
            <div className="card">
              <p style={{ margin: 0, fontWeight: 600 }}>No posted loads</p>
              <p className="text-muted" style={{ margin: "6px 0 0" }}>
                Post a load to find trucks.
              </p>
            </div>
          ) : (
            loads.map((l) => (
              <div key={l._id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px" }}>{l.material}</h4>
                    <p className="text-muted" style={{ margin: 0 }}>
                      {l.from} → {l.to}
                    </p>
                    <p className="text-muted" style={{ fontSize: "0.9rem", marginTop: 4 }}>
                      Capacity: {l.requiredCapacity} Tons
                    </p>
                  </div>
                  <span
                    className={`tag ${l.status === "delivered"
                      ? "success"
                      : l.status === "matched"
                        ? "info"
                        : "warning"
                      }`}
                  >
                    {l.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </section>

        <section className="stack" style={{ marginTop: 32 }}>
          <h3 className="section-title">Your Bookings</h3>
          {loading ? (
            <p className="text-muted">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="card">
              <p style={{ margin: 0, fontWeight: 600 }}>No bookings yet</p>
              <p className="text-muted" style={{ margin: "6px 0 0" }}>
                Post your first load to start receiving matches.
              </p>
            </div>
          ) : (
            bookings.map((b) => (
              <div key={b._id} className="card">
                <p style={{ margin: 0, fontWeight: 600 }}>
                  {b.load?.material || "Load"}
                </p>
                <p className="text-muted" style={{ margin: "6px 0" }}>
                  {b.from} → {b.to}
                </p>
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
                <div className="toolbar" style={{ marginTop: 12 }}>
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
          )}
        </section>
      </div>
    </div>
  );
}
