import { useEffect, useState, useMemo, useContext } from "react";
import { Helmet } from "react-helmet-async";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import WelcomeHeader from "../components/WelcomeHeader";
import StatCard from "../components/StatCard";
import Skeleton from "../components/Skeleton";
import { AppContext } from "../context/AppContext";

/**
 * SuperAdminDashboard Component
 * Provides a high-level overview of all tenants, including search,
 * status filtering, and management capabilities.
 * @returns {JSX.Element}
 */
export default function SuperAdminDashboard() {
  const { user } = useContext(AppContext);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTenants();
  }, []);

  /**
   * Fetches the list of all tenants from the backend.
   * Updates the tenants state and handles loading/error states.
   * @async
   */
  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tenants");
      setTenants(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Memoized list of tenants filtered by searchQuery and statusFilter.
   * @type {Array<Object>}
   */
  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const matchesSearch = tenant.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? tenant.isActive : !tenant.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [tenants, searchQuery, statusFilter]);

  /**
   * Toggles the active status of a specific tenant.
   * @async
   * @param {string} id - The unique identifier of the tenant.
   * @param {boolean} currentStatus - The current active status of the tenant.
   */
  const toggleTenantStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/tenants/${id}/status`, { isActive: !currentStatus });
      toast.success("Status updated successfully");
      fetchTenants();
    } catch (error) {
      console.error("Error updating tenant status:", error);
      toast.error("Error updating tenant status");
    }
  };

  const activeTenants = tenants.filter((t) => t.isActive).length;
  const inactiveTenants = tenants.filter((t) => !t.isActive).length;

  return (
    <DashboardLayout>
      <Helmet>
        <title>Super Admin Dashboard - Fleetiva Roadlines</title>
        <meta
          name="description"
          content="Manage tenants, subscriptions, and system-wide settings."
        />
      </Helmet>

      <WelcomeHeader
        name={user?.name}
        subtitle="Oversee tenant subscriptions and platform access at a glance."
      />

      {/* Stats */}
      <div className="stat-grid">
        <StatCard
          icon="🏢"
          label="Total Companies"
          value={tenants.length}
          accent="#6366f1"
        />
        <StatCard
          icon="✅"
          label="Active"
          value={activeTenants}
          accent="#22c55e"
        />
        <StatCard
          icon="⏸️"
          label="Inactive"
          value={inactiveTenants}
          accent="#ef4444"
        />
      </div>

      {/* Search and Filter Bar */}
      <div className="dash-section" style={{ marginTop: "24px" }}>
        <div className="flex gap-4 items-center" style={{ marginBottom: "16px" }}>
          <div style={{ flex: 1 }}>
            <h3 className="dash-section-title" style={{ margin: 0 }}>Registered Companies</h3>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search companies..."
              className="form-control"
              style={{ maxWidth: "300px" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="form-control"
              style={{ maxWidth: "150px" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="card-grid cols-2">
            {[1, 2].map((n) => (
              <div
                key={n}
                style={{ padding: 20, background: "#f8fafc", borderRadius: 16 }}
              >
                <Skeleton width="100%" height="100px" borderRadius="16px" />
              </div>
            ))}
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className="dash-empty">
            <span className="dash-empty-icon">🏢</span>
            <p className="dash-empty-title">No companies found</p>
            <p className="dash-empty-desc">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="card-grid cols-2">
            {filteredTenants.map((tenant) => (
              <div
                key={tenant._id}
                className="dash-booking-card"
                style={{ flexDirection: "column", alignItems: "stretch" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: 16,
                        color: "#0f172a",
                      }}
                    >
                      {tenant.name}
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
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
                  className={`btn btn-sm ${tenant.isActive ? "btn-danger" : "btn-success"
                    }`}
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
