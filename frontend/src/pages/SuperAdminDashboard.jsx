import { useEffect, useState } from "react";
import api from "../api/axios";

export default function SuperAdminDashboard() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tenants");
      setTenants(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTenantStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/tenants/${id}/status`, { isActive: !currentStatus });
      fetchTenants();
    } catch (error) {
      console.error("Error updating tenant status:", error);
      alert("Error updating tenant status");
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <div className="page-header">
          <div>
            <h2 className="page-title">Company Management</h2>
            <p className="page-subtitle">
              Oversee tenant subscriptions and platform access at a glance.
            </p>
          </div>
        </div>

        <section className="stack">
          <h3 className="section-title">Registered Companies (Tenants)</h3>
          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : (
            <div className="card-grid cols-2">
              {tenants.map((tenant) => (
                <div key={tenant._id} className="card">
                  <div className="page-header">
                    <div>
                      <p style={{ margin: 0, fontWeight: 700 }}>{tenant.name}</p>
                      <p className="text-muted" style={{ margin: "6px 0 0" }}>
                        Plan: {tenant.plan?.toUpperCase()}
                      </p>
                    </div>
                    <span
                      className={`tag ${tenant.isActive ? "success" : "danger"}`}
                    >
                      {tenant.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleTenantStatus(tenant._id, tenant.isActive)}
                    className={`btn ${tenant.isActive ? "btn-danger" : "btn-success"}`}
                    style={{ width: "100%", marginTop: 16 }}
                  >
                    {tenant.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
