import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const formatMoney = (n) =>
  typeof n === "number" && !Number.isNaN(n)
    ? `₹${Math.round(n).toLocaleString("en-IN")}`
    : "₹0";

export default function Stats() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/customer/bookings")
      .then((res) => setBookings(Array.isArray(res.data) ? res.data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const {
    totalEarnings,
    pendingAmount,
    paidCount,
    pendingCount,
    pastContracts,
    currentWork,
    futureEstimate,
    thisMonthEarnings,
  } = useMemo(() => {
    const list = Array.isArray(bookings) ? bookings : [];
    const paid = list.filter((b) => b.paymentStatus === "paid");
    const pending = list.filter((b) => b.paymentStatus === "pending");
    const totalEarnings = paid.reduce(
      (s, b) => s + (Number(b.amount) || 0) + (Number(b.gstAmount) || 0),
      0,
    );
    const pendingAmount = pending.reduce(
      (s, b) => s + (Number(b.amount) || 0) + (Number(b.gstAmount) || 0),
      0,
    );
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const thisMonthEarnings = paid
      .filter((b) => {
        const d = b.updatedAt ? new Date(b.updatedAt) : null;
        return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      })
      .reduce(
        (s, b) => s + (Number(b.amount) || 0) + (Number(b.gstAmount) || 0),
        0,
      );
    const pastContracts = list.filter((b) => b.status === "delivered");
    const currentWork = list.filter(
      (b) => b.status === "assigned" || b.status === "in-transit",
    );
    const avgPerDelivery =
      pastContracts.length > 0
        ? pastContracts.reduce(
            (s, b) => s + (Number(b.amount) || 0) + (Number(b.gstAmount) || 0),
            0,
          ) / pastContracts.length
        : 0;
    const futureEstimate =
      currentWork.length > 0
        ? currentWork.reduce(
            (s, b) => s + (Number(b.amount) || 0) + (Number(b.gstAmount) || 0),
            0,
          )
        : avgPerDelivery;

    return {
      totalEarnings,
      pendingAmount,
      paidCount: paid.length,
      pendingCount: pending.length,
      pastContracts,
      currentWork,
      futureEstimate,
      thisMonthEarnings,
    };
  }, [bookings]);

  if (loading) {
    return (
      <div className="stats-page">
        <div className="stats-content">
          <h1 className="stats-title">My Stats</h1>
          <div className="stats-loading-wrap">
            <div className="stats-loading" aria-hidden="true" />
            <p className="stats-loading-text">Loading your stats…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <div className="stats-content">
        <header className="stats-header">
          <h1 className="stats-title">My Stats</h1>
          <p className="stats-subtitle">
            Earnings, past contracts, current work & future estimates.
          </p>
        </header>

        {/* Earnings overview */}
        <section className="stats-section">
          <h2 className="stats-section-title">Earnings</h2>
          <div className="stats-earnings-grid">
            <div className="stats-earnings-card stats-earnings-total">
              <span className="stats-earnings-icon" aria-hidden="true">
                💰
              </span>
              <div className="stats-earnings-body">
                <span className="stats-earnings-label">Total earned</span>
                <span className="stats-earnings-value">
                  {formatMoney(totalEarnings)}
                </span>
                <span className="stats-earnings-meta">
                  {paidCount} paid deliver{paidCount !== 1 ? "ies" : "y"}
                </span>
              </div>
            </div>
            <div className="stats-earnings-card stats-earnings-month">
              <span className="stats-earnings-icon" aria-hidden="true">
                📅
              </span>
              <div className="stats-earnings-body">
                <span className="stats-earnings-label">This month</span>
                <span className="stats-earnings-value">
                  {formatMoney(thisMonthEarnings)}
                </span>
              </div>
            </div>
            <div className="stats-earnings-card stats-earnings-pending">
              <span className="stats-earnings-icon" aria-hidden="true">
                ⏳
              </span>
              <div className="stats-earnings-body">
                <span className="stats-earnings-label">Pending</span>
                <span className="stats-earnings-value">
                  {formatMoney(pendingAmount)}
                </span>
                <span className="stats-earnings-meta">
                  {pendingCount} booking{pendingCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Past contracts */}
        <section className="stats-section">
          <h2 className="stats-section-title">Past contracts</h2>
          <p className="stats-section-desc">
            Completed deliveries (delivered).
          </p>
          {pastContracts.length === 0 ? (
            <div className="stats-empty-card">
              <span className="stats-empty-icon" aria-hidden="true">
                📋
              </span>
              <p className="stats-empty-title">No past contracts yet</p>
              <p className="stats-empty-desc">
                Completed deliveries will appear here.
              </p>
            </div>
          ) : (
            <div className="stats-contract-list">
              {pastContracts.map((b) => (
                <div
                  key={b._id}
                  className="stats-contract-card stats-contract-past"
                >
                  <div className="stats-contract-main">
                    <p className="stats-contract-title">
                      {b.load?.material || "Load"}
                    </p>
                    <p className="stats-contract-route text-muted">
                      {b.from} → {b.to}
                    </p>
                  </div>
                  <div className="stats-contract-meta">
                    <span className="stats-contract-amount">
                      {formatMoney(
                        (Number(b.amount) || 0) + (Number(b.gstAmount) || 0),
                      )}
                    </span>
                    <span
                      className={`stats-contract-badge ${
                        b.paymentStatus === "paid" ? "paid" : "pending"
                      }`}
                    >
                      {b.paymentStatus === "paid" ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Current work */}
        <section className="stats-section">
          <h2 className="stats-section-title">Current work</h2>
          <p className="stats-section-desc">Assigned & in-transit shipments.</p>
          {currentWork.length === 0 ? (
            <div className="stats-empty-card">
              <span className="stats-empty-icon" aria-hidden="true">
                🚚
              </span>
              <p className="stats-empty-title">No active shipments</p>
              <p className="stats-empty-desc">
                Post a load from the dashboard to get started.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/post-load")}
              >
                Post a load
              </button>
            </div>
          ) : (
            <div className="stats-contract-list">
              {currentWork.map((b) => (
                <div
                  key={b._id}
                  className="stats-contract-card stats-contract-current"
                >
                  <div className="stats-contract-main">
                    <p className="stats-contract-title">
                      {b.load?.material || "Load"}
                    </p>
                    <p className="stats-contract-route text-muted">
                      {b.from} → {b.to}
                    </p>
                  </div>
                  <div className="stats-contract-meta">
                    <span className="stats-contract-amount">
                      {formatMoney(
                        (Number(b.amount) || 0) + (Number(b.gstAmount) || 0),
                      )}
                    </span>
                    <span
                      className={`tag ${
                        b.status === "in-transit" ? "info" : "warning"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Future estimation */}
        <section className="stats-section">
          <h2 className="stats-section-title">Future estimation</h2>
          <p className="stats-section-desc">
            Estimated value from current work & typical next month.
          </p>
          <div className="stats-future-grid">
            <div className="stats-future-card">
              <span className="stats-future-icon" aria-hidden="true">
                📈
              </span>
              <div className="stats-future-body">
                <span className="stats-future-label">
                  From current shipments
                </span>
                <span className="stats-future-value">
                  {formatMoney(futureEstimate)}
                </span>
                <span className="stats-future-meta">
                  {currentWork.length} active booking
                  {currentWork.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <div className="stats-future-card stats-future-note">
              <span className="stats-future-icon" aria-hidden="true">
                🔮
              </span>
              <div className="stats-future-body">
                <span className="stats-future-label">
                  Next month (estimate)
                </span>
                <span className="stats-future-value stats-future-value-muted">
                  Based on your activity
                </span>
                <span className="stats-future-meta">
                  Post more loads to see projections.
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
