import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../context/AppContext";
import api from "../api/axios";

export default function Profile() {
  const { user } = useContext(AppContext);
  const role = user?.role || localStorage.getItem("role") || "customer";
  const [nameInput, setNameInput] = useState(
    user?.displayName || user?.email?.split("@")[0] || "",
  );
  const [avatarInput, setAvatarInput] = useState(
    localStorage.getItem("avatarUrl") || user?.photoURL || "",
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);

  const stats = [
    { label: "Total Loads Posted", value: "0", icon: "📦" },
    { label: "Active Shipments", value: "0", icon: "🚚" },
    { label: "Completed Deliveries", value: "0", icon: "✅" },
    { label: "Pending Payments", value: "₹0", icon: "💳" },
  ];

  const displayName =
    nameInput || user?.displayName || user?.email?.split("@")[0] || "User";
  const avatarUrl = avatarInput || user?.photoURL;

  useEffect(() => {
    api
      .get("/customer/bookings")
      .then((res) => setBookings(Array.isArray(res.data) ? res.data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoadingDrivers(false));
  }, []);

  const drivers = useMemo(() => {
    const map = new Map();
    (bookings || []).forEach((b) => {
      const d = b.driver;
      if (!d?._id) return;
      const key = d._id.toString();
      const existing = map.get(key) || {
        id: key,
        name: d.name || "Driver",
        phone: d.phone || "",
        trips: 0,
        lastRoute: "",
        lastDate: null,
      };

      const createdAt = b.createdAt ? new Date(b.createdAt) : null;
      const route =
        b.from && b.to ? `${b.from} → ${b.to}` : existing.lastRoute || "";

      const newer =
        createdAt && (!existing.lastDate || createdAt > existing.lastDate);

      map.set(key, {
        ...existing,
        trips: existing.trips + 1,
        lastRoute: newer && route ? route : existing.lastRoute,
        lastDate: newer ? createdAt : existing.lastDate,
      });
    });

    return Array.from(map.values()).sort((a, b) => {
      if (a.trips !== b.trips) return b.trips - a.trips;
      if (a.lastDate && b.lastDate) return b.lastDate - a.lastDate;
      if (a.lastDate) return -1;
      if (b.lastDate) return 1;
      return 0;
    });
  }, [bookings]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveMessage("");
    try {
      await api.put("/auth/profile", {
        name: nameInput || undefined,
      });
      if (avatarInput) {
        localStorage.setItem("avatarUrl", avatarInput);
      } else {
        localStorage.removeItem("avatarUrl");
      }
      setSaveMessage("Profile updated.");
    } catch (err) {
      setSaveMessage(
        err.response?.data?.message || "Failed to update profile.",
      );
    } finally {
      setSavingProfile(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-content">
        {/* Hero / Header */}
        <header className="profile-hero">
          <div className="profile-hero-bg" aria-hidden="true" />
          <div className="profile-hero-inner">
            <div className="profile-avatar" aria-hidden="true">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="profile-avatar-img" />
              ) : (
                <span className="profile-avatar-initial">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="profile-hero-text">
              <h1 className="profile-name">{displayName}</h1>
              <p className="profile-email">{user?.email}</p>
              <span className="profile-role-badge">{role}</span>
            </div>
          </div>
        </header>

        {/* Account info card */}
        <section className="profile-section">
          <h2 className="profile-section-title">Account Information</h2>
          <div className="profile-card profile-card-info">
            <dl className="profile-info-list">
              <div className="profile-info-row">
                <dt>Email</dt>
                <dd>{user?.email ?? "—"}</dd>
              </div>
              <div className="profile-info-row">
                <dt>Role</dt>
                <dd className="profile-info-value-cap">{role}</dd>
              </div>
              <div className="profile-info-row">
                <dt>Status</dt>
                <dd>
                  <span className="profile-status-dot" aria-hidden="true" />
                  Active
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Edit profile */}
        <section className="profile-section">
          <h2 className="profile-section-title">Edit Profile</h2>
          <form
            className="profile-card profile-edit-card"
            onSubmit={handleSaveProfile}
          >
            <div className="form-row">
              <div className="stack">
                <label className="label">Display name</label>
                <input
                  className="input"
                  placeholder="Your name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>
              <div className="stack">
                <label className="label">Profile picture URL</label>
                <input
                  className="input"
                  placeholder="https://..."
                  value={avatarInput}
                  onChange={(e) => setAvatarInput(e.target.value)}
                />
              </div>
            </div>
            <div className="profile-edit-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={savingProfile}
              >
                {savingProfile ? "Saving..." : "Save changes"}
              </button>
              {saveMessage && (
                <span className="profile-edit-message">{saveMessage}</span>
              )}
            </div>
          </form>
        </section>

        {/* Quick stats grid */}
        <section className="profile-section">
          <h2 className="profile-section-title">Overview</h2>
          <div className="profile-stats-grid">
            {stats.map((item) => (
              <div key={item.label} className="profile-stat-card">
                <span className="profile-stat-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <div className="profile-stat-body">
                  <span className="profile-stat-value">{item.value}</span>
                  <span className="profile-stat-label">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Past driver contacts */}
        <section className="profile-section">
          <h2 className="profile-section-title">Drivers you worked with</h2>
          {loadingDrivers ? (
            <div className="profile-card">
              <p className="text-muted" style={{ margin: 0 }}>
                Loading driver information...
              </p>
            </div>
          ) : drivers.length === 0 ? (
            <div className="profile-card">
              <p style={{ margin: 0, fontWeight: 600 }}>No drivers yet</p>
              <p className="text-muted" style={{ margin: "6px 0 0" }}>
                Once you complete shipments, the drivers you work with will
                appear here.
              </p>
            </div>
          ) : (
            <div className="profile-drivers-grid">
              {drivers.map((d) => (
                <div key={d.id} className="profile-driver-card">
                  <div className="profile-driver-main">
                    <div className="profile-driver-avatar" aria-hidden="true">
                      {d.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-driver-text">
                      <div className="profile-driver-name">{d.name}</div>
                      {d.phone && (
                        <div className="profile-driver-phone text-muted">
                          {d.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="profile-driver-meta">
                    <span className="profile-driver-trips">
                      {d.trips} trip{d.trips !== 1 ? "s" : ""}
                    </span>
                    {d.lastRoute && (
                      <span className="profile-driver-route text-muted">
                        Last: {d.lastRoute}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
