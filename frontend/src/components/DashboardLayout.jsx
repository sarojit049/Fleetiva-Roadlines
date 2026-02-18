import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { safeStorage } from "../utils/storage";

const navItems = {
    admin: [
        { to: "/admin", icon: "📊", label: "Dashboard" },
        { to: "/stats", icon: "📈", label: "Statistics" },
        { to: "/profile", icon: "👤", label: "Profile" },
    ],
    customer: [
        { to: "/dashboard", icon: "📊", label: "Dashboard" },
        { to: "/post-load", icon: "📦", label: "Post Load" },
        { to: "/my-loads", icon: "🚚", label: "My Loads" },
        { to: "/stats", icon: "📈", label: "Statistics" },
        { to: "/profile", icon: "👤", label: "Profile" },
    ],
    driver: [
        { to: "/driver", icon: "📊", label: "Dashboard" },
        { to: "/post-truck", icon: "🚛", label: "Post Truck" },
        { to: "/my-trucks", icon: "🚚", label: "My Trucks" },
        { to: "/stats", icon: "📈", label: "Statistics" },
        { to: "/profile", icon: "👤", label: "Profile" },
    ],
    superadmin: [
        { to: "/superadmin", icon: "🏢", label: "Companies" },
        { to: "/superadmin/logs", icon: "📋", label: "System Logs" },
        { to: "/stats", icon: "📈", label: "Statistics" },
        { to: "/profile", icon: "👤", label: "Profile" },
    ],
};

export default function DashboardLayout({ children }) {
    const { user, logout } = useContext(AppContext);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const role = user?.role || safeStorage.get("role") || "customer";
    const items = navItems[role] || navItems.customer;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="dash-layout">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`dash-sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="dash-sidebar-header">
                    <NavLink to="/" className="dash-sidebar-brand">
                        <span aria-hidden>🚚</span>
                        <span>Fleetiva</span>
                    </NavLink>
                    <button
                        className="dash-sidebar-close"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close sidebar"
                    >
                        ✕
                    </button>
                </div>

                <nav className="dash-sidebar-nav">
                    {items.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end
                            className={({ isActive }) =>
                                `dash-sidebar-link ${isActive ? "active" : ""}`
                            }
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="dash-sidebar-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="dash-sidebar-footer">
                    <div className="dash-sidebar-user">
                        <div className="dash-sidebar-avatar">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="dash-sidebar-user-info">
                            <span className="dash-sidebar-user-name">{user?.name || "User"}</span>
                            <span className="dash-sidebar-user-role">{role}</span>
                        </div>
                    </div>
                    <button className="dash-sidebar-logout" onClick={handleLogout}>
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* Main area */}
            <main className="dash-main">
                {/* Top bar for mobile */}
                <div className="dash-topbar">
                    <button
                        className="dash-hamburger"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open sidebar"
                    >
                        ☰
                    </button>
                    <span className="dash-topbar-brand">Fleetiva Roadlines</span>
                    <div className="dash-topbar-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                </div>

                <div className="dash-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
