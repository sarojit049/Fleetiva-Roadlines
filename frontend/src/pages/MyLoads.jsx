import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const statusConfig = {
  pending: { label: "Pending", class: "myloads-status-pending" },
  matched: { label: "Matched", class: "myloads-status-matched" },
  delivered: { label: "Delivered", class: "myloads-status-delivered" },
};

export default function MyLoads() {
  const navigate = useNavigate();
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/customer/loads")
      .then((res) => setLoads(Array.isArray(res.data) ? res.data : []))
      .catch(() => setLoads([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="myloads-page">
        <div className="myloads-content">
          <h1 className="myloads-title">My Loads</h1>
          <div className="myloads-loading-wrap">
            <div className="myloads-loading" aria-hidden="true" />
            <p className="myloads-loading-text">Loading your loads…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="myloads-page">
      <div className="myloads-content">
        <div className="myloads-header">
          <div className="myloads-header-text">
            <h1 className="myloads-title">My Loads</h1>
            <p className="myloads-subtitle">
              All loads you’ve posted for shipment. View material, quantity, places & status.
            </p>
          </div>
          <button
            className="btn btn-primary myloads-cta"
            onClick={() => navigate("/post-load")}
          >
            Post New Load
          </button>
        </div>

        {loads.length === 0 ? (
          <div className="myloads-empty">
            <span className="myloads-empty-icon" aria-hidden="true">
              📦
            </span>
            <p className="myloads-empty-title">No loads yet</p>
            <p className="myloads-empty-desc">
              Post your first load with material, quantity, and route to find matching trucks.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/post-load")}
            >
              Post a load
            </button>
          </div>
        ) : (
          <section className="myloads-section">
            <h2 className="myloads-section-title">
              Loads for shipment ({loads.length})
            </h2>
            <div className="myloads-list">
              {loads.map((load) => {
                const status = statusConfig[load.status] || statusConfig.pending;
                return (
                  <article
                    key={load._id}
                    className="myloads-card"
                  >
                    <div className="myloads-card-header">
                      <span className="myloads-card-id">
                        Load #{load._id?.toString().slice(-6).toUpperCase() || "—"}
                      </span>
                      <span className={`myloads-status ${status.class}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="myloads-card-body">
                      <div className="myloads-detail-row">
                        <span className="myloads-detail-label">Material</span>
                        <span className="myloads-detail-value">
                          {load.material || "—"}
                        </span>
                      </div>
                      <div className="myloads-detail-row">
                        <span className="myloads-detail-label">Quantity (capacity)</span>
                        <span className="myloads-detail-value">
                          {typeof load.requiredCapacity === "number"
                            ? `${load.requiredCapacity} ton${load.requiredCapacity !== 1 ? "s" : ""}`
                            : "—"}
                        </span>
                      </div>
                      <div className="myloads-route">
                        <span className="myloads-route-from">{load.from || "—"}</span>
                        <span className="myloads-route-arrow" aria-hidden="true">→</span>
                        <span className="myloads-route-to">{load.to || "—"}</span>
                      </div>
                      <div className="myloads-detail-row myloads-detail-meta">
                        <span className="myloads-detail-label">Posted</span>
                        <span className="myloads-detail-value">
                          {formatDate(load.createdAt)}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
