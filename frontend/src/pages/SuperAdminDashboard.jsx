import { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import WelcomeHeader from "../components/WelcomeHeader";
import StatCard from "../components/StatCard";
import Skeleton from "../components/Skeleton";
import { AppContext } from "../context/AppContext";

export default function SuperAdminDashboard() {
  const { user } = useContext(AppContext);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTenants(); }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tenants");
      setTenants(res.data);
    } catch (error) { console.error("Fetch error:", error); }
    finally { setLoading(false); }
  };

  const toggleTenantStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/tenants/${id}/status`, { isActive: !currentStatus });
      fetchTenants();
    } catch (error) {
      console.error("Error updating tenant status:", error);
      toast.error("Error updating tenant status");
    }
  };

  const activeTenants = tenants.filter(t => t.isActive).length;
  const inactiveTenants = tenants.filter(t => !t.isActive).length;

  return (
    <DashboardLayout>
      <Helmet>
        <title>Super Admin Dashboard - Fleetiva Roadlines</title>
        <meta name="description" content="Manage tenants, subscriptions, and system-wide settings." />
      </Helmet>

      <WelcomeHeader
        name={user?.name}
        subtitle="Oversee tenant subscriptions and platform access."
      />

      {/* Stats */}
      <div className="stat-grid">
        <StatCard icon="🏢" label="Total Companies" value={tenants.length} accent="#6366f1" />
        <StatCard icon="✅" label="Active" value={activeTenants} accent="#22c55e" />
        <StatCard icon="⏸️" label="Inactive" value={inactiveTenants} accent="#ef4444" />
      </div>

      {/* Tenants */}
      <div className="dash-section" style={{ marginTop: 20 }}>
        <div className="dash-section-header">
          <h3 className="dash-section-title">Registered Companies</h3>
        </div>

        {loading ? (
          <div className="card-grid cols-2">
            {[1, 2].map(n => (
              <div key={n} style={{ padding: 20, background: '#f8fafc', borderRadius: 16 }}>
                <Skeleton width="100%" height="100px" borderRadius="16px" />
              </div>
            ))}
          </div>
        ) : tenants.length === 0 ? (
          <div className="dash-empty">
            <span className="dash-empty-icon">🏢</span>
            <p className="dash-empty-title">No companies registered</p>
            <p className="dash-empty-desc">Companies will appear here once they register.</p>
          </div>
        ) : (
          <div className="card-grid cols-2">
            {tenants.map((tenant) => (
              <div key={tenant._id} className="dash-booking-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#0f172a' }}>
                      {tenant.name}
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                      Plan: {tenant.plan?.toUpperCase()}
                    </p>
                  </div>
                  <span className={`tag ${tenant.isActive ? "success" : "danger"}`}>
                    {tenant.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <button
                  onClick={() => toggleTenantStatus(tenant._id, tenant.isActive)}
                  className={`btn btn-sm ${tenant.isActive ? "btn-danger" : "btn-success"}`}
                  style={{ width: "100%", marginTop: 14 }}
                >
                  {tenant.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
