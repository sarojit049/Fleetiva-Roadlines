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
    // 1. Logic (from feature): Use Promise.allSettled to fetch both bookings AND loads safely
    Promise.allSettled([
      api.get("/booking/customer/bookings"),
      api.get("/load/my-loads"),
    ])
      .then(([bookingsRes, loadsRes]) => {
        if (bookingsRes.status === "fulfilled") {
          setBookings(bookingsRes.value.data);
        } else {
          console.error("Bookings fetch error:", bookingsRes.reason);
        }
        if (loadsRes.status === "fulfilled") {
          setLoads(loadsRes.value.data);
        } else {
          console.error("Loads fetch error:", loadsRes.reason);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const API_BASE = getApiBaseUrl();

  const downloadBilty = (id) =>
    window.open(
      `${API_BASE}/booking/${id}/bilty?token=${safeStorage.get("accessToken")}`,
      "_blank",
    );

  const downloadInvoice = (id) =>
    window.open(
      `${API_BASE}/booking/${id}/invoice?token=${safeStorage.get("accessToken")}`,
      "_blank",
    );

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

        {/* 2. New Feature (from feature): "Your Posted Loads" Section */}
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

        {/* 3. Logic (from main): Better Styling for Bookings */}
        <section className="stack dashboard-section" style={{ marginTop: 32 }}>
          <h3 className="section-title">Your Bookings</h3>
          {loading ? (
            <div className="dashboard-card dashboard-card-empty">
              <div className="dashboard-loading" aria-hidden="true" />
              <p className="dashboard-empty-title">Loading bookings…</p>
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
                    className={`tag ${
                      b.status === "delivered"
                        ? "success"
                        : b.status === "in-transit"
                          ? "info"
                          : "warning"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}