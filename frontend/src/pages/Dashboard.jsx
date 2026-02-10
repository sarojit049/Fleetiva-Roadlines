import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/booking/customer/bookings").then((res) => setBookings(res.data));
  }, []);

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
          <h3 className="section-title">Your Bookings</h3>
          {bookings.length === 0 ? (
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
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
